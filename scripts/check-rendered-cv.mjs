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
  {
    file: 'dist/dossier-print/index.html',
    label: 'English skills dossier',
    certification: 'AI Engineering Specialization',
    issuer: 'ByteByteGo',
    date: 'Dec 2025',
  },
  {
    file: 'dist/fr/dossier-print/index.html',
    label: 'French skills dossier',
    certification: 'AI Engineering Specialization',
    issuer: 'ByteByteGo',
    date: 'Déc. 2025',
  },
  {
    file: 'dist/cv-print/index.html',
    label: 'English concise PDF source',
    certification: 'AI Engineering Specialization',
    issuer: 'ByteByteGo',
    date: 'Dec 2025',
  },
  {
    file: 'dist/fr/cv-print/index.html',
    label: 'French concise PDF source',
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
  const issuedAt = [...html.matchAll(/data-issued-at="(\d{4}-(?:0[1-9]|1[0-2]))"/g)].map((m) => m[1]);
  const sortedNewestFirst = issuedAt.every((value, index) => index === 0 || issuedAt[index - 1] >= value);
  const hasSkills = html.includes('id="skills"');
  const hasSoftSkills = html.includes('id="soft-skills"');

  if (certificationCount !== 1 || missing.length > 0 || issuedAt.length === 0 || !sortedNewestFirst || !hasSkills || !hasSoftSkills) {
    console.error(
      `✗ ${label} render drift: certification count=${certificationCount}; ` +
        `missing=${missing.length ? missing.join(', ') : 'none'}; newest-first=${sortedNewestFirst}; ` +
        `skills=${hasSkills}; soft-skills=${hasSoftSkills}.`,
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
