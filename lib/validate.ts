import { z } from "zod";
import { TAGS } from "./taxonomy";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Content schemas — Gate 1 stub. Gate 2 wires these into lib/content.ts,
 * which throws on any failure. Malformed record = build fails.
 */

export const EssaySchema = z.object({
  record: z.string().regex(/^[A-Z-]+-\d{3}$/),
  title: z.string(),
  date: z.string().regex(ISO_DATE),
  mode: z.enum(["francis", "hunter"]),
  grade: z.enum(["fact", "high-conviction", "scenario"]),
  horizon: z.enum(["now", "near", "far"]),
  status: z.enum(["draft", "scheduled", "published"]),
  tags: z.array(z.enum(TAGS)),
  summary: z.string().max(200),
  sources: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .default([]),
  resolution: z
    .enum(["open", "correct", "partial", "wrong", "withdrawn"])
    .default("open"),
  resolved: z.string().optional(),
  resolution_note: z.string().optional(),
});

export const RecordEntrySchema = z.object({
  year: z.number().int().min(1900).max(2100),
  name: z.string(),
  line: z.string(),
  status: z.enum(["active", "built", "parked", "lesson-kept"]),
  url: z.string().url().optional(),
});

export const NowEntrySchema = z.object({
  date: z.string().regex(ISO_DATE),
});

export const SystemDocSchema = z.object({
  version: z.string().regex(/^\d+\.\d+$/),
  changelog: z.array(z.string()),
});

/**
 * A plate is an exhibit: numbered, dated, captioned, tied to a record.
 * `src` is the universally decodable file (JPEG); the optional AVIF pair
 * is offered first through <picture> and never required. All derived files
 * are written by scripts/add-image.mjs, which also strips every metadata
 * container before anything reaches public/.
 */
export const ArchivePlateSchema = z.object({
  plate: z.number().int().positive(),
  date: z.string().regex(ISO_DATE),
  caption: z.string().min(1),
  media: z.enum(["image", "clip"]),
  src: z.string().min(1),
  avif: z.string().optional(),
  avif_small: z.string().optional(),
  full: z.string().optional(),
  poster: z.string().optional(),
  /** Record id this plate documents: R-02, DOCTRINE-001, NOW-2026-09-02 … */
  record: z.string().optional(),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

/**
 * The portrait on the cover sheet. Optional: when content/portrait/ is
 * empty the attestation card renders without a photograph rather than with
 * a placeholder. When present it is hashed into the dossier digest like
 * every other record.
 */
export const PortraitSchema = z.object({
  date: z.string().regex(ISO_DATE),
  src: z.string().min(1),
  avif: z.string().optional(),
  avif_small: z.string().optional(),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().optional(),
});

export const AttestationSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(ISO_DATE),
  name: z.string().min(1),
  field: z.string().min(1),
  credential: z.string().min(1),
  credential_status: z.enum(["subject-attested", "verified"]),
  company: z.string().min(1),
  origin: z.string().min(1),
  stance: z.string().min(1),
});

export const CredentialSchema = z.object({
  checked: z.string().regex(ISO_DATE),
  authority: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  status: z.enum(["subject-attested", "verified"]),
  framework_url: z.string().url(),
  verification_url: z.string().url(),
  note: z.string().min(1),
});

export type ArchivePlate = z.infer<typeof ArchivePlateSchema>;
export type Portrait = z.infer<typeof PortraitSchema>;
export type Essay = z.infer<typeof EssaySchema>;
export type RecordEntry = z.infer<typeof RecordEntrySchema>;
export type NowEntry = z.infer<typeof NowEntrySchema>;
export type SystemDoc = z.infer<typeof SystemDocSchema>;
export type Attestation = z.infer<typeof AttestationSchema>;
export type Credential = z.infer<typeof CredentialSchema>;
