import type { Metadata } from "next";
import Shell from "@/components/site/Shell";
import Credentials from "@/components/records/Credentials";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `§ 05 — Credentials · ${site.name}`,
  description: "An individual license from Ghana's Cyber Security Authority.",
};

export default function CredentialsPage() {
  return (
    <Shell current="/credentials/">
      <Credentials />
    </Shell>
  );
}
