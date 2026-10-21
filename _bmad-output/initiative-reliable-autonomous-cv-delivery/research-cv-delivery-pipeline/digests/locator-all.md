# Locator — all committed areas

Ref: `d515274f1802ea5715c3ce3a2eaa34ce6a5fb308` (`d515274`). Evidence obtained with `git ls-tree` and `git grep -n -p` at that ref, not working files. Scope: top-level, `.github`, `scripts`, `src`, `public`; excluded `_bmad/`, `_bmad-output/`, `.agents/`, `.claude/`, `.pi/`, and plans/specs/tickets. Parentheses below name symbols or nearest headings. Committed documentation is marked as documentation, not proof of remote settings.

## Q1 — YAML → branch → deployment

- `AGENTS.md:23 (Contribution flow autonomous) @ d515274` — documented branch → bilingual YAML edit → commit/push → PR → squash auto-merge → deployment; lists required checks and admin emergency exception at lines 25–43.
- `src/content/cv/en.yaml:3 (CV CONTENT ENGLISH) @ d515274`; `src/content/cv/fr.yaml:3 (CONTENU DU CV FRANÇAIS) @ d515274` — two locale sources for web/PDF.
- `src/content.config.ts:22 (cv) @ d515274` — glob loads YAML collection; schema; collection export at line 131.
- Six route files load collection entries: `src/pages/index.astro:6 (entry) @ d515274`, `src/pages/fr/index.astro:6 (entry) @ d515274` — public Base/CvSections plus PDF links; `src/pages/cv-print.astro:7 (entry) @ d515274`, `src/pages/fr/cv-print.astro:7 (entry) @ d515274` — PrintLayout/print variant; `src/pages/dossier-print.astro:8 (entry) @ d515274`, `src/pages/fr/dossier-print.astro:7 (entry) @ d515274` — PrintLayout/web variant for full dossiers.
- `.github/workflows/ci.yml:3 (on) @ d515274` — PR and main-push builds; `:35 (build)` invokes build:site; `:61 (pdf-budget)` invokes build:all.
- `package.json:6 (scripts) @ d515274` — build:site = content guard + Astro check/build; build:all adds rendered checks and PDF generation.
- `scripts/gen-pdf.mjs:63 (TARGETS) @ d515274` — four print-route/PDF mappings; `:160 (main) @ d515274` — Chromium rendering, contract assertions, file writes into dist.
- `.github/workflows/deploy.yml:3 (on) @ d515274` — main push or manual dispatch; `:32 (deploy) @ d515274` — npm ci, Chromium install, build:site, pdf, Wrangler deploy (not build:all).
- `astro.config.mjs:26 (defineConfig) @ d515274` — static output; `wrangler.jsonc:3 (name/assets) @ d515274` — khoa-cv Worker serves ./dist assets.

## Q2 — validations/rejection before merge/deploy

- `AGENTS.md:25 (Contribution flow autonomous) @ d515274` — documented five required checks; repository snapshot does not itself establish active branch protection.
- `.github/workflows/ci.yml:17 (build) @ d515274`, `:38 (pdf-budget) @ d515274` — separate build/typecheck and PDF-budget jobs; installs via npm ci; Node 22.
- `src/content.config.ts:20 (yearMonth) @ d515274`, `:22 (cv) @ d515274` — date regex, locale enum, URL/email/type/array validation in build-time collection schema.
- `scripts/check-content.mjs:6 (FILES) @ d515274`, `:10 (PATTERNS) @ d515274` — scans EN/FR YAML for tel URI, international/French phone patterns; `:20 (CERTIFICATION_CONTRACTS) @ d515274`, `:34 (REQUIRED_CERTIFICATIONS) @ d515274`, `:57 (ROLE_CONTRACTS) @ d515274` — exact localized certification blocks, credential history, senior-role titles; `:117 (violations) @ d515274` — nonzero exit.
- `scripts/check-rendered-cv.mjs:38 (PAGES loop) @ d515274` — built-page certification count/content/chronology, skills/soft-skills assertions; `:75 (violations) @ d515274` — nonzero exit.
- `scripts/gen-pdf.mjs:127 (assertPrintContract) @ d515274` — print DOM/content/visibility assertions; `:111 (renderToBudget) @ d515274`, `:199 (main) @ d515274` — page-count fitting and failure exit.
- `.github/workflows/codeql.yml:3 (on) @ d515274`, `:30 (analyze) @ d515274` — PR/main push/Monday cron; JavaScript-TypeScript analysis, build-mode none.
- `.github/workflows/secret-scan.yml:3 (on) @ d515274`, `:26 (gitleaks) @ d515274` — PR/main push/Monday cron; full-history checkout and Gitleaks action.
- `.github/workflows/dependency-review.yml:3 (on) @ d515274`, `:24 (review) @ d515274` — PR dependency review, fails high+ severity, failure comment.
- `.github/workflows/deploy.yml:38 (deploy) @ d515274` — deployment independently repeats build:site and pdf; does not invoke check:rendered (`package.json:11 (scripts) @ d515274`).

