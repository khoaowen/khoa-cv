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

// Content contract: this certification must remain equivalent in both locales.
// It prevents partial or accidental edits while keeping the localized date format.
const CERTIFICATION_CONTRACTS = [
  {
    file: 'src/content/cv/en.yaml',
    block: '  - name: AI Engineering Specialization\n    issuer: ByteByteGo\n    issuedAt: "2025-12"\n    date: "Dec 2025"',
  },
  {
    file: 'src/content/cv/fr.yaml',
    block: '  - name: AI Engineering Specialization\n    issuer: ByteByteGo\n    issuedAt: "2025-12"\n    date: "Déc. 2025"',
  },
];

// The downloadable CV must retain the complete credential history, not only
// the most recent certification. Keep this list deliberately explicit so a
// future content edit cannot silently collapse it again.
const REQUIRED_CERTIFICATIONS = [
  {
    file: 'src/content/cv/en.yaml',
    names: [
      'AI Engineering Specialization', 'Microsoft Certified: Azure Solutions Architect Expert',
      'Microsoft Certified: Azure Administrator Associate', 'Microsoft Certified: Azure AI Fundamentals',
      'Microsoft Certified: Security, Compliance, and Identity Fundamentals', 'Microsoft Certified: Azure Data Fundamentals',
      'Microsoft Certified: Azure Fundamentals', 'Professional Scrum Master I (PSM I)',
      'Java / JEE Development with Java/JEE frameworks',
    ],
  },
  {
    file: 'src/content/cv/fr.yaml',
    names: [
      'AI Engineering Specialization', 'Microsoft Certified: Azure Solutions Architect Expert',
      'Microsoft Certified: Azure Administrator Associate', 'Microsoft Certified: Azure AI Fundamentals',
      'Microsoft Certified: Security, Compliance, and Identity Fundamentals', 'Microsoft Certified: Azure Data Fundamentals',
      'Microsoft Certified: Azure Fundamentals', 'Professional Scrum Master I (PSM I)',
      'Développement Java / JEE avec les frameworks Java/JEE',
    ],
  },
];

const ROLE_CONTRACTS = [
  { file: 'src/content/cv/en.yaml', company: 'Amundi', position: 'Senior Java Developer' },
  { file: 'src/content/cv/en.yaml', company: 'BVNK', position: 'Senior Java Developer' },
  { file: 'src/content/cv/en.yaml', company: 'ING', position: 'Senior Java Developer' },
  { file: 'src/content/cv/en.yaml', company: 'BNP Paribas CIB (via Meritis)', position: 'Senior Java Developer' },
  { file: 'src/content/cv/fr.yaml', company: 'Amundi', position: 'Développeur Java Senior' },
  { file: 'src/content/cv/fr.yaml', company: 'BVNK', position: 'Développeur Java Senior' },
  { file: 'src/content/cv/fr.yaml', company: 'ING', position: 'Développeur Java Senior' },
  { file: 'src/content/cv/fr.yaml', company: 'BNP Paribas CIB (via Meritis)', position: 'Développeur Java Senior' },
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

for (const { file, block } of CERTIFICATION_CONTRACTS) {
  const text = await readFile(file, 'utf8');
  const occurrences = text.split(block).length - 1;
  if (occurrences !== 1) {
    console.error(
      `✗ ${file} must contain exactly one complete AI Engineering Specialization certification block ` +
        `(found ${occurrences}).`,
    );
    violations++;
  }
}

for (const { file, names } of REQUIRED_CERTIFICATIONS) {
  const text = await readFile(file, 'utf8');
  for (const name of names) {
    if (!text.includes(`name: "${name}"`) && !text.includes(`name: ${name}`)) {
      console.error(`✗ ${file} is missing required certification: ${name}.`);
      violations++;
    }
  }
}

for (const { file, company, position } of ROLE_CONTRACTS) {
  const text = await readFile(file, 'utf8');
  const block = `- company: ${company}\n    position: ${position}`;
  if (!text.includes(block)) {
    console.error(`✗ ${file} must use \"${position}\" for ${company}.`);
    violations++;
  }
}

if (violations > 0) {
  console.error(
    `\nContent check failed: ${violations} contract violation(s) found. ` +
      'Phone numbers are not allowed anywhere in this CV; required content blocks must stay intact.',
  );
  process.exit(1);
}
console.log('✓ Content check passed: no phone numbers; complete certifications and senior-role titles are intact.');
