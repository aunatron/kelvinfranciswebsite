import Sigil from "@/components/ui/Sigil";
import ModeToggle from "@/components/ui/ModeToggle";
import { RECORDS } from "@/lib/records";
import { getRecordExtents } from "@/lib/content";
import { site } from "@/lib/site";

/**
 * Site navigation. Desktop shows every record inline; below the laptop breakpoint the
 * records live in a <details> menu, so the full index is reachable on a
 * phone with JavaScript off. The kf-mode script only adds polish
 * (Escape and outside-click close it).
 */
export default function Nav({ current }: { current?: string }) {
  const extents = getRecordExtents();
  return (
    <nav className="nav" aria-label="Records">
      <div className="nav-in">
        <a className="nav-home" href="/" aria-label="Kelvin-Francis Peprah, home">
          <Sigil cut="small" className="nav-sigil" />
          <span className="nav-name" aria-hidden="true">
            {site.name}
          </span>
        </a>

        <div className="nav-links">
          {RECORDS.slice(1).map((r) => (
            <a
              key={r.href}
              href={r.href}
              className={current === r.href ? "on" : undefined}
              aria-current={current === r.href ? "page" : undefined}
            >
              {r.name}
            </a>
          ))}
        </div>

        <div className="nav-end">
          <ModeToggle />
          <details className="menu" data-menu>
            <summary className="menu-btn" aria-label="Open the index of records">
              <span className="menu-icon" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="menu-word" aria-hidden="true">
                Index
              </span>
            </summary>
            <div className="menu-panel">
              <div className="menu-h">THE DOSSIER · 8 RECORDS</div>
              <ol className="menu-list">
                {RECORDS.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      className={current === r.href ? "on" : undefined}
                      aria-current={current === r.href ? "page" : undefined}
                    >
                      <span className="menu-num">§ {r.num}</span>
                      <span className="menu-name">{r.name}</span>
                      <span className="menu-extent">{extents[r.href]}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <a className="menu-contact" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
