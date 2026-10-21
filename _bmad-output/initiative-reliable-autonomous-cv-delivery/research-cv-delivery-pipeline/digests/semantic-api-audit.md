# Semantic API/documentation citation audit

**Scope:** Report claims citing [1]–[10]; inspected all ten corresponding redacted JSON snapshots and `imports/github-workflow-triggering.md`. Independently fetched GitHub’s triggering documentation and manually reviewed relevant official-documentation passages returned by `source_check`. No other agent digests, private values, mutations, or working-tree code were used.

## 1. Verified claims

- **Supported — branch protections and merge settings.** §1, paragraph beginning “GitHub currently requires…” accurately matches [1] `imports/protection.json`: the five named contexts, `strict:true`, zero required approving reviews, disabled administrator enforcement, disabled force-push/deletion allowances, and required linear history. [2] `imports/repository.json` confirms auto-merge, squash merge and branch deletion settings. Zero required approvals establishes policy—not that nobody ever reviews. **High confidence.**

- **Supported — empty ruleset response.** The same §1 paragraph correctly says “No repository rulesets were returned.” [3] `imports/rulesets.json` contains `data:[]`. This appropriately describes the response rather than claiming that no other protection mechanisms exist. **High confidence.**

- **Supported — observed deployment-history gap.** §1 “Observed deployment gap,” first paragraph, matches [4] `imports/deploy-runs.json`: latest returned run succeeded for `7b59064` on August 2. [5] `imports/main-commit.json` identifies main as `d515274`; [6] `imports/pr-101.json` links that SHA to PR #101, merged October 12 by `github-actions[bot]`. The conclusion is correctly limited to returned workflow history, not live Cloudflare state. **High confidence.**

- **Supported platform behavior; explicitly qualified inference — token explanation.** §1 “Observed deployment gap,” second paragraph, accurately uses [7] `imports/github-workflow-triggering.md`. Independently fetched GitHub documentation confirms suppression of push-triggered runs caused by `GITHUB_TOKEN`; its documented exceptions do not include these push events. Calling this a supported explanation, rather than proven historical causation, preserves the evidence boundary.

- **Supported — secret presence, not scope.** §3, paragraph beginning “Deploy grants…” correctly limits [8] `imports/secret-names.json` to existence of the two referenced secret names. It does not infer credential validity, values or permissions. **High confidence.**

- **Supported — defaults and principal distinction.** §3, paragraph beginning “Live Actions defaults…” matches [9] `imports/actions-permissions.json` and [10] `imports/workflow-permissions.json`: all actions allowed, SHA pinning not required, read default, and PR-review approval disabled. [2] `imports/repository.json` reports administrator permissions for the authenticated investigator—not OpenClaw. The report explicitly avoids conflating them. **High confidence.**

- **Supported — required-context exclusion.** §5, “Scorecard runs…” correctly states that Scorecard is absent from the five required contexts in [1] `imports/protection.json`.

## 2. Contradicted claims

None found within scope.

## 3. Weak / unclear / unsupported claims

None materially overstated within scope. Workflow-code assertions were not independently audited; they are separately pinned code citations, not conclusions established by API snapshots.

## 4. Material source-quality concerns

No material citation-quality defect found. The settings evidence is an October 18 snapshot, not historical configuration evidence. The report states this limitation. All source numbers [1]–[10] match their named snapshots and cited subjects.

## 5. Missing evidence

As acknowledged in §1’s deployment-gap paragraphs, §3’s permissions paragraph, and Open Questions 1–3: snapshots [2], [4]–[8] do not establish OpenClaw’s effective credentials, each historical merge’s token, Cloudflare token scopes, or the live Worker revision.

## 6. Material contradictions

None among the audited claims and evidence snapshots.

## 7. Implications for the original conclusion

**Verdict: clean within the requested scope.** The evidence supports the reported configuration and retained-history gap. The report appropriately leaves deployment causation, live deployment state and OpenClaw permissions unproven.