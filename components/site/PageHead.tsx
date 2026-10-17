import { RECORDS, recordByHref } from "@/lib/records";

/**
 * The header every record page opens with: a breadcrumb back to the cover
 * sheet, the record's position, its heading, and one plain line saying what
 * the record holds.
 */
export default function PageHead({
  href,
  heading,
  aside,
}: {
  href: string;
  heading: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const r = recordByHref(href);
  if (!r) return null;
  const total = String(RECORDS.length).padStart(2, "0");
  return (
    <header className="phead">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Dossier</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          § {r.num} · {r.name}
        </span>
        <span className="crumbs-pos">
          {r.num} OF {total}
        </span>
      </nav>
      <div className="phead-row">
        <div>
          <h1 className="section-heading" id={`h-r${r.num}`}>
            {heading}
          </h1>
          <p className="phead-line">{r.line}</p>
        </div>
        {aside ? <div className="phead-aside">{aside}</div> : null}
      </div>
    </header>
  );
}
