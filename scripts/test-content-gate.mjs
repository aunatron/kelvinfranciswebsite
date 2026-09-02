import { spawnSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const fixture = join(process.cwd(), "content", "essays", "__invalid-gate-test.mdx");
const invalid = `---
record: INVALID
title: "Deliberately malformed gate fixture"
date: "not-a-date"
mode: unknown
grade: fact
horizon: now
status: published
tags: [not-in-taxonomy]
summary: "This file exists only while the content-gate test is running."
---

The build must reject this file.
`;

try {
  if (existsSync(fixture)) {
    throw new Error(`Refusing to overwrite existing fixture: ${fixture}`);
  }
  writeFileSync(fixture, invalid, "utf8");
  const result = spawnSync(process.execPath, ["--import", "tsx", "scripts/validate-content.ts"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  if (result.status === 0 || !output.includes("CONTENT VALIDATION FAILED")) {
    throw new Error(`Content gate did not reject the malformed fixture.\n${output}`);
  }
  if (!output.includes("__invalid-gate-test.mdx")) {
    throw new Error(`Content gate failed without identifying the fixture.\n${output}`);
  }
  console.log("test-content-gate: OK · malformed content was rejected with its source path");
} finally {
  if (existsSync(fixture)) rmSync(fixture);
}
