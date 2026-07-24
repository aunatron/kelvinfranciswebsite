import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import TheSystem from "@/components/records/TheSystem";
import { VerifyScript } from "@/components/site/scripts";
import { getSystemDoc } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 07 — The System · ${site.name}`,
  description: "The operating architecture, versioned, with its changelog.",
};

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
