import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const css = '<style>.g:not(.open) input { display: none; }</style>';
const group = (id: string, name: string, items: string[]): string =>
  `<button aria-expanded="false" aria-controls="${id}">${name}</button>` +
  `<div id="${id}" class="g">${items.map((i) => `<label>${i}<input type="checkbox"></label>`).join('')}</div>`;
const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><title>Open first</title>${css}${body}`));
const count = (view: string): number => (view.match(/open #\d+ "[^"]+" first/g) ?? []).length;

describe('"open first" hint', () => {
  it('says it once for a run of options behind the same closed group', async () => {
    const view = await open(group('c', 'Colour', ['Red', 'Green', 'Blue', 'Amber']));
    for (const name of ['Red', 'Green', 'Blue', 'Amber']) expect(view).toContain(`"${name}"`);
    expect(count(view)).toBe(1);
    expect(view).toContain('also for the controls after this');
  });

  it('near miss: two options behind a closed group each keep their own hint', async () => {
    const view = await open(group('s', 'Size', ['Small', 'Large']));
    expect(count(view)).toBe(2);
    expect(view).not.toContain('also for the controls after this');
  });

  it('near miss: different closed groups never share a hint', async () => {
    const view = await open(group('c', 'Colour', ['Red', 'Green', 'Blue']) + group('s', 'Size', ['Small', 'Medium', 'Large']));
    expect(view).toContain('"Colour" first');
    expect(view).toContain('"Size" first');
    expect(count(view)).toBe(2);
  });
});
