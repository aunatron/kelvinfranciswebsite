/**
 * axe — every route, both modes. Any violation fails the build.
 *
 * Runs against the built output in out/, so what is audited is exactly what
 * ships. Hunter mode is exercised too: the mode engine repaints the whole
 * page, so it has to clear the same bar.
 */
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";
import { serveOut, ROUTES } from "./serve-out.mjs";

const { server, origin } = await serveOut();
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const violations = [];
let passes = 0;

for (const route of ROUTES) {
  for (const mode of ["francis", "hunter"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(origin + route, { waitUntil: "networkidle0" });
    await page.evaluate((m) => document.documentElement.setAttribute("data-mode", m), mode);
    const results = await new AxePuppeteer(page).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    passes += results.passes.length;
    for (const v of results.violations) {
      violations.push(
        `${route} [${mode}] — ${v.id} (${v.impact}): ${v.help}\n      ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(" "))
          .join("\n      ")}`
      );
    }
    await page.close();
  }
}

await browser.close();
server.close();

console.log(`audit-a11y: ${ROUTES.length} routes × 2 modes, ${passes} axe checks passed`);
if (violations.length) {
  console.error("\n════ AXE FOUND VIOLATIONS — BUILD REJECTED ════\n");
  for (const v of violations) console.error(`  ${v}`);
  console.error("\n═══════════════════════════════════════════════\n");
  process.exit(1);
}
console.log("audit-a11y: OK — zero violations.");
