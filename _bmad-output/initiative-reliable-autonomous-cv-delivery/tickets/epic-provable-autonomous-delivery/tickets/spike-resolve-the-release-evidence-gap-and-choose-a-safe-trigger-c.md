---
id: 1
type: spike
title: "Resolve the release evidence gap and choose a safe trigger contract"
parent: epic-provable-autonomous-delivery
covers: [R1]
after: [1.3]
refined: true
hitl: false
risk: high
---

# Resolve the release evidence gap and choose a safe trigger contract

## Description

Resolve the release evidence gap and choose a safe trigger contract.

## Approach

Use the completed research first; collect only missing evidence with read-only access, compare viable event strategies against the acceptance cases, and record the answer in a delivery-contract/evidence companion beside this epic. Entries 2.2–2.7 consume that answer. Bound work to one agent session; if access/evidence cannot be obtained, record the precise blocker rather than expanding into historical archaeology. No production mutation.

## Acceptance Criteria

1. Reuse the pinned research, then collect only the missing current live revision/asset identity and necessary event metadata. A dated ledger distinguishes pinned findings, new observations, hypothesis and unavailable historical evidence.
2. Evaluate the GITHUB_TOKEN suppression explanation against retained merge/workflow evidence. State supported, contradicted or unresolved per claim; absence of a run and a bot actor do not establish historical causation or prove live staleness.
3. Record the selected automatic trigger strategy, candidate-SHA trust boundary, retry/idempotency/supersession policy, bounded missing-release detection interval and actionable notification destination. Compare alternatives only as needed; prefer existing credentials/events over adding a PAT.
4. Define negative checks: untrusted PR/fork code cannot obtain deployment credentials; a failed/irrelevant run cannot trigger publication; a stale completion cannot roll back a newer accepted revision. If using workflow completion/artifacts, verify origin workflow, branch, SHA and result before consuming them.

## Verification

Verify: a reviewer can follow redacted evidence links to the dated revision ledger and decision table; deterministic event cases cover ordinary bot merge, GITHUB_TOKEN-origin merge, dispatch, failure, duplicate and out-of-order completion. Unknown historical events remain explicitly unknown.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

Output: one local delivery-contract/evidence companion for 2.2–2.7; no production repair under this spike.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-provable-autonomous-delivery/epic-provable-autonomous-delivery.md, Requirements R1 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 2.1.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
- Open question: read-only Worker revision visibility and relevant GitHub metadata may need an operator to grant observation access. Missing access blocks a verified conclusion; do not substitute investigator admin privileges for bot evidence.
