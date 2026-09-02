/**
 * Location-metadata gate. JPEG, PNG, and WebP metadata containers are
 * removed in place. AVIF files are rejected if they contain EXIF or XMP,
 * because rewriting ISO-BMFF item tables without a media library is unsafe.
 *
 * `--self-test` proves the JPEG path with a synthetic GPS-bearing EXIF
 * segment. The fixture exists only in memory and cannot leak into public/.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const ROOT = "public";

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

export function stripJpeg(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error("not a JPEG (no SOI)");
  const out = [Buffer.from([0xff, 0xd8])];
  let offset = 2;
  let removed = 0;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      out.push(buffer.subarray(offset));
      break;
    }
    const marker = buffer[offset + 1];
    if (marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      out.push(buffer.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }
    if (offset + 4 > buffer.length) throw new Error("truncated JPEG segment");
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > buffer.length) throw new Error("malformed JPEG segment");
    const segment = buffer.subarray(offset, offset + 2 + length);
    if (marker === 0xe1 || marker === 0xe2) removed += segment.length;
    else out.push(segment);
    offset += 2 + length;
    if (marker === 0xda) {
      out.push(buffer.subarray(offset));
      break;
    }
  }
  return { bytes: Buffer.concat(out), removed };
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_DROP = new Set(["eXIf", "tEXt", "zTXt", "iTXt"]);

export function stripPng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_MAGIC)) throw new Error("not a PNG");
  const out = [PNG_MAGIC];
  let offset = 8;
  let removed = 0;
  while (offset < buffer.length) {
    if (offset + 12 > buffer.length) throw new Error("truncated PNG chunk");
    const length = buffer.readUInt32BE(offset);
    if (offset + 12 + length > buffer.length) throw new Error("malformed PNG chunk");
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const chunk = buffer.subarray(offset, offset + 12 + length);
    if (PNG_DROP.has(type)) removed += chunk.length;
    else out.push(chunk);
    offset += 12 + length;
    if (type === "IEND") break;
  }
  return { bytes: Buffer.concat(out), removed };
}

const WEBP_DROP = new Set(["EXIF", "XMP "]);

export function stripWebp(buffer) {
  if (buffer.subarray(0, 4).toString("ascii") !== "RIFF" || buffer.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error("not a WebP");
  }
  const chunks = [];
  let offset = 12;
  let removed = 0;
  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) throw new Error("truncated WebP chunk");
    const type = buffer.subarray(offset, offset + 4).toString("ascii");
    const length = buffer.readUInt32LE(offset + 4);
    const padded = length + (length % 2);
    if (offset + 8 + padded > buffer.length) throw new Error("malformed WebP chunk");
    const chunk = buffer.subarray(offset, offset + 8 + padded);
    if (WEBP_DROP.has(type)) removed += chunk.length;
    else chunks.push(chunk);
    offset += 8 + padded;
  }
  const payload = Buffer.concat([Buffer.from("WEBP"), ...chunks]);
  const header = Buffer.alloc(8);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(payload.length, 4);
  return { bytes: Buffer.concat([header, payload]), removed };
}

function assertAvifClean(buffer, file) {
  const markers = [
    Buffer.from("Exif\0\0", "binary"),
    Buffer.from("http://ns.adobe.com/xap/1.0/", "ascii"),
    Buffer.from("application/rdf+xml", "ascii"),
  ];
  if (markers.some((marker) => buffer.indexOf(marker) !== -1)) {
    throw new Error(`${file}: AVIF contains EXIF or XMP metadata; build rejected`);
  }
}

function selfTest() {
  const payload = Buffer.from("Exif\0\0GPSLatitude=05.6037;GPSLongitude=-00.1870", "binary");
  const length = Buffer.alloc(2);
  length.writeUInt16BE(payload.length + 2);
  const fixture = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe1]),
    length,
    payload,
    Buffer.from([0xff, 0xd9]),
  ]);
  const result = stripJpeg(fixture);
  if (result.removed === 0 || result.bytes.includes(Buffer.from("GPSLatitude"))) {
    throw new Error("synthetic GPS-bearing EXIF fixture survived stripping");
  }
  console.log("strip-exif self-test: OK · synthetic GPS-bearing EXIF removed");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  let files = 0;
  let cleaned = 0;
  for (const file of walk(ROOT)) {
    const extension = extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(extension)) continue;
    files++;
    const buffer = readFileSync(file);
    if (extension === ".avif") {
      assertAvifClean(buffer, file);
      continue;
    }
    const result = extension === ".png" ? stripPng(buffer) : extension === ".webp" ? stripWebp(buffer) : stripJpeg(buffer);
    if (result.removed > 0) {
      writeFileSync(file, result.bytes);
      cleaned++;
      console.log(`strip-exif: ${file} · removed ${result.removed} bytes of metadata`);
    }
  }
  console.log(`strip-exif: scanned ${files} image(s), cleaned ${cleaned}`);
}
