/**
 * Postbuild — the pipeline enforces what the doctrine intends.
 *
 * 1. Strip the Next.js client runtime from the exported HTML. This site is
 *    server-rendered at build time and ships no framework JS; interactivity
 *    is small inline native scripts (allowlisted by id below).
 * 2. Enforce the 30KB JS budget. If shipped JS ever exceeds it, the build
 *    fails loudly — the budget is law, not intention.
 */
import { readdirSync, readFileSync, writeFileSync, rmSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const JS_BUDGET_BYTES = 30 * 1024;
const KEEP_SCRIPT_IDS = ["kf-mode", "kf-filter", "kf-verify", "kf-attest", "kf-holo", "kf-keys"];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

// Keep allowlisted inline scripts and JSON-LD data blocks; strip the rest.
const keepPattern = KEEP_SCRIPT_IDS.map((id) => `id="${id}"`)
  .concat(['type="application/ld\\+json"'])
  .join("|");
const scriptRe = new RegExp(
  `<script(?![^>]*(?:${keepPattern}))[^>]*>[\\s\\S]*?<\\/script>`,
  "g"
);
const preloadRe = /<link[^>]*as="script"[^>]*>/g;

let htmlCount = 0;
let strippedBytes = 0;
for (const file of walk(OUT)) {
  if (!file.endsWith(".html")) continue;
  const before = readFileSync(file, "utf8");
  let after = before.replace(scriptRe, "").replace(preloadRe, "");
  // React float hoists font preloads into <head> but can leave the body
  // originals — keep only the first tag per href.
  const seenPreload = new Set();
  after = after.replace(/<link[^>]*rel="preload"[^>]*>/g, (tag) => {
    const href = tag.match(/href="([^"]*)"/)?.[1];
    if (seenPreload.has(href)) return "";
    seenPreload.add(href);
    return tag;
  });
  if (after !== before) {
    writeFileSync(file, after);
    strippedBytes += before.length - after.length;
  }
  htmlCount++;
}

// The runtime chunks are no longer referenced — do not ship them.
rmSync(join(OUT, "_next", "static", "chunks"), { recursive: true, force: true });

// RSC flight payloads (client-navigation data) are dead without a runtime.
function cleanFlight(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (entry.startsWith("__next.")) {
      rmSync(p, { recursive: true, force: true });
      continue;
    }
    if (statSync(p).isDirectory()) cleanFlight(p);
    else if (entry === "index.txt") rmSync(p);
  }
}
cleanFlight(OUT);

// Nothing references the build manifests once the runtime is gone.
function cleanManifests(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) cleanManifests(p);
    else if (entry.endsWith(".js")) rmSync(p);
  }
}
cleanManifests(join(OUT, "_next"));

// Budget: what a single page ships to a visitor — its inline executable
// scripts (ld+json is data, excluded) plus any .js it references. The 30KB
// law is per page-load; the all-page total is reported for visibility.
let totalJs = 0;
let maxPage = { file: "", bytes: 0 };
const externalJs = [];
for (const file of walk(OUT)) {
  if (file.endsWith(".js")) externalJs.push(`${file} (${statSync(file).size} B)`);
  if (!file.endsWith(".html")) continue;
  const html = readFileSync(file, "utf8");
  let pageJs = 0;
  for (const m of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/application\/ld\+json/.test(m[1])) continue;
    pageJs += Buffer.byteLength(m[2], "utf8");
  }
  for (const m of html.matchAll(/<script[^>]*src="([^"]*)"[^>]*>/g)) {
    const p = join(OUT, m[1].replace(/^\//, ""));
    if (existsSync(p)) pageJs += statSync(p).size;
  }
  totalJs += pageJs;
  if (pageJs > maxPage.bytes) maxPage = { file, bytes: pageJs };
}

console.log(`postbuild: processed ${htmlCount} HTML file(s), stripped ${strippedBytes} bytes of framework JS`);
console.log(`postbuild: heaviest page = ${maxPage.bytes} B executable JS (${maxPage.file}); all-page total = ${totalJs} B; budget ${JS_BUDGET_BYTES} B per page`);
if (externalJs.length) console.log("unreferenced .js files present:\n" + externalJs.join("\n"));

if (!existsSync(join(OUT, "index.html"))) {
  console.error("postbuild: out/index.html missing — export failed");
  process.exit(1);
}
if (maxPage.bytes > JS_BUDGET_BYTES) {
  console.error(`postbuild: JS budget exceeded — ${maxPage.file} ships ${maxPage.bytes} > ${JS_BUDGET_BYTES}. Build rejected.`);
  process.exit(1);
}
