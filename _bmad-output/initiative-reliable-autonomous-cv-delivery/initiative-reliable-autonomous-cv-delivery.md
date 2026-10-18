---
type: initiative
title: Reliable autonomous CV delivery
parent: none
risk: high
sources: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/research-cv-delivery-pipeline/research-cv-delivery-pipeline.md"]
companions: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md"]
---

# Reliable autonomous CV delivery

## Description

Make the existing OpenClaw-built bilingual CV site's protected-PR-to-Cloudflare delivery reliable and maintainable without mandatory human review. This is a bounded repair of existing delivery, privacy and operating contracts, not a new product or full PRD. Evidence is the completed research pinned to fetched origin/main d515274f1802ea5715c3ce3a2eaa34ce6a5fb308, observed 2026-10-18; local HEAD f4e90cb is intentionally different.

## Outcome

A qualifying bilingual CV change or eligible automated dependency update merges through the existing gates and produces a validated, privacy-safe release whose served revision can be matched to the merged main SHA; failures are visible and recoverable without bypassing protection.

## Requirements

- R1 (research §§1, 7): Establish an evidence-linked deployment baseline distinguishing returned workflow history, live revision and historical hypotheses; an investigator can reproduce the recorded conclusion without inferring historical tokens from actor names.
- R2 (research §§1, 5): Qualifying main revisions from ordinary bot PRs and eligible Dependabot auto-merges reach deployment automatically, including events that do not produce a push workflow; controlled integration cases prove the selected trigger chain without review approvals or a new broadly privileged credential.
- R3 (research §§1, 7): Each release exposes a trustworthy link between main SHA, validation run, artifact and deployed revision; an automated check distinguishes success, failure, supersession and a missing/stale release, and a runbook demonstrates recovery.
- R4 (research §4): Private email/address are available only in downloadable PDF binaries, never in deployed non-PDF assets or retrievable print HTML; sentinel-based artifact and HTTP checks reject leakage while PDF checks confirm intended contacts remain.
- R5 (research §§1, 2, 7): PR CI and deployment enforce the same source, schema/type, rendered-output, print/PDF and release-boundary contract on the exact candidate revision/assets; a failure at any stage prevents publication, including manual dispatch paths.
- R6 (research §3): Identify OpenClaw's actual editing/auto-merge principal and effective repository/token permissions using redacted evidence; demonstrate that its routine credential cannot administer protection, bypass PR gates or directly update protected main, and does not possess deployment secrets.
- R7 (research §§2, 4, 6): Regression checks preserve EN/FR public pages, compact CV PDFs and full dossier PDFs, PDF-only private fields, no phone numbers and JavaScript-free public output; negative fixtures demonstrate rejection and compact PDFs remain within two pages while dossiers have no page limit.
- R8 (research §§1, 3, 6): Contributor, security and operator documentation describes the tested PR/auto-merge/release flow, Workers credential requirements, privacy boundary, compact-versus-dossier behavior and recovery; runnable commands and links agree with implemented behavior.

## Constraints

- C1 (user; AGENTS.md Contribution flow): Keep protected-branch PR flow and five existing required contexts: Build and typecheck; PDF page budget; Analyze JavaScript and TypeScript; Gitleaks; Review dependency changes. No mandatory approving review, plan approval or routine human release checkpoint. Do not weaken protection to solve a trigger issue.
- C2 (user; AGENTS.md Hard rules): Preserve bilingual content and link-only language switching; no phone numbers; public pages remain JavaScript-free with script-src 'none'; private email/address are PDF-only. No real private values or secrets in tickets, logs, fixtures or verification evidence.
- C3 (user; research §§2, 6): Compact EN/FR CV PDFs must fit two pages without dropping below the existing readable 85% floor. Full EN/FR dossiers have no page limit. Do not silently redefine dossier output to satisfy the compact budget.
- C4 (user; research §3): Routine automation uses a non-admin, repo-scoped principal; deployment credentials stay in Actions secrets, not OpenClaw or source. Exceptional provisioning/access work must not become routine human review.
- C5 (user request): This session is planning only: local planning files are permitted; no implementation, settings changes, deploy, reset, checkout, overwrite of unrelated work, commit, push or external ticket publication.

