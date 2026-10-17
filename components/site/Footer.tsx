import Sigil from "@/components/ui/Sigil";
import { RECORDS } from "@/lib/records";
import { site, repoUrl } from "@/lib/site";

/** The footer is a second map of the dossier: every record, contact, and the machine endpoints. */
export default function Footer() {
  return (
    <footer className="foot-shell">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Sigil cut="master" className="foot-sigil" />
            <div className="foot-origin">
              Built in <em>Africa.</em>
            </div>
            <p className="foot-sub">{site.name}. Cybersecurity and intelligent systems.</p>
          </div>

          <div className="foot-col">
            <div className="foot-h">The dossier</div>
            <ul>
              {RECORDS.map((r) => (
                <li key={r.href}>
                  <a href={r.href}>
                    <span className="foot-num">§ {r.num}</span> {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <div className="foot-h">Contact</div>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>Email</a>
              </li>
              <li>
                <a href={site.linkedin} rel="me noopener">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://aunatron.com">Aunatron Systems</a>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <div className="foot-h">Machine readable</div>
            <ul>
              <li>
                <a href="/records.json">records.json</a>
              </li>
              <li>
                <a href="/feed.json">feed.json</a>
              </li>
              <li>
                <a href="/llms.txt">llms.txt</a>
              </li>
              <li>
                <a href={repoUrl}>Source repository</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-truth">
          THIS PAGE SAYS ONLY WHAT IS TRUE TODAY · © 2026 KELVIN-FRANCIS PEPRAH
        </div>
      </div>
    </footer>
  );
}
