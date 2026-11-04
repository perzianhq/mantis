import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { MantisBrowser } from '../src/index.js';
import { idOf } from './helpers.js';

// A navigation budget far below the "slow" route's delay keeps these tests fast.
const BUDGET_MS = 500;
const LOADING_NOTE = 'done; the page is still loading. The next call waits for it.';

let server: Server;
let base: string;
let b: MantisBrowser;
/** Responses of the slow route that are being held; the test releases them when it wants the server to answer. */
let held: Array<() => void> = [];
const release = (): void => { held.splice(0).forEach((send) => send()); };

const html = (response: import('node:http').ServerResponse, body: string): void => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(body);
};

beforeAll(async () => {
  server = createServer((request, response) => {
    const path = (request.url ?? '').split('?')[0];
    if (path === '/start') {
      html(response, '<title>Start</title><a href="/slow-page">Slow link</a> <a href="/fast-page">Fast link</a> <a href="/hung-page">Hung link</a> <a href="http://127.0.0.1:1/">Dead link</a>' +
        '<button onclick="document.getElementById(\'out\').textContent=\'Toggled\'">Toggle</button><p id="out">Idle</p>' +
        '<form action="/slow-page"><label>Query <input name="q"></label></form>');
    } else if (path === '/slow-page') {
      // Answers only when the test says so, which is after the budget, as with an overloaded server.
      held.push(() => html(response, '<title>Slow arrived</title><main>Slow destination loaded</main>'));
    } else if (path === '/fast-page') {
      html(response, '<title>Fast arrived</title><main>Fast destination loaded</main>');
    } else if (path === '/hung-page') {
      // Never answers: it still has not committed after the second wait.
    } else {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  b = new MantisBrowser({ actionTimeoutMs: 1500, navigationTimeoutMs: BUDGET_MS });
});

afterAll(async () => {
  await b.close();
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

afterEach(() => { held = []; });

const pending = (): unknown => (b as unknown as { loadingNavigation: unknown }).loadingNavigation;

describe('a navigation slower than its budget', () => {
  it('is reported as still loading, and the next call shows the new page', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.click(idOf(view, 'link "Slow link"'));

    expect(result).toMatch(/^clicked #\d+ link "Slow link"/);
    expect(result).toContain(`click ${LOADING_NOTE}`);
    expect(result).not.toMatch(/error:/);
    expect(result).not.toContain('Slow destination loaded');
    expect(pending()).not.toBeNull();

    release();
    const next = await b.read();
    expect(next).toContain('Slow destination loaded');
    expect(next).not.toContain('had not finished');
    expect(pending()).toBeNull();
    expect(await b.read()).toContain('Slow destination loaded');
  });

  it('is reported the same way for a submitted form, and find waits for it', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.type(idOf(view, 'textbox "Query"'), 'abc', true);

    expect(result).toMatch(/^typed "abc" into/);
    expect(result).toContain(`submit ${LOADING_NOTE}`);
    expect(result).not.toMatch(/error:/);

    release();
    expect(await b.find('Slow destination')).toContain('Slow destination loaded');
    expect(pending()).toBeNull();
  });

  it('is waited for by the next action, which then works on the new page', async () => {
    const view = await b.open(`${base}/start`);
    await b.click(idOf(view, 'link "Slow link"'));
    setTimeout(release, 150);
    const result = await b.click(idOf(view, 'button "Toggle"'));

    // The id was issued for the page we left: the action says so and shows the page now loaded.
    expect(result).toMatch(/^page navigated; showing the current page/);
    expect(result).toContain('Slow destination loaded');
    expect(pending()).toBeNull();
  });

  it('says so once, then moves on, when it has still not committed after the second wait', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.click(idOf(view, 'link "Hung link"'));
    expect(result).toContain(`click ${LOADING_NOTE}`);

    const second = await b.read();
    expect(second).toContain('click started a page load that had not finished');
    expect(second).toContain('it was stopped');
    expect(second).toContain('Slow link'); // the earlier page is readable again
    expect(second).not.toMatch(/^error:/);
    expect(pending()).toBeNull();

    const third = await b.read();
    expect(third).not.toContain('had not finished');
  });

  it('near miss: a click that does not navigate has no note and nothing pending', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.click(idOf(view, 'button "Toggle"'));

    expect(result).toContain('Toggled');
    expect(result).not.toContain('still loading');
    expect(pending()).toBeNull();
  });

  it('near miss: a fast navigation has no note and nothing pending', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.click(idOf(view, 'link "Fast link"'));

    expect(result).toContain('Fast destination loaded');
    expect(result).not.toContain('still loading');
    expect(pending()).toBeNull();
  });

  it('near miss: a navigation that really fails is still a failure, not "still loading"', async () => {
    const view = await b.open(`${base}/start`);
    const result = await b.click(idOf(view, 'link "Dead link"'));

    expect(result).toContain('the page failed to load');
    expect(result).not.toContain('still loading');
    expect(pending()).toBeNull();
  });
});
