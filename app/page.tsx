import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Attestation from "@/components/records/Attestation";
import TheRecord from "@/components/records/TheRecord";
import Doctrine from "@/components/records/Doctrine";
import Now from "@/components/records/Now";
import Credentials from "@/components/records/Credentials";
import Signal from "@/components/records/Signal";
import TheSystem from "@/components/records/TheSystem";
import Archive from "@/components/records/Archive";
import { getAllContent } from "@/lib/content";
import { site, repoUrl } from "@/lib/site";

export default function Home() {
  const all = getAllContent();

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
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Attestation />
        <TheRecord builds={all.record} service={all.service} />
        <Doctrine essays={all.essays} />
        <Now entry={all.now[0]} />
        <Credentials />
        <Signal />
        <TheSystem doc={all.system} />
        <Archive plates={all.archive} />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
