/**
 * Development-only v2 interaction fixtures.
 *
 * This module intentionally has no import from the shared fixture router. A
 * caller can opt in by delegating unmatched paths to
 * `v2InteractionDevelopmentRoute`, and by registering
 * `V2_INTERACTION_DEVELOPMENT_CHECKS`; keeping that wiring external prevents
 * these exploratory cases from changing the frozen benchmark manifest.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type V2InteractionDomain = 'forms-embedded-controls' | 'overlays-shadow-dom' | 'spa-navigation-recovery';
export type V2InteractionFamily =
  | 'checkbox-submit' | 'embedded-frame-submit' | 'combobox-confirm' | 'validation-recovery'
  | 'blocking-dialog' | 'shadow-control' | 'modal-save' | 'toast-action'
  | 'client-route-action' | 'history-draft' | 'route-recovery' | 'retry-recovery';

export interface V2InteractionExpectedState {
  answer: string;
  state: Record<string, unknown>;
}

export interface V2InteractionNearMiss {
  id: string;
  /** A tempting, specific wrong answer; it must not pass with the correct state. */
  answer: string;
  /** A state reached by a plausible incomplete or incorrect interaction. */
  state: Record<string, unknown>;
}

export interface V2InteractionDevelopmentCase {
  id: string;
  domain: V2InteractionDomain;
  family: V2InteractionFamily;
  structuralVariant: string;
  seed: number;
  split: 'development';
  route: string;
  prompt: (base: string) => string;
  expected: V2InteractionExpectedState;
  oracleId: string;
  nearMiss: V2InteractionNearMiss;
  check: FixtureCheck;
}

/** One normalized final confirmation only; appended claims cannot pass. */
const normalizeAnswer = (text: string): string => text.trim()
  .replace(/^(?:final(?: answer)?|answer):\s*/i, '')
  .replace(/\s+/g, ' ')
  .replace(/[.]$/, '')
  .toLocaleLowerCase();
const phrase = (text: string, value: string): boolean => normalizeAnswer(text) === normalizeAnswer(value);
const settled = (events: FixtureObservation[]) => events.filter((event) => event.kind === 'settled').at(-1);
const stateIs = (event: FixtureObservation | undefined, state: unknown): boolean => JSON.stringify(event?.fixtureState) === JSON.stringify(state);
const terminal = (state: Record<string, unknown>) => (events: FixtureObservation[]): boolean => stateIs(settled(events), state);

/** Deterministic, tiny PRNG for visible fixture tokens; no Math.random data. */
const seededNumber = (seed: number, minimum: number, maximum: number): number => {
  let value = seed >>> 0;
  value += 0x6d2b79f5;
  let mixed = value;
  mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
  mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
  return minimum + (((mixed ^ (mixed >>> 14)) >>> 0) % (maximum - minimum + 1));
};

const css = `<style>
body{font:15px/1.4 system-ui,sans-serif;margin:24px;max-width:760px}button,input,select{font:inherit;margin:6px 0}label{display:block;margin:8px 0}.card{border:1px solid #98a2b3;border-radius:8px;padding:16px;margin:12px 0}.veil{position:fixed;inset:0;background:#1119;display:grid;place-items:center}.dialog{background:white;border-radius:8px;padding:20px;max-width:440px}.toast{border-left:4px solid #1769aa;padding:10px;background:#eef6ff}.route{display:flex;gap:12px}.route a{cursor:pointer;color:#0645ad;text-decoration:underline}.hidden{display:none}</style>`;
const page = (title: string, body: string, script: string): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>${css}</head><body>${body}<script>${script}</script></body></html>`;

const preferenceForm = (): string => page('Interaction preferences', `<main><h1>Alert preferences</h1><form id="f" class="card"><label>Topic <select id="topic"><option>Product</option><option>Security</option><option>Billing</option></select></label><label><input id="digest" type="checkbox"> Send a weekly digest</label><button>Save preferences</button></form><p id="out" role="status"></p></main>`, `
const f=document.querySelector('#f'),topic=document.querySelector('#topic'),digest=document.querySelector('#digest');window.__fixtureState={topic:'Product',digest:false,saved:false};f.addEventListener('submit',e=>{e.preventDefault();window.__fixtureState={topic:topic.value,digest:digest.checked,saved:true};document.querySelector('#out').textContent='Saved '+topic.value+' alerts with weekly digest.'});`);

const framePayment = (): string => {
  const receipt = `PAY-${seededNumber(22012, 410, 490)}`;
  const frame = `<form id="payment"><label>Card ending <select id="card"><option>1042</option><option>7719</option></select></label><button>Confirm card</button></form><script>document.querySelector('#payment').onsubmit=e=>{e.preventDefault();parent.postMessage({type:'frame-paid',card:document.querySelector('#card').value},'*')}</script>`;
  return page('Embedded payment control', `<main><h1>Invoice ${receipt}</h1><p>Use the secure card form embedded below.</p><iframe title="Secure payment" srcdoc="${frame.replace(/"/g, '&quot;')}"></iframe><p id="out" role="status"></p></main>`, `window.__fixtureState={receipt:'${receipt}',card:null,paid:false};addEventListener('message',e=>{if(e.data&&e.data.type==='frame-paid'){window.__fixtureState={receipt:'${receipt}',card:e.data.card,paid:true};document.querySelector('#out').textContent='Invoice ${receipt} paid with card ending '+e.data.card+'.'}});`);
};

