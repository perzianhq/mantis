import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf, timingCap } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const dataPage = (body: string): string => `data:text/html,${encodeURIComponent(`<!doctype html><body>${body}</body>`)}`;
const elapsed = async (run: () => Promise<string>): Promise<{ text: string; ms: number }> => {
  const start = performance.now();
  const text = await run();
  return { text, ms: performance.now() - start };
};

describe('read capture reuse and timing', () => {
  it('records capture time and reuses a scan across hover/transition events', async () => {
    await browser.open(dataPage('<button>Steady control</button>'));
    const internals = browser as unknown as { last: unknown; timing: { tool: string; start: number; phases: Map<string, number> } | null };
    await (await pageOf()).evaluate(() => document.body.append('force a fresh scan'));
    internals.timing = { tool: 'read', start: performance.now(), phases: new Map() };
    await browser.read();
    expect(internals.timing.phases.get('capture')).toBeGreaterThan(0);
    internals.timing = null;

    const first = internals.last;
    const page = await pageOf();
    await page.evaluate(() => {
      dispatchEvent(new Event('mouseover', { bubbles: true }));
      dispatchEvent(new Event('transitionend', { bubbles: true }));
    });
    await browser.read();
    expect(internals.last).toBe(first);

    // Near miss: an actual DOM change invalidates the reusable scan.
    await page.evaluate(() => document.body.append('changed content'));
    await browser.read();
    expect(internals.last).not.toBe(first);
  });
});

describe('settle busy work grace', () => {
  it('stops an open after a quiet self-rearming timer chain', async () => {
    const { ms } = await elapsed(() => browser.open(dataPage(`
      <main>Ready</main><script>
        const poll = () => setTimeout(poll, 40);
        poll();
      </script>
    `)));
    expect(ms).toBeLessThan(timingCap(1800));
  });

  it('keeps waiting for a late one-shot result during open (near miss)', async () => {
    const { text, ms } = await elapsed(() => browser.open(dataPage(`
      <main>Ready</main><script>setTimeout(() => document.body.append('Late open result'), 1500)</script>
    `)));
    expect(text).toContain('Late open result');
    expect(ms).toBeGreaterThan(1200);
  });

  it('does not let a never-ending action poll consume the full settle cap', async () => {
    const view = await browser.open(dataPage('<button onclick="setInterval(() => {}, 50)">Begin poll</button>'));
    const { text, ms } = await elapsed(() => browser.click(idOf(view, 'Begin poll')));
    expect(text).toContain('clicked');
    expect(ms).toBeLessThan(timingCap(2400));
  });

  it('stops a click after a quiet pending request', async () => {
    const view = await browser.open(dataPage('<button onclick="fetch(\'https://pending.test/click\')">Start request</button>'));
    const page = await pageOf();
    await page.route('https://pending.test/**', async (route) => {
      await new Promise((done) => setTimeout(done, 2000));
      await route.fulfill({ status: 200, body: '{}' }).catch(() => undefined);
    });
    try {
      const { text, ms } = await elapsed(() => browser.click(idOf(view, 'Start request')));
      expect(text).toContain('clicked');
      expect(ms).toBeLessThan(timingCap(1800));
    } finally {
      await page.unroute('https://pending.test/**');
    }
  });

  it('keeps waiting for a 1500ms delayed DOM result from an action (near miss)', async () => {
    const view = await browser.open(dataPage('<button onclick="setTimeout(() => document.body.append(\'Delayed result\'), 1500)">Delay result</button>'));
    const { text, ms } = await elapsed(() => browser.click(idOf(view, 'Delay result')));
    expect(text).toContain('Delayed result');
    expect(ms).toBeGreaterThan(1200);
  });
});

