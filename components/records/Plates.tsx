import Photo from "@/components/ui/Photo";
import type { Sourced } from "@/lib/content";
import type { ArchivePlate } from "@/lib/validate";

function pad(n: number) {
  return String(n).padStart(3, "0");
}

/**
 * The plate grid, shared by the Archive and by any record a plate
 * documents. An image plate opens its full-size file in place of a
 * lightbox: a plain link, so it works with JavaScript off.
 */
export default function Plates({
  plates,
  compact = false,
}: {
  plates: Sourced<ArchivePlate>[];
  compact?: boolean;
}) {
  return (
    <div className={`plates${compact ? " plates-compact" : ""}`}>
      {plates.map((p, i) => (
        <figure
          key={p.plate}
          className="plate"
          id={`plate-${pad(p.plate)}`}
          data-reveal
          style={{ "--rv-i": i } as React.CSSProperties}
        >
          {p.media === "image" ? (
            <a className="plate-media" href={p.full ?? p.src} aria-label={`Open plate ${pad(p.plate)} at full size`}>
              <Photo
                photo={p}
                sizes="(min-width: 64em) 30vw, (min-width: 48em) 45vw, 92vw"
              />
            </a>
          ) : (
            <a className="plate-media plate-clip" href={p.src}>
              {p.poster ? (
                <img src={p.poster} alt={p.alt} width={p.width} height={p.height} loading="lazy" decoding="async" />
              ) : null}
              <span className="plate-play mono">▶ LOAD CLIP</span>
            </a>
          )}
          <figcaption className="plate-meta">
            <span className="plate-id">
              PLATE {pad(p.plate)} · {p.date}
              {p.record ? <> · {p.record}</> : null}
            </span>
            <span className="plate-cap">{p.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Plates a record documents, shown on that record's own page. Renders nothing when there are none. */
export function RelatedPlates({ plates }: { plates: Sourced<ArchivePlate>[] }) {
  if (plates.length === 0) return null;
  return (
    <div className="related-plates">
      <div className="sub-label">FROM THE ARCHIVE</div>
      <Plates plates={plates} compact />
    </div>
  );
}
