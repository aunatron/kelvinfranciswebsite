import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/tokens.css";
import "./globals.css";
import { site } from "@/lib/site";

/* Self-hosted OFL fonts from the @fontsource packages — preloaded,
   with size-adjusted fallbacks so the swap never shifts layout. */
const spectral = localFont({
  src: [
    { path: "../node_modules/@fontsource/spectral/files/spectral-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../node_modules/@fontsource/spectral/files/spectral-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/spectral/files/spectral-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "optional",
});

const plexMono = localFont({
  src: [
    { path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-mono",
  display: "optional",
});

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
    <html
      lang="en"
      data-mode="francis"
      className={`${spectral.variable} ${plexMono.variable}`}
    >
      <body>
        {children}
        <script
          id="kf-mode"
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=document.querySelector(".mode-toggle");if(!t)return;t.addEventListener("click",function(e){var b=e.target.closest("button");if(!b||!b.dataset.mode)return;document.documentElement.setAttribute("data-mode",b.dataset.mode);var all=t.querySelectorAll("button");for(var i=0;i<all.length;i++){all[i].classList.toggle("on",all[i]===b);}});})();`,
          }}
        />
      </body>
    </html>
  );
}
