---
title: 'Codebase research: CV delivery pipeline'
type: codebase
ask: Analyse the repository and verify autonomous delivery configuration through GitHub APIs.
repository: /Users/khoa/IdeaProjects/khoa-cv
commit: d515274f1802ea5715c3ce3a2eaa34ce6a5fb308
branch: origin/main
status: complete
validation: normal
claims: {"verified": 33}
created: 2026-10-18
updated: 2026-10-18
---

# Codebase research: CV delivery pipeline

## Questions

1. How does a CV YAML change travel from a branch to a live deployment? (how)
2. What validates or rejects a CV edit before merge or deployment? (what touches)
3. How are credentials and permissions handled? (how)
4. What enforces privacy and no-JavaScript rules on the public site and PDF? (what touches)
5. How do Dependabot updates and Scorecard run? (how)
6. Why do the pipeline and PDF page-budget logic have their present form, according to git history? (why)
7. How is the pipeline tested beyond build-time guards? (how)

## Evidence boundaries

Code evidence is pinned to `d515274`, not the local checkout. API observations were collected on October 18, 2026; they describe current GitHub configuration and retained run metadata, not historical settings or live Cloudflare contents. Redacted snapshots are in `imports/`. Secret values and private contact values were not retrieved. No application build, deployment, merge, or settings change was performed.

Fresh locator/analyzer agents researched questions 1, 2 and 4. The parent took analyzer roles for 3, 5 and 7 and the historian role for 6. The harness rejected explicit context-inheritance suppression options; prompts excluded ambient context as evidence, but a strict research firewall was not in force. Independent verification is recorded separately in the memlog. Earlier draft wording overstated duplicate/date checks and described PR #7 as documentation-only; verification corrected these descriptions. Secret provisioning is supported by API evidence, not workflow source alone.

## 1. YAML → branch → deployment

The documented contribution flow is bilingual YAML change → branch → PR → five green checks → squash auto-merge, without human approval. Administrator emergency pushes are explicitly documented. The earlier update instructions still say to push directly to main, conflicting with the contribution flow. `AGENTS.md:14-43 (Contribution flow) @ d515274`.

GitHub currently requires these five check contexts, with strict up-to-date checking: **Build and typecheck**, **PDF page budget**, **Analyze JavaScript and TypeScript**, **Gitleaks**, and **Review dependency changes**. Required approving reviews are zero. Auto-merge, squash merge and automatic branch deletion are enabled. Administrator enforcement is disabled; force-push and branch-deletion allowances are disabled; linear history is required. No repository rulesets were returned. [1][2][3]

### Observed deployment gap

The latest returned Deploy run succeeded for `7b59064` on **August 2, 2026**. Remote main is `d515274`, merged on **October 12, 2026** through PR #101 by `github-actions[bot]`. Therefore the returned workflow history does not show deployment of current main. It does not prove that no one deployed outside this workflow. [4][5][6]

Dependabot's merge command authenticates with `GITHUB_TOKEN`, while Deploy relies on push/dispatch triggers. GitHub documents that events caused by `GITHUB_TOKEN` do not launch new push-triggered workflows. This supplies a supported explanation for the observed gap; the workflow code and API evidence do not expose the exact token used by every historical merge or the actual live Worker revision. `.github/workflows/dependabot-auto-merge.yml:35-40 (GH_TOKEN) @ d515274`; `.github/workflows/deploy.yml:3-7 (on) @ d515274`. [7]

### Committed execution path

The committed execution path is:

