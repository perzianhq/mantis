import type { ElementHandle } from 'playwright';
import { describeElement } from './fallback/media.js';
import type { ChartData } from './fallback/probe.js';

/** Bounded source and response limits; projection never becomes a bulk scraper. */
export const PROJECT_MAX_LIMIT = 100;
export const PROJECT_DEFAULT_LIMIT = 25;
export const PROJECT_MAX_COLUMNS = 40;
export const PROJECT_MAX_SOURCE_ROWS = 500;
export const PROJECT_MAX_SCAN_NODES = 5_000;
export const PROJECT_MAX_OUTPUT_CHARS = 16_000;
export type ProjectKind = 'auto' | 'table' | 'list' | 'chart';
export interface ProjectRequest { kind?: ProjectKind; fields?: string[]; offset?: number; cursor?: string; limit?: number; }

type Result = { error: string } | {
  kind: Exclude<ProjectKind, 'auto'>; source: 'rendered-dom' | 'chart-library'; fields: string[];
  offset: number; limit: number; total: number; total_is_lower_bound: boolean; revision: string;
  next_offset: number | null; next_cursor: string | null; truncated: boolean; truncation: string | null;
  rows: Array<{ index: number; cells: Record<string, string>; actions: Array<{ id: number; role: string; name: string }> }>;
};

