import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { closestOptions, matchOptions } from '../src/optionMatch.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const open = (body: string): Promise<string> =>
  browser.open('data:text/html,' + encodeURIComponent(`<!doctype html><meta charset="utf-8"><title>Select matching</title>${body}`));
const idOf = (view: string, role: string, name: string): number => {
  const m = view.match(new RegExp(`#(\\d+) ${role} "${name}"`));
  if (!m) throw new Error(`no ${role} ${name} in:\n${view}`);
  return Number(m[1]);
};

describe('option matching', () => {
  const opts = (...labels: string[]) => labels.map((label) => ({ label }));

  it('matches across case, accents, punctuation and word order', () => {
    expect(matchOptions(opts('São Paulo (SP)', 'Rio'), 'sao paulo sp').hits).toEqual([0]);
    expect(matchOptions(opts('Smith, John', 'Doe, Jane'), 'John Smith').hits).toEqual([0]);
    expect(matchOptions(opts('Alpha', 'Beta'), 'Beta').hits).toEqual([1]);
  });

  it('near miss: unrelated or partial words do not match', () => {
    expect(matchOptions(opts('Smith, John', 'Doe, Jane'), 'John Doe').hits).toEqual([]);
    expect(matchOptions(opts('Alpha', 'Beta'), 'Gamma').hits).toEqual([]);
  });

  it('ranks the closest options first when the list is long', () => {
    const labels = [...Array.from({ length: 30 }, (_, i) => `Filler ${i}`), 'Greater London Area'];
    expect(closestOptions(labels, 'london', 3)[0]).toBe('Greater London Area');
  });
});

describe('select on real pages', () => {
  it('chooses a native option by folded wording', async () => {
    const view = await open(`<select aria-label="City"><option>Madrid</option><option>São Paulo (SP)</option></select>`);
    const id = idOf(view, 'combobox', 'City');
    expect(await browser.select(id, 'sao paulo')).toContain(`selected "São Paulo (SP)" in #${id} combobox "City"`);
  });

  it('reports the closest options, not the first, when a long list has no match', async () => {
    const many = Array.from({ length: 40 }, (_, i) => `<option>Filler ${i}</option>`).join('');
    const view = await open(`<select aria-label="Region">${many}<option>Greater London Area</option></select>`);
    const id = idOf(view, 'combobox', 'Region');
    const res = await browser.select(id, 'London Metro');
    expect(res).toContain('no option "London Metro"');
    expect(res).toContain('closest of 41: Greater London Area');
  });

  it('selects from a plain dropdown toggled by a hash link', async () => {
    const view = await open(`<a href="#" id="t" onclick="document.getElementById('m').style.display='block';return false">Sort by</a>
      <ul id="m" style="display:none"><li><a href="/s?o=new">Newest</a></li><li><a href="/s?o=old">Oldest</a></li></ul>`);
    const id = idOf(view, 'link', 'Sort by');
    expect(await browser.select(id, 'Oldest')).toContain('selected "Oldest"');
  });

  it('near miss: a link to another page is refused without navigating', async () => {
    const view = await open(`<a href="https://example.invalid/next">Next page</a>`);
    const id = idOf(view, 'link', 'Next page');
    const res = await browser.select(id, 'Anything');
    expect(res).toContain('is a link to another page');
  });
});
