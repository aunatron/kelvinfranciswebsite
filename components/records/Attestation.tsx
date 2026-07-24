import Sigil from "@/components/ui/Sigil";
import { site } from "@/lib/site";

/**
 * R-01 · ATTESTATION — the hero record.
 */
export default function Attestation() {
  return (
    <header id="r01" className="hero-shell">
      <div className="wrap hero">
        <div>
          <Sigil cut="master" inscribe className="hero-sigil" label="The KF sigil" />
          <p className="hero-name">{site.name}</p>
          <h1>
            I secure systems.
            <br />
            Then I make them <em>intelligent.</em>
          </h1>
          <p className="thesis">
            As everything gets easier to fake,{" "}
            <strong>I work on the side that proves what&rsquo;s real.</strong>
          </p>
        </div>

        <div className="attest">
          <span className="tk-a" aria-hidden="true" />
          <span className="tk-b" aria-hidden="true" />
          <div className="attest-head">
            <span>ATTESTATION</span>
            <span>KF·2026·001</span>
          </div>
          <div className="a-row">
            <span className="a-key">NAME</span>
            <span className="a-val">KELVIN-FRANCIS PEPRAH</span>
          </div>
          <div className="a-row">
            <span className="a-key">FIELD</span>
            <span className="a-val">CYBERSECURITY · INTELLIGENT SYSTEMS</span>
          </div>
          <div className="a-row">
            <span className="a-key">LICENSE</span>
            <span className="a-val">
              GHANA CSA — CYBERSECURITY PROFESSIONAL · INDIVIDUAL
              <span className="dot" aria-hidden="true" />
              ACTIVE
            </span>
          </div>
          <div className="a-row">
            <span className="a-key">COMPANY</span>
            <span className="a-val">FOUNDER &amp; CEO, AUNATRON SYSTEMS — IN DEVELOPMENT</span>
          </div>
          <div className="a-row">
            <span className="a-key">ORIGIN</span>
            <span className="a-val">BUILT IN AFRICA</span>
          </div>
          <div className="a-row">
            <span className="a-key">STANCE</span>
            <span className="a-val">DEFENSIVE · LAWFUL · ON THE RECORD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