/** Serialized page-side extraction over one explicitly grounded element only. */
const PROJECT = new Function('el', 'input', `
// Reserve response framing space from the public 16k cap.
const MAX_COL=${PROJECT_MAX_COLUMNS},MAX_ROWS=${PROJECT_MAX_SOURCE_ROWS},MAX_SCAN=${PROJECT_MAX_SCAN_NODES},MAX_OUT=${PROJECT_MAX_OUTPUT_CHARS - 512};let scans=0,capped=false,valueCapped=false;
const clean=x=>String(x??'').replace(/\\s+/g,' ').trim(),cut=(x,n=240)=>{x=clean(x);if(x.length<=n)return x;valueCapped=true;return x.slice(0,n-1).trimEnd()+'…'},parent=x=>x.parentElement||(x.getRootNode() instanceof ShadowRoot?x.getRootNode().host:null);
const hidden=x=>{for(let n=x;n;n=parent(n)){if(n.hasAttribute('hidden')||n.hasAttribute('inert')||n.getAttribute('aria-hidden')==='true')return true;const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||s.visibility==='collapse'||parseFloat(s.opacity)===0)return true}return false};
const shown=x=>x instanceof Element&&x.isConnected&&x.getClientRects().length>0&&!hidden(x),matches=(x,s)=>{try{return x.matches(s)}catch{return false}};
const all=root=>{const out=[];const visit=n=>{for(let i=0;i<(n.children?.length||0);i++){if(scans++>=MAX_SCAN){capped=true;return}const c=n.children[i];out.push(c);visit(c);if(c.shadowRoot)visit(c.shadowRoot);if(capped)return}};visit(root);return out};
const visibleText=root=>{if(!root)return '';const out=[];const visit=n=>{if(n.nodeType===3){if(n.parentElement&&shown(n.parentElement))out.push(n.textContent);return}if(n instanceof Element&&!shown(n))return;for(let i=0;i<(n.childNodes?.length||0);i++){if(scans++>=MAX_SCAN){capped=true;return}visit(n.childNodes[i]);if(capped)return}if(n.shadowRoot)visit(n.shadowRoot)};visit(root);return clean(out.join(' '))};
const directMatches=(root,selector,max)=>{const out=[];for(let i=0;i<(root.children?.length||0);i++){if(scans++>=MAX_SCAN||out.length>=max){capped=true;break}const child=root.children[i];if(matches(child,selector))out.push(child)}return out};
const reg=()=>window.__mantis||(window.__mantis={ids:new WeakMap(),next:(window.__mantisBase||0)+1,byId:new Map()}),id=n=>{const r=reg();let v=r.ids.get(n);if(v===undefined){v=r.next++;r.ids.set(n,v);r.byId.set(v,new WeakRef(n))}return v};
const role=n=>n.getAttribute('role')||(n.localName==='a'?'link':n.localName==='button'?'button':n.localName==='select'?'combobox':n.localName==='textarea'?'textbox':n.localName==='input'?(n.type==='checkbox'?'checkbox':n.type==='radio'?'radio':'textbox'):n.localName);
const actionName=n=>{if(n instanceof HTMLInputElement&&/password|hidden/i.test(n.type))return '';const named=n.getAttribute('aria-label')||n.getAttribute('title');if(named)return cut(named,120);if(n instanceof HTMLInputElement){if(/^(button|submit|reset)$/i.test(n.type))return cut(n.value,120);return cut(Array.from(n.labels||[]).map(visibleText).join(' '),120)}return cut(visibleText(n),120)};
const actions=row=>[row,...all(row)].filter(n=>shown(n)&&matches(n,'a[href],button,input:not([type=hidden]),select,textarea,[role=button],[role=link],[role=menuitem],[tabindex]:not([tabindex="-1"])')).slice(0,12).flatMap(n=>{const name=actionName(n);return name?[{id:id(n),role:role(n),name}]:[]});
const unique=hs=>{const used=new Set();return hs.map((h,i)=>{const b=cut(h,120)||'Column '+(i+1);let n=1,key=b;while(used.has(key))key=b+' ['+(++n)+']';used.add(key);return key})};
const select=fields=>{const picked=[];for(const want of input.fields||fields){const found=fields.find(x=>x.toLocaleLowerCase()===want.toLocaleLowerCase());if(!found)return{error:'unknown field "'+want+'"; available fields: '+fields.join(', ')};if(!picked.includes(found))picked.push(found)}return{fields:picked}};
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')};
const output=(kind,source,fields,raw,sourceTruncated,sourceNode)=>{const chosen=select(fields);if(chosen.error)return chosen;let stamp=(window.__mantisDoc||location.href)+'|'+id(sourceNode)+'|'+kind+'|'+chosen.fields.join('|')+'|'+fields.join('|');for(const row of raw)stamp+='|'+JSON.stringify(row.cells);const revision=hash(stamp);let start=input.offset;
 if(input.cursor){if(input.offsetProvided)return{error:'cursor and offset cannot be combined; use the cursor returned by the prior page'};const m=/^p1:([0-9a-f]{8}):(\\d+)$/.exec(input.cursor);if(!m)return{error:'invalid project cursor'};if(m[1]!==revision)return{error:'project cursor is stale because the document/source changed; start a new projection'};start=Number(m[2])}if(start>raw.length)return{error:'project offset is past the currently rendered source'};let end=Math.min(raw.length,start+input.limit);
 const build=()=>{const rows=raw.slice(start,end).map((r,i)=>{const cells={};for(const field of chosen.fields)cells[field]=cut(r.cells[field]||'');return{index:start+i,cells,actions:r.node?actions(r.node):(r.actions||[])}});const partial=sourceTruncated||valueCapped;return{kind,source,fields:chosen.fields,offset:start,limit:input.limit,total:raw.length,total_is_lower_bound:sourceTruncated,revision,next_offset:end<raw.length?end:null,next_cursor:end<raw.length?'p1:'+revision+':'+end:null,truncated:partial,truncation:sourceTruncated?'source scan capped; total is a lower bound':valueCapped?'field text capped':null,rows}};let result=build(),trimmed=false;while(result.rows.length&&JSON.stringify(result).length>MAX_OUT){end--;trimmed=true;result=build()}if(trimmed){result.truncated=true;result.truncation=result.truncation?result.truncation+'; output capped at '+MAX_OUT+' chars':'output capped at '+MAX_OUT+' chars'}return result};
const ancestor=(node,query)=>{for(let n=node;n;n=parent(n))if(matches(n,query))return n;return null};
const oneDesc=(node,query)=>{const found=all(node).filter(n=>shown(n)&&matches(n,query));return found.length===1?found[0]:null};
const kind=input.kind||'auto',table=kind==='list'||kind==='chart'?null:(ancestor(el,'table,[role=table],[role=grid]')||oneDesc(el,'table,[role=table],[role=grid]'));
if(table){const thead=table.querySelector('thead'),headerRows=thead?directMatches(thead,'tr',MAX_ROWS).filter(shown):[];const heads=headerRows.length?headerRows:[table.querySelector('tr')].filter(Boolean);if(!heads.length)return{error:'target table has no header row'};const grid=heads.map(row=>{const xs=[];for(const cell of directMatches(row,'th,td',MAX_COL)){for(let n=0;n<Math.max(1,cell.colSpan||1)&&xs.length<MAX_COL;n++)xs.push(cut(visibleText(cell),120))}return xs});const widest=Math.max(...grid.map(x=>x.length),0),width=Math.min(MAX_COL,widest);if(!width)return{error:'target table has no columns'};const fields=unique(Array.from({length:width},(_,i)=>grid.map(r=>r[i]).filter(Boolean).filter((x,j,a)=>a.indexOf(x)===j).join(' / ')));const rows=all(table).filter(r=>matches(r,'tr,[role=row]')&&shown(r)&&!heads.includes(r));const raw=rows.slice(0,MAX_ROWS).map(row=>{const cells=directMatches(row,'th,td,[role=cell],[role=rowheader],[role=gridcell]',MAX_COL);const values={};for(let i=0;i<fields.length;i++)values[fields[i]]=cut(visibleText(cells[i]),120);return{node:row,cells:values}});return output('table','rendered-dom',fields,raw,capped||rows.length>MAX_ROWS||widest>MAX_COL,table)}
const chart=kind==='table'||kind==='list'?null:(ancestor(el,'canvas,svg,img,[role=img]')||oneDesc(el,'canvas,svg,img,[role=img]'));
if(chart){const raw=[],charts=input.charts||[];chartLoop:for(let ci=0;ci<charts.length;ci++){if(scans++>=MAX_SCAN){capped=true;break}const c=charts[ci];if(c.truncated)capped=true;const series=c.series||[];for(let si=0;si<series.length;si++){if(scans++>=MAX_SCAN){capped=true;break chartLoop}const s=series[si];for(let i=0;i<Math.max(c.labels?.length||0,s.values?.length||0);i++){if(raw.length>=MAX_ROWS||scans++>=MAX_SCAN){capped=true;break chartLoop}raw.push({cells:{series:String(s.name||''),category:String(c.labels?.[i]??i+1),value:String(s.values?.[i]??'')},actions:[]})}}}if(raw.length)return output('chart','chart-library',['series','category','value'],raw,capped,chart);const text=[chart,...all(chart)].filter(n=>shown(n)&&(n===chart||matches(n,'text,[aria-label],title'))).map(n=>cut(n.getAttribute('aria-label')||visibleText(n))).filter(Boolean).slice(0,MAX_ROWS);if(!text.length)return{error:'target chart exposes no structured or rendered text; use data(), ocr(), or look() as appropriate'};return output('chart','rendered-dom',['text'],text.map(x=>({cells:{text:x},actions:[]})),capped,chart)}
const list=kind==='table'||kind==='chart'?null:(ancestor(el,'ol,ul,[role=list],[role=feed]')||oneDesc(el,'ol,ul,[role=list],[role=feed]')||(kind==='list'?el:null));if(list){const direct=n=>{const rows=[];for(let i=0;i<(n.children?.length||0);i++){if(scans++>=MAX_SCAN||rows.length>=MAX_ROWS){capped=true;break}const child=n.children[i];if(shown(child)&&(matches(child,'li,[role=listitem]')||matches(child,'a[href],button,[role=button],[role=link]')))rows.push(child)}return rows};let rows=direct(list);if(!rows.length){const nested=all(list).map(x=>direct(x)).filter(x=>x.length>=2).sort((a,b)=>b.length-a.length);rows=nested[0]||[]}const cutRows=rows.slice(0,MAX_ROWS);if(!cutRows.length)return{error:'target list has no currently rendered items'};return output('list','rendered-dom',['item'],cutRows.map(node=>({node,cells:{item:cut(visibleText(node))}})),capped||rows.length>MAX_ROWS,list)}
return{error:kind==='auto'?'target is not one unambiguous table, list/feed, or chart; provide kind and a narrower target':'target does not contain a '+kind+' projection source'};
`) as (el: Element, input: { kind: ProjectKind; fields?: string[]; offset: number; offsetProvided: boolean; cursor?: string; limit: number; charts: ChartData[] }) => Result;

