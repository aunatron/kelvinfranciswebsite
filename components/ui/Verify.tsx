import { repoUrl } from "@/lib/site";
import type { Provenance } from "@/lib/content";

/**
 * The VERIFY control. Server-rendered as a plain link to the commit history
 * (fully functional without JS). The kf-verify inline script upgrades it:
 * fetch each source pinned to the embedded commit from raw.githubusercontent,
 * hash with crypto.subtle, compare. Never a false green.
 */
export default function Verify({ sources }: { sources: Provenance[] }) {
  const commit = sources[0]?.commit ?? "UNCOMMITTED";
  const payload = JSON.stringify(sources.map((s) => ({ h: s.hash, p: s.path })));
  return (
    <a
      className="verify"
      href={`${repoUrl}/commits/main`}
      data-commit={commit}
      data-verify={payload}
    >
      <b>VERIFY</b>
      <span data-verify-state> → commit history</span>
    </a>
  );
}

/** The boundary + ownership disclosure — sits beside the FIRST VERIFY control (§8). */
export function VerifyBoundary() {
  return (
    <p className="fine verify-note">
      This checks that the page matches its public source at that commit. It
      does not prove the content is true — that&rsquo;s what the grades and
      the track record are for.
      <br />
      The repository is hosted under the Aunatron Systems account. I am the
      sole operator of both.
    </p>
  );
}
