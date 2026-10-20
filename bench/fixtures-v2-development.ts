/**
 * Development-only v2 fixtures.  These are deliberately not imported by the
 * benchmark runner: they exercise the v2 coverage contract without creating a
 * scored manifest or changing the frozen local-v1 suite.
 */
import type { FixtureCheck, FixtureCheckResult, FixtureObservation } from './fixtures.js';

export type V2DevelopmentDomain = 'dense-tables' | 'lists-scrolling' | 'charts-canvas-images';
export type V2DevelopmentFamily =
  | 'sort-row' | 'filtered-cell' | 'wide-column' | 'paginated-record'
  | 'virtual-target' | 'paginated-filter' | 'reordered-item' | 'nested-scroll'
  | 'svg-series' | 'canvas-point' | 'image-fact' | 'responsive-chart';

export interface V2ExpectedState {
  rowKey?: string;
  columnKey?: string;
  value: string;
  state?: unknown;
}

export interface V2DevelopmentCase {
  id: string;
  domain: V2DevelopmentDomain;
  family: V2DevelopmentFamily;
  structuralVariant: string;
  seed: number;
  split: 'development';
  route: string;
  prompt: (base: string) => string;
  expected: V2ExpectedState;
  oracleId: string;
  nearMissId: string;
  /** A concrete wrong answer/state pair from this page, rather than a synthetic suffix. */
  nearMiss: { answer: string; state: unknown };
  check: FixtureCheck;
}

const canonical = (parts: string[]): string => parts.join(' | ').replace(/\s+/g, ' ').trim().toLowerCase();
const answerTriplet = (answer: string, expected: V2ExpectedState): boolean => {
  const required = [expected.rowKey, expected.columnKey, expected.value].filter((part): part is string => !!part);
  // The fixture prompt requires exactly one `row | column | value` final line.
  // Keeping this structured avoids falsely associating a correct number with a
  // different row or accepting a contradictory explanation.
  const submitted = answer
    .split(/\r?\n/)
    .map((line) => line.replace(/^(?:final(?: answer)?|answer):\s*/i, '').trim())
    .filter((line) => line.includes('|'));
  return submitted.length === 1 && canonical(submitted) === canonical(required);
};
const settled = (events: FixtureObservation[]) => events.filter((event) => event.kind === 'settled').at(-1);
const has = (events: FixtureObservation[], predicate: (event: FixtureObservation) => boolean): boolean => events.some(predicate);
const stateIs = (event: FixtureObservation | undefined, state: unknown): boolean => JSON.stringify(event?.fixtureState) === JSON.stringify(state);

