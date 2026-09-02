import { site } from "@/lib/site";

/**
 * Per-page inline native scripts. The framework runtime is stripped at
 * postbuild, so these ids are the allowlist. Include each script only on
 * pages that need it.
 */

export function VerifyScript() {
  return (
    <script
      id="kf-verify"
      dangerouslySetInnerHTML={{
        __html: `(function(){var RAW="https://raw.githubusercontent.com/${site.githubOwner}/${site.repo}/";var TREE="https://github.com/${site.githubOwner}/${site.repo}/tree/";function hex(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++){s+=a[i].toString(16).padStart(2,"0");}return s;}document.querySelectorAll("a.verify[data-verify]").forEach(function(el){el.addEventListener("click",function(e){if(el.dataset.done)return;e.preventDefault();if(el.dataset.busy)return;var commit=el.dataset.commit;var files=JSON.parse(el.dataset.verify);var state=el.querySelector("[data-verify-state]");var key="kfv:"+commit+":"+files.map(function(f){return f.p;}).join("|");var short=commit.slice(0,7);function done(ok){el.classList.remove(ok?"fail":"ok");el.classList.add(ok?"ok":"fail");state.textContent=ok?" VERIFIED \\u2713 "+short:" UNVERIFIED \\u00b7 check manually";el.dataset.done=ok?"ok":"fail";el.href=TREE+commit;delete el.dataset.busy;}async function check(){try{var cached=null;try{cached=sessionStorage.getItem(key);}catch(_){ }if(cached==="ok")return true;if(!window.crypto||!crypto.subtle||commit==="UNCOMMITTED"||files.length===0)return false;for(var i=0;i<files.length;i++){var r=await fetch(RAW+commit+"/"+files[i].p,{cache:"no-store"});if(!r.ok)throw 0;var d=await crypto.subtle.digest("SHA-256",await r.arrayBuffer());if(hex(d)!==files[i].h)throw 0;}try{sessionStorage.setItem(key,"ok");}catch(_){ }return true;}catch(_){return false;}}el.dataset.busy="1";state.textContent=" CHECKING\\u2026";var timeout=new Promise(function(resolve){setTimeout(function(){resolve(false);},8000);});Promise.race([check(),timeout]).then(done);});});})();`,
      }}
    />
  );
}

/**
 * Moment A, the Live Attestation. Verification is deliberately on demand:
 * no request runs until the reader activates the seal. The browser then
 * re-fetches every pinned content source, recomputes the dossier digest,
 * and stamps the seal only when the result matches.
 */
export function AttestScript() {
  return (
    <script
      id="kf-attest"
      dangerouslySetInnerHTML={{
        __html: `(function(){var panel=document.querySelector("[data-attest-panel]");if(!panel)return;var seal=panel.querySelector("[data-attest-seal]");var state=panel.querySelector("[data-seal-state]");if(!seal||!state)return;var commit=panel.dataset.commit;var digest=panel.dataset.digest;var files=JSON.parse(panel.dataset.files);var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var RAW="https://raw.githubusercontent.com/${site.githubOwner}/${site.repo}/";function hex(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++){s+=a[i].toString(16).padStart(2,"0");}return s;}async function check(){try{var key="kfa:"+commit,cached=null;try{cached=sessionStorage.getItem(key);}catch(_){ }if(cached==="ok")return true;if(!window.crypto||!crypto.subtle||commit==="UNCOMMITTED"||!files.length)return false;var pairs=await Promise.all(files.map(async function(f){var r=await fetch(RAW+commit+"/"+f.p,{cache:"no-store"});if(!r.ok)throw 0;var h=hex(await crypto.subtle.digest("SHA-256",await r.arrayBuffer()));if(h!==f.h)throw 0;return f.p+":"+h;}));pairs.sort();var d=hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pairs.join("\\n"))));if(d!==digest)return false;try{sessionStorage.setItem(key,"ok");}catch(_){ }return true;}catch(_){return false;}}seal.addEventListener("click",function(e){if(seal.dataset.done)return;e.preventDefault();if(seal.dataset.busy)return;seal.dataset.busy="1";panel.classList.add("attest-live");panel.classList.remove("sealed");state.textContent="CHECKING\\u2026";var timeout=new Promise(function(resolve){setTimeout(function(){resolve(false);},8000);});var wait=new Promise(function(resolve){setTimeout(resolve,reduce?0:900);});Promise.all([Promise.race([check(),timeout]),wait]).then(function(res){var ok=res[0];state.textContent=ok?"VERIFIED \\u2713 "+commit.slice(0,7):"UNVERIFIED \\u00b7 CHECK MANUALLY";seal.classList.remove(ok?"fail":"ok");seal.classList.add(ok?"ok":"fail");seal.dataset.done=ok?"ok":"fail";delete seal.dataset.busy;panel.classList.add("sealed");});});})();`,
      }}
    />
  );
}

/**
 * The single reveal runtime. It is the only code that applies the hidden
 * state, so no-JS, crawlers, and reduced-motion users see finished content.
 */
export function RevealScript() {
  return (
    <script
      id="kf-motion"
      dangerouslySetInnerHTML={{
        __html: `(function(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(!window.IntersectionObserver)return;var els=document.querySelectorAll("[data-reveal]");if(!els.length)return;var vh=window.innerHeight,pend=[];for(var i=0;i<els.length;i++){var el=els[i];if(el.getBoundingClientRect().top<vh*0.92)continue;el.classList.add("is-armed");pend.push(el);}if(!pend.length)return;var io=new IntersectionObserver(function(en){for(var j=0;j<en.length;j++){if(!en[j].isIntersecting)continue;en[j].target.classList.add("is-in");io.unobserve(en[j].target);}},{rootMargin:"0% 0% -12% 0%"});for(var k=0;k<pend.length;k++){io.observe(pend[k]);}})();`,
      }}
    />
  );
}

