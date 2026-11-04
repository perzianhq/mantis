import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

describe('closed shadow roots created through attachShadow', () => {
  it('shows the text and controls inside the root', async () => {
    const view = await browser.open(fixture('closed-shadow.html'));
    expect(view).toContain('Closed widget text');
    expect(view).toMatch(/#\d+ textbox "Closed name"/);
    expect(view).toMatch(/#\d+ button "Closed go"/);
  });

  it('clicks a button inside the root and reports the change in the diff', async () => {
    const view = await browser.open(fixture('closed-shadow.html'));
    const res = await browser.click(idOf(view, 'button "Closed go"'));
    expect(res).toMatch(/^clicked #\d+ button "Closed go"/);
    expect(res).toContain('clicked closed');
    expect(res).not.toMatch(/^error:/);
  });

  it('types into an input inside the root', async () => {
    const view = await browser.open(fixture('closed-shadow.html'));
    const typed = await browser.type(idOf(view, 'textbox "Closed name"'), 'Ada');
    expect(typed).toContain('typed "Ada" into');
    expect(typed).toContain('hello Ada');
    expect(await browser.read()).toContain('hello Ada');
  });

  it('leaves the root closed for page script', async () => {
    await browser.open(fixture('closed-shadow.html'));
    const page = await (browser as unknown as { activePage(): Promise<Page> }).activePage();
    const seen = await page.evaluate(() => ({
      hostRoot: document.getElementById('outer-status')!.dataset.hostRoot,
      shadowRoot: String(document.querySelector('fancy-widget')!.shadowRoot),
      visible: Object.keys(window).filter((k) => k.includes('mantisShadowOf')),
    }));
    expect(seen.hostRoot).toBe('null');
    expect(seen.shadowRoot).toBe('null');
    expect(seen.visible).toEqual([]);
  });

  it('near miss: a declarative closed root (no attachShadow call) stays unreadable', async () => {
    const view = await browser.open(fixture('closed-shadow-declarative.html'));
    expect(view).toContain('Declarative closed shadow'); // the page itself is read
    expect(view).not.toContain('Declarative closed text');
    expect(view).not.toContain('Declarative closed button');
  });

  it('near miss: an open root still works as before', async () => {
    const view = await browser.open(fixture('closed-shadow.html'));
    expect(view).toContain('Open widget text');
    expect(view).toMatch(/#\d+ button "Open go"/);
  });
});
