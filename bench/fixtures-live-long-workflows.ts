/**
 * The workflow half of the opt-in live-long fixture suite.  These pages deliberately
 * look like small ordinary applications: the hidden ledger is only for the fixture
 * server's post-action evidence, never an element an agent can read.
 */
import { page } from './fixtures-more.js';
import { LONG_EXPECT } from './fixtures-long.js';
import { longTerminalObservation, type FixtureObservation } from './fixtures.js';

export interface LongFixtureCase {
  id: string;
  name: string;
  variant: 'off' | 'on';
  seed: number;
  devSeed: number;
  prompt: (base: string) => string;
  startPath: string;
  expected: unknown;
  nearMiss: { name: string; ledger: unknown };
  check: (events: FixtureObservation[]) => boolean | { ok: boolean; details?: string };
  milestones: { name: string; predicate: (ledger: any) => boolean }[];
  hazard: { trigger: string; description: string };
  referenceActions: number;
  walkthrough: Array<{ op: 'goto' | 'click' | 'type' | 'select' | 'check'; target: string; value?: string }>;
  answer: { receiptPattern: string; extraFacts?: Record<string, string> };
}

const FROZEN_SEED = 7319;
const DEVELOPMENT_SEED = 19417;
const norm = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
/** The commit count depends on the path taken, so the grade compares business state only. */
const withoutRevision = (value: unknown) => { const { revision: _revision, ...rest } = value as Record<string, unknown>; return rest; };
const chrome = (name: string, title: string, main: string, script: string): string => page(title,
  `<header><nav aria-label="Main"><a href="#home">${name}</a> <a href="#help">Help</a> <a href="#settings">Settings</a></nav></header><main id="app">${main}</main><footer><hr><small>© 2026 ${name} · Privacy · Terms · Support</small></footer>`, script);