describe('open late-dialog gate', () => {
  it('does not wait for incidental covered or screen-reader-only links', async () => {
    const { ms } = await elapsed(() => browser.open(dataPage(`
      <style>.bar { position: fixed; inset: 0 0 auto; height: 48px; width: 100%; z-index: 2 }</style>
      <a href="#one" style="position:absolute;top:12px;left:20px">Covered once</a>
      <a href="#skip" style="position:absolute;left:-10000px">Skip hidden content</a>
      <div class="bar"></div>
    `)));
    expect(ms).toBeLessThan(timingCap(1100));
  });

  it('waits for a late dialog behind a multi-control backdrop (near miss)', async () => {
    const text = await browser.open(dataPage(`
      <style>.backdrop { position: fixed; inset: 0; z-index: 2 }</style>
      <button>First</button><button>Second</button><button>Third</button><div class="backdrop"></div>
      <script>setTimeout(() => document.body.insertAdjacentHTML('beforeend', '<div role="dialog" style="position:fixed;z-index:3">Late dialog</div>'), 800)</script>
    `));
    expect(text).toContain('Late dialog');
  });

  it('gives up sooner on a covered page that never shows a dialog', async () => {
    const { ms } = await elapsed(() => browser.open(dataPage(`
      <style>.backdrop { position: fixed; inset: 0; z-index: 2 }</style>
      <button>First</button><button>Second</button><button>Third</button><div class="backdrop"></div>
    `)));
    expect(ms).toBeLessThan(timingCap(1400));
  });

  it('near miss: a hydrating page still waits long enough for its controls to enable', async () => {
    const text = await browser.open(dataPage(`
      <button disabled id="a">Alpha</button><button disabled id="b">Beta</button><button disabled id="c">Gamma</button>
      <script>setTimeout(() => document.querySelectorAll('button').forEach((b) => { b.disabled = false }), 1250)</script>
    `));
    const buttons = text.split('\n').filter((line) => /button "(Alpha|Beta|Gamma)"/.test(line));
    expect(buttons).toHaveLength(3);
    expect(buttons.join('\n')).not.toContain('disabled');
  });
});

describe('settle timing reasons', () => {
  const timed = (): { timing: { tool: string; start: number; phases: Map<string, number>; settle?: string } | null } =>
    browser as unknown as { timing: { tool: string; start: number; phases: Map<string, number>; settle?: string } | null };

  it('reports mutation, request, and quiet stop reasons', async () => {
    let view = await browser.open(dataPage('<button onclick="setInterval(() => document.body.append(document.createTextNode(\'x\')), 40)">Mutate forever</button>'));
    timed().timing = { tool: 'click', start: performance.now(), phases: new Map() };
    await browser.click(idOf(view, 'Mutate forever'));
    expect(timed().timing?.settle).toMatch(/^cap-mutations pending=\S+( heldBy=\S+)? quietFor=\d+ms after=\d+ms$/);
    timed().timing = null;

    view = await browser.open(dataPage('<input aria-label="Lookup" oninput="fetch(\'https://pending.test/value\')">'));
    const page = await pageOf();
    await page.route('https://pending.test/**', async (route) => {
      await new Promise((done) => setTimeout(done, 2000));
      await route.fulfill({ status: 200, body: '{}' }).catch(() => undefined);
    });
    timed().timing = { tool: 'type', start: performance.now(), phases: new Map() };
    await browser.type(idOf(view, 'textbox "Lookup"'), 'value');
    expect(timed().timing?.settle).toMatch(/^cap-request pending=req/);
    timed().timing = null;
    await page.unroute('https://pending.test/**');

    await browser.open(dataPage('<main>Still</main>'));
    timed().timing = { tool: 'read', start: performance.now(), phases: new Map() };
    await (browser as unknown as { settle(page: Page): Promise<void> }).settle(await pageOf());
    expect(timed().timing?.settle).toMatch(/^quiet pending=none quietFor=\d+ms after=\d+ms$/);
    timed().timing = null;
  });
});

