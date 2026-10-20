/**
 * Line-framed proxy between the agent's MCP connections (TCP sockets, via bridge.mjs) and an MCP server child
 * speaking newline-delimited JSON-RPC on stdio. Besides forwarding, it gives the eval harness its own channel to
 * the same server: `call()` writes requests with `__bench_<n>` ids and consumes their responses, so the agent never
 * sees them, and `onToolResult()` reports each agent tool call once its response has been forwarded. Whole lines
 * only, so a harness line never lands in the middle of an agent line. Sarvam's direct harness path may initialize
 * the child while warming it; Codex and Claude continue to forward their MCP handshakes unchanged.
 */
import type { Readable, Writable } from 'node:stream';
import type net from 'node:net';

const HARNESS_PREFIX = '__bench_';
const URL_POLICY_MESSAGE = 'URL policy blocks view-source: and javascript: navigation in UI-only benchmarks.';

/** UI-only browser approaches must not inspect source or execute URL JavaScript. */
export function isForbiddenBenchmarkNavigation(name: unknown, args: unknown): boolean {
  if (name !== 'open' && name !== 'navigate' && name !== 'browser_navigate') return false;
  if (!args || typeof args !== 'object') return false;
  const url = (args as Record<string, unknown>).url;
  // Browsers discard ASCII controls around schemes. Apply the same normalization
  // before checking so a newline or tab cannot turn a forbidden scheme into a bypass.
  const normalized = typeof url === 'string' ? url.normalize('NFKC').replace(/[\u0000-\u0020\u007f-\u009f]/g, '') : '';
  return /^(?:view-source|javascript):/i.test(normalized);
}

export interface McpProxy {
  /** Route one agent connection through the proxy. */
  attach(socket: net.Socket): void;
  /** Harness-only JSON-RPC request; resolves with `result`, rejects on an error response or timeout. */
  call(method: string, params: object, timeoutMs?: number, signal?: AbortSignal): Promise<any>;
  /**
   * Initialize the server through the direct harness path and wait until it can
   * answer MCP requests. Only the Sarvam runner uses this before discovery.
   */
  ready(timeoutMs?: number, signal?: AbortSignal): Promise<void>;
  /** Called after an agent tools/call response has been forwarded, with the number of agent tool calls completed. */
  onToolResult(callback: (count: number) => void): void;
  /** Reject the harness requests still waiting (the server is going away). */
  close(reason: string): void;
}

function lineSplitter(onLine: (line: string) => void): (chunk: string) => void {
  let buffer = '';
  return (chunk) => {
    buffer += chunk;
    for (let end = buffer.indexOf('\n'); end >= 0; end = buffer.indexOf('\n')) {
      const line = buffer.slice(0, end);
      buffer = buffer.slice(end + 1);
      onLine(line);
    }
  };
}

function parseLine(line: string): Record<string, any> | null {
  if (!line.trimStart().startsWith('{')) return null;
  try { const value: unknown = JSON.parse(line); return value && typeof value === 'object' ? value as Record<string, any> : null; } catch { return null; }
}

