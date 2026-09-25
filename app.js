import {cases} from './scenarios.js';

const app=document.querySelector('#app');
const dialog=document.querySelector('#aboutDialog');
const storageKey='referral-rescue-v1';
const analyticsStorageKey='referral-rescue-analytics-v1';
const analyticsId='G-64N76HDTT7';
const analyticsBanner=document.querySelector('#analyticsBanner');
const allowAnalytics=document.querySelector('#allowAnalytics');
const declineAnalytics=document.querySelector('#declineAnalytics');
const analyticsSettings=document.querySelector('#analyticsSettings');
const stages=['Capture','Check','Protect','Exchange','Return','Use'];
const dimensions=['Continuity','Data quality','Privacy','Local usefulness'];
const icons=['↗','◇','◈','▥'];
let saved={enabled:false,completed:[]};
try { const s=JSON.parse(localStorage.getItem(storageKey)||'null'); if(s?.enabled) saved={enabled:true,completed:Array.isArray(s.completed)?s.completed:[]}; } catch {}
let analyticsConsent='unknown';
let analyticsLoaded=false;
try { const consent=localStorage.getItem(analyticsStorageKey); if(consent==='accepted'||consent==='declined') analyticsConsent=consent; } catch {}
function persistAnalyticsConsent(){try{if(analyticsConsent==='unknown')localStorage.removeItem(analyticsStorageKey);else localStorage.setItem(analyticsStorageKey,analyticsConsent)}catch{}}
function showAnalyticsBanner(show){if(analyticsBanner) analyticsBanner.hidden=!show}
function loadAnalytics(){
  if(analyticsLoaded||analyticsConsent!=='accepted')return;
  try{
    const host=globalThis.window||globalThis;
    host.dataLayer=host.dataLayer||[];
    host.gtag=function(){host.dataLayer.push(arguments)};
    host.gtag('js',new Date());
    host.gtag('config',analyticsId);
    if(!document.createElement||!document.head?.appendChild)return;
    const script=document.createElement('script');
    script.async=true;
    script.src=`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    document.head.appendChild(script);
    analyticsLoaded=true;
  }catch{}
}
function setAnalyticsConsent(value){analyticsConsent=value;persistAnalyticsConsent();showAnalyticsBanner(false);if(value==='accepted')loadAnalytics()}
let state={screen:'home',mode:'quick',caseIndex:0,stepIndex:0,selected:null,revealed:false,hint:false,metrics:[2,2,2,2],history:[],completedCases:[],practiceIndex:0};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentCase=()=>cases[state.caseIndex];
const steps=()=>state.mode==='live'?[currentCase().steps[1],currentCase().steps[3],currentCase().steps[4]]:currentCase().steps;
const currentStep=()=>steps()[state.stepIndex];
function persist(){try{if(saved.enabled)localStorage.setItem(storageKey,JSON.stringify(saved));else localStorage.removeItem(storageKey)}catch{}}
function focusHeading(){requestAnimationFrame(()=>app.querySelector('h1, h2')?.focus());}
function addTeamQuestEntry(){const grid=document.querySelector('.mode-grid');if(grid?.insertAdjacentHTML&&!grid.querySelector('[data-action="team-quest"]'))grid.insertAdjacentHTML('beforeend','<button class="mode-card quest-mode-card" data-action="team-quest"><span class="mode-number">04 / ROOM</span><span class="mode-icon">◎</span><strong>Team Quest</strong><span>Host a timed individual or team room with a live leaderboard and scorecard.</span><small>6–18 QUESTIONS · MULTI-DEVICE</small></button>')}
function render(){
  document.body.classList.toggle('live-mode',state.mode==='live'&&state.screen!=='home');
  if(state.screen==='home'){renderHome();addTeamQuestEntry();}
  else if(state.screen==='intro')renderIntro();
  else if(state.screen==='play')renderPlay();
  else if(state.screen==='end')renderEnd();
}
function renderHome(){app.innerHTML=`<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="pulse"></span> THE INFORMATION JOURNEY</p><h1 tabindex="-1">A patient should not become a <em>new person</em> every time the form changes.</h1><p class="lead">Keep one fictional referral intact. Make the choices that help information follow the person—and return as useful action.</p><div class="hero-actions"><button class="primary" data-action="start" data-mode="quick">Play a 3-minute case <span aria-hidden="true">↗</span></button><span class="small">No account · no real patient data</span></div></div><div class="hero-visual" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="center-card"><span>ONE PERSON</span><strong>ONE TRUSTED<br>STORY</strong><div class="card-route">RHU <b>→</b> SERVICE <b>→</b> RHU</div></div><div class="float-card float-a">01 <strong>Verify</strong></div><div class="float-card float-b">02 <strong>Handoff</strong></div><div class="float-card float-c">03 <strong>Return</strong></div></div></section>
<section class="mode-section"><div class="section-head"><p class="eyebrow">CHOOSE YOUR ROUTE</p><h2>One idea. Three ways to play.</h2></div><div class="mode-grid"><button class="mode-card" data-action="start" data-mode="quick"><span class="mode-number">01 / SOLO</span><span class="mode-icon">↗</span><strong>Quick play</strong><span>Guide Ana’s referral from capture to follow-up in six decisions.</span><small>3–5 MIN · 1 CASE</small></button><button class="mode-card" data-action="start" data-mode="live"><span class="mode-number">02 / ROOM</span><span class="mode-icon">◉</span><strong>Live demo</strong><span>Ask the room, then reveal three pivotal handoffs together.</span><small>2–3 MIN · FACILITATOR</small></button><button class="mode-card" data-action="start" data-mode="practice"><span class="mode-number">03 / DEEPER</span><span class="mode-icon">▦</span><strong>Practice</strong><span>Explore a referral, a redirect, and a management data gap.</span><small>8–12 MIN · 3 CASES</small></button></div></section><section class="closing-strip"><span>THE PRINCIPLE</span><strong>Collect once. <i>Protect throughout.</i> Use many times.</strong></section>`;}
function renderIntro(){let c=currentCase(); app.innerHTML=`<section class="intro-panel"><div><p class="eyebrow">${state.mode.toUpperCase()} / CASE ${state.caseIndex+1}</p><h1 tabindex="-1">${esc(c.title)}</h1><p class="lead">${esc(c.intro)}</p><div class="role-pill">${esc(c.role)} <span>·</span> ${esc(c.eyebrow)}</div></div><div class="record-card"><div class="record-header"><span>SIMULATED CASE FILE</span><span>● FICTIONAL</span></div>${c.record.map(([k,v])=>`<div class="record-row"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div><div class="intro-footer"><button class="primary" data-action="begin">Begin the journey <span aria-hidden="true">→</span></button><button class="quiet" data-action="home">Back to modes</button></div></section>`;}
function journey(){let active=stages.indexOf(currentStep().stage);return `<ol class="journey" aria-label="Information journey">${stages.map((s,i)=>`<li class="${i<active?'done':i===active?'active':''}" ${i===active?'aria-current="step"':''}><span>${i<active?'✓':String(i+1).padStart(2,'0')}</span><strong>${s}</strong></li>`).join('')}</ol>`}
function indicator(){return `<div class="indicators" aria-label="Illustrative information consequences">${dimensions.map((d,i)=>`<div class="indicator"><span class="indicator-icon" aria-hidden="true">${icons[i]}</span><div><span>${d}</span><div class="meter" role="img" aria-label="${d}: ${state.metrics[i]} of 4 illustrative steps"><i class="level-${state.metrics[i]}"></i></div></div></div>`).join('')}</div>`}
function renderPlay(){let c=currentCase(),step=currentStep(),n=steps().length,live=state.mode==='live',selected=state.selected,chosen=selected!==null?step.options[selected]:null;
app.innerHTML=`<section class="game-shell"><div class="game-top"><button class="back-button" data-action="home" aria-label="Return to modes">← <span>Modes</span></button><div class="game-meta"><span>${live?'LIVE / ROOM':state.mode==='practice'?`PRACTICE / CASE ${state.caseIndex+1} OF 3`:'QUICK PLAY'}</span><strong>${esc(c.title)}</strong></div><button class="quiet restart" data-action="restart">Restart case ↺</button></div>${journey()}<div class="game-layout"><div class="question-panel"><div class="question-head"><span class="step-pill">${esc(step.stage.toUpperCase())} <b>·</b> ${state.stepIndex+1} / ${n}</span>${step.tag?`<span class="worked">${esc(step.tag)}</span>`:''}</div><h1 tabindex="-1">${esc(step.prompt)}</h1><p class="context">${esc(step.context)}</p>${live?`<p class="live-cue">Ask the room to vote before selecting a choice. Nothing is revealed until you press Reveal.</p>`:''}<div class="choices" role="group" aria-label="Choose an action">${step.options.map((o,i)=>`<button class="choice ${selected===i?'selected':''} ${state.revealed&&o.good?'correct':''}" data-action="choose" data-index="${i}" ${state.revealed?'disabled':''} aria-pressed="${selected===i}"><span class="choice-letter">${'ABC'[i]}</span><span>${esc(o.text)}</span><span class="choice-arrow" aria-hidden="true">${state.revealed&&o.good?'✓':'↗'}</span></button>`).join('')}</div>${!state.revealed?`<div class="choice-footer"><button class="hint-button" data-action="hint" aria-expanded="${state.hint}">${state.hint?'Hide hint':'Need a hint?'}</button>${live?`<button class="secondary" data-action="reveal">Reveal & discuss →</button>`:''}</div>${state.hint?`<p class="hint">${esc(step.hint)}</p>`:''}`:''}${state.revealed?`<div class="feedback ${chosen?.good?'positive':'reflective'}" role="status"><span class="feedback-label">${chosen?.good?'GOOD HANDOFF':'LET’S REPAIR THIS HANDOFF'}</span><p>${esc(chosen?.feedback||'')}</p>${!chosen?.good?`<p class="better"><strong>Better route:</strong> ${esc(step.options.find(o=>o.good).text)}</p>`:''}<div class="feedback-actions"><button class="primary" data-action="next">${state.stepIndex===n-1?'See case outcome': 'Continue journey'} <span aria-hidden="true">→</span></button>${!chosen?.good&&!live?`<button class="quiet" data-action="retry">Try this decision again</button>`:''}</div></div>`:''}</div><aside class="side-panel"><div class="side-title">THE CASE SO FAR <span>SIMULATED</span></div><div class="mini-record">${c.record.slice(0,3).map(([k,v])=>`<div><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>${indicator()}<p class="side-note">These indicators show the consequences of your choices. They are not an official maturity score.</p></aside></div></section>`;
if(state.revealed) requestAnimationFrame(()=>app.querySelector('.feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'}));}
function renderEnd(){let c=currentCase(),total=state.history.filter(h=>h.caseId===c.id).length,first=state.history.filter(h=>h.caseId===c.id&&h.good).length,all=state.mode==='practice'&&state.caseIndex===2;
app.innerHTML=`<section class="end-panel"><div class="end-emblem" aria-hidden="true">✓</div><p class="eyebrow">${all?'ALL THREE CASES COMPLETE':'THE LOOP RETURNS'}</p><h1 tabindex="-1">${all?'Information that returns can improve the next decision.':'The story made it back.'}</h1><p class="lead">${esc(c.debrief)}</p><div class="outcome-grid"><div><span>CASE</span><strong>${esc(c.title)}</strong></div><div><span>DECISIONS EXPLORED</span><strong>${total}</strong></div><div><span>FIRST CHOICES ALIGNED</span><strong>${first} / ${total}</strong></div></div><p class="end-note">This is practice feedback, not a grade or formal assessment. Each case is fictional.</p><div class="commitment"><span>30-DAY TRANSFER</span><h2>Which workflow will you improve, who owns it, and what will you measure?</h2><p>Take one handoff back to your team. Agree on a baseline, one accountable owner, and a date to review it.</p></div><div class="end-actions">${state.mode==='practice'&&state.caseIndex<2?`<button class="primary" data-action="next-case">Next case: ${esc(cases[state.caseIndex+1].title)} →</button>`:`<button class="primary" data-action="home">Choose another route ↗</button>`}<button class="secondary" data-action="replay">Replay this case ↺</button></div><p class="end-mantra">Collect once. <em>Protect throughout.</em> Use many times.</p></section>`;}
function start(mode){state={screen:'intro',mode,caseIndex:0,stepIndex:0,selected:null,revealed:false,hint:false,metrics:[2,2,2,2],history:[],completedCases:[],practiceIndex:0};render();focusHeading();}
function restart(){state.screen='intro';state.stepIndex=0;state.selected=null;state.revealed=false;state.hint=false;state.metrics=[2,2,2,2];state.history=state.history.filter(h=>h.caseId!==currentCase().id);render();focusHeading();}
function next(){let step=currentStep(),choice=step.options[state.selected];if(choice){state.history.push({caseId:currentCase().id,stage:step.stage,good:!!choice.good});state.metrics=state.metrics.map((v,i)=>Math.max(0,Math.min(4,v+choice.delta[i])));}state.stepIndex++;state.selected=null;state.revealed=false;state.hint=false;if(state.stepIndex>=steps().length){state.screen='end';saved.completed=[...new Set([...saved.completed,currentCase().id])];persist();}render();focusHeading();}
app.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const a=b.dataset.action;if(a==='start')start(b.dataset.mode);else if(a==='home'){state.screen='home';render();focusHeading()}else if(a==='begin'){state.screen='play';render();focusHeading()}else if(a==='restart'||a==='replay')restart();else if(a==='next-case'){state.caseIndex++;state.screen='intro';state.stepIndex=0;state.selected=null;state.metrics=[2,2,2,2];render();focusHeading()}else if(a==='hint'){state.hint=!state.hint;render();app.querySelector('.hint-button')?.focus()}else if(a==='retry'){state.selected=null;state.revealed=false;render();app.querySelector('.choice')?.focus()}else if(a==='choose'&&!state.revealed){state.selected=Number(b.dataset.index);if(state.mode!=='live')state.revealed=true;render();if(state.revealed)app.querySelector('.feedback .primary')?.focus();else app.querySelector(`.choice[data-index="${state.selected}"]`)?.focus()}else if(a==='reveal'){if(state.selected===null)state.selected=stepGoodIndex();state.revealed=true;render();app.querySelector('.feedback .primary')?.focus()}else if(a==='next')next()});
function stepGoodIndex(){return currentStep().options.findIndex(o=>o.good)}
async function openTeamQuest(){app.innerHTML='<section class="intro-panel"><div><p class="eyebrow">LIVE ROOM / TEAM QUEST</p><h1 tabindex="-1">Loading the room tools…</h1><p class="lead">Connecting to the session service.</p></div></section>';try{const {mountTeamQuest}=await import('./team-quest.js');await mountTeamQuest({root:app,onBack:()=>{state.screen='home';render();focusHeading()}})}catch(error){app.innerHTML=`<section class="intro-panel"><div><p class="eyebrow">TEAM QUEST UNAVAILABLE</p><h1 tabindex="-1">The live room could not load.</h1><p class="lead">${esc(error?.message||'Check the Supabase configuration and try again.')}</p><button class="quiet" data-action="home">Back to modes</button></div></section>`}}
app.addEventListener('click',e=>{const button=e.target.closest('button[data-action="team-quest"]');if(button?.dataset.action==='team-quest')openTeamQuest()});
document.querySelector('#aboutBtn').addEventListener('click',()=>{document.querySelector('#saveToggle').checked=saved.enabled;dialog.showModal()});
document.querySelector('#closeAbout').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.querySelector('#saveToggle').addEventListener('change',e=>{saved.enabled=e.target.checked;persist()});
document.querySelector('#resetProgress').addEventListener('click',()=>{saved.completed=[];persist();document.querySelector('#resetProgress').textContent='Progress reset'});
allowAnalytics?.addEventListener('click',()=>setAnalyticsConsent('accepted'));
declineAnalytics?.addEventListener('click',()=>setAnalyticsConsent('declined'));
analyticsSettings?.addEventListener('click',()=>{dialog.close();analyticsConsent='unknown';persistAnalyticsConsent();showAnalyticsBanner(true)});
if(analyticsConsent==='accepted')loadAnalytics();
else if(analyticsConsent==='unknown')showAnalyticsBanner(true);
render();
