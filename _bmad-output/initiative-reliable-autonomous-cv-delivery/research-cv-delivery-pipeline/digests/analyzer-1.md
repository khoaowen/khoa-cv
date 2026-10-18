# Q1 — YAML branch → live deployment

Evidence: repository at `d515274` only; 15 existing evidence files inspected. No builds, scripts, working-tree inspection, or remote queries performed.

## Delivery path

1. **[Load-bearing: documented process, not verified remote enforcement]** Update both locale YAMLs, commit/push a branch, open a PR to `main`, and enable squash auto-merge with branch deletion. The guide says merge requires Build and typecheck, PDF page budget, CodeQL, Gitleaks, and dependency review; it also documents emergency administrator direct pushes. These are repository instructions, not proof of GitHub protection settings. `AGENTS.md:14-21 (How to update the CV) @ d515274`; `AGENTS.md:23-43 (Contribution flow autonomous) @ d515274`.
2. **[Load-bearing]** PR creation triggers CI; pushing `main` also triggers CI. Two independent jobs install dependencies with `npm ci` on Node 22: Build and typecheck runs `build:site`; PDF page budget installs Chromium and runs `build:all`. ` .github/workflows/ci.yml:3-7 (on) @ d515274`; `.github/workflows/ci.yml:17-62 (jobs) @ d515274`.
3. **[Load-bearing]** `build:site` runs source-content checks → `astro check` → `astro build`; `build:all` additionally runs rendered-content checks → PDF generation, with `&&` stopping the chain on failure. `package.json:6-13 (scripts) @ d515274`.
   - YAML → collection: `glob('*.yaml', './src/content/cv')` and Zod schema define `cv`. `src/content.config.ts:22-25 (cv) @ d515274`; `src/content.config.ts:131 (collections) @ d515274`.
   - Public EN/FR pages fetch `getEntry('cv', 'en'/'fr')`, pass data to `Base` and `CvSections`, and link the language-specific CV and dossier PDFs. `src/pages/index.astro:6-13 (entry) @ d515274`; `src/pages/fr/index.astro:6-13 (entry) @ d515274`.
   - Compact print pages fetch the same entries and use `PrintLayout` plus `CvSections variant="print"`. `src/pages/cv-print.astro:7-14 (entry) @ d515274`; `src/pages/fr/cv-print.astro:7-14 (entry) @ d515274`.
   - English dossier uses the same entry and `PrintLayout`, but `CvSections variant="web"`. `src/pages/dossier-print.astro:8-15 (entry) @ d515274`.
4. **[Load-bearing]** PDF generation serves `dist` locally, launches Chromium in print mode, checks each print route, renders and writes four PDFs into `dist`: `cv-en.pdf`, `cv-fr.pdf`, and `dossier-competences-en/fr.pdf`. Compact CVs default to two pages, testing scales from 100% to 85% in 3-point decrements; dossiers have no page limit. `scripts/gen-pdf.mjs:18-23 (DIST/MAX_PAGES/MIN_SCALE/SCALE_STEP) @ d515274`; `scripts/gen-pdf.mjs:63-103 (TARGETS) @ d515274`; `scripts/gen-pdf.mjs:111-124 (renderToBudget) @ d515274`; `scripts/gen-pdf.mjs:160-201 (main) @ d515274`.
5. **[Load-bearing]** Push to `main` independently triggers Deploy; manual `workflow_dispatch` is also available. Deploy checks out source, installs dependencies/Chromium, reruns `build:site`, then `pdf`, then invokes `cloudflare/wrangler-action@v4` with `command: deploy` and Cloudflare secrets. It does **not** run `build:all` or `check:rendered`. ` .github/workflows/deploy.yml:3-7 (on) @ d515274`; `.github/workflows/deploy.yml:22-50 (deploy.steps) @ d515274`.
6. Static Astro output is deployed as Worker `khoa-cv` assets from `./dist/`, with trailing-slash HTML handling and a 404 page. The configured site URL is `https://khoa-cv.khoaowen2510.workers.dev`; configuration is not evidence of a successful live release. `astro.config.mjs:6-14 (defineConfig) @ d515274`; `astro.config.mjs:26-30 (output/build) @ d515274`; `wrangler.jsonc:3-8 (name/assets) @ d515274`.

## Rejecting checks on the inspected path