const comboboxConfirm = (): string => page('Region assignment', `<main><h1>Assign territory</h1><label>Region <input id="region" list="regions" placeholder="Choose a region"><datalist id="regions"><option value="North Harbor"><option value="South Harbor"><option value="West Ridge"></datalist></label><button id="assign">Assign</button><p id="out" role="status"></p></main>`, `const region=document.querySelector('#region');window.__fixtureState={region:'',assigned:false};document.querySelector('#assign').onclick=()=>{const known=['North Harbor','South Harbor','West Ridge'];if(!known.includes(region.value)){document.querySelector('#out').textContent='Choose a listed region.';return}window.__fixtureState={region:region.value,assigned:true};document.querySelector('#out').textContent=region.value+' assigned.'};`);

const validationRecovery = (): string => page('Invite recovery', `<main><h1>Invite collaborator</h1><form id="invite" novalidate><label>Email <input id="email" type="email" value="ada@example.test" required></label><button>Send invite</button></form><p id="out" role="alert"></p></main>`, `const form=document.querySelector('#invite'),email=document.querySelector('#email');let failureSeen=false;window.__fixtureState={email:email.value,sent:false,error:false,failureSeen};form.addEventListener('submit',e=>{e.preventDefault();if(!email.value.endsWith('@northwind.test')){failureSeen=true;window.__fixtureState={email:email.value,sent:false,error:true,failureSeen};document.querySelector('#out').textContent='Use a northwind.test address.';return}window.__fixtureState={email:email.value,sent:true,error:false,failureSeen};document.querySelector('#out').textContent='Invite sent to '+email.value+'.'});`);

const blockingDialog = (): string => page('Cookie gate', `<main><h1>Workspace</h1><button id="export">Export report</button><p id="out"></p></main><div id="veil" class="veil"><section class="dialog" role="dialog" aria-modal="true"><h2>Privacy choices</h2><button id="essential">Use essential only</button><button id="all">Accept all</button></section></div>`, `window.__fixtureState={privacy:null,exported:false};document.querySelector('#essential').onclick=()=>{window.__fixtureState={privacy:'essential',exported:false};document.querySelector('#veil').remove()};document.querySelector('#all').onclick=()=>{window.__fixtureState={privacy:'all',exported:false};document.querySelector('#veil').remove()};document.querySelector('#export').onclick=()=>{if(!window.__fixtureState.privacy)return;window.__fixtureState={...window.__fixtureState,exported:true};document.querySelector('#out').textContent='Report exported with '+window.__fixtureState.privacy+' privacy.'};`);

const shadowControl = (): string => page('Shadow preference', `<main><h1>Display controls</h1><display-density></display-density><p id="out" role="status"></p></main>`, `class DisplayDensity extends HTMLElement{connectedCallback(){const root=this.attachShadow({mode:'open'});root.innerHTML='<div class="card"><label>Density <select id="density"><option>Comfortable</option><option>Compact</option></select></label><button id="apply">Apply density</button></div>';root.querySelector('#apply').onclick=()=>{const density=root.querySelector('#density').value;window.__fixtureState={density,applied:true};document.querySelector('#out').textContent=density+' density applied.'}}}customElements.define('display-density',DisplayDensity);window.__fixtureState={density:'Comfortable',applied:false};`);

