import { getAllContent, getDossierAttestation } from "@/lib/content";
import { site, repoUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /records.json — the canonical dossier as structured data. Every entry
 * carries its source hash + commit so any client can re-verify it against
 * the public repository without trusting this endpoint.
 */
export function GET() {
  const all = getAllContent();
  const body = {
    dossier: site.title,
    subject: site.name,
    url: site.url,
    repository: repoUrl,
    commit: all.commit,
    dossierDigest: getDossierAttestation().digest,
    verification: {
      method:
        "sha256(raw source bytes) — re-fetch each path from raw.githubusercontent.com pinned to the commit and compare",
      boundary:
        "A matching hash proves the page matches its public source at that commit. It does not prove the content is true.",
    },
    records: {
      "R-01": {
        name: "Attestation",
        url: `${site.url}/`,
        attestation: {
          id: "KF·2026·001",
          name: "KELVIN-FRANCIS PEPRAH",
          field: "CYBERSECURITY · INTELLIGENT SYSTEMS",
          license:
            "GHANA CSA — CYBERSECURITY PROFESSIONAL · INDIVIDUAL · ACTIVE",
          company: "FOUNDER & CEO, AUNATRON SYSTEMS — IN DEVELOPMENT",
          origin: "BUILT IN AFRICA",
          stance: "DEFENSIVE · LAWFUL · ON THE RECORD",
        },
      },
      "R-02": {
        name: "The Record",
        url: `${site.url}/record/`,
        builds: all.record.map(({ source, ...e }) => ({ ...e, source })),
        service: all.service.map(({ source, ...e }) => ({ ...e, source })),
        collaborations: "dormant — named only with written permission",
      },
      "R-03": {
        name: "Doctrine",
        url: `${site.url}/doctrine/`,
        essays: all.essays.map((e) => ({
          record: e.record,
          title: e.title,
          date: e.date,
          mode: e.mode,
          grade: e.grade,
          horizon: e.horizon,
          status: e.status,
          tags: e.tags,
          summary: e.summary,
          resolution: e.resolution,
          url: `${site.url}/doctrine/${e.slug}/`,
          source: e.source,
        })),
        trackRecord: {
          url: `${site.url}/track-record/`,
          note: "No resolved calls yet. First Reckoning: Q4 2026.",
          formula:
            "hitRate = (correct + 0.5·partial) / (correct + partial + wrong); withdrawn excluded from the math, displayed all the same",
        },
      },
      "R-04": {
        name: "Now",
        url: `${site.url}/now/`,
        entries: all.now.map((n) => ({ date: n.date, source: n.source })),
      },
      "R-05": {
        name: "Credentials",
        url: `${site.url}/credentials/`,
        license: {
          authority: "Ghana Cyber Security Authority",
          title: "CSA-licensed cybersecurity professional",
          body: "An individual license from Ghana's Cyber Security Authority.",
          status: "Active · Individual",
          note: "The license is individual, not corporate. Company accreditations are claimed only when they exist.",
        },
      },
      "R-06": {
        name: "Signal",
        url: `${site.url}/signal/`,
        email: site.email,
        linkedin: site.linkedin,
        press: "dormant — activates on the first real mention",
      },
      "R-07": {
        name: "The System",
        url: `${site.url}/system/`,
        version: all.system.version,
        changelog: all.system.changelog,
        source: all.system.source,
      },
      "R-08": {
        name: "The Archive",
        url: `${site.url}/archive/`,
        plates: all.archive.map(({ source, ...p }) => ({ ...p, source })),
      },
    },
  };
  return Response.json(body);
}
