import { afterAll, beforeAll, expect, it } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const dataPage = (body: string): string => `data:text/html,${encodeURIComponent(`<!doctype html><body>${body}</body>`)}`;

it('uses a target validation scan as the action before snapshot, but still rejects a changed target', async () => {
  const view = await browser.open(dataPage('<button onclick="document.body.append(\' done\')">Run</button>'));
  const timing = { tool: 'click', start: performance.now(), phases: new Map<string, number>(), scans: new Map<string, number>() };
  (browser as unknown as { timing: typeof timing | null }).timing = timing;
  expect(await browser.click(idOf(view, 'button "Run"'))).toContain('done');
  expect(timing.scans.get('before') ?? 0).toBe(0);
  expect(timing.scans.get('target')).toBe(1);
  expect(timing.scans.get('after')).toBe(1);
  (browser as unknown as { timing: typeof timing | null }).timing = null;

  const stale = await browser.open(dataPage('<button aria-label="Original">Go</button>'));
  const page = await pageOf();
  await page.evaluate(() => document.querySelector('button')!.setAttribute('aria-label', 'Replacement'));
  // Near miss: reusing the scan must not let a repurposed numbered target receive a click.
  expect(await browser.click(idOf(stale, 'button "Original"'))).toContain('changed from button "Original" to button "Replacement"');
});

it('preserves repeated control discovery with cached geometry and selector probes', async () => {
  const view = await browser.open(dataPage(`
    <section>${Array.from({ length: 12 }, (_, i) => `<button>Choice ${i + 1}</button>`).join('')}</section>
    <button style="display:none">Hidden near miss</button>
  `));
  for (let i = 1; i <= 12; i++) expect(view).toContain(`Choice ${i}`);
  // Near miss: caching does not turn a non-rendered control into visible output.
  expect(view).not.toContain('Hidden near miss');
});

it('returns the page view when a client router changes the route, but a diff for a same-route change', async () => {
  const spa = dataPage(`<h1>Home</h1><button id="go" onclick="document.title='Detail';document.body.innerHTML='<h1>Detail page</h1><p>Specs table</p>'">Open detail</button><button id="same" onclick="document.body.append(' more text')">Add</button>`);
  const view = await browser.open(spa);
  const routed = await browser.click(idOf(view, 'button "Open detail"'));
  expect(routed).toContain('Detail page');
  expect(routed).not.toMatch(/call read\(\)/);
  // Near miss: a change on the same route and title keeps the compact diff.
  const view2 = await browser.open(spa);
  const same = await browser.click(idOf(view2, 'button "Add"'));
  expect(same).not.toContain('Detail page');
});

it('names the landed URL after back() and warns when the earlier query string was lost', async () => {
  const origin = 'http://localhost';
  const page = await pageOf();
  await page.route('**/*', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body><h1>Results</h1></body>' }));
  try {
    await browser.open(`${origin}/list`);
    await browser.open(`${origin}/list?q=books&page=2`);
    const lost = await browser.back();
    // Landed on /list (no query): the earlier history entry differs, so the agent is told how to return.
    expect(lost).toContain(`went back to ${origin}/list`);
    expect(lost).toContain('note: the query string of the earlier page was not restored');
    expect(lost).toContain(`open(${origin}/list?q=books&page=2)`);
    // Near miss: landing on a page whose query is as long as the one left gives no warning.
    await browser.open(`${origin}/a?x=1`);
    await browser.open(`${origin}/b?x=1`);
    expect(await browser.back()).not.toContain('note:');
  } finally {
    await page.unroute('**/*');
  }
});
