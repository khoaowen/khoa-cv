// Exercise the exact Wrangler payload over HTTP, then prove the release guard
// rejects a contact-bearing non-PDF asset. Contact values are never logged.
import { readFile, writeFile, rm, access } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { RELEASE_DIR } from './paths.mjs';

try { await access('wrangler.jsonc'); }
catch { throw new Error('wrangler.jsonc not found in the working directory; cannot start the deployment-equivalent static server. Run from the repo root.'); }

const FETCH_TIMEOUT_MS = 10000;
const get = (url) => fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });

const routes = ['cv-print', 'dossier-print', 'fr/cv-print', 'fr/dossier-print'];
const forms = (route) => [`/${route}`, `/${route}/`, `/${route}/index.html`, `/${route}.html`];
const contacts = [];
for (const file of ['src/content/cv/en.yaml', 'src/content/cv/fr.yaml']) {
  const source = await readFile(file, 'utf8');
  const privateBlock = source.match(/^  private:\s*\n((?:    .*\n?)*)/m)?.[1] ?? '';
  for (const match of privateBlock.matchAll(/^    (?:email|address):\s*(.+?)\s*$/gm)) {
    const value = match[1].replace(/^['"]|['"]$/g, '').trim();
    if (value) contacts.push(value);
  }
}
if (!contacts.length) throw new Error('Cannot run negative fixture: private contacts are not configured.');
const probe = join(RELEASE_DIR, '.privacy-regression-probe.html');

const portServer = createServer();
await new Promise((resolve) => portServer.listen(0, '127.0.0.1', resolve));
const port = portServer.address().port;
await new Promise((resolve) => portServer.close(resolve));
const child = spawn('npx', ['wrangler', 'dev', '--ip', '127.0.0.1', '--port', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
child.stdout.on('data', (chunk) => { output += chunk.toString(); });
child.stderr.on('data', (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    try { await get(`http://127.0.0.1:${port}/`); return; } catch { /* not ready */ }
    if (child.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Wrangler static server did not start. ${output.replace(/\s+/g, ' ').slice(-500)}`);
}

try {
  await waitForServer();
  for (const route of routes) for (const path of forms(route)) {
    const response = await get(`http://127.0.0.1:${port}${path}`);
    const body = await response.text();
    if (response.ok) {
      if (!response.headers.get('content-type')?.includes('text/html') || !/<html/i.test(body)) {
        throw new Error(`Unexpected non-HTML response for print route ${path} (${response.status}).`);
      }
      if (contacts.some((contact) => body.toLowerCase().includes(contact.toLowerCase()) || body.toLowerCase().includes(encodeURIComponent(contact).toLowerCase()))) {
        throw new Error(`Private contact found in HTTP response for ${path}.`);
      }
      console.log(`✓ ${path} returns contact-free HTML (${response.status}).`);
    } else {
      console.log(`✓ ${path} returns no private print resource (${response.status}).`);
    }
  }

  await writeFile(probe, `<html>${contacts[0]}</html>`);
  const check = spawnSync(process.execPath, ['scripts/check-release.mjs'], { encoding: 'utf8' });
  await rm(probe, { force: true });
  if (check.status === 0) throw new Error('Release privacy checker accepted a planted contact-bearing asset.');
  if (!/privacy|contact|private/i.test(`${check.stdout}\n${check.stderr}`)) {
    throw new Error('Negative fixture failed for an unrelated reason.');
  }
  console.log('✓ Negative fixture: planted private data in a non-PDF release asset was rejected.');
} finally {
  await rm(probe, { force: true });
  child.kill('SIGTERM');
}
