const LS="cs26";let S={};try{S=JSON.parse(localStorage.getItem(LS)||"{}")}catch(e){}
S.seen=S.seen||{};S.hist=S.hist||[];S.custom=S.custom||[];S.cfg=S.cfg||{mockSec:30,fastSec:10};
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s);
const PAGES=[["accueil","Accueil"],["programme","Programme"],["revision","Révision"],["entrainement","Entraînement"],["concours","Concours blanc"],["rapidite","Rapidité"],["mentor","Mentor"]];
const SEC={};PAGES.forEach(([id])=>SEC[id]=$("#"+id)||document.createElement("section"));const MODE_SEC={train:"entrainement",mock:"concours",fast:"rapidite"};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pool=()=>QUESTIONS.concat(S.custom);
const LV=["","Facile","Moyen","Difficile"];
const catName=c=>CATS[c]||c;
let G=null,tm=null;
const url=id=>id==="accueil"?"index.html":id+".html";
function nav(){const cur=document.body.dataset.page||"accueil",btn=$("#menuBtn"),panel=$("#menuPanel");
 panel.innerHTML=PAGES.map(([id,t])=>`<a href="${url(id)}"${id===cur?' aria-current="page"':""}>${t}</a>`).join("");
 const set=o=>{panel.hidden=!o;btn.setAttribute("aria-expanded",o);btn.querySelector(".ic").textContent=o?"✕":"☰"};
 btn.addEventListener("click",e=>{e.stopPropagation();set(panel.hidden)});
 panel.addEventListener("click",e=>{if(e.target.closest("a"))set(false)});
 document.addEventListener("click",e=>{if(!panel.hidden&&!e.target.closest("header.top"))set(false)});
 addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden){set(false);btn.focus()}});
 addEventListener("pageshow",()=>set(false))}

function stats(){const h=S.hist;const best=h.length?Math.max(...h.map(x=>x.pct)):null;return{n:h.length,best,avg:h.length?Math.round(h.reduce((s,x)=>s+x.pct,0)/h.length):null}}
function home(){const el=SEC.accueil;const st=stats(),days=Math.ceil((new Date("2026-12-24")-new Date())/864e5);
el.innerHTML=`<div class="hero"><small>Église des Chérubins et Séraphins · Pèlerinage 2026</small><h1>Jeu-concours biblique et doctrinal</h1><div class="date">24 décembre 2026${days>0?` — J−${days}`:""}</div><p>Apprendre l'histoire et la doctrine de l'Église, étudier Genèse 1–3 et Matthieu 1–3, s'entraîner et se mesurer en conditions de concours.</p><a class="btn" href="entrainement.html">Commencer l'entraînement</a><a class="btn alt" href="programme.html">Programme officiel</a></div>
<section class="band"><h2>Votre progression</h2>${st.n?`<div class="grid"><div class="cell"><b>${st.n}</b>tentatives</div><div class="cell"><b>${st.avg}%</b>moyenne</div><div class="cell"><b>${st.best}%</b>meilleur score</div></div>`:`<p class="meta">Aucune tentative enregistrée pour l'instant. Votre progression apparaîtra ici après votre premier test.</p>`}</section>
<section class="band dark"><h2>Trois façons de se préparer</h2><div class="grid"><div class="cell"><b>1</b>Réviser avec les fiches et cartes de mémorisation.</div><div class="cell"><b>2</b>S'entraîner librement, avec correction immédiate.</div><div class="cell"><b>3</b>Passer le concours blanc chronométré.</div></div></section>
<section class="band"><p class="meta">${QUESTIONS.length} questions officielles · ${S.custom.length} complémentaires · Source : document officiel de préparation (27 pages).</p></section>`}

function counts(){const c={};pool().forEach(q=>c[q.cat]=(c[q.cat]||0)+1);return c}
function programme(){const el=SEC.programme;const c=counts();const blk=(t,keys)=>`<h2>${t}</h2>`+keys.map(k=>`<div class="cat"><div>${catName(k)}<br><span>${c[k]||0} questions</span></div><span><a href="revision.html?cat=${k}">Réviser</a> · <a href="entrainement.html?cat=${k}">S'entraîner</a></span></div>`).join("");
el.innerHTML=`<section class="band"><h1>Programme officiel</h1>${blk("Partie 1 — Doctrine de l'Église",["HIS","FON","BEN","COU","GRP","DAT","ANG","PRI","PSA","PAR","FET"])}${blk("Partie 2 — Genèse",["G1","G2","G3"])}${blk("Partie 2 — Évangile selon Matthieu",["M1","M2","M3"])}</section>`}

