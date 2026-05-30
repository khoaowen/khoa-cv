# khoa-cv — agent & contributor guide

Bilingual (EN/FR) CV website built with Astro, deployed to Cloudflare Pages.
This file documents how to safely edit the CV so any human or agent (e.g. a
future Discord bot) can update it.

## How to update the CV

The **only files you normally edit** are the content YAMLs:

- `src/content/cv/en.yaml` — English CV
- `src/content/cv/fr.yaml` — French CV

Both follow the same schema, defined and validated in `src/content.config.ts`
(Zod). Edit a value, commit, and push to `main`. CI then:

1. Validates the YAML against the schema (`astro check`). Invalid edits **fail
   the build and do not deploy** — this is the guardrail.
2. Builds the static site.
3. Regenerates `cv-en.pdf` / `cv-fr.pdf` from the print routes (Playwright).
4. Deploys to Cloudflare Pages.

When updating one language, update the other to keep them in sync.

## Hard rules (privacy)

- **Never add a phone number** anywhere — not in YAML, the page, or the PDF.
- `basics.private` (email/address) appears **only in the downloadable PDF**,
  never on the public web page. Keep it that way.
- Do not commit secrets. Cloudflare credentials live in GitHub Actions secrets.

## Schema quick reference

`basics` (name, role, location, summary, links{linkedin, website?, github?},
private{email?, address?}), then arrays: `work[]`, `education[]`, `skills[]`,
`projects[]`, `languages[]`, `certifications[]`. See `src/content.config.ts`
for exact field names, which are optional, and validation rules (URLs, emails).

For a current job, set `end: ""` (renders as "Present" / "Présent").

## Local development

```bash
npm install
npm run dev        # EN at /, FR at /fr/, print previews at /cv-print/ and /fr/cv-print/
npm run build:all  # validate + build + generate PDFs into dist/
```

## Architecture (where things live)

- `src/layouts/Base.astro` — public web shell (header, toolbar, SEO/OG, footer).
- `src/layouts/PrintLayout.astro` — A4 PDF layout; renders email/address.
- `src/components/CvSections.astro` — section rendering shared by web and print.
- `src/components/LangToggle.astro` — EN/FR switch (pure links, no JS).
- `src/i18n/ui.ts` — UI label translations (not CV data).
- `scripts/gen-pdf.mjs` — renders print routes to PDFs.
- `public/_headers` — Cloudflare security headers + CSP.
- The site ships **no JavaScript**; keep it that way so CSP `script-src 'none'`
  holds.
