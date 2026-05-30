# Security Policy

## Supported Versions

Only the current `main` branch is supported.

## Reporting a Vulnerability

Please do not open a public issue with exploit details, credentials, tokens, or personal data.

If GitHub private vulnerability reporting is enabled for this repository, use it. Otherwise, contact the repository owner directly through GitHub.

Include:

- A short description of the issue
- Steps to reproduce
- Affected files, pages, or dependencies
- Whether any secret, token, or personal data may be exposed

## Secrets and Privacy

- Do not commit `.env`, `.env.*`, `.dev.vars`, Cloudflare tokens, or other credentials.
- Store deployment credentials in GitHub Actions secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`), never in the repository. The token is scoped to **Cloudflare Pages → Edit** only.
- There is intentionally **no phone number** anywhere in this repository, the site, or the PDF. Public contact is the LinkedIn link. A CI check (`scripts/check-content.mjs`) enforces this on every build.
- The repository is **public**; it contains only source code and an email that is already published in the downloadable PDF. No phone, no address, no secrets — deployment credentials live in encrypted GitHub Actions secrets.
- The deployed site ships **zero JavaScript** and enforces a strict Content-Security-Policy (`script-src 'none'`).

## Automated security

- **Dependabot**: alerts, security updates, and weekly version updates; non-major updates auto-merge after checks pass.
- **Code scanning**: CodeQL on every PR and push.
- **Secret scanning + push protection**: enabled (GitHub native) plus **Gitleaks** in CI.
- **Dependency review**: blocks PRs introducing high+ severity vulnerabilities.
- **OpenSSF Scorecard**: supply-chain posture scoring.
- **Branch protection** on `main`: required status checks, PR-only, linear history.
