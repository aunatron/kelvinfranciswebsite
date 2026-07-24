type SectionProps = {
  id: string;
  num: string;
  name: string;
  heading: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

/** The record pattern: mono label `§ 0N — NAME` with hairline rule → serif heading → content. */
export default function Section({ id, num, name, heading, intro, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`h-${id}`}>
      <div className="wrap">
        <div className="sec-label">
          § {num} — {name}
        </div>
        <h2 id={`h-${id}`}>{heading}</h2>
        {intro ? <p className="sec-intro">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}
