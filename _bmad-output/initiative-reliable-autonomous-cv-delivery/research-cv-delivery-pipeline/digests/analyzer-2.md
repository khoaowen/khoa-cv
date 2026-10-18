# Q2 — What validates or rejects a CV edit?

Evidence: commit `d515274` only; 11 files read fully with `git show`, plus targeted `git grep`. No application code executed. No private content values reproduced.

## Gates and call sites

- **[Load-bearing] Required-check policy is documented, not proven live configuration.** The contributor guide says protected `main` requires PRs and five green checks, with no human review: Build and typecheck, PDF page budget, Analyze JavaScript and TypeScript, Gitleaks, Review dependency changes. It also documents admin emergency pushes. `AGENTS.md:23-43 (Contribution flow autonomous) @ d515274`. Workflow definitions prove invocation, not the current GitHub branch-protection settings.
- **[Load-bearing] PR/main CI invokes two different validation paths:** `pull_request` and main pushes trigger CI; the build job runs `build:site`; the PDF job installs Chromium and runs `build:all`. `.github/workflows/ci.yml:3-7 (on), :17-36 (build), :38-62 (pdf-budget) @ d515274`.
  - `build:site` → source contract checker → `astro check` → `astro build`, short-circuited with `&&`. `package.json:10 (scripts.build:site) @ d515274`.
  - `build:all` → `build:site` → `check:rendered` → `pdf`, also short-circuited. The latter scripts invoke the rendered checker and PDF generator respectively. `package.json:11-13 (scripts) @ d515274`.
  - Additional direct entry points: `check:content` invokes the source checker; `build` invokes only Astro check/build, not the explicit source/render/PDF checks. `package.json:8-9 (scripts) @ d515274`.
- **[Load-bearing] Deployment independently rechecks source/build and browser/PDF contracts, but skips `check:rendered`.** Main pushes or manual dispatch run dependency installation, Chromium installation, `build:site`, then `pdf`, then Wrangler deploy; there is no dependency on the separate CI/security jobs in this workflow. `.github/workflows/deploy.yml:3-7 (on), :16-50 (deploy) @ d515274`. Thus the rendered-static check is a `build:all`/PR-PDF-job gate, not a directly invoked deployment gate.

## What rejects an edit

### Source and schema

- Source guard targets only the EN/FR CV YAML files. It detects `tel:` URIs, international-number patterns and French-number patterns line-by-line. `scripts/check-content.mjs:6-16 (FILES/PATTERNS), :68-84 (source scan) @ d515274`.
- It additionally requires exactly one literal localized AI Engineering certification block, every named credential in an explicit nine-item per-locale list, and exact adjacent company/position strings for four selected employers in each locale. These are textual contracts, not a general bilingual-equivalence validator. `scripts/check-content.mjs:20-66 (CERTIFICATION_CONTRACTS/REQUIRED_CERTIFICATIONS/ROLE_CONTRACTS), :86-115 (contract loops) @ d515274`.
- Any accumulated violation exits 1. The phone scan skips unreadable files, but the later contract reads are uncaught and therefore cannot silently skip the same missing files. `scripts/check-content.mjs:71-75 (source scan), :86-122 (contract loops/violations) @ d515274`.
- Astro loads all `*.yaml` files from the CV directory into a Zod collection. It validates declared types/required fields, EN/FR language, URL/email formats, string arrays and boolean flags; certification `issuedAt` is mandatory and must match `YYYY-MM` with month 01–12. Work/display dates are merely strings, not parsed chronology. `src/content.config.ts:14-43 (dateString/yearMonth/cv), :44-128 (cv.schema) @ d515274`. Build callers above run Astro check/build; malformed schema content is described as build-failing in `src/content.config.ts:4-7 (collection documentation) @ d515274`.

### Built HTML (not browser/PDF inspection)

- Reads four built HTML files: EN/FR public pages and EN/FR dossier-print pages. Rejects a certification count other than one, missing expected certification/issuer/localized date, no valid date attributes, non-newest-first extracted dates, insufficient skills substance, or missing soft-skills structure/communication text. Skills accept either ≥20 words in the skills section **or** the alternate heading-plus-two-technology-anchor pattern. Violations exit 1; file reads are uncaught. `scripts/check-rendered-cv.mjs:6-35 (PAGES), :38-63 (render checks), :63-78 (violations) @ d515274`.

### Browser print contracts and generated-PDF page count

