[
  {
    "ref": 7,
    "status": "verified",
    "citation": "scripts/gen-pdf.mjs:127-158 (assertPrintContract) @ d515274; scripts/gen-pdf.mjs:173-179 (main) @ d515274",
    "reason": "Retrieved pinned source checks all required strings for presence but counts occurrences only for requiredText[0]. It rejects zero matching certification date elements or adjacent extracted attributes ascending lexicographically, not each certification missing an attribute. Selected skill elements count as visible only when computed display is not none and visibility is not hidden; item and word minimums are enforced. main calls this contract before rendering each target. These are source checks, not runtime validation."
  },
  {
    "ref": 15,
    "status": "verified",
    "citation": ".github/workflows/deploy.yml:9-10 (permissions) @ d515274; .github/workflows/deploy.yml:44-50 (apiToken) @ d515274; _bmad-output/initiative-reliable-autonomous-cv-delivery/research-cv-delivery-pipeline/imports/secret-names.json (data.names, accessed_at)",
    "reason": "Retrieved pinned workflow grants contents: read and references secrets.CLOUDFLARE_API_TOKEN and secrets.CLOUDFLARE_ACCOUNT_ID as wrangler-action inputs. The permitted successful GET snapshot dated 2026-10-18T08:14:25.671669+00:00 lists both repository secret names and total_count 2. It establishes their names at snapshot time, not provisioning at the pinned commit, values, validity, or scopes; none of those were inspected."
  },
  {
    "ref": 26,
    "status": "verified",
    "citation": "3f3061c Document autonomous PR flow + public-repo security posture (#7), git show; https://api.github.com/repos/khoaowen/khoa-cv/pulls/7 (GET: body, merge_commit_sha, merged, auto_merge)",
    "reason": "Retrieved commit adds the no-human-review autonomous PR/checks/auto-merge documentation. Its four-file diff changes AGENTS.md, README.md, SECURITY.md and the deployment job display name. Retrieved PR #7 body explicitly calls itself the end-to-end test of the auto-merge loop. The API links merge_commit_sha 3f3061c2cd3d0dd851843aa2f771fb21d4bf6030, reports merged true, and records squash auto-merge configuration. Neither this documentation diff nor this individual PR establishes every subsequent workflow outcome."
  }
]