function revision(k){const el=SEC.revision;const keys=Object.keys(CATS);
if(!k){el.innerHTML=`<section class="band"><h1>Espace de révision</h1><p>Choisissez une rubrique : fiches (question, réponse, référence, page du PDF) et cartes à retourner.</p>${keys.map(x=>`<div class="cat"><a href="revision.html?cat=${x}">${catName(x)}</a></div>`).join("")}</section>`;return}
const L=pool().filter(q=>q.cat===k);
el.innerHTML=`<section class="band"><a href="revision.html">← Rubriques</a><h1>${catName(k)}</h1><p class="meta">Touchez une carte pour voir la réponse.</p><div class="grid">${L.map(q=>`<div class="card flip" data-id="${q.id}"><div class="q">${esc(q.q)}</div></div>`).join("")}</div></section>`;
el.querySelectorAll(".flip").forEach(el=>el.onclick=()=>{const q=L.find(x=>x.id===el.dataset.id);const open=el.dataset.o==="1";el.dataset.o=open?"0":"1";el.innerHTML=open?`<div class="q">${esc(q.q)}</div>`:`<b>${esc(q.a)}</b><div class="meta">${q.ref?esc(q.ref)+" · ":""}PDF p. ${q.page}</div>${q.expl?`<div class="meta">${esc(q.expl)}</div>`:""}`})}

function setup(mode,pre){const el=SEC[MODE_SEC[mode]],$=s=>el.querySelector(s);const hash=pre;const T={train:["Entraînement libre","Correction immédiate, sans chronomètre."],mock:["Concours blanc","Questions doctrinales et bibliques mélangées, chronomètre, correction à la fin."],fast:["Mode rapidité","Temps limité par question, correction immédiate, points bonus."]}[mode];
el.innerHTML=`<section class="band"><h1>${T[0]}</h1><p>${T[1]}</p><div class="card"><div class="row"><label>Catégorie<select id="cat"><option value="">Toutes les catégories</option>${Object.keys(CATS).map(k=>`<option value="${k}" ${hash===k?"selected":""}>${catName(k)}</option>`).join("")}</select></label><label>Nombre de questions<select id="n">${[10,20,30,50].map(n=>`<option ${n===(mode==="mock"?50:10)?"selected":""}>${n}</option>`).join("")}</select></label>${mode!=="train"?`<label>Secondes par question<input id="sec" type="number" min="5" max="120" value="${mode==="mock"?S.cfg.mockSec:S.cfg.fastSec}"></label>`:""}</div><p class="meta">Maximum 50 questions par tentative. Chaque nouvelle tentative privilégie les questions non encore posées.</p><button class="btn" id="go">Lancer</button></div></section>`;
$("#go").onclick=()=>{const cat=$("#cat").value,n=+$("#n").value,sec=$("#sec")?+$("#sec").value:0;if(sec){S.cfg[mode==="mock"?"mockSec":"fastSec"]=sec;}start(mode,cat,n,sec)}}

function start(mode,cat,n,sec){if(G&&!G.done&&G.mode!==mode){clearInterval(tm);G.done=true;setup(G.mode)}
let p=pool().filter(q=>!cat||q.cat===cat);if(mode==="mock"&&!cat)p=pool();
const list=pick(p,n,S.seen);save();
G={mode,cat,n,sec,i:0,items:list.map(q=>present(q,pool())),res:[],pts:0,root:SEC[MODE_SEC[mode]]};ask()}

