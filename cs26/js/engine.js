const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const MAX_Q=50;
// Tirage : privilégie les questions non vues, alterne les catégories, jamais de doublon, jamais > 50.
function pick(pool,n,seen){
  n=Math.min(n,MAX_Q,pool.length);
  const unseen=pool.filter(q=>!seen[q.id]),old=pool.filter(q=>seen[q.id]),out=[];
  for(const tier of [unseen,old]){
    const g={};shuffle(tier).forEach(q=>(g[q.cat]=g[q.cat]||[]).push(q));
    let keys=shuffle(Object.keys(g));
    while(out.length<n&&keys.length){keys=keys.filter(k=>g[k].length);for(const k of keys){if(out.length>=n)break;out.push(g[k].pop())}}
    if(out.length>=n)break;
  }
  out.forEach(q=>seen[q.id]=1);
  if(pool.every(q=>seen[q.id])){for(const k in seen)delete seen[k];out.forEach(q=>seen[q.id]=1)} // nouveau cycle
  return shuffle(out);
}
// Forme de présentation : QCM, vrai/faux ou réponse directe
function present(q,pool,forced){
  const t=forced||["qcm","qcm","qcm","vf","direct"][Math.random()*5|0];
  const others=shuffle(pool.filter(x=>x.id!==q.id&&x.a!==q.a));
  const same=others.filter(x=>x.cat===q.cat);
  const dis=[...same,...others].map(x=>x.a).filter((v,i,s)=>s.indexOf(v)===i).slice(0,3);
  if(t==="qcm"&&dis.length>=2)return{q,type:"qcm",opts:shuffle([q.a,...dis])};
  if(t==="vf"&&dis.length){const truth=Math.random()<.5;return{q,type:"vf",shown:truth?q.a:dis[0],truth,opts:["Vrai","Faux"]}}
  return{q,type:"direct"};
}
function norm(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()}
if(typeof module!=="undefined")module.exports={pick,present,shuffle,MAX_Q};
