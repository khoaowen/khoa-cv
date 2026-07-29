// Render contract: source checks alone cannot prove that the public pages
// still expose the intended CV content. Check both locale entry pages after
// Astro has built them, before PDFs are generated.
import { readFile } from 'node:fs/promises';

const PAGES = [
  {
    file: 'dist/index.html',
    label: 'English site',
    certification: 'AI Engineering Specialization',
    issuer: 'ByteByteGo',
    date: 'Dec 2025',
  },
  {
    file: 'dist/fr/index.html',
    label: 'French site',
    certification: 'AI Engineering Specialization',
    issuer: 'ByteByteGo',
    date: 'Déc. 2025',
  },
];

let violations = 0;
for (const { file, label, certification, issuer, date } of PAGES) {
  const html = await readFile(file, 'utf8');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const certificationCount = text.split(certification).length - 1;
  const expected = [certification, issuer, date];
  const missing = expected.filter((value) => !text.includes(value));

  if (certificationCount !== 1 || missing.length > 0) {
    console.error(
      `✗ ${label} render drift: certification count=${certificationCount}; ` +
        `missing=${missing.length ? missing.join(', ') : 'none'}.`,
    );
    violations++;
  } else {
    console.log(`✓ ${label} render contract is intact.`);
  }
}

if (violations > 0) {
  console.error(`\nRendered CV check failed: ${violations} locale(s) drifted from the content contract.`);
  process.exit(1);
}
