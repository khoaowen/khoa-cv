---
id: 3
type: story
title: "Executable output contracts guard both languages and document types"
parent: epic-safe-release-assets
covers: [R7]
after: [2]
refined: true
hitl: false
risk: medium
---

# Executable output contracts guard both languages and document types

## Description

repository-level regression cases for the release contract, not a general framework rollout; includes epic integration verification.

## Acceptance Criteria

1. The accepted fixture produces EN/FR public routes, compact PDFs and full dossiers; public routes have working anchor language/download links, no executable scripts/JS asset dependency, and expected CSP configuration. Private sentinels occur only in PDFs.
2. Both compact PDFs pass at <=2 pages without a scale below 85%; a deliberately overflowing compact fixture fails. A full dossier fixture exceeding two pages succeeds at its full-output policy without a page cap.
3. Phone-like test inputs covered by the guard, injected public script output and injected private non-PDF data each cause failure; regression checks cover templates/artifacts as well as YAML where applicable. No literal phone number or real contact is committed to fixtures/logs; construct synthetic phone test input at runtime without logging it.
4. Final release routing checks cover EN/FR compact and dossier print variants; production smoke assertions are provided for epic 2.7 to execute after deployment.

## Verification

Verify: one documented repository command executes positive and negative fixtures with expected exit codes; PDF text/page inspection and final-payload scan are asserted, not merely eyeballed. Live closure proof is recorded by 2.7.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

Boundary: preserve detailed dossier/website content and existing localized certification/skill contracts; no new semantic translation engine or phone-detection claim covering every possible format.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-safe-release-assets/epic-safe-release-assets.md, Requirements R7 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 1.3.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: medium — regression or operating-contract drift can undermine maintainable delivery.
