// Shared private-contact sentinel loading and scanning (used by assemble-release
// and check-release). Sentinels come from the `basics.private` block of each
// locale YAML in the CURRENT working tree, so the synthetic fixture
// (test-release-fixture.mjs) exercises the exact same code with fake contacts.
// Values are never printed.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';

export const SOURCE_FILES = ['src/content/cv/en.yaml', 'src/content/cv/fr.yaml'];

const escapeHtml = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Text encodings are case-insensitive; Base64 is case-sensitive.
export function contactVariants(value) {
  return [...new Set([
    value, encodeURIComponent(value), encodeURI(value), escapeHtml(value),
    value.replace(/\s+/g, ' '),
  ].map((v) => v.toLowerCase()))].filter(Boolean);
}

export function base64Variant(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

// Address fragments (e.g. the street line alone). Only fragments that mix a
// digit and a letter are used, so generic words like a city/country that also
// appear in the public location do not cause false positives.
export function addressFragments(address) {
  return address.split(/[,;\n|]|\s[-–—]\s/).map((f) => f.trim())
    .filter((f) => f.length >= 6 && /\d/.test(f) && /[a-z]/i.test(f));
}

export async function loadSentinels() {
  const sentinels = [];
  for (const file of SOURCE_FILES) {
    const text = await readFile(file, 'utf8');
    let data;
    try { data = parse(text); } catch { throw new Error(`Cannot parse private-contact source: ${file}`); }
    const priv = data?.basics?.private;
    if (!priv || typeof priv !== 'object' || Array.isArray(priv)) throw new Error(`Missing or invalid basics.private in ${file}`);
    if (!Object.hasOwn(priv, 'email') && !Object.hasOwn(priv, 'address')) throw new Error(`No private contacts in ${file}`);
    for (const kind of ['email', 'address']) {
      if (!Object.hasOwn(priv, kind)) continue;
      const value = priv[kind];
      if (typeof value !== 'string' || !value.trim()) throw new Error(`Invalid basics.private.${kind} in ${file}`);
      const clean = value.trim();
      const variants = contactVariants(clean);
      const extra = kind === 'address' ? addressFragments(clean).flatMap(contactVariants) : [];
      sentinels.push({ file, kind, value: clean, variants, base64: base64Variant(clean), all: [...new Set([...variants, ...extra])] });
    }
  }
  return sentinels;
}

export const containsSentinel = (text, sentinel) => {
  const hay = text.toLowerCase();
  const squashed = hay.replace(/\s+/g, ' ');
  return sentinel.all.some((v) => hay.includes(v) || squashed.includes(v))
    || (sentinel.base64 != null && text.includes(sentinel.base64));
};

export async function filesUnder(dir, prefix = '') {
  let entries;
  try { entries = await readdir(join(dir, prefix), { withFileTypes: true }); }
  catch { return []; }
  const out = [];
  for (const entry of entries) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...await filesUnder(dir, name));
    else if (entry.isFile()) out.push(name);
  }
  return out;
}

// Returns labels (never values) of non-PDF files carrying a contact.
export async function scanNonPdf(dir, files, sentinels) {
  const hits = [];
  for (const name of files) {
    if (name.toLowerCase().endsWith('.pdf')) continue;
    const text = (await readFile(join(dir, name))).toString('utf8');
    for (const s of sentinels) if (containsSentinel(text, s)) hits.push(`${name} (${s.file} private ${s.kind})`);
  }
  return hits;
}
