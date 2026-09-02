import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import { serveOut } from "./serve-out.mjs";

const baselineDir = mkdtempSync(join(tmpdir(), "kf-holo-baseline-"));
cpSync("out", baselineDir, { recursive: true });

for (const route of ["index.html", join("record", "index.html")]) {
  const file = join(baselineDir, route);
  let html = readFileSync(file, "utf8");
  html = html.replace(/<div class="wrap"><figure class="ha[\s\S]*?<\/figure><\/div>/, "");
  html = html.replace(/<figure class="ha pc"[\s\S]*?<\/figure>/, "");
  html = html.replace(/<script id="kf-(?:holoart|audio)"[\s\S]*?<\/script>/g, "");
  writeFileSync(file, html);
}

const full = await serveOut("out");
const baseline = await serveOut(baselineDir);
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const port = Number(new URL(browser.wsEndpoint()).port);

async function measure(origin, route) {
  const { lhr } = await lighthouse(origin + route, { port, output: "json", logLevel: "error" });
  return {
    score: Math.round(lhr.categories.performance.score * 100),
    observedLcp: Math.round(lhr.audits.metrics.details.items[0].observedLargestContentfulPaint),
  };
}

try {
  for (const route of ["/", "/record/"]) {
    const without = await measure(baseline.origin, route);
    const withHolo = await measure(full.origin, route);
    console.log(
      `${route.padEnd(10)} Lighthouse ${without.score} → ${withHolo.score} (delta ${withHolo.score - without.score}) · observed LCP ${without.observedLcp}ms → ${withHolo.observedLcp}ms (delta ${withHolo.observedLcp - without.observedLcp}ms)`
    );
  }
} finally {
  await browser.close();
  await new Promise((resolve) => full.server.close(resolve));
  await new Promise((resolve) => baseline.server.close(resolve));
  rmSync(baselineDir, { recursive: true, force: true });
}