const modalSave = (): string => page('Edit project modal', `<main><h1>Project Atlas</h1><button id="open">Rename project</button><p id="out"></p></main><div id="modal" class="veil hidden"><form class="dialog" id="rename" role="dialog" aria-modal="true"><label>Project name <input id="name" value="Atlas"></label><button>Save name</button><button type="button" id="cancel">Cancel</button></form></div>`, `const modal=document.querySelector('#modal'),name=document.querySelector('#name');window.__fixtureState={name:'Atlas',saved:false};document.querySelector('#open').onclick=()=>modal.classList.remove('hidden');document.querySelector('#cancel').onclick=()=>modal.classList.add('hidden');document.querySelector('#rename').onsubmit=e=>{e.preventDefault();window.__fixtureState={name:name.value,saved:true};modal.classList.add('hidden');document.querySelector('#out').textContent='Project renamed to '+name.value+'.'};`);

const toastAction = (): string => page('Archive toast', `<main><h1>Documents</h1><button id="archive">Archive Q3 plan</button><div id="toast" class="toast hidden" role="status">Q3 plan archived. <button id="undo">Undo</button></div></main>`, `const toast=document.querySelector('#toast');window.__fixtureState={archived:false,undone:false};document.querySelector('#archive').onclick=()=>{window.__fixtureState={archived:true,undone:false};toast.classList.remove('hidden')};document.querySelector('#undo').onclick=()=>{window.__fixtureState={archived:false,undone:true};toast.textContent='Archive undone.'};`);

const clientRouteAction = (): string => page('Client route action', `<nav class="route"><a href="/v2-interaction/spa/projects" data-route="/projects">Projects</a><a href="/v2-interaction/spa/projects/mercury" data-route="/projects/mercury">Mercury</a></nav><main id="app"></main>`, `let route='/projects';function render(){document.querySelector('#app').innerHTML=route==='/projects'?'<h1>Projects</h1><a href="/v2-interaction/spa/projects/mercury" data-route="/projects/mercury">Open Mercury</a>':'<h1>Mercury</h1><button id="complete">Mark Mercury complete</button><p id="out"></p>';window.__fixtureState={route,completed:window.__fixtureState?.completed||false};const complete=document.querySelector('#complete');if(complete)complete.onclick=()=>{window.__fixtureState={route,completed:true};document.querySelector('#out').textContent='Mercury marked complete.'}}document.addEventListener('click',e=>{const link=e.target.closest('a[href][data-route]');if(!link)return;e.preventDefault();route=link.dataset.route;history.pushState({route},'',link.getAttribute('href'));render()});addEventListener('popstate',e=>{route=e.state?.route||'/projects';render()});window.__fixtureState={route:'/projects',completed:false};render();`);

const historyDraft = (): string => page('History draft', `<nav class="route"><a href="/v2-interaction/spa/draft" data-route="/compose">Compose</a><a href="/v2-interaction/spa/draft/preview" data-route="/preview">Preview</a></nav><main id="app"></main>`, `let route='/compose',draft='';function render(){document.querySelector('#app').innerHTML=route==='/compose'?'<h1>Compose</h1><label>Draft <input id="draft" value="'+draft+'"></label><a href="/v2-interaction/spa/draft/preview" data-route="/preview">Preview</a>':'<h1>Preview</h1><p id="preview">'+(draft||'No draft')+'</p><a href="/v2-interaction/spa/draft" data-route="/compose">Back to compose</a>';window.__fixtureState={route,draft};const input=document.querySelector('#draft');if(input)input.oninput=()=>{draft=input.value;window.__fixtureState={route,draft}}}document.addEventListener('click',e=>{const link=e.target.closest('a[href][data-route]');if(!link)return;e.preventDefault();route=link.dataset.route;history.pushState({route},'',link.getAttribute('href'));render()});addEventListener('popstate',e=>{route=e.state?.route||'/compose';render()});window.__fixtureState={route,draft};render();`);

