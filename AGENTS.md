# Agent & contributor guide — khoa-cv

> Canonical instructions for **any** agent or human editing this repo
> (Codex, Claude, Cursor, etc.). `CLAUDE.md` and `README.md` point here.
> **Read this file before making changes.**

Bilingual (EN/FR) CV website built with Astro, deployed to Cloudflare Workers
(static assets). Live: https://khoa-cv.khoaowen2510.workers.dev

## How to update the CV

The **only files you normally edit** are the content YAMLs:

- `src/content/cv/en.yaml` — English CV
- `src/content/cv/fr.yaml` — French CV

Both follow the schema in `src/content.config.ts` (Zod). Edit a value, commit,
and push to `main`. CI then validates → builds → regenerates the PDFs → deploys.
**Invalid edits fail CI and do not deploy** — that is the guardrail.

When updating one language, update the other to keep them in sync.

## Hard rules (enforced by CI — do not attempt to bypass)

- **Never add a phone number** anywhere — not in YAML, the page, or the PDF.
  A CI check (`scripts/check-content.mjs`) fails the build if a phone-like
  pattern appears in the content files.
- `basics.private` (email/address) appears **only in the downloadable PDF**,
  never on the public web page. Keep it that way.
- Do not commit secrets. Cloudflare credentials live in GitHub Actions secrets,
  never in the repo or on any bot/VM.
- Keep the site JavaScript-free (CSP is `script-src 'none'`).

## Schema quick reference

`basics` (name, role, location, summary, links{linkedin, website?, github?},
private{email?, address?}), then arrays: `work[]`, `education[]`, `skills[]`,
`projects[]`, `languages[]`, `certifications[]`. See `src/content.config.ts`
for exact fields and validation.

- For a current job, set `end: ""` (renders as "Present" / "Présent").
- Set `condensed: true` on a `work` entry to show it compactly under "Earlier
  experience" **in the PDF only** (keeps the PDF to ~2 pages); the web page
  always shows the full entry.
- In French, quote any list item containing ` : ` (colon-space) or YAML will
  misparse it as a mapping.

## Verify locally before pushing

```bash
npm install
npm run dev        # EN at /, FR at /fr/, print previews at /cv-print/ and /fr/cv-print/
npm run build:all  # validate + build + generate PDFs into dist/
```

## Architecture (where things live)

- `src/layouts/Base.astro` — public web shell (header, toolbar, SEO/OG, footer).
- `src/layouts/PrintLayout.astro` — A4 PDF layout; renders email/address.
- `src/components/CvSections.astro` — sections shared by web and print
  (`variant="print"` condenses flagged roles).
- `src/components/LangToggle.astro` — EN/FR switch (pure links, no JS).
- `src/i18n/ui.ts` — UI label translations (not CV data).
- `scripts/gen-pdf.mjs` — renders print routes to PDFs (Playwright).
- `scripts/check-content.mjs` — CI guard: rejects phone-like patterns.
- `public/_headers` — Cloudflare security headers + CSP.
- `.github/workflows/deploy.yml` — build + PDFs + `wrangler deploy` on push to main.
