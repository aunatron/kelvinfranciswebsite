import Sigil from "@/components/ui/Sigil";
import { site, repoUrl } from "@/lib/site";
import type { Provenance, Sourced } from "@/lib/content";
import type { Attestation as AttestationRecord } from "@/lib/validate";

type AttestData = {
  digest: string;
  commit: string;
  files: Provenance[];
};

/**
 * R-01 · ATTESTATION — the cover sheet, and Moment A: the Live Attestation.
 * The digest below is real — sha256 over every content file's hash. Without
 * JS the seal shows the build-time attestation; with JS the browser
 * re-fetches the sources pinned to the commit, re-hashes them, recomputes
 * the digest, and only then stamps VERIFIED. Never a false green.
 */
export default function Attestation({
  attest,
  record,
}: {
  attest: AttestData;
  record: Sourced<AttestationRecord>;
}) {
  const short = attest.commit.slice(0, 7);
  const payload = JSON.stringify(attest.files.map((f) => ({ h: f.hash, p: f.path })));

  return (
    <header id="r01" className="hero-shell">
      <div className="wrap hero">
        <div className="hero-fig">
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

        <div
          className="attest"
          data-attest-panel
          data-commit={attest.commit}
          data-digest={attest.digest}
          data-files={payload}
        >
          <span className="tk-a" aria-hidden="true" />
          <span className="tk-b" aria-hidden="true" />
          <div className="attest-head">
            <span>ATTESTATION</span>
            <span>{record.id}</span>
          </div>
          <div className="a-row">
            <span className="a-key">NAME</span>
            <span className="a-val">{record.name}</span>
          </div>
          <div className="a-row">
            <span className="a-key">FIELD</span>
            <span className="a-val">{record.field}</span>
          </div>
          <div className="a-row">
            <span className="a-key">CREDENTIAL</span>
            <span className="a-val">
              {record.credential}
              <span className="dot subject" aria-hidden="true" />
              {record.credential_status.replace("-", " ").toUpperCase()}
            </span>
          </div>
          <div className="a-row">
            <span className="a-key">COMPANY</span>
            <span className="a-val">{record.company}</span>
          </div>
          <div className="a-row">
            <span className="a-key">ORIGIN</span>
            <span className="a-val">{record.origin}</span>
          </div>
          <div className="a-row">
            <span className="a-key">STANCE</span>
            <span className="a-val">{record.stance}</span>
          </div>
          <div className="a-row a-digest-row">
            <span className="a-key">DIGEST</span>
            <span className="a-val digest">
              <span className="sr-only">SHA-256 {attest.digest}</span>
              <span aria-hidden="true">
                {attest.digest.split("").map((c, i) => (
                  <span key={i} className="d" style={{ ["--i" as string]: i }}>
                    {c}
                  </span>
                ))}
              </span>
            </span>
          </div>
          <div className="attest-foot">
            <a className="attest-seal" data-attest-seal href={`${repoUrl}/tree/${attest.commit}`}>
              <span data-seal-state aria-live="polite">
                VERIFY SOURCE RECORDS · {short}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Where the file starts. A filing instruction, not an invitation. */}
      <a className="begin" href="/record/">
        BEGIN <span aria-hidden="true">→</span> § 02 · THE RECORD
      </a>
    </header>
  );
}
