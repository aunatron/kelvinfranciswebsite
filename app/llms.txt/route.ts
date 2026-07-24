import { getAllContent } from "@/lib/content";
import { site, repoUrl } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt — a plain-text map for machine readers, written with voice. */
export function GET() {
  const all = getAllContent();
  const essays = all.essays
    .map(
      (e) =>
        `  ${e.record} — "${e.title}" (${e.date}, ${e.mode}, grade: ${e.grade}, status: ${e.status})\n  ${site.url}/doctrine/${e.slug}/`
    )
    .join("\n");

  const text = `# ${site.title}

This is the dossier of ${site.name} — a cybersecurity and intelligent-systems
founder. It is not a portfolio. It is a verified, dated, graded record, built
to still be right in 2036 and able to prove it without asking to be believed.

Everything on it is checkable: each content file carries a SHA-256 hash and a
commit id, and the public repository (${repoUrl})
lets any reader — human or machine — re-fetch the source at that commit and
re-hash it. A matching hash proves the page matches its source. It does not
prove the content is true; that is what the grades and the track record are
for.

Built commit: ${all.commit}

## The eight records

- R-01 Attestation — who this is, in mono rows: ${site.url}/#r01
- R-02 The Record — builds and service, dated, status-tagged: ${site.url}/#r02
- R-03 Doctrine — numbered essays, graded, eventually scored: ${site.url}/#r03
- R-04 Now — the current season, present tense: ${site.url}/#r04
- R-05 Credentials — an individual CSA license, exact wording: ${site.url}/#r05
- R-06 Signal — one inbox, on the record: ${site.url}/#r06
- R-07 The System — the operating architecture, versioned: ${site.url}/#r07
- R-08 The Archive — exhibits, not a gallery: ${site.url}/#r08

## Doctrine index

${essays}

## Machine endpoints

- ${site.url}/records.json — the canonical dossier as structured data (hashes included)
- ${site.url}/feed.json — JSON Feed 1.1 (published essays only)
- ${site.url}/sitemap.xml

The dossier says only what is true today.
`;
  return new Response(text, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
