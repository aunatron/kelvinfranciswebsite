/**
 * Gate 1 foundation contract.
 *
 * The checks here turn the dossier's foundational rules into repeatable
 * evidence: component literals, viewport law, responsive geometry, touch
 * targets, mode state, inscription motion, no-JS readability, and reduced
 * motion parity. It audits the exported artifact in out/, not the dev server.
 */
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import puppeteer from "puppeteer";
import { serveOut } from "./serve-out.mjs";

const ROOT = process.cwd();
const failures = [];
const artifacts = process.argv[2] ? resolve(process.argv[2]) : null;
const widths = [380, 768, 1280];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function fail(message) {
  failures.push(message);
}

// Component source must bind to tokens, never literal colors or CSS pixels.
for (const base of [join(ROOT, "app"), join(ROOT, "components")]) {
  for (const file of walk(base).filter((path) => path.endsWith(".tsx"))) {
    const source = readFileSync(file, "utf8");
    const lines = source.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (/#[0-9a-f]{3,8}\b/i.test(lines[i])) {
        fail(`${relative(ROOT, file)}:${i + 1} contains a raw color literal`);
      }
      if (/\b\d+(?:\.\d+)?px\b/i.test(lines[i])) {
        fail(`${relative(ROOT, file)}:${i + 1} contains a raw px literal`);
      }
    }
  }
}

// Width-based viewport changes are mobile-first and use exactly two values.
const cssFiles = [
  ...walk(join(ROOT, "app")).filter((path) => path.endsWith(".css")),
  ...walk(join(ROOT, "styles")).filter((path) => path.endsWith(".css")),
];
const seenBreakpoints = new Set();
for (const file of cssFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/@media\s*\(\s*(min|max)-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)/g)) {
    const [, direction, value] = match;
    seenBreakpoints.add(`${direction}:${value}`);
    if (direction !== "min" || !["768", "1024"].includes(value)) {
      fail(`${relative(ROOT, file)} contains forbidden breakpoint ${match[0]}`);
    }
  }
}
for (const required of ["min:768", "min:1024"]) {
  if (!seenBreakpoints.has(required)) fail(`required breakpoint ${required} is missing`);
}

