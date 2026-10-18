# Proposed backlog — Reliable autonomous CV delivery

Status: scope and split approved by the user; local planning files only. No implementation, commit or external publication is authorized. IDs below are stable references instantiated under tickets/. Requirement IDs refer to the initiative. The initiative owns shared constraints; this companion preserves the approved sequencing and verification rationale. Formal epic and leaf files now hold the working ticket requirements and criteria.

## Evidence ledger

| Category | Statement | Source / consequence |
|---|---|---|
| Verified, pinned source | PrintLayout renders optional private contacts into four static print routes; generation leaves their HTML in dist, which Wrangler selects. | Research §4. A source-level release boundary defect, not proof of a live contact leak. Bug 1.1. |
| Verified, pinned source | CI runs build:all; Deploy runs build:site then pdf and omits check:rendered. | Research §§1–2. Bug 1.2. |
| Verified, retained API history | Latest returned successful Deploy is 7b59064 on 2026-08-02; main is d515274, merged 2026-10-12 by github-actions[bot]. | Research §1. Current-main deployment is absent from returned history; out-of-band deployment is not excluded. Spike 2.1. |
| Supported explanation, not historical proof | GITHUB_TOKEN-caused events normally suppress push-triggered workflows; the Dependabot merge command uses GITHUB_TOKEN. | Research §1 and retained GitHub documentation [7]. Actor names do not prove historical token identity. Spike 2.1 and bug 2.3. |
| Unverified | Actual live Worker revision/assets; OpenClaw principal and effective token privileges; Cloudflare secret scope/validity. | Research §§3–4, Open questions. Stories 2.1–2.2 collect only needed redacted evidence. |
| Verified mismatch | Guide overstates all-PDF page budget and includes direct-main wording; README/SECURITY disagree on Workers versus Pages permissions. | Research §§1, 3, 6. Story 2.5. |

No build, live-page retrieval, token inspection or deployment is claimed by this plan. Research imports remain the original evidence; do not duplicate real contact data into planning records.

## Epic split and ordering

| ID | Proposed epic | Owns | Deliverable and integrated Done when |
|---|---|---|---|
| 1 | Safe, consistently validated release assets | R4, R5, R7 | The actual release payload is privacy-safe, fails closed and preserves all four PDFs and EN/FR public output. Integrated artifact checks and production retrieval checks show private fields only in PDFs; safe-artifact contract is handed to epic 2. |
| 2 | Provable autonomous delivery and operator handoff | R1, R2, R3, R6, R8 | Qualifying ordinary-bot and Dependabot merges reach the live Worker with revision-bound evidence, verified least-privilege bot access, visible failures/staleness and tested recovery/docs. Accept only after production integration proof. |

Cut rule: two distinct usable outcomes, not one epic per file/service. CI, scripts and release-directory changes stay in one artifact lane; trigger/provenance/security-operation changes stay in one delivery lane. Documentation is part of operating delivery, not a separate documentation epic.

Epic 2 may start once entries 1.1–1.3 provide the validated privacy-safe artifact contract and passing local integration checks; it does not wait for epic 1's production closure. Epic 1 remains open until 2.7 supplies its production retrieval evidence. This is a handoff dependency, not a whole-epic completion gate: both epics touch the deploy workflow and no live recovery/demo should publish the known unsafe boundary. Read-only investigation may be prepared earlier, but planned execution is serial to avoid shared-workflow collisions. The opening epic is the platform baseline repair, not a rebuild. No architecture/UX/PRD ceremony is required: release mechanism decisions live in 2.1; artifact-boundary implementation choices live in 1.1, both under the initiative constraints.

## Epic 1 — Safe, consistently validated release assets

Proposed tracer: 1.1 exercises source → build-only print HTML → four PDFs → safe release payload. Exact sanitization/staging technique is an implementation choice, not a prescribed solution. Public PDF download behavior must stay intact.

### 1.1 Bug — Private contacts are excluded from deployable non-PDF output

- Covers: R4; preserves R7. Risk: high. Proposed severity: P1 (source-level exposure path, live exposure unconfirmed).
- After: none.
- Scope: define and enforce the final asset boundary for compact and dossier output in both languages. Build-time private HTML may exist only outside the deployable payload and must not be published in public CI artifacts/logs. If print routes remain public, their served HTML must be contact-free.
- Acceptance:
  1. Given synthetic private email/address sentinels in both locales, generating the release produces four downloadable PDFs with the expected private contacts and no contact-bearing non-PDF release asset, including links, metadata, encoded output and alternate retained copies.
  2. Given each compact/dossier print route and its direct .html/index.html forms, the final static server returns either no resource or contact-free HTML; noindex/robots/CSP alone does not count as exclusion.
  3. Given a deliberately reintroduced contact-bearing file in the final payload, its privacy assertion fails nonzero before upload; generated intermediate HTML is not accidentally selected by Wrangler or artifact upload.