describe('type request grace', () => {
  it('stops after a quiet second for a pending typeahead request, but keeps a fast rendered result (near miss)', async () => {
    let view = await browser.open(dataPage('<input aria-label="Search" oninput="fetch(\'https://typeahead.test/slow\')">'));
    let page = await pageOf();
    await page.route('https://typeahead.test/slow', async (route) => {
      await new Promise((done) => setTimeout(done, 2000));
      await route.fulfill({ status: 200, body: '{}' }).catch(() => undefined);
    });
    const slow = await elapsed(() => browser.type(idOf(view, 'textbox "Search"'), 'slow'));
    expect(slow.ms).toBeLessThanOrEqual(timingCap(1200));
    await page.unroute('https://typeahead.test/slow');

    view = await browser.open(dataPage('<input aria-label="Search" oninput="fetch(\'https://typeahead.test/fast\').then(() => document.body.append(\'Suggestions ready\'))">'));
    page = await pageOf();
    await page.route('https://typeahead.test/fast', async (route) => {
      await new Promise((done) => setTimeout(done, 300));
      await route.fulfill({ status: 200, body: '{}' }).catch(() => undefined);
    });
    const fast = await browser.type(idOf(view, 'textbox "Search"'), 'fast');
    expect(fast).toContain('Suggestions ready');
    await page.unroute('https://typeahead.test/fast');
  });
});

describe('navigation completion', () => {
  it('keeps a click watcher through settle and returns the navigated view', async () => {
    const view = await browser.open(dataPage('<button onclick="history.pushState({}, \'\', \'#after\'); document.body.innerHTML=\'<main>New click page</main>\'">Go</button>'));
    const text = await browser.click(idOf(view, 'Go'));
    expect(text).toContain('New click page');
    expect(text).not.toMatch(/\n#\d+ button "Go"/);
    expect((await pageOf()).url()).toMatch(/#after$/);
  });

  it('uses submit wording for an unfinished submit, but accepts a committed URL change (near miss)', async () => {
    const internals = browser as unknown as { waitForInFlightNavigation(watch: unknown): Promise<void> };
    const incomplete = { remainingMs: () => 0, hasCommitted: () => false, failureMessage: 'submit was dispatched, but the navigation did not finish in time' };
    await expect(internals.waitForInFlightNavigation(incomplete)).rejects.toThrow('submit was dispatched');

    const committed = { ...incomplete, hasCommitted: () => true };
    await expect(internals.waitForInFlightNavigation(committed)).resolves.toBeUndefined();
  });

  it('returns the observed page after Enter changes the URL', async () => {
    const view = await browser.open(dataPage('<form onsubmit="history.pushState({}, \'\', \'#done\'); document.body.innerHTML=\'<main>Submit complete</main>\'; return false"><label>Query <input></label></form>'));
    const text = await browser.type(idOf(view, 'textbox "Query"'), 'value', true);
    expect(text).toContain('Submit complete');
    expect(text).not.toMatch(/^error:/);
    expect((await pageOf()).url()).toMatch(/#done$/);
  });

  it('does not add a five-second load wait after a committed navigation', async () => {
    const evaluate = vi.fn().mockRejectedValueOnce(new Error('document replaced')).mockResolvedValue(undefined);
    const waitForLoadState = vi.fn().mockResolvedValue(undefined);
    const page = {
      url: vi.fn().mockReturnValueOnce('http://local.test/before').mockReturnValue('http://local.test/after'),
      evaluate,
      waitForLoadState,
    } as unknown as Page;
    const watch = { hasStarted: () => false, hasCommitted: () => true };
    const internals = browser as unknown as { settle(page: Page, afterAction: boolean, watch: unknown): Promise<void> };
    await internals.settle(page, true, watch);
    expect(waitForLoadState).not.toHaveBeenCalled();
  });
});

describe('direct file inputs', () => {
  it('sets a directly targeted file input without opening a chooser', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'mantis-latency-upload-'));
    const file = join(directory, 'note.txt');
    writeFileSync(file, 'sample');
    try {
      const view = await browser.open(fixture('tool-capabilities.html'));
      const result = await browser.upload(idOf(view, 'button "Choose document"'), [file]);
      expect(result).toContain('note.txt');
      expect(await (await pageOf()).evaluate(() => (document.querySelector('#document') as HTMLInputElement).files?.[0]?.name)).toBe('note.txt');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