## Done when

1. R1/R6 have redacted evidence or explicit unresolved blockers; an unverifiable principal is not accepted as compliant.
2. An ordinary bot PR and an eligible Dependabot PR demonstrate merge-to-live provenance without required human review (R2/R3).
3. Deliberate source, rendered-output, PDF-budget and privacy failures cannot publish, through automatic or manual release paths (R4/R5/R7).
4. Final artifacts and live EN/FR responses satisfy privacy/no-JavaScript rules; both compact CVs fit two pages and both full dossiers are generated without a page cap (R4/R7).
5. Failure, stale-release detection and safe recovery are demonstrated, and checked operating instructions reproduce the accepted flow (R3/R8).

These are future execution/closure checks, not results claimed by this planning session.

## Boundaries

In: release assets and validators; release triggering, provenance and failure visibility; bounded runtime/permission verification; documentation needed to operate those changes.

Out: CV rewriting/translation, new features or redesign, new hosting platform, broad security hardening, general test-framework adoption, arbitrary dependency upgrades, initial OpenClaw provisioning archaeology and exhaustive historical token reconstruction. Do not add a dossier page cap or mandatory human review. Existing major-Dependabot manual handling is not expanded or redesigned here.

- Touch point: GitHub protection and required checks — preserve and verify; owner: proposed epic 2.
- Touch point: OpenClaw host/principal — gather redacted effective-access evidence, no bot redesign; owner: proposed epic 2.
- Touch point: Cloudflare Workers and Actions secrets — observe revision/permissions and use existing deployment boundary; owner: proposed epic 2.
- Touch point: Astro, Chromium and PDF targets — preserve output contracts; owner: proposed epic 1.
- Touch point: content YAMLs — inputs to validators, not CV-edit scope; owner: proposed epic 1.
- Touch point: CodeQL, Gitleaks, dependency review, Scorecard — retain existing role; owner: proposed epic 2. No new Scorecard threshold.
- Tracer path: bilingual source → validated PDFs and safe release assets (epic 1) → protected auto-merge → automatic release → served revision and recovery proof (epic 2).

## References

- research — research-cv-delivery-pipeline/research-cv-delivery-pipeline.md; all sections, source citations and retained imports remain the evidence authority.
- proposed breakdown — proposed-backlog.md; candidate epic/story scope, dependencies, acceptance criteria and verification.
- constraints — AGENTS.md; Contribution flow and Hard rules, interpreted with the user's explicit compact/dossier distinction.

## Notes

- Decision: 2026-10-18 — User requests local planning only; no commit or external publication, overriding skill defaults.
- Decision: 2026-10-18 — Use completed pinned research; preserve local HEAD and unrelated untracked setup/work.
- Source conflict: AGENTS.md's direct-main update wording conflicts with its protected-PR instructions; R8 must remove the contradiction, not relax C1.
- Source conflict: AGENTS.md says every PDF fits two pages; pinned code and user distinguish compact two-page CVs from uncapped dossiers. C3 is the explicit scope authority.
- Decision: User approved the scope and two-epic, ten-entry split: safe release artifacts, then autonomous delivery with operator handoff. Epic 2 starts from entries 1.1–1.3's artifact handoff, not epic 1 production closure. Approval authorizes local ticket files only, not implementation, commit or publication.
- Assumption: Repository-level deterministic regression checks plus bounded hosted integration evidence are sufficient; a new general test framework is not required.
- Open question: What revision/assets are live now, and which historical merges used which tokens? Epic 2 baseline investigates; unknown historical attribution may remain unknown if evidence is unavailable.
- Open question: Which effective principal/token does OpenClaw use, and who can provide redacted host evidence? Epic 2 credential verification gates any claim of least privilege; no secret values are requested.
- Open question: Which trigger/release mechanism, stale-release detection bound and failure notification channel fit the available permissions? Epic 2 chooses and records these before repair; no historical diagnosis is assumed.
- Open question: If current bot access is noncompliant, what narrowly scoped provisioning remediation is authorized? Epic 2 records a blocker rather than changing credentials under this planning request.