- Verify: clean-build a fixture with synthetic sentinels; scan the exact final release directory and serve it using deployment-equivalent asset routing; assert route responses and extract all four PDF texts for contacts. Record target names and exit codes, never real contacts.
- Boundary: do not strip contacts from the PDFs as a workaround, remove dossier downloads, or alter CV content.
- Handoff: document the final asset location and last pre-upload privacy assertion consumed by 1.2 and epic 2.

### 1.2 Bug — Deployment enforces the same complete validation contract as CI

- Covers: R5. Risk: high. Proposed severity: P1.
- After: 1.1 (final artifact boundary and privacy assertion).
- Scope: consolidate/equate validation for PR CI and all release entry points, including manual dispatch, preserving existing check names and short-circuit failure behavior.
- Acceptance:
  1. A passing candidate runs source/phone contracts, schema/type/build, rendered-output contracts, print/PDF checks and final release-boundary checks in CI and before upload; outputs are bound to the candidate SHA, with no later unvalidated mutation.
  2. Injecting one failing fixture at each stage yields nonzero and no upload/deploy call. In particular a check:rendered-only failure now blocks deployment.
  3. The five branch-required context names remain unchanged and failing/absent checks cannot be bypassed; a manual release cannot select arbitrary unvalidated non-main code.
- Verify: run the shared/equivalent validation entry points with stage-failure fixtures and a stubbed uploader, plus workflow static assertions for automatic/manual paths; compare the executed stage list and candidate SHA. Do not use real Cloudflare credentials for negative tests.
- Boundary: no requirement to run CodeQL/Gitleaks inside the application build; those remain required PR gates. No duplicate independent list of release validators that can silently drift.

### 1.3 Story — Executable output contracts guard both languages and document types

- Covers: R7; integrated evidence for R4/R5. Risk: medium.
- After: 1.2.
- Scope: repository-level regression cases for the release contract, not a general framework rollout; includes epic integration verification.
- Acceptance:
  1. The accepted fixture produces EN/FR public routes, compact PDFs and full dossiers; public routes have working anchor language/download links, no executable scripts/JS asset dependency, and expected CSP configuration. Private sentinels occur only in PDFs.
  2. Both compact PDFs pass at <=2 pages without a scale below 85%; a deliberately overflowing compact fixture fails. A full dossier fixture exceeding two pages succeeds at its full-output policy without a page cap.
  3. Phone-like test inputs covered by the guard, injected public script output and injected private non-PDF data each cause failure; regression checks cover templates/artifacts as well as YAML where applicable. No literal phone number or real contact is committed to fixtures/logs; construct synthetic phone test input at runtime without logging it.
  4. Final release routing checks cover EN/FR compact and dossier print variants; production smoke assertions are provided for epic 2.7 to execute after deployment.
- Verify: one documented repository command executes positive and negative fixtures with expected exit codes; PDF text/page inspection and final-payload scan are asserted, not merely eyeballed. Live closure proof is recorded by 2.7.
- Boundary: preserve detailed dossier/website content and existing localized certification/skill contracts; no new semantic translation engine or phone-detection claim covering every possible format.

## Epic 2 — Provable autonomous delivery and operator handoff

Proposed tracer: 2.1 follows one revision from merge evidence through workflow metadata to the live Worker identity, without mutation. First actual delivery demo is 2.3; final acceptance is 2.7. Setup/access is recorded where first needed, never silently assumed.

### 2.1 Spike — Resolve the release evidence gap and choose a safe trigger contract

- Covers: R1; decision prerequisite for R2/R3. Risk: high.
- After: 1.3 (safe artifact contract; serial shared-workflow lane).
- Unknown/access: read-only Worker revision visibility and relevant GitHub metadata may need an operator to grant observation access. Missing access blocks a verified conclusion; do not substitute investigator admin privileges for bot evidence.
- Acceptance:
  1. Reuse the pinned research, then collect only the missing current live revision/asset identity and necessary event metadata. A dated ledger distinguishes pinned findings, new observations, hypothesis and unavailable historical evidence.
  2. Evaluate the GITHUB_TOKEN suppression explanation against retained merge/workflow evidence. State supported, contradicted or unresolved per claim; absence of a run and a bot actor do not establish historical causation or prove live staleness.
  3. Record the selected automatic trigger strategy, candidate-SHA trust boundary, retry/idempotency/supersession policy, bounded missing-release detection interval and actionable notification destination. Compare alternatives only as needed; prefer existing credentials/events over adding a PAT.
  4. Define negative checks: untrusted PR/fork code cannot obtain deployment credentials; a failed/irrelevant run cannot trigger publication; a stale completion cannot roll back a newer accepted revision. If using workflow completion/artifacts, verify origin workflow, branch, SHA and result before consuming them.
