import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><title>Multi find</title>${body}`));

describe('find with several queries', () => {
  it('answers every query in one call, each under its own header', async () => {
    await open(`<button>Apply filter</button><p>Shipping is free over 50</p><a href="/r">Returns policy</a>`);
    const res = await browser.find(['apply filter', 'shipping', 'returns']);
    expect(res).toContain('found 1 match for "apply filter"');
    expect(res).toContain('found 1 match for "shipping"');
    expect(res).toContain('found 1 match for "returns"');
  });

  it('near miss: a query with no hit reports that without hiding the others', async () => {
    await open(`<button>Apply filter</button>`);
    const res = await browser.find(['apply filter', 'zzzz-missing']);
    expect(res).toContain('found 1 match for "apply filter"');
    expect(res).toContain('no control or text containing "zzzz-missing"');
  });

  it('a single string and a one-item list behave the same; duplicates collapse', async () => {
    await open(`<button>Apply filter</button>`);
    expect(await browser.find(['apply', 'APPLY ', 'apply'])).toBe(await browser.find('apply'));
  });
});
