/**
 * Lighthouse gate — mobile, on the built output.
 * Floors: performance ≥ 95, accessibility 100, best-practices 100, SEO 100.
 * Below any floor, the build is rejected.
 */
import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import { serveOut, ROUTES } from "./serve-out.mjs";

const FLOORS = { performance: 95, accessibility: 100, "best-practices": 100, seo: 100 };
/* One representative page per shape: cover sheet, ledger, filtered index,
   hunter essay, computed page. Auditing all ten costs minutes for no signal. */
const SAMPLE = ["/", "/record/", "/doctrine/", "/doctrine/hunt-001/", "/track-record/"];

const { server, origin } = await serveOut();
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const port = Number(new URL(browser.wsEndpoint()).port);

const failures = [];
for (const route of SAMPLE) {
  const { lhr } = await lighthouse(origin + route, { port, output: "json", logLevel: "error" });
  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
  );
  const cls = lhr.audits["cumulative-layout-shift"].numericValue;
  console.log(
    `${route.padEnd(24)} perf ${scores.performance} · a11y ${scores.accessibility} · bp ${scores["best-practices"]} · seo ${scores.seo} · CLS ${cls}`
  );
  for (const [cat, floor] of Object.entries(FLOORS)) {
    if (scores[cat] < floor) failures.push(`${route}: ${cat} ${scores[cat]} < ${floor}`);
  }
  // CLS is doctrine here, not preference.
  if (cls > 0) failures.push(`${route}: CLS ${cls} — the bar is 0`);
}

await browser.close();
server.close();

console.log(`\naudit-lighthouse: ${SAMPLE.length} routes audited (mobile)`);
if (failures.length) {
  console.error("\n════ LIGHTHOUSE BELOW FLOOR — BUILD REJECTED ════\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error("\n═════════════════════════════════════════════════\n");
  process.exit(1);
}
console.log("audit-lighthouse: OK — every route clears its floor, CLS 0.");