const { server, origin } = await serveOut();
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  if (artifacts) mkdirSync(artifacts, { recursive: true });

  for (const width of widths) {
    const page = await browser.newPage();
    const runtimeErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    const response = await page.goto(origin, { waitUntil: "networkidle0" });

    if (!response || response.status() !== 200) fail(`${width}px: homepage did not return 200`);

    const state = await page.evaluate(() => {
      const box = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      };
      const targets = [
        ...document.querySelectorAll(
          ".nav-home, .mode-toggle button, .attest-seal, .begin, .ha-hot"
        ),
      ].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          name:
            element.getAttribute("aria-label") ||
            element.textContent?.trim().replace(/\s+/g, " ").slice(0, 48) ||
            element.className,
          width: rect.width,
          height: rect.height,
        };
      });
      const stroke = document.querySelector(".hero-sigil .s-stroke");
      const art = document.querySelector(".ha-raster img");
      const stage = document.querySelector("[data-ha-stage]");
      const stageRect = stage?.getBoundingClientRect();
      return {
        viewport: innerWidth,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        hero: box(".hero"),
        attestation: box(".attest"),
        h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
        mode: document.documentElement.getAttribute("data-mode"),
        gold: getComputedStyle(document.documentElement).getPropertyValue("--gold").trim(),
        strokeAnimation: stroke ? getComputedStyle(stroke).animationName : null,
        targets,
        commit: document.querySelector("[data-attest-panel]")?.getAttribute("data-commit"),
        art: art
          ? {
              naturalWidth: art.naturalWidth,
              naturalHeight: art.naturalHeight,
              displayWidth: art.getBoundingClientRect().width,
              transform: getComputedStyle(document.querySelector(".ha-raster")).transform,
              ratio: stageRect ? stageRect.width / stageRect.height : 0,
            }
          : null,
      };
    });

    if (state.overflow > state.viewport + 1) {
      fail(`${width}px: horizontal overflow ${state.overflow}px > ${state.viewport}px`);
    }
    for (const [name, rect] of [
      ["hero", state.hero],
      ["attestation", state.attestation],
    ]) {
      if (!rect) fail(`${width}px: ${name} is missing`);
      else if (rect.left < -1 || rect.right > state.viewport + 1) {
        fail(`${width}px: ${name} escapes the viewport (${rect.left}..${rect.right})`);
      }
    }
    if (!state.h1?.includes("I secure systems")) fail(`${width}px: R-01 heading is missing`);
    if (state.mode !== "francis" || state.gold.toLowerCase() !== "#f2b705") {
      fail(`${width}px: default Francis mode tokens are not applied`);
    }
    if (state.strokeAnimation !== "sigil-inscribe") {
      fail(`${width}px: sigil inscription animation is not armed`);
    }
    for (const target of state.targets) {
      if (target.width < 43.5 || target.height < 43.5) {
        fail(
          `${width}px: touch target ${target.name} is ${target.width.toFixed(1)}x${target.height.toFixed(1)}`
        );
      }
    }
    if (!state.commit) fail(`${width}px: build provenance is absent`);
    if (!state.art || state.art.naturalWidth !== 1672 || state.art.naturalHeight !== 941) {
      fail(`${width}px: HoloArt source dimensions are not 1672x941`);
    } else {
      if (state.art.displayWidth > state.art.naturalWidth / 2 + 1) {
        fail(`${width}px: HoloArt exceeds its 2x sharpness ceiling`);
      }
      if (state.art.transform !== "none") fail(`${width}px: raster is transformed`);
      if (Math.abs(state.art.ratio - 1672 / 941) > 0.001) {
        fail(`${width}px: HoloArt stage ratio drifted to ${state.art.ratio}`);
      }
    }

    await page.click('.mode-toggle button[data-mode="hunter"]');
    const hunter = await page.evaluate(() => ({
      mode: document.documentElement.getAttribute("data-mode"),
      gold: getComputedStyle(document.documentElement).getPropertyValue("--gold").trim(),
      pressed: document
        .querySelector('.mode-toggle button[data-mode="hunter"]')
        ?.getAttribute("aria-pressed"),
    }));
    if (hunter.mode !== "hunter" || hunter.gold.toLowerCase() !== "#917b39" || hunter.pressed !== "true") {
      fail(`${width}px: Hunter mode did not update tokens and control state`);
    }

    if (runtimeErrors.length) fail(`${width}px: console errors: ${runtimeErrors.join(" | ")}`);
    if (artifacts) {
      await page.screenshot({ path: join(artifacts, `gate1-home-${width}.png`) });
    }
    await page.close();
  }

  const reduced = await browser.newPage();
  await reduced.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reduced.setViewport({ width: 380, height: 900, deviceScaleFactor: 1 });
  await reduced.goto(origin, { waitUntil: "networkidle0" });
  const reducedState = await reduced.evaluate(() => {
    const stroke = document.querySelector(".hero-sigil .s-stroke");
    const fill = document.querySelector(".hero-sigil .s-fill");
    return {
      strokeAnimation: stroke ? getComputedStyle(stroke).animationName : null,
      strokeOffset: stroke ? getComputedStyle(stroke).strokeDashoffset : null,
      fillAnimation: fill ? getComputedStyle(fill).animationName : null,
      fillOpacity: fill ? getComputedStyle(fill).opacity : null,
    };
  });
  if (
    reducedState.strokeAnimation !== "none" ||
    reducedState.strokeOffset !== "0px" ||
    reducedState.fillAnimation !== "none" ||
    reducedState.fillOpacity !== "1"
  ) {
    fail(`reduced motion does not render the complete static sigil: ${JSON.stringify(reducedState)}`);
  }
  await reduced.close();

  const noJs = await browser.newPage();
  await noJs.setJavaScriptEnabled(false);
  await noJs.setViewport({ width: 380, height: 900, deviceScaleFactor: 1 });
  await noJs.goto(origin, { waitUntil: "networkidle0" });
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 1300));
  const noJsState = await noJs.evaluate(() => ({
    heading: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
    attestation: document.querySelector(".attest")?.textContent?.replace(/\s+/g, " ").trim(),
    hiddenReveals: [...document.querySelectorAll("[data-reveal]")].filter(
      (element) => getComputedStyle(element).opacity === "0"
    ).length,
  }));
  if (!noJsState.heading || !noJsState.attestation || noJsState.hiddenReveals) {
    fail(`no-JS homepage is not complete and readable: ${JSON.stringify(noJsState)}`);
  }
  await noJs.close();
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

console.log(
  `audit-foundation: ${widths.join("/")}px · Francis/Hunter · reduced-motion · no-JS`
);
if (failures.length) {
  console.error("\nFOUNDATION CONTRACT FAILED\n");
  failures.forEach((message) => console.error(`  ${message}`));
  process.exit(1);
}
console.log("audit-foundation: OK — Gate 1 implementation contract holds.");
