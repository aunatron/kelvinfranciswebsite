import Shell from "@/components/site/Shell";
import Signal from "@/components/records/Signal";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 06 · Signal · ${site.name}`,
  "Contact, on the record.",
  "/signal/"
);

export default function SignalPage() {
  return (
    <Shell current="/signal/">
      <Signal />
    </Shell>
  );
}
