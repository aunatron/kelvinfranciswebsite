import type { Metadata } from "next";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mode="francis">
      <body>
        {/* Preload exactly two faces: the headline serif and the record mono.
            The rest load without preload. React hoists these to <head>. */}
        <link
          rel="preload"
          href="/fonts/spectral-latin-300-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/ibm-plex-mono-latin-400-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
        <script
          id="kf-mode"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=document.querySelector(".mode-toggle");var html=document.documentElement;function apply(m){html.setAttribute("data-mode",m);if(!t)return;var all=t.querySelectorAll("button");for(var i=0;i<all.length;i++){all[i].classList.toggle("on",all[i].dataset.mode===m);}}var pm=document.querySelector("[data-page-mode]");var m=pm&&pm.getAttribute("data-page-mode");if(m==="hunter"){html.setAttribute("data-leading","hunter");}if(m==="hunter"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){requestAnimationFrame(function(){requestAnimationFrame(function(){html.classList.add("rupture");apply("hunter");var s=document.querySelector(".nav-sigil");if(s){s.classList.add("sigil-draw");}setTimeout(function(){html.classList.remove("rupture");},900);});});}else if(m){apply(m);}if(t){t.addEventListener("click",function(e){var b=e.target.closest("button");if(b&&b.dataset.mode){apply(b.dataset.mode);}});}})();`,
          }}
        />
      </body>
    </html>
  );
}
