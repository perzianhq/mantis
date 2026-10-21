/**
 * Intentionally unregistered held-out v2 material.
 *
 * This file is not imported by the development fixture adapter or its tests.
 * Its route templates and answer derivation are supplied only to the private
 * evaluation runner, so development code cannot enumerate or render them.
 */
import type { V2ReadingWorkflowDomain } from './fixtures-v2-reading-workflows-development.js';
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type HeldOutSlot = Readonly<{
  id: string;
  domain: V2ReadingWorkflowDomain;
  family: 'sticky-context' | 'reading-recovery' | 'review-submit' | 'workflow-recovery';
  structuralContract: string;
  seed: number;
  route: string;
  split: 'heldout';
  prompt: (base: string) => string;
  expected: { answer: string; terminalState: Record<string, unknown> };
  oracleId: string;
  nearMissId: string;
  check: FixtureCheck;
}>;

/** A terminal state from an earlier document cannot survive a navigation/reset. */
const settled = (events: FixtureObservation[]) => {
  const documentId = events.filter((event) => event.kind === 'load').at(-1)?.documentId;
  return documentId ? events.filter((event) => event.kind === 'settled' && event.documentId === documentId).at(-1) : undefined;
};
const check = (state: Record<string, unknown>): FixtureCheck => (events) => JSON.stringify(settled(events)?.fixtureState) === JSON.stringify(state);
const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();
/** Prompts ask for a code/receipt, so accept either that value or its descriptive UI label. */
const answerMatches = (answer: string, expected: string): boolean => {
  const value = normalize(answer);
  const labeled = normalize(expected);
  const code = labeled.split(':').at(-1)?.trim() ?? labeled;
  return value === labeled || value === code;
};

/** Private runners opt in to these routes; development code does not import this module. */
export const V2_READING_WORKFLOW_HELDOUT_CASES: readonly HeldOutSlot[] = Object.freeze([
  { id:'v2-heldout-reading-sticky-context', domain:'regions-reading', family:'sticky-context', structuralContract:'independently scrolling article with sticky section context and duplicate subsection labels', seed:320101, route:'/v2-heldout/reading/sticky-context', split:'heldout', prompt:b=>`Open ${b}/v2-heldout/reading/sticky-context. Scroll to the current subsection, confirm its code, and report only that code in your final answer.`, expected:{answer:'Context: Juniper-418',terminalState:{kind:'heldout-reading',family:'sticky-context',read:true}}, oracleId:'v2-heldout-reading-sticky-context-oracle',nearMissId:'v2-heldout-reading-sticky-context-unscrolled',check:check({kind:'heldout-reading',family:'sticky-context',read:true}) },
  { id:'v2-heldout-reading-recovery', domain:'regions-reading', family:'reading-recovery', structuralContract:'stale clipped excerpt replaced only after local source recovery', seed:320102, route:'/v2-heldout/reading/recovery', split:'heldout', prompt:b=>`Open ${b}/v2-heldout/reading/recovery. Recover the source, read it, and report only the recovered code in your final answer.`, expected:{answer:'Recovered source: Dune-502',terminalState:{kind:'heldout-reading',family:'reading-recovery',recovered:true}}, oracleId:'v2-heldout-reading-recovery-oracle',nearMissId:'v2-heldout-reading-recovery-stale',check:check({kind:'heldout-reading',family:'reading-recovery',recovered:true}) },
  { id:'v2-heldout-workflow-review-submit', domain:'long-workflows', family:'review-submit', structuralContract:'onboarding review acknowledgement with data validation before creation', seed:420201, route:'/v2-heldout/workflow/review-submit', split:'heldout', prompt:b=>`Open ${b}/v2-heldout/workflow/review-submit. Enter a workspace name, acknowledge the review, create it, and report only the receipt code in your final answer.`, expected:{answer:'Receipt: Ember-614',terminalState:{kind:'heldout-workflow',family:'review-submit',created:true,receipt:'Ember-614'}}, oracleId:'v2-heldout-workflow-review-submit-oracle',nearMissId:'v2-heldout-workflow-review-submit-unreviewed',check:check({kind:'heldout-workflow',family:'review-submit',created:true,receipt:'Ember-614'}) },
  { id:'v2-heldout-workflow-recovery', domain:'long-workflows', family:'workflow-recovery', structuralContract:'interrupted onboarding checkpoint restored before final review', seed:420202, route:'/v2-heldout/workflow/recovery', split:'heldout', prompt:b=>`Open ${b}/v2-heldout/workflow/recovery. Restore the checkpoint, review it, finish, and report only the receipt code in your final answer.`, expected:{answer:'Receipt: Fjord-733',terminalState:{kind:'heldout-workflow',family:'workflow-recovery',restored:true,reviewed:true,receipt:'Fjord-733'}}, oracleId:'v2-heldout-workflow-recovery-oracle',nearMissId:'v2-heldout-workflow-recovery-unreviewed',check:check({kind:'heldout-workflow',family:'workflow-recovery',restored:true,reviewed:true,receipt:'Fjord-733'}) },
]);
export const V2_READING_WORKFLOW_HELDOUT_CHECKS = V2_READING_WORKFLOW_HELDOUT_CASES.map(({ id, check: fixtureCheck }) => ({ id, taskId:id, check:fixtureCheck }));
export function gradeV2ReadingWorkflowHeldoutCase(caseId: string, answer: string, events: FixtureObservation[]): FixtureCheckResult { const item=V2_READING_WORKFLOW_HELDOUT_CASES.find(x=>x.id===caseId); if(!item)return {ok:false,details:'unknown held-out case'}; const result=item.check(events); const stateOk=typeof result==='boolean'?result:result.ok; return answerMatches(answer,item.expected.answer)&&stateOk?{ok:true}:{ok:false,details:'answer code or terminal state does not match held-out oracle'}; }

