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

/**
 * Moment A — the Live Attestation. Re-fetches every content source pinned
 * to the built commit, re-hashes each, recomputes the dossier digest, and
 * stamps the seal only when everything matches. Any failure = UNVERIFIED.
 */
export function AttestScript() {
  return (
    <script
      id="kf-attest"
      dangerouslySetInnerHTML={{
        __html: `(function(){var panel=document.querySelector("[data-attest-panel]");if(!panel)return;var seal=panel.querySelector("[data-attest-seal]");var state=panel.querySelector("[data-seal-state]");var commit=panel.dataset.commit;var digest=panel.dataset.digest;var files=JSON.parse(panel.dataset.files);var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var RAW="https://raw.githubusercontent.com/${site.githubOwner}/${site.repo}/";panel.classList.add("attest-live");state.textContent="CHECKING\\u2026";function hex(buf){var a=new Uint8Array(buf),s="";for(var i=0;i<a.length;i++){s+=a[i].toString(16).padStart(2,"0");}return s;}var key="kfa:"+commit;var check=(async function(){try{var cached=null;try{cached=sessionStorage.getItem(key);}catch(_){ }if(cached==="ok")return true;if(!window.crypto||!crypto.subtle||commit==="UNCOMMITTED"||!files.length)return false;var pairs=await Promise.all(files.map(async function(f){var r=await fetch(RAW+commit+"/"+f.p,{cache:"no-store"});if(!r.ok)throw 0;var h=hex(await crypto.subtle.digest("SHA-256",await r.arrayBuffer()));if(h!==f.h)throw 0;return f.p+":"+h;}));pairs.sort();var d=hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pairs.join("\\n"))));if(d!==digest)return false;try{sessionStorage.setItem(key,"ok");}catch(_){ }return true;}catch(_){return false;}})();var wait=new Promise(function(r){setTimeout(r,reduce?0:2100);});Promise.all([check,wait]).then(function(res){var ok=res[0];state.textContent=ok?"VERIFIED \\u2713 "+commit.slice(0,7):"UNVERIFIED \\u2014 CHECK MANUALLY";seal.classList.add(ok?"ok":"fail");panel.classList.add("sealed");});})();`,
      }}
    />
  );
}

/**
 * The holographic layer — mounts after first paint, occupies exactly the
 * sigil's box (zero CLS), and skips entirely on reduced motion, data-saver,
 * or coarse-pointer low-memory devices. Audio is opt-in, never autoplay.
 */