const routeRecovery = (): string => page('Route recovery', `<nav class="route"><a href="/v2-interaction/spa/settings" data-route="/settings">Settings</a></nav><main id="app"></main>`, `let route='/settings/legacy-notifications',routeFailureSeen=true,sms=false,saved=false;function state(){window.__fixtureState={route,sms,saved,routeFailureSeen}}function render(){if(route==='/settings/legacy-notifications'){document.querySelector('#app').innerHTML='<h1>Notification settings unavailable</h1><p role="alert">The saved notification route is no longer available.</p><a href="/v2-interaction/spa/settings/notifications" data-route="/settings/notifications">Recover notification settings</a>';state();return}if(route==='/settings'){document.querySelector('#app').innerHTML='<h1>Settings</h1><a href="/v2-interaction/spa/settings/notifications" data-route="/settings/notifications">Notification settings</a>';state();return}document.querySelector('#app').innerHTML='<h1>Notification settings</h1><label><input id="sms" type="checkbox"> SMS alerts</label><button id="save">Save notifications</button><p id="out"></p>';document.querySelector('#sms').checked=sms;document.querySelector('#save').onclick=()=>{sms=document.querySelector('#sms').checked;saved=true;state();document.querySelector('#out').textContent='Notification settings recovered and saved.'};state()}document.addEventListener('click',e=>{const link=e.target.closest('a[href][data-route]');if(!link)return;e.preventDefault();route=link.dataset.route;history.pushState({route},'',link.getAttribute('href'));render()});addEventListener('popstate',e=>{route=e.state?.route||'/settings/legacy-notifications';render()});render();`);

const retryRecovery = (): string => page('Retry recovery', `<main><h1>Sync contacts</h1><button id="sync">Sync now</button><button id="retry" class="hidden">Retry sync</button><p id="out" role="status"></p></main>`, `let attempts=0,phase='idle',retryUsed=false;function state(){window.__fixtureState={attempts,phase,retryUsed}}function fail(){attempts++;phase='failed';state();document.querySelector('#sync').disabled=true;document.querySelector('#retry').classList.remove('hidden');document.querySelector('#out').textContent='Sync failed. Retry required.'}function retry(){if(phase!=='failed')return;attempts++;phase='recovered';retryUsed=true;state();document.querySelector('#retry').disabled=true;document.querySelector('#out').textContent='Contacts synced after retry.'}state();document.querySelector('#sync').onclick=fail;document.querySelector('#retry').onclick=retry;`);

