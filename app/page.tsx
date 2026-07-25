import Shell from "@/components/site/Shell";
import Attestation from "@/components/records/Attestation";
import RecordIndex from "@/components/site/RecordIndex";
import { AttestScript, HoloScript } from "@/components/site/scripts";
import { getAllContent, getDossierAttestation } from "@/lib/content";
import { recordExtents } from "@/lib/records";
import { site, repoUrl } from "@/lib/site";

export default function Home() {
  const attest = getDossierAttestation();
  const all = getAllContent();
  const extents = recordExtents({
    builds: all.record.length,
    service: all.service.length,
    essays: all.essays.length,
    now: all.now.length,
    plates: all.archive.length,
    systemVersion: all.system.version,
  });
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
        <Attestation attest={attest} />
        <RecordIndex extents={extents} />
      </Shell>
      <AttestScript />
      <HoloScript />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
