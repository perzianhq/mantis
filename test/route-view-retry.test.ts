import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { idOf, timingCap } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const origin = 'http://route-retry.test';

// The clicked link keeps focus, so its states differ between before and after even though nothing repainted.
const html = (delayMs: number): string => `<!doctype html><title>Catalog</title>
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
    if (${delayMs} === 0) paint(); else setTimeout(paint, ${delayMs});
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