function ask(){clearInterval(tm);if(G.i>=G.items.length)return finish();const el=G.root,$=s=>el.querySelector(s);const it=G.items[G.i],q=it.q,imm=G.mode!=="mock";
let body="";
if(it.type==="qcm"||it.type==="vf")body=(it.type==="vf"?`<div class="card" style="margin:8px 0">Réponse proposée : <b>${esc(it.shown)}</b></div>`:"")+it.opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join("");
else body=`<input type="text" id="ans" placeholder="Votre réponse…"><p><button class="btn fo" id="rev">Voir la réponse</button></p>`;
el.innerHTML=`<section class="band"><div class="meta">${G.mode==="train"?"Entraînement":G.mode==="mock"?"Concours blanc":"Rapidité"} · Question ${G.i+1}/${G.items.length}${G.mode==="fast"?` · ${G.pts} pts`:""}</div><div class="bar"><i style="width:${G.i/G.items.length*100}%"></i></div>${G.sec?`<div class="timer"><i id="tb" style="width:100%"></i></div><div class="meta" id="tt">${G.sec}s</div>`:""}
<div class="card"><span class="tag">${LV[q.lvl]}</span><span class="tag">${esc(catName(q.cat))}</span><p class="q">${esc(q.q)}${it.type==="vf"?" — Vrai ou faux ?":""}</p>${body}<div id="fb"></div></div><a href="${url(MODE_SEC[G.mode])}" class="meta">Abandonner</a></section>`;
let left=G.sec,t0=Date.now(),done=false;
const answer=(given,ok)=>{if(done)return;done=true;clearInterval(tm);const rem=G.sec?Math.max(0,G.sec-(Date.now()-t0)/1e3):0;
 let pt=ok?1:0;if(ok&&G.mode==="fast"&&rem>=G.sec/2)pt=2;G.pts+=pt;G.res.push({q,given,ok,type:it.type});
 el.querySelectorAll(".opt").forEach((b,k)=>{b.disabled=true;const o=it.opts[k];if(imm){const good=it.type==="vf"?(it.truth?"Vrai":"Faux"):q.a;if(o===good)b.classList.add("ok");else if(o===given)b.classList.add("ko")}});
 $("#fb").innerHTML=imm?fbox(q,ok,given)+`<p><button class="btn" id="nx">Suivant</button></p>`:`<p><button class="btn" id="nx">${G.i+1<G.items.length?"Suivant":"Voir les résultats"}</button></p>`;
 $("#nx").onclick=()=>{G.i++;ask()}};
el.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{const o=it.opts[+b.dataset.k];const ok=it.type==="vf"?(o==="Vrai")===it.truth:o===q.a;answer(o,ok)});
if($("#rev"))$("#rev").onclick=()=>{done=true;clearInterval(tm);const g=$("#ans").value;$("#fb").innerHTML=`<div class="fb"><b>Réponse attendue :</b> ${esc(q.a)}${q.ref?`<br><span class="meta">${esc(q.ref)} · PDF p. ${q.page}</span>`:""}<p>Votre réponse était-elle juste ?</p><button class="btn fo" id="y">Oui</button><button class="btn alt" id="no">Non</button></div>`;
 const fin=ok=>{G.pts+=ok?1:0;G.res.push({q,given:g,ok,type:"direct"});G.i++;ask()};$("#y").onclick=()=>fin(true);$("#no").onclick=()=>fin(false)};
if(G.sec)tm=setInterval(()=>{left=G.sec-(Date.now()-t0)/1e3;if($("#tb"))$("#tb").style.width=Math.max(0,left/G.sec*100)+"%";if($("#tt"))$("#tt").textContent=Math.ceil(Math.max(0,left))+"s";
 if(left<=0){clearInterval(tm);if(it.type==="direct"){if(!done){done=true;G.res.push({q,given:"(temps écoulé)",ok:false,type:"direct"});G.i++;ask()}}else answer("(temps écoulé)",false)}},200)}

function fbox(q,ok,given){return`<div class="fb ${ok?"":"ko"}"><b>${ok?"Bonne réponse !":"Réponse incorrecte."}</b>${ok?"":`<br>Votre réponse : ${esc(given)}`}<br>Réponse correcte : <b>${esc(q.a)}</b>${q.expl?`<br>${esc(q.expl)}`:`<br>${q.ref?"Ce point est traité dans "+esc(q.ref)+".":"Information issue du document officiel."}`}<br><span class="meta">${q.ref?"Référence biblique : "+esc(q.ref)+" · ":""}Source officielle : document de préparation, page ${q.page}.</span></div>`}

function finish(){const el=G.root,$=s=>el.querySelector(s);G.done=true;const r=G.res,good=r.filter(x=>x.ok).length,pct=Math.round(good/r.length*100);
const by={};r.forEach(x=>{const b=by[x.q.cat]=by[x.q.cat]||[0,0];b[1]++;if(x.ok)b[0]++});
const strong=[],weak=[];Object.entries(by).forEach(([k,[g,t]])=>(g/t>=.7?strong:weak).push(`${catName(k)} (${g}/${t})`));
S.hist.push({date:new Date().toISOString(),mode:G.mode,n:r.length,good,pct,by});save();
const lastRes=r;el.innerHTML=`<section class="band"><h1>Résultats</h1><div class="grid"><div class="cell"><b>${pct}%</b>de réussite</div><div class="cell"><b>${good}</b>bonnes réponses</div><div class="cell"><b>${r.length-good}</b>mauvaises réponses</div>${G.mode==="fast"?`<div class="cell"><b>${G.pts}</b>points</div>`:""}</div>
<h3 style="margin-top:24px">Catégories maîtrisées</h3><p>${strong.join(" · ")||"—"}</p><h3>À réviser</h3><p>${weak.join(" · ")||"Aucune, bravo !"}</p>
<button class="btn" id="err" ${good===r.length?"disabled":""}>Revoir mes erreurs</button><button class="btn fo" id="again">Nouvelle tentative</button><a class="btn alt" href="index.html">Accueil</a><div id="rv"></div></section>`;
$("#err").onclick=()=>{$("#rv").innerHTML=`<h2>Mes erreurs</h2>`+lastRes.filter(x=>!x.ok).map(x=>`<div class="card"><div class="q">${esc(x.q.q)}</div>${fbox(x.q,false,x.given)}</div>`).join("")};
$("#again").onclick=()=>start(G.mode,G.cat,G.n,G.sec)}

