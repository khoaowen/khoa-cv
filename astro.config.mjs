import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public site URL — used for canonical links, hreflang and the sitemap.
// Update if you later attach a custom domain to the Worker.
export default defineConfig({
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
