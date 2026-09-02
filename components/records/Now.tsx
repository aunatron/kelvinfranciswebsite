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

/** R-04 — the current season, followed by every season before it. */
export default function Now({ entries }: { entries: NowDoc[] }) {
  const [current, ...past] = entries;
  return (
    <Section id="r04" num="04" name="Now" heading={<>This season.</>}>
      <div className="now">
        <div className="now-date">{formatDate(current.date)}</div>
        <MDXRemote source={current.body} />
      </div>
      <Verify sources={[current.source]} />

      {past.length > 0 ? (
        <>
          <div className="sub-label">PAST SEASONS</div>
          {past.map((entry) => (
            <div className="now now-past" key={entry.source.path}>
              <div className="now-date">{formatDate(entry.date)}</div>
              <MDXRemote source={entry.body} />
            </div>
          ))}
        </>
      ) : null}
    </Section>
  );
}
