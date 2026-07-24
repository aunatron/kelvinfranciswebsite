import Section from "@/components/site/Section";
import EssayList from "@/components/records/EssayList";
import type { EssayDoc } from "@/lib/content";

const CHIPS = [
  ["all", "ALL"],
  ["francis", "FRANCIS"],
  ["hunter", "HUNTER"],
  ["fact", "FACT"],
  ["high-conviction", "HIGH-CONVICTION"],
  ["scenario", "SCENARIO"],
] as const;

export default function Doctrine({ essays }: { essays: EssayDoc[] }) {
  return (
    <Section
      id="r03"
      num="03"
      name="Doctrine"
      heading={<>The record of what I&rsquo;ve said.</>}
    >
      <div className="filters" role="group" aria-label="Filter essays">
        {CHIPS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`chip${value === "all" ? " on" : ""}`}
            data-filter={value}
          >
            {label}
          </button>
        ))}
      </div>

      <EssayList essays={essays} />

      <div className="score">
        <div>
          <div className="score-l">Track Record</div>
          <p>
            No resolved calls yet. First Reckoning:{" "}
            <span className="mono score-when">Q4 2026</span>.
          </p>
          <a className="mono-link" href="/track-record/">
            → The Reckoning
          </a>
        </div>
        <span className="phase">misses listed first</span>
      </div>
    </Section>
  );
}
