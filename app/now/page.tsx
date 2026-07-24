import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Verify from "@/components/ui/Verify";
import { getNowEntries } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Now — ${site.name}`,
  description: "Seasons of work, dated, in the present tense of their time.",
};

export default function NowArchive() {
  const entries = getNowEntries();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="page">
        <div className="wrap">
          <div className="sec-label">§ 04 — Now · Archive</div>
          <h1 className="page-h">
            Every season, <em>kept.</em>
          </h1>
          {entries.map((entry) => (
            <div className="now now-past" key={entry.source.path}>
              <div className="now-date">{entry.date}</div>
              <MDXRemote source={entry.body} />
              <Verify sources={[entry.source]} />
            </div>
          ))}
          <p className="split page-back">
            <a className="mono-link" href="/">
              ← Back to the dossier
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
