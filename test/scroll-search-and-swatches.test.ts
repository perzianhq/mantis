import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { fixture } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 3000 }); });
afterAll(async () => { await browser.close(); });

const pageOf = (): Promise<Page> => (browser as unknown as { activePage(): Promise<Page> }).activePage();
const scrollTopOf = async (selector: string): Promise<number> => (await pageOf()).evaluate((s) => document.querySelector(s)!.scrollTop, selector);
const idIn = (text: string, name: string): number => {
  const m = new RegExp(`#([0-9]+) button "${name}"`).exec(text);
  if (!m) throw new Error(`no ${name} in:\n${text}`);
  return Number(m[1]);
};

describe('find searches virtualized lists', () => {
  it('scrolls a windowed list until the text renders, leaves it there, and returns a usable id', async () => {
    await browser.open(fixture('virtual-scroll-search.html'));
    const res = await browser.find('Entry 087');
    expect(res).toContain('scrolled "Ledger entries" to it');
    expect(res).toMatch(/found 1 match for "Entry 087"/);
    expect(await scrollTopOf('#feed')).toBeGreaterThan(2000);
    const clicked = await browser.click(idIn(res, 'Entry 087'));
    expect(clicked).toContain('Opened Entry 087');
  });

  it('answers a multi-query find where only one text is virtualized', async () => {
    await browser.open(fixture('virtual-scroll-search.html'));
    const res = await browser.find(['Ledger', 'Entry 100']);
    expect(res).toContain('found 1 match for "Ledger"');
    expect(res).toContain('scrolled "Ledger entries" to it');
    expect(res).toMatch(/#\d+ button "Entry 100"/);
  });

  it('near miss: text in no row reports that, and restores the scroll position', async () => {
    await browser.open(fixture('virtual-scroll-search.html'));
    const res = await browser.find('Entry 999');
    expect(res).toContain('no control or text containing "Entry 999"');
    expect(res).toContain('did not find it');
    expect(await scrollTopOf('#feed')).toBe(0);
  });

  it('brings a match in a fully drawn but clipped list into view', async () => {
    await browser.open(fixture('full-scroll-list.html'));
    const res = await browser.find('Row 34');
    expect(res).toContain('scrolled "All entries" to it (0 steps');
    expect(res).toContain('found 1 match for "Row 34"');
    expect(await scrollTopOf('#box')).toBeGreaterThan(900);
  });

  it('near miss: text absent from a fully rendered long list is not scrolled for', async () => {
    await browser.open(fixture('full-scroll-list.html'));
    const res = await browser.find('Row 999');
    expect(res).toBe('no control or text containing "Row 999" on this page');
    expect(await scrollTopOf('#box')).toBe(0);
  });

  it('near miss: text already on the page is found without scrolling', async () => {
    await browser.open(fixture('virtual-scroll-search.html'));
    const res = await browser.find('Entry 003');
    expect(res).not.toContain('scrolled');
    expect(await scrollTopOf('#feed')).toBe(0);
  });

  it('is bounded: a huge list is searched for a limited number of steps, then restored', async () => {
    const rows = 20000;
    const html = `<!doctype html><title>Huge</title><div id="f" aria-label="Huge feed" style="height:200px;overflow:auto;position:relative"><div id="s" style="position:relative;height:${rows * 30}px"></div></div><script>
      const f=document.getElementById('f'),s=document.getElementById('s');
      function r(){const a=Math.floor(f.scrollTop/30);s.innerHTML=Array.from({length:10},(_,i)=>'<p style="position:absolute;top:'+((a+i)*30)+'px;margin:0">Item '+(a+i)+'</p>').join('');}
      f.addEventListener('scroll',r);r();</script>`;
    await browser.open('data:text/html,' + encodeURIComponent(html));
    const start = performance.now();
    const res = await browser.find('Item 19999');
    expect(performance.now() - start).toBeLessThan(15_000);
    expect(res).toContain('no control or text containing "Item 19999"');
    expect(res).toContain('search limit');
    expect(await scrollTopOf('#f')).toBe(0);
  }, 30_000);
});

describe('colour-only controls', () => {
  it('names an unlabelled swatch by its colour, on top of the positional label', async () => {
    await browser.open(fixture('colour-swatches.html'));
    const text = await browser.read();
    expect(text).toMatch(/button ~"Trail Pack button 1 of \d+, red #d64545"/);
    expect(text).toMatch(/~"Trail Pack button 2 of \d+, orange #e8892b"/);
    expect(text).toMatch(/~"Trail Pack button 3 of \d+, purple #7b4fc9"/);
    expect(text).toMatch(/~"Trail Pack button 4 of \d+, green #2f9e55"/);
    expect(text).toMatch(/~"Trail Pack button 5 of \d+, blue #2b6fd6"/);
    expect(text).toMatch(/~"Trail Pack button 6 of \d+, grey #8a8f98"/);
  });

  it('adds nothing to a control that has a label or text, or to a large coloured box', async () => {
    await browser.open(fixture('colour-swatches.html'));
    const text = await browser.read();
    expect(text).toContain('button "Forest green"');
    expect(text).toContain('button "Red"');
    expect(text).not.toMatch(/#facc15.*Red|Red.*#d64545/);
    for (const line of text.split('\n').filter((l) => /Forest green|"Red"/.test(l))) expect(line).not.toMatch(/#[0-9a-f]{6}/);
    // The big blue box and the icon-bearing / glyph buttons stay without a colour name.
    expect(text.match(/#2b6fd6/g)?.length).toBe(1);
    expect(text.match(/#e8892b/g)?.length).toBe(1);
  });

  it('names a lone unlabelled swatch too, but not a lone unlabelled plain button', async () => {
    await browser.open('data:text/html,' + encodeURIComponent('<!doctype html><title>One</title><button style="width:30px;height:30px;background:#facc15;border:0"></button>'));
    expect(await browser.read()).toMatch(/button ~"yellow #facc15 button"/);
    await browser.open('data:text/html,' + encodeURIComponent('<!doctype html><title>Plain</title><button style="width:30px;height:30px"></button>'));
    expect(await browser.read()).not.toMatch(/#[0-9a-f]{6}/);
  });
});
