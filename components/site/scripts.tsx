import { site } from "@/lib/site";

/**
 * Per-page inline native scripts. The framework runtime is stripped at
 * postbuild, so these ids are the allowlist — include each script only on
 * pages that need it.
 */

export function VerifyScript() {
  return (
    <script
      id="kf-verify"
      dangerouslySetInnerHTML={{
        __html: `(function(){var RAW="https://raw.githubusercontent.com/${site.githubOwner}/${site.repo}/";var TREE="https://github.com/${site.githubOwner}/${site.repo}/tree/";function hex(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++){s+=a[i].toString(16).padStart(2,"0");}return s;}document.querySelectorAll("a.verify[data-verify]").forEach(function(el){el.addEventListener("click",async function(e){if(el.dataset.done==="fail")return;e.preventDefault();if(el.dataset.busy)return;var commit=el.dataset.commit;var files=JSON.parse(el.dataset.verify);var state=el.querySelector("[data-verify-state]");var key="kfv:"+commit+":"+files.map(function(f){return f.p;}).join("|");var short=commit.slice(0,7);function ok(){el.classList.add("ok");el.classList.remove("fail");state.textContent=" \\u2713 VERIFIED "+short;}function fail(){el.classList.add("fail");el.classList.remove("ok");state.textContent=" UNVERIFIED \\u2014 check manually";el.dataset.done="fail";el.href=TREE+commit;}var cached=null;try{cached=sessionStorage.getItem(key);}catch(_){ }if(cached==="ok"){ok();return;}if(!window.crypto||!crypto.subtle||commit==="UNCOMMITTED"||files.length===0){fail();return;}el.dataset.busy="1";state.textContent=" CHECKING\\u2026";try{for(var i=0;i<files.length;i++){var r=await fetch(RAW+commit+"/"+files[i].p,{cache:"no-store"});if(!r.ok)throw 0;var d=await crypto.subtle.digest("SHA-256",await r.arrayBuffer());if(hex(d)!==files[i].h)throw 0;}try{sessionStorage.setItem(key,"ok");}catch(_){ }ok();}catch(_){fail();}delete el.dataset.busy;});});})();`,
      }}
    />
  );
}

export function FilterScript() {
  return (
    <script
      id="kf-filter"
      dangerouslySetInnerHTML={{
        __html: `(function(){var chips=document.querySelectorAll(".chip[data-filter]");if(!chips.length)return;chips.forEach(function(chip){chip.addEventListener("click",function(){var f=chip.dataset.filter;chips.forEach(function(c){c.classList.toggle("on",c===chip);});document.querySelectorAll(".essay").forEach(function(row){row.hidden=!(f==="all"||row.dataset.modeTag===f||row.dataset.grade===f);});});});})();`,
      }}
    />
  );
}
