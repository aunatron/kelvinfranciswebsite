import { RECORDS } from "@/lib/records";

/**
 * The home INDEX: the seven other records as a grid of cards. Each card
 * carries its number, what it holds, and its extent counted from content,
 * so the catalogue says what is inside before you open it.
 */
export default function RecordIndex({ extents }: { extents: Record<string, string> }) {
  return (
    <section id="index" className="home-sec" aria-labelledby="h-index">
      <div className="wrap">
        <div className="sec-label">INDEX · RECORDS 02 TO 08</div>
        <h2 className="home-h" id="h-index">
          The full file.
        </h2>
        <div className="index-grid">
          {RECORDS.slice(1).map((r, i) => (
            <a
              key={r.href}
              className="index-card"
              href={r.href}
              data-reveal
              style={{ "--rv-i": i } as React.CSSProperties}
            >
              <span className="index-top">
                <span className="index-num">§ {r.num}</span>
                <span className="index-extent">{extents[r.href] ?? ""}</span>
              </span>
              <span className="index-name">{r.name}</span>
              <span className="index-line">{r.line}</span>
              <span className="index-go" aria-hidden="true">
                Open →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
