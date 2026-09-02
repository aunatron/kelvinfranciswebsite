import Section from "@/components/site/Section";
import { site } from "@/lib/site";

export default function Signal() {
  return (
    <Section id="r06" num="06" name="Signal" heading={<>Contact.</>}>
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
        <div className="dormant-h">Press · dormant</div>
        <p>
          Activates on the first real mention. Until then this block stays
          empty rather than padded. The same rule applies to everything else here.
        </p>
      </div>
    </Section>
  );
}
