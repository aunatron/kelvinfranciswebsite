import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import Archive from "@/components/records/Archive";
import { getArchivePlates } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 08 — The Archive · ${site.name}`,
  description: "Work documented as numbered, dated plates.",
};

export default function ArchivePage() {
  return (
    <Shell current="/archive/">
      <Archive plates={getArchivePlates()} />
    </Shell>
  );
}
