import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><title>Offscreen labels</title><div style="height:4000px">filler</div>${body}`));

const textRows = (count: number): string => Array.from({ length: count }, (_, i) =>
  `<tr><th>Text field ${i + 1}</th><td>Text value ${i + 1}</td></tr>`).join('');
const linkRows = (count: number): string => Array.from({ length: count }, (_, i) =>
  `<tr><th>Topic ${i + 1}</th><td><a href="/topic/${i + 1}">Topic value ${i + 1}</a></td></tr>`).join('');

describe('offscreen labelled fact budgets', () => {
  it('keeps text-valued rows after link-valued rows', async () => {
    const view = await open(`<table>${linkRows(15)}${textRows(5)}</table>`);
    for (let i = 1; i <= 5; i++) {
      expect(view).toContain(`Text field ${i}`);
      expect(view).toContain(`Text value ${i}`);
    }
    expect(view).toContain('Topic 1');
    expect(view).toContain('Topic value 1');
  });

  it('still caps a long offscreen text-valued table', async () => {
    const view = await open(`<table>${textRows(60)}</table>`);
    expect(view).toContain('Text field 1');
    expect(view).not.toContain('Text field 60');
  });

  it('still caps a long offscreen link-valued table', async () => {
    const view = await open(`<table>${linkRows(40)}</table>`);
    expect(view).toContain('Topic 1');
    expect(view).not.toContain('Topic 40');
  });
});