const receipt = `PAY-${seededNumber(22012, 410, 490)}`;
const cases: V2InteractionDevelopmentCase[] = [
  { id:'v2-interaction-form-preferences',domain:'forms-embedded-controls',family:'checkbox-submit',structuralVariant:'select plus checkbox requires submit',seed:22011,split:'development',route:'/v2-interaction/forms/preferences',prompt:b=>`Open ${b}/v2-interaction/forms/preferences. Choose Security, enable the weekly digest, and save. Report the confirmation.`,expected:{answer:'Saved Security alerts with weekly digest.',state:{topic:'Security',digest:true,saved:true}},oracleId:'v2-interaction-form-preferences-oracle',nearMiss:{id:'v2-interaction-form-preferences-unsaved',answer:'Saved Product alerts with weekly digest.',state:{topic:'Security',digest:true,saved:false}},check:terminal({topic:'Security',digest:true,saved:true})},
  { id:'v2-interaction-form-frame-payment',domain:'forms-embedded-controls',family:'embedded-frame-submit',structuralVariant:'same-origin iframe posts completion to parent',seed:22012,split:'development',route:'/v2-interaction/forms/frame-payment',prompt:b=>`Open ${b}/v2-interaction/forms/frame-payment. In the secure payment frame select card ending 7719 and confirm it. Report the confirmation.`,expected:{answer:`Invoice ${receipt} paid with card ending 7719.`,state:{receipt,card:'7719',paid:true}},oracleId:'v2-interaction-form-frame-payment-oracle',nearMiss:{id:'v2-interaction-form-frame-payment-default-card',answer:`Invoice ${receipt} paid with card ending 1042.`,state:{receipt,card:'1042',paid:true}},check:terminal({receipt,card:'7719',paid:true})},
  { id:'v2-interaction-form-combobox',domain:'forms-embedded-controls',family:'combobox-confirm',structuralVariant:'datalist selection must be from a recognized option',seed:22013,split:'development',route:'/v2-interaction/forms/combobox',prompt:b=>`Open ${b}/v2-interaction/forms/combobox. Assign West Ridge and report the confirmation.`,expected:{answer:'West Ridge assigned.',state:{region:'West Ridge',assigned:true}},oracleId:'v2-interaction-form-combobox-oracle',nearMiss:{id:'v2-interaction-form-combobox-neighbor',answer:'South Harbor assigned.',state:{region:'South Harbor',assigned:true}},check:terminal({region:'West Ridge',assigned:true})},
  { id:'v2-interaction-form-validation-recovery',domain:'forms-embedded-controls',family:'validation-recovery',structuralVariant:'prefilled invalid invite must fail before corrected submit',seed:22014,split:'development',route:'/v2-interaction/forms/invite',prompt:b=>`Open ${b}/v2-interaction/forms/invite. First send the prefilled invalid invitation, then correct it to ada@northwind.test and resend. Report the confirmation.`,expected:{answer:'Invite sent to ada@northwind.test.',state:{email:'ada@northwind.test',sent:true,error:false,failureSeen:true}},oracleId:'v2-interaction-form-validation-recovery-oracle',nearMiss:{id:'v2-interaction-form-validation-recovery-error',answer:'Use a northwind.test address.',state:{email:'ada@example.test',sent:false,error:true,failureSeen:true}},check:terminal({email:'ada@northwind.test',sent:true,error:false,failureSeen:true})},
  { id:'v2-interaction-overlay-dialog',domain:'overlays-shadow-dom',family:'blocking-dialog',structuralVariant:'modal veil blocks underlying export button',seed:23011,split:'development',route:'/v2-interaction/overlay/dialog',prompt:b=>`Open ${b}/v2-interaction/overlay/dialog. Choose essential-only privacy, export the report, and report the confirmation.`,expected:{answer:'Report exported with essential privacy.',state:{privacy:'essential',exported:true}},oracleId:'v2-interaction-overlay-dialog-oracle',nearMiss:{id:'v2-interaction-overlay-dialog-accept-all',answer:'Report exported with all privacy.',state:{privacy:'all',exported:true}},check:terminal({privacy:'essential',exported:true})},
  { id:'v2-interaction-overlay-shadow',domain:'overlays-shadow-dom',family:'shadow-control',structuralVariant:'open shadow-root select and button',seed:23012,split:'development',route:'/v2-interaction/overlay/shadow',prompt:b=>`Open ${b}/v2-interaction/overlay/shadow. In the display control choose Compact, apply it, and report the confirmation.`,expected:{answer:'Compact density applied.',state:{density:'Compact',applied:true}},oracleId:'v2-interaction-overlay-shadow-oracle',nearMiss:{id:'v2-interaction-overlay-shadow-default',answer:'Comfortable density applied.',state:{density:'Comfortable',applied:true}},check:terminal({density:'Compact',applied:true})},
  { id:'v2-interaction-overlay-modal',domain:'overlays-shadow-dom',family:'modal-save',structuralVariant:'dialog form only commits through save',seed:23013,split:'development',route:'/v2-interaction/overlay/modal',prompt:b=>`Open ${b}/v2-interaction/overlay/modal. Rename Project Atlas to Aurora, save it, and report the confirmation.`,expected:{answer:'Project renamed to Aurora.',state:{name:'Aurora',saved:true}},oracleId:'v2-interaction-overlay-modal-oracle',nearMiss:{id:'v2-interaction-overlay-modal-cancel',answer:'Project renamed to Atlas.',state:{name:'Atlas',saved:false}},check:terminal({name:'Aurora',saved:true})},
  { id:'v2-interaction-overlay-toast',domain:'overlays-shadow-dom',family:'toast-action',structuralVariant:'transient toast action undoes archive',seed:23014,split:'development',route:'/v2-interaction/overlay/toast',prompt:b=>`Open ${b}/v2-interaction/overlay/toast. Archive Q3 plan, use the toast to undo it, and report the confirmation.`,expected:{answer:'Archive undone.',state:{archived:false,undone:true}},oracleId:'v2-interaction-overlay-toast-oracle',nearMiss:{id:'v2-interaction-overlay-toast-unhandled',answer:'Q3 plan archived.',state:{archived:true,undone:false}},check:terminal({archived:false,undone:true})},
  { id:'v2-interaction-spa-client-route',domain:'spa-navigation-recovery',family:'client-route-action',structuralVariant:'pushState route change followed by detail action',seed:24011,split:'development',route:'/v2-interaction/spa/projects',prompt:b=>`Open ${b}/v2-interaction/spa/projects. Navigate to Mercury, mark it complete, and report the confirmation.`,expected:{answer:'Mercury marked complete.',state:{route:'/projects/mercury',completed:true}},oracleId:'v2-interaction-spa-client-route-oracle',nearMiss:{id:'v2-interaction-spa-client-route-list-only',answer:'Mercury is listed.',state:{route:'/projects',completed:false}},check:terminal({route:'/projects/mercury',completed:true})},
  { id:'v2-interaction-spa-history-draft',domain:'spa-navigation-recovery',family:'history-draft',structuralVariant:'client navigation preserves a mutable draft',seed:24012,split:'development',route:'/v2-interaction/spa/draft',prompt:b=>`Open ${b}/v2-interaction/spa/draft. Enter Release notes, navigate to Preview, and report the preview text.`,expected:{answer:'Release notes',state:{route:'/preview',draft:'Release notes'}},oracleId:'v2-interaction-spa-history-draft-oracle',nearMiss:{id:'v2-interaction-spa-history-draft-empty',answer:'No draft',state:{route:'/preview',draft:''}},check:terminal({route:'/preview',draft:'Release notes'})},
  { id:'v2-interaction-spa-route-recovery',domain:'spa-navigation-recovery',family:'route-recovery',structuralVariant:'invalid route must surface before recovery and save',seed:24013,split:'development',route:'/v2-interaction/spa/settings',prompt:b=>`Open ${b}/v2-interaction/spa/settings. Recover the unavailable notification route, enable SMS alerts, save, and report the confirmation.`,expected:{answer:'Notification settings recovered and saved.',state:{route:'/settings/notifications',sms:true,saved:true,routeFailureSeen:true}},oracleId:'v2-interaction-spa-route-recovery-oracle',nearMiss:{id:'v2-interaction-spa-route-recovery-unsaved',answer:'SMS alerts enabled but unsaved.',state:{route:'/settings/notifications',sms:true,saved:false,routeFailureSeen:true}},check:terminal({route:'/settings/notifications',sms:true,saved:true,routeFailureSeen:true})},
  { id:'v2-interaction-spa-retry-recovery',domain:'spa-navigation-recovery',family:'retry-recovery',structuralVariant:'first mutation fails and only explicit retry recovers',seed:24014,split:'development',route:'/v2-interaction/spa/retry',prompt:b=>`Open ${b}/v2-interaction/spa/retry. Start the contact sync, wait for its failure, use Retry sync, and report the confirmation.`,expected:{answer:'Contacts synced after retry.',state:{attempts:2,phase:'recovered',retryUsed:true}},oracleId:'v2-interaction-spa-retry-recovery-oracle',nearMiss:{id:'v2-interaction-spa-retry-recovery-failed',answer:'Sync failed. Retry required.',state:{attempts:1,phase:'failed',retryUsed:false}},check:terminal({attempts:2,phase:'recovered',retryUsed:true})},
];