/** A small deterministic PRNG keeps fixture data reproducible without Math.random(). */
const random = (seed: number): (() => number) => {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const seededRows = (seed: number, count: number, prefix: string) => {
  const next = random(seed);
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${String(index + 1).padStart(3, '0')}`,
    account: `Account ${String(index + 1).padStart(3, '0')}`,
    status: ['Active', 'Review', 'Paused'][Math.floor(next() * 3)]!,
    amount: 1000 + Math.floor(next() * 8900),
    owner: `Owner ${String(1 + Math.floor(next() * 24)).padStart(2, '0')}`,
    renewal: `2027-${String(1 + Math.floor(next() * 12)).padStart(2, '0')}-${String(1 + Math.floor(next() * 27)).padStart(2, '0')}`,
  }));
};

const tableRows = seededRows(71031, 96, 'ledger');
tableRows[57] = { ...tableRows[57]!, account: 'Account 058', status: 'Review', amount: 8742, owner: 'Owner 17', renewal: '2027-09-14' };
tableRows[73] = { ...tableRows[73]!, account: 'Account 074', status: 'Review', amount: 8742, owner: 'Owner 04', renewal: '2027-02-08' };
const seededValues = (seed: number, count: number, minimum: number, maximum: number): number[] => {
  const next = random(seed);
  return Array.from({ length: count }, () => minimum + Math.floor(next() * (maximum - minimum + 1)));
};
const svgSeriesValues = seededValues(91051, 8, 20, 70);
const SVG_NORTH = svgSeriesValues.slice(0, 4);
const SVG_SOUTH = svgSeriesValues.slice(4);
const canvasSeriesValues = seededValues(91052, 10, 15, 65);
const API_LATENCY = canvasSeriesValues.slice(0, 5);
const WORKER_LATENCY = canvasSeriesValues.slice(5);
const IMAGE_DOCK_MINUTES = seededValues(91053, 2, 12, 35);
const RESPONSIVE_BOOKINGS = seededValues(91054, 4, 105, 205);

const tableCss = `<style>
  body{font:15px/1.4 system-ui,sans-serif;margin:20px;max-width:1000px}button,input,select{font:inherit;margin:4px}.shell{border:1px solid #999;max-height:330px;overflow:auto}.wide{max-width:680px;overflow:auto;border:1px solid #999}table{border-collapse:collapse;min-width:980px;width:100%}th,td{padding:7px 10px;border-bottom:1px solid #ddd;text-align:left;white-space:nowrap}th{position:sticky;top:0;background:#f6f6f6}.pager{display:flex;gap:8px;align-items:center;margin:10px 0}.feed{height:270px;overflow:auto;border:2px solid #346;padding:6px}.item{height:42px;padding:7px;border-bottom:1px solid #ddd;box-sizing:border-box}.spacer{position:relative}.canvas-wrap{max-width:640px;border:1px solid #aaa;padding:8px;resize:horizontal;overflow:auto}.nested{height:250px;overflow:auto;border:3px solid #805ad5;padding:8px}.outer{height:360px;overflow:auto;border:3px solid #2b6cb0;padding:8px}.chart-key{display:flex;gap:16px}.dot{width:12px;height:12px;border-radius:50%;display:inline-block}
</style>`;
const doc = (title: string, body: string, script: string): string => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>${tableCss}</head><body>${body}<script>${script}</script></body></html>`;
const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

const sortTable = (): string => doc('V2 dense table — sort', `<main><h1>Ledger review</h1><p>Sort this dense ledger before reporting the requested record.</p><button id="sort" aria-pressed="false">Sort amount: descending</button><div class="shell"><table><thead><tr><th>Account</th><th>Status</th><th>Amount</th><th>Owner</th></tr></thead><tbody id="rows"></tbody></table></div></main>`, `
const rows=${JSON.stringify(tableRows)}; let descending=false;
function render(){const ordered=[...rows].sort((a,b)=>descending?b.amount-a.amount:a.amount-b.amount);document.querySelector('#rows').innerHTML=ordered.map(r=>'<tr><th scope="row">'+r.account+'</th><td>'+r.status+'</td><td>'+r.amount.toLocaleString('en-US')+'</td><td>'+r.owner+'</td></tr>').join('');window.__fixtureState={sort:descending?'amount-desc':'amount-asc'};}
document.querySelector('#sort').onclick=()=>{descending=!descending;document.querySelector('#sort').setAttribute('aria-pressed',String(descending));render()};render();`);

const filterTable = (): string => doc('V2 dense table — filter', `<main><h1>Exception ledger</h1><label>Status <select id="filter"><option>All</option><option>Review</option><option>Paused</option></select></label><div class="shell"><table><thead><tr><th>Account</th><th>Status</th><th>Amount</th><th>Owner</th></tr></thead><tbody id="rows"></tbody></table></div></main>`, `
const rows=${JSON.stringify(tableRows)};function render(){const f=document.querySelector('#filter').value;const shown=f==='All'?rows:rows.filter(r=>r.status===f);document.querySelector('#rows').innerHTML=shown.map(r=>'<tr><th scope="row">'+r.account+'</th><td>'+r.status+'</td><td>'+r.amount.toLocaleString('en-US')+'</td><td>'+r.owner+'</td></tr>').join('');window.__fixtureState={filter:f};}document.querySelector('#filter').onchange=render;render();`);

const wideTable = (): string => doc('V2 dense table — wide columns', `<main><h1>Renewal export</h1><p>The value is in a rightmost column. Scroll the table itself, not the document.</p><div id="wide" class="wide"><table><thead><tr><th>Account</th><th>Region</th><th>Segment</th><th>Owner</th><th>Forecast</th><th>Notes</th><th>Renewal date</th></tr></thead><tbody>${tableRows.map((row, index) => `<tr><th scope="row">${row.account}</th><td>Region ${index % 7}</td><td>Segment ${index % 4}</td><td>${row.owner}</td><td>${money(row.amount)}</td><td>Routine review</td><td>${row.renewal}</td></tr>`).join('')}</tbody></table></div></main>`, `const wide=document.querySelector('#wide');wide.addEventListener('scroll',()=>{if(wide.scrollLeft>90)window.__fixtureState={wideScrolled:true}});window.__fixtureState={wideScrolled:false};`);

const paginatedTable = (): string => doc('V2 dense table — pagination', `<main><h1>Renewal queue</h1><div class="pager"><button id="previous">Previous</button><span id="page" aria-live="polite"></span><button id="next">Next</button></div><table><thead><tr><th>Record</th><th>Account</th><th>Status</th><th>Amount</th></tr></thead><tbody id="rows"></tbody></table></main>`, `
const rows=${JSON.stringify(tableRows)};let page=0;const size=16;function render(){const slice=rows.slice(page*size,page*size+size);document.querySelector('#rows').innerHTML=slice.map(r=>'<tr><th scope="row">'+r.id+'</th><td>'+r.account+'</td><td>'+r.status+'</td><td>'+r.amount.toLocaleString('en-US')+'</td></tr>').join('');document.querySelector('#page').textContent='Page '+(page+1)+' of '+Math.ceil(rows.length/size);document.querySelector('#previous').disabled=page===0;document.querySelector('#next').disabled=page===Math.ceil(rows.length/size)-1;window.__fixtureState={page:page+1};}document.querySelector('#previous').onclick=()=>{page--;render()};document.querySelector('#next').onclick=()=>{page++;render()};render();`);

const feedRandom = random(81041);
const feedItems = Array.from({ length: 120 }, (_, index) => ({ id: `feed-${String(index + 1).padStart(3, '0')}`, title: `Dispatch ${String(index + 1).padStart(3, '0')}`, note: `Route ${1 + Math.floor(feedRandom() * 8)} dispatch note ${index + 1}` }));
feedItems[86] = { id: 'feed-087', title: 'Dispatch 087', note: 'Escalate to the Tuesday route.' };
const virtualFeed = (): string => doc('V2 virtual feed', `<main><h1>Dispatch feed</h1><p>Pin the requested dispatch after locating it in the feed. Each visible row includes its dispatch ID.</p><div id="feed" class="feed" aria-label="Virtual dispatch feed"><div id="spacer" class="spacer"></div></div><p id="result" role="status"></p></main>`, `
const items=${JSON.stringify(feedItems)}, row=42, feed=document.querySelector('#feed'), spacer=document.querySelector('#spacer');spacer.style.height=(items.length*row)+'px';function render(){const first=Math.max(0,Math.floor(feed.scrollTop/row)-3),last=Math.min(items.length,first+14);spacer.innerHTML=items.slice(first,last).map((item,i)=>'<button style="position:absolute;top:'+((first+i)*row)+'px;left:0;right:0;height:'+row+'px;text-align:left" data-id="'+item.id+'"><strong>'+item.title+'</strong> — '+item.id+' — '+item.note+'</button>').join('');}feed.addEventListener('scroll',render);feed.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const item=items.find(x=>x.id===b.dataset.id);window.__fixtureState={pinned:item.id};document.querySelector('#result').textContent=item.id+' — '+item.title+' pinned.'});window.__fixtureState={pinned:null};render();`);

const filterRandom = random(81042);
const filterItems = Array.from({ length: 48 }, (_, index) => ({ id: `request-${String(index + 1).padStart(3, '0')}`, title: `Request ${String(index + 1).padStart(3, '0')}`, team: ['North', 'South', 'West'][Math.floor(filterRandom() * 3)]! }));
filterItems[31] = { id: 'request-032', title: 'Request 032', team: 'North' };
const FILTER_TARGET_PAGE = Math.floor(filterItems.filter((item) => item.team === 'North').findIndex((item) => item.id === 'request-032') / 5) + 1;
const paginatedFilter = (): string => doc('V2 filtered list', `<main><h1>Requests</h1><label>Team <select id="team"><option>All</option><option>North</option><option>South</option><option>West</option></select></label><div class="pager"><button id="previous">Previous</button><span id="page"></span><button id="next">Next</button></div><ol id="items"></ol><p id="result" role="status"></p></main>`, `
const all=${JSON.stringify(filterItems)};let p=0;const size=5;function shown(){const team=document.querySelector('#team').value;return team==='All'?all:all.filter(x=>x.team===team)}function render(){const data=shown(), pages=Math.ceil(data.length/size);p=Math.min(p,pages-1);document.querySelector('#items').innerHTML=data.slice(p*size,p*size+size).map(x=>'<li><button data-id="'+x.id+'">'+x.title+' ('+x.team+') — '+x.id+'</button></li>').join('');document.querySelector('#page').textContent='Page '+(p+1)+' of '+pages;document.querySelector('#previous').disabled=p===0;document.querySelector('#next').disabled=p===pages-1;window.__fixtureState={team:document.querySelector('#team').value,page:p+1,selected:null};}document.querySelector('#team').onchange=()=>{p=0;render()};document.querySelector('#previous').onclick=()=>{p--;render()};document.querySelector('#next').onclick=()=>{p++;render()};document.querySelector('#items').onclick=e=>{const b=e.target.closest('button');if(!b)return;window.__fixtureState={team:document.querySelector('#team').value,page:p+1,selected:b.dataset.id};document.querySelector('#result').textContent=b.dataset.id+' — '+b.textContent.replace(' — '+b.dataset.id,'')+' selected.'};render();`);

const reorderItems = Array.from({ length: 28 }, (_, index) => ({ id: `case-${String(index + 1).padStart(3, '0')}`, title: index === 19 || index === 23 ? 'Migration review' : `Case ${String(index + 1).padStart(3, '0')}`, priority: 1 + (index % 5) }));
const reorderedList = (): string => doc('V2 reordered list', `<main><h1>Case queue</h1><p>Two cases have the same title. Sort by priority, then choose the one with the requested case key.</p><button id="sort">Sort priority: high first</button><ol id="items"></ol><p id="result"></p></main>`, `
const items=${JSON.stringify(reorderItems)};let sorted=false;function render(){const shown=sorted?[...items].sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id)):items;document.querySelector('#items').innerHTML=shown.map(x=>'<li><button data-id="'+x.id+'">'+x.title+' — '+x.id+' (P'+x.priority+')</button></li>').join('');window.__fixtureState={sorted,selected:null};}document.querySelector('#sort').onclick=()=>{sorted=true;render()};document.querySelector('#items').onclick=e=>{const b=e.target.closest('button');if(!b)return;window.__fixtureState={sorted,selected:b.dataset.id};document.querySelector('#result').textContent=b.dataset.id+' selected.'};render();`);

const nestedItems = Array.from({ length: 80 }, (_, index) => ({ id: `inbox-${String(index + 1).padStart(3, '0')}`, label: `Inbox note ${String(index + 1).padStart(3, '0')}` }));
nestedItems[61] = { id: 'inbox-062', label: 'Inbox note 062 — confirm depot window' };
const nestedScroll = (): string => doc('V2 nested scroll', `<main><h1>Operations inbox</h1><div id="outer" class="outer"><p>Activity above the embedded inbox.</p><p>${'Outer-scroll filler. '.repeat(90)}</p><section><h2>Embedded inbox</h2><div id="inbox" class="nested" aria-label="Nested inbox"><div id="inbox-spacer" class="spacer"></div></div></section><p>Activity below the embedded inbox.</p></div><p id="result"></p></main>`, `
const items=${JSON.stringify(nestedItems)},row=42,inbox=document.querySelector('#inbox'),spacer=document.querySelector('#inbox-spacer');spacer.style.height=(items.length*row)+'px';function render(){const first=Math.max(0,Math.floor(inbox.scrollTop/row)-2),last=Math.min(items.length,first+12);spacer.innerHTML=items.slice(first,last).map((item,i)=>'<button style="position:absolute;top:'+((first+i)*row)+'px;left:0;right:0;height:'+row+'px;text-align:left" data-id="'+item.id+'">'+item.label+' — Archive</button>').join('');}inbox.addEventListener('scroll',render);inbox.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;window.__fixtureState={archived:b.dataset.id};document.querySelector('#result').textContent=b.dataset.id+' archived.'});window.__fixtureState={archived:null};render();`);

const svgSeries = (): string => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr'];
  const points = (series: string, values: number[]) => values.map((value, index) => ({ x: 130 + index * 130, y: 240 - value * 2.2, label: `${series} ${labels[index]} ${value}` }));
  const north = points('North', SVG_NORTH), south = points('South', SVG_SOUTH);
  const path = (points: { x: number; y: number }[]) => points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');
  const ticks = [0, 20, 40, 60, 80];
  return doc('V2 SVG series chart', `<main><h1>Quarterly capacity</h1><p>Read the SVG plot, using its series labels, visible capacity scale, and labeled points.</p><div class="chart-key"><span><i class="dot" style="background:#1769aa"></i> North</span><span><i class="dot" style="background:#c62828"></i> South</span></div><svg role="img" aria-label="Quarterly capacity chart, capacity scale 0 to 80" width="640" height="300" viewBox="0 0 640 300">${ticks.map(value=>`<g><line x1="55" y1="${240-value*2.2}" x2="610" y2="${240-value*2.2}" stroke="#ddd"/><text x="24" y="${245-value*2.2}">${value}</text></g>`).join('')}<line x1="55" y1="250" x2="610" y2="250" stroke="#333"/>${labels.map((label,index)=>`<text x="${130+index*130}" y="275">${label}</text>`).join('')}<path d="${path(north)}" fill="none" stroke="#1769aa" stroke-width="3"/><path d="${path(south)}" fill="none" stroke="#c62828" stroke-width="3"/>${[...north, ...south].map(point=>`<g><circle cx="${point.x}" cy="${point.y}" r="6" tabindex="0" aria-label="${point.label}"><title>${point.label}</title></circle><text x="${point.x+8}" y="${point.y-8}" font-size="12">${point.label.split(' ').at(-1)}</text></g>`).join('')}</svg></main>`, `window.__fixtureState={renderer:'svg'};`);
};

const canvasPoint = (): string => doc('V2 canvas point chart', `<main><h1>Service latency</h1><p>Use the plotted point for the requested weekday and series. The visible table provides the same exact values as the canvas.</p><canvas id="latency" width="620" height="300" aria-label="Service latency chart. Orange circles are API latency; teal squares are worker latency. Vertical scale is milliseconds, 0 to 80."></canvas><table><caption>Service latency (ms)</caption><thead><tr><th>Series</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody><tr><th>API latency</th>${API_LATENCY.map(value=>`<td>${value}</td>`).join('')}</tr><tr><th>Worker latency</th>${WORKER_LATENCY.map(value=>`<td>${value}</td>`).join('')}</tr></tbody></table></main>`, `
const c=document.querySelector('#latency'),x=c.getContext('2d'),api=${JSON.stringify(API_LATENCY)},worker=${JSON.stringify(WORKER_LATENCY)},days=['Mon','Tue','Wed','Thu','Fri'];x.font='14px system-ui';x.strokeStyle='#333';[0,20,40,60,80].forEach(v=>{const y=240-v*2.4;x.strokeStyle='#ddd';x.beginPath();x.moveTo(50,y);x.lineTo(590,y);x.stroke();x.fillStyle='#111';x.fillText(String(v),18,y+4);});x.strokeStyle='#333';x.beginPath();x.moveTo(50,250);x.lineTo(590,250);x.stroke();days.forEach((day,i)=>x.fillText(day,80+i*110,275));function draw(values,color,square){x.strokeStyle=color;x.fillStyle=color;x.beginPath();values.forEach((value,i)=>{const px=90+i*110,py=240-value*2.4;if(i)x.lineTo(px,py);else x.moveTo(px,py);});x.stroke();values.forEach((value,i)=>{const px=90+i*110,py=240-value*2.4;if(square)x.fillRect(px-5,py-5,10,10);else{x.beginPath();x.arc(px,py,6,0,Math.PI*2);x.fill();}x.fillText(String(value),px-8,py-10);})}draw(api,'#d97706',false);draw(worker,'#0f766e',true);window.__fixtureState={renderer:'canvas'};`);

const imageFact = (): string => {
  const image = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320"><rect width="100%" height="100%" fill="#eff6ff"/><text x="42" y="65" font-family="sans-serif" font-size="26">Warehouse incident map</text><circle cx="180" cy="170" r="40" fill="#ef4444"/><text x="125" y="245" font-family="sans-serif" font-size="22">Dock A: ${IMAGE_DOCK_MINUTES[0]} min</text><circle cx="480" cy="170" r="40" fill="#2563eb"/><text x="420" y="245" font-family="sans-serif" font-size="22">Dock C: ${IMAGE_DOCK_MINUTES[1]} min</text></svg>`);
  return doc('V2 image annotation chart', `<main><h1>Incident map</h1><p>The answer is annotated in the report image, rather than in surrounding prose.</p><img src="data:image/svg+xml,${image}" alt="Warehouse incident map with two unlabeled colored markers" width="720" height="320"></main>`, `window.__fixtureState={renderer:'image'};`);
};

const responsiveChart = (): string => doc('V2 responsive chart', `<main><h1>Responsive bookings</h1><p>Resize the chart container if necessary; bars and labels reflow while the datum does not.</p><div class="canvas-wrap"><canvas id="bookings" width="600" height="280" aria-label="Bookings chart with Q1 ${RESPONSIVE_BOOKINGS[0]}, Q2 ${RESPONSIVE_BOOKINGS[1]}, Q3 ${RESPONSIVE_BOOKINGS[2]}, and Q4 ${RESPONSIVE_BOOKINGS[3]}."></canvas></div><table><caption>Bookings by quarter</caption><thead><tr>${['Q1','Q2','Q3','Q4'].map(label=>`<th>${label}</th>`).join('')}</tr></thead><tbody><tr>${RESPONSIVE_BOOKINGS.map(value=>`<td>${value}</td>`).join('')}</tr></tbody></table></main>`, `
const c=document.querySelector('#bookings'),wrap=c.parentElement,values=${JSON.stringify(RESPONSIVE_BOOKINGS)},labels=['Q1','Q2','Q3','Q4'];function draw(){const width=Math.max(320,Math.floor(wrap.clientWidth-16)),height=280;c.width=width;c.height=height;c.style.width=width+'px';const x=c.getContext('2d'),left=42,right=18,base=235,plot=width-left-right,step=plot/values.length,bar=Math.max(28,Math.min(72,step*.62));x.clearRect(0,0,width,height);x.font='15px system-ui';[0,50,100,150,200].forEach(v=>{const y=base-v;x.strokeStyle='#ddd';x.beginPath();x.moveTo(left,y);x.lineTo(width-right,y);x.stroke();x.fillStyle='#111';x.fillText(String(v),5,y+4);});values.forEach((v,i)=>{const px=left+i*step+(step-bar)/2,h=v;x.fillStyle='#4f46e5';x.fillRect(px,base-h,bar,h);x.fillStyle='#111';x.fillText(labels[i],px+(bar-18)/2,260);x.fillText(String(v),px+(bar-22)/2,base-h-9);});}new ResizeObserver(draw).observe(wrap);draw();window.__fixtureState={renderer:'responsive-canvas'};`);

const terminal = (state: unknown) => (events: FixtureObservation[]): boolean => stateIs(settled(events), state);
// Read-only chart questions are complete on navigation: load is a first-class
// observation, so success does not depend on manufacturing an unrelated event.
const readable = (state: unknown) => (events: FixtureObservation[]): boolean => has(events, (event) => (event.kind === 'load' || event.kind === 'settled') && stateIs(event, state));
const V2_CASES: V2DevelopmentCase[] = [
  { id: 'v2-table-sort-row', domain: 'dense-tables', family: 'sort-row', structuralVariant: 'client-side numeric sort in a sticky-header scroll shell', seed: 71031, split: 'development', route: '/v2/table/sort', prompt: b => `Open ${b}/v2/table/sort. Sort Amount descending. For Account 058, report the row key, the Amount column key, and its displayed amount. Reply exactly: row key | column key | value.`, expected: { rowKey: 'Account 058', columnKey: 'Amount', value: '8,742', state: { sort: 'amount-desc' } }, oracleId: 'v2-table-sort-row-oracle', nearMissId: 'v2-table-sort-row-pre-sort-neighbor', nearMiss: { answer: 'Account 074 | Amount | 8,742', state: { sort: 'amount-asc' } }, check: terminal({ sort: 'amount-desc' }) },
  { id: 'v2-table-filtered-cell', domain: 'dense-tables', family: 'filtered-cell', structuralVariant: 'select-driven filter over repeated numeric values', seed: 71031, split: 'development', route: '/v2/table/filter', prompt: b => `Open ${b}/v2/table/filter. Filter to Review. For Account 058, report the row key, Owner column key, and owner value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'Account 058', columnKey: 'Owner', value: 'Owner 17', state: { filter: 'Review' } }, oracleId: 'v2-table-filtered-cell-oracle', nearMissId: 'v2-table-filtered-cell-duplicate-amount', nearMiss: { answer: 'Account 058 | Owner | Owner 04', state: { filter: 'All' } }, check: terminal({ filter: 'Review' }) },
  { id: 'v2-table-wide-column', domain: 'dense-tables', family: 'wide-column', structuralVariant: 'horizontal table scroller with rightmost target column', seed: 71031, split: 'development', route: '/v2/table/wide', prompt: b => `Open ${b}/v2/table/wide. Scroll the table horizontally. For Account 058, report the row key, Renewal date column key, and date. Reply exactly: row key | column key | value.`, expected: { rowKey: 'Account 058', columnKey: 'Renewal date', value: '2027-09-14', state: { wideScrolled: true } }, oracleId: 'v2-table-wide-column-oracle', nearMissId: 'v2-table-wide-column-wrong-scroll-owner', nearMiss: { answer: 'Account 074 | Renewal date | 2027-02-08', state: { wideScrolled: false } }, check: terminal({ wideScrolled: true }) },
  { id: 'v2-table-paginated-record', domain: 'dense-tables', family: 'paginated-record', structuralVariant: 'server-like page controls with stable record keys', seed: 71031, split: 'development', route: '/v2/table/pages', prompt: b => `Open ${b}/v2/table/pages. Go to the page containing ledger-074. Report its row key, Account column key, and account value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'ledger-074', columnKey: 'Account', value: 'Account 074', state: { page: 5 } }, oracleId: 'v2-table-paginated-record-oracle', nearMissId: 'v2-table-paginated-record-wrong-page', nearMiss: { answer: 'ledger-073 | Account | Account 073', state: { page: 4 } }, check: terminal({ page: 5 }) },
  { id: 'v2-list-virtual-target', domain: 'lists-scrolling', family: 'virtual-target', structuralVariant: 'windowed virtual feed with absolute-positioned row recycling', seed: 81041, split: 'development', route: '/v2/list/virtual', prompt: b => `Open ${b}/v2/list/virtual. Find Dispatch 087 and pin it. Report its row key, action column key, and confirmation value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'feed-087', columnKey: 'Pinned', value: 'Dispatch 087 pinned.', state: { pinned: 'feed-087' } }, oracleId: 'v2-list-virtual-target-oracle', nearMissId: 'v2-list-virtual-target-neighbor', nearMiss: { answer: 'feed-086 | Pinned | Dispatch 086 pinned.', state: { pinned: 'feed-086' } }, check: terminal({ pinned: 'feed-087' }) },
  { id: 'v2-list-paginated-filter', domain: 'lists-scrolling', family: 'paginated-filter', structuralVariant: 'filter resets a separately paginated collection', seed: 81042, split: 'development', route: '/v2/list/filter', prompt: b => `Open ${b}/v2/list/filter. Filter to North, then select Request 032. Report its row key, selection column key, and confirmation value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'request-032', columnKey: 'Selected', value: 'Request 032 (North) selected.', state: { team: 'North', page: FILTER_TARGET_PAGE, selected: 'request-032' } }, oracleId: 'v2-list-paginated-filter-oracle', nearMissId: 'v2-list-paginated-filter-stale-pre-filter-item', nearMiss: { answer: 'request-031 | Selected | Request 031 (North) selected.', state: { team: 'North', page: 1, selected: 'request-031' } }, check: terminal({ team: 'North', page: FILTER_TARGET_PAGE, selected: 'request-032' }) },
  { id: 'v2-list-reordered-item', domain: 'lists-scrolling', family: 'reordered-item', structuralVariant: 'duplicate titles after client-side priority reorder', seed: 81043, split: 'development', route: '/v2/list/reordered', prompt: b => `Open ${b}/v2/list/reordered. Sort by priority, then select Migration review with case key case-024. Report the row key, selection column key, and confirmation value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'case-024', columnKey: 'Selected', value: 'case-024 selected.', state: { sorted: true, selected: 'case-024' } }, oracleId: 'v2-list-reordered-item-oracle', nearMissId: 'v2-list-reordered-item-same-title', nearMiss: { answer: 'case-020 | Selected | case-020 selected.', state: { sorted: true, selected: 'case-020' } }, check: terminal({ sorted: true, selected: 'case-024' }) },
  { id: 'v2-list-nested-scroll', domain: 'lists-scrolling', family: 'nested-scroll', structuralVariant: 'nested virtual inbox inside an independently scrolling activity pane', seed: 81044, split: 'development', route: '/v2/list/nested', prompt: b => `Open ${b}/v2/list/nested. In the embedded inbox, archive Inbox note 062. Report its row key, action column key, and confirmation value. Reply exactly: row key | column key | value.`, expected: { rowKey: 'inbox-062', columnKey: 'Archived', value: 'inbox-062 archived.', state: { archived: 'inbox-062' } }, oracleId: 'v2-list-nested-scroll-oracle', nearMissId: 'v2-list-nested-scroll-outer-scroll', nearMiss: { answer: 'inbox-061 | Archived | inbox-061 archived.', state: { archived: 'inbox-061' } }, check: terminal({ archived: 'inbox-062' }) },
  { id: 'v2-chart-svg-series', domain: 'charts-canvas-images', family: 'svg-series', structuralVariant: 'multi-series SVG paths with focusable plotted points', seed: 91051, split: 'development', route: '/v2/chart/svg', prompt: b => `Open ${b}/v2/chart/svg. Report the series key, category key, and value for South in March. Reply exactly: row key | column key | value.`, expected: { rowKey: 'South', columnKey: 'March', value: String(SVG_SOUTH[2]), state: { renderer: 'svg' } }, oracleId: 'v2-chart-svg-series-oracle', nearMissId: 'v2-chart-svg-series-nearby-north-point', nearMiss: { answer: `North | March | ${SVG_NORTH[2]}`, state: { renderer: 'wrong' } }, check: readable({ renderer: 'svg' }) },
  { id: 'v2-chart-canvas-point', domain: 'charts-canvas-images', family: 'canvas-point', structuralVariant: 'canvas polyline with circles and squares for two series', seed: 91052, split: 'development', route: '/v2/chart/canvas', prompt: b => `Open ${b}/v2/chart/canvas. Report the series key, category key, and value for API latency on Friday. Reply exactly: row key | column key | value.`, expected: { rowKey: 'API latency', columnKey: 'Friday', value: String(API_LATENCY[4]), state: { renderer: 'canvas' } }, oracleId: 'v2-chart-canvas-point-oracle', nearMissId: 'v2-chart-canvas-point-nearby-worker-point', nearMiss: { answer: `Worker latency | Friday | ${WORKER_LATENCY[4]}`, state: { renderer: 'wrong' } }, check: readable({ renderer: 'canvas' }) },
  { id: 'v2-chart-image-fact', domain: 'charts-canvas-images', family: 'image-fact', structuralVariant: 'image-backed annotation with intentionally non-answer alt text', seed: 91053, split: 'development', route: '/v2/chart/image', prompt: b => `Open ${b}/v2/chart/image. Read the report image. Report the series key, category key, and value for Dock C. Reply exactly: row key | column key | value.`, expected: { rowKey: 'Dock C', columnKey: 'incident duration', value: `${IMAGE_DOCK_MINUTES[1]} min`, state: { renderer: 'image' } }, oracleId: 'v2-chart-image-fact-oracle', nearMissId: 'v2-chart-image-fact-other-dock', nearMiss: { answer: `Dock A | incident duration | ${IMAGE_DOCK_MINUTES[0]} min`, state: { renderer: 'wrong' } }, check: readable({ renderer: 'image' }) },
  { id: 'v2-chart-responsive', domain: 'charts-canvas-images', family: 'responsive-chart', structuralVariant: 'resize-aware canvas chart with geometry-independent values', seed: 91054, split: 'development', route: '/v2/chart/responsive', prompt: b => `Open ${b}/v2/chart/responsive. Report the series key, category key, and value for Q4 bookings. Reply exactly: row key | column key | value.`, expected: { rowKey: 'Bookings', columnKey: 'Q4', value: String(RESPONSIVE_BOOKINGS[3]), state: { renderer: 'responsive-canvas' } }, oracleId: 'v2-chart-responsive-oracle', nearMissId: 'v2-chart-responsive-q3', nearMiss: { answer: `Bookings | Q3 | ${RESPONSIVE_BOOKINGS[2]}`, state: { renderer: 'wrong' } }, check: readable({ renderer: 'responsive-canvas' }) },
];

export const V2_DEVELOPMENT_CASES = Object.freeze(V2_CASES);
export const V2_DEVELOPMENT_CHECKS = V2_DEVELOPMENT_CASES.map(({ id, check }) => ({ taskId: id, check }));

/** Deterministic development oracle: response claims plus observed terminal state. */
export function gradeV2DevelopmentCase(caseId: string, answer: string, events: FixtureObservation[]): FixtureCheckResult {
  const fixture = V2_DEVELOPMENT_CASES.find((entry) => entry.id === caseId);
  if (!fixture) return { ok: false, details: `unknown v2 development case: ${caseId}` };
  const expected = fixture.expected;
  const answerOk = answerTriplet(answer, expected);
  const state = fixture.check(events);
  const stateResult = typeof state === 'boolean' ? state : state.ok;
  return answerOk && stateResult
    ? { ok: true }
    : { ok: false, details: !answerOk ? 'answer does not contain the required row/series key, column/category key, and normalized value' : 'fixture terminal state does not satisfy the case oracle' };
}

export function v2DevelopmentRoute(path: string): { body: string; type: string } | null {
  const pages: Record<string, () => string> = {
    '/v2/table/sort': sortTable, '/v2/table/filter': filterTable, '/v2/table/wide': wideTable, '/v2/table/pages': paginatedTable,
    '/v2/list/virtual': virtualFeed, '/v2/list/filter': paginatedFilter, '/v2/list/reordered': reorderedList, '/v2/list/nested': nestedScroll,
    '/v2/chart/svg': svgSeries, '/v2/chart/canvas': canvasPoint, '/v2/chart/image': imageFact, '/v2/chart/responsive': responsiveChart,
  };
  const make = pages[path];
  return make ? { body: make(), type: 'text/html; charset=utf-8' } : null;
}
