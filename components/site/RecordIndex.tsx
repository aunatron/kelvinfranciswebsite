import { RECORDS } from "@/lib/records";

/** The home INDEX — a dense mono catalogue of the seven other records. */
export default function RecordIndex() {
  return (
    <section id="index" aria-label="Index of records">
      <div className="wrap">
        <div className="sec-label">INDEX — RECORDS 02–08</div>
        <div className="index-list">
          {RECORDS.slice(1).map((r) => (
            <a key={r.href} className="index-row" href={r.href}>
              <span className="index-num">§ {r.num}</span>
              <span className="index-name">{r.name}</span>
              <span className="index-contains">{r.contains}</span>
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
