# khoa-cv

Bilingual (English / French) CV website with one-click PDF download, built with
[Astro](https://astro.build) and deployed to Cloudflare Pages. Free to host,
privacy-first, and ships zero JavaScript.

- **EN** at `/`, **FR** at `/fr/`
- **Download PDF** button serves a build-time, always-in-sync A4 PDF per language
- Content lives in two editable YAML files validated by a schema (bad edits fail
  CI, never production)

## Edit the CV

Edit `src/content/cv/en.yaml` and `src/content/cv/fr.yaml`, then push to `main`.
See [`CLAUDE.md`](./CLAUDE.md) for the full editing guide and privacy rules
(notably: **no phone number anywhere**; email/address live only in the PDF).

## Develop

```bash
npm install
npm run dev          # http://localhost:4321  (FR at /fr/)
npm run build:all    # validate + build + generate PDFs in dist/
npm run preview      # serve the built site locally
```

## Deploy (Cloudflare Workers — static assets)

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site,
generates the PDFs, and runs `wrangler deploy` to publish the `dist/` assets as
the `khoa-cv` Worker (config in `wrangler.jsonc`).

One-time setup:

1. Create the Worker named `khoa-cv` (dashboard → Workers & Pages → Create →
   upload `dist/` once to bootstrap; subsequent deploys are automated).
2. Create a scoped API token using the **"Edit Cloudflare Workers"** template
   (or custom: **Account → Workers Scripts → Edit**).
3. Add repo secrets:
   ```bash
   gh secret set CLOUDFLARE_ACCOUNT_ID --repo khoaowen/khoa-cv
   gh secret set CLOUDFLARE_API_TOKEN  --repo khoaowen/khoa-cv
   ```

## Security & privacy

- Strict CSP (`script-src 'none'`), HSTS, nosniff, frame-deny — see
  `public/_headers`.
- No third-party fonts, analytics, or trackers.
- Private repo (source contains personal data used only in the PDF).
- Security workflows: CodeQL, OpenSSF Scorecard, Gitleaks, Dependabot
  auto-merge. See [`SECURITY.md`](./SECURITY.md).
