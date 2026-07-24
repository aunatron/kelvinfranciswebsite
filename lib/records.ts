/** The dossier's reading order. One source of truth for nav, index, pager, sitemap. */
export const RECORDS = [
  { num: "01", name: "Attestation", href: "/", contains: "The cover sheet" },
  { num: "02", name: "The Record", href: "/record/", contains: "Builds · service · collaborations" },
  { num: "03", name: "Doctrine", href: "/doctrine/", contains: "Essays · grades · scoreboard" },
  { num: "04", name: "Now", href: "/now/", contains: "The current season" },
  { num: "05", name: "Credentials", href: "/credentials/", contains: "CSA licence · individual" },
  { num: "06", name: "Signal", href: "/signal/", contains: "Email · LinkedIn" },
  { num: "07", name: "The System", href: "/system/", contains: "Operating architecture · changelog" },
  { num: "08", name: "The Archive", href: "/archive/", contains: "Numbered plates" },
] as const;

export type RecordRoute = (typeof RECORDS)[number];

export function pager(href: RecordRoute["href"]) {
  const i = RECORDS.findIndex((r) => r.href === href);
  return {
    prev: i > 0 ? RECORDS[i - 1] : undefined,
    next: i >= 0 && i < RECORDS.length - 1 ? RECORDS[i + 1] : undefined,
  };
}
