import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import Signal from "@/components/records/Signal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 06 — Signal · ${site.name}`,
  description: "Contact, on the record.",
};

export default function SignalPage() {
  return (
    <Shell current="/signal/">
      <Signal />
    </Shell>
  );
}
