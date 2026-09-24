import assert from 'node:assert/strict';
const listeners=new Map();
function el(){return {innerHTML:'',checked:false,textContent:'',classList:{toggle(){}},addEventListener(n,fn){this['on'+n]=fn},querySelector(){return {focus(){},scrollIntoView(){}}},showModal(){},close(){}}}
const app=el(),about=el(),save=el(),reset=el(),close=el();
const elements={'#app':app,'#aboutDialog':about,'#aboutBtn':el(),'#closeAbout':close,'#saveToggle':save,'#resetProgress':reset};
globalThis.document={querySelector(s){return elements[s]??el()},body:{classList:{toggle(){}}}};
globalThis.requestAnimationFrame=fn=>fn();
globalThis.localStorage={getItem(){return null},setItem(){},removeItem(){}};
await import('../app.js');
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
