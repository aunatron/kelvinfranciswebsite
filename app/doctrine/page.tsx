import Shell from "@/components/site/Shell";
import Doctrine from "@/components/records/Doctrine";
import { FilterScript } from "@/components/site/scripts";
import { getEssays } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 03 · Doctrine · ${site.name}`,
  "Numbered essays: dated, graded, resolved in public.",
  "/doctrine/"
);

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
