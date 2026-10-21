---
id: 2
type: story
title: "Verify the actual OpenClaw least-privilege principal"
parent: epic-provable-autonomous-delivery
covers: [R6]
after: [1]
refined: true
hitl: false
risk: high
---

# Verify the actual OpenClaw least-privilege principal

## Description

Verify the actual OpenClaw least-privilege principal.

## Acceptance Criteria

1. Evidence ties OpenClaw's configured editing/auto-merge credential to a specific principal/token class, repository scope and effective permissions, distinguishing account privileges from the token's narrower grants; investigator access is not bot proof.
2. Positive/negative authorization evidence demonstrates allowed branch/PR/auto-merge operations and disallowed protected-main direct update, protection administration/bypass and deployment-secret access. Use safe permission introspection or a disposable protected fixture; do not probe by pushing main or changing production protection.
3. If evidence is inaccessible or permissions are excessive, report unresolved/noncompliant, with the exact owner/action needed; do not mark R6 satisfied or rotate credentials without separate authorization. Document sufficient Workers secret permissions separately from OpenClaw permissions without asserting scopes from secret names.

## Verification

Verify: redacted permission matrix, evidence source/time and safe authorization test/introspection results; a second reader can identify which claims are proved and which remain blocked.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

Handoff: 2.3 may use only the verified principal/credential contract; remediation outside existing authorization is an explicit execution blocker, not an automatic human review step on routine PRs.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-provable-autonomous-delivery/epic-provable-autonomous-delivery.md, Requirements R6 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 2.2.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
- Unknown: actual OpenClaw-host credential metadata and effective permissions are unverified. A host custodian may need to supply redacted evidence; never request or print token values.
