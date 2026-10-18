---
type: epic
title: Provable autonomous delivery and operator handoff
parent: initiative-reliable-autonomous-cv-delivery
covers: ["R1", "R2", "R3", "R6", "R8"]
sources: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/initiative-reliable-autonomous-cv-delivery.md"]
companions: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md"]
after: []
refined: true
risk: high
---

# Provable autonomous delivery and operator handoff

## Description

Routine bot and eligible Dependabot PRs reach the live Worker with trustworthy provenance, least-privilege evidence and tested recovery without mandatory human review.

## Outcome

Routine bot and eligible Dependabot PRs reach the live Worker with trustworthy provenance, least-privilege evidence and tested recovery without mandatory human review.

## Requirements

- R1 (parent R1): Establish an evidence-linked deployment baseline distinguishing returned workflow history, live revision and historical hypotheses; an investigator can reproduce the recorded conclusion without inferring historical tokens from actor names.
- R2 (parent R2): Qualifying main revisions from ordinary bot PRs and eligible Dependabot auto-merges reach deployment automatically, including events that do not produce a push workflow; controlled integration cases prove the selected trigger chain without review approvals or a new broadly privileged credential.
- R3 (parent R3): Each release exposes a trustworthy link between main SHA, validation run, artifact and deployed revision; an automated check distinguishes success, failure, supersession and a missing/stale release, and a runbook demonstrates recovery.
- R6 (parent R6): Identify OpenClaw's actual editing/auto-merge principal and effective repository/token permissions using redacted evidence; demonstrate that its routine credential cannot administer protection, bypass PR gates or directly update protected main, and does not possess deployment secrets.
- R8 (parent R8): Contributor, security and operator documentation describes the tested PR/auto-merge/release flow, Workers credential requirements, privacy boundary, compact-versus-dossier behavior and recovery; runnable commands and links agree with implemented behavior.

## Constraints

The initiative's C1–C5 apply in full, including this session's planning-only authorization. No implementation or settings change is authorized by creating these tickets.

## Done when

1. Redacted baseline and actual-principal evidence meet R1/R6; unavailable evidence blocks compliance claims.
2. Ordinary bot and eligible Dependabot merges demonstrate automatic trusted-main releases and served revision linkage.
3. Missing, failed and stale delivery is detected and safe recovery is tested.
4. Operating documentation matches the accepted behavior and entry 2.7 proves integrated production delivery, including epic 1's output invariants.

## Boundaries

Consumes the validated artifact contract from 1.1–1.3; does not redesign CV output, weaken protection, add mandatory approving reviews or redesign OpenClaw. Credential changes requiring new authorization stay blocked. Historical cause may remain unresolved; future behavior must be proved.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/initiative-reliable-autonomous-cv-delivery.md, Requirements and Constraints.
- approved breakdown — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, Epic 2 and dependency summary.

## Notes

- Decision: Scope and split approved by the user for local planning only; no commit, implementation or publication.
- Decision: Entry 2.1 is the read-only revision/evidence tracer; entry 2.3 is the first actual delivery demo. Entry 2.1 owns shared release mechanism decisions; 2.2 owns principal proof. Entries 2.1–2.7 form one lane; 2.6 is the approved cleanup sweep before final E2E. No routine human review/checkpoint is introduced.
- Waits on epic-safe-release-assets because: entries 1.1–1.3 supply the validated artifact handoff; whole-epic production closure is not required.
- Open question: Actual OpenClaw principal/access evidence remains unverified; entry 2.2 may require separately authorized custodian assistance.
- Open question: Entry 2.1 must settle trigger strategy, stale-release bound and notification destination before 2.3/2.4 implement them.
