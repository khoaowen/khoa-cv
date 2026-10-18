---
id: 2
type: bug
title: "Deployment enforces the same complete validation contract as CI"
parent: epic-safe-release-assets
covers: [R5]
after: [1]
refined: true
hitl: false
risk: high
---

# Deployment enforces the same complete validation contract as CI

## Description

consolidate/equate validation for PR CI and all release entry points, including manual dispatch, preserving existing check names and short-circuit failure behavior.

## Reproduction

At pinned d515274, introduce a fixture that violates only the rendered-output contract. Compare PR CI build:all against the Deploy build:site then pdf chain with publication stubbed. Actual workflow omits standalone rendered checks; expected all release paths reject the fixture.

## Cause Hypothesis

Independent CI and deployment command chains drifted when rendered-output validation was added.

## Acceptance Criteria

1. A passing candidate runs source/phone contracts, schema/type/build, rendered-output contracts, print/PDF checks and final release-boundary checks in CI and before upload; outputs are bound to the candidate SHA, with no later unvalidated mutation.
2. Injecting one failing fixture at each stage yields nonzero and no upload/deploy call. In particular a check:rendered-only failure now blocks deployment.
3. The five branch-required context names remain unchanged and failing/absent checks cannot be bypassed; a manual release cannot select arbitrary unvalidated non-main code.

4. Or: if the reproduction on the execution baseline already satisfies the intended behavior, record reproducible proof that no change is needed; do not claim the historical hypothesis proved. Regression checks must still cover the reported condition and related valid cases.

## Verification

Verify: run the shared/equivalent validation entry points with stage-failure fixtures and a stubbed uploader, plus workflow static assertions for automatic/manual paths; compare the executed stage list and candidate SHA. Do not use real Cloudflare credentials for negative tests.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

Boundary: no requirement to run CodeQL/Gitleaks inside the application build; those remain required PR gates. No duplicate independent list of release validators that can silently drift.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-safe-release-assets/epic-safe-release-assets.md, Requirements R5 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 1.2.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