## Q3 — credentials/permissions

- `AGENTS.md:41 (Contribution flow autonomous) @ d515274` — documented non-admin repo-scoped editing-bot contents:write/pull-requests:write token; `:52 (Hard rules) @ d515274` — Actions-only deployment credentials policy.
- `.gitignore:6 (Secrets local env) @ d515274` — excludes .env, .env.*, .dev.vars, *.local.
- `README.md:38 (Deploy Cloudflare Workers static assets) @ d515274` — Workers Scripts Edit token and repository secret setup; `SECURITY.md:23 (Secrets and Privacy) @ d515274` instead describes Pages Edit token (documentation differs).
- `.github/workflows/deploy.yml:9 (permissions) @ d515274` — contents read; `:47 (deploy) @ d515274` — CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID secrets supplied to Wrangler.
- `.github/workflows/ci.yml:9 (permissions) @ d515274` — contents read; `.github/workflows/secret-scan.yml:11 (permissions) @ d515274` — contents/PR read, GITHUB_TOKEN env at line 34.
- `.github/workflows/codeql.yml:11 (permissions) @ d515274` — actions/contents read, security-events write.
- `.github/workflows/dependency-review.yml:6 (permissions) @ d515274` — contents read, PR write.
- `.github/workflows/dependabot-auto-merge.yml:4 (on) @ d515274`, `:11 (permissions) @ d515274`, `:24 (auto-merge) @ d515274` — pull_request_target; contents/PR write; actor/draft gate; metadata/gh use GITHUB_TOKEN at lines 33,39,47; no checkout step in workflow.
- `.github/workflows/scorecard.yml:11 (permissions) @ d515274`, `:30 (scorecard) @ d515274` — contents read, id-token/security-events write, checkout persist-credentials false.
- `SECURITY.md:32 (Automated security) @ d515274` — documents native secret scanning/push protection; remote enablement not established by this locator.

## Q4 — privacy/no JavaScript, web/PDF

- `src/content.config.ts:9 (Single source of truth for the CV) @ d515274`, `:36 (cv) @ d515274` — privacy intent and optional email/address private schema; phone rejection implementation is `scripts/check-content.mjs:10 (PATTERNS) @ d515274` (scope: two YAML files, not arbitrary repository/rendered text).
- `src/layouts/Base.astro:18 (title/description) @ d515274`, `:50 (public header) @ d515274` — public name/role/location/LinkedIn and PDF download links; `src/layouts/PrintLayout.astro:18 (contacts) @ d515274` — private email/address explicitly become print contacts; `:42 (contacts map) @ d515274` renders them.
- `src/pages/cv-print.astro:12 (PrintLayout) @ d515274`, `src/pages/dossier-print.astro:13 (PrintLayout) @ d515274` — private-contact layout is also emitted on static print HTML routes (French equivalents cited in Q1); noindex is not access control.
- `src/layouts/PrintLayout.astro:33 (head) @ d515274` — robots noindex; `public/_headers:14 (Print routes) @ d515274`, `public/robots.txt:3 (Disallow) @ d515274` — compact print-route noindex/disallow; `astro.config.mjs:23 (sitemap filter) @ d515274` excludes URLs containing /cv-print, not /dossier-print.
- `public/_headers:4 (all responses) @ d515274` — script-src none, strict self-only styles and additional security headers; `astro.config.mjs:28 (build) @ d515274` — external CSS required to support strict CSP.
- `src/components/LangToggle.astro:11 (locale links) @ d515274` — pure-link switch. No script/client hydration/raw-HTML markers found in scoped search below. Browser-side PDF assertions use JS in build automation (`scripts/gen-pdf.mjs:137 (assertPrintContract) @ d515274`), not shipped application JS.

## Q5 — Dependabot/Scorecard execution

- `.github/dependabot.yml:3 (updates npm) @ d515274` — weekly Monday 06:00 Europe/Paris, root, five-PR cap, Astro/TypeScript groups, deps prefix; `:22 (updates github-actions) @ d515274` — Monday 06:15, five-PR cap, ci prefix.
- `.github/workflows/dependabot-auto-merge.yml:4 (on) @ d515274` — target PR opened/reopened/synchronize/ready_for_review; `:24 (auto-merge) @ d515274` — Dependabot actor, nondraft; `:29 (metadata) @ d515274` — fetch-metadata v3; `:35 (non-major updates) @ d515274` — gh auto/squash/delete-branch; `:42 (major updates) @ d515274` — comment/manual-review path.
- `.github/workflows/scorecard.yml:3 (on) @ d515274` — main push, Monday cron 8 6 * * 1, manual dispatch; `:22 (scorecard) @ d515274` — Ubuntu, 10-minute timeout; `:32 (Run OSSF Scorecard) @ d515274` — ossf/scorecard-action v2.4.4, SARIF file, publish_results false; `:39 (Upload SARIF) @ d515274` — CodeQL upload action. Permissions/credential persistence in Q3.

