import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { createMcpProxy, isForbiddenBenchmarkNavigation } from '../bench/agent/mcp-proxy.js';

it('blocks source and JavaScript URLs for every UI browser navigator while preserving http(s) fixture URLs', () => {
  for (const tool of ['open', 'navigate', 'browser_navigate']) {
    expect(isForbiddenBenchmarkNavigation(tool, { url: 'view-source:https://example.test/page' })).toBe(true);
    expect(isForbiddenBenchmarkNavigation(tool, { url: '  JAVASCRIPT:alert(1)' })).toBe(true);
    expect(isForbiddenBenchmarkNavigation(tool, { url: 'java\nscript:alert(1)' })).toBe(true);
    expect(isForbiddenBenchmarkNavigation(tool, { url: 'http://127.0.0.1:4173/fixture' })).toBe(false);
    expect(isForbiddenBenchmarkNavigation(tool, { url: 'https://example.test/page' })).toBe(false);
  }
  expect(isForbiddenBenchmarkNavigation('click', { url: 'javascript:alert(1)' })).toBe(false);
});

it('returns an MCP error without forwarding a forbidden navigation to the browser child', () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let forwarded = '';
  stdin.setEncoding('utf8');
  stdin.on('data', (chunk: string) => { forwarded += chunk; });
  const proxy = createMcpProxy({ stdin, stdout });
  const replies: string[] = [];
  let socket: EventEmitter & { setEncoding: () => unknown; write: (line: string) => boolean };
  socket = Object.assign(new EventEmitter(), {
    setEncoding: () => socket,
    write: (line: string) => { replies.push(line); return true; },
  });
  proxy.attach(socket as never);
  socket.emit('data', JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'browser_navigate', arguments: { url: 'view-source:https://example.test' } } }) + '\n');
  expect(forwarded).toBe('');
  expect(replies.map((line) => JSON.parse(line))).toEqual([expect.objectContaining({ id: 7, error: expect.objectContaining({ message: expect.stringContaining('URL policy blocks') }) })]);
  proxy.close('test complete');
});

it('enforces the navigation policy for Sarvam’s direct proxy calls before the child receives them', async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let forwarded = '';
  stdin.setEncoding('utf8');
  stdin.on('data', (chunk: string) => { forwarded += chunk; });
  const proxy = createMcpProxy({ stdin, stdout });
  await expect(proxy.call('tools/call', { name: 'navigate', arguments: { url: 'view-source:https://example.test' } })).rejects.toThrow('URL policy blocks');
  await expect(proxy.call('tools/call', { name: 'open', arguments: { url: 'java\tscript:alert(1)' } })).rejects.toThrow('URL policy blocks');
  expect(forwarded).toBe('');
  proxy.close('test complete');
});

it('forwards ordinary http(s) and localhost direct navigation calls', async () => {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  let buffered = '';
  const forwarded: any[] = [];
  stdin.setEncoding('utf8');
  stdin.on('data', (chunk: string) => {
    buffered += chunk;
    for (let end = buffered.indexOf('\n'); end >= 0; end = buffered.indexOf('\n')) {
      const request = JSON.parse(buffered.slice(0, end)); buffered = buffered.slice(end + 1); forwarded.push(request);
      stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: request.method === 'initialize' ? { protocolVersion: '2025-03-26' } : { forwarded: request.params } }) + '\n');
    }
  });
  const proxy = createMcpProxy({ stdin, stdout });
  for (const url of ['http://127.0.0.1:4173/fixture', 'https://example.test/page']) {
    await expect(proxy.call('tools/call', { name: 'navigate', arguments: { url } })).resolves.toEqual({ forwarded: { name: 'navigate', arguments: { url } } });
  }
  expect(forwarded.filter((request) => request.method === 'tools/call')).toHaveLength(2);
  proxy.close('test complete');
});

describe('MCP proxy cancellation', () => {
  it('removes the shared abort listener after every completed harness request', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    let buffered = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => {
      buffered += chunk;
      for (let newline = buffered.indexOf('\n'); newline >= 0; newline = buffered.indexOf('\n')) {
        const line = buffered.slice(0, newline);
        buffered = buffered.slice(newline + 1);
        const request = JSON.parse(line) as { id: string; method: string; params?: { name?: string } };
        if (request.params?.name === 'wait-forever') continue;
        stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { method: request.method } }) + '\n');
      }
    });
    const proxy = createMcpProxy({ stdin, stdout });
    const controller = new AbortController();
    const add = vi.spyOn(controller.signal, 'addEventListener');
    const remove = vi.spyOn(controller.signal, 'removeEventListener');

    for (let index = 0; index < 11; index++) {
      await expect(proxy.call('tools/call', { name: `tool-${index}` }, 1_000, controller.signal)).resolves.toMatchObject({ method: 'tools/call' });
    }

    // One listener for initialize, then one per completed tool call. A finished
    // request must not retain a listener on the long-lived run-level signal.
    expect(add).toHaveBeenCalledTimes(12);
    expect(remove).toHaveBeenCalledTimes(12);

    const abortingController = new AbortController();
    const abortAdd = vi.spyOn(abortingController.signal, 'addEventListener');
    const abortRemove = vi.spyOn(abortingController.signal, 'removeEventListener');
    const waiting = proxy.call('tools/call', { name: 'wait-forever' }, 1_000, abortingController.signal);
    await Promise.resolve(); // let the async proxy register the request before cancellation
    abortingController.abort(new Error('cancel test'));
    await expect(waiting).rejects.toThrow('cancel test');
    expect(abortAdd).toHaveBeenCalledTimes(1);
    expect(abortRemove).toHaveBeenCalledTimes(1);
    proxy.close('test complete');
  });
});

