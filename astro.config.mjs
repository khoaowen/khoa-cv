import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public site URL — used for canonical links, hreflang and the sitemap.
// Update if you later attach a custom domain to the Worker.
export default defineConfig({
  // Astro builds into a PRIVATE intermediate directory. It holds the print
  // routes (which carry the private email/address for the PDFs) and must never
  // be deployed. scripts/assemble-release.mjs copies the public subset into
  // dist/, the only directory Wrangler uploads. Keep in sync with scripts/paths.mjs.
  outDir: './.private-build',
  site: 'https://khoa-cv.khoaowen2510.workers.dev',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      // English served at "/", French at "/fr/".
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', fr: 'fr' },
      },
      // Print routes are for PDF generation only (and are not deployed).
      filter: (page) => !/\/(?:cv|dossier)-print/.test(page),
    }),
  ],
  output: 'static',
  build: {
    // Keep all CSS in external files (no inline <style>) so the Content-Security
    // -Policy can stay strict: style-src 'self' with no 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
});