## Q6 — pipeline/page-budget design locations only

- `src/content.config.ts:4 (Single source of truth for the CV) @ d515274` — build-time schema rationale.
- `AGENTS.md:23 (Contribution flow autonomous) @ d515274`, `:74 (2-page PDF budget enforced) @ d515274` — autonomous merge/check model, readable floor/small-growth rationale.
- `.github/workflows/ci.yml:59 (pdf-budget) @ d515274` — auto-fit then nonzero-block comment.
- `scripts/gen-pdf.mjs:1 (Strategy auto-fit then block) @ d515274`, `:20 (Budget knobs) @ d515274`, `:111 (renderToBudget) @ d515274` — largest fitting scale, floor, page count; `:94 (TARGETS) @ d515274` — full dossier explicitly unbounded; `:188 (main) @ d515274` — overflow diagnostics.
- `src/content.config.ts:60 (cv) @ d515274`, `src/components/CvSections.astro:18 (fullWork/earlierWork) @ d515274` — print-only condensing/exclusion while web stays full.
- `src/pages/dossier-print.astro:6 (Full dossier) @ d515274` — detailed website-parity rationale.
- `src/styles/print.css:12 (@page) @ d515274`, `:61 (section) @ d515274`, `:128 (.condensed-list--with-summaries) @ d515274`, `:192 (.document--dossier) @ d515274` — A4, pagination, compact columns, dossier presentation.
- `scripts/check-content.mjs:18 (Content contract) @ d515274`, `:31 (REQUIRED_CERTIFICATIONS) @ d515274`; `scripts/check-rendered-cv.mjs:1 (Render contract) @ d515274`, `:46 (PAGES loop) @ d515274` — contract rationale, rendering substance rather than serializer coupling.

## Q7 — testing beyond source/build guards

- `scripts/check-rendered-cv.mjs:6 (PAGES) @ d515274` — four built public/dossier HTML targets; `:38 (PAGES loop) @ d515274` — certification uniqueness/presence/ordering and skill structure/content, failing exit at line 77.
- `scripts/gen-pdf.mjs:63 (TARGETS) @ d515274` — per-locale print text/section contracts; `:127 (assertPrintContract) @ d515274` — browser-visible text/count/chronology and computed-style visibility/word-count checks; `:105 (pageCount) @ d515274` — pdf-lib checks generated PDF page count, not PDF text extraction; `:171 (main) @ d515274` — print media emulation then assertions/rendering.
- `package.json:13 (scripts) @ d515274`, `.github/workflows/ci.yml:62 (pdf-budget) @ d515274` — rendered checks and browser/PDF checks run through build:all in CI. Deployment uses separate build:site/pdf sequence, as mapped in Q2.
- `AGENTS.md:88 (Verify locally before pushing) @ d515274` — manual dev/print previews and build:all instructions; `.gitignore:12 (Playwright) @ d515274` — ignored report/result directories, not evidence of an additional test suite.

## Search coverage and no matches

- Tree enumeration: `git ls-tree -r --name-only d515274f1802ea5715c3ce3a2eaa34ce6a5fb308` filtered only excluded path families. Initial ls-tree with exclude magic failed because this command does not support that magic; rerun used output filtering. Searches used ref-pinned `git grep -n -p` with exact paths or negative pathspecs.
- Retrieved workflow/config/script/schema/route lines using `.`; thematic searches: headings, branch/token/secret/Cloudflare/budget/test/private/script/JavaScript/noindex/condens/excludeFromPrint/variant/basics/mailto/pdf/print and @page/size/break/contacts. Broad output was truncated; focused workflow, docs and CSS/contacts searches supplied cited lines.
- No matches at `d515274`: `actionlint|zizmor|shellcheck|workflow_run|needs:|environment:`; `<script|client:|set:html`; `branch_protection|required_status_checks|rulesets`; `vitest|jest|node:test|^[[:space:]]*(describe|test|it)\(`. Scope: all included committed areas, additionally excluding package-lock.json for these searches. An earlier broad test-pattern search matched ordinary regex/string operations and schema describe, not suite definitions.
- Limits: remote branch settings, actual token scopes, workflow results and deployed headers were not queried; no builds/tests/network operations run. No recommendations.
