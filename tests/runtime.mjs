import assert from 'node:assert/strict';
const listeners=new Map();
function el(){return {innerHTML:'',checked:false,hidden:false,textContent:'',classList:{toggle(){}},addEventListener(n,fn){const key='on'+n;const previous=this[key];this[key]=previous?event=>{previous(event);fn(event)}:fn},querySelector(){return {focus(){},scrollIntoView(){}}},showModal(){},close(){}}}
const app=el(),about=el(),save=el(),reset=el(),close=el(),analyticsBanner=el(),allowAnalytics=el(),declineAnalytics=el(),analyticsSettings=el();
const analyticsScripts=[];
const elements={'#app':app,'#aboutDialog':about,'#aboutBtn':el(),'#closeAbout':close,'#saveToggle':save,'#resetProgress':reset,'#analyticsBanner':analyticsBanner,'#allowAnalytics':allowAnalytics,'#declineAnalytics':declineAnalytics,'#analyticsSettings':analyticsSettings};
const stored=new Map();
globalThis.document={querySelector(s){return elements[s]??el()},body:{classList:{toggle(){}}}};
globalThis.document.createElement=tag=>({tagName:tag,async:false,src:''});
globalThis.document.head={appendChild(node){analyticsScripts.push(node)}};
globalThis.requestAnimationFrame=fn=>fn();
globalThis.localStorage={getItem(key){return stored.get(key)??null},setItem(key,value){stored.set(key,String(value))},removeItem(key){stored.delete(key)}};
await import('../app.js');
assert.equal(analyticsScripts.length,0);
assert.equal(analyticsBanner.hidden,false);
declineAnalytics.onclick();
assert.equal(stored.get('referral-rescue-analytics-v1'),'declined');
assert.equal(analyticsScripts.length,0);
analyticsSettings.onclick();
assert.equal(analyticsBanner.hidden,false);
allowAnalytics.onclick();
assert.equal(stored.get('referral-rescue-analytics-v1'),'accepted');
assert.equal(analyticsScripts.length,1);
assert.match(analyticsScripts[0].src,/googletagmanager\.com\/gtag\/js\?id=G-64N76HDTT7/);
assert.equal(globalThis.dataLayer.length,2);
allowAnalytics.onclick();
assert.equal(analyticsScripts.length,1);
function click(action,other={}){app.onclick({target:{closest(){return {dataset:{action,...other}}}}})}
assert.match(app.innerHTML,/Quick play/);
for(const mode of ['quick','live','practice']){
 click('start',{mode});assert.match(app.innerHTML,/SIMULATED CASE FILE/);
 const cases=mode==='practice'?3:1,steps=mode==='live'?3:6;
 for(let c=0;c<cases;c++){
  click('begin');
  for(let i=0;i<steps;i++){
   assert.match(app.innerHTML,/choices/);
   if(mode==='live'){
    assert.doesNotMatch(app.innerHTML,/GOOD HANDOFF/);
    click('choose',{index:'1'});
    assert.doesNotMatch(app.innerHTML,/GOOD HANDOFF/);
    click('reveal');
   }else{
    click('hint');assert.match(app.innerHTML,/class="hint"/);
    click('choose',{index:'1'});
    if(app.innerHTML.includes('Try this decision again')){
      click('retry'); assert.doesNotMatch(app.innerHTML,/LET’S REPAIR THIS HANDOFF/);
      click('choose',{index:'0'});
    }
   }
   assert.match(app.innerHTML,/feedback/);
   click('next');
  }
  assert.match(app.innerHTML,/30-DAY TRANSFER/);
  if(c<cases-1)click('next-case');
 }
 click('home');
}
console.log('Simulated Quick, Live, Practice flows, 27 decisions, reveal gate, hints, wrong-answer retry, endings.');
