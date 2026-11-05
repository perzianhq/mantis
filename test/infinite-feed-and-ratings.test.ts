import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { fixture } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const heightOf = async (): Promise<number> => (await pageOf()).evaluate(() => document.documentElement.scrollHeight);
const scrollY = async (): Promise<number> => (await pageOf()).evaluate(() => window.scrollY);

describe('find loads more of an infinite feed', () => {
  it('hit: scrolls the page until the text loads, centres it and says how many loads', async () => {
    await browser.open(fixture('infinite-feed.html'));
    const res = await browser.find('Tolkien');
    expect(res).toMatch(/^loaded more by scrolling the page \d+ times; found "Tolkien"/);
    expect(res).toContain('found 1 match for "Tolkien"');
    expect(await scrollY()).toBeGreaterThan(1000);
  }, 30_000);

  it('miss: loads to the end of the feed, says so, keeps the content and restores the scroll position', async () => {
    await browser.open(fixture('infinite-feed.html'));
    const before = await heightOf();
    const res = await browser.find('Nabokov');
    expect(res).toContain('no control or text containing "Nabokov"');
    expect(res).toMatch(/loaded more by scrolling the page \d+ times, until it stopped growing, and did not find it/);
    expect(await heightOf()).toBeGreaterThan(before);
    expect(await scrollY()).toBe(0);
  }, 30_000);

  it('near miss: a long static page is not scrolled for and gets no loading note', async () => {
    await browser.open(fixture('static-long.html'));
    const start = performance.now();
    const res = await browser.find('Row 999');
    expect(performance.now() - start).toBeLessThan(3000);
    expect(res).toBe('no control or text containing "Row 999" on this page');
    expect(await scrollY()).toBe(0);
  });

  it('near miss: text already present is found without loading', async () => {
    await browser.open(fixture('infinite-feed.html'));
    const res = await browser.find('Item 3');
    expect(res).not.toContain('loaded more');
  });
});

describe('scroll and press report loaded content', () => {
  it('scroll down on a growing page adds the growth note; a static page does not', async () => {
    await browser.open(fixture('infinite-feed.html'));
    const grown = await browser.scroll('down');
    expect(grown).toContain('more content loaded (page grew)');
    await browser.open(fixture('static-long.html'));
    const still = await browser.scroll('down');
    expect(still).not.toContain('page grew');
  }, 30_000);

  it('press End reports the scroll and the growth instead of "no visible change"', async () => {
    await browser.open(fixture('infinite-feed.html'));
    const res = await browser.press('End');
    expect(res).toContain('pressed End; scrolled to');
    expect(res).toContain('more content loaded (page grew)');
    expect(res).not.toContain('no visible change');
  }, 30_000);

  it('press End on a static page reports the scroll; Home back reports it too', async () => {
    await browser.open(fixture('static-long.html'));
    const down = await browser.press('End');
    expect(down).toContain('scrolled to 100% of page');
    expect(down).not.toContain('page grew');
    expect(await browser.press('Home')).toContain('scrolled to 0% of page');
  });

  it('near miss: a key that changes nothing still says no visible change', async () => {
    await browser.open(fixture('static-long.html'));
    const res = await browser.press('Shift');
    expect(res).toContain('no visible change');
  });
});

describe('icon-only ratings', () => {
  it('reads colour-run icon rows as a rating line next to their item', async () => {
    const view = await browser.open(fixture('icon-ratings.html'));
    expect(view).toMatch(/Dune[\s\S]*?rating 3 of 5/);
    expect(view).toMatch(/Emma[\s\S]*?rating 5 of 5/);
    expect(view).toMatch(/Walden[\s\S]*?rating 2 of 4/);
    expect(view).toMatch(/Kim[\s\S]*?rating 2 of 4/);
  });

  it('near misses: grey-only, gaps, mixed shapes, labels, text, pairs, dozens and big icons give no rating', async () => {
    const view = await browser.read();
    const ratings = view.split('\n').filter((l) => /rating \d+ of \d+/.test(l));
    expect(ratings).toHaveLength(4);
    const lines = view.split(String.fromCharCode(10));
    expect(lines[lines.findIndex((l) => l.includes('Ulysses')) + 1]).toContain('Walden');
    for (const name of ['Gap', 'Mixed', 'Text', 'Pair', 'Dozen', 'Huge']) {
      const at = view.indexOf(name);
      expect(at).toBeGreaterThan(-1);
    }
    expect(view).toContain('Rated 2 out of 5 by readers');
  });
});