export function createMcpProxy(child: { stdin: Writable; stdout: Readable }): McpProxy {
  const sockets = new Set<net.Socket>();
  /** Ids of the agent's tools/call requests still unanswered, per connection. */
  const agentCalls = new Map<net.Socket, Set<string>>();
  const pending = new Map<string, { resolve: (value: any) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> }>();
  const listeners: ((count: number) => void)[] = [];
  let agentInitialized = false;
  let serverReady: Promise<any> | null = null;
  let initializeResult: any;
  let completed = 0;
  let nextId = 0;

  const closePending = (reason: string): void => {
    for (const [id, waiting] of pending) {
      clearTimeout(waiting.timer);
      waiting.reject(new Error(reason));
      pending.delete(id);
    }
  };

  const send = (message: object): void => { child.stdin.write(JSON.stringify(message) + '\n'); };
  const request = (method: string, params: object, timeoutMs: number, signal?: AbortSignal): Promise<any> => new Promise((resolve, reject) => {
    const id = `${HARNESS_PREFIX}${++nextId}`;
    if (signal?.aborted) { reject(signal.reason instanceof Error ? signal.reason : new Error('MCP request aborted')); return; }
    const abort = (): void => {
      pending.delete(id);
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(signal?.reason instanceof Error ? signal.reason : new Error('MCP request aborted'));
    };
    const timer = setTimeout(() => { pending.delete(id); signal?.removeEventListener('abort', abort); reject(new Error(`${method} timed out after ${timeoutMs} ms`)); }, timeoutMs);
    pending.set(id, { resolve: (value) => { signal?.removeEventListener('abort', abort); resolve(value); }, reject: (error) => { signal?.removeEventListener('abort', abort); reject(error); }, timer });
    signal?.addEventListener('abort', abort, { once: true });
    try { send({ jsonrpc: '2.0', id, method, params }); } catch (error) { abort(); }
  });

  const initialize = (timeoutMs: number, signal?: AbortSignal): Promise<any> => {
    serverReady ??= request('initialize', {
      protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'bench-capture', version: '1.0' },
    }, timeoutMs, signal).then((result) => {
      initializeResult = result;
      send({ jsonrpc: '2.0', method: 'notifications/initialized' });
      return result;
    }).catch((error) => {
      serverReady = null;
      throw error;
    });
    return serverReady;
  };

  child.stdout.setEncoding('utf8');
  // A child that exits while a readiness request is pending closes stdout. Do
  // not leave its 15 s request timer alive until the harness notices the exit.
  child.stdout.once('end', () => closePending('MCP server stdout ended during startup'));
  child.stdout.on('data', lineSplitter((line) => {
    const message = parseLine(line);
    if (message && typeof message.id === 'string' && message.id.startsWith(HARNESS_PREFIX) && message.method === undefined) {
      const waiting = pending.get(message.id);
      if (!waiting) return; // a late answer to a request that timed out
      pending.delete(message.id);
      clearTimeout(waiting.timer);
      if (message.error) waiting.reject(new Error(message.error.message ?? 'MCP error'));
      else waiting.resolve(message.result);
      return;
    }
    for (const socket of sockets) socket.write(line + '\n');
    if (message && message.method === undefined && message.id !== undefined && ('result' in message || 'error' in message)) {
      const key = JSON.stringify(message.id);
      for (const calls of agentCalls.values()) {
        if (!calls.delete(key)) continue;
        completed++;
        for (const listener of listeners) { try { listener(completed); } catch { /* a harness hook must not break forwarding */ } }
        break;
      }
    }
  }));

  return {
    attach(socket) {
      sockets.add(socket);
      agentCalls.set(socket, new Set());
      socket.setEncoding('utf8');
      socket.on('error', () => { /* MCP clients can disconnect while the child remains healthy */ });
      socket.on('close', () => { sockets.delete(socket); agentCalls.delete(socket); });
      socket.on('data', lineSplitter((line) => {
        const message = parseLine(line);
        if (message?.method === 'tools/call' && isForbiddenBenchmarkNavigation(message.params?.name, message.params?.arguments)) {
          socket.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, error: { code: -32602, message: 'URL policy blocks view-source: and javascript: navigation in UI-only benchmarks.' } }) + '\n');
          return;
        }
        if (message?.method === 'initialize') {
          agentInitialized = true;
          // The harness has already initialized the one stdio MCP session during
          // warm-up. Replay its handshake to the agent instead of sending a
          // second initialize request to the child.
          if (serverReady) {
            void serverReady.then((result) => {
              socket.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, result: initializeResult ?? result }) + '\n');
            }, (error: Error) => {
              socket.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, error: { code: -32000, message: error.message } }) + '\n');
            });
            return;
          }
        }
        // `ready()` already notified the server. The agent's corresponding
        // notification is local protocol bookkeeping and must not be replayed.
        if (message?.method === 'notifications/initialized' && serverReady) return;
        if (message?.method === 'tools/call' && message.id !== undefined) agentCalls.get(socket)?.add(JSON.stringify(message.id));
        child.stdin.write(line + '\n');
      }));
    },
    async call(method, params, timeoutMs = 15_000, signal) {
      if (method === 'tools/call' && isForbiddenBenchmarkNavigation((params as { name?: unknown }).name, (params as { arguments?: unknown }).arguments)) {
        throw new Error(URL_POLICY_MESSAGE);
      }
      if (!agentInitialized) {
        await initialize(timeoutMs, signal);
      }
      return request(method, params, timeoutMs, signal);
    },
    async ready(timeoutMs = 15_000, signal) {
      await initialize(timeoutMs, signal);
    },
    onToolResult(callback) { listeners.push(callback); },
    close(reason) { closePending(reason); },
  };
}
