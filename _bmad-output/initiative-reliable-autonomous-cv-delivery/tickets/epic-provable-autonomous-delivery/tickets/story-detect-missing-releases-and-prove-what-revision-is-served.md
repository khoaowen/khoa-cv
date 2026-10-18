---
id: 4
type: story
title: "Detect missing releases and prove what revision is served"
parent: epic-provable-autonomous-delivery
covers: [R3]
after: [3]
refined: true
hitl: false
risk: high
---

# Detect missing releases and prove what revision is served

## Description

Detect missing releases and prove what revision is served.

## Acceptance Criteria

1. For each accepted release, evidence binds trusted main SHA → validation run → exact release asset identity → Cloudflare deployment → served identity. A static non-sensitive marker or equivalent verifiable mechanism adds no public JavaScript/private information.
2. The automated observer distinguishes failed, cancelled, superseded, missing/stale and successful delivery within the bound selected in 2.1; a workflow success alone is not a live-serving assertion. Missing triggers are detected even when no Deploy job exists.
3. Simulated upload/smoke failure and an intentionally absent event produce actionable status at the selected destination; a tested retry/recovery path cannot publish an unvalidated or stale candidate. Older failed releases do not mislabel current served identity as successful.

## Verification

Verify: injected deterministic failure/missing-event scenarios with clock control where needed, plus compare real served identity to a completed trusted release. Preserve redacted evidence; no private-page contents in logs.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-provable-autonomous-delivery/epic-provable-autonomous-delivery.md, Requirements R3 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 2.4.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
