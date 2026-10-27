import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { idOf, timingCap } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const origin = 'http://route-retry.test';

// The clicked link keeps focus, so its states differ between before and after even though nothing repainted.
const html = (delayMs: number | null): string => `<!doctype html><title>Catalog</title>
<main><h1>Catalog</h1><p>Browse the list below.</p>
<ul>${Array.from({ length: 12 }, (_, i) => `<li><a href="/item/${i}" data-i="${i}">Entry ${i}</a></li>`).join('')}</ul></main>
<script>
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-i]');
    if (!link) return;
    event.preventDefault();
    history.pushState({}, '', link.getAttribute('href'));
    const paint = () => {
      document.title = 'Entry detail';
      document.body.innerHTML = '<main><h1>Entry detail</h1><p>Detail text for the chosen entry.</p></main>';
    };
    ${delayMs === null ? '' : `if (${delayMs} === 0) paint(); else setTimeout(paint, ${delayMs});`}
  });
</script>`;

const run = async (delayMs: number): Promise<{ text: string; ms: number }> => {
  const page = await pageOf();
  await page.route(`${origin}/**`, (route) => route.fulfill({ contentType: 'text/html', body: html(delayMs) }));
  try {
    const view = await browser.open(`${origin}/list`);
    const start = performance.now();
    const text = await browser.click(idOf(view, 'link "Entry 3"'));
    return { text, ms: performance.now() - start };
  } finally {
    await page.unroute(`${origin}/**`);
  }
};

describe('route view retry', () => {
  it('waits for a late repaint even though the clicked link gained focus', async () => {
    const { text } = await run(600);
    expect(text).toContain('Entry detail');
    expect(text).toContain('Detail text for the chosen entry');
  });

  it('near miss: a route that repaints at once does not pay the extra wait', async () => {
    const { text, ms } = await run(0);
    expect(text).toContain('Detail text for the chosen entry');
    expect(ms).toBeLessThan(timingCap(1300));
  });
});

describe('route view retry timing', () => {
  const timingLines = async (delayMs: number | null): Promise<{ lines: string[]; ms: number }> => {
    const page = await pageOf();
    // null: the route changes the URL but never repaints, so the retry ends with the same view.
    const body = html(delayMs);
    await page.route(`${origin}/**`, (route) => route.fulfill({ contentType: 'text/html', body }));
    const old = process.env.MANTIS_TIMING;
    const lines: string[] = [];
    const write = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => { lines.push(String(chunk)); return true; });
    process.env.MANTIS_TIMING = '1';
    try {
      const view = await browser.open(`${origin}/list`);
      lines.length = 0;
      const start = performance.now();
      await browser.click(idOf(view, 'link "Entry 3"'));
      return { lines: lines.filter((line) => line.startsWith('mantis timing ')), ms: performance.now() - start };
    } finally {
      write.mockRestore();
      if (old === undefined) delete process.env.MANTIS_TIMING;
      else process.env.MANTIS_TIMING = old;
      await page.unroute(`${origin}/**`);
    }
  };

  it('reports 1/same and returns in bounded time when the route never repaints', async () => {
    const { lines, ms } = await timingLines(null);
    expect(lines.some((line) => line.trimEnd().endsWith(' routeRetry=1/same'))).toBe(true);
    expect(ms).toBeLessThan(timingCap(4000));
  });

  it('near miss: a repaint the first settle catches reports no 1/same retry', async () => {
    const { lines } = await timingLines(600);
    expect(lines).not.toHaveLength(0);
    expect(lines.some((line) => line.includes('routeRetry=1/same'))).toBe(false);
  });
});

describe('sameVisibleContent', () => {
  const snap = (names: string[], title = 'T') => ({
    title, url: 'http://x.test/', nodes: names.map((name) => ({ kind: 'interactive', role: 'link', name, states: [], inViewport: true })),
  });
  const same = (a: ReturnType<typeof snap>, b: ReturnType<typeof snap>): boolean =>
    (browser as unknown as { sameVisibleContent(a: unknown, b: unknown): boolean }).sameVisibleContent(a, b);
  const names = (n: number, from = 0): string[] => Array.from({ length: n }, (_, i) => `Item ${from + i}`);

  it('treats a repaint of a few controls as the same page', () => {
    expect(same(snap(names(20)), snap([...names(19), 'Other']))).toBe(true);
  });

  it('near miss: a mostly new set of controls is a different page', () => {
    expect(same(snap(names(20)), snap(names(20, 10)))).toBe(false);
    expect(same(snap(names(20)), snap(names(20), 'Another title'))).toBe(false);
  });
});
