import { pager } from "@/lib/records";
import type { RecordRoute } from "@/lib/records";

/** A dossier is read in order — prev / next at the foot of every record page. */
export default function RecordPager({ current }: { current: RecordRoute["href"] }) {
  const { prev, next } = pager(current);
  return (
    <div className="wrap">
      <div className="pager">
        {prev ? (
          <a className="mono-link" href={prev.href} rel="prev">
            ← § {prev.num} — {prev.name}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="mono-link" href={next.href} rel="next">
            § {next.num} — {next.name} →
          </a>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
