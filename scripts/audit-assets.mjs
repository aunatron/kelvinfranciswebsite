import { statSync } from "node:fs";
import sharp from "sharp";

const scenes = [
  "public/scenes/e2-1-r01-operators-desk.avif",
  "public/scenes/e2-2-r02-proof-constellation.avif",
];
const failures = [];

for (const file of scenes) {
  const metadata = await sharp(file).metadata();
  if (metadata.width !== 1672 || metadata.height !== 941) {
    failures.push(`${file}: expected 1672x941, got ${metadata.width}x${metadata.height}`);
  }
  if (!metadata.hasAlpha || metadata.channels !== 4) failures.push(`${file}: alpha channel is missing`);
  if (statSync(file).size > 350 * 1024) failures.push(`${file}: exceeds the 350KB scene budget`);
}

const social = await sharp("public/social-card.jpg").metadata();
if (social.width !== 1200 || social.height !== 630) {
  failures.push(`public/social-card.jpg: expected 1200x630, got ${social.width}x${social.height}`);
}
if (social.exif || social.xmp) failures.push("public/social-card.jpg: metadata survived the privacy gate");

if (failures.length) {
  console.error("\nASSET CONTRACT FAILED\n");
  failures.forEach((failure) => console.error(`  ${failure}`));
  process.exit(1);
}
console.log("audit-assets: OK · two 1672x941 alpha AVIF scenes · 2x display cap · 1200x630 metadata-free social card");
