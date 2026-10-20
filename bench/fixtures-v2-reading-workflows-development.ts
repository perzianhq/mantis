/**
 * Isolated v2 reading and workflow fixtures.  This file deliberately has no
 * import from the fixture server: registering it is a later, explicit runner
 * decision, not an accidental expansion of the local-v1 benchmark.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type V2ReadingWorkflowDomain = 'regions-reading' | 'long-workflows';
export type V2ReadingWorkflowFamily =
  | 'landmark-jump' | 'deep-fact' | 'cross-region' | 'collapsed-context'
  | 'multi-step-order' | 'cross-page-compare' | 'save-resume' | 'conditional-branch';

export interface V2ReadingWorkflowExpected {
  /** One exact submission, including its source label. */
  answer: string;
  /** Full final workflow/reading state, including required prior transitions. */
  terminalState: Record<string, unknown>;
}

export interface V2ReadingWorkflowCase {
  id: string;
  domain: V2ReadingWorkflowDomain;
  family: V2ReadingWorkflowFamily;
  structuralVariant: string;
  seed: number;
  split: 'development';
  route: string;
  prompt: (base: string) => string;
  expected: V2ReadingWorkflowExpected;
  oracleId: string;
  nearMissId: string;
  check: FixtureCheck;
}

const settled = (events: FixtureObservation[]): FixtureObservation | undefined => events.filter((event) => event.kind === 'settled').at(-1);
const stateIs = (events: FixtureObservation[], expected: Record<string, unknown>): boolean => JSON.stringify(settled(events)?.fixtureState) === JSON.stringify(expected);
const token = (seed: number, salt: number): string => {
  let value = (seed ^ Math.imul(salt + 17, 0x9e3779b1)) >>> 0;
  // Math.imul returns a signed integer; normalize every stage before indexing.
  value = (value ^ (value >>> 16)) >>> 0;
  value = Math.imul(value, 0x85ebca6b) >>> 0;
  value = (value ^ (value >>> 13)) >>> 0;
  return `${['Aster', 'Birch', 'Cinder', 'Dune', 'Ember', 'Fjord'][value % 6]}-${String((value >>> 8) % 900 + 100)}`;
};

const readingSeeds = [120101, 120102, 120103, 120104] as const;
const workflowSeeds = [220201, 220202, 220203, 220204] as const;
const readingAnswers = readingSeeds.map((seed, index) => token(seed, index));
const workflowAnswers = workflowSeeds.map((seed, index) => token(seed, index + 20));

const check = (expected: Record<string, unknown>): FixtureCheck => (events) => stateIs(events, expected);

const reading = (index: number, family: Extract<V2ReadingWorkflowFamily, 'landmark-jump' | 'deep-fact' | 'cross-region' | 'collapsed-context'>, variant: string, source: string, prompt: string, terminalState: Record<string, unknown>): V2ReadingWorkflowCase => {
  const answer = readingAnswers[index]!;
  return {
    id: `v2-reading-${family}`, domain: 'regions-reading', family, structuralVariant: variant, seed: readingSeeds[index]!, split: 'development',
    route: `/v2/reading/${family}`, prompt: (base) => `Open ${base}/v2/reading/${family}. ${prompt} Enter the requested text into 'Final submission', click 'Submit answer', verify the confirmation, then reply ANSWER: <answer>. Submit exactly: ${source}: <target-region code>.`,
    expected: { answer: `${source}: ${answer}`, terminalState }, oracleId: `v2-reading-${family}-oracle`, nearMissId: `v2-reading-${family}-wrong-region-or-context`, check: check(terminalState),
  };
};

