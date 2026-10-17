import "@/styles/records.css";
import PageHead from "@/components/site/PageHead";
import { RECORDS } from "@/lib/records";

type SectionProps = {
  id: string;
  num: string;
  name: string;
  heading: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
};

/** A record page: breadcrumb header, then content. */
export default function Section({ id, num, heading, aside, children }: SectionProps) {
  const r = RECORDS.find((x) => x.num === num);
  return (
    <section id={id} className="record-page" aria-labelledby={`h-r${num}`}>
      <div className="wrap">
        <PageHead href={r?.href ?? "/"} heading={heading} aside={aside} />
        {children}
      </div>
    </section>
  );
}