- Verify: a reviewer can follow redacted evidence links to the dated revision ledger and decision table; deterministic event cases cover ordinary bot merge, GITHUB_TOKEN-origin merge, dispatch, failure, duplicate and out-of-order completion. Unknown historical events remain explicitly unknown.
- Output: one local delivery-contract/evidence companion for 2.2–2.7; no production repair under this spike.

### 2.2 Story — Verify the actual OpenClaw least-privilege principal

- Covers: R6. Risk: high.
- After: 2.1 (identity/evidence boundaries and chosen trigger credential needs).
- Unknown/access: actual OpenClaw-host credential metadata and effective permissions are unverified. A host custodian may need to supply redacted evidence; never request or print token values.
- Acceptance:
  1. Evidence ties OpenClaw's configured editing/auto-merge credential to a specific principal/token class, repository scope and effective permissions, distinguishing account privileges from the token's narrower grants; investigator access is not bot proof.
  2. Positive/negative authorization evidence demonstrates allowed branch/PR/auto-merge operations and disallowed protected-main direct update, protection administration/bypass and deployment-secret access. Use safe permission introspection or a disposable protected fixture; do not probe by pushing main or changing production protection.
  3. If evidence is inaccessible or permissions are excessive, report unresolved/noncompliant, with the exact owner/action needed; do not mark R6 satisfied or rotate credentials without separate authorization. Document sufficient Workers secret permissions separately from OpenClaw permissions without asserting scopes from secret names.
- Verify: redacted permission matrix, evidence source/time and safe authorization test/introspection results; a second reader can identify which claims are proved and which remain blocked.
- Handoff: 2.3 may use only the verified principal/credential contract; remediation outside existing authorization is an explicit execution blocker, not an automatic human review step on routine PRs.

### 2.3 Bug — Every qualifying automated main revision can initiate a safe release

- Covers: R2; uses R1/R6 evidence. Risk: high. Proposed severity: P1 (deployment-history coverage gap; exact historical cause unresolved).
- After: 2.2; 1.3 inherited through the epic gate.
- Scope: implement the chosen event chain, not a predetermined token replacement. Preserve required gates and separation from untrusted PR code.
- Acceptance:
  1. An ordinary authorized bot PR and an eligible non-major Dependabot PR complete existing required checks, squash auto-merge without required human approval and initiate the release path for their trusted main SHA, including the documented token-suppressed-push case.
  2. An unrelated/failed/cancelled/untrusted event cannot publish; duplicate triggers do not create inconsistent releases; a stale completion does not replace newer accepted main. If superseded revisions are coalesced, each is explicitly recorded as superseded by the eventual deployed SHA.
  3. Dispatch/retry accepts only a trusted main candidate and reuses complete validation; no new bypass, admin token or broadly privileged merge credential is introduced.
- Verify: deterministic event/replay tests and controlled GitHub integration cases with non-sensitive changes through normal PRs. Record merge SHA, required-check results, event/run and deployment identifiers. Production demo runs only during separately authorized implementation, never this planning session.

### 2.4 Story — Detect missing releases and prove what revision is served

- Covers: R3. Risk: high.
- After: 2.3 (actual trigger chain and SHA binding).
- Acceptance:
  1. For each accepted release, evidence binds trusted main SHA → validation run → exact release asset identity → Cloudflare deployment → served identity. A static non-sensitive marker or equivalent verifiable mechanism adds no public JavaScript/private information.
  2. The automated observer distinguishes failed, cancelled, superseded, missing/stale and successful delivery within the bound selected in 2.1; a workflow success alone is not a live-serving assertion. Missing triggers are detected even when no Deploy job exists.
  3. Simulated upload/smoke failure and an intentionally absent event produce actionable status at the selected destination; a tested retry/recovery path cannot publish an unvalidated or stale candidate. Older failed releases do not mislabel current served identity as successful.
- Verify: injected deterministic failure/missing-event scenarios with clock control where needed, plus compare real served identity to a completed trusted release. Preserve redacted evidence; no private-page contents in logs.

### 2.5 Story — Operating docs match the tested delivery and PDF contracts

