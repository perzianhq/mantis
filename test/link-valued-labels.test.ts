import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><title>Link labels</title><div style="height:4000px">filler</div>${body}`));

// The page is pushed below the fold: offscreen bare headers are dropped, only paired labels stay.
describe('labels whose value is only a link', () => {
  it('keeps a table header label when its value cell holds just a link', async () => {
    const view = await open(`<table>
      <tr><th>Language</th><td>English</td></tr>
      <tr><th>Catalog class</th><td><a href="/c/1">Alpha: Beta literature</a></td></tr>
      <tr><th>Topic</th><td><a href="/t/1">Gadgets</a></td></tr>
      <tr><th>Topic</th><td><a href="/t/2">Widgets</a></td></tr>
      <tr><th>Format</th><td>Text</td></tr></table>`);
    expect(view).toContain('Catalog class');
    expect(view).toContain('Topic');
    expect(view).toContain('Gadgets');
    expect(view).toContain('Widgets');
  });

  it('keeps a definition-list term whose definition is just a link', async () => {
    const view = await open(`<dl><dt>Publisher</dt><dd><a href="/p">Acme Press</a></dd>
      <dt>Year</dt><dd>1999</dd></dl>`);
    expect(view).toContain('Publisher');
    expect(view).toContain('Acme Press');
  });

  it('still drops a bare column header that no value cell pairs with', async () => {
    const view = await open(`<table>
      <thead><tr><th>Zorblax</th><th>Quuxify</th></tr></thead>
      <tbody><tr><td>one</td><td>two</td></tr><tr><td>three</td><td>four</td></tr></tbody></table>
      <p><a href="/x">Elsewhere</a></p>`);
    expect(view).not.toContain('Zorblax');
    expect(view).not.toContain('Quuxify');
  });
});
