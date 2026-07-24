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
    { path: "../node_modules/@fontsource/spectral/files/spectral-latin-500-normal.woff2", weight: "500", style: "normal" },
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
            __html: `(function(){var t=document.querySelector(".mode-toggle");function apply(m){document.documentElement.setAttribute("data-mode",m);if(!t)return;var all=t.querySelectorAll("button");for(var i=0;i<all.length;i++){all[i].classList.toggle("on",all[i].dataset.mode===m);}}var pm=document.querySelector("[data-page-mode]");if(pm){apply(pm.getAttribute("data-page-mode"));}if(t){t.addEventListener("click",function(e){var b=e.target.closest("button");if(b&&b.dataset.mode){apply(b.dataset.mode);}});}})();`,
          }}
        />
        <script
          id="kf-filter"
          dangerouslySetInnerHTML={{
            __html: `(function(){var chips=document.querySelectorAll(".chip[data-filter]");if(!chips.length)return;chips.forEach(function(chip){chip.addEventListener("click",function(){var f=chip.dataset.filter;chips.forEach(function(c){c.classList.toggle("on",c===chip);});document.querySelectorAll(".essay").forEach(function(row){row.hidden=!(f==="all"||row.dataset.modeTag===f||row.dataset.grade===f);});});});})();`,
          }}
        />
        <script
          id="kf-verify"
          dangerouslySetInnerHTML={{
            __html: `(function(){var RAW="https://raw.githubusercontent.com/${site.githubOwner}/${site.repo}/";var TREE="https://github.com/${site.githubOwner}/${site.repo}/tree/";function hex(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++){s+=a[i].toString(16).padStart(2,"0");}return s;}document.querySelectorAll("a.verify[data-verify]").forEach(function(el){el.addEventListener("click",async function(e){if(el.dataset.done==="fail")return;e.preventDefault();if(el.dataset.busy)return;var commit=el.dataset.commit;var files=JSON.parse(el.dataset.verify);var state=el.querySelector("[data-verify-state]");var key="kfv:"+commit+":"+files.map(function(f){return f.p;}).join("|");var short=commit.slice(0,7);function ok(){el.classList.add("ok");el.classList.remove("fail");state.textContent=" \\u2713 VERIFIED "+short;}function fail(){el.classList.add("fail");el.classList.remove("ok");state.textContent=" UNVERIFIED \\u2014 check manually";el.dataset.done="fail";el.href=TREE+commit;}var cached=null;try{cached=sessionStorage.getItem(key);}catch(_){ }if(cached==="ok"){ok();return;}if(!window.crypto||!crypto.subtle||commit==="UNCOMMITTED"||files.length===0){fail();return;}el.dataset.busy="1";state.textContent=" CHECKING\\u2026";try{for(var i=0;i<files.length;i++){var r=await fetch(RAW+commit+"/"+files[i].p,{cache:"no-store"});if(!r.ok)throw 0;var d=await crypto.subtle.digest("SHA-256",await r.arrayBuffer());if(hex(d)!==files[i].h)throw 0;}try{sessionStorage.setItem(key,"ok");}catch(_){ }ok();}catch(_){fail();}delete el.dataset.busy;});});})();`,
          }}
        />
      </body>
    </html>
  );
}
