import { MDXRemote } from "next-mdx-remote/rsc";
import Section from "@/components/site/Section";
import Verify from "@/components/ui/Verify";
import type { NowDoc } from "@/lib/content";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function Now({ entry }: { entry: NowDoc }) {
  return (
    <Section
      id="r04"
      num="04"
      name="Now"
      heading={
        <>
          What I&rsquo;m <em>building this season.</em>
        </>
      }
    >
      <div className="now">
        <span className="draft-tag">Draft — Kelvin rewrites before launch</span>
        <div className="now-date">{formatDate(entry.date)}</div>
        <MDXRemote source={entry.body} />
      </div>
      <p className="now-archive-link">
        <a className="mono-link" href="/now/">
          → Past seasons
        </a>
      </p>
      <Verify sources={[entry.source]} />
    </Section>
  );
}
