import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1000 }); });
afterAll(async () => { await browser.close(); });

describe('native dialogs and popups', () => {
  it('accepts confirms and prompt defaults, while ordinary actions do not gain a dialog note', async () => {
    let view = await browser.open(fixture('generic-browser-native-dialogs.html'));
    const confirmed = await browser.click(idOf(view, 'button "Confirm change"'));
    expect(confirmed).toContain('Change confirmed');
    expect(confirmed).toContain('dialog: confirm "Apply this change?" (accepted)');
    expect(confirmed).not.toContain('Change rejected');

    view = await browser.read();
    const prompted = await browser.click(idOf(view, 'button "Use suggested label"'));
    expect(prompted).toContain('Chosen: Suggested label');
    expect(prompted).toContain('dialog: prompt "Choose a label" (accepted)');

    view = await browser.read();
    const ordinary = await browser.click(idOf(view, 'button "Ordinary action"'));
    expect(ordinary).toContain('Ordinary action completed');
    expect(ordinary).not.toContain('dialog:');
  });

  it('works in a click-opened popup and returns to its opener when it closes', async () => {
    const parent = await browser.open(fixture('generic-browser-popup.html'));
    const opened = await browser.click(idOf(parent, 'button "Open child"'));
    expect(opened).toContain('opened in a new tab (now active)');
    expect(opened).toContain('Popup child');

    const child = await browser.read();
    expect(await browser.click(idOf(child, 'button "Child action"'))).toContain('Child action completed');
    const afterWork = await browser.read();
    const closed = await browser.click(idOf(afterWork, 'button "Close child"'));

    const returned = await browser.read();
    expect(returned).toContain('Popup parent');
    expect(returned).toContain('Open child');
    expect(returned).not.toContain('Popup child');
    expect(closed).toContain('popup: closed');
  });

  it('near miss: closing a popup that is no longer the active page leaves the active page alone', async () => {
    const parent = await browser.open(fixture('generic-browser-popup.html'));
    await browser.click(idOf(parent, 'button "Open child"'));
    const internals = browser as unknown as { context: { newPage: () => Promise<unknown>; pages: () => { title: () => Promise<string>; close: () => Promise<void> }[] } };
    const pages = internals.context.pages();
    const titles = await Promise.all(pages.map((p) => p.title()));
    const popup = pages[titles.indexOf('Popup child')];
    await internals.context.newPage(); // a later page takes over as the active one
    await popup.close();
    await new Promise((r) => setTimeout(r, 200));
    const view = await browser.read();
    expect(view).not.toContain('Popup parent');
    expect(view).not.toContain('Popup child');
  });
});

describe('frame number ranges', () => {
  it('binds a reused child-frame range to the replacement frame, never to the detached one', async () => {
    const initial = await browser.open(fixture('generic-browser-frame-replacement.html'));
    const oldId = idOf(initial, 'button "Original frame action"');
    expect(oldId).toBeGreaterThan(10_000);
    await browser.click(idOf(initial, 'button "Replace embedded document"'));

    const current = await browser.read();
    expect(current).not.toContain('Original frame action');
    const replacementId = idOf(current, 'button "Replacement frame action"');
    expect(replacementId).toBeGreaterThan(10_000);
    // The number now names the control the agent was last shown, in the live frame.
    expect(await browser.click(replacementId)).toContain('Replacement frame action');
    const after = await browser.read();
    expect(after).toContain('Replacement');
    expect(after).not.toContain('original clicked');
  });

  it('near miss: separator values and ranges no frame owns are not elements', async () => {
    await browser.open(fixture('generic-browser-frame-replacement.html'));
    expect(await browser.click(10_000)).toMatch(/^error:/);
    expect(await browser.click(20_000)).toMatch(/^error:/);
    expect(await browser.click(90_001)).toMatch(/^error:/);
  });

  it('issues the last valid id but truncates instead of crossing a frame boundary, including media', async () => {
    await browser.open(fixture('generic-browser-frame-range.html'));
    const page = (browser as unknown as { page: { evaluate: <T>(fn: () => T) => Promise<T> } }).page;
    await page.evaluate(() => {
      const registry = (window as unknown as { __mantis: { next: number } }).__mantis;
      registry.next = 9_999;
      document.body.insertAdjacentHTML('beforeend', '<button>Last valid id</button>');
    });
    const last = await browser.snapshot();
    expect(last.nodes.find((node) => node.name === 'Last valid id')?.id).toBe(9_999);

    await page.evaluate(() => {
      const registry = (window as unknown as { __mantis: { next: number } }).__mantis;
      registry.next = 10_000;
      document.body.insertAdjacentHTML('beforeend', '<button>Boundary id</button><img alt="Boundary artwork" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" style="width:100px;height:100px">');
    });
    const bounded = await browser.snapshot();
    expect(bounded.truncated).toBe(true);
    expect(bounded.nodes.some((node) => node.id === 10_000 || node.name === 'Boundary id')).toBe(false);
    expect(await browser.media()).not.toContain('Boundary artwork');
  });
});
