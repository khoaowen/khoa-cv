// Single source of truth for the two output directories.
//   BUILD_DIR   — private Astro output (print routes with private contacts).
//                 Never deployed, never uploaded. Must match astro.config.mjs outDir.
//   RELEASE_DIR — the ONLY directory Wrangler uploads (wrangler.jsonc assets.directory).
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const BUILD_DIR = fileURLToPath(new URL('../.private-build', import.meta.url));
export const RELEASE_DIR = fileURLToPath(new URL('../dist', import.meta.url));

// Fail closed: ANY non-bundle path mentioning "print" is treated as a PDF-only
// route and excluded from the release (so a newly named print route, e.g.
// /resume-print/ or /print-cv.html, cannot slip through). Hashed bundles under
// _astro/ are exempt by name only; their contents are still scanned for contacts.
export const PRIVATE_ROUTE_PATTERN = /print/i;
export function isPrivateRoute(relPath) {
  return !relPath.startsWith('_astro/') && PRIVATE_ROUTE_PATTERN.test(relPath);
}