- CV YAML collection: the glob loader and schema feed Astro's `cv` collection. `src/content.config.ts:22-25 (cv) @ d515274`; `src/content.config.ts:131 (collections) @ d515274`.
- Public EN/FR routes load the matching entry, throw if missing, and render Base/CvSections. `src/pages/index.astro:6-13 (entry) @ d515274`; `src/pages/fr/index.astro:6-13 (entry) @ d515274`.
- Compact print routes use PrintLayout and print sections; dossier routes use PrintLayout and full web sections. `src/pages/cv-print.astro:7-14 (entry) @ d515274`; `src/pages/fr/cv-print.astro:7-14 (entry) @ d515274`; `src/pages/dossier-print.astro:8-15 (entry) @ d515274`; `src/pages/fr/dossier-print.astro:7-14 (entry) @ d515274`.
- PR and main-push CI invokes `build:site` and, separately, `build:all`. The latter chains source/build, rendered checks, and PDFs with failure-short-circuiting `&&`. `.github/workflows/ci.yml:17-62 (jobs) @ d515274`; `package.json:6-13 (scripts) @ d515274`.
- PDF generation serves dist on loopback, opens four print routes in Chromium, asserts their contracts and writes two compact CV PDFs plus two full dossier PDFs into dist. `scripts/gen-pdf.mjs:63-103 (TARGETS) @ d515274`; `scripts/gen-pdf.mjs:160-201 (main) @ d515274`.
- Deploy is independently triggered by main pushes or manual dispatch, installs dependencies/Chromium, runs `build:site`, runs `pdf`, then Wrangler deploy. It does not run `check:rendered` or declare dependency on successful post-merge CI. `.github/workflows/deploy.yml:3-50 (deploy) @ d515274`.
- Astro emits static output; Wrangler selects `./dist/` as Worker assets. `astro.config.mjs:26 (output) @ d515274`; `wrangler.jsonc:3-8 (assets) @ d515274`.


## 2. Validation and rejection points

| Input/output | Validator and failure behavior | Invocation/citation |
|---|---|---|
| CV source YAML | EN/FR-only phone-pattern scan; exact certification blocks, required credential names and contracted employer/title strings; violations exit 1. Later file reads also fail if content is missing, and those errors are not caught. | `scripts/check-content.mjs:6-16 (FILES) @ d515274`; `scripts/check-content.mjs:20-122 (CERTIFICATION_CONTRACTS) @ d515274`; `package.json:8-10 (scripts) @ d515274` |
| Collection data | Zod checks required fields/types, locale, URLs/email, booleans and certification YYYY-MM dates. Work/display dates remain strings; their chronology is not validated. | `src/content.config.ts:14-128 (cv) @ d515274`; `package.json:10 (scripts) @ d515274` |
| Built HTML | Four EN/FR public/dossier files: certification count/presence, newest-first dates, skills substance and soft-skills structure. Violations exit 1; missing files fail reads. | `scripts/check-rendered-cv.mjs:6-35 (PAGES) @ d515274`; `scripts/check-rendered-cv.mjs:38-77 (violations) @ d515274`; `package.json:11-13 (scripts) @ d515274` |
| Print DOM | Throws for missing required text, a non-unique first required-text anchor, zero certification date elements, lexicographically out-of-order extracted date attributes and insufficient visible selected skill rows/items/words. It does not reject every repeated required string or each individually missing date. | `scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`; `scripts/gen-pdf.mjs:173-179 (main) @ d515274` |
| Compact PDF bytes | pdf-lib counts pages; scale is tried from 100% to 85% in 3-point steps. Default budget is two pages. Overflow records failure and exits 1 even though the last PDF is written. Environment variables override defaults. | `scripts/gen-pdf.mjs:20-23 (MAX_PAGES) @ d515274`; `scripts/gen-pdf.mjs:105-125 (renderToBudget) @ d515274`; `scripts/gen-pdf.mjs:178-207 (main) @ d515274` |
| Full dossier PDFs | Both dossier targets set maxPages:null and render at scale 1 without a page-budget rejection. | `scripts/gen-pdf.mjs:90-102 (TARGETS) @ d515274`; `scripts/gen-pdf.mjs:113-115 (renderToBudget) @ d515274` |
| JS/TS | CodeQL uses JavaScript/TypeScript, build-mode none, PR/main/scheduled execution; external action performs analysis. | `.github/workflows/codeql.yml:3-37 (analyze) @ d515274` |
| Secrets | Full-history checkout and external Gitleaks action on PR/main/schedule. This workflow does not define the scanner's detection rules. | `.github/workflows/secret-scan.yml:3-34 (gitleaks) @ d515274` |
| Dependency changes | PR dependency-review action explicitly fails at high-or-greater vulnerability severity. | `.github/workflows/dependency-review.yml:3-29 (review) @ d515274` |

Every source/build/PDF validator above is invoked before deployment, **except** the standalone rendered-HTML command: CI's PDF-budget job runs `build:all`, whereas Deploy runs `build:site` and `pdf` separately. `package.json:10-13 (scripts) @ d515274`; `.github/workflows/ci.yml:59-62 (pdf-budget) @ d515274`; `.github/workflows/deploy.yml:38-42 (deploy) @ d515274`.

