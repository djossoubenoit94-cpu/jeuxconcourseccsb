// Lancer : node tests.js
const fs=require("fs");eval(fs.readFileSync("js/data.js","utf8")+";global.Q=QUESTIONS;global.C=CATS");
const {pick,present,MAX_Q}=require("./js/engine.js");let bad=0;const ok=(c,m)=>{if(!c){console.log("ÉCHEC:",m);bad++}};
ok(new Set(Q.map(q=>q.id)).size===Q.length,"ids uniques");
Object.keys(C).forEach(k=>ok(Q.some(q=>q.cat===k),"catégorie vide "+k));
const seen={};let prev=new Set(),overlap=[];
for(let t=0;t<5;t++){const l=pick(Q,50,seen);ok(l.length<=MAX_Q,"max 50");ok(new Set(l.map(q=>q.id)).size===l.length,"doublon");
 overlap.push(l.filter(q=>prev.has(q.id)).length);prev=new Set(l.map(q=>q.id));l.forEach(q=>{const p=present(q,Q);ok(p.type!=="qcm"||p.opts.includes(q.a)&&new Set(p.opts).size===p.opts.length,"qcm "+q.id)})}
console.log("questions:",Q.length,"| recouvrement entre tentatives successives:",overlap.join(","));
console.log(bad?bad+" échec(s)":"Tous les tests passent");
