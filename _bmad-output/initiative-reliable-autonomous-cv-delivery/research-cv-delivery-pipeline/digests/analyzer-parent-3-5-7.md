# Parent role digests — Q3, Q5, Q7

Pinned commit: d515274. Read through git show only; no builds/tests executed. These questions were taken by the parent, so strict intent isolation was not in force. File budget 15 per question; shared files reread only where relevant. No recommendations.

## Q3 — credentials and permissions

- LOAD-BEARING: Deployment grants contents:read and passes two Actions secrets to Wrangler: `.github/workflows/deploy.yml:9-10 (permissions) @ d515274`, `.github/workflows/deploy.yml:44-50 (apiToken) @ d515274`.
- CI uses contents:read; CodeQL adds actions:read and security-events:write; secret scanning has contents/PR read; dependency review has PR write: `.github/workflows/ci.yml:9-10 (permissions) @ d515274`, `.github/workflows/codeql.yml:11-14 (permissions) @ d515274`, `.github/workflows/secret-scan.yml:11-13 (permissions) @ d515274`, `.github/workflows/dependency-review.yml:6-8 (permissions) @ d515274`.
- LOAD-BEARING: Dependabot automation grants contents/PR write and uses GITHUB_TOKEN; actor/nondraft gates restrict its job and there is no checkout: `.github/workflows/dependabot-auto-merge.yml:11-13 (permissions) @ d515274`, `.github/workflows/dependabot-auto-merge.yml:24-39 (auto-merge) @ d515274`.
- Scorecard has contents:read, id-token/security-events:write, checkout persist-credentials:false: `.github/workflows/scorecard.yml:11-14 (permissions) @ d515274`, `.github/workflows/scorecard.yml:26-30 (persist-credentials) @ d515274`.
- Local environment-file ignore entries are preventive conventions, not credential-scope evidence: `.gitignore:6-10 (Secrets) @ d515274`.
- README documents Workers Scripts Edit deployment scope while SECURITY describes Pages Edit: `README.md:38-43 (Deploy) @ d515274`, `SECURITY.md:23-29 (Secrets and Privacy) @ d515274`. Actual Cloudflare token scope and OpenClaw credential identity cannot be established from these files.

## Q5 — Dependabot and Scorecard

- LOAD-BEARING: Weekly npm update checks run Monday 06:00 Europe/Paris; GitHub Actions updates Monday 06:15; both cap open PRs at five. npm groups Astro and TypeScript: `.github/dependabot.yml:3-20 (updates) @ d515274`, `.github/dependabot.yml:22-31 (updates) @ d515274`.
- LOAD-BEARING: On PR-target opened/reopened/synchronize/ready_for_review, nondraft Dependabot-actor jobs read metadata. Non-major updates get gh pr merge --auto --squash --delete-branch with GITHUB_TOKEN; major updates get a manual-review comment instead: `.github/workflows/dependabot-auto-merge.yml:3-9 (pull_request_target) @ d515274`, `.github/workflows/dependabot-auto-merge.yml:24-48 (auto-merge) @ d515274`.
- LOAD-BEARING: Scorecard runs main pushes, Monday 06:08 UTC cron, and dispatch; generates SARIF with publish_results:false and uploads it to GitHub code scanning: `.github/workflows/scorecard.yml:3-9 (on) @ d515274`, `.github/workflows/scorecard.yml:32-42 (results_file) @ d515274`. No score threshold or PR trigger is specified in this workflow.

## Q7 — verification beyond basic builds

- LOAD-BEARING: build:all chains build:site, check:rendered and pdf; the CI PDF-budget job runs build:all. Deploy instead runs build:site then pdf, omitting the standalone rendered-HTML command: `package.json:6-14 (scripts) @ d515274`, `.github/workflows/ci.yml:59-62 (pdf-budget) @ d515274`, `.github/workflows/deploy.yml:38-42 (deploy) @ d515274`.
- LOAD-BEARING: Rendered validation reads four built EN/FR public/dossier HTML files, checks certification uniqueness/presence/chronology, skill substance and soft-skill markup, and exits nonzero for violations: `scripts/check-rendered-cv.mjs:6-35 (PAGES) @ d515274`, `scripts/check-rendered-cv.mjs:38-77 (violations) @ d515274`.
- LOAD-BEARING: Print validation runs in Chromium print media and checks required visible text, single anchor occurrence, chronological certifications and visible-section minimums; PDF page count is read with pdf-lib: `scripts/gen-pdf.mjs:105-108 (pageCount) @ d515274`, `scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`, `scripts/gen-pdf.mjs:171-179 (main) @ d515274`.
- Bounded absence finding: git ls-tree and git grep at d515274 found no tracked test suite paths or vitest/jest/node:test/describe/test/it definitions, workflow_run, actionlint, zizmor or shellcheck. This is not proof that external or untracked checks do not exist. package.json defines no test script. PDF text extraction and live deployment/headers checks are not part of the inspected scripts.
