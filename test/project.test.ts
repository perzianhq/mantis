import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture } from './helpers.js';
import { startFixtures } from '../bench/fixtures.js';
import { V2_DEVELOPMENT_CHECKS, v2DevelopmentRoute } from '../bench/fixtures-v2-development.js';

const browser = new MantisBrowser({ actionTimeoutMs: 1500 });
let fixtures: Awaited<ReturnType<typeof startFixtures>>;

const project = async (args: Parameters<MantisBrowser['project']>[1] & { id?: number; selector?: string }) => {
  const { id, selector, ...request } = args;
  const result = await browser.project({ id, selector }, request);
  if (result.startsWith('error:')) throw new Error(result);
  return JSON.parse(result) as { target: string; kind: string; source: string; fields: string[]; offset: number; limit: number; total: number; revision: string; next_offset: number | null; next_cursor: string | null; truncated: boolean; truncation: string | null; rows: Array<{ index: number; cells: Record<string, string>; actions: Array<{ id: number; role: string; name: string }> }> };
};

beforeAll(async () => {
  fixtures = await startFixtures({ checks: V2_DEVELOPMENT_CHECKS, developmentRoute: v2DevelopmentRoute });
});
afterAll(async () => { await fixtures.close(); await browser.close(); });

describe('project()', () => {
  it('projects source rows before formatting, with deterministic fields, bounds, and continuation', async () => {
    const html = `<!doctype html><table id="ledger"><thead><tr><th>Key</th><th>Amount</th><th>Owner</th></tr></thead><tbody>${Array.from({ length: 4 }, (_, i) => `<tr><th>row-${i + 1}</th><td>${(i + 1) * 10}</td><td>Owner ${i + 1}</td></tr>`).join('')}</tbody></table>`;
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const first = await project({ selector: '#ledger', fields: ['amount', 'Key'], offset: 1, limit: 2 });
    expect(first).toMatchObject({ kind: 'table', source: 'rendered-dom', fields: ['Amount', 'Key'], offset: 1, limit: 2, total: 4, next_offset: 3 });
    expect(first.rows.map((row) => row.cells)).toEqual([{ Amount: '20', Key: 'row-2' }, { Amount: '30', Key: 'row-3' }]);
    const next = await project({ selector: '#ledger', offset: first.next_offset!, limit: 2 });
    expect(next.rows.map((row) => row.cells.Key)).toEqual(['row-4']);
  });

  it('returns actionable provenance without acting, and rejects unknown fields and invalid bounds', async () => {
    const html = '<!doctype html><div id="feed"><div><button id="one" onclick="document.body.dataset.chosen=\'one\'">One</button><button id="two">Two</button></div></div>';
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const rows = await project({ selector: '#feed', kind: 'list', offset: 0, limit: 1 });
    expect(rows).toMatchObject({ kind: 'list', total: 2, next_offset: 1 });
    expect(rows.rows[0]!.actions[0]).toMatchObject({ role: 'button', name: 'One' });
    const page = (browser as unknown as { page: { evaluate: <T>(fn: () => T) => Promise<T> } }).page;
    expect(await page.evaluate(() => document.body.dataset.chosen ?? null)).toBeNull();
    await browser.click(rows.rows[0]!.actions[0]!.id);
    expect(await page.evaluate(() => document.body.dataset.chosen)).toBe('one');
    expect(await browser.project({ selector: '#feed' }, { kind: 'list', fields: ['missing'] })).toMatch(/^error: unknown field/);
    expect(await browser.project({ selector: '#feed' }, { kind: 'list', offset: -1 })).toBe('error: offset must be a non-negative integer');
    expect(await browser.project({ selector: '#feed' }, { kind: 'list', limit: 101 })).toBe('error: limit must be an integer from 1 to 100');
  });

  it('excludes hidden and inert controls and never uses typed/password values as provenance names', async () => {
    const html = `<!doctype html><div id="feed" role="list"><button>Visible action</button><button hidden>Hidden action</button><button aria-hidden="true">ARIA hidden action</button><div inert><button>Inert action</button></div><label>Account <input value="private account value"></label><label>Secret <input type="password" value="private password"></label></div>`;
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const row = (await project({ selector:'#feed', kind:'list' })).rows[0]!;
    expect(row.actions).toEqual([{ id: expect.any(Number), role:'button', name:'Visible action' }]);
    expect(JSON.stringify(row.actions)).not.toContain('private');
  });

  it('uses composed visible descendant text for cells, feed items, and action names', async () => {
    const html = `<!doctype html>
      <table id="t"><tr><th>Value</th></tr><tr><td>Public cell <span hidden>SECRET_CELL</span><span style="opacity:0">SECRET_OPACITY_CELL</span></td></tr></table>
      <ul id="feed"><li>Public item <span aria-hidden="true">SECRET_ITEM</span><span style="opacity:0">SECRET_OPACITY_ITEM</span><button>Visible action <span hidden>SECRET_ACTION</span><span style="opacity:0">SECRET_OPACITY_ACTION</span></button></li></ul>`;
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const table = await project({ selector:'#t', kind:'table' });
    const feed = await project({ selector:'#feed', kind:'list' });
    expect(table.rows[0]!.cells.Value).toBe('Public cell');
    expect(feed.rows[0]!.cells.item).toContain('Public item Visible action');
    expect(feed.rows[0]!.actions[0]!.name).toBe('Visible action');
    expect(JSON.stringify({ table, feed })).not.toContain('SECRET_');
  });

  it('qualifies duplicate headers without overwriting associations', async () => {
    const html = '<!doctype html><table id="t"><thead><tr><th>Q1</th><th>Q1 [2]</th><th>Q1</th><th>Owner</th></tr></thead><tbody><tr><td>north</td><td>south</td><td>east</td><td>Ada</td></tr></tbody></table>';
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const output = await project({ selector:'#t', kind:'table' });
    expect(output.fields).toEqual(['Q1','Q1 [2]','Q1 [3]','Owner']);
    expect(output.rows[0]!.cells).toEqual({ Q1:'north', 'Q1 [2]':'south', 'Q1 [3]':'east', Owner:'Ada' });
  });

  it('binds cursors to the rendered source revision and rejects a mutation', async () => {
    const html = '<!doctype html><table id="t"><thead><tr><th>Key</th></tr></thead><tbody><tr><td>one</td></tr><tr><td>two</td></tr><tr><td>three</td></tr></tbody></table>';
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const first = await project({ selector:'#t', limit:1 });
    expect(first.next_cursor).toMatch(/^p1:/);
    const page = (browser as unknown as { page: { evaluate: <T>(fn: () => T) => Promise<T> } }).page;
    await page.evaluate(() => { document.querySelector('tbody')!.firstElementChild!.textContent = 'changed'; });
    expect(await browser.project({ selector:'#t' }, { cursor:first.next_cursor! })).toContain('project cursor is stale');
  });

  it('binds cursors to the document and exact grounded source, not merely identical content', async () => {
    const table = '<table><tr><th>Key</th></tr><tr><td>one</td></tr><tr><td>two</td></tr></table>';
    await browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><section id="one">${table}</section><section id="two">${table}</section>`));
    const first = await project({ selector:'#one', limit:1 });
    expect(await browser.project({ selector:'#two' }, { cursor:first.next_cursor! })).toContain('project cursor is stale');
    await browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><section id="one">${table}</section>`));
    expect(await browser.project({ selector:'#one' }, { cursor:first.next_cursor! })).toContain('project cursor is stale');
  });

  it('rejects ambiguous selectors and truthfully caps source columns, scan work, and output', async () => {
    const tables = '<table class="source"><tr><th>A</th></tr><tr><td>1</td></tr></table><table class="source"><tr><th>A</th></tr><tr><td>2</td></tr></table>';
    await browser.open('data:text/html,' + encodeURIComponent('<!doctype html>' + tables));
    expect(await browser.project({ selector:'.source' }, {})).toMatch(/^error: selector ".source" matches 2 sources/);
    const columns = Array.from({length:45},(_,i)=>`<th>C${i}</th>`).join('');
    const cells = Array.from({length:45},(_,i)=>`<td>${i}</td>`).join('');
    await browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><table id="wide"><thead><tr>${columns}</tr></thead><tbody>${Array.from({length:550},()=>`<tr>${cells}</tr>`).join('')}</tbody></table>`));
    const capped = await project({ selector:'#wide', limit:100 });
    expect(capped.fields).toHaveLength(40); expect(capped.total).toBeLessThanOrEqual(500);
    expect(capped.truncated).toBe(true); expect(capped.truncation).toMatch(/capped/);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(16_000);
  });

  it('never exceeds the public output cap, including one huge row or huge header enumeration', async () => {
    const huge = 'x'.repeat(30_000);
    const headers = Array.from({length:5_100},(_,i)=>`<th>Header ${i}</th>`).join('');
    await browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><table id="large"><thead><tr>${headers}</tr></thead><tbody><tr><td>${huge}</td></tr></tbody></table>`));
    const capped = await project({ selector:'#large', limit:1 });
    expect(capped.truncated).toBe(true);
    expect(capped.truncation).toMatch(/capped/);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(16_000);
    expect(capped.fields.length).toBeLessThanOrEqual(40);
  });

  it('uses only chart-library data when exposed and does not invent canvas values', async () => {
    await browser.open(fixture('chart.html'));
    const chart = await project({ selector: '#c', kind: 'chart', fields: ['series', 'category', 'value'], offset: 1, limit: 2 });
    expect(chart).toMatchObject({ kind: 'chart', source: 'chart-library', fields: ['series', 'category', 'value'], offset: 1, limit: 2 });
    expect(chart.rows.map((row) => row.cells)).toEqual([
      { series: 'Sales', category: 'Feb', value: '20' },
      { series: 'Sales', category: 'Mar', value: '30' },
    ]);
  });

  it('bounds chart-library extraction before it serializes an unbounded dataset', async () => {
    await browser.open(fixture('chart.html'));
    const page = (browser as unknown as { page: { evaluate: <T>(fn: () => T) => Promise<T> } }).page;
    await page.evaluate(() => {
      const chart = (window as unknown as { Chart: { getChart: (target: string) => { data: { labels: string[]; datasets: Array<{ data: number[] }> }; update: () => void } } }).Chart.getChart('c');
      chart.data.labels = Array.from({ length: 6_000 }, (_, i) => `month-${i}`);
      chart.data.datasets[0]!.data = Array.from({ length: 6_000 }, (_, i) => i);
      chart.update();
    });
    const capped = await project({ selector:'#c', kind:'chart', limit:100 });
    expect(capped.total).toBeLessThanOrEqual(500);
    expect(capped.truncated).toBe(true);
    expect(capped.truncation).toMatch(/capped/);
    expect(JSON.stringify(capped).length).toBeLessThanOrEqual(16_000);
  });

  it('rejects an unrendered Chart.js canvas before library probing', async () => {
    await browser.open(fixture('chart.html'));
    const page = (browser as unknown as { page: { evaluate: <T>(fn: () => T) => Promise<T> } }).page;
    await page.evaluate(() => { (document.querySelector('#c') as HTMLElement).style.display = 'none'; });
    expect(await browser.project({ selector:'#c' }, { kind:'chart' })).toBe(
      'error: target is not visibly rendered; project only reads currently rendered sources',
    );
  });

  it('keeps an id-grounded source inside an open shadow root or visible frame', async () => {
    await browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><div id="host"></div><iframe srcdoc="<table><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody><tr><th>frame-row</th><td>9</td><td><button>Frame action</button></td></tr></tbody></table>"></iframe><script>const root=document.querySelector('#host').attachShadow({mode:'open'});root.innerHTML='<table><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody><tr><th>shadow-row</th><td>7</td><td><button>Shadow action</button></td></tr></tbody></table>';</script>`));
    const view = await browser.read({ full: true });
    const shadowId = Number(view.match(/#(\d+) button "Shadow action"/)![1]);
    const frameId = Number(view.match(/#(\d+) button "Frame action"/)![1]);
    expect((await project({ id: shadowId, fields: ['Key', 'Value'] })).rows[0]!.cells).toEqual({ Key: 'shadow-row', Value: '7' });
    expect((await project({ id: frameId, fields: ['Key', 'Value'] })).rows[0]!.cells).toEqual({ Key: 'frame-row', Value: '9' });
  });

  it('works against live local-v2 development table, feed, and SVG sources without touching heldout routes', async () => {
    await browser.open(`${fixtures.base}/v2/table/sort`);
    const table = await project({ selector: 'table', kind: 'table', fields: ['Account', 'Amount'], limit: 2 });
    expect(table).toMatchObject({ kind: 'table', total: 96, next_offset: 2, fields: ['Account', 'Amount'] });

    await browser.open(`${fixtures.base}/v2/list/virtual`);
    const feed = await project({ selector: '#feed', kind: 'list', limit: 3 });
    expect(feed).toMatchObject({ kind: 'list', total: 14, next_offset: 3 });
    expect(feed.rows[0]!.actions[0]).toMatchObject({ role: 'button' });

    await browser.open(`${fixtures.base}/v2/chart/svg`);
    const svg = await project({ selector: 'svg', kind: 'chart', fields: ['text'], limit: 100 });
    expect(svg).toMatchObject({ kind: 'chart', source: 'rendered-dom', fields: ['text'] });
    expect(svg.rows.some((row) => /South Mar \d+/.test(row.cells.text))).toBe(true);
  });
});
