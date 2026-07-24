import Section from "@/components/site/Section";
import Sigil from "@/components/ui/Sigil";

export default function Credentials() {
  return (
    <Section
      id="r05"
      num="05"
      name="Credentials"
      heading={
        <>
          Licensed. Lawful. <em>Defensive.</em>
        </>
      }
    >
      <div className="cred-grid">
        <div className="cred-card">
          <Sigil cut="small" className="sigil-wm" />
          <div className="cred-auth">Ghana Cyber Security Authority</div>
          <div className="cred-title">CSA-licensed cybersecurity professional</div>
          <p className="cred-body">
            An individual license from Ghana&rsquo;s Cyber Security Authority.
          </p>
          <div className="cred-status">
            <span className="dot" aria-hidden="true" />
            Active · Individual
          </div>
        </div>
        <div>
          <div className="fine fine-flush">
            The license is individual, not corporate.
            <br />
            Company accreditations are claimed only when they exist.
          </div>
          <p className="cred-aside">
            Security work runs on trust, and trust runs on verification. So
            the wording here is exact —{" "}
            <strong>and it stays exact even when a looser word would sell better.</strong>
          </p>
        </div>
      </div>
    </Section>
  );
}
