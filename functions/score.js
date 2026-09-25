const QUESTION_SECONDS=20;

function scoreAnswer({correct,now,startedAt,deadlineAt}){
 const responseMs=Math.max(0,now-startedAt);
 const remaining=Math.max(0,deadlineAt-now);
 const speedBonus=correct?Math.round(250*remaining/(QUESTION_SECONDS*1000)):0;
 return {correct,responseMs,score:correct?1000+speedBonus:0};
}

function rankRows(rows){return [...rows].sort((a,b)=>b.score-a.score||b.correct-a.correct||a.averageResponseMs-b.averageResponseMs)}

function buildScorecard(players){
 const individual=players.map(p=>({playerId:p.playerId,teamName:p.teamName||'',score:p.score||0,correct:p.correct||0,answered:p.answered||0,accuracy:p.answered?Math.round((p.correct||0)/p.answered*100):0,averageResponseMs:p.answered?Math.round((p.responseMs||0)/p.answered):0}));
 const byTeam={};
 for(const p of individual){const key=p.teamName||p.playerId;if(!byTeam[key])byTeam[key]={teamName:p.teamName||p.playerId,members:0,totalScore:0,totalCorrect:0,totalAnswered:0,totalResponseMs:0};const t=byTeam[key];t.members++;t.totalScore+=p.score;t.totalCorrect+=p.correct;t.totalAnswered+=p.answered;t.totalResponseMs+=p.averageResponseMs}
 const teams=Object.values(byTeam).map(t=>({...t,score:Math.round(t.totalScore/t.members),correct:t.totalCorrect,accuracy:t.totalAnswered?Math.round(t.totalCorrect/t.totalAnswered*100):0,averageResponseMs:t.members?Math.round(t.totalResponseMs/t.members):0}));
 return {individual:rankRows(individual),teams:rankRows(teams),completedAt:Date.now(),note:'Educational feedback only; not a clinical, compliance, or LHS maturity score.'};
}

module.exports={scoreAnswer,buildScorecard,rankRows};
