import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import RecordPager from "@/components/site/RecordPager";
import { PagerKeysScript } from "@/components/site/scripts";
import type { RecordRoute } from "@/lib/records";

type ShellProps = {
  current?: RecordRoute["href"];
  pageMode?: "francis" | "hunter";
  children: React.ReactNode;
};

/** Common page chrome: skip link, nav, footer — and the pager on record pages. */
export default function Shell({ current, pageMode, children }: ShellProps) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav current={current} />
      <main id="main" data-page-mode={pageMode}>
        {children}
        {current && current !== "/" ? <RecordPager current={current} /> : null}
      </main>
      <Footer />
      {current && current !== "/" ? <PagerKeysScript /> : null}
    </>
  );
}
