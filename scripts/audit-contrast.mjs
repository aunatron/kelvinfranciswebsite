/**
 * Contrast audit — the token law, enforced by the pipeline.
 *
 * Reads the real token values out of styles/tokens.css, reads every colour
 * rule out of the stylesheets, and works out which ground each piece of text
 * actually renders on by walking the BUILT HTML in out/ — so a label inside
 * the attestation panel is audited against the panel, not against the page.
 * Any text under 4.5:1 in either mode fails the build.
 *
 * It also enforces that --gold-rule (2.83) never colours text: it is a
 * border token.
 *
 * Run after `npm run build` (it needs out/).
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const MIN = 4.5;
const TOKENS_FILE = "styles/tokens.css";
const OUT = "out";

/** Classes whose background is --ink-raised. Kept honest by the check below. */
const RAISED = [".attest", ".score", ".cred-card", ".changelog"];

/** --gold-rule is a border token: never text. */
const BORDER_ONLY = ["--gold-rule"];

/**
 * Decorative, non-text uses of `color` — it drives SVG stroke/fill, not
 * glyphs, so WCAG's text floor does not apply. Listed so the exemption is
 * visible rather than silent.
 */
const DECORATIVE = new Set([
  ".sigil-wm",
  ".nav-sigil",
  ".hero-sigil",
  ".nf-sigil",
  ".hl-cyan svg",
  ".hl-mag svg",
  ".hl-back svg,.hl-front svg",
  ".hl-core svg",
]);

/* ── Palettes ────────────────────────────────────────────── */

const tokensCss = readFileSync(TOKENS_FILE, "utf8");
const parseDecls = (s) => {
  const out = {};
  for (const m of s.matchAll(/(--[a-z-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) if (!(m[1] in out)) out[m[1]] = m[2];
  return out;
};
const root = parseDecls(tokensCss.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "");
const hunter = parseDecls(tokensCss.match(/\[data-mode="hunter"\]\s*\{([^}]*)\}/)?.[1] ?? "");
const PALETTES = { francis: root, hunter: { ...root, ...hunter } };

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* ── Which classes render inside a raised panel? (from the built HTML) ── */

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function* files(dir, ext) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    if ([".git", "node_modules", ".next", "_local"].includes(entry)) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) yield* files(p, ext);
    else if (entry.endsWith(ext)) yield p;
  }
}

const raisedClasses = new Set(RAISED.map((r) => r.slice(1)));
/** class name → the raised panel it renders inside */
const insideRaised = new Map();

for (const file of files(OUT, ".html")) {
  const html = readFileSync(file, "utf8");
  const stack = [];
  let depthOfRaised = -1;
  let panelOfRaised = null;
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g)) {
    const [, closing, tag, attrs, selfClose] = m;
    const name = tag.toLowerCase();
    if (closing) {
      while (stack.length && stack.pop() !== name) {
        /* tolerate unclosed tags */
      }
      // The panel itself opened at depthOfRaised; once we pop back to that
      // depth the subtree is closed.
      if (depthOfRaised !== -1 && stack.length <= depthOfRaised) depthOfRaised = -1;
      continue;
    }
    const classes = (attrs.match(/\bclass="([^"]*)"/)?.[1] ?? "").split(/\s+/).filter(Boolean);
    if (depthOfRaised !== -1) for (const c of classes) insideRaised.set(c, panelOfRaised);
    const own = classes.find((c) => raisedClasses.has(c));
    if (own && depthOfRaised === -1) {
      depthOfRaised = stack.length;
      panelOfRaised = own;
    }
    if (!selfClose && !VOID.has(name)) stack.push(name);
  }
}

/* ── Rules ───────────────────────────────────────────────── */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

function rules(css) {
  const out = [];
  for (const m of stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().replace(/\s+/g, " ");
    if (!selector || selector.startsWith("@") || selector.includes("%")) continue;
    out.push({ selector, body: m[2] });
  }
  return out;
}

const failures = [];
const checks = [];
const foundRaised = new Set();
/** mode → class → ground token, for panels a mode re-grounds. */
const modeGrounds = {};

const allRules = [];
for (const file of files(".", ".css")) {
  if (file.startsWith(OUT)) continue;
  for (const rule of rules(readFileSync(file, "utf8"))) allRules.push({ file, ...rule });
}

