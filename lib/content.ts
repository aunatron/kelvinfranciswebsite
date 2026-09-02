import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  ArchivePlateSchema,
  AttestationSchema,
  CredentialSchema,
  EssaySchema,
  NowEntrySchema,
  RecordEntrySchema,
  SystemDocSchema,
  type ArchivePlate,
  type Attestation,
  type Credential,
  type Essay,
  type NowEntry,
  type RecordEntry,
  type SystemDoc,
} from "./validate";

/**
 * Content pipeline: read content/** → gray-matter → zod → THROW on any
 * failure. A malformed record must fail the build, never render wrong.
 *
 * Every item carries { hash, commit, path }: hash = sha256 of the raw source
 * bytes, commit = the commit being built, path = repo-relative source path.
 * The on-page VERIFY control re-fetches the source from GitHub pinned to
 * that commit and re-hashes it in the visitor's browser.
 */

export type Provenance = {
  hash: string;
  commit: string;
  path: string;
};

export type Sourced<T> = T & { source: Provenance };

const CONTENT_DIR = "content";

let cachedCommit: string | undefined;
export function getCommit(): string {
  if (cachedCommit) return cachedCommit;

  try {
    // A local export must never claim reproducibility from HEAD while files
    // that can change the shipped artifact are dirty or untracked. Generated
    // output and local project instructions are deliberately outside this
    // path list, so only artifact-affecting source changes invalidate it.
    const dirty = execSync(
      "git status --porcelain=v1 --untracked-files=normal -- app components content lib public/scenes styles scripts package.json package-lock.json next.config.ts tsconfig.json",
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    if (dirty) {
      cachedCommit = "UNCOMMITTED";
      return cachedCommit;
    }

    cachedCommit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    // Vercel's build container may not expose .git. Its system-provided SHA
    // is safe only as that fallback; no user-configured secret is required.
    cachedCommit = process.env.VERCEL_GIT_COMMIT_SHA || "UNCOMMITTED";
  }
  return cachedCommit;
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function listFiles(dir: string): string[] {
  const abs = join(/* turbopackIgnore: true */ process.cwd(), CONTENT_DIR, dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort()
    .map((f) => join(CONTENT_DIR, dir, f).replaceAll("\\", "/"));
}

function loadFile<S extends z.ZodTypeAny>(
  path: string,
  schema: S
): { data: z.infer<S>; body: string; source: Provenance } {
  const bytes = readFileSync(join(/* turbopackIgnore: true */ process.cwd(), path));
  const { data, content } = matter(bytes.toString("utf8"));
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `CONTENT INVALID — ${path}\n${parsed.error.issues
        .map((i) => `  ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n")}`
    );
  }
  return {
    data: parsed.data,
    body: content.trim(),
    source: { hash: sha256(bytes), commit: getCommit(), path },
  };
}

function loadDir<S extends z.ZodTypeAny>(dir: string, schema: S) {
  return listFiles(dir).map((path) => loadFile(path, schema));
}

/* ── Loaders ─────────────────────────────────────────────── */

export function getRecordEntries(): Sourced<RecordEntry>[] {
  return loadDir("record", RecordEntrySchema)
    .map(({ data, source }) => ({ ...data, source }))
    .sort((a, b) => a.year - b.year);
}

export function getServiceEntries(): Sourced<RecordEntry>[] {
  return loadDir("service", RecordEntrySchema)
    .map(({ data, source }) => ({ ...data, source }))
    .sort((a, b) => a.year - b.year);
}

export function getAttestation(): Sourced<Attestation> {
  const docs = loadDir("attestation", AttestationSchema);
  if (docs.length !== 1) {
    throw new Error("CONTENT INVALID — content/attestation must contain exactly one record");
  }
  return { ...docs[0].data, source: docs[0].source };
}

export function getCredential(): Sourced<Credential> {
  const docs = loadDir("credentials", CredentialSchema);
  if (docs.length !== 1) {
    throw new Error("CONTENT INVALID — content/credentials must contain exactly one record");
  }
  return { ...docs[0].data, source: docs[0].source };
}

export type EssayDoc = Sourced<Essay> & { slug: string; body: string };
export function getEssays(): EssayDoc[] {
  const essays = loadDir("essays", EssaySchema).map(({ data, body, source }) => ({
    ...data,
    body,
    source,
    slug: data.record.toLowerCase(),
  }));
  for (const essay of essays) {
    if (!essay.body) throw new Error(`CONTENT INVALID · ${essay.source.path} has no essay body`);
  }
  const seen = new Set<string>();
  for (const e of essays) {
    if (seen.has(e.slug)) throw new Error(`CONTENT INVALID — duplicate record id ${e.record}`);
    seen.add(e.slug);
  }
  return essays.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type NowDoc = Sourced<NowEntry> & { body: string };
export function getNowEntries(): NowDoc[] {
  const entries = loadDir("now", NowEntrySchema)
    .map(({ data, body, source }) => ({ ...data, body, source }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  if (entries.length === 0) throw new Error("CONTENT INVALID · content/now is empty");
  for (const entry of entries) {
    if (!entry.body) throw new Error(`CONTENT INVALID · ${entry.source.path} has no body`);
  }
  return entries;
}

export type SystemDocFull = Sourced<SystemDoc> & { body: string };
export function getSystemDoc(): SystemDocFull {
  const docs = loadDir("system", SystemDocSchema);
  if (docs.length === 0) throw new Error("CONTENT INVALID — content/system is empty");
  const latest = docs[docs.length - 1];
  if (!latest.body) throw new Error(`CONTENT INVALID · ${latest.source.path} has no body`);
  return { ...latest.data, body: latest.body, source: latest.source };
}

export function getArchivePlates(): Sourced<ArchivePlate>[] {
  return loadDir("archive", ArchivePlateSchema)
    .map(({ data, source }) => ({ ...data, source }))
    .sort((a, b) => a.plate - b.plate);
}

/**
 * The dossier digest — one hash over every content file's hash, in sorted
 * path order. The Live Attestation recomputes this in the visitor's browser
 * from the sources on GitHub; a match seals the whole dossier at once.
 */
export function getDossierAttestation() {
  const all = [
    getAttestation(),
    getCredential(),
    ...getRecordEntries(),
    ...getServiceEntries(),
    ...getEssays(),
    ...getNowEntries(),
    getSystemDoc(),
    ...getArchivePlates(),
  ].map((x) => x.source);
  const sorted = [...all].sort((a, b) => (a.path < b.path ? -1 : 1));
  const digest = sha256(
    Buffer.from(sorted.map((s) => `${s.path}:${s.hash}`).join("\n"), "utf8")
  );
  return { digest, commit: getCommit(), files: sorted };
}

/** Load everything once — used by the validate script and records.json. */
export function getAllContent() {
  return {
    commit: getCommit(),
    attestation: getAttestation(),
    credential: getCredential(),
    record: getRecordEntries(),
    service: getServiceEntries(),
    essays: getEssays(),
    now: getNowEntries(),
    system: getSystemDoc(),
    archive: getArchivePlates(),
  };
}
