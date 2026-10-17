import Section from "@/components/site/Section";
import Plates from "@/components/records/Plates";
import type { Sourced } from "@/lib/content";
import type { ArchivePlate } from "@/lib/validate";

/**
 * R-08: media as exhibits, not a gallery. Numbered plates, mono metadata,
 * factual captions. Clips are poster + click-to-load only; never autoplay.
 */
export default function Archive({ plates }: { plates: Sourced<ArchivePlate>[] }) {
  return (
    <Section id="r08" num="08" name="The Archive" heading={<>The visual record.</>}>
      {plates.length === 0 ? (
        <div className="dormant">
          <div className="dormant-h">Plates · none yet</div>
          <p>Plates are added as work is documented. Nothing staged, nothing stock.</p>
        </div>
      ) : (
        <Plates plates={plates} />
      )}
    </Section>
  );
}