Selected exact localized strings are guarded; these source contracts are not a general bilingual semantic-equivalence check. The listed phone patterns are not a scan of every file or every possible phone format. `scripts/check-content.mjs:6-66 (FILES) @ d515274`.

## 3. Credentials and permissions

Deploy grants contents:read and supplies the Cloudflare token/account ID through Actions secret references. The API snapshot confirms both repository secret names exist; workflow source alone cannot establish provisioning. Values, validity and scopes were not inspected. `.github/workflows/deploy.yml:9-10 (permissions) @ d515274`; `.github/workflows/deploy.yml:44-50 (apiToken) @ d515274`. [8]

CI has contents:read; CodeQL adds actions:read and security-events:write; secret scanning uses contents/PR read; dependency review uses contents:read and PR write. `.github/workflows/ci.yml:9-10 (permissions) @ d515274`; `.github/workflows/codeql.yml:11-14 (permissions) @ d515274`; `.github/workflows/secret-scan.yml:11-13 (permissions) @ d515274`; `.github/workflows/dependency-review.yml:6-8 (permissions) @ d515274`.

Dependabot automation grants contents/PR write, gates its job on Dependabot actor and nondraft state, and uses GITHUB_TOKEN without checking out PR code. Scorecard grants contents:read, id-token/security-events:write and disables checkout credential persistence. `.github/workflows/dependabot-auto-merge.yml:11-39 (permissions) @ d515274`; `.github/workflows/scorecard.yml:11-14 (permissions) @ d515274`; `.github/workflows/scorecard.yml:26-30 (persist-credentials) @ d515274`.

The current default Actions token permissions are read-only and do not allow workflows to approve pull requests; all actions are allowed and repository-level SHA pinning is not required. The authenticated investigator has admin access. These observations do **not** identify OpenClaw's account/token or prove that its credentials satisfy the documented non-admin requirement. [2][9][10]

The deployment credential instructions disagree: README describes Workers deployment permissions, while SECURITY describes Pages permissions. Neither proves actual token scope. `README.md:38-43 (Deploy) @ d515274`; `SECURITY.md:23-29 (Secrets and Privacy) @ d515274`.

## 4. Privacy and JavaScript boundaries

The schema permits optional private email/address; the ordinary public header and metadata do not explicitly render these fields. That omission is not a whole-output privacy assertion. `src/content.config.ts:24-42 (cv) @ d515274`; `src/layouts/Base.astro:17-39 (description) @ d515274`; `src/layouts/Base.astro:50-67 (basics) @ d515274`.

PrintLayout inserts private email, including a mailto link, and address into its **HTML** contacts. All four compact/dossier print routes use that layout and pass the complete CV data; private values are therefore not exclusive to PDF binaries in this generation path. `src/layouts/PrintLayout.astro:18-24 (contacts) @ d515274`; `src/layouts/PrintLayout.astro:40-49 (contacts) @ d515274`; `src/pages/cv-print.astro:7-14 (entry) @ d515274`; `src/pages/fr/cv-print.astro:7-14 (entry) @ d515274`; `src/pages/dossier-print.astro:8-15 (entry) @ d515274`; `src/pages/fr/dossier-print.astro:7-14 (entry) @ d515274`.

Static output is retained in dist. PDF generation adds PDFs without deleting print HTML, and the deployment workflow selects the same dist with no intervening HTML-removal step or configured print-route access restriction. This is a **source-level deployment boundary mismatch**, not confirmation of a particular live response. `astro.config.mjs:26 (output) @ d515274`; `scripts/gen-pdf.mjs:160-208 (main) @ d515274`; `.github/workflows/deploy.yml:38-50 (deploy) @ d515274`; `wrangler.jsonc:5-8 (assets) @ d515274`.

All print routes inherit HTML noindex, but header/robots/sitemap exclusions specifically name cv-print, not dossier-print. Indexing directives are not authentication or retrieval restrictions. `src/layouts/PrintLayout.astro:33 (robots) @ d515274`; `public/_headers:14-18 (Print routes) @ d515274`; `public/robots.txt:1-6 (Disallow) @ d515274`; `astro.config.mjs:22-23 (filter) @ d515274`.

The phone guard scans the two YAML files, not arbitrary templates or rendered artifacts. No privacy-leak assertion appears among the inspected rendered/print contracts. `scripts/check-content.mjs:6-16 (FILES) @ d515274`; `scripts/check-rendered-cv.mjs:38-63 (violations) @ d515274`; `scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`.

