---
id: 3
type: bug
title: "Every qualifying automated main revision can initiate a safe release"
parent: epic-provable-autonomous-delivery
covers: [R2]
after: [2, 1.3]
refined: true
hitl: false
risk: high
---

# Every qualifying automated main revision can initiate a safe release

## Description

implement the chosen event chain, not a predetermined token replacement. Preserve required gates and separation from untrusted PR code.

## Reproduction

Use the retained deployment-history baseline: current main d515274 has no corresponding deployment in returned history. During authorized execution, replay a GITHUB_TOKEN-origin merge event and the selected trigger cases against a stubbed publisher. Expected every qualifying trusted main revision releases or is explicitly superseded; historical causation and current live revision require 2.1 evidence.

## Cause Hypothesis

Push suppression for events caused by GITHUB_TOKEN is a supported explanation for a missed release, not proof of the credential used by each historical merge.

## Acceptance Criteria

1. An ordinary authorized bot PR and an eligible non-major Dependabot PR complete existing required checks, squash auto-merge without required human approval and initiate the release path for their trusted main SHA, including the documented token-suppressed-push case.
2. An unrelated/failed/cancelled/untrusted event cannot publish; duplicate triggers do not create inconsistent releases; a stale completion does not replace newer accepted main. If superseded revisions are coalesced, each is explicitly recorded as superseded by the eventual deployed SHA.
3. Dispatch/retry accepts only a trusted main candidate and reuses complete validation; no new bypass, admin token or broadly privileged merge credential is introduced.

4. Or: if the reproduction on the execution baseline already satisfies the intended behavior, record reproducible proof that no change is needed; do not claim the historical hypothesis proved. Regression checks must still cover the reported condition and related valid cases.

## Verification

Verify: deterministic event/replay tests and controlled GitHub integration cases with non-sensitive changes through normal PRs. Record merge SHA, required-check results, event/run and deployment identifiers. Production demo runs only during separately authorized implementation, never this planning session.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-provable-autonomous-delivery/epic-provable-autonomous-delivery.md, Requirements R2 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 2.3.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
