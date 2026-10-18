# Research brief: CV delivery pipeline

Repository: /Users/khoa/IdeaProjects/khoa-cv
Branch/ref: origin/main
Commit: d515274f1802ea5715c3ce3a2eaa34ce6a5fb308 (d515274)
Validation: normal. File budget: 15 per question. History budget: 10 commits. Concurrency: 3.

Questions:
1. How does a CV YAML change travel from a branch to a live deployment? (how)
2. What validates or rejects a CV edit before merge or deployment? (what touches)
3. How are credentials and permissions handled? (how)
4. What enforces privacy and no-JavaScript rules on the public site and PDF? (what touches)
5. How do Dependabot updates and Scorecard run? (how)
6. Why do the pipeline and PDF page-budget logic have their present form, according to git history? (why)
7. How is the pipeline tested beyond build-time guards? (how)

Read committed code only via git show/grep/ls-tree at the pinned commit. Do not inspect working-tree changes. Exclude _bmad/, _bmad-output/, .agents/, .claude/, .pi/ and any planning/ticket/spec artifacts from evidence. Source code, its own documentation, and git history are evidence; proposed work is not. No existing research or ADRs were found in the committed tree.

Live configuration is a separate, timestamped observation stream: GitHub API settings, run metadata and merged-PR metadata, not immutable evidence of historical configuration. Only secret names/metadata are permitted; never secret values or credential output.

Never conclude from training data alone: evidence must be retrieved during this run. Project context shapes the questions, not their answers. Every factual answer must cite code lines at the pinned commit, commits, or an API snapshot. No recommendations or implementation changes.
