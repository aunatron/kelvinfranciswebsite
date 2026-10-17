import Sigil from "@/components/ui/Sigil";
import Photo from "@/components/ui/Photo";
import { site, repoUrl } from "@/lib/site";
import type { Provenance, Sourced } from "@/lib/content";
import type { Attestation as AttestationRecord, Portrait } from "@/lib/validate";

type AttestData = {
  digest: string;
  commit: string;
  files: Provenance[];
};

/**
 * R-01 · ATTESTATION: the cover sheet, and Moment A, the Live Attestation.
 * The digest is real: sha256 over every content file's hash. Without JS
 * the seal links to the commit; with JS the browser re-fetches the sources
 * pinned to the commit, re-hashes them, recomputes the digest, and only
 * then stamps VERIFIED. Never a false green.
 *
 * The portrait is optional. With none filed the cover sheet simply has no
 * photograph; it never shows a stand-in.
 */
export default function Attestation({
  attest,
  record,
  portrait,
}: {
  attest: AttestData;
  record: Sourced<AttestationRecord>;
  portrait: Sourced<Portrait> | null;
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

          <div className="hero-actions">
            <a className="btn btn-primary begin" href="/record/">
              Begin with the record <span aria-hidden="true">→</span>
            </a>
            <a className="btn" href="/signal/">
              Contact
            </a>
          </div>

        </div>

        <div className={`hero-side${portrait ? " has-portrait" : ""}`}>
          {portrait ? (
            <figure className="portrait">
              <div className="portrait-frame">
                <Photo
                  photo={portrait}
                  eager
                  sizes="(min-width: 64em) 22rem, (min-width: 48em) 40vw, 80vw"
                />
              </div>
              <figcaption className="portrait-cap">
                <span>PORTRAIT</span>
                <span>{portrait.caption ?? portrait.date}</span>
              </figcaption>
            </figure>
          ) : null}

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
              {/* Plain text in the HTML; kf-attest splits it into per-digit
                  spans only when the reader asks for verification, so the
                  settle animation costs nothing on the first load. */}
              <span className="a-val digest">
                <span className="sr-only">SHA-256 {attest.digest}</span>
                <span aria-hidden="true" data-digest-text>
                  {attest.digest}
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
      </div>
    </header>
  );
}
