import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import TheRecord from "@/components/records/TheRecord";
import { VerifyScript } from "@/components/site/scripts";
import { getRecordEntries, getServiceEntries } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 02 — The Record · ${site.name}`,
  description: "Builds and service, dated and status-tagged.",
};

export default function RecordPage() {
  return (
    <>
      <Shell current="/record/">
        <TheRecord builds={getRecordEntries()} service={getServiceEntries()} />
      </Shell>
      <VerifyScript />
    </>
  );
}