const routeParts = (path: string): { name: string; variant: 'off' | 'on'; view: string } | null => {
  const match = path.match(/^\/live-long\/(workspace|casework|budgets|dispatch)\/(off|on)\/([^/?#]+)(?:\?.*)?$/);
  return match ? { name: match[1]!, variant: match[2] as 'off' | 'on', view: match[3]! } : null;
};

const receipt = (prefix: string, value: unknown): string => {
  const text = JSON.stringify(value);
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (Math.imul(hash, 33) ^ text.charCodeAt(i)) >>> 0;
  return `${prefix}-${String(1000 + hash % 9000)}`;
};

// ---- workspace -------------------------------------------------------------

const WORKSPACE_BASE = {
  company: ['', '', '', ''], admin: ['', '', '', ''], plan: '', cycle: '', billing: '',
  invites: [['sam@northwind.test', 'member']] as string[][], terms: false, created: false, receipt: '',
};
const WORKSPACE_FINAL = {
  company: LONG_EXPECT.onboard.state.company, admin: LONG_EXPECT.onboard.state.admin,
  plan: 'growth', cycle: 'yearly', billing: 'billing@northwind.test',
  invites: [['kai@northwind.test', 'member'], ['lin@northwind.test', 'admin'], ['taylor@northwind.test', 'member']],
  terms: true, created: true, receipt: '',
};
WORKSPACE_FINAL.receipt = receipt('WS', { ...WORKSPACE_FINAL, receipt: '' });

const workspacePage = (variant: 'off' | 'on'): string => chrome('Northwind Cloud', 'Create workspace',
  `<h1>Create workspace</h1><p id="route" role="status"></p><div id="view"></div>`, String.raw`
const variant = ${JSON.stringify(variant)};
const $ = (id) => document.getElementById(id);
const state = ${JSON.stringify(WORKSPACE_BASE)}, tombstones = [];
let revision = 0, view = 'company';
const clean = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
const ledger = () => ({ workspace: { company: state.company, admin: state.admin, plan: state.plan, cycle: state.cycle, billing: state.billing, invites: state.invites.map((x) => [clean(x[0]), x[1]]).sort((a,b) => a[0].localeCompare(b[0])), terms: state.terms, created: state.created, receipt: state.receipt }, completed: state.created, pending: 0, revision });
window.__fixtureLong = (kind, reason) => ({ revision, entityId: 'workspace:northwind', operationId: 'workspace-' + view, mutations: [], pending: 0, ledger: ledger() });
const commit = () => { revision++; window.__fixtureNotify('commit'); };
const go = (next, push = true) => { view = next; if (push) history.pushState({ view }, '', '/live-long/workspace/' + variant + '/' + next); render(); };
window.addEventListener('popstate', (e) => { view = e.state?.view || location.pathname.split('/').pop() || 'company'; render(); });
const field = (id, label, value, type = 'text') => '<label for="' + id + '">' + label + '</label><input id="' + id + '" type="' + type + '" value="' + (value || '') + '"><br>';
function render() {
  $('route').textContent = 'Step: ' + view;
  if (view === 'company') $('view').innerHTML = '<section aria-label="Company">' + field('company','Company name',state.company[0]) + '<label for="size">Company size</label><select id="size"><option value="">Choose</option><option value="51-200">51-200</option></select><br><label for="country">Country</label><select id="country"><option value="">Choose</option><option value="DE">Germany</option></select><br>' + field('vat','VAT ID',state.company[3]) + '<button id="company-next">Continue</button><p id="error"></p></section>';
  else if (view === 'admin') $('view').innerHTML = '<section aria-label="Admin contact">' + field('first','First name',state.admin[0]) + field('last','Last name',state.admin[1]) + field('email','Work email',state.admin[2],'email') + field('phone','Phone',state.admin[3],'tel') + '<button id="admin-back">Back</button> <button id="admin-next">Continue</button></section>';
  else if (view === 'billing') $('view').innerHTML = '<section aria-label="Plan and billing"><fieldset><legend>Plan</legend><label><input type="radio" name="plan" value="starter">Starter</label><label><input type="radio" name="plan" value="growth"' + (state.plan === 'growth' ? ' checked' : '') + '>Growth</label></fieldset><fieldset><legend>Billing cycle</legend><label><input type="radio" name="cycle" value="monthly">Monthly</label><label><input type="radio" name="cycle" value="yearly"' + (state.cycle === 'yearly' ? ' checked' : '') + '>Yearly</label></fieldset><label><input id="separate" type="checkbox"' + (state.billing ? ' checked' : '') + '> Send invoices separately</label><br>' + field('billing-email','Billing email',state.billing,'email') + '<button id="billing-back">Back</button> <button id="billing-next">Continue</button></section>';
  else if (view === 'invites') $('view').innerHTML = '<section aria-label="Invites">' + field('invite-email','Invite email','', 'email') + '<label for="invite-role">Role</label><select id="invite-role"><option value="member">Member</option><option value="admin">Admin</option></select><button id="add-invite">Add invite</button><ul id="invite-list">' + state.invites.map((x,i) => '<li>' + x[0] + ' (' + x[1] + ') <button data-remove="' + i + '">Remove ' + x[0] + '</button></li>').join('') + (variant === 'off' ? tombstones.map(() => '<li hidden aria-hidden="true">Removed invite</li>').join('') : '') + '</ul><button id="invites-back">Back</button> <button id="invites-next">Review</button></section>';
  else if (view === 'review') $('view').innerHTML = '<section aria-label="Review"><p>Northwind workspace · ' + state.invites.length + ' invites</p><label><input id="terms" type="checkbox"' + (state.terms ? ' checked' : '') + '> I accept the Terms</label><br><button id="review-back">Back</button> <button id="create">Create workspace</button><p id="error"></p></section>';
  else $('view').innerHTML = '<section aria-label="Workspace created"><h2>Workspace created</h2><p>Receipt ' + state.receipt + '</p></section>';
  bind();
}
function bind() {
  if (view === 'company') $('company-next').onclick = () => { const values = [$('company').value,$('size').value,$('country').value,$('vat').value]; if (values.some((x) => !String(x).trim())) return $('error').textContent='Complete the company details.'; state.company=values.map(clean); go('admin'); };
  if (view === 'admin') { $('admin-back').onclick=()=>go('company'); $('admin-next').onclick=()=>{ const v=[$('first').value,$('last').value,$('email').value,$('phone').value]; if(v.some((x)=>!String(x).trim())) return; state.admin=v.map(clean); go('billing'); }; }
  if (view === 'billing') { $('billing-back').onclick=()=>go('admin'); $('billing-next').onclick=()=>{ const p=document.querySelector('input[name=plan]:checked')?.value, c=document.querySelector('input[name=cycle]:checked')?.value; if(!p||!c||!$('separate').checked||!$('billing-email').value.includes('@')) return; state.plan=p;state.cycle=c;state.billing=clean($('billing-email').value);go('invites'); }; }
  if (view === 'invites') { $('add-invite').onclick=()=>{const e=clean($('invite-email').value), r=$('invite-role').value;if(!e.includes('@')||state.invites.some((x)=>clean(x[0])===e))return;state.invites.push([e,r]);$('invite-email').value='';render();}; $('invite-list').onclick=(e)=>{const i=e.target.dataset.remove;if(i===undefined)return;const removed=state.invites.splice(Number(i),1)[0];if(variant==='off' && removed) tombstones.push(removed);if(variant==='on') state.invites=state.invites.map((x)=>[x[0],x[1]]);render();}; $('invites-back').onclick=()=>go('billing');$('invites-next').onclick=()=>go('review'); }
  if (view === 'review') { $('review-back').onclick=()=>go('invites'); $('create').onclick=()=>{if(!$('terms').checked)return $('error').textContent='Accept the Terms.';state.terms=true;state.created=true;state.receipt=${JSON.stringify(WORKSPACE_FINAL.receipt)};commit();go('done');}; }
}
history.replaceState({view}, '', location.pathname); render();`);

// ---- casework --------------------------------------------------------------

const CASES = Array.from({ length: 30 }, (_, i) => ({ id: `c${String(i + 1).padStart(2, '0')}`, team: i < 20 ? 'west' : 'east', owner: 'None', status: 'open' }));
const CASE_EDITS: Record<string, [string, string]> = { c04: ['Ada', 'waiting'], c09: ['Lin', 'resolved'], c14: ['Kai', 'waiting'], c19: ['Ada', 'resolved'] };
const caseLedgerBase = (revision = 5) => ({ cases: CASES.map((c) => [c.id, ...(CASE_EDITS[c.id] ?? [c.owner, c.status])]), queue: { team: 'west', q: '', sort: 'id', page: 2 }, saved: true, completed: true, pending: 0, revision });
const CASE_RECEIPT = receipt('CW', caseLedgerBase());
const caseLedger = (revision = 5) => ({ ...caseLedgerBase(revision), receipt: CASE_RECEIPT });

const caseworkPage = (variant: 'off' | 'on'): string => chrome('Case Desk', 'Casework queue', `<h1>Casework</h1><p id="notice" role="status"></p><div id="view"></div>`, String.raw`
const variant=${JSON.stringify(variant)}, $=(id)=>document.getElementById(id);
const cases=${JSON.stringify(CASES)}.map((x)=>({...x})); let queue={team:'west',q:'',sort:'id',page:1}, view='queue', selected='', revision=0, saved=false;
const ledger=()=>({cases:cases.map((c)=>[c.id,c.owner,c.status]),queue:{...queue},saved,completed:saved,pending:0,revision,receipt:saved?${JSON.stringify(CASE_RECEIPT)}:''});
window.__fixtureLong=(kind,reason)=>({revision,entityId:selected||'queue:cases',operationId:'casework-'+view,mutations:[],pending:0,ledger:ledger()});
const commit=()=>{revision++;window.__fixtureNotify('commit');};
const nav=(next, push=true)=>{view=next;if(push)history.pushState({view,queue:{...queue},selected},'', '/live-long/casework/'+variant+'/'+next);render();};
window.addEventListener('popstate',(e)=>{const s=e.state||{};view=s.view||'queue';queue=s.queue||queue;selected=s.selected||''; if(variant==='on') $('view').replaceChildren(); render();});
function render(){ $('notice').textContent='Queue: '+queue.team+' · page '+queue.page; if(view==='queue'){const rows=cases.filter((c)=>c.team===queue.team).sort((a,b)=>a.id.localeCompare(b.id)).slice((queue.page-1)*10,queue.page*10);$('view').innerHTML='<section aria-label="Case queue"><label for="team">Team</label><select id="team"><option value="west"'+(queue.team==='west'?' selected':'')+'>West</option><option value="east"'+(queue.team==='east'?' selected':'')+'>East</option></select><label for="sort">Sort</label><select id="sort"><option value="id">ID</option></select><button id="apply">Apply queue</button><table><tbody>'+rows.map((c)=>'<tr><td>'+c.id+'</td><td>'+c.owner+'</td><td>'+c.status+'</td><td><button data-open="'+c.id+'">Open '+c.id+'</button></td></tr>').join('')+'</tbody></table><button id="prev">Previous</button><button id="next">Next</button><button id="back-history">Back</button><button id="forward-history">Forward</button><button id="summary">Save summary</button></section>';}else if(view==='detail'){const c=cases.find((x)=>x.id===selected);$('view').innerHTML='<section aria-label="Case '+c.id+'"><h2>'+c.id+'</h2><label for="owner">Owner</label><select id="owner">'+['None','Ada','Lin','Kai'].map((x)=>'<option'+(x===c.owner?' selected':'')+'>'+x+'</option>').join('')+'</select><label for="status">Status</label><select id="status">'+['open','waiting','resolved'].map((x)=>'<option'+(x===c.status?' selected':'')+'>'+x+'</option>').join('')+'</select><button id="save-case">Save case</button><button id="return">Return to queue</button><button id="back-history">Back</button><button id="forward-history">Forward</button></section>';}else $('view').innerHTML='<section aria-label="Saved summary"><h2>Casework summary saved</h2><p>Receipt '+${JSON.stringify(CASE_RECEIPT)}+'</p></section>';bind();}
function bind(){const historyControls=()=>{$('back-history').onclick=()=>history.back();$('forward-history').onclick=()=>history.forward();};if(view==='queue'){$('apply').onclick=()=>{queue.team=$('team').value;queue.sort=$('sort').value;queue.page=1;nav('queue');};$('view').onclick=(e)=>{const id=e.target.dataset.open;if(id){selected=id;nav('detail');}};$('prev').onclick=()=>{queue.page=Math.max(1,queue.page-1);nav('queue');};$('next').onclick=()=>{queue.page=Math.min(2,queue.page+1);nav('queue');};historyControls();$('summary').onclick=()=>{if(queue.team!=='west'||queue.page!==2)return $('notice').textContent='Return to West page 2 first.';if(cases.some((c)=>{const wanted=${JSON.stringify(CASE_EDITS)}[c.id];return wanted&&(c.owner!==wanted[0]||c.status!==wanted[1]);}))return $('notice').textContent='Complete all four case edits.';saved=true;commit();nav('summary');};}else if(view==='detail'){$('save-case').onclick=()=>{const c=cases.find((x)=>x.id===selected);c.owner=$('owner').value;c.status=$('status').value;commit();$('notice').textContent='Saved '+c.id;};$('return').onclick=()=>nav('queue');historyControls();}}
history.replaceState({view,queue:{...queue},selected},'',location.pathname);render();`);

// ---- budgets ---------------------------------------------------------------

const BUDGET_FINAL = { departments: [['Engineering', 120000, 'Ada', true], ['Sales', 80000, 'Lin', false], ['Operations', 60000, 'Kai', true]], rules: [['Ben', 30000, true], ['Mei', 50000, true]], published: true, completed: true, pending: 0, revision: 6, receipt: '' };
BUDGET_FINAL.receipt = receipt('BG', { ...BUDGET_FINAL, receipt: '' });
const budgetsPage = (variant: 'off' | 'on'): string => chrome('Budget Office', 'Department budgets', `<h1>Budget configuration</h1><p id="status" role="status"></p><div id="view"></div>`, String.raw`
const variant=${JSON.stringify(variant)}, $=(id)=>document.getElementById(id);const names=['Engineering','Sales','Operations'];let departments=Object.fromEntries(names.map((x)=>[x,{cap:0,owner:'',carryover:false}])),rules=[],tab='Engineering',view='departments',revision=0,published=false;
const ledger=()=>({departments:names.map((n)=>[n,departments[n].cap,departments[n].owner,departments[n].carryover]),rules:rules.map((r)=>[r.person,r.limit,r.twofa]),published,completed:published,pending:0,revision,receipt:published?${JSON.stringify(BUDGET_FINAL.receipt)}:''});window.__fixtureLong=(kind,reason)=>({revision,entityId:'department:'+tab,operationId:'budget-'+view,mutations:[],pending:0,ledger:ledger()});const commit=()=>{revision++;window.__fixtureNotify('commit');};const go=(n)=>{view=n;history.pushState({view,tab},'', '/live-long/budgets/'+variant+'/'+n);render();};window.addEventListener('popstate',(e)=>{view=e.state?.view||'departments';tab=e.state?.tab||tab;render();});
function render(){if(view==='departments'){$('view').innerHTML='<section aria-label="Departments" role="tablist">'+names.map((n)=>'<button role="tab" aria-selected="'+(n===tab)+'" data-tab="'+n+'">'+n+'</button>').join('')+'</section><section aria-label="'+tab+' budget"><p>Selected department: '+tab+'</p><label for="limit">Limit</label><input id="limit" type="number" value="'+departments[tab].cap+'"><label for="owner">Owner</label><select id="owner"><option value=""></option><option>Ada</option><option>Lin</option><option>Kai</option></select><label><input id="carry" type="checkbox"'+(departments[tab].carryover?' checked':'')+'> Carryover</label><button id="save">Save</button><button id="approvals">Approvals</button></section>'; $('owner').value=departments[tab].owner;}else if(view==='approvals')$('view').innerHTML='<section aria-label="Approvals"><label for="approver">Approver</label><select id="approver"><option>Ben</option><option>Mei</option></select><label for="threshold">Threshold</label><input id="threshold" type="number"><label><input id="twofa" type="checkbox"> Require 2FA</label><button id="add-rule">Create rule</button><ul>'+rules.map((r)=>'<li>'+r.person+' '+r.limit+' 2FA '+r.twofa+'</li>').join('')+'</ul><button id="review">Review</button></section>';else if(view==='review')$('view').innerHTML='<section aria-label="Review"><p>'+rules.length+' approval rules ready.</p><button id="publish">Publish budgets</button></section>';else $('view').innerHTML='<section aria-label="Published"><h2>Budgets published</h2><p>Receipt '+${JSON.stringify(BUDGET_FINAL.receipt)}+'</p></section>';bind();}
function bind(){if(view==='departments'){$('view').onclick=(e)=>{const n=e.target.dataset.tab;if(n){tab=n;if(variant==='on'){render();}else render();}};$('save').onclick=()=>{departments[tab]={cap:Number($('limit').value),owner:$('owner').value,carryover:$('carry').checked};commit();$('status').textContent=tab+' saved.';};$('approvals').onclick=()=>go('approvals');}else if(view==='approvals'){$('add-rule').onclick=()=>{const r={person:$('approver').value,limit:Number($('threshold').value),twofa:$('twofa').checked};if(!r.limit||!r.twofa||rules.some((x)=>x.person===r.person))return;rules.push(r);commit();render();};$('review').onclick=()=>go('review');}else if(view==='review')$('publish').onclick=()=>{if(names.some((n)=>!departments[n].cap||!departments[n].owner)||rules.length!==2)return;published=true;commit();go('published');}}
history.replaceState({view,tab},'',location.pathname);render();`);

// ---- dispatch --------------------------------------------------------------

const ORDERS = Array.from({ length: 32 }, (_, i) => ({ id: `q${String(i + 1).padStart(2, '0')}`, quantity: 0, carrier: '', service: '', dispatched: false }));
const PREP: Record<string, [number, string, string]> = { q03: [2, 'Post', 'Ground'], q11: [1, 'Courier', 'Express'], q19: [3, 'Post', 'Ground'], q27: [2, 'Courier', 'Express'] };
const dispatchLedger = (revision: number) => ({ orders: ORDERS.map((o) => [o.id, ...(PREP[o.id] ?? [0, '', '']), Boolean(PREP[o.id])]), staged: [], receipt: receipt('DP', PREP), completed: true, pending: 0, revision });
const dispatchPage = (variant: 'off' | 'on'): string => chrome('Outbound Desk', 'Dispatch queue', `<h1>Outbound dispatch</h1><p id="status" role="status"></p><div id="view"></div>`, String.raw`
const variant=${JSON.stringify(variant)}, $=(id)=>document.getElementById(id), orders=${JSON.stringify(ORDERS)}.map((x)=>({...x}));let view='queue',current='',staged=[],revision=0,pending=0,receipt='';const route=()=>location.pathname.match(/\/live-long\/dispatch\/(?:off|on)\/(queue|detail|outbound|receipt)$/)?.[1];const ledger=()=>({orders:orders.map((o)=>[o.id,o.quantity,o.carrier,o.service,o.dispatched]),staged:[...staged],receipt,completed:Boolean(receipt),pending,revision});window.__fixtureLong=(kind,reason)=>({revision,entityId:current||'outbound',operationId:'dispatch-'+view,mutations:[],pending,ledger:ledger()});const stateKey='live-long:dispatch:'+sessionStorage.getItem('__fixture_attempt')+':'+variant,saved=JSON.parse(sessionStorage.getItem(stateKey)||'null');if(saved){for(const [id,quantity,carrier,service,dispatched] of saved.orders)Object.assign(orders.find((x)=>x.id===id),{quantity,carrier,service,dispatched});staged=saved.staged;receipt=saved.receipt;revision=saved.revision;}const commit=()=>{revision++;sessionStorage.setItem(stateKey,JSON.stringify(ledger()));window.__fixtureNotify('commit');};const go=(n)=>{view=n;history.pushState({view,current},'', '/live-long/dispatch/'+variant+'/'+n);render();};
function render(){if(view==='queue')$('view').innerHTML='<section aria-label="Dispatch queue"><label for="search">Search order</label><input id="search"><button id="find">Find</button><button id="outbound">Outbound</button><p>Staged: '+staged.length+'</p></section>';else if(view==='detail'){const o=orders.find((x)=>x.id===current);$('view').innerHTML='<section aria-label="Order '+o.id+'"><h2>'+o.id+'</h2><label for="quantity">Quantity</label><input id="quantity" type="number" value="'+o.quantity+'"><label for="carrier">Carrier</label><select id="carrier"><option></option><option>Post</option><option>Courier</option></select><label for="service">Service</label><select id="service"><option></option><option>Ground</option><option>Express</option></select><button id="stage">Stage order</button><button id="return">Return</button></section>';$('carrier').value=o.carrier;$('service').value=o.service;}else if(view==='outbound')$('view').innerHTML='<section aria-label="Outbound"><p>'+staged.join(', ')+'</p><button id="dispatch">Dispatch staged orders</button></section>';else $('view').innerHTML='<section aria-label="Dispatch receipt"><h2>Orders dispatched</h2><p>Receipt '+receipt+'</p></section>';bind();}
function bind(){if(view==='queue'){$('find').onclick=()=>{const id=$('search').value.trim().toLowerCase();if(orders.some((x)=>x.id===id)){current=id;go('detail');}};$('outbound').onclick=()=>go('outbound');}else if(view==='detail'){$('stage').onclick=()=>{const o=orders.find((x)=>x.id===current);const q=Number($('quantity').value),c=$('carrier').value,s=$('service').value;if(!q||!c||!s)return;o.quantity=q;o.carrier=c;o.service=s;if(!staged.includes(o.id))staged.push(o.id);commit();$('status').textContent=o.id+' staged.';};$('return').onclick=()=>go('queue');}else if(view==='outbound')$('dispatch').onclick=()=>{if(staged.length!==4)return;$('status').textContent='Dispatching revision '+(revision+1)+'…';pending=1;if(variant==='on'){setTimeout(()=>{commit();$('status').textContent='Queue revision '+revision+' received.';},225);}setTimeout(()=>{for(const id of staged)orders.find((x)=>x.id===id).dispatched=true;staged=[];pending=0;receipt=${JSON.stringify(receipt('DP', PREP))};commit();go('receipt');},450);}}
const restore=(e)=>{view=route()||e?.state?.view||'queue';current=e?.state?.current||current;if(view==='detail'&&!orders.some((x)=>x.id===current))view='queue';render();};window.addEventListener('popstate',restore);window.addEventListener('hashchange',()=>restore());history.replaceState({view,current},'',location.pathname);restore();`);

type Expected = Record<'off' | 'on', unknown>;
const EXPECTED: Record<string, Expected> = {
  workspace: { off: { workspace: WORKSPACE_FINAL, completed: true, pending: 0, revision: 1 }, on: { workspace: WORKSPACE_FINAL, completed: true, pending: 0, revision: 1 } },
  casework: { off: caseLedger(), on: caseLedger() },
  budgets: { off: BUDGET_FINAL, on: BUDGET_FINAL },
  dispatch: { off: dispatchLedger(5), on: dispatchLedger(6) },
};
const NEAR: Record<string, unknown> = {
  workspace: { ...EXPECTED.workspace.off as object, workspace: { ...WORKSPACE_FINAL, invites: [['kai@northwind.test', 'member'], ['lin@northwind.test', 'admin'], ['sam@northwind.test', 'member']] } },
  casework: { ...caseLedger(), queue: { team: 'east', q: '', sort: 'id', page: 1 } },
  budgets: { ...BUDGET_FINAL, departments: [['Engineering', 120000, 'Kai', true], ['Sales', 80000, 'Lin', false], ['Operations', 60000, 'Ada', true]] },
  dispatch: { ...dispatchLedger(5), orders: dispatchLedger(5).orders.map((o: any) => o[0] === 'q19' ? ['q19', 0, '', '', false] : o[0] === 'q20' ? ['q20', 3, 'Post', 'Ground', true] : o) },
};
const finalView: Record<string, string> = { workspace: 'done', casework: 'summary', budgets: 'published', dispatch: 'receipt' };
const checker = (name: string, variant: 'off' | 'on', expected: unknown) => (events: FixtureObservation[]) => {
  const terminal = longTerminalObservation(events);
  if (!terminal?.long?.ledger) return { ok: false, details: 'no terminal long ledger' };
  const path = `/live-long/${name}/${variant}/${finalView[name]}`;
  const routePath = (value: string | undefined) => value?.split(/[?#]/, 1)[0];
  if (routePath(terminal.path) !== path || routePath(terminal.long.url) !== path) return { ok: false, details: `terminal route is ${terminal.path}` };
  if (!terminal.text.includes('Receipt') && name !== 'workspace') return { ok: false, details: 'confirmation is not visible' };
  if (name === 'workspace' && !terminal.text.includes('Workspace created')) return { ok: false, details: 'workspace confirmation is not visible' };
  const ledger = terminal.long.ledger as any;
  if (!ledger.completed || ledger.pending !== 0) return { ok: false, details: 'workflow is not settled' };
  if (terminal.long.revision !== ledger.revision) return { ok: false, details: 'terminal revision does not match the ledger revision' };
  return same(withoutRevision(ledger), withoutRevision(expected)) ? true : { ok: false, details: 'terminal ledger differs from the full expected state' };
};

const wsWalk = (variant: 'off' | 'on'): LongFixtureCase['walkthrough'] => [
  { op: 'goto', target: `/live-long/workspace/${variant}/company` }, { op: 'type', target: '#company', value: 'Northwind Labs' }, { op: 'select', target: '#size', value: '51-200' }, { op: 'select', target: '#country', value: 'DE' }, { op: 'type', target: '#vat', value: 'DE123456789' }, { op: 'click', target: '#company-next' }, { op: 'type', target: '#first', value: 'Ada' }, { op: 'type', target: '#last', value: 'Byron' }, { op: 'type', target: '#email', value: 'ada@northwind.test' }, { op: 'type', target: '#phone', value: '+49 30 1234567' }, { op: 'click', target: '#admin-next' }, { op: 'check', target: 'input[value=growth]' }, { op: 'check', target: 'input[value=yearly]' }, { op: 'check', target: '#separate' }, { op: 'type', target: '#billing-email', value: 'billing@northwind.test' }, { op: 'click', target: '#billing-next' }, { op: 'type', target: '#invite-email', value: 'lin@northwind.test' }, { op: 'select', target: '#invite-role', value: 'admin' }, { op: 'click', target: '#add-invite' }, { op: 'type', target: '#invite-email', value: 'kai@northwind.test' }, { op: 'click', target: '#add-invite' }, { op: 'type', target: '#invite-email', value: 'taylor@northwind.test' }, { op: 'click', target: '#add-invite' }, { op: 'click', target: '[data-remove="0"]' }, { op: 'click', target: '#invites-next' }, { op: 'check', target: '#terms' }, { op: 'click', target: '#create' },
];
const caseWalk = (variant: 'off' | 'on'): LongFixtureCase['walkthrough'] => {
  const actions: LongFixtureCase['walkthrough'] = [{ op: 'goto', target: `/live-long/casework/${variant}/queue` }, { op: 'select', target: '#team', value: 'west' }, { op: 'click', target: '#apply' }];
  for (const [index, [id, [owner, status]]] of Object.entries(CASE_EDITS).entries()) { if (index === 2) actions.push({ op: 'click', target: '#next' }); actions.push({ op: 'click', target: `[data-open="${id}"]` }, { op: 'select', target: '#owner', value: owner }, { op: 'select', target: '#status', value: status }, { op: 'click', target: '#save-case' }, { op: 'click', target: '#return' }); }
  actions.push({ op: 'click', target: '#back-history' }, { op: 'click', target: '#forward-history' }, { op: 'click', target: '#next' }, { op: 'click', target: '#summary' }); return actions;
};
const budgetWalk = (variant: 'off' | 'on'): LongFixtureCase['walkthrough'] => {
  const actions: LongFixtureCase['walkthrough'] = [{ op: 'goto', target: `/live-long/budgets/${variant}/departments` }];
  for (const [name, cap, owner, carry] of BUDGET_FINAL.departments) { actions.push({ op: 'click', target: `[data-tab="${name}"]` }, { op: 'type', target: '#limit', value: String(cap) }, { op: 'select', target: '#owner', value: owner }); if (carry) actions.push({ op: 'check', target: '#carry' }); actions.push({ op: 'click', target: '#save' }); }
  actions.push({ op: 'click', target: '#approvals' }, { op: 'select', target: '#approver', value: 'Ben' }, { op: 'type', target: '#threshold', value: '30000' }, { op: 'check', target: '#twofa' }, { op: 'click', target: '#add-rule' }, { op: 'select', target: '#approver', value: 'Mei' }, { op: 'type', target: '#threshold', value: '50000' }, { op: 'check', target: '#twofa' }, { op: 'click', target: '#add-rule' }, { op: 'click', target: '#review' }, { op: 'click', target: '#publish' }); return actions;
};
const dispatchWalk = (variant: 'off' | 'on'): LongFixtureCase['walkthrough'] => {
  const actions: LongFixtureCase['walkthrough'] = [{ op: 'goto', target: `/live-long/dispatch/${variant}/queue` }];
  for (const [id, [quantity, carrier, service]] of Object.entries(PREP)) actions.push({ op: 'type', target: '#search', value: id }, { op: 'click', target: '#find' }, { op: 'type', target: '#quantity', value: String(quantity) }, { op: 'select', target: '#carrier', value: carrier }, { op: 'select', target: '#service', value: service }, { op: 'click', target: '#stage' }, { op: 'click', target: '#return' });
  actions.push({ op: 'click', target: '#outbound' }, { op: 'click', target: '#dispatch' }); return actions;
};

const defs = [
  ['workspace', 27, 'Removing the draft invite compacts the remaining invite rows.', wsWalk, 'Workspace created'],
  ['casework', 32, 'A browser-history popstate rebuilds the queue/detail DOM while retaining queue state.', caseWalk, 'Casework summary saved'],
  ['budgets', 28, 'Selecting a tab rebinds the shared Limit, Owner, and Save controls to that department.', budgetWalk, 'Budgets published'],
  ['dispatch', 32, 'Dispatching staged orders delivers delayed intermediate queue revisions before acknowledgement.', dispatchWalk, 'Orders dispatched'],
] as const;

export const LONG_WORKFLOWS_CASES: LongFixtureCase[] = defs.flatMap(([name, referenceActions, description, walkthrough, confirmation]) =>
  (['off', 'on'] as const).map((variant) => ({
    id: `llf-${name}-${variant}`, name, variant, seed: FROZEN_SEED, devSeed: DEVELOPMENT_SEED,
    startPath: `/live-long/${name}/${variant}/${name === 'workspace' ? 'company' : name === 'casework' ? 'queue' : name === 'budgets' ? 'departments' : 'queue'}`,
    prompt: (base) => `${base}/live-long/${name}/${variant}/${name === 'workspace' ? 'company' : name === 'casework' ? 'queue' : name === 'budgets' ? 'departments' : 'queue'} Complete the requested ${name} workflow and report the displayed receipt.`,
    expected: clone(EXPECTED[name]![variant]), nearMiss: { name: name === 'workspace' ? 'sam remains while taylor is missing' : name === 'casework' ? 'queue restored to East page 1' : name === 'budgets' ? 'Engineering and Operations owners swapped' : 'q20 receives q19 preparation', ledger: clone(NEAR[name]!) },
    check: checker(name, variant, EXPECTED[name]![variant]),
    milestones: name === 'workspace' ? [{ name: 'company/admin valid', predicate: (l) => l.workspace?.company?.[0] === 'northwind labs' && l.workspace?.admin?.[0] === 'ada' }, { name: 'billing valid', predicate: (l) => l.workspace?.plan === 'growth' && l.workspace?.cycle === 'yearly' }, { name: 'exact invites', predicate: (l) => same(l.workspace?.invites, WORKSPACE_FINAL.invites) }, { name: 'workspace created', predicate: (l) => l.completed === true }] : name === 'casework' ? [{ name: 'West queue', predicate: (l) => l.queue?.team === 'west' }, { name: 'two cases', predicate: (l) => l.cases?.filter((c: any) => CASE_EDITS[c[0]] && c[1] === CASE_EDITS[c[0]][0] && c[2] === CASE_EDITS[c[0]][1]).length >= 2 }, { name: 'four cases', predicate: (l) => l.cases?.filter((c: any) => CASE_EDITS[c[0]] && c[1] === CASE_EDITS[c[0]][0] && c[2] === CASE_EDITS[c[0]][1]).length === 4 }, { name: 'queue restored', predicate: (l) => same(l.queue, caseLedger().queue) }] : name === 'budgets' ? [{ name: 'departments saved', predicate: (l) => l.departments?.every((d: any) => d[1] > 0) }, { name: 'rules exact', predicate: (l) => same(l.rules, BUDGET_FINAL.rules) }, { name: 'published', predicate: (l) => l.published === true }] : [{ name: 'two staged', predicate: (l) => l.staged?.length >= 2 }, { name: 'four staged', predicate: (l) => l.staged?.length === 4 }, { name: 'dispatch receipt', predicate: (l) => l.completed && l.staged?.length === 0 }],
    hazard: { trigger: name === 'dispatch' ? 'dispatch staged orders' : name === 'workspace' ? 'remove an invite' : name === 'casework' ? 'Back or Forward history event' : 'select a department tab', description }, referenceActions,
    walkthrough: walkthrough(variant), answer: { receiptPattern: `${name === 'workspace' ? 'WS' : name === 'casework' ? 'CW' : name === 'budgets' ? 'BG' : 'DP'}-\\d{4}` },
  })));

export function longWorkflowsInitialState(name: string, seed = FROZEN_SEED): unknown {
  void seed;
  if (name === 'workspace') return clone({ workspace: WORKSPACE_BASE, completed: false, pending: 0, revision: 0 });
  if (name === 'casework') return clone({ cases: CASES.map((c) => [c.id, c.owner, c.status]), queue: { team: 'west', q: '', sort: 'id', page: 1 }, saved: false, completed: false, pending: 0, revision: 0 });
  if (name === 'budgets') return clone({ departments: ['Engineering', 'Sales', 'Operations'].map((n) => [n, 0, '', false]), rules: [], published: false, completed: false, pending: 0, revision: 0 });
  if (name === 'dispatch') return clone({ orders: ORDERS.map((o) => [o.id, 0, '', '', false]), staged: [], receipt: '', completed: false, pending: 0, revision: 0 });
  return null;
}

export function longWorkflowsRoute(path: string): { body: string; type: string } | null {
  const parts = routeParts(path);
  if (!parts) return null;
  const body = parts.name === 'workspace' ? workspacePage(parts.variant) : parts.name === 'casework' ? caseworkPage(parts.variant) : parts.name === 'budgets' ? budgetsPage(parts.variant) : dispatchPage(parts.variant);
  return { body, type: 'text/html; charset=utf-8' };
}
