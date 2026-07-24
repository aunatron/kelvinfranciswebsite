import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import { getReckoning } from "@/lib/reckoning";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Track Record · ${site.name}`,
  description:
    "Every resolved call, misses listed first. Withdrawn shown, not counted.",
};

const RES_LABEL = {
  wrong: "WRONG",
  partial: "PARTIAL",
  correct: "CORRECT",
  withdrawn: "WITHDRAWN",
} as const;

export default function TrackRecordPage() {
  const r = getReckoning();

  return (
    <Shell>
      <div className="wrap page">
        <div className="sec-label">§ 03 · TRACK RECORD — THE RECKONING</div>
        <h1 className="page-h">Misses first.</h1>

        <div className="score">
          <div>
            <div className="score-l">Hit rate</div>
            <p>
              {r.hitRate === null ? (
                <>
                  <span className="mono score-when">—</span> · no resolved
                  calls yet. First Reckoning:{" "}
                  <span className="mono score-when">Q4 2026</span>.
                </>
              ) : (
                <>
                  <span className="mono score-when">
                    {(r.hitRate * 100).toFixed(0)}%
                  </span>{" "}
                  across {r.counts.scored} scored call
                  {r.counts.scored === 1 ? "" : "s"}.
                </>
              )}
            </p>
          </div>
          <span className="phase">
            {r.counts.wrong} wrong · {r.counts.partial} partial ·{" "}
            {r.counts.correct} correct · {r.counts.withdrawn} withdrawn
          </span>
        </div>

        {r.listed.length > 0 ? (
          <div className="essays reckoning-list">
            {r.listed.map((e) => (
              <a key={e.slug} className="essay" href={`/doctrine/${e.slug}/`}>
                <span className="e-rec">{e.record}</span>
                <span className="e-title">{e.title}</span>
                <span className="e-meta">
                  <span className="tag">[{RES_LABEL[e.resolution as keyof typeof RES_LABEL]}]</span>
                  {e.resolved ? <span className="e-mode">{e.resolved}</span> : null}
                </span>
              </a>
            ))}
          </div>
        ) : null}

        {r.withdrawn.length > 0 ? (
          <>
            <div className="sub-label">WITHDRAWN — DISPLAYED, NOT COUNTED</div>
            <div className="essays">
              {r.withdrawn.map((e) => (
                <a key={e.slug} className="essay" href={`/doctrine/${e.slug}/`}>
                  <span className="e-rec">{e.record}</span>
                  <span className="e-title">{e.title}</span>
                  <span className="e-meta">
                    <span className="tag">[WITHDRAWN]</span>
                  </span>
                </a>
              ))}
            </div>
          </>
        ) : null}

        <div className="fine">
          hit rate = (correct + 0.5 · partial) ÷ (correct + partial + wrong).
          <br />
          Withdrawn is excluded from the math and displayed all the same.
          <br />
          Wrong and correct get identical treatment — no green, no red.
        </div>

        <p className="split page-back">
          <a className="mono-link" href="/doctrine/">
            ← § 03 — Doctrine
          </a>
        </p>
      </div>
    </Shell>
  );
}
