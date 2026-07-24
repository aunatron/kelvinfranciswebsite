/**
 * EXIF stripping — a build guarantee, not a habit. Photos leak GPS.
 *
 * Runs over every JPEG/PNG under public/ before the build:
 *   JPEG: removes APP1/APP2 metadata segments (Exif, XMP, ICC extras) —
 *         everything between SOI and image data that can carry location.
 *   PNG:  removes eXIf chunks and location-bearing text chunks.
 *
 * Pure Node byte surgery — no dependencies. Fails the build on malformed
 * images rather than shipping them unstripped.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = "public";

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function stripJpeg(buf) {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG (no SOI)");
  const out = [Buffer.from([0xff, 0xd8])];
  let i = 2;
  let removed = 0;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      // Entropy-coded data begins — copy the rest verbatim.
      out.push(buf.subarray(i));
      break;
    }
    const marker = buf[i + 1];
    if (marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      out.push(buf.subarray(i, i + 2));
      i += 2;
      continue;
    }
    const len = buf.readUInt16BE(i + 2);
    const segment = buf.subarray(i, i + 2 + len);
    // APP1 (Exif/XMP) and APP2 can carry location metadata — drop them.
    if (marker === 0xe1 || marker === 0xe2) {
      removed += segment.length;
    } else {
      out.push(segment);
    }
    i += 2 + len;
    if (marker === 0xda) {
      // Start of scan — the rest is image data.
      out.push(buf.subarray(i));
      break;
    }
  }
  return { bytes: Buffer.concat(out), removed };
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_DROP = new Set(["eXIf", "tEXt", "zTXt", "iTXt"]);

function stripPng(buf) {
  if (!buf.subarray(0, 8).equals(PNG_MAGIC)) throw new Error("not a PNG");
  const out = [PNG_MAGIC];
  let i = 8;
  let removed = 0;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.subarray(i + 4, i + 8).toString("ascii");
    const chunk = buf.subarray(i, i + 12 + len);
    if (PNG_DROP.has(type)) removed += chunk.length;
    else out.push(chunk);
    i += 12 + len;
    if (type === "IEND") break;
  }
  return { bytes: Buffer.concat(out), removed };
}

let files = 0;
let stripped = 0;
for (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
  files++;
  const buf = readFileSync(file);
  const { bytes, removed } = ext === ".png" ? stripPng(buf) : stripJpeg(buf);
  if (removed > 0) {
    writeFileSync(file, bytes);
    stripped++;
    console.log(`strip-exif: ${file} — removed ${removed} bytes of metadata`);
  }
}
console.log(`strip-exif: scanned ${files} image(s), cleaned ${stripped}`);
