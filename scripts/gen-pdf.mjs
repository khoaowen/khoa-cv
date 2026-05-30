// Generate recruiter-ready PDFs from the built print routes, with a hard
// 2-page budget per language.
//
// Strategy (auto-fit, then block):
//   - Render at 100% scale. If it exceeds the page budget, shrink the print
//     scale step by step down to a readable floor (default 85%) until it fits.
//   - Pick the LARGEST scale that fits the budget and write that PDF.
//   - If it still overflows at the floor, write the floor version (so dist has
//     a file) and exit non-zero so CI blocks the change.
//
// Run after `astro build` (print routes + bundled CSS must exist in dist/).
import { createServer } from 'node:http';
import { readFile, writeFile, stat, access } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';

const DIST = new URL('../dist/', import.meta.url).pathname;

// Budget knobs (overridable via env for flexibility).
const MAX_PAGES = Number(process.env.CV_MAX_PAGES ?? 2);
const MIN_SCALE = Number(process.env.CV_MIN_SCALE ?? 0.85);
const SCALE_STEP = Number(process.env.CV_SCALE_STEP ?? 0.03);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.json': 'application/json',
};

// Minimal static file server over dist/ so absolute asset paths (/_astro/...) resolve.
function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const filePath = normalize(join(DIST, path));
      if (!filePath.startsWith(normalize(DIST))) {
        res.writeHead(403).end();
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'content-type': MIME[extname(filePath)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

const TARGETS = [
  { route: '/cv-print/', out: 'cv-en.pdf' },
  { route: '/fr/cv-print/', out: 'cv-fr.pdf' },
];

async function pageCount(buffer) {
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}

// Render one route, shrinking scale until it fits the page budget.
async function renderToBudget(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });
  let last = null;
  for (let scale = 1; scale >= MIN_SCALE - 1e-9; scale = Number((scale - SCALE_STEP).toFixed(2))) {
    const buffer = await page.pdf({ printBackground: true, preferCSSPageSize: true, scale });
    const pages = await pageCount(buffer);
    last = { buffer, pages, scale };
    if (pages <= MAX_PAGES) return { ...last, fits: true };
  }
  return { ...last, fits: false }; // floor reached, still over budget
}

async function main() {
  try {
    await access(join(DIST, 'index.html'));
  } catch {
    throw new Error('dist/ not found. Run `npm run build` before generating PDFs.');
  }

  const { server, port } = await startServer();
  const browser = await chromium.launch();
  let failed = false;
  try {
    const page = await browser.newPage();
    for (const { route, out } of TARGETS) {
      const result = await renderToBudget(page, `http://127.0.0.1:${port}${route}`);
      await writeFile(join(DIST, out), result.buffer);
      const pct = Math.round(result.scale * 100);
      if (result.fits) {
        const note = pct < 100 ? ` (auto-fit to ${pct}%)` : '';
        console.log(`✓ ${out} — ${result.pages} page(s)${note}`);
      } else {
        failed = true;
        console.error(
          `✗ ${out} — still ${result.pages} pages at the ${pct}% readable floor ` +
            `(budget is ${MAX_PAGES}). Fix: set \`condensed: true\` on an older work ` +
            `entry, or shorten its highlights, in the matching YAML. See AGENTS.md.`,
        );
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    console.error(`\nPDF page-budget check failed (limit: ${MAX_PAGES} pages).`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
