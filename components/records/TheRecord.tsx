import Section from "@/components/site/Section";
import Verify, { VerifyBoundary } from "@/components/ui/Verify";
import type { Sourced } from "@/lib/content";
import type { RecordEntry } from "@/lib/validate";

function LedgerRow({ entry }: { entry: Sourced<RecordEntry> }) {
  return (
    <div className="led-row">
      <span className="led-year">{entry.year}</span>
      <span>
        <span className="led-name">{entry.name}</span>
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
      {entries.map((e) => (
        <LedgerRow key={e.source.path} entry={e} />
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
    <Section
      id="r02"
      num="02"
      name="The Record"
      heading={
        <>
          Eight years, <em>owned.</em>
        </>
      }
      intro={
        <>
          Every build, dated and status-tagged.{" "}
          <strong>The graveyard is here too</strong>
          {" — "}parked work isn&rsquo;t hidden, it&rsquo;s the tuition
          receipt.
        </>
      }
    >
      <Ledger entries={builds} />
      <div className="fine">
        Parked is not failed. Every line above is a capability
        <br />
        this operator still runs on.
      </div>

      <div className="sub-label">SERVICE</div>
      <Ledger
        entries={service}
        emptyLine="Service work, recorded the same way as everything else — dated, plain, no adjectives. Entries appear as they're completed."
      />

      <div className="dormant">
        <div className="dormant-h">Collaborations — dormant</div>
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
