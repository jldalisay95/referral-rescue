import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {scoreAnswer,buildScorecard,rankRows} from '../functions/score.js';
import {questQuestions} from '../quest-bank.js';
const require=createRequire(import.meta.url);
const keys=require('../functions/question-keys.js');

assert.deepEqual(scoreAnswer({correct:true,now:1000,startedAt:0,deadlineAt:20000}),{correct:true,responseMs:1000,score:1238});
assert.deepEqual(scoreAnswer({correct:true,now:20000,startedAt:0,deadlineAt:20000}),{correct:true,responseMs:20000,score:1000});
assert.deepEqual(scoreAnswer({correct:false,now:1000,startedAt:0,deadlineAt:20000}),{correct:false,responseMs:1000,score:0});
assert.deepEqual(rankRows([{score:1000,correct:1,averageResponseMs:900},{score:1000,correct:1,averageResponseMs:700}]).map(row=>row.averageResponseMs),[700,900]);
const card=buildScorecard([
 {playerId:'Player-A',teamName:'Green',score:1200,correct:1,answered:1,responseMs:1000},
 {playerId:'Player-B',teamName:'Green',score:800,correct:0,answered:1,responseMs:2000},
 {playerId:'Player-C',teamName:'Blue',score:1000,correct:1,answered:1,responseMs:1500}
]);
assert.equal(card.teams.find(team=>team.teamName==='Green').score,1000);
assert.equal(card.teams.find(team=>team.teamName==='Green').accuracy,50);
assert.equal(card.individual[0].playerId,'Player-A');
assert.ok(questQuestions.every(question=>keys[question.id]&&keys[question.id].correctIndex>=0&&keys[question.id].correctIndex<question.options.length));
assert.ok(new Set(Object.values(keys).map(key=>key.correctIndex)).size>1);
console.log('Validated score formula, tie-breaker, individual ranking, and team averaging.');
