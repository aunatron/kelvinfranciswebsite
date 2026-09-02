import { RECORDS } from "@/lib/records";

type SectionProps = {
  id: string;
  num: string;
  name: string;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

/** The record pattern: mono label `§ 0N / 08 — NAME` with hairline rule → serif heading → content. */
export default function Section({ id, num, name, heading, intro, children }: SectionProps) {
  const total = String(RECORDS.length).padStart(2, "0");
  return (
    <section id={id} aria-labelledby={`h-${id}`}>
      <div className="wrap">
        <div className="sec-label">
          § {num} / {total} · {name}
        </div>
        <h1 className="section-heading" id={`h-${id}`}>{heading}</h1>
        {intro ? <p className="sec-intro">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
