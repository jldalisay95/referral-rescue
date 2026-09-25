import {cases} from '../scenarios.js';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {questQuestions,selectQuestQuestions} from '../quest-bank.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(html,/googletagmanager\.com/);
assert.match(html,/google-analytics\.com/);
assert.doesNotMatch(html,/<script[^>]+googletagmanager/);
assert.equal(questQuestions.length,24);
assert.equal(questQuestions.filter(q=>q.caseId==='synthesis').length,6);
assert.equal(questQuestions.filter(q=>['ana','redirect','manager'].includes(q.caseId)).length,18);
assert.ok(questQuestions.every(q=>q.id&&q.prompt&&q.options.length===3&&!('correctIndex' in q)));
for(const length of [6,12,18])assert.equal(selectQuestQuestions(length).length,length);
assert.equal(cases.length,3);
for(const c of cases){
 assert.ok(c.id&&c.title&&c.role&&c.intro&&c.debrief);
 assert.equal(c.steps.length,6,`${c.id} step count`);
 assert.deepEqual(c.steps.map(s=>s.stage),['Capture','Check','Protect','Exchange','Return','Use']);
 for(const s of c.steps){
  assert.ok(s.prompt&&s.context&&s.hint&&s.sources?.length);
  assert.equal(s.options.length,3);
  assert.ok(s.options.some(o=>o.good),`${c.id}/${s.stage} missing preferred choice`);
  for(const o of s.options){assert.ok(o.text&&o.feedback);assert.equal(o.delta.length,4);for(const d of o.delta)assert.ok(Number.isInteger(d)&&d>=-2&&d<=2)}
 }
}
console.log('Validated 3 cases, 18 decision nodes, 54 choices.');
