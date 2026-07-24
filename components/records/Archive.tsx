import Section from "@/components/site/Section";
import type { Sourced } from "@/lib/content";
import type { ArchivePlate } from "@/lib/validate";

function pad(n: number) {
  return String(n).padStart(3, "0");
}

/**
 * R-08 — media as exhibits, not a gallery. Numbered plates, mono metadata,
 * factual captions. Clips are poster + click-to-load only; never autoplay.
 */
export default function Archive({ plates }: { plates: Sourced<ArchivePlate>[] }) {
  return (
    <Section id="r08" num="08" name="The Archive" heading={<>The visual record.</>}>
      {plates.length === 0 ? (
        <div className="dormant">
          <div className="dormant-h">Plates — none yet</div>
          <p>Plates are added as work is documented. Nothing staged, nothing stock.</p>
        </div>
      ) : (
        <div className="plates">
          {plates.map((p) => (
            <figure key={p.plate} className="plate">
              {p.media === "image" ? (
                <img src={p.src} alt={p.caption} loading="lazy" decoding="async" />
              ) : (
                <a className="plate-clip" href={p.src}>
                  {p.poster ? (
                    <img src={p.poster} alt={p.caption} loading="lazy" decoding="async" />
                  ) : null}
                  <span className="mono">▶ LOAD CLIP</span>
                </a>
              )}
              <figcaption className="plate-meta">
                PLATE {pad(p.plate)} · {p.date} · {p.caption}
                {p.record ? <> · → {p.record}</> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
