import { createServer, type Server } from 'node:http';
import { createServer as netServer } from 'node:net';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { MantisBrowser } from '../src/browser.js';
import { chromeCandidates, findChrome, runChromeCommand } from '../src/chrome.js';
import { chromiumExecutable } from '../src/userAgent.js';

const freePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const s = netServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address() as { port: number };
      s.close(() => resolve(port));
    });
  });

let server: Server;
let origin: string;
let userChrome: Browser;
let cdpUrl: string;

beforeAll(async () => {
  server = createServer((req, res) => {
    res.setHeader('content-type', 'text/html');
    if (req.url === '/two') res.end('<title>Second</title><h1>Second tab</h1><p>Other page</p>');
    else
      res.end(
        `<title>First</title><h1>Welcome back</h1><input aria-label="Note" id="n"><button id="b" onclick="document.getElementById('out').textContent='clicked '+document.getElementById('n').value">Send</button><p id="out"></p><p id="ck"></p><script>document.getElementById('ck').textContent='cookie='+document.cookie</script>`,
      );
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const port = await freePort();
  userChrome = await chromium.launch({ headless: true, args: [`--remote-debugging-port=${port}`], ...chromiumExecutable() });
  cdpUrl = `http://127.0.0.1:${port}`;
  // The stand-in "user Chrome": two tabs and a cookie set before Mantis attaches.
  const ctx = await userChrome.newContext();
  await ctx.addCookies([{ name: 'session', value: 'abc123', url: origin }]);
  const first = await ctx.newPage();
  await first.goto(`${origin}/`);
  const second = await ctx.newPage();
  await second.goto(`${origin}/two`);
}, 60_000);

afterAll(async () => {
  await userChrome?.close().catch(() => undefined);
  await new Promise((r) => server?.close(r));
});

it('attaches to a running Chrome: sees its tabs and session, acts, and leaves the browser open on close', async () => {
  const m = new MantisBrowser({ cdpUrl });
  let pagesDuring = 0;
  try {
    const tabs = await m.tabs('list');
    pagesDuring = tabs.split('\n').filter((l) => l.includes(' #')).length;
    expect(tabs).toContain('"First"');
    expect(tabs).toContain('"Second"');
    // Tab order over CDP is not guaranteed, so pick the tab by title.
    await m.tabs('switch', Number(tabs.match(/#(\d+) "First"/)?.[1]));
    const first = await m.read();
    expect(first, first).toContain('cookie=session=abc123');
    const input = Number(first.match(/#(\d+)[^\n]*Note/)?.[1]);
    const button = Number(first.match(/#(\d+)[^\n]*Send/)?.[1]);
    expect(Number.isInteger(input) && Number.isInteger(button), first).toBe(true);
    expect(await m.type(input, 'hello')).not.toMatch(/^error/);
    expect(await m.click(button)).toContain('clicked hello');
  } finally {
    await m.close();
  }
  expect(pagesDuring).toBeGreaterThanOrEqual(2);
  expect(userChrome.isConnected()).toBe(true);
  const pages = userChrome.contexts().flatMap((c) => c.pages());
  expect(pages.length).toBeGreaterThanOrEqual(2);
  const texts = await Promise.all(pages.map((p) => p.evaluate(() => document.getElementById('out')?.textContent ?? '')));
  expect(texts).toContain('clicked hello');
}, 60_000);

it('automatically attaches to a detected Chrome, unless autoAttach is false', async () => {
  const previous = {
    cdp: process.env.MANTIS_CDP_URL,
    auto: process.env.MANTIS_AUTO_ATTACH,
    autoUrl: process.env.MANTIS_AUTO_ATTACH_URL,
  };
  delete process.env.MANTIS_CDP_URL;
  process.env.MANTIS_AUTO_ATTACH = '1';
  process.env.MANTIS_AUTO_ATTACH_URL = cdpUrl;
  try {
    const automatic = new MantisBrowser();
    try {
      expect(await automatic.tabs('list')).toContain('"First"');
    } finally {
      await automatic.close();
    }

    const disabled = new MantisBrowser({ autoAttach: false });
    try {
      expect(await disabled.tabs('list')).not.toContain('"First"');
    } finally {
      await disabled.close();
    }
  } finally {
    if (previous.cdp === undefined) delete process.env.MANTIS_CDP_URL;
    else process.env.MANTIS_CDP_URL = previous.cdp;
    if (previous.auto === undefined) delete process.env.MANTIS_AUTO_ATTACH;
    else process.env.MANTIS_AUTO_ATTACH = previous.auto;
    if (previous.autoUrl === undefined) delete process.env.MANTIS_AUTO_ATTACH_URL;
    else process.env.MANTIS_AUTO_ATTACH_URL = previous.autoUrl;
  }
}, 60_000);

it('uses an explicit cdpUrl before the automatic endpoint', async () => {
  const previous = {
    auto: process.env.MANTIS_AUTO_ATTACH,
    autoUrl: process.env.MANTIS_AUTO_ATTACH_URL,
  };
  process.env.MANTIS_AUTO_ATTACH = '1';
  process.env.MANTIS_AUTO_ATTACH_URL = 'http://127.0.0.1:1';
  const m = new MantisBrowser({ cdpUrl });
  try {
    expect(await m.tabs('list')).toContain('"First"');
  } finally {
    await m.close();
    if (previous.auto === undefined) delete process.env.MANTIS_AUTO_ATTACH;
    else process.env.MANTIS_AUTO_ATTACH = previous.auto;
    if (previous.autoUrl === undefined) delete process.env.MANTIS_AUTO_ATTACH_URL;
    else process.env.MANTIS_AUTO_ATTACH_URL = previous.autoUrl;
  }
}, 60_000);

it('reports a clear error when nothing listens at cdpUrl', async () => {
  const port = await freePort();
  const m = new MantisBrowser({ cdpUrl: `http://127.0.0.1:${port}` });
  const out = await m.open('about:blank');
  expect(out).toMatch(/^error: could not attach to Chrome at/);
  expect(out).toContain('mantis chrome');
  expect(out).toContain('automatically finds its default');
  await m.close();
}, 30_000);

it('finds Chrome in the usual install paths, honours MANTIS_CHROME, and reports none', () => {
  const win = chromeCandidates('win32', { PROGRAMFILES: 'C:\\PF', LOCALAPPDATA: 'C:\\L' });
  expect(win).toHaveLength(2);
  expect(win[0]).toMatch(/PF.*Google.*Chrome.*chrome\.exe$/);
  expect(findChrome({ platform: 'darwin', env: {}, exists: (p) => p.startsWith('/Applications/Google Chrome.app') })).toContain('Google Chrome');
  expect(findChrome({ platform: 'linux', env: {}, exists: (p) => p === '/usr/bin/google-chrome-stable' })).toBe('/usr/bin/google-chrome-stable');
  expect(findChrome({ platform: 'linux', env: { MANTIS_CHROME: '/x/chrome' }, exists: () => false })).toBe('/x/chrome');
  expect(findChrome({ platform: 'linux', env: {}, exists: () => false })).toBeUndefined();
});

it('mantis chrome: already running prints the endpoint without starting Chrome; help and bad flags', async () => {
  const lines: string[] = [];
  const spawn = (): void => { throw new Error('must not start Chrome'); };
  expect(await runChromeCommand(['chrome', '--port', '9444'], { probe: async () => true, spawn, log: (l) => lines.push(l) })).toBe(0);
  expect(lines.join('\n')).toContain('MANTIS_CDP_URL=http://127.0.0.1:9444');
  expect(await runChromeCommand(['read'], {})).toBeUndefined();
  const help: string[] = [];
  expect(await runChromeCommand(['chrome', '--help'], { log: (l) => help.push(l) })).toBe(0);
  expect(help.join('\n')).toContain('usage: mantis chrome');
  expect(await runChromeCommand(['chrome', '--port', 'nope'], { error: () => undefined })).toBe(2);
});

it('mantis chrome: starts Chrome with the debug flags and waits for the endpoint; fails when absent or silent', async () => {
  const profile = mkdtempSync(join(tmpdir(), 'mantis-chrome-test-'));
  const calls: Array<[string, string[]]> = [];
  let probes = 0;
  const code = await runChromeCommand(['chrome', '--port', '9555', '--profile', profile], {
    platform: 'linux', env: {}, exists: (p) => p === '/usr/bin/google-chrome',
    probe: async () => ++probes > 2, spawn: (c, a) => calls.push([c, a]), sleep: async () => undefined, log: () => undefined,
  });
  expect(code).toBe(0);
  expect(calls[0]![0]).toBe('/usr/bin/google-chrome');
  expect(calls[0]![1]).toEqual(expect.arrayContaining([
    '--remote-debugging-port=9555', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  ]));
  expect(await runChromeCommand(['chrome', '--profile', profile], { platform: 'linux', env: {}, exists: () => false, probe: async () => false, error: () => undefined })).toBe(1);
  expect(await runChromeCommand(['chrome', '--profile', profile], { platform: 'linux', env: { MANTIS_CHROME: '/x' }, probe: async () => false, spawn: () => undefined, sleep: async () => undefined, waitMs: 5, error: () => undefined })).toBe(1);
});
