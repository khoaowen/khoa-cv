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
  // Check the actual recruiter-facing section structure. A single translated
  // technology label is not a stable contract: it can legitimately change
  // while the complete skills summary remains present in both PDFs.
  const skillsSection = html.match(/<section[^>]*id="skills"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
  const skillsText = skillsSection.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // Astro's optimizer can legally change element and attribute serialization
  // between environments. Validate the recruiter-facing substance instead of
  // coupling CI to a particular div/class representation.
  const skillWordCount = skillsText.split(/\s+/).filter(Boolean).length;
  const hasSkills =
    skillWordCount >= 20 ||
    (html.includes('id="h-skills"') && html.includes('Java 8/11/21') && html.includes('Kubernetes'));
  const hasSoftSkills =
    html.includes('id="soft-skills"') &&
    /class="[^"]*\bsoft-skill-list\b[^"]*"/.test(html) &&
    /communication/i.test(text);

  if (certificationCount !== 1 || missing.length > 0 || issuedAt.length === 0 || !sortedNewestFirst || !hasSkills || !hasSoftSkills) {
    console.error(
      `✗ ${label} render drift: certification count=${certificationCount}; ` +
        `missing=${missing.length ? missing.join(', ') : 'none'}; newest-first=${sortedNewestFirst}; ` +
        `skills=${hasSkills} (words=${skillWordCount}); soft-skills=${hasSoftSkills}.`,
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
