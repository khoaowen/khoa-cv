import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public site URL. Update to a custom domain later if one is attached in
// Cloudflare Pages (Pages project -> Custom domains).
export default defineConfig({
  site: 'https://khoa-cv.pages.dev',
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
      // Print routes are for PDF generation only; keep them out of the sitemap.
      filter: (page) => !page.includes('/cv-print'),
    }),
  ],
  output: 'static',
  build: {
    // Keep all CSS in external files (no inline <style>) so the Content-Security
    // -Policy can stay strict: style-src 'self' with no 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
});
