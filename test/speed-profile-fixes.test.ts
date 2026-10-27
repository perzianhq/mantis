import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { translate } from '../src/translate.js';
import { fixture, idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const dataPage = (body: string): string => `data:text/html,${encodeURIComponent(`<!doctype html><meta charset="utf-8"><body>${body}</body>`)}`;
const withTiming = async (run: () => Promise<void>): Promise<string[]> => {
  const old = process.env.MANTIS_TIMING;
  const lines: string[] = [];
  const write = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => {
    lines.push(String(chunk));
    return true;
  });
  process.env.MANTIS_TIMING = '1';
  try {
    await run();
    return lines.filter((line) => line.startsWith('mantis timing '));
  } finally {
    write.mockRestore();
    if (old === undefined) delete process.env.MANTIS_TIMING;
    else process.env.MANTIS_TIMING = old;
  }
};

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

it('re-settles a route whose content has not painted yet, but skips the retry when it paints at once', async () => {
  const origin = 'https://route.test';
  const delayedStart = dataPage(`
    <main><button id="route">Open delayed route</button></main>
    <script>
      document.querySelector('#route').onclick = () => {
        history.pushState({}, '', '/delayed');
        const started = performance.now();
        const paint = (now) => {
          if (now - started < 600) return requestAnimationFrame(paint);
          document.title = 'Delayed destination';
          document.body.innerHTML = '<main><h1>Delayed destination</h1><p>Rendered after route change</p></main>';
        };
        requestAnimationFrame(paint);
      };
    </script>
  `);
  const immediateStart = dataPage(`
    <main><button id="route">Open immediate route</button></main>
    <script>
      document.querySelector('#route').onclick = () => {
        history.pushState({}, '', '/immediate');
        document.title = 'Immediate destination';
        document.body.innerHTML = '<main><h1>Immediate destination</h1><p>Rendered at once</p></main>';
      };
    </script>
  `);
  const fixtureBody = (url: string): string => decodeURIComponent(url.slice('data:text/html,'.length));
  const page = await pageOf();
  await page.route(`${origin}/**`, (route) => route.fulfill({
    body: fixtureBody(new URL(route.request().url()).search === '?immediate' ? immediateStart : delayedStart),
    contentType: 'text/html',
  }));
  try {
    let view = await browser.open(`${origin}/start`);
    let clicked = '';
    const routeTiming = await withTiming(async () => { clicked = await browser.click(idOf(view, 'button "Open delayed route"')); });
    expect(clicked).toContain('Delayed destination');
    expect(clicked).toContain('Rendered after route change');
    expect(routeTiming).not.toHaveLength(0);
    expect(routeTiming.every((line) => / routeRetry=1\/(?:changed|same)\n$/.test(line))).toBe(true);

    view = await browser.open(`${origin}/start?immediate`);
    let immediate = '';
    const immediateTiming = await withTiming(async () => { immediate = await browser.click(idOf(view, 'button "Open immediate route"')); });
    expect(immediate).toContain('Immediate destination');
    expect(immediateTiming).not.toHaveLength(0);
    // Near miss: a route whose content is already painted does not need a retry.
    expect(immediateTiming.every((line) => !line.includes(' routeRetry='))).toBe(true);
  } finally {
    await page.unroute(`${origin}/**`);
  }
});

it('keeps paired offscreen detail facts but drops bare table headers and caps labelled rows', async () => {
  await browser.open(fixture('offscreen-labelled.html'));
  const snap = await browser.snapshot();
  const header = snap.nodes.find((node) => node.name === 'Repeated table header');
  expect(header?.inViewport, JSON.stringify(header)).toBe(false);
  const view = translate(snap, 900);
  for (let i = 1; i <= 6; i++) {
    expect(view).toContain(`Detail ${i}`);
    expect(view).toContain(`Value ${i}`);
  }
  expect(view).not.toContain('Repeated table header');
  expect(view).toContain('Metric 4');
  // Near miss: the next paired row is beyond the twenty offscreen labelled-node allowance.
  expect(view).not.toContain('Metric 5');
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
