// Assemble the deployable payload (dist/) from the private build output.
// Print routes (which embed the PDF-only private contacts) are NOT copied, so
// they cannot be served, uploaded or retrieved. PDFs are added later by
// gen-pdf.mjs, which then runs the last privacy assertion (check-release.mjs).
// Fail closed: after copying, any remaining file carrying a private contact
// aborts the assembly, whatever its name.
import { cp, rm, access } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { BUILD_DIR, RELEASE_DIR, isPrivateRoute } from './paths.mjs';
import { loadSentinels, filesUnder, scanNonPdf } from './sentinels.mjs';

try {
  await access(BUILD_DIR);
} catch {
  console.error('✗ Private build output not found. Run `astro build` first.');
  process.exit(1);
}

await rm(RELEASE_DIR, { recursive: true, force: true });
await cp(BUILD_DIR, RELEASE_DIR, {
  recursive: true,
  filter: (src) => {
    const rel = relative(BUILD_DIR, src).split(sep).join('/');
    return rel === '' || !isPrivateRoute(rel);
  },
});

const sentinels = await loadSentinels();
if (!sentinels.length) {
  console.error('✗ No private contact sentinels found; refusing unverifiable release.');
  process.exit(1);
}
const hits = await scanNonPdf(RELEASE_DIR, await filesUnder(RELEASE_DIR), sentinels);
if (hits.length) {
  await rm(RELEASE_DIR, { recursive: true, force: true });
  console.error(`✗ Private contact found in assembled payload (removed dist/):\n${hits.map((h) => `  - ${h}`).join('\n')}`);
  process.exit(1);
}
console.log('✓ Release payload assembled in dist/ (print routes excluded, contact scan clean).');
