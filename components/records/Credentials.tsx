import Section from "@/components/site/Section";
import Sigil from "@/components/ui/Sigil";
import Verify from "@/components/ui/Verify";
import type { Sourced } from "@/lib/content";
import type { Credential } from "@/lib/validate";

export default function Credentials({ credential }: { credential: Sourced<Credential> }) {
  return (
    <Section
      id="r05"
      num="05"
      name="Credentials"
      heading={<>The credential, stated exactly.</>}
    >
      <div className="cred-grid">
        <div className="cred-card">
          <Sigil cut="small" className="sigil-wm" />
          <div className="cred-auth">{credential.authority}</div>
          <div className="cred-title">{credential.title}</div>
          <p className="cred-body">{credential.body}</p>
          <div className="cred-status subject">
            <span className="dot" aria-hidden="true" />
            {credential.status.replace("-", " ")} · individual
          </div>
        </div>
        <div className="cred-aside">
          <strong>Verification boundary</strong>
          <p>{credential.note}</p>
          <p>
            <a className="mono-link" href={credential.framework_url}>Read the official framework</a>
            <br />
            <a className="mono-link" href={credential.verification_url}>Open the official validator</a>
          </p>
          <Verify sources={[credential.source]} />
        </div>
      </div>
    </Section>
  );
}
