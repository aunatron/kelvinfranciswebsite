import Shell from "@/components/site/Shell";
import Credentials from "@/components/records/Credentials";
import { VerifyScript } from "@/components/site/scripts";
import { getCredential } from "@/lib/content";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  `§ 05 · Credentials · ${site.name}`,
  "An individual professional accreditation claim, with the official framework and verification boundary.",
  "/credentials/"
);

export default function CredentialsPage() {
  return (
    <>
      <Shell current="/credentials/">
        <Credentials credential={getCredential()} />
      </Shell>
      <VerifyScript />
    </>
  );
}
