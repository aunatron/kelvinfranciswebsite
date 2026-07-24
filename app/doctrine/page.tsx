import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import EssayList from "@/components/records/EssayList";
import { getEssays } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Doctrine — ${site.name}`,
  description: "Numbered, dated, graded essays. Bets get settled in public.",
};

export default function DoctrineIndex() {
  const essays = getEssays();
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="page">
        <div className="wrap">
          <div className="sec-label">§ 03 — Doctrine · Index</div>
          <h1 className="page-h">
            Dated. Graded. <em>Eventually scored.</em>
          </h1>
          <EssayList essays={essays} />
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
