/* Shared helpers, header, footer, cards, animations */
const SOCIAL = {
  tt:{name:"TikTok",url:"https://www.tiktok.com/@no_rules_yt_",svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'},
  yt:{name:"YouTube",url:"https://www.youtube.com/@no_rules_yt_",svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},
  ig:{name:"Instagram",url:"https://www.instagram.com/no_rules_yt_",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>'}
};
const IC = {
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"/></svg>',
  go:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
  ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.6l6.8-4.2M8.6 13.4l6.8 4.2"/></svg>'
};
const DEFAULT_STEPS = [
  'Download button e click kore APK file ta nao',
  'File ta khulo. Block korle Settings e "Install unknown apps" allow koro',
  'Install kore game open koro ar khelo'
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lines = b => (b||"").split("\n").map(l=>l.trim()).filter(Boolean);

function parseDetails(txt){
  const [s="",d="",f="",st=""] = txt.replace(/\r/g,"").split(/^---$/m);
  const specs = lines(s).filter(l=>l.includes(":")).map(l=>{const i=l.indexOf(":");return [l.slice(0,i).trim(), l.slice(i+1).trim()]});
  const steps = lines(st);
  return {specs, desc:lines(d), feats:lines(f).map(l=>l.replace(/^-\s*/,"")), steps:steps.length?steps:DEFAULT_STEPS};
}
async function loadApps(){
  const apps = await (await fetch("apps.json")).json();
  await Promise.all(apps.map(async a=>{
    a.url = `game.html?id=${encodeURIComponent(a.id)}`;
    a.path = f => `${a.folder}/${f}`;
    try{ a.details = parseDetails(await (await fetch(a.path("details.txt"))).text()); }
    catch(e){ a.details = {specs:[],desc:[],feats:[],steps:DEFAULT_STEPS}; }
  }));
  return apps;
}
const spec = (a,key) => { const f=a.details.specs.find(([k])=>k.toLowerCase()===key.toLowerCase()); return f?f[1]:""; };

/* accent colour taken from the banner image (no config needed) */
function sampleAccent(src){
  return new Promise(res=>{
    const i=new Image();
    i.onload=()=>{try{
      const c=document.createElement("canvas");c.width=c.height=24;
      const x=c.getContext("2d");x.drawImage(i,0,0,24,24);
      const d=x.getImageData(0,0,24,24).data;let r=0,g=0,b=0,w=0;
      for(let k=0;k<d.length;k+=4){
        const R=d[k],G=d[k+1],B=d[k+2],mx=Math.max(R,G,B),mn=Math.min(R,G,B);
        const s=mx?(mx-mn)/mx:0,ww=s*s*(mx/255)+.001;
        r+=R*ww;g+=G*ww;b+=B*ww;w+=ww;
      }
      r/=w;g/=w;b/=w;const f=230/Math.max(r,g,b,1);
      res(`rgb(${Math.min(255,r*f)|0},${Math.min(255,g*f)|0},${Math.min(255,b*f)|0})`);
    }catch(e){res(null)}};
    i.onerror=()=>res(null); i.src=src;
  });
}
async function applyAccents(apps,root=document){
  for(const a of apps){
    if(!a.accent) a.accent = await sampleAccent(a.path(a.banner));
    if(a.accent) root.querySelectorAll(`[data-id="${a.id}"]`).forEach(el=>el.style.setProperty("--a",a.accent));
  }
}

function gameCard(a,i=0){
  const cat=spec(a,"Category"), meta=[spec(a,"Version"),spec(a,"Size"),spec(a,"Price")].filter(Boolean);
  return `<div class="cell reveal" style="--i:${i}"><article class="game" data-id="${esc(a.id)}">
    <div class="media">
      <a class="shot" href="${a.url}" tabindex="-1" aria-hidden="true"><img src="${a.path(a.banner)}" alt="${esc(a.name)} banner" loading="lazy"></a>
      ${cat?`<span class="tag">${esc(cat)}</span>`:""}
      ${a.icon?`<img class="ic" src="${a.path(a.icon)}" alt="" width="64" height="64">`:""}
    </div>
    <div class="body">
      <h3><a href="${a.url}">${esc(a.name)}</a></h3>
      <p class="tl">${esc(a.tagline||"")}</p>
      <p class="meta">${meta.map(m=>`<span>${esc(m)}</span>`).join("")}</p>
      <div class="row">
        <a class="btn btn-main" data-dl href="${a.path(a.apk)}" download="${esc(a.downloadName||a.apk)}">${IC.dl}Download</a>
        <a class="btn btn-ghost" href="${a.url}">Details</a>
      </div>
    </div></article></div>`;
}
const skeletons = n => Array.from({length:n},()=>'<div class="sk"></div>').join("");

/* header + footer */
function renderBar(){
  document.getElementById("bar").innerHTML = `<div class="bar"><div class="wrap bar-in">
    <a class="brand" href="index.html"><img src="assets/logo-192.png" alt="No Rules YT logo" width="42" height="42"><span>No Rules YT</span></a>
    <nav class="nav" aria-label="Main"><a href="index.html#games">Games</a><a href="index.html#owner">Owner</a><a href="https://nryt.netlify.app/" target="_blank" rel="noopener">More tools</a></nav>
    <nav class="bar-links" aria-label="Social links">${Object.values(SOCIAL).map(s=>`<a class="ico" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${s.svg}</a>`).join("")}</nav>
  </div></div><div class="toast" id="toast" role="status" aria-live="polite">${IC.ok}<span></span></div>`;
}
function renderFooter(){
  const cls={tt:"tt",yt:"yt",ig:"ig"};
  document.getElementById("foot").innerHTML = `<footer><div class="wrap">
    <section class="card reveal" id="owner">
      <h2>Owner</h2>
      <div class="owner"><img src="assets/logo-192.png" alt="No Rules YT" width="84" height="84"><div><h3>No Rules YT</h3><p>Game developer &amp; content creator</p></div></div>
      <div class="socials">${Object.entries(SOCIAL).map(([k,s])=>`<a class="soc ${cls[k]}" href="${s.url}" target="_blank" rel="noopener"><i>${s.svg}</i><span><strong>${s.name}</strong><small>@no_rules_yt_</small></span></a>`).join("")}</div>
    </section>
    <section class="card more reveal">
      <div><h2>For more apps, games, tools</h2><p>Aro free app, game ar tool dekhte visit koro.</p></div>
      <a class="btn btn-main btn-lg" href="https://nryt.netlify.app/" target="_blank" rel="noopener">Visit NRYT ${IC.go}</a>
    </section>
    <p class="copy">&copy; ${new Date().getFullYear()} No Rules YT</p>
  </div></footer>`;
  observeReveal();
}

/* toast, download feedback, share */
let toastTimer;
function toast(msg){
  const t=document.getElementById("toast"); if(!t) return;
  t.querySelector("span").textContent=msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),3600);
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-dl]"); if(!b) return;
  toast("Download shuru hoyeche. Shesh hole file ta khulo ar install koro.");
  const old=b.innerHTML; b.classList.add("done"); b.innerHTML=IC.ok+"Downloading";
  setTimeout(()=>{b.classList.remove("done");b.innerHTML=old},3200);
});
async function shareApp(name){
  const url=location.href;
  try{
    if(navigator.share){await navigator.share({title:name,url});return;}
    await navigator.clipboard.writeText(url); toast("Link copy hoyeche");
  }catch(e){}
}

/* scroll reveal + card spotlight */
const io = "IntersectionObserver" in window ? new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.12}) : null;
function observeReveal(root=document){
  root.querySelectorAll(".reveal:not(.in)").forEach(el=>io?io.observe(el):el.classList.add("in"));
}
document.addEventListener("pointermove",e=>{
  const g=e.target.closest&&e.target.closest(".game"); if(!g) return;
  const r=g.getBoundingClientRect();
  g.style.setProperty("--mx",(e.clientX-r.left)+"px"); g.style.setProperty("--my",(e.clientY-r.top)+"px");
});
