// CI guard: fail the build if a phone-like pattern appears in the CV content.
// This enforces the "no phone number anywhere" rule structurally, independent
// of any AGENTS.md / CLAUDE.md docs an editing agent may or may not read.
import { readFile } from 'node:fs/promises';

const FILES = ['src/content/cv/en.yaml', 'src/content/cv/fr.yaml'];

// Conservative patterns that match phone numbers but not normal CV content
// (years, team sizes, "Java 6/8/11/21", date ranges, etc.).
const PATTERNS = [
  { name: 'tel: URI', re: /tel:/i },
  // International: +33 6 12 34 56 78 / +33612345678
  { name: 'international number', re: /\+\d{1,3}(?:[ .\-]?\d){7,}/ },
  // French national: 06 12 34 56 78 / 0612345678 / 01.23.45.67.89
  { name: 'french phone number', re: /\b0[1-9](?:[ .\-]?\d{2}){4}\b/ },
];

let violations = 0;
for (const file of FILES) {
  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch {
    continue; // file may not exist yet
  }
  text.split('\n').forEach((line, i) => {
    for (const { name, re } of PATTERNS) {
      if (re.test(line)) {
        console.error(`✗ ${file}:${i + 1} looks like a phone number (${name}): ${line.trim()}`);
        violations++;
      }
    }
  });
}

if (violations > 0) {
  console.error(
    `\nContent check failed: ${violations} phone-like value(s) found. ` +
      'Phone numbers are not allowed anywhere in this CV (see AGENTS.md).',
  );
  process.exit(1);
}
console.log('✓ Content check passed: no phone numbers found.');
