---
id: 5
type: story
title: "Operating docs match the tested delivery and PDF contracts"
parent: epic-provable-autonomous-delivery
covers: [R8]
after: [4, 2]
refined: true
hitl: false
risk: low
---

# Operating docs match the tested delivery and PDF contracts

## Description

Operating docs match the tested delivery and PDF contracts.

## Acceptance Criteria

1. AGENTS.md/README/SECURITY and affected workflow/script comments consistently describe branch → PR → five checks → auto-merge → validated Workers release; contradictory direct-main routine instructions are removed while documented emergency admin behavior remains explicitly exceptional.
2. Docs distinguish EN/FR compact <=2-page CVs from uncapped full dossiers, download/print behavior and build-only versus publicly served output; privacy claims agree with the actual payload boundary.
3. Workers—not Pages—credential guidance, OpenClaw least privilege, release identity lookup, missing-release diagnosis, safe retry and escalation match verified behavior; unknown historical causation is not promoted to fact.

## Verification

Verify: documentation-to-code checklist references exact commands, route/target inventory, required context names and release diagnostics; run the documented local commands in the accepted fixture and exercise the recovery instructions using safe injected failures.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-provable-autonomous-delivery/epic-provable-autonomous-delivery.md, Requirements R8 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 2.5.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: low — regression or operating-contract drift can undermine maintainable delivery.
