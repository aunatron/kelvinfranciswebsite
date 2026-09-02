import Shell from "@/components/site/Shell";
import TheRecord from "@/components/records/TheRecord";
import { HoloArtScript, VerifyScript } from "@/components/site/scripts";
import { getRecordEntries, getServiceEntries } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 02 · The Record · ${site.name}`,
  "Builds and service, dated and status-tagged.",
  "/record/"
);

export default function RecordPage() {
  return (
    <>
      <Shell current="/record/">
        <TheRecord builds={getRecordEntries()} service={getServiceEntries()} />
      </Shell>
      <VerifyScript />
      <HoloArtScript />
    </>
  );
}
