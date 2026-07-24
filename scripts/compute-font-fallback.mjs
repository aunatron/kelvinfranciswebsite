/**
 * Computes the metric-matched fallback @font-face values in styles/fonts.css.
 * Data: @capsizecss/metrics (extracted from the real font files). Formulas:
 *   size-adjust     = (webfont xWidthAvg / upm) ÷ (fallback xWidthAvg / upm)
 *   ascent-override = (webfont ascent / upm) ÷ size-adjust
 *   descent-override= (|webfont descent| / upm) ÷ size-adjust
 *   line-gap-override = (webfont lineGap / upm) ÷ size-adjust
 * Run: node scripts/compute-font-fallback.mjs — paste the output into
 * styles/fonts.css whenever a font changes.
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const pairs = [
  ["Spectral-fallback", require("@capsizecss/metrics/spectral"), require("@capsizecss/metrics/georgia"), "Georgia"],
  ["PlexMono-fallback", require("@capsizecss/metrics/iBMPlexMono"), require("@capsizecss/metrics/courierNew"), "Courier New"],
];

const pct = (v) => `${(v * 100).toFixed(4)}%`;

for (const [name, web, fb, local] of pairs) {
  const sizeAdjust = (web.xWidthAvg / web.unitsPerEm) / (fb.xWidthAvg / fb.unitsPerEm);
  const ascent = (web.ascent / web.unitsPerEm) / sizeAdjust;
  const descent = Math.abs(web.descent / web.unitsPerEm) / sizeAdjust;
  const lineGap = (web.lineGap / web.unitsPerEm) / sizeAdjust;
  console.log(`@font-face {
  font-family: "${name}";
  src: local("${local}");
  size-adjust: ${pct(sizeAdjust)};
  ascent-override: ${pct(ascent)};
  descent-override: ${pct(descent)};
  line-gap-override: ${pct(lineGap)};
}`);
}
