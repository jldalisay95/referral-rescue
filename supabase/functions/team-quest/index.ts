import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVER_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SECRET_KEY')!;
const QUESTION_SECONDS = 20;
const SESSION_HOURS = 24;
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const coreIds = [
  ['ana-capture','ana-check','ana-protect','ana-exchange','ana-return','ana-use'],
  ['redirect-capture','redirect-check','redirect-protect','redirect-exchange','redirect-return','redirect-use'],
  ['manager-capture','manager-check','manager-protect','manager-exchange','manager-return','manager-use']
];
const synthesisIds = ['synthesis-identity','synthesis-minimum','synthesis-governed','synthesis-ack','synthesis-return','synthesis-use'];
const keys:Record<string,{correctIndex:number;explanation:string}>= {
  'ana-capture':{correctIndex:0,explanation:'Verify the right record while context is available, then make a traceable correction.'},
  'ana-check':{correctIndex:2,explanation:'A concise, purposeful referral gives the next team enough context to act.'},
  'ana-protect':{correctIndex:1,explanation:'Use an accountable route with access limited to people responsible for the handoff.'},
  'ana-exchange':{correctIndex:1,explanation:'Sending is different from receiving and acting; acknowledgment gives the origin a known state.'},
  'ana-return':{correctIndex:1,explanation:'The originating team needs the outcome and next responsibility to continue the journey.'},
  'ana-use':{correctIndex:1,explanation:'Turn routine aggregate data into a specific workflow improvement and a measure.'},
  'redirect-capture':{correctIndex:0,explanation:'Agree on meaning before routing so the next team can understand the request.'},
  'redirect-check':{correctIndex:2,explanation:'Send the relevant minimum needed for the receiving team to act.'},
  'redirect-protect':{correctIndex:1,explanation:'A documented backup role supports continuity with controlled access.'},
  'redirect-exchange':{correctIndex:1,explanation:'A redirect is useful when the new route and responsibility remain visible.'},
  'redirect-return':{correctIndex:1,explanation:'The originating team needs enough status to coordinate the next step.'},
  'redirect-use':{correctIndex:1,explanation:'Use aggregate patterns to form a testable operational question before assigning blame.'},
  'manager-capture':{correctIndex:0,explanation:'Locate the capture gap before choosing which source to trust.'},
  'manager-check':{correctIndex:0,explanation:'Comparable definitions and denominators are needed before interpreting a difference.'},
  'manager-protect':{correctIndex:1,explanation:'Investigate gaps with the least identifiable detail and the right access.'},
  'manager-exchange':{correctIndex:1,explanation:'A useful management handoff makes the measure, period, responsibility, and action visible.'},
  'manager-return':{correctIndex:1,explanation:'Feedback should give staff a repair process, owner, and way to see whether it worked.'},
  'manager-use':{correctIndex:1,explanation:'A repeated measure with a denominator shows whether capture improves and where exceptions remain.'},
  'synthesis-identity':{correctIndex:0,explanation:'Reliable identity comes before purposeful, minimum-necessary exchange.'},
  'synthesis-minimum':{correctIndex:0,explanation:'Use the relevant minimum that lets the next team act and respond.'},
  'synthesis-governed':{correctIndex:1,explanation:'Accountability connects protection with a known recipient and a visible next action.'},
  'synthesis-ack':{correctIndex:0,explanation:'Acknowledgment confirms a handoff state; it does not by itself mean the journey is complete.'},
  'synthesis-return':{correctIndex:1,explanation:'The loop returns useful action, not merely a copy or an aggregate headline.'},
  'synthesis-use':{correctIndex:1,explanation:'Management use connects a trustworthy measure to an owner, action, and review.'}
};
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json'}});
const bad=(message:string,status=400)=>json({error:message},status);
const shuffle=(values:string[])=>[...values].sort(()=>Math.random()-.5);
function selectQuestions(length:number){
  if(length===6)return shuffle(coreIds.flatMap(group=>shuffle(group).slice(0,2)));
  if(length===12)return shuffle([...coreIds.flatMap(group=>shuffle(group).slice(0,2)),...synthesisIds]);
  return shuffle([...coreIds.flatMap(group=>shuffle(group).slice(0,4)),...synthesisIds]);
}
function scoreAnswer(correct:boolean,now:number,startedAt:number,deadlineAt:number){
  const responseMs=Math.max(0,now-startedAt);
  const remaining=Math.max(0,deadlineAt-now);
  const speedBonus=correct?Math.round(250*remaining/(QUESTION_SECONDS*1000)):0;
  return {correct,responseMs,score:correct?1000+speedBonus:0};
}
function rank<T extends {score:number;correct:number;averageResponseMs:number}>(rows:T[]){return [...rows].sort((a,b)=>b.score-a.score||b.correct-a.correct||a.averageResponseMs-b.averageResponseMs)}
function playerSummary(row:any){return {playerId:row.player_id,teamName:row.team_name||'',score:row.score||0,correct:row.correct||0,answered:row.answered||0,accuracy:row.answered?Math.round(row.correct/row.answered*100):0,averageResponseMs:row.answered?Math.round(row.response_ms/row.answered):0,participation:row.answered||0};}
function makeScorecard(rows:any[]){
  const individual=rank(rows.map(playerSummary));
  const teams:Record<string,any>={};
  for(const row of individual){const key=row.teamName||row.playerId;teams[key]??={teamName:row.teamName||row.playerId,members:0,totalScore:0,totalCorrect:0,totalAnswered:0,totalResponseMs:0,participation:0};const team=teams[key];team.members++;team.totalScore+=row.score;team.totalCorrect+=row.correct;team.totalAnswered+=row.answered;team.totalResponseMs+=row.averageResponseMs*row.answered;team.participation+=row.answered?1:0;}
  const teamRows=Object.values(teams).map(team=>({...team,score:Math.round(team.totalScore/team.members),correct:team.totalCorrect,accuracy:team.totalAnswered?Math.round(team.totalCorrect/team.totalAnswered*100):0,averageResponseMs:team.totalAnswered?Math.round(team.totalResponseMs/team.totalAnswered):0}));
  const totalAnswered=individual.reduce((sum,row)=>sum+row.answered,0);
  const accuracy=totalAnswered?individual.reduce((sum,row)=>sum+row.correct,0)/totalAnswered:0;
  const status=accuracy>=.8?'Strong signal':accuracy>=.5?'Building':'Practice opportunity';
  return {individual,teams:rank(teamRows),indicators:['Continuity','Data quality','Privacy','Local usefulness'].map(label=>({label,status})),completedAt:new Date().toISOString(),note:'Educational feedback only; not a clinical, compliance, or LHS maturity score.'};
}
function publicSession(session:any,players:any[]){return {id:session.id,roomCode:session.room_code,mode:session.mode,questionIds:session.question_ids,currentIndex:session.current_index,status:session.status,questionStartedAt:session.question_started_at,questionDeadlineAt:session.deadline_at,reveal:session.status==='reveal'?session.reveal:null,players:players.map(row=>({playerId:row.player_id,teamName:row.team_name||'',score:row.score||0,correct:row.correct||0,answered:row.answered||0}))};}
function roomCode(){let result='';for(let i=0;i<6;i++)result+=alphabet[Math.floor(Math.random()*alphabet.length)];return result;}
async function uniqueRoom(admin:any){for(let i=0;i<10;i++){const code=roomCode();const {data}=await admin.from('team_sessions').select('id').eq('room_code',code).maybeSingle();if(!data)return code;}throw new Error('Could not allocate a room code.');}
async function playerLabel(admin:any,sessionId:string){for(let i=0;i<20;i++){const label=`Player-${Math.floor(1000+Math.random()*9000)}`;const {data}=await admin.from('team_players').select('user_id').eq('session_id',sessionId).eq('player_id',label).maybeSingle();if(!data)return label;}throw new Error('Could not allocate a player label.');}
async function loadSession(admin:any,sessionId:string){const {data,error}=await admin.from('team_sessions').select('*').eq('id',sessionId).maybeSingle();if(error)throw error;if(!data||new Date(data.expires_at).getTime()<=Date.now())return null;return data;}
async function loadPlayers(admin:any,sessionId:string){const {data,error}=await admin.from('team_players').select('*').eq('session_id',sessionId).order('joined_at');if(error)throw error;return data||[];}
async function requireMember(admin:any,sessionId:string,userId:string){const session=await loadSession(admin,sessionId);if(!session)throw new Error('This room has expired or does not exist.');const host=session.host_id===userId;const {data:player}=await admin.from('team_players').select('*').eq('session_id',sessionId).eq('user_id',userId).maybeSingle();if(!host&&!player)throw new Error('You are not a member of this room.');return {session,player,host};}
async function finalise(admin:any,session:any){const existing=await admin.from('team_scorecards').select('scorecard').eq('session_id',session.id).maybeSingle();if(existing.data?.scorecard)return existing.data.scorecard;const players=await loadPlayers(admin,session.id);const scorecard=makeScorecard(players);const {error:cardError}=await admin.from('team_scorecards').upsert({session_id:session.id,scorecard,completed_at:new Date().toISOString()});if(cardError)throw cardError;const {error:updateError}=await admin.from('team_sessions').update({status:'complete',reveal:null}).eq('id',session.id);if(updateError)throw updateError;return scorecard;}

Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response('ok',{headers});
  try{
    const authHeader=request.headers.get('Authorization')||'';if(!authHeader.startsWith('Bearer '))return bad('Authentication is required.',401);
    const token=authHeader.slice(7);
    const authClient=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    const {data:{user},error:userError}=await authClient.auth.getUser(token);if(userError||!user)return bad('Authentication is required.',401);
    const admin=createClient(SUPABASE_URL,SUPABASE_SERVER_KEY);
    const body=await request.json();const action=body.action;
    if(action==='create'){
      const mode=body.mode==='team'?'team':'individual';const length=[6,12,18].includes(Number(body.length))?Number(body.length):6;
      const {data:configRow,error:configError}=await admin.from('team_quest_config').select('*').eq('id',true).single();if(configError)throw configError;
      if(!configRow.enabled)throw new Error('Team Quest is temporarily disabled while the service quota is protected.');
      const {count:active}=await admin.from('team_sessions').select('id',{count:'exact',head:true}).in('status',['lobby','active','reveal']).gt('expires_at',new Date().toISOString());if((active||0)>=configRow.max_active_sessions)throw new Error('Team Quest is temporarily full while the service quota is protected.');
      const since=new Date(Date.now()-24*60*60*1000).toISOString();const {count:recent}=await admin.from('team_sessions').select('id',{count:'exact',head:true}).gt('created_at',since);if((recent||0)>=configRow.max_sessions_24h)throw new Error('Team Quest is temporarily disabled while the daily service quota is protected.');
      const {data:session,error}=await admin.from('team_sessions').insert({room_code:await uniqueRoom(admin),host_id:user.id,mode,question_ids:selectQuestions(length)}).select('*').single();if(error)throw error;
      return json({sessionId:session.id,mode});
    }
    const sessionId=body.sessionId;
    if(action==='join'){
      const code=String(body.roomCode||'').trim().toUpperCase();const {data:session,error}=await admin.from('team_sessions').select('*').eq('room_code',code).maybeSingle();if(error)throw error;if(!session||new Date(session.expires_at).getTime()<=Date.now())throw new Error('This room has expired or does not exist.');if(session.status!=='lobby')throw new Error('This room has already started.');
      const existing=await admin.from('team_players').select('player_id,team_name').eq('session_id',session.id).eq('user_id',user.id).maybeSingle();if(existing.data)return json({sessionId:session.id,mode:session.mode,playerId:existing.data.player_id});
      const teamName=session.mode==='team'?String(body.teamName||'').trim().slice(0,32):'';const {data:player,error:playerError}=await admin.from('team_players').insert({session_id:session.id,user_id:user.id,player_id:await playerLabel(admin,session.id),team_name:teamName}).select('player_id').single();if(playerError)throw playerError;return json({sessionId:session.id,mode:session.mode,playerId:player.player_id});
    }
    if(!sessionId)throw new Error('A session is required.');
    const membership=await requireMember(admin,sessionId,user.id);const session=membership.session;
    if(action==='get'){
      const players=await loadPlayers(admin,sessionId);const {data:score}=await admin.from('team_scorecards').select('scorecard').eq('session_id',sessionId).maybeSingle();const {data:answers}=await admin.from('team_answers').select('question_id').eq('session_id',sessionId).eq('user_id',user.id);return json({session:publicSession(session,players),scorecard:score?.scorecard||null,playerId:membership.player?.player_id||null,answeredQuestionIds:(answers||[]).map((row:any)=>row.question_id)});
    }
    if(!membership.host&&action!=='submit')throw new Error('Only the host can control this room.');
    if(action==='start'){
      if(session.status!=='lobby')throw new Error('The room is not in the lobby.');const now=new Date();const {error}=await admin.from('team_sessions').update({status:'active',question_started_at:now.toISOString(),deadline_at:new Date(now.getTime()+QUESTION_SECONDS*1000).toISOString()}).eq('id',sessionId);if(error)throw error;return json({ok:true});
    }
    if(action==='reveal'){
      if(session.status!=='active')throw new Error('The question is not active.');const id=session.question_ids[session.current_index];const key=keys[id];const {error}=await admin.from('team_sessions').update({status:'reveal',reveal:{correctIndex:key.correctIndex,explanation:key.explanation}}).eq('id',sessionId);if(error)throw error;return json({ok:true});
    }
    if(action==='next'){
      if(session.status!=='reveal')throw new Error('Reveal the answer before advancing.');if(session.current_index>=session.question_ids.length-1){const scorecard=await finalise(admin,session);return json({scorecard});}const now=new Date();const {error}=await admin.from('team_sessions').update({status:'active',current_index:session.current_index+1,question_started_at:now.toISOString(),deadline_at:new Date(now.getTime()+QUESTION_SECONDS*1000).toISOString(),reveal:null}).eq('id',sessionId);if(error)throw error;return json({ok:true});
    }
    if(action==='end'){const scorecard=await finalise(admin,session);return json({scorecard});}
    if(action==='submit'){
      if(!membership.player)throw new Error('Join the room before answering.');if(session.status!=='active')throw new Error('Answers are locked until the next question.');const id=session.question_ids[session.current_index];const selected=Number(body.optionIndex);if(!Number.isInteger(selected)||selected<0||selected>2)throw new Error('That answer is not valid.');const now=Date.now();const started=Date.parse(session.question_started_at);const deadline=Date.parse(session.deadline_at);if(now>deadline)throw new Error('Time is up; your answer was not recorded.');const result=scoreAnswer(keys[id].correctIndex===selected,now,started,deadline);const {error:answerError}=await admin.from('team_answers').insert({session_id:sessionId,question_id:id,user_id:user.id,option_index:selected,answered_at:new Date(now).toISOString(),...result});if(answerError?.code==='23505')throw new Error('You already answered this question.');if(answerError)throw answerError;const {error:updateError}=await admin.from('team_players').update({score:membership.player.score+result.score,correct:membership.player.correct+(result.correct?1:0),answered:membership.player.answered+1,response_ms:membership.player.response_ms+result.responseMs}).eq('session_id',sessionId).eq('user_id',user.id);if(updateError)throw updateError;return json({ok:true,score:result.score});
    }
    throw new Error('Unknown Team Quest action.');
  }catch(error){return bad(error instanceof Error?error.message:'Team Quest request failed.',400)}
});