export const V2_INTERACTION_DEVELOPMENT_CASES = Object.freeze(cases);
export const V2_INTERACTION_DEVELOPMENT_CHECKS = V2_INTERACTION_DEVELOPMENT_CASES.map(({ id, check }) => ({ taskId: id, check }));

/** Deterministically requires both the expected answer and the final fixture-owned state. */
export function gradeV2InteractionDevelopmentCase(caseId: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const fixture = V2_INTERACTION_DEVELOPMENT_CASES.find((entry) => entry.id === caseId);
  if (!fixture) return { ok: false, details: `unknown v2 interaction development case: ${caseId}` };
  const answerOk = phrase(answer, fixture.expected.answer);
  const result = fixture.check(events);
  const stateOk = typeof result === 'boolean' ? result : result.ok;
  if (answerOk && stateOk) return { ok: true };
  return { ok: false, details: !answerOk ? 'answer must be the one exact expected confirmation' : 'fixture terminal state does not satisfy the interaction oracle' };
}

/**
 * Kept unregistered on purpose. A development harness may delegate unmatched
 * requests to this function; production routing must not import it implicitly.
 */
export function v2InteractionDevelopmentRoute(path: string): { body: string; type: string } | null {
  const pages: Record<string, () => string> = {
    '/v2-interaction/forms/preferences': preferenceForm,
    '/v2-interaction/forms/frame-payment': framePayment,
    '/v2-interaction/forms/combobox': comboboxConfirm,
    '/v2-interaction/forms/invite': validationRecovery,
    '/v2-interaction/overlay/dialog': blockingDialog,
    '/v2-interaction/overlay/shadow': shadowControl,
    '/v2-interaction/overlay/modal': modalSave,
    '/v2-interaction/overlay/toast': toastAction,
    '/v2-interaction/spa/projects': clientRouteAction,
    '/v2-interaction/spa/draft': historyDraft,
    '/v2-interaction/spa/settings': routeRecovery,
    '/v2-interaction/spa/retry': retryRecovery,
  };
  const make = pages[path];
  return make ? { body: make(), type: 'text/html; charset=utf-8' } : null;
}
