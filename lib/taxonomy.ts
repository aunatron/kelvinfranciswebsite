/** The only tags an essay may carry. An unknown tag is a validation ERROR. */
export const TAGS = [
  "proof",
  "verification",
  "abundance",
  "new-world",
  "agents",
  "machine-economy",
  "quantum",
  "longevity",
  "sovereignty",
  "africa",
  "security",
  "governance",
  "trust",
  "the-future",
] as const;

export type Tag = (typeof TAGS)[number];
