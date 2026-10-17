import { pager } from "@/lib/records";
import type { RecordRoute } from "@/lib/records";

/** A dossier is read in order: prev / next at the foot of every record page, as large targets. */
export default function RecordPager({ current }: { current: RecordRoute["href"] }) {
  const { prev, next } = pager(current);
  return (
    <div className="wrap">
      <div className="pager">
        {prev ? (
          <a className="pager-card" href={prev.href} rel="prev">
            <span className="pager-dir">← § {prev.num}</span>
            <span className="pager-name">{prev.name}</span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="pager-card pager-next" href={next.href} rel="next">
            <span className="pager-dir">§ {next.num} →</span>
            <span className="pager-name">{next.name}</span>
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
