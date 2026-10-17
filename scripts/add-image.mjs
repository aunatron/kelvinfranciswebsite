/**
 * Add a photograph to the dossier in one command. Run BY HAND, not on build.
 *
 *   Portrait (cover sheet, cropped 4:5):
 *     node scripts/add-image.mjs <photo> --portrait --alt "Kelvin-Francis Peprah at his desk"
 *
 *   Archive plate (optionally tied to a record):
 *     node scripts/add-image.mjs <photo> --plate 1 --record R-02 \
 *       --caption "Aunatron Systems working session" --alt "A laptop and notebook on a desk"
 *
 *   Optional on both: --date YYYY-MM-DD (defaults to today)
 *
 * What it guarantees, so nothing leaks:
 *  - Every pixel is re-encoded by sharp, which writes NO metadata unless
 *    asked: EXIF (GPS, camera serial, timestamps), XMP and IPTC are gone.
 *    The orientation tag is applied to the pixels first, then dropped.
 *  - Each written file is re-read and rejected if any metadata survived.
 *  - Never upscales. Output is at most 1600px wide; a smaller source stays
 *    its own size.
 *
 * It writes public/media/<slug>-{1600.jpg, 1600.avif, 800.avif} and the
 * zod-validated content record (content/portrait/portrait.md or
 * content/archive/plate-NNN.md). Commit both, then build.
 *
 * Consent rule (README): no identifiable faces of other people without
 * written permission, and never faces of anyone receiving service work.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

function die(message) {
  console.error(`add-image: ${message}`);
  process.exit(1);
}

const src = args[0];
if (!src || src.startsWith("--") || !existsSync(src)) {
  die("usage: node scripts/add-image.mjs <photo> (--portrait | --plate N) --alt \"...\" [--caption \"...\"] [--record R-02] [--date YYYY-MM-DD]");
}

const isPortrait = flag("portrait");
const plateNo = opt("plate") ? Number(opt("plate")) : undefined;
if (!isPortrait && !plateNo) die("choose --portrait or --plate N");
if (plateNo !== undefined && (!Number.isInteger(plateNo) || plateNo < 1)) die("--plate must be a positive integer");

const alt = opt("alt");
if (!alt) die("--alt is required: describe what the photograph shows, plainly");
const caption = opt("caption");
if (!isPortrait && !caption) die("--caption is required for a plate: what it documents, no adjectives");
const record = opt("record");
const date = opt("date") ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) die("--date must be YYYY-MM-DD");

const slug = isPortrait
  ? "portrait"
  : `plate-${String(plateNo).padStart(3, "0")}`;

const MAX = 1600;
const outDir = join("public", "media");
mkdirSync(outDir, { recursive: true });

// Orientation applied to pixels, then the pipeline carries no metadata at all.
let base = sharp(src, { failOn: "error" }).rotate();
const meta = await sharp(src).metadata();
const oriented = meta.orientation && meta.orientation >= 5;
const srcW = oriented ? meta.height : meta.width;
const srcH = oriented ? meta.width : meta.height;

if (isPortrait) {
  // 4:5 frame, cropped toward the most salient region (usually the face).
  const w = Math.min(MAX, srcW, Math.floor((srcH * 4) / 5));
  const h = Math.round((w * 5) / 4);
  base = base.resize(w, h, { fit: "cover", position: sharp.strategy.attention });
} else if (srcW > MAX) {
  base = base.resize({ width: MAX, withoutEnlargement: true });
}

const master = await base.toBuffer({ resolveWithObject: true });
const { width, height } = master.info;
const half = Math.round(width / 2);

const files = {
  jpg: join(outDir, `${slug}-${width}.jpg`),
  avif: join(outDir, `${slug}-${width}.avif`),
  avifSmall: join(outDir, `${slug}-${half}.avif`),
};

await sharp(master.data).jpeg({ quality: 82, mozjpeg: true }).toFile(files.jpg);
await sharp(master.data).avif({ quality: 55, effort: 6 }).toFile(files.avif);
await sharp(master.data).resize({ width: half }).avif({ quality: 55, effort: 6 }).toFile(files.avifSmall);

// Prove it: re-read every written file and refuse to continue on any metadata.
for (const file of Object.values(files)) {
  const m = await sharp(file).metadata();
  if (m.exif || m.xmp || m.iptc) die(`${file} still carries metadata; refusing to publish it`);
}

const web = (p) => "/" + p.replaceAll("\\", "/").replace(/^public\//, "");
const q = (s) => JSON.stringify(s);

let body;
let contentFile;
if (isPortrait) {
  mkdirSync(join("content", "portrait"), { recursive: true });
  contentFile = join("content", "portrait", "portrait.md");
  body = [
    "---",
    `date: ${q(date)}`,
    `src: ${q(web(files.jpg))}`,
    `avif: ${q(web(files.avif))}`,
    `avif_small: ${q(web(files.avifSmall))}`,
    `alt: ${q(alt)}`,
    `width: ${width}`,
    `height: ${height}`,
    ...(caption ? [`caption: ${q(caption)}`] : []),
    "---",
    "",
  ].join("\n");
} else {
  contentFile = join("content", "archive", `${slug}.md`);
  if (existsSync(contentFile)) die(`${contentFile} already exists; choose another --plate number`);
  body = [
    "---",
    `plate: ${plateNo}`,
    `date: ${q(date)}`,
    `caption: ${q(caption)}`,
    "media: image",
    `src: ${q(web(files.jpg))}`,
    `avif: ${q(web(files.avif))}`,
    `avif_small: ${q(web(files.avifSmall))}`,
    `full: ${q(web(files.jpg))}`,
    ...(record ? [`record: ${q(record)}`] : []),
    `alt: ${q(alt)}`,
    `width: ${width}`,
    `height: ${height}`,
    "---",
    "",
  ].join("\n");
}
writeFileSync(contentFile, body, "utf8");

console.log(`add-image: ${basename(src)} (${srcW}x${srcH}${extname(src)})`);
for (const file of Object.values(files)) console.log(`  -> ${file}  · metadata: none`);
console.log(`  -> ${contentFile}`);
console.log("Next: review the files, then commit and build.");
