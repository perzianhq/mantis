import { describe, expect, it, vi } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { capture } from '../src/capture/index.js';
import { fixture } from './helpers.js';

const activePage = (browser: MantisBrowser): Promise<Page> =>
  (browser as unknown as { activePage(): Promise<Page> }).activePage();

async function trackCaptures(browser: MantisBrowser): Promise<{ count(): number; restore(): void }> {
  const frame = (await activePage(browser)).mainFrame();
  const evaluate = frame.evaluate.bind(frame);
  let count = 0;
  const spy = vi.spyOn(frame, 'evaluate').mockImplementation(async (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('JSON.stringify')) count++;
    return evaluate(...args);
  });
  return { count: () => count, restore: () => spy.mockRestore() };
}

const restoredSnapshot = JSON.stringify({
  url: 'about:blank',
  title: 'Restored',
  truncated: false,
  nodes: [{ kind: 'text', role: 'text', name: 'Restored capture content', states: [], parent: -1, depth: 0, inViewport: true, covered: false }],
});

describe('capture resilience', () => {
  it('reuses the open scan for find and read while the page is unchanged', async () => {
    const browser = new MantisBrowser();
    try {
      await browser.open(fixture('capture-resilience.html'));
      const tracked = await trackCaptures(browser);
      try {
        expect(await browser.find('Initial capture content')).toContain('Initial capture content');
        expect(await browser.find('Reusable capture target')).toContain('Reusable capture target');
        expect(await browser.read()).toContain('Initial capture content');
        expect(tracked.count()).toBe(0);
      } finally {
        tracked.restore();
      }
    } finally {
      await browser.close();
    }
  });

  it('rescans after DOM changes, scrolling, and frame-bearing pages', async () => {
    const browser = new MantisBrowser();
    try {
      await browser.open(fixture('capture-resilience.html'));
      let tracked = await trackCaptures(browser);
      try {
        const page = await activePage(browser);
        await page.evaluate(() => { document.getElementById('message')!.textContent = 'Updated capture content'; });
        expect(await browser.find('Updated capture content')).toContain('Updated capture content');
        expect(tracked.count()).toBe(1);
      } finally {
        tracked.restore();
      }

      await browser.open(fixture('capture-resilience.html'));
      tracked = await trackCaptures(browser);
      try {
        const page = await activePage(browser);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))));
        expect(await browser.find('Lower capture content')).toContain('Lower capture content');
        expect(tracked.count()).toBe(1);
      } finally {
        tracked.restore();
      }

      await browser.open(fixture('iframe.html'));
      tracked = await trackCaptures(browser);
      try {
        expect(await browser.find('Card number')).toContain('Card number');
        expect(tracked.count()).toBeGreaterThan(0);
      } finally {
        tracked.restore();
      }
    } finally {
      await browser.close();
    }
  });

  it('retries a torn-down document once and keeps unrelated TypeErrors visible', async () => {
    const evaluate = vi.fn()
      .mockRejectedValueOnce(new TypeError("Cannot read properties of null (reading 'clientWidth')"))
      .mockResolvedValueOnce(restoredSnapshot);
    const waitForLoadState = vi.fn().mockResolvedValue(undefined);
    const frame = { evaluate, waitForLoadState };
    const page = { mainFrame: () => frame } as unknown as Page;

    const snap = await capture(page);
    expect(snap.nodes.map((node) => node.name)).toContain('Restored capture content');
    expect(evaluate).toHaveBeenCalledTimes(2);
    expect(waitForLoadState).toHaveBeenCalledTimes(1);

    const unrelated = new TypeError('unrelated failure');
    const failingEvaluate = vi.fn().mockRejectedValue(unrelated);
    await expect(capture({ mainFrame: () => ({ evaluate: failingEvaluate, waitForLoadState }) } as unknown as Page)).rejects.toBe(unrelated);
    expect(failingEvaluate).toHaveBeenCalledTimes(1);
  });
});
