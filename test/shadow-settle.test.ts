import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 5000 }); });
afterAll(async () => { await browser.close(); });

describe('settle watches open shadow roots', () => {
  it('waits for a staged update inside a root attached later and a root nested in it', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    const res = await browser.click(idOf(view, 'Start open steps'));
    expect(res).toContain('Open step 16');
  });

  it('waits for a staged update inside a root the parser created', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    const res = await browser.click(idOf(view, 'Start static steps'));
    expect(res).toContain('Static step 16');
  });

  it('does not wait on a closed root, which nothing can see (near miss)', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    const start = performance.now();
    const res = await browser.click(idOf(view, 'Start closed steps'));
    const ms = performance.now() - start;
    expect(res).toContain('clicked #');
    expect(res).not.toContain('Closed step');
    expect(ms).toBeLessThan(1500);
  });

  it('types into and clicks controls inside an open shadow root', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    expect(view).toMatch(/#\d+ textbox "Shadow name"/);
    const typed = await browser.type(idOf(view, 'Shadow name'), 'Ada');
    expect(typed).toContain('typed "Ada" into');
    expect(await browser.read()).toContain('Hello Ada');
  });

  it('keeps shadow content out of the view when the root is closed (near miss)', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    await browser.click(idOf(view, 'Start closed steps'));
    expect(await browser.read()).not.toContain('Closed step');
  });
});
