// Fail closed if any non-PDF deployable asset contains private contact
// sentinels sourced from both locale files. This check consumes dist/, exactly
// the directory configured for Wrangler and artifact upload.
import { readFile, access } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { RELEASE_DIR, isPrivateRoute } from './paths.mjs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { SOURCE_FILES, loadSentinels, containsSentinel, filesUnder, scanNonPdf } from './sentinels.mjs';

const sentinels = await loadSentinels();
if (!sentinels.length) {
  console.error('✗ No private contact sentinels found in either locale; refusing unverifiable release.');
  process.exit(1);
}

async function readPdf(path) {
  const data = new Uint8Array(await readFile(path));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const meta = await doc.getMetadata();
  const metadata = JSON.stringify(meta.info ?? {}) + (meta.metadata ? meta.metadata.getRaw() : '');
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => 'str' in item ? item.str : '').join(' '));
  }
  return { text: pages.join('\n'), metadata };
}

const files = await filesUnder(RELEASE_DIR);
if (!files.length) throw new Error('Release payload dist/ is missing or empty.');
const forbidden = await scanNonPdf(RELEASE_DIR, files, sentinels);
for (const name of files) {
  if (isPrivateRoute(name)) forbidden.push(`${name} (private print route)`);
}
if (forbidden.length) {
  console.error(`✗ Private data found in non-PDF release assets:\n${forbidden.map(x => `  - ${x}`).join('\n')}`);
  process.exit(1);
}

const pdfs = ['cv-en.pdf', 'cv-fr.pdf', 'dossier-competences-en.pdf', 'dossier-competences-fr.pdf'];
for (const name of pdfs) {
  if (!files.includes(name)) throw new Error(`Required PDF missing from release: ${name}`);
  const { text, metadata } = await readPdf(join(RELEASE_DIR, name));
  const locale = name.endsWith('-fr.pdf') ? SOURCE_FILES[1] : SOURCE_FILES[0];
  for (const sentinel of sentinels.filter(item => item.file === locale)) {
    if (!containsSentinel(text, { all: sentinel.variants.slice(0, 1) })) throw new Error(`${name} is missing an expected private contact from ${locale}.`);
  }
  for (const sentinel of sentinels) {
    if (containsSentinel(metadata, sentinel)) throw new Error(`${name} metadata contains a private contact (${sentinel.file} ${sentinel.kind}).`);
  }
  if (/\b0[1-9](?:[ .-]?\d{2}){4}\b|\+\d{1,3}(?:[ .-]?\d){7,}/.test(text)) {
    throw new Error(`${name} contains a phone-like value.`);
  }
}

// Also guard against the private build accidentally being configured for upload.
try { await access('wrangler.jsonc'); }
catch { throw new Error('wrangler.jsonc not found in the working directory; cannot verify assets.directory. Run from the repo root.'); }
const wrangler = await readFile('wrangler.jsonc', 'utf8');
if (!/"directory"\s*:\s*"\.\/dist\//.test(wrangler) || /\.private-build/.test(wrangler)) {
  throw new Error('Wrangler assets.directory must point only to ./dist/.');
}
console.log(`✓ Release privacy assertion passed: ${files.length} deployable files; ${pdfs.length} PDFs contain expected locale contacts; non-PDF assets are contact-free.`);
