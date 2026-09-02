import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");
const failures = [];
const fail = (message) => failures.push(message);

function read(path) {
  const full = join(OUT, path);
  if (!existsSync(full)) {
    fail(`${path} is missing`);
    return "";
  }
  return readFileSync(full, "utf8");
}

const pages = [
  ["index.html", "/"],
  ["record/index.html", "/record/"],
  ["doctrine/index.html", "/doctrine/"],
  ["now/index.html", "/now/"],
  ["credentials/index.html", "/credentials/"],
  ["signal/index.html", "/signal/"],
  ["system/index.html", "/system/"],
  ["archive/index.html", "/archive/"],
  ["track-record/index.html", "/track-record/"],
  ["doctrine/doctrine-001/index.html", "/doctrine/doctrine-001/"],
  ["doctrine/teach-001/index.html", "/doctrine/teach-001/"],
  ["doctrine/hunt-001/index.html", "/doctrine/hunt-001/"],
];

for (const [file, path] of pages) {
  const html = read(file);
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  if (h1Count !== 1) fail(`${path} has ${h1Count} h1 elements; expected exactly one`);
  if (!html.includes(`<link rel="canonical" href="https://kelvinfranciswebsite.vercel.app${path}"`)) {
    fail(`${path} has no matching canonical URL`);
  }
  if (!html.includes('property="og:image"') || !html.includes('name="twitter:card"')) {
    fail(`${path} is missing social metadata`);
  }
  if (/\[NEEDS INPUT\]|Draft · Kelvin|Draft — Kelvin/.test(html)) {
    fail(`${path} contains launch-blocking placeholder copy`);
  }
  if (html.includes("—")) fail(`${path} contains an em dash in published copy`);
}

const recordsText = read("records.json");
try {
  const records = JSON.parse(recordsText);
  const keys = Object.keys(records.records ?? {});
  if (keys.length !== 8 || keys.some((key, index) => key !== `R-0${index + 1}`)) {
    fail(`records.json has an invalid record index: ${keys.join(", ")}`);
  }
  if (records.records?.["R-05"]?.credential?.status !== "subject-attested") {
    fail("records.json overstates or omits the credential status");
  }
  if (!records.commit || !records.dossierDigest) fail("records.json lacks build provenance");
} catch (error) {
  fail(`records.json is invalid JSON: ${error.message}`);
}

const feedText = read("feed.json");
try {
  const feed = JSON.parse(feedText);
  if (feed.version !== "https://jsonfeed.org/version/1.1") fail("feed.json is not JSON Feed 1.1");
  if (!Array.isArray(feed.items) || feed.items.length !== 3) fail("feed.json must contain three published essays");
  for (const item of feed.items ?? []) {
    if (!item.id || !item.url || !item.title || !item.content_text || !item.date_published) {
      fail(`feed item ${item.id ?? "unknown"} lacks a required publication field`);
    }
  }
} catch (error) {
  fail(`feed.json is invalid JSON: ${error.message}`);
}

const llms = read("llms.txt");
if (!llms.includes("## The eight records") || !llms.includes("## Doctrine index")) {
  fail("llms.txt lacks its record or doctrine index");
}

const sitemap = read("sitemap.xml");
for (const [, path] of pages) {
  if (!sitemap.includes(`<loc>https://kelvinfranciswebsite.vercel.app${path}</loc>`)) {
    fail(`sitemap.xml omits ${path}`);
  }
}

const robots = read("robots.txt");
if (!robots.includes("Allow: /") || !robots.includes("Sitemap: https://kelvinfranciswebsite.vercel.app/sitemap.xml")) {
  fail("robots.txt does not expose the sitemap and allow crawling");
}

if (failures.length) {
  console.error("\nMACHINE CONTRACT FAILED\n");
  failures.forEach((message) => console.error(`  ${message}`));
  process.exit(1);
}

console.log(`audit-machine: OK · ${pages.length} pages · eight records · three feed items · sitemap · robots · metadata`);
