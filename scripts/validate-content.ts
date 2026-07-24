/**
 * Content gate — runs as `prebuild`, so a malformed record can never build.
 * Loud on failure, terse on success.
 */
import { getAllContent } from "../lib/content";

try {
  const all = getAllContent();
  const counts = [
    `record ${all.record.length}`,
    `service ${all.service.length}`,
    `essays ${all.essays.length}`,
    `now ${all.now.length}`,
    `system 1 (v${all.system.version})`,
    `archive ${all.archive.length}`,
  ].join(" · ");
  console.log(`validate: OK — ${counts} — commit ${all.commit.slice(0, 7)}`);
} catch (err) {
  console.error("\n════ CONTENT VALIDATION FAILED — BUILD REJECTED ════\n");
  console.error(err instanceof Error ? err.message : err);
  console.error("\n════════════════════════════════════════════════════\n");
  process.exit(1);
}