const workflow = (index: number, family: Extract<V2ReadingWorkflowFamily, 'multi-step-order' | 'cross-page-compare' | 'save-resume' | 'conditional-branch'>, variant: string, prompt: string, terminalState: Record<string, unknown>): V2ReadingWorkflowCase => {
  const answer = workflowAnswers[index]!;
  return {
    id: `v2-workflow-${family}`, domain: 'long-workflows', family, structuralVariant: variant, seed: workflowSeeds[index]!, split: 'development',
    route: `/v2/workflow/${family}`,
    prompt: (base) => `Open ${base}/v2/workflow/${family}. ${prompt} Submit exactly: Receipt: <receipt code>.`,
    expected: { answer: `Receipt: ${answer}`, terminalState }, oracleId: `v2-workflow-${family}-oracle`, nearMissId: `v2-workflow-${family}-missing-workflow-evidence`, check: check(terminalState),
  };
};

const CASES: V2ReadingWorkflowCase[] = [
  reading(0, 'landmark-jump', 'nested repeated landmarks and a target entry', 'Current program release', 'Use the current-program Release notes landmark, then open its target entry.', { kind: 'reading-complete', family: 'landmark-jump', evidence: { landmark: 'current-program', targetEntryOpened: true } }),
  reading(1, 'deep-fact', 'appendix hierarchy with a target clause behind a section transition', 'Appendix clause 31', 'Open the appendix and then clause 31, rather than its neighboring clause.', { kind: 'reading-complete', family: 'deep-fact', evidence: { appendixOpened: true, clause: 31 } }),
  reading(2, 'cross-region', 'summary and delivery regions with similarly shaped codes', 'Delivery region', 'Retain the request context and read the delivery-region fact.', { kind: 'reading-complete', family: 'cross-region', evidence: { summaryContextRetained: true, region: 'delivery' } }),
  reading(3, 'collapsed-context', 'collapsed retained context plus a decoy sibling', 'Expanded retained context', 'Expand the retained context before reading its target.', { kind: 'reading-complete', family: 'collapsed-context', evidence: { contextExpanded: true, targetRead: true } }),
  workflow(0, 'multi-step-order', 'validated configuration, shipping, payment, and confirmation', 'Choose a valid configuration, then shipping and payment before confirmation.', { kind: 'workflow-complete', family: 'multi-step-order', configuration: 'custom', shipping: 'express', payment: 'invoice', confirmed: true }),
  workflow(1, 'cross-page-compare', 'catalog, comparison, and purchase route transitions', 'Visit both offers, compare them, select Harbor, and confirm the purchase.', { kind: 'workflow-complete', family: 'cross-page-compare', comparison: { catalogVisited: true, bothOffersCompared: true, selected: 'Harbor' }, purchaseConfirmed: true }),
  workflow(2, 'save-resume', 'draft persistence across an interruption route', 'Enter the required visible title “Quarterly plan”, save it, leave to interruption, resume it, then publish.', { kind: 'workflow-complete', family: 'save-resume', draft: { title: 'Quarterly plan', saved: true }, resume: { interruptionVisited: true, restored: true }, published: true }),
  workflow(3, 'conditional-branch', 'branch-specific evidence and approval controls', 'Choose escalation, attach its case file, approve it, and submit.', { kind: 'workflow-complete', family: 'conditional-branch', branch: 'escalate', evidence: 'case-file', approved: true, submitted: true }),
];

export const V2_READING_WORKFLOW_DEVELOPMENT_CASES = Object.freeze(CASES);
export const V2_READING_WORKFLOW_DEVELOPMENT_CHECKS = V2_READING_WORKFLOW_DEVELOPMENT_CASES.map(({ id, check: fixtureCheck }) => ({ taskId: id, check: fixtureCheck }));

/** Deterministic exact submission plus final-state oracle; neither signal alone can pass. */
export function gradeV2ReadingWorkflowDevelopmentCase(caseId: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const fixture = V2_READING_WORKFLOW_DEVELOPMENT_CASES.find((entry) => entry.id === caseId);
  if (!fixture) return { ok: false, details: `unknown v2 reading/workflow case: ${caseId}` };
  // A token embedded in a longer answer can be contradictory or attributed to
  // another region. The fixture asks for one explicit source/code submission.
  const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/[.]$/, '').toLocaleLowerCase();
  const answerOk = normalize(answer) === normalize(fixture.expected.answer);
  const terminal = fixture.check(events);
  const terminalOk = typeof terminal === 'boolean' ? terminal : terminal.ok;
  if (answerOk && terminalOk) return { ok: true };
  return { ok: false, details: answerOk ? 'fixture terminal state does not satisfy the case oracle' : 'answer must be the exact required source and target code or receipt' };
}

