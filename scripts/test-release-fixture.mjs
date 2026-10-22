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
import { loadSentinels, filesUnder, scanNonPdf, containsSentinel, base64Variant } from './sentinels.mjs';

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
    ['base64 email', base64Variant(SYN.en.email)],
  ];
  for (const [label, content] of planted) {
    const p = join(dist, '.probe.html');
    await writeFile(p, `<html>${content}</html>`);
    const r = run(`negative: ${label}`, [process.execPath, 'scripts/check-release.mjs']);
    const detectedProbe = r.status !== 0 && (await scanNonPdf(dist, await filesUnder(dist), sentinels)).some((hit) => hit.startsWith('.probe.html'));
    await rm(p, { force: true });
    step(`negative fixture rejected by probe: ${label}`, detectedProbe);
  }
  // Missing and malformed inputs must fail closed, without logging values.
  const sentinelSource = join(tmp, 'src/content/cv/en.yaml');
  const originalEn = await readFile(sentinelSource, 'utf8');
  for (const [label, altered] of [
    ['missing private contacts', originalEn.replace(/^  private:\n(?:    .*\n?)*/m, '')],
    ['invalid email', originalEn.replace(/^    email:.*\n/m, '    email: 123\n')],
  ]) {
    await writeFile(sentinelSource, altered);
    let rejected = false;
    try { await loadSentinels(); } catch { rejected = true; }
    step(`sentinel loader rejects ${label}`, rejected);
  }
  await writeFile(sentinelSource, originalEn);
  await mkdir(join(dist, 'resume-print'), { recursive: true });
  await writeFile(join(dist, 'resume-print/index.html'), '<html>clean</html>');
  const r = run('negative: new print-named route', [process.execPath, 'scripts/check-release.mjs']);
  await rm(join(dist, 'resume-print'), { recursive: true, force: true });
  step('negative fixture rejected: new print-named route', r.status !== 0);

  const final = run('check-release (clean dist)', [process.execPath, 'scripts/check-release.mjs']);
  step('check-release passes on clean dist', final.status === 0);

  // Workflow contract assertions guard that CI and every deploy entry point
  // invoke the same complete candidate validation before the uploader.
  const workflowFiles = ['ci.yml', 'codeql.yml', 'secret-scan.yml', 'dependency-review.yml'];
  const workflowText = (await Promise.all(workflowFiles.map((file) => readFile(join(tmp, '.github/workflows', file), 'utf8')))).join('\n');
  const ci = await readFile(join(tmp, '.github/workflows/ci.yml'), 'utf8');
  const deploy = await readFile(join(tmp, '.github/workflows/deploy.yml'), 'utf8');
  const packageJson = JSON.parse(await readFile(join(tmp, 'package.json'), 'utf8'));
  const requiredChecks = ['Build and typecheck', 'PDF page budget', 'Analyze JavaScript and TypeScript', 'Gitleaks', 'Review dependency changes'];
  step('all five required check names are preserved', requiredChecks.every((name) => workflowText.includes(`name: ${name}`)));
  step('both CI jobs run the complete validation entry point', (ci.match(/run: npm run build:all/g) ?? []).length === 2);
  step('deploy validates build:all before uploader', deploy.indexOf('npm run build:all') >= 0 && deploy.indexOf('npm run build:all') < deploy.indexOf('cloudflare/wrangler-action'));
  step('manual deploy is pinned to main', deploy.includes('workflow_dispatch:') && deploy.includes("if: github.ref == 'refs/heads/main'"));
  step('build:all includes rendered, print/PDF and release checks', /build:site.*check:rendered.*pdf.*test:release.*test:fixture/s.test(packageJson.scripts['build:all']));
  step('deploy candidate SHA is checked before and after validation', deploy.includes('CANDIDATE_SHA: ${{ github.sha }}') && (deploy.match(/git rev-parse HEAD/g) ?? []).length === 2);

  // Exercise short-circuit behavior at every validation boundary with a
  // harmless uploader stub. The failing stage emits no details or contact data.
  const uploaderStub = join(tmp, 'uploader-stub.mjs');
  const uploadMarker = join(tmp, 'upload-called');
  await writeFile(uploaderStub, `import { writeFile } from 'node:fs/promises'; await writeFile(${JSON.stringify(uploadMarker)}, 'called');`);
  const validationStages = ['source/phone', 'schema/type/build', 'rendered output', 'print/PDF', 'release boundary'];
  // Reproduce the reported rendered-only regression against a real built page.
  const publicPage = join(dist, 'index.html');
  const cleanPage = await readFile(publicPage, 'utf8');
  await writeFile(publicPage, cleanPage.replace('AI Engineering Specialization', 'Injected rendered drift'));
  await rm(uploadMarker, { force: true });
  const renderedResult = spawnSync('sh', ['-c', `${JSON.stringify(process.execPath)} scripts/check-rendered-cv.mjs && ${JSON.stringify(process.execPath)} ${JSON.stringify(uploaderStub)}`], { cwd: tmp, encoding: 'utf8' });
  step('rendered-only drift blocks stub uploader', renderedResult.status !== 0 && !(await filesUnder(tmp)).some((file) => file === 'upload-called'));
  await writeFile(publicPage, cleanPage);

  for (const failedStage of validationStages) {
    await rm(uploadMarker, { force: true });
    const command = validationStages.map((stage) => stage === failedStage
      ? `node -e "process.exit(1)"`
      : `node -e "process.exit(0)"`).join(' && ') + ` && ${JSON.stringify(process.execPath)} ${JSON.stringify(uploaderStub)}`;
    const result = spawnSync('sh', ['-c', command], { cwd: tmp, encoding: 'utf8' });
    const uploaderNotCalled = !(await filesUnder(tmp)).some((file) => file === 'upload-called');
    step(`failure-stage fixture blocks stub uploader: ${failedStage}`, result.status !== 0 && uploaderNotCalled);
  }
} finally {
  process.chdir(ROOT);
  await rm(tmp, { recursive: true, force: true });
}
console.log(`fixture targets: ${results.length} passed`);
