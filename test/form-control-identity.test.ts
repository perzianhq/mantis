import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

const lineFor = (view: string, marker: string): string => {
  const line = view.split('\n').find((candidate) => candidate.includes(marker));
  if (!line) throw new Error(`no line containing ${marker} in:\n${view}`);
  return line;
};

describe('form-control identity', () => {
  it('renders id and name markers for otherwise identical native selects', async () => {
    const page = 'data:text/html,' + encodeURIComponent(`<!doctype html><title>Control identity</title>
      <select id="alpha" name="route-alpha" aria-label="Route"><option selected>North</option><option>South</option></select>
      <select id="beta" name="route-beta" aria-label="Route"><option>North</option><option selected>South</option></select>
      <select id="gamma" name="route-gamma" aria-label="Route"><option selected>East</option><option>West</option></select>`);

    const view = await browser.open(page);
    expect(lineFor(view, 'id=alpha')).toMatch(/combobox "Route" \(value "North".*\) \(id=alpha, name=route-alpha\)/);
    expect(lineFor(view, 'id=beta')).toMatch(/combobox "Route" \(value "South".*\) \(id=beta, name=route-beta\)/);
    expect(lineFor(view, 'id=gamma')).toMatch(/combobox "Route" \(value "East".*\) \(id=gamma, name=route-gamma\)/);
  });

  it('leaves unnamed controls unchanged and does not repeat an accessible identity', async () => {
    const page = 'data:text/html,' + encodeURIComponent(`<!doctype html><title>Control identity near miss</title>
      <select aria-label="Route"><option selected>North</option><option>South</option></select>
      <select id="decoy" aria-label="decoy"><option>North</option><option selected>South</option></select>`);

    const view = await browser.open(page);
    expect(view).toMatch(/#\d+ combobox "Route" \(value "North", options: North \| South\)/);
    const named = lineFor(view, 'value "South"');
    expect(named).not.toMatch(/\b(?:id|name)=/);
  });
});