/** Mirrors capture's rendered-source gating before chart probing can inspect a library instance. */
const PROJECT_SOURCE_VISIBLE = (node: Element): boolean => {
  const parent = (el: Element): Element | null =>
    el.parentElement ?? (el.getRootNode() instanceof ShadowRoot ? (el.getRootNode() as ShadowRoot).host : null);
  if (!node.isConnected || !node.getClientRects().length) return false;
  for (let el: Element | null = node; el; el = parent(el)) {
    if (el.getAttribute('aria-hidden') === 'true' || (el as HTMLElement).inert) return false;
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.contentVisibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
  }
  const style = getComputedStyle(node);
  if (style.visibility !== 'visible') return false;
  const rect = node.getBoundingClientRect();
  const docW = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
  const docH = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
  return rect.width > 0 && rect.height > 0 && rect.right + scrollX > 0 && rect.bottom + scrollY > 0 &&
    rect.left + scrollX < docW && rect.top + scrollY < docH;
};

export async function projectElement(el: ElementHandle<Element>, request: Required<Pick<ProjectRequest, 'kind' | 'offset' | 'limit'>> & Pick<ProjectRequest, 'fields' | 'cursor'> & { offsetProvided: boolean }): Promise<Result> {
  if (!await el.evaluate(PROJECT_SOURCE_VISIBLE)) return { error: 'target is not visibly rendered; project only reads currently rendered sources' };
  // Keep chart-library probing structurally bounded before it crosses the page boundary.
  const data = request.kind === 'table' || request.kind === 'list' ? [] : await describeElement(el, PROJECT_MAX_SOURCE_ROWS);
  return el.evaluate(PROJECT, { ...request, charts: data.flatMap((item) => item.charts) });
}
export function formatProjection(label: string, result: Result): string {
  if ('error' in result) return `error: ${result.error}`;
  // The extractor budgets before formatting, but enforce the public response cap as a final
  // invariant too (including a caller-supplied selector label and JSON framing).
  const target = label.length > 240 ? `${label.slice(0, 239)}…` : label;
  const projected = result as Exclude<Result, { error: string }>;
  const serialize = () => JSON.stringify({ target, ...projected });
  let text = serialize();
  while (text.length > PROJECT_MAX_OUTPUT_CHARS && projected.rows.length) {
    projected.rows.pop();
    projected.truncated = true;
    projected.truncation = projected.truncation
      ? `${projected.truncation}; response capped at ${PROJECT_MAX_OUTPUT_CHARS} chars`
      : `response capped at ${PROJECT_MAX_OUTPUT_CHARS} chars`;
    const next = projected.offset + projected.rows.length;
    projected.next_offset = next < projected.total ? next : null;
    projected.next_cursor = projected.next_offset === null ? null : `p1:${projected.revision}:${next}`;
    text = serialize();
  }
  // All retained fields are independently bounded, so an empty-page envelope fits the cap.
  return text;
}