CSP declares script-src 'none'; Astro externalizes CSS for style-src self, and language switching uses anchors. These are distinct from an automated guarantee that no JavaScript asset exists. `public/_headers:3-4 (script-src) @ d515274`; `astro.config.mjs:28-30 (inlineStylesheets) @ d515274`; `src/components/LangToggle.astro:11-29 (href) @ d515274`.

The local PDF server does not apply _headers, and Playwright does not disable JavaScript; its evaluateAll calls inspect the print DOM during build automation. The deployed CSP is not an enforcement mechanism in that local rendering path. `scripts/gen-pdf.mjs:37-60 (startServer) @ d515274`; `scripts/gen-pdf.mjs:137-150 (assertPrintContract) @ d515274`; `scripts/gen-pdf.mjs:167-179 (main) @ d515274`.

## 5. Dependabot and Scorecard

Dependabot schedules npm updates for Monday at 06:00 Europe/Paris and Actions updates for Monday at 06:15, each with a maximum of five open PRs; the npm update configuration defines groups for Astro and TypeScript. `.github/dependabot.yml:3-31 (updates) @ d515274`.

The target-PR workflow handles opened/reopened/synchronize/ready_for_review events, checks actor/nondraft state, reads update metadata and queues non-major updates for squash auto-merge. Major updates receive a manual-review comment instead. Its merge credential is GITHUB_TOKEN. `.github/workflows/dependabot-auto-merge.yml:3-48 (auto-merge) @ d515274`.

Scorecard runs on main pushes, Monday 06:08 UTC cron and dispatch, writes SARIF with publish_results:false, and uploads to GitHub code scanning. It has no configured score-threshold check or PR trigger and is not among the five required contexts returned by branch protection. `.github/workflows/scorecard.yml:3-9 (on) @ d515274`; `.github/workflows/scorecard.yml:32-42 (results_file) @ d515274`. [1]

## 6. History: why these controls exist

History review was limited to ten relevant commits; six were examined using scoped diffs and linked PR metadata. Author-reported test results were not treated as executed tests in this research.

- `3f3061c "Document autonomous PR flow + public-repo security posture (#7)" #7` documents automated merge without human review; PR #7 describes itself as the end-to-end test of the auto-merge loop. Its diff primarily changes documentation and also changes the deployment job display name; neither establishes every subsequent workflow outcome.
- `f144a14 "Enforce a 2-page PDF budget with auto-fit harness (#8)" #8` adds page counting, shrinking to the readable 85% floor, and CI rejection. PR #8 explicitly frames the objective as detecting overflow before merge, not after deployment.
- `0aad83e "Add rendered CV drift guards (#63)" #63` adds the rendered-HTML command to build:all and assertions before PDF rendering; its PR names exactly-once certification rendering and preservation of the two-page rule.
- `20388d2 "Add CV dossier publishing guardrails (#64)" #64` adds dossier targets with no page limit, explaining in the diff that they mirror the complete website. This is narrower than the guide's statement that every PDF must fit two pages. `scripts/gen-pdf.mjs:90-102 (TARGETS) @ d515274`; `AGENTS.md:74-86 (PDF budget) @ d515274`.
- `b0bbc62 "Restore detailed PDF CV content (#68)" #68` expands print required-text contracts. `7b59064 "Show older experience summaries in French PDF (#69)" #69` adds visible hard/soft-skill minima and substance-oriented rendered checks.

Current PR #64 and #68 metadata repeat French-summary text that does not explain all changes shown by their commits. Their diffs, not those descriptions, support the statements above; snapshots preserve the discrepancy. No decision was established as meeting all three ADR-proposal tests of hard-to-reverse, surprising-without-context and substantive trade-off. No ADR was created.

## 7. Existing verification beyond builds

This repository does have executable output checks: build:all validates built HTML, Chromium print DOM and generated-PDF page count, not just YAML and Astro types. CI invokes that full chain. `package.json:10-13 (scripts) @ d515274`; `.github/workflows/ci.yml:59-62 (pdf-budget) @ d515274`; `scripts/check-rendered-cv.mjs:38-77 (violations) @ d515274`; `scripts/gen-pdf.mjs:105-158 (pageCount) @ d515274`.

The print checks inspect browser DOM and count PDF pages; they do not extract PDF text. The inspected commands have no assertion that every merged revision reached Cloudflare or that live responses apply the expected privacy/CSP rules. `scripts/gen-pdf.mjs:105-158 (pageCount) @ d515274`; `.github/workflows/deploy.yml:38-50 (deploy) @ d515274`.

