import puppeteer from "puppeteer";
import { serveOut } from "./serve-out.mjs";

const failures = [];
const fail = (message) => failures.push(message);
const { server, origin } = await serveOut();
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--autoplay-policy=user-gesture-required"],
});

async function framesPerSecond(page, duration = 1200) {
  return page.evaluate((sampleMs) => new Promise((resolve) => {
    const frames = [];
    const start = performance.now();
    function frame(now) {
      frames.push(now);
      if (now - start < sampleMs) requestAnimationFrame(frame);
      else resolve((frames.length - 1) / ((frames.at(-1) - frames[0]) / 1000));
    }
    requestAnimationFrame(frame);
  }), duration);
}

try {
  const home = await browser.newPage();
  await home.evaluateOnNewDocument(() => {
    window.__audioContexts = 0;
    const Native = window.AudioContext || window.webkitAudioContext;
    if (Native) {
      const Wrapped = new Proxy(Native, {
        construct(target, args) {
          window.__audioContexts++;
          return Reflect.construct(target, args);
        },
      });
      window.AudioContext = Wrapped;
      window.webkitAudioContext = Wrapped;
    }
  });
  await home.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await home.goto(origin, { waitUntil: "networkidle0" });
  const beforeAudio = await home.evaluate(() => window.__audioContexts);
  if (beforeAudio !== 0) fail(`field audio constructed ${beforeAudio} contexts before user action`);
  await home.click("[data-attest-seal]");
  const attestationFps = await framesPerSecond(home);
  if (attestationFps < 55) fail(`Live Attestation averaged ${attestationFps.toFixed(1)}fps`);
  await home.click("[data-ha-audio]");
  const audio = await home.evaluate(() => ({
    contexts: window.__audioContexts,
    pressed: document.querySelector("[data-ha-audio]")?.getAttribute("aria-pressed"),
  }));
  if (audio.contexts !== 1 || audio.pressed !== "true") fail(`field audio did not arm after explicit action: ${JSON.stringify(audio)}`);
  await home.click("[data-ha-audio]");
  await home.close();

  const record = await browser.newPage();
  await record.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await record.goto(`${origin}/record/`, { waitUntil: "networkidle0" });
  await record.$eval(".pc", (element) => {
    document.documentElement.style.scrollBehavior = "auto";
    element.scrollIntoView({ block: "center" });
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
  const stations = await record.evaluate(() => [...document.querySelectorAll(".pc .ha-hot")].map((button) => {
    const rect = button.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      label: button.getAttribute("aria-label"),
      width: rect.width,
      height: rect.height,
      hit: hit === button,
    };
  }));
  if (stations.length !== 5) fail(`proof constellation has ${stations.length} stations; expected five`);
  for (const station of stations) {
    if (station.width < 43.5 || station.height < 43.5 || !station.hit) {
      fail(`proof station failed its hit-test: ${JSON.stringify(station)}`);
    }
  }
  for (let index = 0; index < stations.length; index++) {
    await record.evaluate((i) => document.querySelectorAll(".pc .ha-hot")[i].click(), index);
    const pressed = await record.evaluate((i) => document.querySelectorAll(".pc .ha-hot")[i].getAttribute("aria-pressed"), index);
    if (pressed !== "true") fail(`proof station ${index + 1} did not hold its selected state`);
  }
  const constellationFps = await framesPerSecond(record);
  if (constellationFps < 55) fail(`proof constellation averaged ${constellationFps.toFixed(1)}fps`);
  await record.close();

  const reckoning = await browser.newPage();
  await reckoning.goto(`${origin}/track-record/`, { waitUntil: "networkidle0" });
  const reckoningText = await reckoning.$eval("main", (element) => element.textContent.replace(/\s+/g, " ").toLowerCase());
  if (!reckoningText.includes("no resolved calls yet") || !reckoningText.includes("misses first")) {
    fail("The Reckoning does not expose its honest empty state and ordering rule");
  }
  await reckoning.close();

  const hunter = await browser.newPage();
  await hunter.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await hunter.goto(`${origin}/doctrine/hunt-001/`, { waitUntil: "domcontentloaded" });
  await new Promise((resolve) => setTimeout(resolve, 120));
  const rupture = await hunter.evaluate(() => ({
    mode: document.documentElement.getAttribute("data-mode"),
    leading: document.documentElement.getAttribute("data-leading"),
    sigil: document.querySelector(".nav-sigil")?.classList.contains("sigil-draw"),
  }));
  if (rupture.mode !== "hunter" || rupture.leading !== "hunter" || !rupture.sigil) {
    fail(`The Rupture did not enter Hunter mode: ${JSON.stringify(rupture)}`);
  }
  const ruptureFps = await framesPerSecond(hunter);
  if (ruptureFps < 55) fail(`The Rupture averaged ${ruptureFps.toFixed(1)}fps`);
  await hunter.close();

  const reduced = await browser.newPage();
  await reduced.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await reduced.goto(origin, { waitUntil: "networkidle0" });
  const reducedAnimation = await reduced.$eval(".ha-scan", (element) => getComputedStyle(element).animationName);
  if (reducedAnimation !== "none") fail(`reduced motion still runs the HoloArt scan: ${reducedAnimation}`);
  await reduced.close();

  for (const path of ["/", "/record/", "/track-record/", "/doctrine/hunt-001/"]) {
    const noJs = await browser.newPage();
    await noJs.setJavaScriptEnabled(false);
    await noJs.goto(`${origin}${path === "/" ? "" : path}`, { waitUntil: "networkidle0" });
    const state = await noJs.evaluate(() => ({
      h1: Boolean(document.querySelector("h1")?.textContent?.trim()),
      hidden: [...document.querySelectorAll("[data-reveal]")].filter((element) => {
        const style = getComputedStyle(element);
        return element.textContent?.trim() && style.opacity === "0";
      }).length,
      scene: document.querySelector(".ha-raster img") ? getComputedStyle(document.querySelector(".ha-raster img")).display : null,
      hunterGold: document.querySelector('[data-page-mode="hunter"]')
        ? getComputedStyle(document.querySelector('[data-page-mode="hunter"]')).getPropertyValue("--gold").trim()
        : null,
    }));
    if (!state.h1 || state.hidden) fail(`${path} is incomplete without JavaScript: ${JSON.stringify(state)}`);
    if ((path === "/" || path === "/record/") && state.scene === "none") fail(`${path} hides its scene without JavaScript`);
    if (path.includes("hunt-001") && state.hunterGold.toLowerCase() !== "#917b39") fail("Hunter mode loses its tokens without JavaScript");
    await noJs.close();
  }

  console.log(
    `audit-moments: measured ${attestationFps.toFixed(1)}fps attestation · ${constellationFps.toFixed(1)}fps constellation · ${ruptureFps.toFixed(1)}fps rupture`
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length) {
  console.error("\nMOMENTS CONTRACT FAILED\n");
  failures.forEach((message) => console.error(`  ${message}`));
  process.exit(1);
}
console.log("audit-moments: OK · three moments · five hotspots · explicit audio · reduced motion · no-JS parity");
