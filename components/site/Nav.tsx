import Sigil from "@/components/ui/Sigil";
import ModeToggle from "@/components/ui/ModeToggle";
import { RECORDS } from "@/lib/records";

export default function Nav({ current }: { current?: string }) {
  return (
    <nav className="nav" aria-label="Records">
      <div className="nav-in">
        <a href="/" aria-label="R-01 — Attestation">
          <Sigil cut="small" className="nav-sigil" label="KF" />
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
        <ModeToggle />
      </div>
    </nav>
  );
}
