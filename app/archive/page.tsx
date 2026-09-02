import Shell from "@/components/site/Shell";
import Archive from "@/components/records/Archive";
import { getArchivePlates } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 08 · The Archive · ${site.name}`,
  "Work documented as numbered, dated plates.",
  "/archive/"
);

export default function ArchivePage() {
  return (
    <Shell current="/archive/">
      <Archive plates={getArchivePlates()} />
    </Shell>
  );
}
