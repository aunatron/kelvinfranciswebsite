import { getEssays, type EssayDoc } from "./content";

/**
 * Moment B — auto-computed from essay resolutions. Withdrawn essays are
 * excluded from the math but still displayed. Wrong is listed first, and
 * wrong and correct get identical visual treatment — no green, no red.
 */
export function getReckoning() {
  const essays = getEssays();
  const resolved = essays.filter((e) => e.resolution !== "open");
  const by = (r: EssayDoc["resolution"]) => resolved.filter((e) => e.resolution === r);

  const wrong = by("wrong");
  const partial = by("partial");
  const correct = by("correct");
  const withdrawn = by("withdrawn");

  const scored = correct.length + partial.length + wrong.length;
  const hitRate = scored > 0 ? (correct.length + 0.5 * partial.length) / scored : null;

  return {
    open: essays.filter((e) => e.resolution === "open"),
    // Wrong first — that is the point.
    listed: [...wrong, ...partial, ...correct],
    withdrawn,
    counts: {
      wrong: wrong.length,
      partial: partial.length,
      correct: correct.length,
      withdrawn: withdrawn.length,
      scored,
    },
    hitRate,
  };
}