- Four target routes produce two compact CV PDFs and two dossier PDFs. Compact CVs have required credential/technology text plus visible hard-skills (≥1 item/20 words) and soft-skills (≥3 items/6 words) requirements. Dossiers have shorter required-text lists and **no page limit**. `scripts/gen-pdf.mjs:63-103 (TARGETS) @ d515274`.
- `main` requires built `dist/index.html`, starts a local static server and Chromium, sets print media, then calls `assertPrintContract` before `renderToBudget` for every target. `scripts/gen-pdf.mjs:160-180 (main) @ d515274`.
- Browser assertion throws for missing required body text, a first required-text anchor count other than one, absent/non-descending certification chronology, or insufficient displayed/visible selected skills items/words. `scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`.
- **[Load-bearing] Compact PDF overflow rejects the run:** PDF bytes are loaded with `pdf-lib` to count pages. Defaults are 2 pages, scale floor 0.85, decrement 0.03; the first fitting scale from 1 downward wins. Dossiers render at scale 1 without budget rejection. Compact overflow writes the last attempted PDF but records failure and exits 1; thrown errors also exit 1. Environment variables can override budget/scale defaults. `scripts/gen-pdf.mjs:20-23 (budget constants), :105-125 (pageCount/renderToBudget), :178-207 (main/main.catch) @ d515274`.
- This separates two protections: required substance is tested in browser DOM under print media; page count is tested on actual generated PDF bytes. No PDF text extraction is performed by these functions. `scripts/gen-pdf.mjs:105-158 (pageCount/renderToBudget/assertPrintContract) @ d515274`.

### Other documented merge checks

- CodeQL runs on PRs, main pushes and a schedule; initializes JavaScript/TypeScript analysis with build mode `none`, then invokes analysis. No local alert-severity failure rule is specified here. `.github/workflows/codeql.yml:3-9 (on), :21-37 (analyze) @ d515274`.
- Gitleaks runs on PRs, main pushes and a schedule, checks out full history and invokes the external secret-scanning action. Local workflow does not define detection patterns. `.github/workflows/secret-scan.yml:3-9 (on), :20-34 (gitleaks) @ d515274`.
- Dependency review runs on PRs and explicitly fails on high-or-greater vulnerability severity. `.github/workflows/dependency-review.yml:3-4 (on), :15-29 (review) @ d515274`.

## Gaps / limits

- Targeted `git grep` at `d515274` for checker/build/PDF invocations, security-action names, `required_status_checks`, branch-protection and ruleset terms, excluding the five forbidden directories, found the call sites described above but no live branch-protection/ruleset configuration. GitHub settings and external action internals were not inspected; required checks being configured/enforced live cannot be attested from these files.
- Source contracts protect selected exact content, not all cross-locale semantic consistency. Neither source nor rendered/browser checkers above explicitly test private-data leakage; the phone guard scans the two source YAMLs, not every repository file or generated artifact. These limits follow their enumerated inputs/assertions, not a claim that leakage exists. `scripts/check-content.mjs:6-16 (FILES/PATTERNS), :86-115 (contract loops); scripts/check-rendered-cv.mjs:38-63 (render checks); scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274`.
- Documentation says each PDF must fit two pages, whereas live generator targets exempt dossiers. `AGENTS.md:74-86 (2-page PDF budget enforced); scripts/gen-pdf.mjs:90-102 (TARGETS) @ d515274`.

```acceptance-report
{
  "criteriaSatisfied": [{"id":"criterion-1","status":"satisfied","evidence":"Answered Q2 with commit-pinned validator/call-site citations, failure conditions and enforcement gaps."}],
  "changedFiles": ["_bmad-output/initiative-reliable-autonomous-cv-delivery/research-cv-delivery-pipeline/digests/analyzer-2.md"],
  "testsAddedOrUpdated": [],
  "commandsRun": [{"command":"git show d515274:<evidence paths> | cat -n; git grep -n -E <validator/enforcement patterns> d515274 -- <excluded-path scope>","result":"passed","summary":"Read-only commit evidence inspection; no application execution."}],
  "validationOutput": ["11 evidence files read fully; exact line citations recorded."],
  "residualRisks": ["Live GitHub required-check configuration and external action behavior are not established by tracked workflows."],
  "diffSummary":"Research artifact only; no source edits.",
  "reviewFindings": [],
  "manualNotes":"Instruction reference read separately; repository facts drawn only from git show/grep at d515274. No working-tree/status inspection or staging performed."
}
```
