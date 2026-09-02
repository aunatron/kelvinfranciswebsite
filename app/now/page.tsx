import Shell from "@/components/site/Shell";
import Now from "@/components/records/Now";
import { VerifyScript } from "@/components/site/scripts";
import { getNowEntries } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 04 · Now · ${site.name}`,
  "The current season, dated, in the present tense.",
  "/now/"
);

export default function NowPage() {
  return (
    <>
      <Shell current="/now/">
        <Now entries={getNowEntries()} />
      </Shell>
      <VerifyScript />
    </>
  );
}
