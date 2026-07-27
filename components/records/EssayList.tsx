import type { EssayDoc } from "@/lib/content";

const GRADE_LABEL = {
  fact: "Fact",
  "high-conviction": "High-Conviction",
  scenario: "Scenario",
} as const;

const GRADE_CLASS = {
  fact: "fact",
  "high-conviction": "conv",
  scenario: "scen",
} as const;

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function EssayList({ essays }: { essays: EssayDoc[] }) {
  return (
    <div className="essays">
      {essays.map((e, i) => (
        <a
          key={e.slug}
          className="essay"
          href={`/doctrine/${e.slug}/`}
          data-mode-tag={e.mode}
          data-grade={e.grade}
          data-reveal
          style={{ "--rv-i": i } as React.CSSProperties}
        >
          <span className="e-rec">{e.record}</span>
          <span className="e-title">{e.title}</span>
          <span className="e-meta">
            {e.status === "draft" ? <span className="draft-tag">Draft</span> : null}
            <span className={`grade ${GRADE_CLASS[e.grade]}`}>
              {GRADE_LABEL[e.grade]}
            </span>
            <span className="e-mode">
              {cap(e.mode)} · {cap(e.horizon)}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
