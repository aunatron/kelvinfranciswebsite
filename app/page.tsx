import Shell from "@/components/site/Shell";
import Attestation from "@/components/records/Attestation";
import RecordIndex from "@/components/site/RecordIndex";
import { AttestScript, HoloScript } from "@/components/site/scripts";
import { getDossierAttestation } from "@/lib/content";
import { site, repoUrl } from "@/lib/site";

export default function Home() {
  const attest = getDossierAttestation();
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
        <RecordIndex />
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
