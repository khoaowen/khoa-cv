---
type: epic
title: Safe, consistently validated release assets
parent: initiative-reliable-autonomous-cv-delivery
covers: ["R4", "R5", "R7"]
sources: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/initiative-reliable-autonomous-cv-delivery.md"]
companions: ["_bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md"]
after: []
refined: true
risk: high
---

# Safe, consistently validated release assets

## Description

Validated privacy-safe EN/FR release assets preserve compact CVs and full dossiers; production retrieval evidence completes acceptance.

## Outcome

Validated privacy-safe EN/FR release assets preserve compact CVs and full dossiers; production retrieval evidence completes acceptance.

## Requirements

- R4 (parent R4): Private email/address are available only in downloadable PDF binaries, never in deployed non-PDF assets or retrievable print HTML; sentinel-based artifact and HTTP checks reject leakage while PDF checks confirm intended contacts remain.
- R5 (parent R5): PR CI and deployment enforce the same source, schema/type, rendered-output, print/PDF and release-boundary contract on the exact candidate revision/assets; a failure at any stage prevents publication, including manual dispatch paths.
- R7 (parent R7): Regression checks preserve EN/FR public pages, compact CV PDFs and full dossier PDFs, PDF-only private fields, no phone numbers and JavaScript-free public output; negative fixtures demonstrate rejection and compact PDFs remain within two pages while dossiers have no page limit.

## Constraints

The initiative's C1–C5 apply in full, including this session's planning-only authorization. No implementation or settings change is authorized by creating these tickets.

## Done when

1. Entries 1.1–1.3 prove the final artifact boundary and complete validation contract with positive and negative fixtures.
2. EN/FR compact CVs meet the two-page/readable-scale budget; full dossiers remain uncapped and private contacts remain in PDFs only.
3. The artifact handoff permits epic 2 to start; this epic stays open until entry 2.7 records integrated production retrieval/CSP/privacy evidence.

## Boundaries

Owns final asset privacy, validation parity and output regression cases. Does not choose the bot principal, release trigger or notification channel; epic 2 owns those. Preserve CV content, downloads, bilingual routes, zero public JavaScript and uncapped dossiers.

## References

- parent — _bmad-output/initiative-reliable-autonomous-cv-delivery/initiative-reliable-autonomous-cv-delivery.md, Requirements and Constraints.
- approved breakdown — _bmad-output/initiative-reliable-autonomous-cv-delivery/proposed-backlog.md, Epic 1 and dependency summary.

## Notes

- Decision: Scope and split approved by the user for local planning only; no commit, implementation or publication.
- Decision: Entry 1.1 is the tracer from source through print/PDF generation to the safe final asset payload. Entries 1.1 → 1.2 → 1.3 form one shared artifact/workflow lane. Production closure is delegated to 2.7, not a prerequisite for the artifact handoff.
