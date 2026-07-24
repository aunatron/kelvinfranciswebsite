import Sigil from "@/components/ui/Sigil";
import ModeToggle from "@/components/ui/ModeToggle";
import Attestation from "@/components/records/Attestation";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <nav className="nav" aria-label="Primary">
        <div className="nav-in">
          <Sigil cut="small" className="nav-sigil" label="KF" />
          <span className="nav-name">The Human Attestation</span>
          <ModeToggle />
        </div>
      </nav>

      <main id="main">
        <Attestation />
      </main>

      <footer className="foot-shell">
        <div className="wrap foot">
          <div className="foot-origin">
            Built in <em>Africa.</em>
          </div>
          <div className="foot-truth">
            THIS PAGE SAYS ONLY WHAT IS TRUE TODAY · © 2026 KELVIN-FRANCIS PEPRAH
          </div>
        </div>
      </footer>
    </>
  );
}
