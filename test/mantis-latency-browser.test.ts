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
  it('does not let a never-ending action poll consume the full settle cap', async () => {
    const view = await browser.open(dataPage('<button onclick="setInterval(() => {}, 50)">Begin poll</button>'));
    const { text, ms } = await elapsed(() => browser.click(idOf(view, 'Begin poll')));
    expect(text).toContain('clicked');
    expect(ms).toBeLessThan(timingCap(2400));
  });

  it('keeps waiting for a 500ms delayed DOM result (near miss)', async () => {
    const view = await browser.open(dataPage('<button onclick="setTimeout(() => document.body.append(\'Delayed result\'), 500)">Delay result</button>'));
    const { text, ms } = await elapsed(() => browser.click(idOf(view, 'Delay result')));
    expect(text).toContain('Delayed result');
    expect(ms).toBeGreaterThan(timingCap(400));
  });
});

describe('navigation completion', () => {
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
