import { MDXRemote } from "next-mdx-remote/rsc";
import Section from "@/components/site/Section";
import Verify from "@/components/ui/Verify";
import type { SystemDocFull } from "@/lib/content";

export default function TheSystem({ doc }: { doc: SystemDocFull }) {
  return (
    <Section
      id="r07"
      num="07"
      name="The System"
      heading={
        <>
          Human judgment. <em>Machine memory.</em>{" "}
          <span className="sys-v">The System — v{doc.version}</span>
        </>
      }
      intro={
        <>
          Nobody publishes their operating architecture.{" "}
          <strong>That&rsquo;s exactly why this is here.</strong> It ships
          versioned, like software — because it changes, and the changes
          should be on the record too.
        </>
      }
    >
      <div className="sys-grid">
        <div className="sys-body">
          <span className="draft-tag">Draft — Kelvin rewrites before launch</span>
          <MDXRemote source={doc.body} />
          <Verify sources={[doc.source]} />
        </div>
        <div className="changelog">
          <h3>Changelog</h3>
          <ul>
            {doc.changelog.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
