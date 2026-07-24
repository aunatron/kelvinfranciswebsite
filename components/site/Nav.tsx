import Sigil from "@/components/ui/Sigil";
import ModeToggle from "@/components/ui/ModeToggle";

const LINKS = [
  ["/#r01", "Attestation"],
  ["/#r02", "Record"],
  ["/#r03", "Doctrine"],
  ["/#r04", "Now"],
  ["/#r05", "Credentials"],
  ["/#r06", "Signal"],
  ["/#r07", "System"],
  ["/#r08", "Archive"],
] as const;

export default function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-in">
        <a href="/" aria-label="Home">
          <Sigil cut="small" className="nav-sigil" label="KF" />
        </a>
        <div className="nav-links">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
}
