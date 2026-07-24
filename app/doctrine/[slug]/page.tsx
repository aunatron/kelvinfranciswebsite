import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Verify from "@/components/ui/Verify";
import { getEssays } from "@/lib/content";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssays().find((e) => e.slug === slug);
  if (!essay) return {};
  return {
    title: `${essay.record} — ${essay.title}`,
    description: essay.summary,
  };
}

const GRADE_LABEL = {
  fact: "FACT",
  "high-conviction": "HIGH-CONVICTION",
  scenario: "SCENARIO",
} as const;

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const essay = getEssays().find((e) => e.slug === slug);
  if (!essay) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    identifier: essay.record,
    datePublished: essay.date,
    author: { "@type": "Person", name: site.name, url: site.url },
    url: `${site.url}/doctrine/${essay.slug}/`,
    description: essay.summary,
  };

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="page" data-page-mode={essay.mode}>
        <article className="wrap essay-page">
          <div className="sec-label">
            {essay.record} · {essay.date}
          </div>
          <h1 className="page-h">{essay.title}</h1>
          <div className="essay-meta mono">
            <span>GRADE {GRADE_LABEL[essay.grade]}</span>
            <span>MODE {essay.mode.toUpperCase()}</span>
            <span>HORIZON {essay.horizon.toUpperCase()}</span>
            <span>STATUS {essay.status.toUpperCase()}</span>
            <span>RESOLUTION {essay.resolution.toUpperCase()}</span>
          </div>
          <div className="essay-body">
            <MDXRemote source={essay.body} />
          </div>
          <Verify sources={[essay.source]} />
          <p className="split page-back">
            <a className="mono-link" href="/doctrine/">
              ← All doctrine
            </a>
          </p>
        </article>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
