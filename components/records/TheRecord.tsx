import Section from "@/components/site/Section";
import Verify, { VerifyBoundary } from "@/components/ui/Verify";
import ProofConstellation from "@/components/holo/ProofConstellation";
import type { Sourced } from "@/lib/content";
import type { RecordEntry } from "@/lib/validate";

function LedgerRow({ entry, i }: { entry: Sourced<RecordEntry>; i: number }) {
  return (
    <div className="led-row" data-reveal style={{ "--rv-i": i } as React.CSSProperties}>
      <span className="led-year">{entry.year}</span>
      <span>
        {entry.url ? (
          <a className="led-name led-link" href={entry.url}>{entry.name} ↗</a>
        ) : (
          <span className="led-name">{entry.name}</span>
        )}
        <span className="led-line">{entry.line}</span>
      </span>
      <span className={`tag${entry.status === "active" ? " active" : ""}`}>
        [{entry.status.toUpperCase()}]
      </span>
    </div>
  );
}

/** Ledger shared by builds and service — identical row component, identical treatment. */
function Ledger({ entries, emptyLine }: { entries: Sourced<RecordEntry>[]; emptyLine?: string }) {
  if (entries.length === 0 && emptyLine) {
    return (
      <div className="ledger ledger-empty">
        <p className="fine">{emptyLine}</p>
      </div>
    );
  }
  return (
    <div className="ledger">
      {entries.map((e, i) => (
        <LedgerRow key={e.source.path} entry={e} i={i} />
      ))}
    </div>
  );
}

export default function TheRecord({
  builds,
  service,
}: {
  builds: Sourced<RecordEntry>[];
  service: Sourced<RecordEntry>[];
}) {
  return (
    <Section id="r02" num="02" name="The Record" heading={<>What I&rsquo;ve built.</>}>
      <Ledger entries={builds} />
      <ProofConstellation entries={builds} />
      <div className="fine">
        Parked is not failed. Every line above is a capability
        <br />
        this operator still runs on.
      </div>

      <div className="sub-label">SERVICE</div>
      <Ledger
        entries={service}
        emptyLine="Service work, recorded the same way as everything else: dated, plain, no adjectives. Entries appear as they are completed."
      />

      <div className="dormant">
        <div className="dormant-h">Collaborations · dormant</div>
        <p>
          Named only with written permission. No unearned logos, no borrowed
          credibility. This block activates when a collaboration clears that
          bar, and stays empty until it does.
        </p>
      </div>

      <Verify sources={[...builds, ...service].map((e) => e.source)} />
      <VerifyBoundary />
    </Section>
  );
}