- **Source guard:** rejects `tel:` URIs, international-number patterns, and French-national-number patterns in either YAML; rejects anything other than exactly one required certification block, missing required certification names, or missing exact contracted company/title pairs. Accumulated violations exit 1. The initial phone scan skips unreadable files, but later contract reads are uncaught. `scripts/check-content.mjs:6-16 (FILES/PATTERNS) @ d515274`; `scripts/check-content.mjs:20-66 (CERTIFICATION_CONTRACTS/REQUIRED_CERTIFICATIONS/ROLE_CONTRACTS) @ d515274`; `scripts/check-content.mjs:68-122 (validation loops) @ d515274`.
- **Schema/type/build:** schema rejects wrong types or missing required fields, non-EN/FR `lang`, invalid URLs/email, and certification `issuedAt` not matching `YYYY-MM` with month 01–12; optional/default fields are defined explicitly. Astro check/build failures stop their command chain. `src/content.config.ts:14-128 (dateString/yearMonth/cv.schema) @ d515274`; `package.json:9-13 (scripts) @ d515274`.
- **Route availability:** public EN/FR, compact-print EN/FR, and inspected English dossier routes explicitly throw for missing locale entries. `src/pages/index.astro:6-7 (entry) @ d515274`; `src/pages/fr/index.astro:6-7 (entry) @ d515274`; `src/pages/cv-print.astro:7-8 (entry) @ d515274`; `src/pages/fr/cv-print.astro:7-8 (entry) @ d515274`; `src/pages/dossier-print.astro:8-9 (entry) @ d515274`.
- **Rendered guard, CI PDF job only:** reads both public HTML pages and both dossier-print HTML pages; rejects certification count other than one, missing expected certification/issuer/date, absent or non-descending chronology markers, insufficient hard-skills content, or missing soft-skills structure/communication text; exits 1. Missing HTML reads also fail. `scripts/check-rendered-cv.mjs:6-35 (PAGES) @ d515274`; `scripts/check-rendered-cv.mjs:37-77 (validation loop) @ d515274`.
- **Print guard, CI and deploy:** throws for absent `dist/index.html`; missing required text or non-single anchor; absent or non-descending certification chronology; compact-CV hard skills below one visible row/20 words or soft skills below three visible items/six words. Over-budget compact PDFs are written but produce exit 1; uncaught generation errors also exit 1. `scripts/gen-pdf.mjs:63-103 (TARGETS) @ d515274`; `scripts/gen-pdf.mjs:127-157 (assertPrintContract) @ d515274`; `scripts/gen-pdf.mjs:160-207 (main) @ d515274`. Local serving rejects paths outside `DIST` with 403 and read/request failures with 404. `scripts/gen-pdf.mjs:38-53 (startServer) @ d515274`.
- Dependency installation, browser installation, build/generation, and deployment are sequential workflow steps; failures prevent reaching later steps. CI timeouts are 10/12 minutes; deploy timeout is 15 minutes. ` .github/workflows/ci.yml:17-62 (jobs) @ d515274`; `.github/workflows/deploy.yml:17-50 (deploy) @ d515274`.

## Gaps / boundaries

- At `d515274`, `git grep -n -E 'needs:|workflow_run|check:rendered|environment:|branches:' -- .github/workflows/ci.yml .github/workflows/deploy.yml package.json` found no `needs`, `workflow_run`, or environment declaration in those workflows. Deploy is push/manual-triggered, not explicitly chained to successful post-merge CI. Rendered checks occur in `build:all`, not in Deploy's commands.
- Branch protection, required-check settings, auto-merge enablement, credentials, actual check outcomes, and live deployment success were not remotely verified. Additional security/dependency workflow implementations were not inspected; their names above come only from the contribution guide.
- Evidence budget reached: French dossier route implementation, shared layouts/components, security workflows, and content values remain uninspected. The four dossier/public outputs and both dossier PDF targets are evidenced by their checker/target declarations, not a full rendering trace. An attempted `git show` of `src/pages/dossier.astro` found no such path; the inspected English route is `src/pages/dossier-print.astro`.

```acceptance-report
{
  "criteriaSatisfied": [{"id":"criterion-1","status":"satisfied","evidence":"Q1 digest traces documented branch/PR flow, CI, schema/routes, PDF generation and deployment with commit-line citations and explicit gaps."}],
  "changedFiles": ["_bmad-output/initiative-reliable-autonomous-cv-delivery/research-cv-delivery-pipeline/digests/analyzer-1.md"],
  "testsAddedOrUpdated": [],
  "commandsRun": [{"command":"git show / git grep at d515274f1802ea5715c3ce3a2eaa34ce6a5fb308","result":"passed","summary":"Read-only evidence inspection; nonexistent dossier.astro lookup failed and was corrected to dossier-print.astro."}],
  "validationOutput": ["15 existing evidence files inspected; no project code executed."],
  "residualRisks": ["Remote enforcement and deployment success unverified; security workflow implementations and French dossier route outside inspection budget."],
  "diffSummary": "Research digest only; no source changes.",
  "reviewFindings": [],
  "manualNotes": "Only the requested digest artifact was written. No git status or staging inspection was performed."
}
```
