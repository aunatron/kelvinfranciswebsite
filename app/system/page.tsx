import Shell from "@/components/site/Shell";
import TheSystem from "@/components/records/TheSystem";
import { VerifyScript } from "@/components/site/scripts";
import { getSystemDoc } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 07 · The System · ${site.name}`,
  "The operating architecture, versioned, with its changelog.",
  "/system/"
);

export default function SystemPage() {
  return (
    <>
      <Shell current="/system/">
        <TheSystem doc={getSystemDoc()} />
      </Shell>
      <VerifyScript />
    </>
  );
}
