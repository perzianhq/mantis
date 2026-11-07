import { createServer, type Server } from 'node:http';
import { createServer as netServer } from 'node:net';
import { afterEach, expect, it } from 'vitest';
import { detectDebugChrome } from '../src/browser.js';

const servers: Server[] = [];

async function listen(handler: Parameters<typeof createServer>[0]): Promise<string> {
  const server = createServer(handler);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${(server.address() as { port: number }).port}`;
}

async function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = netServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
}

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

it('detects a Chrome debugging endpoint from its version response', async () => {
  const endpoint = await listen((req, res) => {
    expect(req.url).toBe('/json/version');
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ webSocketDebuggerUrl: 'ws://127.0.0.1/devtools/browser/example' }));
  });
  await expect(detectDebugChrome(endpoint)).resolves.toBe(endpoint);
});

it('returns undefined when nothing is listening', async () => {
  await expect(detectDebugChrome(`http://127.0.0.1:${await freePort()}`, 100)).resolves.toBeUndefined();
});

it.each([
  ['invalid JSON', 'not json'],
  ['JSON without a debugger URL', JSON.stringify({ Browser: 'Chrome' })],
])('returns undefined for %s', async (_label, body) => {
  const endpoint = await listen((_req, res) => {
    res.statusCode = 200;
    res.end(body);
  });
  await expect(detectDebugChrome(endpoint)).resolves.toBeUndefined();
});

it('returns undefined for a non-success response', async () => {
  const endpoint = await listen((_req, res) => {
    res.statusCode = 404;
    res.end();
  });
  await expect(detectDebugChrome(endpoint)).resolves.toBeUndefined();
});

it('returns undefined when the version response times out', async () => {
  const endpoint = await listen((_req, res) => {
    setTimeout(() => res.end(JSON.stringify({ webSocketDebuggerUrl: 'ws://late' })), 100);
  });
  await expect(detectDebugChrome(endpoint, 20)).resolves.toBeUndefined();
});

it('rejects a 201, a redirect and a non-local address', async () => {
  const body = JSON.stringify({ webSocketDebuggerUrl: 'ws://127.0.0.1/devtools/browser/example' });
  const created = await listen((_req, res) => {
    res.statusCode = 201;
    res.end(body);
  });
  await expect(detectDebugChrome(created)).resolves.toBeUndefined();
  const target = await listen((_req, res) => res.end(body));
  const redirecting = await listen((_req, res) => {
    res.statusCode = 302;
    res.setHeader('location', `${target}/json/version`);
    res.end();
  });
  await expect(detectDebugChrome(redirecting)).resolves.toBeUndefined();
  await expect(detectDebugChrome('http://192.0.2.1:9222', 100)).resolves.toBeUndefined();
});
