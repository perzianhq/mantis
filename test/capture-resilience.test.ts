import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { bounded, capture } from '../src/capture/index.js';
import { fixture, idOf, timingCap } from './helpers.js';

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
const frameFixture = readFileSync(fileURLToPath(fixture('generic-stalled-frame.html')), 'utf8');

let frameServer: Server;
let frameBase: string;

beforeAll(async () => {
  frameServer = createServer((request, response) => {
    if (request.url?.startsWith('/fixture')) {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end(frameFixture);
      return;
    }
    if (request.url === '/stalled') return;
    if (request.url === '/ready') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<!doctype html><title>Ready frame</title><main>Ready frame contents</main>');
      return;
    }
    if (request.url === '/many-stalled') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end(`<!doctype html><main>${Array.from({ length: 3 }, () => `<iframe src="${frameBase}/stalled"></iframe>`).join('')}</main>`);
      return;
    }
    response.writeHead(404).end();
  });
  await new Promise<void>((done) => frameServer.listen(0, '127.0.0.1', done));
  frameBase = `http://127.0.0.1:${(frameServer.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise<void>((done, fail) => frameServer.close((error) => error ? fail(error) : done()));
});

const childFrameFixture = (path: string): string =>
  `${frameBase}/fixture?child=${encodeURIComponent(`${frameBase}${path}`)}`;
const delayedChildFrameFixture = (): string => `${frameBase}/fixture?delayed=2500`;

const expectPrompt = (started: number): void => {
  expect(performance.now() - started).toBeLessThan(timingCap(8_000));
};

describe('capture resilience', () => {
  it('bounds a pending promise and clears its timeout after fast and near-limit results', async () => {
    vi.useFakeTimers();
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    try {
      await expect(bounded(Promise.resolve('fast'), 25)).resolves.toBe('fast');
      const nearLimit = bounded(new Promise<string>((resolve) => setTimeout(() => resolve('near limit'), 24)), 25);
      await vi.advanceTimersByTimeAsync(24);
      await expect(nearLimit).resolves.toBe('near limit');

      const pending = bounded(new Promise<never>(() => undefined), 25);
      await vi.advanceTimersByTimeAsync(25);
      await expect(pending).resolves.toBeNull();
      expect(clear).toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      clear.mockRestore();
      vi.useRealTimers();
    }
  });

  it('keeps main-frame actions responsive while a child frame never answers', async () => {
    const browser = new MantisBrowser();
    try {
      let started = performance.now();
      const view = await browser.open(childFrameFixture('/stalled'));
      expectPrompt(started);
      expect(view).toContain('button "Primary action"');
      const primary = idOf(view, 'button "Primary action"');

      started = performance.now();
      await browser.scroll('down');
      expectPrompt(started);

      started = performance.now();
      const changed = await browser.click(primary);
      expectPrompt(started);
      expect(changed).toContain('Primary action complete');

      // read() starts the verification scan too; it must not wait forever on the same child frame.
      started = performance.now();
      expect(await browser.read()).toContain('Primary action complete');
      expectPrompt(started);
    } finally {
      await browser.close();
    }
  }, timingCap(12_000));

  it('includes a healthy child frame without marking the capture partial', async () => {
    const browser = new MantisBrowser();
    try {
      await browser.open(childFrameFixture('/ready'));
      const snap = await browser.snapshot();
      expect(snap.framesSkipped).toBeFalsy();
      expect(snap.nodes.some((node) => node.name.includes('Ready frame contents'))).toBe(true);
    } finally {
      await browser.close();
    }
  }, timingCap(12_000));

  it('recaptures after a child misses its first frame-walk deadline', async () => {
    const browser = new MantisBrowser();
    try {
      await browser.open('about:blank');
      const page = await activePage(browser);
      await page.goto(delayedChildFrameFixture(), { waitUntil: 'domcontentloaded' });
      const initial = await (browser as unknown as {
        observe(page: Page): Promise<{ snap: Awaited<ReturnType<typeof capture>> }>;
      }).observe(page);
      expect(initial.snap.framesSkipped).toBe(true);
      expect(initial.snap.nodes.some((node) => node.name.includes('Delayed frame contents'))).toBe(false);
      await new Promise((done) => setTimeout(done, timingCap(2_800)));

      const started = performance.now();
      const view = await browser.read();
      expectPrompt(started);
      expect(view).toContain('Delayed frame contents');
    } finally {
      await browser.close();
    }
  }, timingCap(12_000));

  it('keeps several stalled child walks within one capture deadline', async () => {
    const browser = new MantisBrowser();
    try {
      await browser.open('about:blank');
      const page = await activePage(browser);
      await page.goto(`${frameBase}/many-stalled`, { waitUntil: 'domcontentloaded' });
      const started = performance.now();
      const snap = await capture(page);
      expect(performance.now() - started).toBeLessThan(timingCap(5_500));
      expect(snap.framesSkipped).toBe(true);
    } finally {
      await browser.close();
    }
  }, timingCap(12_000));

  it('shares a pending child lookup across overlapping captures', async () => {
    const frameSnapshot = JSON.stringify({
      url: 'https://example.test/', title: 'Frame host', truncated: false,
      nodes: [{ kind: 'region', role: 'iframe', name: '', states: [], parent: -1, depth: 0, inViewport: true, covered: false, frame: 1 }],
    });
    const evaluateHandle = vi.fn(() => new Promise<never>(() => undefined));
    const frame = {
      evaluate: vi.fn().mockResolvedValue(frameSnapshot),
      evaluateHandle,
      waitForLoadState: vi.fn().mockResolvedValue(undefined),
    };
    const page = { mainFrame: () => frame } as unknown as Page;

    const [first, second] = await Promise.all([capture(page), capture(page)]);
    expect(evaluateHandle).toHaveBeenCalledTimes(1);
    expect(first.framesSkipped).toBe(true);
    expect(second.framesSkipped).toBe(true);
  }, timingCap(8_000));

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
