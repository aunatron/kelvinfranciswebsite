import { z } from "zod";
import { TAGS } from "./taxonomy";

/**
 * Content schemas — Gate 1 stub. Gate 2 wires these into lib/content.ts,
 * which throws on any failure. Malformed record = build fails.
 */

export const EssaySchema = z.object({
  record: z.string().regex(/^[A-Z-]+-\d{3}$/),
  title: z.string(),
  date: z.string(), // ISO
  mode: z.enum(["francis", "hunter"]),
  grade: z.enum(["fact", "high-conviction", "scenario"]),
  horizon: z.enum(["now", "near", "far"]),
  status: z.enum(["draft", "scheduled", "published"]),
  tags: z.array(z.enum(TAGS)),
  summary: z.string().max(200),
  resolution: z
    .enum(["open", "correct", "partial", "wrong", "withdrawn"])
    .default("open"),
  resolved: z.string().optional(),
  resolution_note: z.string().optional(),
});

export const RecordEntrySchema = z.object({
  year: z.number(),
  name: z.string(),
  line: z.string(),
  status: z.enum(["active", "built", "parked", "lesson-kept"]),
});

export const NowEntrySchema = z.object({
  date: z.string(),
});

export const SystemDocSchema = z.object({
  version: z.string(),
  changelog: z.array(z.string()),
});

export type Essay = z.infer<typeof EssaySchema>;
export type RecordEntry = z.infer<typeof RecordEntrySchema>;
export type NowEntry = z.infer<typeof NowEntrySchema>;
export type SystemDoc = z.infer<typeof SystemDocSchema>;
