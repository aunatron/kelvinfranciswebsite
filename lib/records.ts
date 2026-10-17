/** The dossier's reading order. One source of truth for nav, rail, index, pager, sitemap, metadata. */
export const RECORDS = [
  {
    num: "01",
    name: "Attestation",
    href: "/",
    contains: "The cover sheet",
    line: "Who this is, stated once and signed.",
  },
  {
    num: "02",
    name: "The Record",
    href: "/record/",
    contains: "Builds · service · collaborations",
    line: "Builds and service, dated and status-tagged.",
  },
  {
    num: "03",
    name: "Doctrine",
    href: "/doctrine/",
    contains: "Essays · grades · scoreboard",
    line: "Numbered essays: dated, graded, resolved in public.",
  },
  {
    num: "04",
    name: "Now",
    href: "/now/",
    contains: "The current season",
    line: "The current season, dated, in the present tense.",
  },
  {
    num: "05",
    name: "Credentials",
    href: "/credentials/",
    contains: "CSA accreditation · individual",
    line: "An individual professional accreditation, stated exactly.",
  },
  {
    num: "06",
    name: "Signal",
    href: "/signal/",
    contains: "Email · LinkedIn",
    line: "Contact, on the record.",
  },
  {
    num: "07",
    name: "The System",
    href: "/system/",
    contains: "Operating architecture · changelog",
    line: "The operating architecture, versioned, with its changelog.",
  },
  {
    num: "08",
    name: "The Archive",
    href: "/archive/",
    contains: "Numbered plates",
    line: "Work documented as numbered, dated plates.",
  },
] as const;

export type RecordRoute = (typeof RECORDS)[number];

export function recordByHref(href: string) {
  return RECORDS.find((r) => r.href === href);
}

const plural = (n: number, one: string, many = `${one}S`) => `${n} ${n === 1 ? one : many}`;

/**
 * What each record actually holds, for the index, the rail and the menu.
 * Counted from content, never asserted. Empty says EMPTY.
 */
export function recordExtents(counts: {
  builds: number;
  service: number;
  essays: number;
  now: number;
  plates: number;
  systemVersion: string;
}): Record<string, string> {
  const record = counts.builds + counts.service;
  return {
    "/": "KF·2026·001",
    "/record/": record === 0 ? "EMPTY" : plural(record, "ENTRY", "ENTRIES"),
    "/doctrine/": counts.essays === 0 ? "EMPTY" : plural(counts.essays, "PAPER"),
    "/now/": counts.now === 0 ? "EMPTY" : plural(counts.now, "SEASON"),
    "/credentials/": "1 ACCREDITATION",
    "/signal/": "OPEN",
    "/system/": `V${counts.systemVersion}`,
    "/archive/": counts.plates === 0 ? "EMPTY" : plural(counts.plates, "PLATE"),
  };
}

export function pager(href: RecordRoute["href"]) {
  const i = RECORDS.findIndex((r) => r.href === href);
  return {
    prev: i > 0 ? RECORDS[i - 1] : undefined,
    next: i >= 0 && i < RECORDS.length - 1 ? RECORDS[i + 1] : undefined,
  };
}
