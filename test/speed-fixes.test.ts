import { afterAll, beforeAll, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

it('returns the destination after link and Enter navigation, but keeps a prevented submit local', async () => {
  let view = await browser.open(fixture('generic-speed-navigation.html'));
  expect(await browser.click(idOf(view, 'link "Open destination"'))).toContain('Arrival complete');
  expect(await browser.read()).toContain('Arrival complete');

  view = await browser.open(fixture('generic-speed-navigation.html'));
  expect(await browser.type(idOf(view, 'textbox "Query"'), 'term', true)).toContain('Arrival complete');
  expect(await browser.read()).toContain('Arrival complete');

  view = await browser.open(fixture('generic-speed-navigation.html'));
  expect(await browser.type(idOf(view, 'textbox "Local query"'), 'term', true)).not.toContain('Arrival complete');
  expect(await browser.read()).toContain('Navigation source');
});

it('keeps offscreen interactive output while only a visible control is hit-tested', async () => {
  const view = await browser.open(fixture('generic-speed-navigation.html'));
  const snap = await browser.snapshot();
  expect(snap.nodes.find((node) => node.name === 'Visible control')?.covered).toBe(false);
  expect(snap.nodes.find((node) => node.name === 'Offscreen control')?.covered).toBe(false);
  // Near miss: an actually covered, visible target stays reported as covered.
  const page = (browser as unknown as { page: { evaluate: (fn: () => void) => Promise<void> } }).page;
  await page.evaluate(() => {
    const cover = document.querySelector('.cover') as HTMLElement;
    cover.style.width = '120px'; cover.style.height = '40px'; cover.style.left = '0'; cover.style.top = '0';
    const target = document.querySelector('#covered') as HTMLElement;
    target.style.position = 'fixed'; target.style.left = '0'; target.style.top = '0';
  });
  expect((await browser.snapshot()).nodes.find((node) => node.name === 'Covered control')?.covered).toBe(true);
  expect(view).toContain('Navigation source');
});