function mentor(){const el=SEC.mentor,$=s=>el.querySelector(s);const h=S.hist,by={};h.forEach(x=>Object.entries(x.by).forEach(([k,[g,t]])=>{const b=by[k]=by[k]||[0,0];b[0]+=g;b[1]+=t}));
const weak=Object.entries(by).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]).slice(0,5);
el.innerHTML=`<section class="band"><h1>Espace mentor</h1><p class="meta">Les données de suivi sont celles de cet appareil (stockage local). Pour suivre plusieurs enfants, utilisez un appareil par enfant ou ajoutez le module comptes (voir README).</p>
<h2>Difficultés récurrentes</h2><p>${weak.length?weak.map(([k,[g,t]])=>`${catName(k)} : ${Math.round(g/t*100)}% (${t} réponses)`).join("<br>"):"Pas encore de données."}</p>
<h2>Historique (${h.length})</h2><div style="overflow-x:auto"><table width="100%" cellpadding="6"><tr><th align=left>Date</th><th align=left>Mode</th><th align=left>Score</th></tr>${h.slice(-15).reverse().map(x=>`<tr><td>${new Date(x.date).toLocaleString("fr-FR")}</td><td>${x.mode}</td><td>${x.good}/${x.n} (${x.pct}%)</td></tr>`).join("")}</table></div>
<h2>Ajouter une question complémentaire</h2><div class="card"><div class="row"><label>Catégorie<select id="nc">${Object.keys(CATS).map(k=>`<option value="${k}">${catName(k)}</option>`).join("")}</select></label><label>Niveau<select id="nl"><option value="1">Facile</option><option value="2">Moyen</option><option value="3">Difficile</option></select></label></div><p><input id="nq" placeholder="Question"></p><p><input id="na" placeholder="Réponse correcte"></p><p><input id="nr" placeholder="Référence biblique (optionnel)"></p><p><input id="ne" placeholder="Explication (optionnel)"></p><button class="btn" id="add">Ajouter</button></div>
<h2>Banque de questions</h2><div class="row"><select id="fc"><option value="">Toutes</option>${Object.keys(CATS).map(k=>`<option value="${k}">${catName(k)}</option>`).join("")}</select><input id="fs" placeholder="Rechercher…"></div><div id="lst"></div></section>`;
const list=()=>{const c=$("#fc").value,s=$("#fs").value.toLowerCase();$("#lst").innerHTML=pool().filter(q=>(!c||q.cat===c)&&(!s||(q.q+q.a).toLowerCase().includes(s))).map(q=>`<div class="card"><span class="tag">${q.official?"officielle":"complémentaire"}</span><span class="tag">${LV[q.lvl]}</span><span class="meta">${q.id} · ${esc(catName(q.cat))}</span><p class="q">${esc(q.q)}</p><b>${esc(q.a)}</b><div class="meta">${q.ref?esc(q.ref)+" · ":""}${q.page?"PDF p. "+q.page+" · ":""}${esc(q.status)}</div>${q.expl?`<div class="meta">${esc(q.expl)}</div>`:""}${q.official?"":`<button class="btn alt" data-del="${q.id}">Supprimer</button>`}</div>`).join("");
 el.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{S.custom=S.custom.filter(x=>x.id!==b.dataset.del);save();list()})};
$("#fc").onchange=list;$("#fs").oninput=list;list();
$("#add").onclick=()=>{const q=$("#nq").value.trim(),a=$("#na").value.trim();if(!q||!a)return alert("Question et réponse obligatoires.");
 const cat=$("#nc").value;S.custom.push({id:"C"+Date.now(),cat,q,a,ref:$("#nr").value.trim(),page:0,lvl:+$("#nl").value,expl:$("#ne").value.trim(),part:/^[GM]\d$/.test(cat)?"Partie 2":"Partie 1",official:false,status:"complémentaire (mentor, à valider)"});save();mentor()}}
const PAGE=document.body.dataset.page||"accueil",P0=new URLSearchParams(location.search).get("cat"),PARAM=CATS[P0]?P0:undefined;
nav();({accueil:home,programme,revision:()=>revision(PARAM),entrainement:()=>setup("train",PARAM),concours:()=>setup("mock",PARAM),rapidite:()=>setup("fast",PARAM),mentor})[PAGE]();