- Covers: R8. Risk: low.
- After: 2.4 (final release/recovery behavior) and 2.2 (principal evidence).
- Acceptance:
  1. AGENTS.md/README/SECURITY and affected workflow/script comments consistently describe branch → PR → five checks → auto-merge → validated Workers release; contradictory direct-main routine instructions are removed while documented emergency admin behavior remains explicitly exceptional.
  2. Docs distinguish EN/FR compact <=2-page CVs from uncapped full dossiers, download/print behavior and build-only versus publicly served output; privacy claims agree with the actual payload boundary.
  3. Workers—not Pages—credential guidance, OpenClaw least privilege, release identity lookup, missing-release diagnosis, safe retry and escalation match verified behavior; unknown historical causation is not promoted to fact.
- Verify: documentation-to-code checklist references exact commands, route/target inventory, required context names and release diagnostics; run the documented local commands in the accepted fixture and exercise the recovery instructions using safe injected failures.

### 2.6 Story — Refactor sweep

- Covers: supports R2/R3/R8 maintainability; no new product scope. Risk: medium.
- After: 2.5 (transitively all prior epic entries).
- Scope: cleanup only from implementation plans/deferred findings in this epic, especially duplicate event/validation contracts or unclear names. No displaced requirements, credential migration, feature changes or new review gates; new scope becomes a separate proposal. If no cleanup remains, record that evidence rather than inventing work.
- Acceptance: deferred cleanup inventory is resolved or explicitly proposed separately; all prior positive/negative/event checks still pass with identical external contracts.
- Verify: rerun the established regression/event commands and compare public asset/trigger contracts; record inventory and results for 2.7.

### 2.7 Story — Demonstrate autonomous delivery end to end and accept the initiative

- Covers: integrated R1–R8 closure, not duplicate ownership. Risk: high.
- After: 2.6 and 1.3.
- Acceptance:
  1. A controlled ordinary OpenClaw-principal bilingual PR and an eligible Dependabot PR each traverse the protected branch gates and chosen release chain without required human review. Capture checks, merge SHA and revision/artifact/run/deployment/served identity links; supersession, if selected, has explicit evidence.
  2. Final EN/FR public routes and all print-route aliases are private-contact-free with effective script-src 'none' and no executable scripts; PDF downloads retain intended contacts, compact PDFs satisfy <=2 pages at >=85%, and full dossiers remain uncapped. Scan/read real outputs in memory and record booleans, not private text. Include remaining deployable non-PDF assets in the scan.
  3. Invalid YAML/source, rendered-only drift, compact overflow, private HTML leakage, untrusted event, missing trigger and deployment/smoke failure all demonstrate blocked publication or correctly surfaced failure in safe fixtures; retry/recovery and stale-release detection meet the selected contract.
  4. OpenClaw principal verification and operating docs are complete; unresolved access/permission gaps block acceptance. Closing children alone does not prove Done when.
- Verify: run repository regression/event commands plus hosted integration/smoke procedure and attach a redacted acceptance matrix R1–R8/C1–C4. Never merge invalid test content or intentionally leak contacts to test production.
- Boundary: hosting/access provisioning approval, if needed, is exceptional setup, not a recurring merge/release approval requirement.

## Dependency and verification summary

- Ordered lane: 1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7. Additional explicit links above clarify consumed outputs; no dependency cycle.
- No concurrent writers are proposed: artifact and delivery work both touch deploy.yml and final release contracts. Observation-only preparation may happen separately without modifying shared files.
- Epic 1 owns fixture setup and final-payload checks; epic 2 consumes them. Epic 2.1 owns deployment-mechanism decisions; 2.2 owns actual-principal proof; later stories cannot presume either.
- Tests belong to every change. 1.3 provides reusable output regression cases; 2.7 is the closing end-to-end acceptance suite, not a deferred substitute for per-ticket tests.
- More than three epic-2 entries: 2.6 is the proposed cleanup sweep, after all implementation/docs and before closing E2E.
- No mandatory plan/done checkpoints or routine human-review steps are proposed. Exceptional access may block 2.1/2.2 and must be recorded at execution rather than hidden by an admin credential.

## Decisions still to settle

1. Settled: user approved the two-epic split and initiative scope, authorizing local epic and leaf files under tickets/ using these criteria. No commit or implementation is authorized.
2. During 2.1, choose the mechanism and measurable stale-release bound/notification destination from available evidence. Planning does not need a speculative answer now.
3. During 2.2, obtain actual principal evidence and separately authorize any noncompliance remediation. Until then, least privilege is unproved, not a configuration fact.
