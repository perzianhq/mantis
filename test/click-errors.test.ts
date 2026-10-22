import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { MantisBrowser } from '../src/index.js';
import { classifyClickError } from '../src/browser.js';
import { idOf } from './helpers.js';

let server: Server;
let base: string;
let destinationClicks = 0;
let b: MantisBrowser;

beforeAll(async () => {
  server = createServer((request, response) => {
    if (request.url === '/covered') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Covered</title><style>#target,#cover{position:absolute;left:20px;top:20px;width:180px;height:40px}#cover{background:#ddd}</style><button id=target>Covered target</button><div id=cover>Overlay</div>');
      return;
    }
    if (request.url === '/unrelated') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Unrelated</title><main>Unrelated navigation</main>');
      return;
    }
    if (request.url === '/late-action') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Late action</title><a id=go href="/late-destination" aria-disabled=true>Late link</a><script>setTimeout(() => { document.querySelector("#go").removeAttribute("aria-disabled"); }, 400)</script>');
      return;
    }
    if (request.url === '/late-destination') {
      destinationClicks++;
      setTimeout(() => {
        response.writeHead(200, { 'content-type': 'text/html' });
        response.end('<title>Arrived</title><main>Destination loaded</main>');
      }, 4800);
      return;
    }
    if (request.url === '/slow-destination') {
      destinationClicks++;
      setTimeout(() => {
        response.writeHead(200, { 'content-type': 'text/html' });
        response.end('<title>Arrived</title><main>Destination loaded</main>');
      }, 1800);
      return;
    }
    if (request.url === '/late-timer') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Timer start</title><button onclick="setTimeout(() => location.href = \'/timer-next\', 1200)">Continue later</button>');
      return;
    }
    if (request.url === '/late-slow-timer') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Slow timer start</title><button onclick="setTimeout(() => location.href = \'/slow-destination\', 1200)">Continue slowly</button>');
      return;
    }
    if (request.url === '/timer-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Timer destination</title><main>Timer destination loaded</main>');
      return;
    }
    if (request.url === '/late-hanging-timer') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Hanging timer start</title><button onclick="setTimeout(() => location.href = \'/never-responds\', 300)">Continue to stalled page</button>');
      return;
    }
    if (request.url === '/superseded-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Superseded start</title><button onclick="location.href = \'/slow\'; setTimeout(() => location.href = \'/done\', 100)">Continue with replacement</button>');
      return;
    }
    if (request.url === '/direct-done-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Direct done start</title><button onclick="location.href = \'/done\'">Continue directly</button>');
      return;
    }
    if (request.url === '/slow') {
      return;
    }
    if (request.url === '/done') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Done</title><main>Replacement destination loaded</main>');
      return;
    }
    if (request.url === '/never-responds') {
      return;
    }
    if (request.url === '/late-interval') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Interval start</title><button onclick="const timer=setInterval(() => { clearInterval(timer); location.href = \'/interval-next\'; }, 1200)">Continue on interval</button>');
      return;
    }
    if (request.url === '/interval-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Interval destination</title><main>Interval destination loaded</main>');
      return;
    }
    if (request.url === '/refresh-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Refresh start</title><meta http-equiv="refresh" content="1;url=/refresh-next"><main>Waiting to refresh</main>');
      return;
    }
    if (request.url === '/refresh-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Refresh destination</title><main>Refresh destination loaded</main>');
      return;
    }
    if (request.url === '/countdown') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Countdown</title><button id=resend onclick="document.body.dataset.sent=\'yes\'">Resend in 30s</button><script>let n=30;window.startCountdown=()=>{const timer=setInterval(()=>{resend.textContent=`Resend in ${--n}s`;if(n===27)clearInterval(timer)},50)}</script>');
      return;
    }
    if (request.url === '/long-timer') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Long timer</title><button onclick="setTimeout(() => document.body.dataset.late=\'yes\', 60000)">Schedule long work</button>');
      return;
    }
    if (request.url === '/short-timer') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Short timer</title><button onclick="setTimeout(() => document.querySelector(\'main\').textContent=\'Short work complete\', 500)">Schedule short work</button><main>Waiting</main>');
      return;
    }
    if (request.url === '/poller-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Poller start</title><button onclick="location.href=\'/poller-next\'">Open poller</button>');
      return;
    }
    if (request.url === '/poller-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Poller destination</title><script>setInterval(() => {}, 50)</script><main>Poller destination loaded</main>');
      return;
    }
    if (request.url === '/hydrate-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Hydrate start</title><a href="/hydrate-next">Open hydrated page</a>');
      return;
    }
    if (request.url === '/hydrate-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Hydrated destination</title><main>Loading</main><script>setTimeout(() => { document.querySelector(\'main\').textContent=\'Hydrated destination loaded\'; }, 500)</script>');
      return;
    }
    if (request.url === '/load-interval-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Load interval start</title><a href="/load-interval-next">Open interval page</a>');
      return;
    }
    if (request.url === '/load-interval-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Load interval destination</title><script>setInterval(() => {}, 5000)</script><main>Interval destination loaded</main>');
      return;
    }
    if (request.url === '/load-long-timer-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Load long timer start</title><a href="/load-long-timer-next">Open long timer page</a>');
      return;
    }
    if (request.url === '/load-long-timer-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Load long timer destination</title><script>setTimeout(() => {}, 60000)</script><main>Long timer destination loaded</main>');
      return;
    }
    if (request.url === '/cart-count') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Cart count</title><button id=cart onclick="document.body.dataset.clicked=\'yes\'">Cart (3)</button>');
      return;
    }
    if (request.url === '/numbered-rows') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Numbered rows</title><button id=first onclick="document.body.dataset.clicked=\'first\'">Delete row (1)</button><button id=second onclick="document.body.dataset.clicked=\'second\'">Delete row (2)</button>');
      return;
    }
    if (request.url === '/duration') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Duration</title><button id=reserve onclick="document.body.dataset.clicked=\'yes\'">Reserve 30 minutes</button>');
      return;
    }
    if (request.url === '/renamed') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Renamed</title><button id=action onclick="document.body.dataset.ran=\'yes\'">Delete</button>');
      return;
    }
    if (request.url === '/changed-href') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Changed href</title><a id=action href="/first">Open item 30</a>');
      return;
    }
    if (request.url === '/stale-start') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Stale start</title><button>Old page action</button>');
      return;
    }
    if (request.url === '/stale-next') {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end('<title>Stale destination</title><main>Stale destination loaded</main>');
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end('<title>Start</title><a href="/slow-destination">Delayed destination</a>');
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  b = new MantisBrowser({ actionTimeoutMs: 1500 });
});

