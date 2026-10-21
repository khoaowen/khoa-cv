---
id: 1
type: bug
title: "Private contacts are excluded from deployable non-PDF output"
parent: epic-safe-release-assets
covers: [R4]
after: []
refined: true
hitl: false
risk: high
---

# Private contacts are excluded from deployable non-PDF output

## Description

define and enforce the final asset boundary for compact and dossier output in both languages. Build-time private HTML may exist only outside the deployable payload and must not be published in public CI artifacts/logs. If print routes remain public, their served HTML must be contact-free.

## Reproduction

At pinned d515274, supply synthetic private contacts for both locales and generate all four PDFs. Inspect the non-PDF final assets selected for deployment and the compact/dossier print routes and aliases. Actual source retains contact-bearing print HTML; expected final non-PDF output has no private contacts. This is a source-level reproduction plan, not a claim of confirmed live exposure.

## Cause Hypothesis

Build-only private print HTML and public release assets share the selected static output directory; indexing directives do not prevent retrieval.

## Acceptance Criteria

1. Given synthetic private email/address sentinels in both locales, generating the release produces four downloadable PDFs with the expected private contacts and no contact-bearing non-PDF release asset, including links, metadata, encoded output and alternate retained copies.
2. Given each compact/dossier print route and its direct .html/index.html forms, the final static server returns either no resource or contact-free HTML; noindex/robots/CSP alone does not count as exclusion.
3. Given a deliberately reintroduced contact-bearing file in the final payload, its privacy assertion fails nonzero before upload; generated intermediate HTML is not accidentally selected by Wrangler or artifact upload.

4. Or: if the reproduction on the execution baseline already satisfies the intended behavior, record reproducible proof that no change is needed; do not claim the historical hypothesis proved. Regression checks must still cover the reported condition and related valid cases.

## Verification

Verify: clean-build a fixture with synthetic sentinels; scan the exact final release directory and serve it using deployment-equivalent asset routing; assert route responses and extract all four PDF texts for contacts. Record target names and exit codes, never real contacts.

## Boundaries

The parent epic and initiative constraints apply in full. This ticket is planning only until execution is separately authorized.

Boundary: do not strip contacts from the PDFs as a workaround, remove dossier downloads, or alter CV content.

Handoff: document the final asset location and last pre-upload privacy assertion consumed by 1.2 and epic 2.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/tickets/epic-safe-release-assets/epic-safe-release-assets.md, Requirements R4 and Constraints.
- approved detail — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, entry 1.1.

## Notes

- Decision: User approved these criteria as part of the scope/split; local ticket-file creation only, no execution or commit.
- Risk: high — incorrect privacy, authorization or release behavior can expose data or publish an untrusted/stale revision. Additional check: independently compare redacted final evidence against the initiative constraints before accepting this ticket.