// Pass 1 — where each panel's ground sits, per mode.
for (const { selector, body } of allRules) {
  const bg = body.match(/(?:^|[\s;])background(?:-color)?\s*:\s*([^;]+)/)?.[1];
  if (!bg) continue;
  if (/--ink-raised/.test(bg)) {
    // Replaced elements (img, video…) cannot contain text, so a background on
    // one never becomes a ground for glyphs — e.g. `.plate img` reserving its
    // box. Only elements that can hold text count as raised surfaces.
    const last = selector.split(/[\s>]+/).pop() ?? "";
    const replaced = /^(img|svg|video|canvas|iframe|input|picture)\b/.test(last);
    const cls = selector.split(/[\s,>]+/).find((s) => s.startsWith("."));
    if (cls && !replaced) foundRaised.add(cls);
  }
  // A mode may re-ground a panel (hunter flattens them onto the page ink).
  const mode = selector.match(/\[data-mode="(\w+)"\]/)?.[1];
  const groundToken = bg.match(/var\((--ink[a-z-]*)\)/)?.[1];
  if (mode && groundToken) {
    for (const part of selector.split(",")) {
      const cls = part.trim().match(/\.([a-zA-Z][\w-]*)/)?.[1];
      if (cls) (modeGrounds[mode] ??= {})[cls] = groundToken;
    }
  }
}

// Pass 2 — every text colour, against the ground it actually renders on.
{
  for (const { file, selector, body } of allRules) {
    const bg = body.match(/(?:^|[\s;])background(?:-color)?\s*:\s*([^;]+)/)?.[1];
    const token = body.match(/(?:^|[\s;])color\s*:\s*var\((--[a-z-]+)\)/)?.[1];
    if (!token) continue;

    if (BORDER_ONLY.includes(token)) {
      if (!DECORATIVE.has(selector)) {
        failures.push(`${file} — \`${selector}\` colours text with ${token}; that is a border token`);
      }
      continue;
    }
    if (DECORATIVE.has(selector)) continue;

    // Ground: the rule's own background if it paints one, else the panel it
    // renders inside (which a mode may have re-grounded), else the page.
    const ownBg = bg?.match(/var\((--[a-z-]+)\)/)?.[1];
    const classes = [...selector.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    const panel = classes.find((c) => raisedClasses.has(c)) ?? classes.map((c) => insideRaised.get(c)).find(Boolean);

    for (const [mode, palette] of Object.entries(PALETTES)) {
      const ground = ownBg ?? (panel ? modeGrounds[mode]?.[panel] ?? "--ink-raised" : "--ink");
      const fg = palette[token];
      const bgHex = palette[ground];
      if (!fg || !bgHex) {
        failures.push(`${file} — \`${selector}\`: ${token} or ${ground} is not defined`);
        continue;
      }
      const ratio = contrast(fg, bgHex);
      checks.push({ mode, selector, token, ground, ratio });
      if (ratio < MIN) {
        failures.push(
          `${file} — \`${selector}\`: ${token} (${fg}) on ${ground} in ${mode} = ${ratio.toFixed(2)}, under ${MIN}`
        );
      }
    }
  }
}

for (const cls of foundRaised) {
  if (!RAISED.includes(cls)) {
    failures.push(`${cls} paints an --ink-raised background but is not declared in RAISED — its text would be audited against the wrong ground`);
  }
}

/* ── Report ──────────────────────────────────────────────── */

const worst = [...checks].sort((a, b) => a.ratio - b.ratio).slice(0, 6);
console.log("tightest text/ground pairs on the site:");
for (const c of worst) {
  console.log(`  ${c.ratio.toFixed(2)}  ${c.mode.padEnd(7)} ${c.selector.padEnd(26)} ${c.token} on ${c.ground}`);
}
console.log(`\naudit-contrast: ${checks.length} text/ground pairs across 2 modes, floor ${MIN}:1`);
console.log(`audit-contrast: ${insideRaised.size} classes seen inside raised panels; ${DECORATIVE.size} decorative colour uses exempt`);

if (failures.length) {
  console.error("\n════ CONTRAST AUDIT FAILED — BUILD REJECTED ════\n");
  for (const f of failures) console.error(`  ${f}`);
  console.error("\n════════════════════════════════════════════════\n");
  process.exit(1);
}
console.log("audit-contrast: OK — every text colour clears AA on the ground it renders on.");