/**
 * HoloArt enhancement. The raster never moves. This adds one viewport-gated
 * scan and durable tap-toggle state; hover and keyboard focus stay in CSS.
 */
export function HoloArtScript() {
  return (
    <script
      id="kf-holoart"
      dangerouslySetInnerHTML={{
        __html: `(function(){var figs=document.querySelectorAll("[data-holo-art]");if(!figs.length)return;figs.forEach(function(fig){var buttons=fig.querySelectorAll(".ha-hot");function close(){buttons.forEach(function(b){b.setAttribute("aria-pressed","false");});}fig.addEventListener("click",function(e){var t=e.target;var b=t&&t.closest?t.closest(".ha-hot"):null;if(!b||!fig.contains(b))return;var open=b.getAttribute("aria-pressed")==="true";close();b.setAttribute("aria-pressed",open?"false":"true");});fig.addEventListener("keydown",function(e){if(e.key!=="Escape")return;close();var a=document.activeElement;if(a&&fig.contains(a)&&a.blur)a.blur();});document.addEventListener("click",function(e){if(!fig.contains(e.target))close();});if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(window.IntersectionObserver){var io=new IntersectionObserver(function(en){for(var i=0;i<en.length;i++){if(en[i].isIntersecting){fig.classList.add("ha-armed");io.disconnect();break;}}},{rootMargin:"0% 0% -15% 0%"});io.observe(fig);}else{fig.classList.add("ha-armed");}});})();`,
      }}
    />
  );
}

/** Explicitly armed spatial field. Construction and playback both happen
 * inside the click handler, so there is no possible autoplay path. */
export function HoloAudioScript() {
  return (
    <script
      id="kf-audio"
      dangerouslySetInnerHTML={{
        __html: `(function(){var b=document.querySelector("[data-ha-audio]");if(!b)return;var C=window.AudioContext||window.webkitAudioContext;if(!C){b.disabled=true;b.textContent="FIELD AUDIO · UNAVAILABLE";return;}var ctx=null,nodes=[];try{if(localStorage.getItem("kf-field-audio")==="ready")b.textContent="FIELD AUDIO · READY";}catch(_){ }function stop(){for(var i=0;i<nodes.length;i++){try{nodes[i].stop();}catch(_){ }}nodes=[];if(ctx){ctx.close();ctx=null;}b.setAttribute("aria-pressed","false");b.textContent="FIELD AUDIO · OFF";try{localStorage.setItem("kf-field-audio","off");}catch(_){ }}function start(){ctx=new C();var master=ctx.createGain();master.gain.value=.025;master.connect(ctx.destination);var tones=[[440,0,-1],[293.66,-1,0],[349.23,1,0],[220,0,1],[55,0,0]];for(var i=0;i<tones.length;i++){var o=ctx.createOscillator(),g=ctx.createGain(),p=ctx.createPanner();o.type=i===4?"sine":"triangle";o.frequency.value=tones[i][0];g.gain.value=i===4?.28:.12;p.panningModel="HRTF";p.distanceModel="inverse";p.refDistance=1;p.maxDistance=8;p.positionX.value=tones[i][1];p.positionY.value=0;p.positionZ.value=tones[i][2];o.connect(g).connect(p).connect(master);o.start();nodes.push(o);}ctx.resume();b.setAttribute("aria-pressed","true");b.textContent="FIELD AUDIO · ON";try{localStorage.setItem("kf-field-audio","ready");}catch(_){ }}b.addEventListener("click",function(){if(ctx)stop();else start();});addEventListener("pagehide",function(){if(ctx)stop();});})();`,
      }}
    />
  );
}

/** Arrow keys walk the dossier in order, using the pager's own links. */
export function PagerKeysScript() {
  return (
    <script
      id="kf-keys"
      dangerouslySetInnerHTML={{
        __html: `(function(){document.addEventListener("keydown",function(e){if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;var t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;var rel=e.key==="ArrowLeft"?"prev":e.key==="ArrowRight"?"next":null;if(!rel)return;var a=document.querySelector('.pager a[rel="'+rel+'"]');if(a){e.preventDefault();location.href=a.href;}});})();`,
      }}
    />
  );
}

export function FilterScript() {
  return (
    <script
      id="kf-filter"
      dangerouslySetInnerHTML={{
        __html: `(function(){var chips=document.querySelectorAll(".chip[data-filter]");if(!chips.length)return;var out=document.querySelector("[data-filter-count]");var total=out?+out.dataset.total:0;chips.forEach(function(chip){chip.addEventListener("click",function(){var f=chip.dataset.filter;chips.forEach(function(c){var on=c===chip;c.classList.toggle("on",on);c.setAttribute("aria-pressed",on?"true":"false");});var shown=0;document.querySelectorAll(".essay").forEach(function(row){var hit=f==="all"||row.dataset.modeTag===f||row.dataset.grade===f;row.hidden=!hit;if(hit)shown++;});if(out){out.textContent=f==="all"?total+(total===1?" PAPER":" PAPERS"):shown+" OF "+total;}});});})();`,
      }}
    />
  );
}