Bounded repository searches found no tracked test-suite paths, vitest/jest/node:test or describe/test/it definitions, workflow_run trigger, actionlint, zizmor or shellcheck, excluding lockfile and planning/install directories. This does not exclude external or untracked checks. The npm manifest defines no test script. `package.json:6-15 (scripts) @ d515274`. Search scope and patterns are recorded in `digests/locator-all.md`.

## Where the answers meet

- `build:all` joins Q1, Q2 and Q7: source/build failure prevents rendered checks and PDF generation. Deploy invokes a different chain. `package.json:10-13 (scripts) @ d515274`; `.github/workflows/deploy.yml:38-42 (deploy) @ d515274`.
- `assertPrintContract` joins Q2, Q4 and Q7: content/chronology/visibility errors throw; the method is not a private-field or JavaScript-output validator. `scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`.
- PrintLayout and dist join Q1/Q4: contact-bearing HTML and generated PDFs share the selected deployment asset directory. `src/layouts/PrintLayout.astro:18-24 (contacts) @ d515274`; `scripts/gen-pdf.mjs:160-201 (main) @ d515274`; `wrangler.jsonc:5-8 (assets) @ d515274`.

## Open questions

1. Which OpenClaw principal/token performs CV edits and enables auto-merge, and what effective repository permissions does it have? Repository API access does not establish bot-host provisioning.
2. Which revision and asset set does the live Cloudflare Worker currently serve? No Cloudflare API or live contact-bearing pages were fetched.
3. Which credentials and event chain applied to each historical bot merge? Workflow code, platform documentation and retained run metadata explain a plausible suppression path, not a per-event token audit.
4. Do the generated/deployed outputs apply the intended no-private-HTML and no-JavaScript invariants? Source identifies retained print HTML, but no build artifacts or live response checks were executed.
5. How were deployment and auto-merge first provisioned? The ten-commit history budget stops short of fully establishing initial automation provenance; the user's OpenClaw attribution remains reported context.

## Prior documents

No prior research or ADRs were found in the committed tree. The initiative shell is organizational metadata, not a filled requirements document. There are no implementation tickets or architecture decisions produced by this research.

## Sources

Code and history citations above refer to the pinned repository or cited commits. GitHub is the publisher of API observations and documentation below; API access timestamps are preserved in the named JSON snapshots. Publication dates for live API settings and the documentation page are not supplied.

| Ref | Source and snapshot |
|---|---|
| [1] | GitHub API, main branch protection; accessed 2026-10-18. `imports/protection.json`. https://api.github.com/repos/khoaowen/khoa-cv/branches/main/protection |
| [2] | GitHub API, repository configuration/current investigator permissions; accessed 2026-10-18. `imports/repository.json`. https://api.github.com/repos/khoaowen/khoa-cv |
| [3] | GitHub API, rulesets; accessed 2026-10-18. `imports/rulesets.json`. https://api.github.com/repos/khoaowen/khoa-cv/rulesets |
| [4] | GitHub API, Deploy run history; accessed 2026-10-18. `imports/deploy-runs.json`. https://api.github.com/repos/khoaowen/khoa-cv/actions/workflows/deploy.yml/runs?per_page=10 |
| [5] | GitHub API, main commit; accessed 2026-10-18. `imports/main-commit.json`. https://api.github.com/repos/khoaowen/khoa-cv/commits/main |
| [6] | GitHub API, merged PR #101; merged 2026-10-12, accessed 2026-10-18. `imports/pr-101.json`. https://github.com/khoaowen/khoa-cv/pull/101 |
| [7] | GitHub Docs, Triggering a workflow, section Triggering a workflow from a workflow; accessed 2026-10-18. Exact passages in `imports/github-workflow-triggering.md`. https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow |
| [8] | GitHub API, Actions secret names only; accessed 2026-10-18. `imports/secret-names.json`. https://api.github.com/repos/khoaowen/khoa-cv/actions/secrets |
| [9] | GitHub API, Actions repository policy; accessed 2026-10-18. `imports/actions-permissions.json`. https://api.github.com/repos/khoaowen/khoa-cv/actions/permissions |
| [10] | GitHub API, default workflow token permissions; accessed 2026-10-18. `imports/workflow-permissions.json`. https://api.github.com/repos/khoaowen/khoa-cv/actions/permissions/workflow |
