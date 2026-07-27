/**
 * HoloArt asset encoder — run BY HAND, not on every build.
 *
 *   node scripts/holoart-encode.mjs <src-dir> [out-dir]
 *
 * The site build ships no image tooling: this writes derived AVIFs into
 * public/scenes/ and those files are committed. Keeping sharp out of the
 * build path is deliberate — `npm run build` must stay dependency-light and
 * reproducible, and the art changes far less often than the code.
 *
 * What it does, per the holoart pipeline (CO-07):
 *
 *  1. Alpha-keys the black matte with a steep ramp, so the wireframe floats
 *     directly on the ink canvas instead of reading as a placed rectangle:
 *
 *         m = max(r,g,b);  alpha = m <= 4 ? 0 : min(255, (m - 4) * 5)
 *
 *     Colours are left untouched and the result is NOT unpremultiplied —
 *     unpremultiplying amplifies glow-field noise and triples the file size.
 *  2. Encodes AVIF at q60.
 *  3. Never upscales. The art is written at its native width, because
 *     enlarging a raster in code is the one fix the pipeline forbids.
 *
 * It also reports the sharpness ceiling: the largest CSS width at which the
 * scene stays pixel-exact on a 2x display. That number is a fact about the
 * source file, so it is printed rather than assumed.
 */
import { readdirSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const SRC = process.argv[2];
const OUT = process.argv[3] ?? join("public", "scenes");
const QUALITY = 60;
const FLOOR = 4; // black-matte cutoff: at or below this, fully transparent
const RAMP = 5; // steepness above the cutoff

if (!SRC || !existsSync(SRC)) {
  console.error("usage: node scripts/holoart-encode.mjs <src-dir> [out-dir]");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

/** Key the black matte to alpha, leaving colour channels alone. */
function keyMatte(data, info) {
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0, o = 0; o < out.length; i += channels, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = r > g ? (r > b ? r : b) : g > b ? g : b;
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = m <= FLOOR ? 0 : Math.min(255, (m - FLOOR) * RAMP);
  }
  return out;
}

const sources = readdirSync(SRC).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
if (!sources.length) {
  console.error(`holoart-encode: no images in ${SRC}`);
  process.exit(1);
}

let failed = false;
for (const file of sources) {
  const src = join(SRC, file);
  const slug = basename(file, extname(file))
    .toLowerCase()
    .replace(/-raw.*$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const dest = join(OUT, `${slug}.avif`);

  const img = sharp(src);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const keyed = keyMatte(data, info);
  const before = statSync(src).size;

  await sharp(keyed, { raw: { width: info.width, height: info.height, channels: 4 } })
    .avif({ quality: QUALITY, effort: 6 })
    .toFile(dest);

  const after = statSync(dest).size;

  // How many pixels actually survived the key, and how transparent the frame is.
  let opaque = 0;
  for (let o = 3; o < keyed.length; o += 4) if (keyed[o] > 0) opaque++;
  const inkPct = (100 * (1 - opaque / (info.width * info.height))).toFixed(1);

  // Sharpness ceiling: display CSS width that stays 1:1 on a 2x screen.
  const ceiling2x = Math.floor(meta.width / 2);

  console.log(`${file}`);
  console.log(`  -> ${dest}`);
  console.log(
    `     ${meta.width}x${meta.height} native | ${(before / 1024).toFixed(0)} KB PNG -> ${(after / 1024).toFixed(0)} KB AVIF`
  );
  console.log(`     keyed to transparent: ${inkPct}% of the frame`);
  console.log(`     stays pixel-exact up to ${ceiling2x}px CSS width on a 2x display`);
  if (meta.width < 2000) {
    console.log(
      `     NOTE: source is ${meta.width}px. Displaying wider than ${ceiling2x}px CSS softens it on 2x screens.`
    );
  }
}

if (failed) process.exit(1);
