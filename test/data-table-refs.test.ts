import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><title>Data</title>${body}`));

const idOf = (view: string, role: string, name: string): number => {
  const match = view.match(new RegExp(`#(\\d+) ${role} "${name}"`));
  if (!match) throw new Error(`no ${role} "${name}" in:\n${view}`);
  return Number(match[1]);
};

const table = '<table class="info"><tr><th>Author</th><td>Mary Shelley</td></tr><tr><th>Year</th><td>1818</td></tr></table>';

describe('data() table rows and refs in selectors', () => {
  it('returns semantic table rows', async () => {
    await open(table);
    const out = await browser.data({ selector: 'table.info' });
    expect(out).toContain('Author: Mary Shelley');
    expect(out).toContain('Year: 1818');
  });

  it('resolves refs before CSS selectors', async () => {
    const view = await open(`${table}<button>Go</button>`);
    const id = idOf(view, 'button', 'Go');
    expect(await browser.data({ selector: `#${id}` })).not.toContain('invalid CSS selector');
    const out = await browser.data({ selector: `table.info, #${id}` });
    expect(out).toContain('Author: Mary Shelley');
    expect(out).toContain('Year: 1818');
  });

  it('keeps invalid CSS and missing refs distinct', async () => {
    await open('<div></div>');
    expect(await browser.data({ selector: '#99999' })).toMatch(/^error: no element #99999/);
    expect(await browser.data({ selector: 'div[' })).toMatch(/^error: invalid CSS selector/);
  });

  it('keeps image data on the existing formatter', async () => {
    await open('<img alt="A chart of sales">');
    expect(await browser.data({ selector: 'img' })).toContain('alt: A chart of sales');
  });
});
