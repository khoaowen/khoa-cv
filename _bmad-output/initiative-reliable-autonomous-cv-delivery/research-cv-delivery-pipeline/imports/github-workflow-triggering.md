# GitHub workflow triggering

Publisher: GitHub Docs
Publication date: not supplied on retrieved page
Accessed: 2026-10-18
Source: https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow
Section: Triggering a workflow from a workflow

Exact retrieved passages:

> When you use the repository's `GITHUB_TOKEN` to perform tasks, events triggered by the `GITHUB_TOKEN` will not create a new workflow run, with the following exceptions:

> `workflow_dispatch` and `repository_dispatch` events always create workflow runs.

> For all other events, this behavior prevents you from accidentally creating recursive workflow runs. For example, if a workflow run pushes code using the repository's `GITHUB_TOKEN`, a new workflow will not run even when the repository contains a workflow configured to run when `push` events occur.

The retrieved page additionally lists approval-required pull_request opened/synchronize/reopened runs as an exception. No exception is given for push events resulting from merges.

This establishes documented platform behavior, not proof of the credentials used for every individual merge or of current Cloudflare contents.
