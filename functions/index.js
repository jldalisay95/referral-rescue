const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {onSchedule}=require('firebase-functions/v2/scheduler');
const admin=require('firebase-admin');
const keys=require('./question-keys');
const {scoreAnswer,buildScorecard}=require('./score');

admin.initializeApp();
const db=admin.database();
const ROOM_TTL_MS=24*60*60*1000;
const QUESTION_SECONDS=20;
const lengths=new Set([6,12,18]);
const modes=new Set(['individual','team']);

function requireUser(request){if(!request.auth?.uid)throw new HttpsError('unauthenticated','Anonymous sign-in is required.');return request.auth.uid}
function cleanCode(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)}
function cleanTeam(value){return String(value||'').trim().replace(/[^\w .-]/g,'').slice(0,32)}
async function getSession(sessionId){const snap=await db.ref(`sessions/${sessionId}`).once('value');const session=snap.val();if(!session||session.expiresAt<Date.now())throw new HttpsError('not-found','This session has expired or does not exist.');return session}
function requireHost(session,uid){if(session.hostUid!==uid)throw new HttpsError('permission-denied','Only the host can control this session.')}
function makeCode(){return Math.random().toString(36).slice(2,8).toUpperCase()}
async function uniqueCode(){for(let i=0;i<8;i++){const code=makeCode();if(!(await db.ref(`sessions/${code}`).once('value')).exists())return code}throw new HttpsError('resource-exhausted','Could not create a room code. Try again.')}

exports.createSession=onCall(async request=>{
 const uid=requireUser(request);const mode=String(request.data?.mode||'');const questionIds=Array.isArray(request.data?.questionIds)?request.data.questionIds:[];const length=Number(request.data?.length);
 if(!modes.has(mode)||!lengths.has(length)||questionIds.length!==length||questionIds.some(id=>!keys[id]))throw new HttpsError('invalid-argument','Invalid session configuration.');
 const sessionId=await uniqueCode();const now=Date.now();
 await db.ref(`sessions/${sessionId}`).set({hostUid:uid,mode,questionIds,status:'lobby',currentIndex:-1,questionStartedAt:null,questionDeadlineAt:null,createdAt:now,expiresAt:now+ROOM_TTL_MS,players:{}});
 return {sessionId,expiresAt:now+ROOM_TTL_MS};
});

exports.joinSession=onCall(async request=>{
 const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const session=await getSession(sessionId);
 if(session.status!=='lobby')throw new HttpsError('failed-precondition','This session is no longer accepting players.');
 const playerId=`Player-${uid.slice(0,4).toUpperCase()}`;const teamName=session.mode==='team'?cleanTeam(request.data?.teamName):'';
 await db.ref(`sessions/${sessionId}/players/${uid}`).set({playerId,teamName,joinedAt:Date.now(),score:0,correct:0,answered:0,responseMs:0,indicators:[0,0,0,0]});
 return {sessionId,playerId,mode:session.mode};
});

exports.startSession=onCall(async request=>{
 const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const session=await getSession(sessionId);requireHost(session,uid);
 if(session.status!=='lobby')throw new HttpsError('failed-precondition','The session has already started.');
 const now=Date.now();await db.ref(`sessions/${sessionId}`).update({status:'question',currentIndex:0,questionStartedAt:now,questionDeadlineAt:now+QUESTION_SECONDS*1000,reveal:null});return {ok:true};
});

exports.submitAnswer=onCall(async request=>{
 const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const optionIndex=Number(request.data?.optionIndex);const session=await getSession(sessionId);
 if(session.status!=='question'||!Number.isInteger(optionIndex)||optionIndex<0||optionIndex>2)throw new HttpsError('invalid-argument','This answer is not valid now.');
 const player=session.players?.[uid];if(!player)throw new HttpsError('permission-denied','Join the session before answering.');
 const questionId=session.questionIds[session.currentIndex];const answerRef=db.ref(`sessions/${sessionId}/answers/${questionId}/${uid}`);if((await answerRef.once('value')).exists())throw new HttpsError('already-exists','Only one answer is allowed.');
 const now=Date.now();if(now>session.questionDeadlineAt)throw new HttpsError('deadline-exceeded','The answer window has closed.');
 const key=keys[questionId];const scored=scoreAnswer({correct:optionIndex===key.correctIndex,now,startedAt:session.questionStartedAt,deadlineAt:session.questionDeadlineAt});const {correct,responseMs,score}=scored;
 await answerRef.set({optionIndex,answeredAt:now,correct,score,responseMs});
 await db.ref(`sessions/${sessionId}/players/${uid}`).transaction(value=>{if(!value)return value;value.score=(value.score||0)+score;value.correct=(value.correct||0)+(correct?1:0);value.answered=(value.answered||0)+1;value.responseMs=(value.responseMs||0)+responseMs;return value});
 return {accepted:true,correct,score,responseMs};
});

exports.revealQuestion=onCall(async request=>{
 const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const session=await getSession(sessionId);requireHost(session,uid);if(session.status!=='question')throw new HttpsError('failed-precondition','There is no active question to reveal.');
 const questionId=session.questionIds[session.currentIndex];await db.ref(`sessions/${sessionId}`).update({status:'reveal',reveal:{questionId,correctIndex:keys[questionId].correctIndex,explanation:keys[questionId].explanation}});return {ok:true};
});

async function finalize(sessionId,session){
 const scorecard=buildScorecard(Object.values(session.players||{}));
 await db.ref(`sessions/${sessionId}`).update({status:'complete',scorecard,reveal:null});return scorecard;
}

exports.nextQuestion=onCall(async request=>{
 const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const session=await getSession(sessionId);requireHost(session,uid);if(session.status!=='reveal')throw new HttpsError('failed-precondition','Reveal the current answer first.');
 if(session.currentIndex>=session.questionIds.length-1){await finalize(sessionId,session);return {complete:true}}
 const now=Date.now();await db.ref(`sessions/${sessionId}`).update({status:'question',currentIndex:session.currentIndex+1,questionStartedAt:now,questionDeadlineAt:now+QUESTION_SECONDS*1000,reveal:null});return {complete:false};
});

exports.endSession=onCall(async request=>{const uid=requireUser(request);const sessionId=cleanCode(request.data?.sessionId);const session=await getSession(sessionId);requireHost(session,uid);return finalize(sessionId,session)});

exports.cleanupExpiredSessions=onSchedule('every 1 hours',async()=>{const snap=await db.ref('sessions').once('value');const sessions=snap.val()||{};const updates={};for(const [id,session] of Object.entries(sessions)){if(session.expiresAt<Date.now())updates[id]=null}if(Object.keys(updates).length)await db.ref('sessions').update(updates)});
