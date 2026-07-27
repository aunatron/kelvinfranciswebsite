import { RECORDS } from "@/lib/records";

/**
 * The home INDEX — a dense mono catalogue of the seven other records.
 * Each row carries its extent, so the catalogue says what is inside a
 * record before you open it. Empty reads EMPTY; nothing is padded.
 */
export default function RecordIndex({ extents }: { extents: Record<string, string> }) {
  return (
    <section id="index" aria-label="Index of records">
      <div className="wrap">
        <div className="sec-label">INDEX — RECORDS 02–08</div>
        <div className="index-list">
          {RECORDS.slice(1).map((r, i) => (
            <a
              key={r.href}
              className="index-row"
              href={r.href}
              data-reveal
              style={{ "--rv-i": i } as React.CSSProperties}
            >
              <span className="index-num">§ {r.num}</span>
              <span className="index-name">{r.name}</span>
              <span className="index-contains">{r.contains}</span>
              <span className="index-extent">{extents[r.href] ?? ""}</span>
              <span className="index-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
