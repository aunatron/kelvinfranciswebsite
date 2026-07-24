import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import Doctrine from "@/components/records/Doctrine";
import { FilterScript } from "@/components/site/scripts";
import { getEssays } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 03 — Doctrine · ${site.name}`,
  description: "Numbered essays: dated, graded, resolved in public.",
};

export default function DoctrinePage() {
  return (
    <>
      <Shell current="/doctrine/">
        <Doctrine essays={getEssays()} />
      </Shell>
      <FilterScript />
    </>
  );
}
