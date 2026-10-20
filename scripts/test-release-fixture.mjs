// Clean-build fixture with SYNTHETIC private contacts (never the real YAML ones).
// Copies the repo to a temp dir, swaps basics.private in both locales for
// per-locale sentinels, runs the real pipeline (astro build -> assemble ->
// PDFs -> check-release), then independently verifies:
//   - each of the four PDFs carries its own locale's sentinels (and not the other's)
//   - no non-PDF asset in dist/ carries any sentinel (incl. street-line fragment, case-insensitive)
//   - negative cases: planted contacts (full, upper-cased, street-fragment-only)
//     in dist/ make check-release exit non-zero; a new print-named route is rejected.
// Only target names and exit codes are logged.
import { cp, mkdtemp, rm, readFile, writeFile, mkdir, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './paths.mjs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { loadSentinels, filesUnder, scanNonPdf, containsSentinel } from './sentinels.mjs';

const SYN = {
  en: { email: 'sentinel-en.7q3x@example.invalid', address: '4242 Sentinel Quay, 99999 Syntheville' },
  fr: { email: 'sentinel-fr.9k2m@example.invalid', address: '4343 Quai Sentinelle, 88888 Synthéville' },
};
const SKIP = new Set(['node_modules', 'dist', '.private-build', '.astro', '.wrangler', '.git', '_bmad-output', '_bmad', '.agents', '.claude']);
const tmp = await mkdtemp(join(tmpdir(), 'cv-fixture-'));
const results = [];
const step = (name, ok) => { results.push([name, ok]); console.log(`${ok ? '✓' : '✗'} fixture: ${name}`); if (!ok) throw new Error(`fixture target failed: ${name}`); };
const run = (name, args, env = {}) => {
  const r = spawnSync(args[0], args.slice(1), { cwd: tmp, encoding: 'utf8', env: { ...process.env, ...env } });
  console.log(`  [${name}] exit=${r.status}`);
  return r;
};

try {
  await cp(ROOT, tmp, { recursive: true, filter: (src) => !SKIP.has(relative(ROOT, src).split(sep)[0]) });
  await symlink(join(ROOT, 'node_modules'), join(tmp, 'node_modules'));
  for (const lang of ['en', 'fr']) {
    const f = join(tmp, `src/content/cv/${lang}.yaml`);
    const y = await readFile(f, 'utf8');
    const block = `  private:\n    email: ${SYN[lang].email}\n    address: "${SYN[lang].address}"\n`;
    const re = /^  private:\s*\n(?:    .*\n?)*/m;
    if (!re.test(y)) throw new Error(`fixture: no basics.private block in ${lang}.yaml to replace`);
    const next = y.replace(re, block);
    await writeFile(f, next);
  }
  process.chdir(tmp);
  const sentinels = await loadSentinels();
  step('4 synthetic sentinels (email+address x2 locales)', sentinels.length === 4 && sentinels.every((s) => /sentinel/i.test(s.value)));

  step('astro build', run('astro build', ['npx', 'astro', 'build']).status === 0);
  step('assemble-release', run('assemble-release', [process.execPath, 'scripts/assemble-release.mjs']).status === 0);
  step('gen-pdf (includes check-release)', run('gen-pdf', [process.execPath, 'scripts/gen-pdf.mjs']).status === 0);

  const dist = join(tmp, 'dist');
  const files = await filesUnder(dist);
  step('non-PDF assets contain no sentinel', (await scanNonPdf(dist, files, sentinels)).length === 0);

  for (const [name, lang] of [['cv-en.pdf', 'en'], ['cv-fr.pdf', 'fr'], ['dossier-competences-en.pdf', 'en'], ['dossier-competences-fr.pdf', 'fr']]) {
    const doc = await getDocument({ data: new Uint8Array(await readFile(join(dist, name))), useSystemFonts: true }).promise;
    let text = '';
    for (let n = 1; n <= doc.numPages; n++) text += (await (await doc.getPage(n)).getTextContent()).items.map((i) => i.str ?? '').join(' ') + '\n';
    const own = sentinels.filter((s) => s.file.endsWith(`/${lang}.yaml`));
    const other = sentinels.filter((s) => !s.file.endsWith(`/${lang}.yaml`));
    step(`${name} carries its ${lang} sentinels only`, own.length === 2 && own.every((s) => containsSentinel(text, { all: s.variants.slice(0, 1) })) && !other.some((s) => containsSentinel(text, s)));
  }

  // Negative fixtures: each planted file must make check-release fail.
  const planted = [
    ['full email', SYN.en.email],
    ['upper-cased email', SYN.fr.email.toUpperCase()],
    ['street line only', 'Visit 4343 Quai Sentinelle today'],
    ['base64 email', Buffer.from(SYN.en.email).toString('base64')],
  ];
  for (const [label, content] of planted) {
    const p = join(dist, '.probe.html');
    await writeFile(p, `<html>${content}</html>`);
    const r = run(`negative: ${label}`, [process.execPath, 'scripts/check-release.mjs']);
    await rm(p, { force: true });
    step(`negative fixture rejected: ${label}`, r.status !== 0);
  }
  await mkdir(join(dist, 'resume-print'), { recursive: true });
  await writeFile(join(dist, 'resume-print/index.html'), '<html>clean</html>');
  const r = run('negative: new print-named route', [process.execPath, 'scripts/check-release.mjs']);
  await rm(join(dist, 'resume-print'), { recursive: true, force: true });
  step('negative fixture rejected: new print-named route', r.status !== 0);

  const final = run('check-release (clean dist)', [process.execPath, 'scripts/check-release.mjs']);
  step('check-release passes on clean dist', final.status === 0);
} finally {
  process.chdir(ROOT);
  await rm(tmp, { recursive: true, force: true });
}
console.log(`fixture targets: ${results.length} passed`);
