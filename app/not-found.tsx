import Sigil from "@/components/ui/Sigil";

export default function NotFound() {
  return (
    <main className="nf">
      <Sigil cut="master" wings={false} className="nf-sigil" />
      <p className="nf-code">RECORD NOT FOUND</p>
      <p className="nf-line">Nothing is filed at this address.</p>
      <a className="mono-link" href="/">
        ← Back to the dossier
      </a>
    </main>
  );
}
