import Section from "@/components/site/Section";
import { site } from "@/lib/site";

export default function Signal() {
  return (
    <Section
      id="r06"
      num="06"
      name="Signal"
      heading={
        <>
          One inbox. <em>On the record.</em>
        </>
      }
      intro={
        <>
          Engagements and serious inquiries go through email. No comment
          sections, no like counts —{" "}
          <strong>the only score on this site is the track record.</strong>
        </>
      }
    >
      <div className="sig-links">
        <a className="sig-link" href={`mailto:${site.email}`}>
          <span aria-hidden="true">↗</span> Email
        </a>
        <a className="sig-link" href={site.linkedin} rel="me noopener">
          <span aria-hidden="true">↗</span> LinkedIn
        </a>
      </div>
      <p className="split">
        For Aunatron → <b>aunatron.com</b>. &nbsp;For the human → <b>here</b>.
      </p>

      <div className="dormant">
        <div className="dormant-h">Press — dormant</div>
        <p>
          Activates on the first real mention. Until then this block stays
          empty rather than padded — same rule as everything else here.
        </p>
      </div>
    </Section>
  );
}
