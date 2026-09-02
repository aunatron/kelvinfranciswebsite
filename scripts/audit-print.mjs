import puppeteer from "puppeteer";
import { serveOut } from "./serve-out.mjs";

const { server, origin } = await serveOut();
const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const failures = [];

try {
  for (const route of ["/record/", "/doctrine/teach-001/"]) {
    const page = await browser.newPage();
    await page.goto(origin + route, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");
    const state = await page.evaluate(() => {
      const style = (selector) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element) : null;
      };
      return {
        nav: style(".nav")?.display,
        holo: style(".ha")?.display ?? null,
        headingColor: style("h1")?.color,
        rowBreak: style(".led-row")?.breakInside ?? null,
        pageMinHeight: (style(".page") ?? style("section"))?.minHeight,
      };
    });
    if (state.nav !== "none") failures.push(`${route}: navigation remains in print`);
    if (route === "/record/" && state.holo !== "none") failures.push(`${route}: interactive art remains in print`);
    if (state.headingColor !== "rgb(0, 0, 0)") failures.push(`${route}: heading is not print-black`);
    if (route === "/record/" && state.rowBreak !== "avoid") failures.push(`${route}: ledger rows can split across pages`);
    if (state.pageMinHeight !== "0px") failures.push(`${route}: screen-height constraint survives in print`);
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    if (pdf.length < 10000) failures.push(`${route}: print PDF is unexpectedly empty`);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length) {
  console.error("\nPRINT CONTRACT FAILED\n");
  failures.forEach((failure) => console.error(`  ${failure}`));
  process.exit(1);
}
console.log("audit-print: OK · ink on paper · chrome and HoloArt hidden · rows unsplit · A4 output non-empty");
