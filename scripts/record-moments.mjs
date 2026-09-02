import { existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer";
import { serveOut } from "./serve-out.mjs";

const outputDir = resolve(process.argv[2] ?? "review-clips");
mkdirSync(outputDir, { recursive: true });

const { server, origin } = await serveOut();

async function capture(name, setup, actions = new Map()) {
  const framesDir = join(outputDir, `.frames-${name}`);
  if (!framesDir.startsWith(outputDir)) throw new Error("frame directory escaped the requested output directory");
  if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir);
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  try {
    await setup(page);
    const started = Date.now();
    for (let frame = 0; frame < 30; frame++) {
      if (actions.has(frame)) await actions.get(frame)(page);
      await page.screenshot({ path: join(framesDir, `frame-${String(frame).padStart(3, "0")}.jpg`), type: "jpeg", quality: 82 });
      const due = started + (frame + 1) * 200;
      const remaining = due - Date.now();
      if (remaining > 0) await new Promise((resolveDelay) => setTimeout(resolveDelay, remaining));
    }
    const destination = join(outputDir, `${name}.mp4`);
    const result = spawnSync(
      "ffmpeg",
      ["-y", "-framerate", "5", "-i", join(framesDir, "frame-%03d.jpg"), "-t", "6", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", destination],
      { encoding: "utf8" }
    );
    if (result.status !== 0) throw new Error(`ffmpeg failed for ${name}: ${result.stderr}`);
    console.log(`record-moments: ${destination}`);
  } finally {
    if (page && !page.isClosed()) await page.close().catch(() => {});
    await browser.close().catch(() => {});
    rmSync(framesDir, { recursive: true, force: true });
  }
}

try {
  await capture(
    "moment-a-live-attestation",
    async (page) => {
      await page.goto(origin, { waitUntil: "networkidle0" });
      await page.click("[data-attest-seal]");
    },
    new Map([[11, async (page) => page.$eval("[data-ha-audio]", (button) => button.focus())]])
  );

  await capture(
    "moment-b-the-reckoning",
    async (page) => page.goto(`${origin}/track-record/`, { waitUntil: "networkidle0" })
  );

  await capture(
    "moment-c-the-rupture",
    async (page) => page.goto(`${origin}/doctrine/`, { waitUntil: "networkidle0" }),
    new Map([
      [4, async (page) => Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        page.click('a[href="/doctrine/hunt-001/"]'),
      ])],
    ])
  );
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
}