describe('MCP proxy readiness', () => {
  it('warms one child session and replays that handshake to the later agent', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    let buffered = '';
    let initializes = 0;
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => {
      buffered += chunk;
      for (let newline = buffered.indexOf('\n'); newline >= 0; newline = buffered.indexOf('\n')) {
        const line = buffered.slice(0, newline);
        buffered = buffered.slice(newline + 1);
        const request = JSON.parse(line) as { id?: string; method: string };
        if (request.method === 'initialize') {
          initializes++;
          stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { protocolVersion: '2025-03-26', serverInfo: { name: 'fake' } } }) + '\n');
        }
      }
    });
    const proxy = createMcpProxy({ stdin, stdout });
    await proxy.ready(1_000);

    const replies: string[] = [];
    let socket: EventEmitter & { setEncoding: () => unknown; write: (line: string) => boolean };
    socket = Object.assign(new EventEmitter(), {
      setEncoding: () => socket,
      write: (line: string) => { replies.push(line); return true; },
    });
    proxy.attach(socket as never);
    socket.emit('data', JSON.stringify({ jsonrpc: '2.0', id: 'agent-init', method: 'initialize', params: {} }) + '\n');
    socket.emit('data', JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    await Promise.resolve();

    expect(initializes).toBe(1);
    expect(replies.map((line) => JSON.parse(line))).toEqual([
      { jsonrpc: '2.0', id: 'agent-init', result: { protocolVersion: '2025-03-26', serverInfo: { name: 'fake' } } },
    ]);
    proxy.close('test complete');
  });

  it('allows a delayed initialize response within the normal MCP request deadline', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => {
      const request = JSON.parse(chunk.trim()) as { id: string; method: string };
      if (request.method === 'initialize') setTimeout(() => {
        stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { protocolVersion: '2025-03-26' } }) + '\n');
      }, 25);
    });
    const proxy = createMcpProxy({ stdin, stdout });
    await expect(proxy.ready(100)).resolves.toBeUndefined();
    proxy.close('test complete');
  });

  it('times out a never-ready child and releases a later retry', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    let attempts = 0;
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => {
      const request = JSON.parse(chunk.trim()) as { id: string; method: string };
      if (request.method !== 'initialize') return;
      attempts++;
      if (attempts === 2) stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: {} }) + '\n');
    });
    const proxy = createMcpProxy({ stdin, stdout });
    await expect(proxy.ready(10)).rejects.toThrow('initialize timed out after 10 ms');
    await expect(proxy.ready(100)).resolves.toBeUndefined();
    expect(attempts).toBe(2);
    proxy.close('test complete');
  });

  it('forwards a Codex or Claude handshake unchanged when readiness was not requested', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const forwarded: unknown[] = [];
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => { forwarded.push(...chunk.trim().split('\n').filter(Boolean).map(JSON.parse)); });
    const proxy = createMcpProxy({ stdin, stdout });
    const socket = Object.assign(new EventEmitter(), {
      setEncoding: () => socket,
      write: () => true,
    });
    proxy.attach(socket as never);
    socket.emit('data', JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { clientInfo: { name: 'codex' } } }) + '\n');
    socket.emit('data', JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');
    expect(forwarded).toEqual([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { clientInfo: { name: 'codex' } } },
      { jsonrpc: '2.0', method: 'notifications/initialized', params: {} },
    ]);
    proxy.close('test complete');
  });

  it('rejects readiness immediately when cleanup closes the proxy', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const proxy = createMcpProxy({ stdin, stdout });
    const waiting = proxy.ready(1_000);
    proxy.close('server exited during startup');
    await expect(waiting).rejects.toThrow('server exited during startup');
  });

  it('cleans up a pending readiness request when the child stdout ends', async () => {
    const stdin = new PassThrough();
    const stdout = new PassThrough();
    const proxy = createMcpProxy({ stdin, stdout });

    const waiting = proxy.ready(1_000);
    stdout.end(); // Simulates the MCP child early-exiting; no test-side proxy.close().

    await expect(waiting).rejects.toThrow('MCP server stdout ended during startup');
  });
});
