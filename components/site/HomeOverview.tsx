import type { EssayDoc, NowDoc, Sourced } from "@/lib/content";
import type { RecordEntry } from "@/lib/validate";

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

function firstParagraph(markdown: string) {
  const para = markdown.split(/\n\s*\n/)[0] ?? "";
  return para.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\s+/g, " ").trim();
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The cover sheet's summary: the newest work, the newest papers, and the
 * current season, each a direct door into its record. Everything here is
 * pulled from content; nothing is written for this panel alone.
 */
export default function HomeOverview({
  builds,
  essays,
  now,
}: {
  builds: Sourced<RecordEntry>[];
  essays: EssayDoc[];
  now: NowDoc;
}) {
  const recent = [...builds].sort((a, b) => b.year - a.year).slice(0, 3);
  const papers = essays.slice(0, 3);

  return (
    <section className="home-sec home-overview" aria-labelledby="h-overview">
      <div className="wrap">
        <div className="sec-label">AT A GLANCE</div>
        <h2 className="home-h" id="h-overview">
          The short version.
        </h2>

        <div className="ov-grid">
          <div className="ov-col">
            <div className="ov-h">
              <span>Recent work</span>
              <a href="/record/">§ 02 · All entries →</a>
            </div>
            <ul className="ov-list">
              {recent.map((b) => (
                <li key={b.source.path}>
                  <a className="ov-item" href="/record/">
                    <span className="ov-meta">
                      {b.year} · {b.status.toUpperCase()}
                    </span>
                    <span className="ov-title">{b.name}</span>
                    <span className="ov-line">{b.line}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ov-col">
            <div className="ov-h">
              <span>Latest papers</span>
              <a href="/doctrine/">§ 03 · Doctrine →</a>
            </div>
            <ul className="ov-list">
              {papers.map((e) => (
                <li key={e.slug}>
                  <a className="ov-item" href={`/doctrine/${e.slug}/`}>
                    <span className="ov-meta">
                      {e.record} · <span className={`ov-grade ${GRADE_CLASS[e.grade]}`}>{GRADE_LABEL[e.grade]}</span>
                    </span>
                    <span className="ov-title">{e.title}</span>
                    <span className="ov-line">{e.summary}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ov-col ov-now">
            <div className="ov-h">
              <span>Now</span>
              <a href="/now/">§ 04 · This season →</a>
            </div>
            <a className="ov-item ov-season" href="/now/">
              <span className="ov-meta">{formatDate(now.date)}</span>
              <span className="ov-quote">{firstParagraph(now.body)}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
