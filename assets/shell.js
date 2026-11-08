/* Shared helpers + header/footer for every page */
const SOCIAL = {
  tt: {name:"TikTok", url:"https://www.tiktok.com/@no_rules_yt_",
    svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'},
  yt: {name:"YouTube", url:"https://www.youtube.com/@no_rules_yt_",
    svg:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},
  ig: {name:"Instagram", url:"https://www.instagram.com/no_rules_yt_",
    svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>'}
};
const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 20h16"/></svg>';
const GO_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M8 7h9v9"/></svg>';
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
  return {specs, desc:lines(d), feats:lines(f).map(l=>l.replace(/^-\s*/,"")), steps: steps.length?steps:DEFAULT_STEPS};
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
function specChip(a,key){
  const f = a.details.specs.find(([k])=>k.toLowerCase()===key.toLowerCase());
  return f ? `<span class="chip"><b>${esc(f[0])}</b> ${esc(f[1])}</span>` : "";
}
function gameCard(a){
  return `<article class="game">
    <a class="shot" href="${a.url}" aria-label="${esc(a.name)} details"><img src="${a.path(a.banner)}" alt="${esc(a.name)} banner" loading="lazy"></a>
    <div class="body">
      <h3>${esc(a.name)}</h3>
      <p class="tl">${esc(a.tagline||"")}</p>
      <div class="chips">${specChip(a,"Version")}${specChip(a,"Size")}${specChip(a,"Price")}</div>
      <div class="row">
        <a class="btn btn-main" href="${a.path(a.apk)}" download="${esc(a.downloadName||a.apk)}">${DL_ICON}Download</a>
        <a class="btn btn-ghost" href="${a.url}">Details</a>
      </div>
    </div></article>`;
}

function renderBar(){
  document.getElementById("bar").innerHTML = `<div class="bar"><div class="wrap bar-in">
    <a class="brand" href="index.html"><img src="assets/logo-192.png" alt="No Rules YT logo" width="42" height="42"><span>No Rules YT</span></a>
    <nav class="bar-links" aria-label="Social links">${Object.values(SOCIAL).map(s=>`<a class="ico" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}">${s.svg}</a>`).join("")}</nav>
  </div></div>`;
}
function renderFooter(){
  const cls = {tt:"tt",yt:"yt",ig:"ig"};
  document.getElementById("foot").innerHTML = `<footer><div class="wrap">
    <section class="card" id="owner">
      <h2>Owner</h2>
      <div class="owner"><img src="assets/logo-192.png" alt="No Rules YT" width="84" height="84"><div><h3>No Rules YT</h3><p>Game developer &amp; content creator</p></div></div>
      <div class="socials">${Object.entries(SOCIAL).map(([k,s])=>`<a class="soc ${cls[k]}" href="${s.url}" target="_blank" rel="noopener"><i>${s.svg}</i><span><strong>${s.name}</strong><small>@no_rules_yt_</small></span></a>`).join("")}</div>
    </section>
    <section class="card more">
      <div><h2>For more apps, games, tools</h2><p>Aro free app, game ar tool dekhte visit koro.</p></div>
      <a class="btn btn-main" href="https://nryt.netlify.app/" target="_blank" rel="noopener">Visit NRYT ${GO_ICON}</a>
    </section>
    <p class="copy">&copy; ${new Date().getFullYear()} No Rules YT</p>
  </div></footer>`;
}