const style = `<style>body{font:16px/1.45 system-ui,sans-serif;margin:24px;max-width:850px}nav,aside,section,article,fieldset{border:1px solid #aaa;padding:12px;margin:12px 0}button,input,select{font:inherit;padding:7px 12px}.hidden{display:none}.decoy{color:#734}.reading-region{height:210px;overflow:auto;scroll-behavior:smooth}.reading-spacer{height:540px}.offer{min-height:90px;background:#f8fafc}</style>`;
const html = (title: string, body: string, script: string): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>${style}</head><body>${body}<script>${script}</script></body></html>`;

function readingPage(entry: V2ReadingWorkflowCase): string {
  const code = entry.expected.answer.split(': ').at(-1)!;
  const common = `<label>Final submission <input id="submission"></label><button id="submit">Submit answer</button><p id="status" role="status"></p>`;
  const script = (setup: string, required: string) => `const expected=${JSON.stringify(entry.expected.terminalState)},answer=${JSON.stringify(entry.expected.answer)},status=document.querySelector('#status');${setup}document.querySelector('#submit').onclick=()=>{if(!(${required})||document.querySelector('#submission').value.trim()!==answer){status.textContent='Required region/context evidence is incomplete.';return;}window.__fixtureState=expected;status.textContent='Target region confirmed.'};window.__fixtureState={kind:'reading-pending',family:${JSON.stringify(entry.family)}};`;
  if (entry.family === 'landmark-jump') return html('V2 reading — landmark jump', `<section class="reading-region" aria-label="Program release notes"><nav><button id="old">Release notes — archive</button><button id="current">Release notes — current program</button></nav><p id="region-status">Choose the current program to reveal its section.</p><div class="reading-spacer">Older release summaries occupy this scrollable region.</div><article id="target" class="hidden"><h2>Current program release</h2><p>${code}</p><button id="open">Open target entry</button></article></section>${common}`, script(`let landmark='',opened=false;document.querySelector('#old').onclick=()=>{landmark='archive'};document.querySelector('#current').onclick=()=>{landmark='current-program';document.querySelector('#target').classList.remove('hidden');document.querySelector('#target').scrollIntoView()};document.querySelector('#open').onclick=()=>{opened=landmark==='current-program'};`, "landmark==='current-program'&&opened"));
  if (entry.family === 'deep-fact') return html('V2 reading — deep fact', `<nav aria-label="Document landmarks"><button id="appendix">Open appendix</button></nav><section class="reading-region" aria-label="Appendix document"><section id="clauses" class="hidden"><h2>Appendix</h2><button id="c30">Clause 30 <span class="decoy">${code.replace(/.$/, 'X')}</span></button><div class="reading-spacer">Nested appendix notes and prior clauses.</div><button id="c31">Clause 31</button></section><article id="fact" class="hidden"><h3>Appendix clause 31</h3><p>${code}</p></article></section>${common}`, script(`let appendix=false,clause=0;document.querySelector('#appendix').onclick=()=>{appendix=true;document.querySelector('#clauses').classList.remove('hidden')};document.querySelector('#c30').onclick=()=>{clause=30};document.querySelector('#c31').onclick=()=>{if(appendix){clause=31;document.querySelector('#fact').classList.remove('hidden');document.querySelector('#fact').scrollIntoView()}};`, 'appendix&&clause===31'));
  if (entry.family === 'cross-region') return html('V2 reading — cross region', `<section><h2>Summary</h2><p class="decoy">Summary code: ${code}</p><button id="retain">Retain request context</button></section><section id="delivery" class="hidden"><h2>Delivery region</h2><p>Delivery fact: ${code}</p><button id="read">Read delivery fact</button></section>${common}`, script(`let retained=false,delivery=false;document.querySelector('#retain').onclick=()=>{retained=true;document.querySelector('#delivery').classList.remove('hidden')};document.querySelector('#read').onclick=()=>{delivery=retained};`, 'retained&&delivery'));
  return html('V2 reading — collapsed context', `<aside class="decoy">Sibling context code: ${code.replace(/.$/, 'X')}</aside><details id="retained"><summary>Open retained context</summary><article><h2>Expanded retained context</h2><p>${code}</p><button id="read">Read target</button></article></details>${common}`, script(`const details=document.querySelector('#retained');let expanded=false,read=false;details.addEventListener('toggle',()=>{expanded=details.open});document.querySelector('#read').onclick=()=>{read=expanded};`, 'expanded&&read'));
}

function workflowPage(entry: V2ReadingWorkflowCase): string {
  const receipt = entry.expected.answer.split(': ').at(-1)!;
  const completionState = entry.family === 'save-resume' ? `{kind:'workflow-complete',family:'save-resume',draft:{title:history.state.draft,saved:true},resume:{interruptionVisited:true,restored:true},published:true}` : 'expected';
  const script = (setup: string, required: string, final: string) => `const expected=${JSON.stringify(entry.expected.terminalState)},receipt=${JSON.stringify(receipt)},status=document.querySelector('#status');${setup}document.querySelector('${final}').onclick=()=>{if(!(${required})){status.textContent='Required workflow evidence is incomplete.';return;}window.__fixtureState=${completionState};status.textContent='Workflow completed. Receipt: '+receipt;};window.__fixtureState={kind:'workflow-pending',family:${JSON.stringify(entry.family)}};`;
  if (entry.family === 'multi-step-order') return html('V2 workflow — validated order', `<select id="configuration"><option value="">Choose</option><option value="custom">Custom</option></select><button id="configure">Validate configuration</button><section id="shipping-box" class="hidden"><label><input id="express" type="radio" name="shipping">Express</label><button id="shipping">Save shipping</button></section><section id="payment-box" class="hidden"><label><input id="invoice" type="radio" name="payment">Invoice</label><button id="payment">Save payment</button></section><button id="confirm" class="hidden">Confirm order</button><p id="status"></p>`, script(`let configured=false,shipping=false,payment=false;document.querySelector('#configure').onclick=()=>{configured=document.querySelector('#configuration').value==='custom';if(configured)document.querySelector('#shipping-box').classList.remove('hidden')};document.querySelector('#shipping').onclick=()=>{shipping=configured&&document.querySelector('#express').checked;if(shipping)document.querySelector('#payment-box').classList.remove('hidden')};document.querySelector('#payment').onclick=()=>{payment=shipping&&document.querySelector('#invoice').checked;if(payment)document.querySelector('#confirm').classList.remove('hidden')};`, "configured&&shipping&&payment&&document.querySelector('#configuration').value==='custom'&&document.querySelector('#express').checked&&document.querySelector('#invoice').checked", '#confirm'));
  if (entry.family === 'cross-page-compare') return html('V2 workflow — compare offers', `<section id="catalog"><button id="aster">View Aster</button><button id="harbor">View Harbor</button><article id="offer" class="offer" aria-live="polite">Select an offer to view its visible details.</article></section><button id="compare">Open comparison</button><section id="comparison" class="hidden"><h2>Visible offer comparison</h2><p id="comparison-copy"></p><label><input id="choose" type="radio">Choose Harbor</label><button id="purchase">Continue to purchase</button></section><button id="confirm" class="hidden">Confirm purchase</button><p id="status"></p>`, script(`let aster=false,harbor=false,compared=false,selected=false;const offer=document.querySelector('#offer');document.querySelector('#aster').onclick=()=>{aster=true;offer.textContent='Aster offer: 12 seats, monthly billing.';history.pushState({},'', '#aster')};document.querySelector('#harbor').onclick=()=>{harbor=true;offer.textContent='Harbor offer: 20 seats, annual billing.';history.pushState({},'', '#harbor')};document.querySelector('#compare').onclick=()=>{compared=aster&&harbor;if(compared){history.pushState({},'', '#compare');document.querySelector('#comparison-copy').textContent='Aster: 12 monthly; Harbor: 20 annual.';document.querySelector('#comparison').classList.remove('hidden')}};document.querySelector('#purchase').onclick=()=>{selected=compared&&document.querySelector('#choose').checked;if(selected){history.pushState({},'', '#purchase');document.querySelector('#confirm').classList.remove('hidden')}};`, 'aster&&harbor&&compared&&selected', '#confirm'));
  if (entry.family === 'save-resume') return html('V2 workflow — save and resume', `<section id="editor"><label for="title">Required draft title</label><input id="title" required aria-describedby="title-help"><p id="title-help">Enter exactly: Quarterly plan.</p><button id="save">Save draft</button><button id="interrupt">Leave to interruption</button></section><section id="interruption" class="hidden"><button id="resume">Resume saved draft</button></section><section id="review" class="hidden"><p id="restored"></p><button id="publish">Publish draft</button></section><p id="status"></p>`, script(`let saved=false,interrupted=false,resumed=false,draftTitle='';document.querySelector('#save').onclick=()=>{draftTitle=document.querySelector('#title').value.trim();saved=draftTitle==='Quarterly plan';if(saved)history.replaceState({draft:draftTitle},'',location.href)};document.querySelector('#interrupt').onclick=()=>{interrupted=saved;if(interrupted){history.pushState({draft:history.state?.draft||''},'', '#interrupted');document.querySelector('#interruption').classList.remove('hidden')}};document.querySelector('#resume').onclick=()=>{resumed=interrupted&&history.state?.draft==='Quarterly plan';if(resumed){history.pushState({draft:history.state.draft},'', '#review');document.querySelector('#restored').textContent='Restored: '+history.state.draft;document.querySelector('#review').classList.remove('hidden')}};`, 'saved&&interrupted&&resumed', '#publish'));
  return html('V2 workflow — conditional branch', `<label><input id="normal" type="radio" name="branch">Normal</label><label><input id="escalate" type="radio" name="branch">Escalate</label><button id="classify">Continue</button><section id="evidence" class="hidden"><select id="file"><option value="">Choose</option><option value="case-file">Case file</option></select><button id="attach">Attach evidence</button><label id="approval" class="hidden"><input id="approve" type="checkbox">Approve</label><button id="submit-workflow" class="hidden">Submit approval</button></section><p id="status"></p>`, script(`let branch='',evidence=false,approved=false;document.querySelector('#classify').onclick=()=>{branch=document.querySelector('#escalate').checked?'escalate':'normal';if(branch==='escalate')document.querySelector('#evidence').classList.remove('hidden')};document.querySelector('#attach').onclick=()=>{evidence=branch==='escalate'&&document.querySelector('#file').value==='case-file';if(evidence)document.querySelector('#approval').classList.remove('hidden')};document.querySelector('#approve').onchange=()=>{approved=evidence&&document.querySelector('#approve').checked;if(approved)document.querySelector('#submit-workflow').classList.remove('hidden')};`, "branch==='escalate'&&evidence&&approved", '#submit-workflow'));
}

/** Route adapter for future explicit registration in the fixture server. */
export function v2ReadingWorkflowDevelopmentRoute(path: string): { body: string; type: string } | null {
  const entry = V2_READING_WORKFLOW_DEVELOPMENT_CASES.find((candidate) => candidate.route === path);
  if (!entry) return null;
  return { body: entry.domain === 'regions-reading' ? readingPage(entry) : workflowPage(entry), type: 'text/html; charset=utf-8' };
}
