import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import Now from "@/components/records/Now";
import { VerifyScript } from "@/components/site/scripts";
import { getNowEntries } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 04 — Now · ${site.name}`,
  description: "The current season, dated, in the present tense.",
};

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
