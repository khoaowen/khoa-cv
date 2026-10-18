# Q4 — Privacy and no-JavaScript enforcement

Source-only findings at **d515274** (full ref d515274f1802ea5715c3ce3a2eaa34ce6a5fb308). Fifteen evidence files inspected using git show/grep; no content YAML contact values read, builds executed, or live pages fetched. **Load-bearing** marks the principal evidence.

## What touches privacy

- `src/content.config.ts:24-42 (cv.schema) @ d515274` defines optional `basics.private.email` (email validation) and `address` (string); no declared phone field. This is a data-shape contract, not access control or a general phone-pattern validator.
- **Load-bearing:** `scripts/check-content.mjs:6-16 (FILES/PATTERNS) @ d515274` scans only EN/FR YAML for `tel:`, international numbers, and French national numbers. `scripts/check-content.mjs:68-84 (phone scan) @ d515274` counts matching lines; read failures are skipped in this loop. `scripts/check-content.mjs:117-122 (violations exit) @ d515274` exits 1 when violations exist. This guards matching phone strings feeding both outputs, not every possible number format or every repository file. Other certification/role checks also contribute to the same failure counter (`scripts/check-content.mjs:86-115 (content contracts) @ d515274`).
- `src/layouts/Base.astro:17-19,27-39 (public metadata) @ d515274` derives metadata from name, role, summary and URL, not private fields. `src/layouts/Base.astro:50-67 (public header) @ d515274` explicitly renders name/role/location, LinkedIn and downloadable PDF links, not private email/address. `src/layouts/Base.astro:72-74 (main slot) @ d515274` delegates page-body rendering; this header alone is not a whole-site leakage test.
- **Load-bearing:** `src/layouts/PrintLayout.astro:18-24 (contacts) @ d515274` adds private email (including mailto href) and address, plus public links/location. `src/layouts/PrintLayout.astro:40-49 (contact rendering) @ d515274` emits these into HTML, not exclusively a PDF binary. `src/layouts/PrintLayout.astro:33 (robots metadata) @ d515274` sets noindex, not authentication.

### All four print callers

Each loads locale content, throws if absent, and passes the whole data object to PrintLayout:

- `src/pages/cv-print.astro:7-14 (EN CV route) @ d515274`: missing-entry throw at 8; CvSections variant print.
- `src/pages/fr/cv-print.astro:7-14 (FR CV route) @ d515274`: missing-entry throw at 8; CvSections variant print.
- `src/pages/dossier-print.astro:8-15 (EN dossier route) @ d515274`: missing-entry throw at 9; CvSections variant web, documentType dossier.
- `src/pages/fr/dossier-print.astro:7-14 (FR dossier route) @ d515274`: missing-entry throw at 8; CvSections variant web, documentType dossier.

Thus all four HTML routes receive the contact-bearing layout, regardless of section variant.

## Generation → deployed assets

- **Load-bearing:** `astro.config.mjs:26 (output) @ d515274` selects static output. The four page definitions above have no route-level serving restriction.
- `scripts/gen-pdf.mjs:18,37-60 (DIST/startServer) @ d515274` serves dist locally on loopback, mapping trailing slash to index.html; normalized paths outside DIST receive 403 and read failures 404. It sets content-type only, not the Cloudflare CSP headers.
- `scripts/gen-pdf.mjs:63-103 (TARGETS) @ d515274` maps the four routes to cv-en.pdf, cv-fr.pdf, dossier-competences-en.pdf and dossier-competences-fr.pdf.
- **Load-bearing:** `scripts/gen-pdf.mjs:160-180 (main) @ d515274` requires dist/index.html, opens each route, checks print contracts, renders and writes PDF files into the same DIST. `scripts/gen-pdf.mjs:194-208 (main cleanup/error handling) @ d515274` closes browser/server and fails on errors; it does not delete print HTML.
- PDF checks reject missing/duplicated required text, absent/out-of-order certification dates and insufficient visible section content (`scripts/gen-pdf.mjs:127-157 (assertPrintContract) @ d515274`). Rendering uses page.pdf (`scripts/gen-pdf.mjs:110-124 (renderToBudget) @ d515274`); CV overflow at the scale floor fails the process, while dossier maxPages is null (`scripts/gen-pdf.mjs:90-102 (TARGETS),199-207 (failure exits) @ d515274`). These are content/layout checks, not private-data or script checks.
- **Load-bearing:** `.github/workflows/deploy.yml:38-50 (deploy steps) @ d515274` runs build:site, then pdf, then wrangler deploy without an intervening HTML-removal step. `wrangler.jsonc:5-8 (assets) @ d515274` deploys ./dist with static HTML handling and no print-route exclusion/access restriction.

**Source consequence:** the print HTML is retained among assets selected for deployment, alongside the contact-bearing downloadable PDFs. “Private” means omitted by the public header and intentionally included in print output; it is not a protected-contact storage boundary. This is not confirmation that a particular live deployment exposes those routes or applies these headers.

## Indexing controls (not serving restrictions)

- `public/_headers:3-12 (global headers) @ d515274` applies a general index/follow header; `public/_headers:14-18 (print overrides) @ d515274` supplies noindex only for the EN/FR **cv-print** patterns.
- `public/robots.txt:1-6 (crawler directives) @ d515274` allows root and disallows only EN/FR cv-print, with a sitemap link.
- `astro.config.mjs:22-23 (sitemap filter) @ d515274` excludes URLs containing /cv-print only.
- Dossier routes lack equivalent header/robots/sitemap exclusions in those files, though both inherit PrintLayout's HTML noindex. None of these mechanisms denies direct retrieval. Header application/conflict resolution on the live platform was not tested.

## What enforces no JavaScript

- **Load-bearing:** `public/_headers:3-4 (global CSP) @ d515274` declares `script-src 'none'` for responses matching /*; this is the explicit browser-side script-execution restriction when applied. It also restricts styles to self, disables objects and framing, and limits other resource sources. This is not a source/build assertion that no JS asset exists, nor a PDF-internal script validator.
- `astro.config.mjs:28-30 (build.inlineStylesheets) @ d515274` forces external CSS, supporting style-src self without unsafe-inline.
- `src/components/LangToggle.astro:11-29 (links/navigation) @ d515274` implements language switching as anchors; `src/layouts/Base.astro:55-67 (toolbar) @ d515274` uses that component and ordinary links/download links. Base and PrintLayout contain no script tags.
- `scripts/gen-pdf.mjs:167-179 (main/browser) @ d515274` creates a Playwright page without disabling JavaScript. Its loopback server does not apply _headers. `scripts/gen-pdf.mjs:137-150 (assertPrintContract) @ d515274` uses evaluateAll for build-time inspection; this is automation, not shipped client interactivity. Therefore the public CSP is not itself enforcement during this PDF-rendering path.

## Search boundaries and gaps

At d515274, git grep for `private|<script|client:|javaScriptEnabled|unlink|rmSync|rmdir|exclude|deny|auth|check-content|build:site|npm run pdf` across the fifteen cited files found private accesses in PrintLayout/schema, build/pdf workflow calls, and an unrelated excludeFromPrint schema flag; no script tags/hydration directives, JavaScript-disable setting, print-HTML deletion, or authentication directive in that scope. Full reads also show no removal/serve restriction in the inspected generation/deploy path.

Budget reached: package script definitions, public page callers, CvSections, CI workflow wiring and possible additional asset-ignore files were not inspected. Consequently the exact npm-script linkage of the phone guard, whole-public-body private-field absence, and any controls outside this scope are not independently established. No built artifacts or live responses were examined. No recommendations.
