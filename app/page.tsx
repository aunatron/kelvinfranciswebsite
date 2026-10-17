import Shell from "@/components/site/Shell";
import Attestation from "@/components/records/Attestation";
import RecordIndex from "@/components/site/RecordIndex";
import HomeOverview from "@/components/site/HomeOverview";
import HoloArt from "@/components/holo/HoloArt";
import { AttestScript, HoloArtScript, HoloAudioScript } from "@/components/site/scripts";
import {
  getAttestation,
  getDossierAttestation,
  getEssays,
  getNowEntries,
  getPortrait,
  getRecordEntries,
  getRecordExtents,
} from "@/lib/content";
import { site, repoUrl } from "@/lib/site";

export default function Home() {
  const attest = getDossierAttestation();
  const portrait = getPortrait();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        sameAs: [site.linkedin, repoUrl],
        jobTitle: "Cybersecurity and intelligent-systems founder",
        ...(portrait ? { image: `${site.url}${portrait.src}` } : {}),
      },
      {
        "@type": "WebSite",
        name: site.title,
        url: site.url,
        description: site.description,
      },
    ],
  };

  return (
    <>
      <Shell current="/">
        <Attestation attest={attest} record={getAttestation()} portrait={portrait} />
        <HomeOverview builds={getRecordEntries()} essays={getEssays()} now={getNowEntries()[0]} />
        <RecordIndex extents={getRecordExtents()} />
        {/* Last on purpose: a scene must never be the LCP element, which is
            what lets it load lazily and honestly. */}
        <section className="home-sec home-scene" aria-label="The operator's desk">
          <HoloArt commit={attest.commit} sources={attest.files.length} />
        </section>
      </Shell>
      <AttestScript />
      <HoloArtScript />
      <HoloAudioScript />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
