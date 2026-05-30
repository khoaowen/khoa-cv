// Generate recruiter-ready PDFs from the built print routes.
// Renders dist/cv-print/ -> dist/cv-en.pdf and dist/fr/cv-print/ -> dist/cv-fr.pdf.
// Run after `astro build` (the print routes and bundled CSS must exist in dist/).
import { createServer } from 'node:http';
import { readFile, stat, access } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { chromium } from 'playwright';

const DIST = new URL('../dist/', import.meta.url).pathname;

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

async function main() {
  // Sanity check: dist/ built?
  try {
    await access(join(DIST, 'index.html'));
  } catch {
    throw new Error('dist/ not found. Run `npm run build` before generating PDFs.');
  }

  const { server, port } = await startServer();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const { route, out } of TARGETS) {
      const url = `http://127.0.0.1:${port}${route}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      const outPath = join(DIST, out);
      await page.pdf({
        path: outPath,
        printBackground: true,
        preferCSSPageSize: true, // honor @page { size: A4; margin } from print.css
      });
      const { size } = await stat(outPath);
      console.log(`✓ ${out} (${(size / 1024).toFixed(0)} KB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