afterAll(async () => {
  await b.close();
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe('click errors and navigation', () => {
  it('dispatches one click and waits separately for a delayed navigation', async () => {
    destinationClicks = 0;
    const view = await b.open(base);
    const result = await b.click(idOf(view, 'link "Delayed destination"'));

    expect(result).toMatch(/^clicked #\d+ link "Delayed destination"/);
    expect(destinationClicks).toBe(1);
    expect(result).toContain('Destination loaded');
    expect(result).not.toContain('is not visible');
  });

  it('starts the navigation budget after a delayed link becomes actionable', async () => {
    destinationClicks = 0;
    const view = await b.open(`${base}/late-action`);
    const result = await b.click(idOf(view, 'link "Late link"'));

    expect(result).toMatch(/^clicked #\d+ link "Late link"/);
    expect(destinationClicks).toBe(1);
    expect(result).toContain('Destination loaded');
  });

  it('keeps settling through a timer-delayed navigation instead of returning a doomed diff', async () => {
    const view = await b.open(`${base}/late-timer`);
    const result = await b.click(idOf(view, 'button "Continue later"'));

    expect(result).toMatch(/^clicked #\d+ button "Continue later"/);
    expect(result).toContain('Timer destination loaded');
    expect(result).not.toContain('(no visible change)');
  });

  it('reports a timer-triggered navigation that stalls within one navigation budget', async () => {
    const view = await b.open(`${base}/late-hanging-timer`);
    const started = Date.now();
    const result = await b.click(idOf(view, 'button "Continue to stalled page"'));

    expect(result).toBe('error: click was dispatched, but the navigation did not finish in time');
    expect(Date.now() - started).toBeGreaterThanOrEqual(4800);
    expect(Date.now() - started).toBeLessThan(6500);
  });

  it('keeps watching when a started navigation is replaced', async () => {
    const view = await b.open(`${base}/superseded-start`);
    const result = await b.click(idOf(view, 'button "Continue with replacement"'));

    expect(result).toMatch(/^clicked #\d+ button "Continue with replacement"/);
    expect(result).toContain('Replacement destination loaded');
    const page = await (b as unknown as { activePage(): Promise<{ url(): string }> }).activePage();
    expect(page.url()).toBe(`${base}/done`);
  });

  it('still reports a directly completed replacement destination', async () => {
    const view = await b.open(`${base}/direct-done-start`);
    const result = await b.click(idOf(view, 'button "Continue directly"'));

    expect(result).toMatch(/^clicked #\d+ button "Continue directly"/);
    expect(result).toContain('Replacement destination loaded');
  });

  it('waits for a main-frame request that starts after a timer and commits slowly', async () => {
    const view = await b.open(`${base}/late-slow-timer`);
    const result = await b.click(idOf(view, 'button "Continue slowly"'));

    expect(result).toMatch(/^clicked #\d+ button "Continue slowly"/);
    expect(result).toContain('Destination loaded');
    expect(result).not.toContain('(no visible change)');
  });

  it('keeps settling through an interval-delayed navigation', async () => {
    const view = await b.open(`${base}/late-interval`);
    const result = await b.click(idOf(view, 'button "Continue on interval"'));

    expect(result).toMatch(/^clicked #\d+ button "Continue on interval"/);
    expect(result).toContain('Interval destination loaded');
  });

  it('waits for a short meta refresh after open', async () => {
    const view = await b.open(`${base}/refresh-start`);

    expect(view).toContain('Refresh destination loaded');
    expect(view).not.toContain('Waiting to refresh');
  });

  it('shows the new page when an id belongs to a document that navigated away', async () => {
    const view = await b.open(`${base}/stale-start`);
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T>; waitForURL(url: string): Promise<unknown> }> }).activePage();
    await page.evaluate(() => { location.href = '/stale-next'; });
    await page.waitForURL(`${base}/stale-next`);

    const result = await b.click(idOf(view, 'button "Old page action"'));

    expect(result).toMatch(/^page navigated; showing the current page/);
    expect(result).toContain('Stale destination loaded');
    expect(result).not.toContain('no element');
  });

  it('does not turn a covered click into success when an unrelated navigation intervenes', async () => {
    const view = await b.open(`${base}/covered`);
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => { setTimeout(() => { location.href = '/unrelated'; }, 50); });

    const result = await b.click(idOf(view, 'button "Covered target"'));

    expect(result).toMatch(/^error:/);
    expect(result).not.toContain('clicked');
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(await b.read()).toContain('Unrelated navigation');
  });

  it('reports a target hidden after its id was captured without dispatching a click', async () => {
    const view = await b.open(`data:text/html,${encodeURIComponent('<title>Hidden</title><a id=target href=#next onclick="window.clicks=(window.clicks||0)+1">Hideable link</a>')}`);
    const id = idOf(view, 'link "Hideable link"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => {
      (document.getElementById('target') as HTMLElement).style.display = 'none';
    });

    const result = await b.click(id);

    expect(result).toMatch(/^error: #\d+ .*is not visible/);
    expect(await page.evaluate(() => (window as unknown as { clicks?: number }).clicks ?? 0)).toBe(0);
  });

  it('keeps a counter-only name change as the same target', async () => {
    const view = await b.open(`${base}/countdown`);
    const id = idOf(view, 'button "Resend in 30s"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T) : Promise<T> }> }).activePage();
    await page.evaluate(() => (window as unknown as { startCountdown(): void }).startCountdown());
    await new Promise((resolve) => setTimeout(resolve, 100));

    const result = await b.click(id);

    expect(result).toMatch(new RegExp(`^clicked #${id} button "Resend in 30s"`));
    expect(await page.evaluate(() => document.body.dataset.sent)).toBe('yes');
  });

  it('keeps an explicit parenthesized count badge as the same target', async () => {
    const view = await b.open(`${base}/cart-count`);
    const id = idOf(view, 'button "Cart (3)"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => { document.getElementById('cart')!.textContent = 'Cart (4)'; });

    expect(await b.click(id)).toMatch(new RegExp(`^clicked #${id} button "Cart \\(3\\)"`));
    expect(await page.evaluate(() => document.body.dataset.clicked)).toBe('yes');
  });

  it('does not rematch a removed numbered control to the sole remaining numbered control', async () => {
    const view = await b.open(`${base}/numbered-rows`);
    const id = idOf(view, 'button "Delete row (1)"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => { document.getElementById('first')!.remove(); });

    expect(await b.click(id)).toMatch(new RegExp(`^error: #${id} no longer exists`));
    expect(await page.evaluate(() => document.body.dataset.clicked)).toBeUndefined();
  });

  it('does not accept a changed duration on a persisted control', async () => {
    const view = await b.open(`${base}/duration`);
    const id = idOf(view, 'button "Reserve 30 minutes"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => { document.getElementById('reserve')!.textContent = 'Reserve 60 minutes'; });

    expect(await b.click(id)).toMatch(new RegExp(`^error: #${id} changed from button "Reserve 30 minutes" to button "Reserve 60 minutes"`));
    expect(await page.evaluate(() => document.body.dataset.clicked)).toBeUndefined();
  });

  it('ignores an action-created timer outside the settle window', async () => {
    const view = await b.open(`${base}/long-timer`);
    const started = Date.now();
    await b.click(idOf(view, 'button "Schedule long work"'));

    expect(Date.now() - started).toBeLessThan(1000);
  });

  it('waits for an action-created short timer that changes rendered content', async () => {
    const view = await b.open(`${base}/short-timer`);
    const started = Date.now();
    const result = await b.click(idOf(view, 'button "Schedule short work"'));

    expect(Date.now() - started).toBeGreaterThanOrEqual(400);
    expect(result).toContain('Short work complete');
  });

  it('does not wait on a background interval created by the navigated document', async () => {
    const view = await b.open(`${base}/poller-start`);
    const started = Date.now();
    const result = await b.click(idOf(view, 'button "Open poller"'));

    expect(Date.now() - started).toBeLessThan(1000);
    expect(result).toContain('Poller destination loaded');
  });

  it('waits for short load-time work in a destination document', async () => {
    const view = await b.open(`${base}/hydrate-start`);
    const started = Date.now();
    const result = await b.click(idOf(view, 'link "Open hydrated page"'));

    expect(Date.now() - started).toBeGreaterThanOrEqual(400);
    expect(result).toContain('Hydrated destination loaded');
  });

  it('does not wait on long-lived load-time timers or intervals', async () => {
    const intervalView = await b.open(`${base}/load-interval-start`);
    let started = Date.now();
    expect(await b.click(idOf(intervalView, 'link "Open interval page"'))).toContain('Interval destination loaded');
    expect(Date.now() - started).toBeLessThan(1000);

    const timerView = await b.open(`${base}/load-long-timer-start`);
    started = Date.now();
    expect(await b.click(idOf(timerView, 'link "Open long timer page"'))).toContain('Long timer destination loaded');
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it('still rejects a genuinely renamed target (near miss)', async () => {
    const view = await b.open(`${base}/renamed`);
    const id = idOf(view, 'button "Delete"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => { document.getElementById('action')!.textContent = 'Save'; });

    expect(await b.click(id)).toMatch(new RegExp(`^error: #${id} changed from button "Delete" to button "Save"`));
    expect(await page.evaluate(() => document.body.dataset.ran)).toBeUndefined();
  });

  it('still rejects a destination change even when only the counter text also changes', async () => {
    const view = await b.open(`${base}/changed-href`);
    const id = idOf(view, 'link "Open item 30"');
    const page = await (b as unknown as { activePage(): Promise<{ evaluate<T>(fn: () => T): Promise<T> }> }).activePage();
    await page.evaluate(() => {
      const link = document.getElementById('action')!;
      link.textContent = 'Open item 29';
      link.setAttribute('href', '/second');
    });

    expect(await b.click(id)).toMatch(new RegExp(`^error: #${id} changed from link "Open item 30" to link "Open item 29"`));
  });

  it('tells agents not to retry a response-blocked local route', async () => {
    const page = await (b as unknown as { activePage(): Promise<{ goto: (url: string) => Promise<unknown> }> }).activePage();
    const originalGoto = page.goto;
    page.goto = async () => { throw new Error('net::ERR_BLOCKED_BY_RESPONSE'); };
    try {
      await expect(b.open(`${base}/blocked`)).resolves.toBe(
        `error: could not open ${base}/blocked: blocked by the site; do not retry this URL; choose another route or report blocked`,
      );
    } finally {
      page.goto = originalGoto;
    }
  });

  it('does not mistake successful actionability and scheduled navigation waits for invisibility', () => {
    const error = `TimeoutError: locator.click: Timeout 1500ms exceeded.\nCall log:\n  - waiting for element to be visible, enabled and stable\n  - element is visible, enabled and stable\n  - waiting for scheduled navigations to finish`;
    expect(classifyClickError(error)).toBeNull();
  });

  it('keeps an interception when a timed-out retry only logged visibility', () => {
    const retry = 'Timeout 300ms exceeded.\nCall log:\n  - waiting for element to be visible, enabled and stable\n  - element is visible, enabled and stable\n  - <html>…</html> intercepts pointer events\n  - retrying click action\n  - waiting for element to be visible, enabled and stable\n  - element is visible, enabled and stable\n  - scrolling into view if needed';
    expect(classifyClickError(retry)).toBe('intercepted');
    // Near miss: visibility after a hidden state still clears it, and navigation waiting clears an interception.
    expect(classifyClickError('element is not visible\n  element is visible, enabled and stable')).toBeNull();
    expect(classifyClickError(`${retry}\n  - waiting for scheduled navigations to finish`)).toBeNull();
  });
});
