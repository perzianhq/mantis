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

  it('waits for a staged update inside a closed root attached through attachShadow', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    const res = await browser.click(idOf(view, 'Start closed steps'));
    expect(res).toContain('clicked #');
    expect(res).toContain('Closed step 16');
  });

  it('types into and clicks controls inside an open shadow root', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    expect(view).toMatch(/#\d+ textbox "Shadow name"/);
    const typed = await browser.type(idOf(view, 'Shadow name'), 'Ada');
    expect(typed).toContain('typed "Ada" into');
    expect(await browser.read()).toContain('Hello Ada');
  });

  it('shows closed-root content in a later read too', async () => {
    const view = await browser.open(fixture('shadow-settle.html'));
    await browser.click(idOf(view, 'Start closed steps'));
    expect(await browser.read()).toContain('Closed step');
  });
});
