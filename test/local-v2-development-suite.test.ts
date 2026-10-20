import { expect, it } from 'vitest';
import { startFixtures } from '../bench/fixtures.js';
import { LOCAL_V2_DEVELOPMENT_CHECKS, LOCAL_V2_DEVELOPMENT_MANIFEST, LOCAL_V2_DEVELOPMENT_SUITE, LOCAL_V2_DEVELOPMENT_TASKS, gradeLocalV2DevelopmentCase, localV2DevelopmentRoute, localV2FinalAnswer } from '../bench/agent/local-v2-development.js';
import { PILOT, TASKS } from '../bench/agent/tasks.js';
import { assertCompatibleResume, classifyAttempt, makeMetadata } from '../bench/agent/integrity.js';
import { COMPLETION_GUIDANCE, EXPLICIT_ACTION_GUIDANCE } from '../bench/agent/guidance.js';

it('selects exactly the frozen 32-case local-v2 development suite', () => {
  expect(LOCAL_V2_DEVELOPMENT_SUITE).toBe('local-v2-development');
  expect(LOCAL_V2_DEVELOPMENT_TASKS).toHaveLength(32);
  expect(LOCAL_V2_DEVELOPMENT_CHECKS).toHaveLength(32);
  expect(new Set(LOCAL_V2_DEVELOPMENT_TASKS.map((task) => task.id)).size).toBe(32);
  expect(Object.fromEntries([...new Set(LOCAL_V2_DEVELOPMENT_MANIFEST.map((entry) => entry.domain))].map((domain) => [domain, LOCAL_V2_DEVELOPMENT_MANIFEST.filter((entry) => entry.domain === domain).length]))).toEqual({
    'dense-tables':4,'lists-scrolling':4,'charts-canvas-images':4,'forms-embedded-controls':4,'overlays-shadow-dom':4,'spa-navigation-recovery':4,'regions-reading':4,'long-workflows':4,
  });
  expect(LOCAL_V2_DEVELOPMENT_MANIFEST.some((entry) => entry.id.includes('heldout'))).toBe(false);
  expect(LOCAL_V2_DEVELOPMENT_MANIFEST.every((entry) => entry.oracleId.length > 0 && entry.nearMissId.length > 0)).toBe(true);
});

it('leaves legacy v1 task and pilot selectors unchanged', () => {
  expect(TASKS.some((task) => task.id.startsWith('v2-'))).toBe(false);
  expect(PILOT.every((id) => TASKS.some((task) => task.id === id))).toBe(true);
});

it('grades only the explicit local-v2 ANSWER line', () => {
  expect(localV2FinalAnswer('I completed the task.\nANSWER: Project renamed to Aurora.')).toBe('Project renamed to Aurora.');
  expect(localV2FinalAnswer('ANSWER: First\nANSWER: Final')).toBe('Final');
});

it('makes virtual-list response fields unambiguous', () => {
  const task = LOCAL_V2_DEVELOPMENT_TASKS.find((entry) => entry.id === 'v2-list-virtual-target')!;
  expect(task.prompt('http://fixture')).toContain('only the post-click confirmation text');
  expect(task.prompt('http://fixture')).toContain('Do not copy row text into the confirmation');
});

it('keeps explicit-action and completion guidance generic and requires reading submission through the UI', () => {
  expect(EXPLICIT_ACTION_GUIDANCE).toContain('Perform explicitly requested UI actions');
  expect(COMPLETION_GUIDANCE).toBe('Once every requested action and constraint is verified and the required answer is available, return the final answer.');
  expect(COMPLETION_GUIDANCE).not.toMatch(/stop|skip|early/i);
  const reading = LOCAL_V2_DEVELOPMENT_TASKS.find((entry) => entry.id === 'v2-reading-landmark-jump')!;
  expect(reading.prompt('http://fixture')).toContain("Enter the requested text into 'Final submission'");
  expect(reading.prompt('http://fixture')).toContain("click 'Submit answer'");
  expect(reading.prompt('http://fixture')).toContain('verify the confirmation, then reply ANSWER');
});

it('requires explicit opt-in for v2 routes and uses exact answer-plus-state grading', async () => {
  const plain = await startFixtures();
  try { expect((await fetch(`${plain.base}/v2/table/sort`)).status).toBe(404); } finally { await plain.close(); }
  const opted = await startFixtures({ checks: LOCAL_V2_DEVELOPMENT_CHECKS, developmentRoute: localV2DevelopmentRoute });
  try { expect((await fetch(`${opted.base}/v2/table/sort`)).status).toBe(200); } finally { await opted.close(); }
  const task = LOCAL_V2_DEVELOPMENT_TASKS[0]!;
  expect(gradeLocalV2DevelopmentCase(task.id, 'wrong', []).pass).toBe(false);
});

it('runs a no-paid end-to-end verified v2 result through exact grading, classification, serialization, and resume isolation', async () => {
  const task = LOCAL_V2_DEVELOPMENT_TASKS.find((entry) => entry.id === 'v2-interaction-form-combobox')!;
  const fixtures = await startFixtures({ checks: LOCAL_V2_DEVELOPMENT_CHECKS, developmentRoute: localV2DevelopmentRoute });
  try {
    const attempt = 'v2-e2e-correct'; fixtures.baseFor(task.id, attempt);
    const event = { kind:'settled', path:'/v2-interaction/forms/combobox', documentId:'e2e', arrival:0, target:{tag:'button',id:'assign',name:'',type:'',ariaLabel:'',text:'Assign',href:'',value:'',checked:false}, controls:{}, text:'West Ridge assigned.', fixtureState:{region:'West Ridge',assigned:true} };
    await fetch(`${fixtures.base}/__verify/${attempt}`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(event) });
    const verified = await fixtures.verify(task.id, attempt);
    const grade = gradeLocalV2DevelopmentCase(task.id, 'West Ridge assigned.', verified!.provenance.events);
    expect(grade.pass).toBe(true); expect(grade.requirements).toEqual([]);
    expect(classifyAttempt({ sawInit:true,connected:true,sawResult:true,resultError:false,timedOut:false,launchError:null,exitCode:0,answerMatches:grade.pass,hasFixtureCheck:true,fixtureOk:verified!.ok })).toBe('success');
    expect(JSON.parse(JSON.stringify({ task:task.id, answerGrade:grade, verification:verified!.ok })).answerGrade.requirements).toEqual([]);
    const v1 = makeMetadata({ provider:'codex',fixtureSeed:null,tasks:['login'],approaches:['mantis'],runs:1,model:'x',reasoning:'low',timeoutMs:1,concurrency:1,sarvamMaxTokens:null,toolRestrictions:{},runtime:{nodeVersion:'x',platform:'x',arch:'x'},environment:{},browserPaths:{} }, {}, 'x');
    const v2 = makeMetadata({ provider:'codex',fixtureSeed:null,tasks:LOCAL_V2_DEVELOPMENT_TASKS.map((entry)=>entry.id),approaches:['mantis'],runs:1,model:'x',reasoning:'low',timeoutMs:1,concurrency:1,sarvamMaxTokens:null,toolRestrictions:{suite:'local-v2-development'},runtime:{nodeVersion:'x',platform:'x',arch:'x'},environment:{},browserPaths:{} }, {}, 'x');
    expect(() => assertCompatibleResume({metadata:v1,results:[]},v2)).toThrow(/fingerprint differs/);
  } finally { await fixtures.close(); }
});
