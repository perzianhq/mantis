import { afterAll, beforeAll, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

it('shares native table dropdown options after the first rendered row', async () => {
  const rows = ['Ada', 'Bea', 'Cy'].map((name) =>
    `<tr><td>${name}</td><td><label>${name} status <select><option>Draft</option><option>Published</option></select></label></td></tr>`,
  ).join('');
  const view = await browser.open('data:text/html,' + encodeURIComponent(`<title>Team</title><table><tbody>${rows}</tbody></table>`));
  expect(view).toMatch(/#\d+ combobox "Ada status" \(value "Draft", options: Draft \| Published\)/);
  const second = view.match(/#(\d+) combobox "Bea status" \(value "Draft", options: same as #(\d+)\)/);
  expect(second).not.toBeNull();
  expect(second![1]).not.toBe(second![2]);
  expect(view).toMatch(/#\d+ combobox "Cy status" \(value "Draft", options: same as #\d+\)/);
});
