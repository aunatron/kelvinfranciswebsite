/**
 * Copies the exact latin-subset faces the site uses from the @fontsource
 * packages into public/fonts/ — the packages stay the single source of truth.
 * Runs as part of prebuild.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const FACES = [
  ["@fontsource/spectral/files/spectral-latin-300-normal.woff2", "spectral-latin-300-normal.woff2"],
  ["@fontsource/spectral/files/spectral-latin-400-normal.woff2", "spectral-latin-400-normal.woff2"],
  ["@fontsource/spectral/files/spectral-latin-400-italic.woff2", "spectral-latin-400-italic.woff2"],
  ["@fontsource/spectral/files/spectral-latin-500-normal.woff2", "spectral-latin-500-normal.woff2"],
  ["@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", "ibm-plex-mono-latin-400-normal.woff2"],
];

const dest = join("public", "fonts");
mkdirSync(dest, { recursive: true });
for (const [src, name] of FACES) {
  copyFileSync(join("node_modules", src), join(dest, name));
}
console.log(`copy-fonts: ${FACES.length} latin faces → public/fonts`);