export function HoloScript() {
  return (
    <script
      id="kf-holo"
      dangerouslySetInnerHTML={{
        __html: `(function(){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(navigator.connection&&navigator.connection.saveData)return;if(matchMedia("(pointer: coarse)").matches&&(navigator.deviceMemory||8)<=4)return;var sig=document.querySelector(".hero-sigil");var hero=document.querySelector(".hero-shell");if(!sig||!hero)return;requestAnimationFrame(function(){requestAnimationFrame(mount);});function el(c){var d=document.createElement("div");d.className=c;return d;}var NODES=[{x:50,y:16,f:440},{x:34,y:50,f:293.66},{x:66,y:50,f:349.23},{x:50,y:64,f:220}];var ctx=null,master=null,on=false;function panner(x,y,z){var p=ctx.createPanner();p.panningModel="HRTF";p.distanceModel="inverse";p.refDistance=1;p.maxDistance=18;p.rolloffFactor=1.1;var px=(x-50)/12,py=(50-y)/16;if(p.positionX){p.positionX.value=px;p.positionY.value=py;p.positionZ.value=z;}else{p.setPosition(px,py,z);}return p;}function drone(){var g=ctx.createGain();g.gain.value=.1;[110,164.81].forEach(function(f,i){var o=ctx.createOscillator();o.type="sine";o.frequency.value=f;var og=ctx.createGain();og.gain.value=i?.38:1;o.connect(og);og.connect(g);o.start();});var lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=.09;lg.gain.value=.035;lfo.connect(lg);lg.connect(g.gain);lfo.start();var p=panner(50,52,-2.6);g.connect(p);p.connect(master);}function strike(n){if(!ctx)return;var t=ctx.currentTime,g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.34,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+2.4);[[1,1],[2,.28],[3.02,.14],[4.1,.06]].forEach(function(pr){var o=ctx.createOscillator();o.type="sine";o.frequency.value=n.f*pr[0];var og=ctx.createGain();og.gain.value=pr[1];o.connect(og);og.connect(g);o.start(t);o.stop(t+2.5);});var p=panner(n.x,n.y,-1.2);g.connect(p);p.connect(master);}function initAudio(){ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);var L=ctx.listener;if(L.positionX){L.positionX.value=0;L.positionY.value=0;L.positionZ.value=0;L.forwardX.value=0;L.forwardY.value=0;L.forwardZ.value=-1;L.upY.value=1;}else if(L.setPosition){L.setPosition(0,0,0);L.setOrientation(0,0,-1,0,1,0);}drone();master.gain.linearRampToValueAtTime(.5,ctx.currentTime+1.2);}function mount(){var rect=sig.getBoundingClientRect();var mb=getComputedStyle(sig).marginBottom;var wrap=el("holo-wrap");wrap.style.width=rect.width+"px";wrap.style.height=rect.height+"px";wrap.style.marginBottom=mb;sig.parentNode.insertBefore(wrap,sig);sig.style.margin="0";var rig=el("holo-rig");["back","cyan","core","mag","front"].forEach(function(k){var l=el("holo-layer hl-"+k);if(k==="core"){l.appendChild(sig);}else{var c=sig.cloneNode(true);c.classList.remove("sigil-draw");c.removeAttribute("role");c.setAttribute("aria-hidden","true");l.appendChild(c);}rig.appendChild(l);});wrap.appendChild(el("holo-floor"));wrap.appendChild(el("holo-sweep"));wrap.appendChild(rig);wrap.appendChild(el("holo-scan"));var btn=document.createElement("button");btn.type="button";btn.className="holo-audio";var pref=null;try{pref=localStorage.getItem("kf-audio");}catch(_){ }btn.textContent=pref==="on"?"SPATIAL AUDIO \\u2014 RESUME":"SPATIAL AUDIO \\u2014 OFF";wrap.appendChild(btn);btn.addEventListener("click",function(){if(!on){if(!ctx){initAudio();}else{ctx.resume();master.gain.linearRampToValueAtTime(.5,ctx.currentTime+.8);}on=true;btn.textContent="SPATIAL AUDIO \\u2014 ON";btn.classList.add("on");NODES.forEach(function(n,i){setTimeout(function(){strike(n);},380+i*430);});try{localStorage.setItem("kf-audio","on");}catch(_){ }}else{master.gain.linearRampToValueAtTime(0,ctx.currentTime+.5);on=false;btn.textContent="SPATIAL AUDIO \\u2014 OFF";btn.classList.remove("on");try{localStorage.setItem("kf-audio","off");}catch(_){ }}});hero.addEventListener("pointermove",function(e){var r=hero.getBoundingClientRect();var yaw=((e.clientX-r.left)/r.width-.5)*28;var pitch=-((e.clientY-r.top)/r.height-.5)*18;rig.style.transform="rotateX("+pitch.toFixed(2)+"deg) rotateY("+yaw.toFixed(2)+"deg)";});hero.addEventListener("pointerleave",function(){rig.style.transform="";});}})();`,
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
        __html: `(function(){var chips=document.querySelectorAll(".chip[data-filter]");if(!chips.length)return;var out=document.querySelector("[data-filter-count]");var total=out?+out.dataset.total:0;chips.forEach(function(chip){chip.addEventListener("click",function(){var f=chip.dataset.filter;chips.forEach(function(c){c.classList.toggle("on",c===chip);});var shown=0;document.querySelectorAll(".essay").forEach(function(row){var hit=f==="all"||row.dataset.modeTag===f||row.dataset.grade===f;row.hidden=!hit;if(hit)shown++;});if(out){out.textContent=f==="all"?total+(total===1?" PAPER":" PAPERS"):shown+" OF "+total;}});});})();`,
      }}
    />
  );
}
