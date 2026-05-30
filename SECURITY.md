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
- There is intentionally **no phone number** anywhere in this repository, the site, or the PDF. Public contact is the LinkedIn link.
- The repository is **private** because the source contains personal data (email/address used only in the PDF).
- The deployed site ships **zero JavaScript** and enforces a strict Content-Security-Policy (`script-src 'none'`).