const heldOutHtml = (title: string, body: string) => `<!doctype html><title>${title}</title><main>${body}</main>`;
/** Kept outside the development router: only a private evaluator can register it. */
export function v2ReadingWorkflowHeldOutRoute(path: string): { body: string; type: string } | null {
  const item = V2_READING_WORKFLOW_HELDOUT_CASES.find((candidate) => candidate.route === path);
  if (!item) return null;
  const bodies: Record<HeldOutSlot['family'], string> = {
    'sticky-context': '<article style="height:180px;overflow:auto"><section><h2>Earlier subsection</h2><p>Context: Cinder-204</p><p style="height:440px">Scroll to the current subsection.</p></section><aside style="position:sticky;top:0;background:white;border-bottom:1px solid #777">Current section</aside><section><h2>Current subsection</h2><p>Context: Juniper-418</p><button id="read">Confirm current code</button><p id="out" role="status"></p></section></article><script>window.__fixtureState={kind:"heldout-reading",family:"sticky-context",read:false};read.onclick=()=>{window.__fixtureState={kind:"heldout-reading",family:"sticky-context",read:true};out.textContent="Current code confirmed: Juniper-418."}</script>',
    'reading-recovery': '<article><p id="excerpt">Clipped source excerpt</p><button id="recover">Recover local source</button></article><script>window.__fixtureState={kind:"heldout-reading",family:"reading-recovery",recovered:false};recover.onclick=()=>{excerpt.textContent="Recovered source: Dune-502";window.__fixtureState={kind:"heldout-reading",family:"reading-recovery",recovered:true}}</script>',
    'review-submit': '<form id="review"><label>Workspace name <input id="name" required></label><label><input id="ack" type="checkbox"> I reviewed the configuration</label><button>Create workspace</button></form><p id="receipt"></p><script>const form=document.querySelector("#review"),workspace=document.querySelector("#name"),acknowledged=document.querySelector("#ack"),receiptNode=document.querySelector("#receipt");window.__fixtureState={kind:"heldout-workflow",family:"review-submit",created:false};form.onsubmit=e=>{e.preventDefault();if(workspace.value&&acknowledged.checked){window.__fixtureState={kind:"heldout-workflow",family:"review-submit",created:true,receipt:"Ember-614"};receiptNode.textContent="Receipt: Ember-614"}}</script>',
    'workflow-recovery': '<section><p>Checkpoint is interrupted.</p><button id="restore">Restore checkpoint</button><button id="review" disabled>Review restored onboarding</button><button id="finish" disabled>Finish</button><p id="receipt"></p></section><script>let restored=false,reviewed=false;window.__fixtureState={kind:"heldout-workflow",family:"workflow-recovery",restored:false,reviewed:false,receipt:null};restore.onclick=()=>{restored=true;review.disabled=false};review.onclick=()=>{reviewed=restored;finish.disabled=!reviewed};finish.onclick=()=>{if(reviewed){window.__fixtureState={kind:"heldout-workflow",family:"workflow-recovery",restored:true,reviewed:true,receipt:"Fjord-733"};receipt.textContent="Receipt: Fjord-733"}}</script>',
  };
  return { body: heldOutHtml(`Held-out ${item.family}`, bodies[item.family]), type: 'text/html; charset=utf-8' };
}
