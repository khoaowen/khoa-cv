# Resume reliable autonomous CV delivery

## Saved workstreams

- Implementation branch: `khoaowen/1.1-cv-private-assets` (based on `aa41057`, the BMad setup commit on main).
- Read-only preparation branch: `khoaowen/2.1-cv-delivery-evidence`; report: `delivery-evidence-2.1.md`.
- Planning: `_bmad-output/initiative-reliable-autonomous-cv-delivery/` on the implementation branch.
- Original research baseline: `d515274f1802ea5715c3ce3a2eaa34ce6a5fb308`. The later main commit adds BMad setup, not application/workflow changes.

## Current status

Ticket 1.1 is implemented locally and saved as a checkpoint, not accepted as production complete. Changes separate `.private-build/` (private print HTML) from `dist/` (the sole deployable payload), add privacy assertions and release/fixture regression tests, and document the handoff boundary. Latest file versions include follow-up hardening (`sentinels.mjs`, synthetic fixture testing and AGENTS.md asset-boundary notes). Do not mistake an earlier test report for proof of these final versions.

The original agent reported build, route-alias rejection, negative privacy tests and PDF checks passing. A subsequent read-only inspection independently passed the then-current release privacy assertion and diff whitespace check; inspected artifacts had two-page compact PDFs, 13/14-page dossiers and no scripts in public HTML. Run verification again on this machine before acceptance. No saved BMad build plan/formal review record was found during that inspection. No ticket has been marked done; the board still lists 1.1 as ready to start. Reconcile that bookkeeping after review/acceptance rather than reimplementing the ticket.

Ticket 2.1 has a useful preparation report, not a finished spike. It preserves the deployment-history gap and GITHUB_TOKEN suppression as a supported hypothesis, not proven historical causation. Actual live Cloudflare revision and OpenClaw principal permissions remain unresolved. `workflow_run` and a 15-minute stale-release bound are proposals, not accepted implementation decisions. Notification ownership is unresolved.

## On another machine

```bash
git fetch origin
git switch --track origin/khoaowen/1.1-cv-private-assets
npm ci
npx playwright install chromium
npm run build:all
```

If the local branch already exists, switch to it rather than recreating it; inspect local work before pulling. On Linux, Playwright may require its documented browser OS dependencies.

Read the preparation report without merging its branch:

```bash
git show origin/khoaowen/2.1-cv-delivery-evidence:delivery-evidence-2.1.md
```

Any absolute `/Users/khoa/...` paths in the original research/report are historical local locators. Use the repository-relative `_bmad-output/...` paths on this machine. Orca workspace cards, sessions, installed dependencies, generated PDFs and private build intermediates are not Git content and do not migrate with these branches.

## Next step

1. Read AGENTS.md, initiative/epic 1 and ticket 1.1; inspect the existing implementation, do not restart it.
2. Confirm/perform implementation review, run the final tests and resolve material findings. Record the actual review/verification evidence and reconcile 1.1's local ticket state only when accepted.
3. Continue ticket 1.2, then 1.3 on this implementation baseline. Deploy still needs validation parity; do not implement trigger changes prematurely.
4. Keep 2.1 report as evidence for the later spike; preserve unresolved access/decision blockers.

## Authorization and safeguards

The user explicitly authorized committing/pushing these work-in-progress branches to resume on another machine. This is checkpoint preservation only, not authorization to open/merge a PR, publish tickets, deploy, change settings or credentials, or mark tickets accepted. All application changes must eventually go through protected-main PR checks; do not push directly to main.

Preserve bilingual output, PDF-only private contacts, no phone numbers, JavaScript-free public pages, compact CV <=2 pages with >=85% scale, uncapped full dossiers and no mandatory human PR review. Never commit `.private-build/`, `dist/`, credentials, private-contact evidence or local IDE files.
