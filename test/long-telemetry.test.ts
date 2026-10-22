import { EventEmitter } from 'node:events';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { createMcpProxy } from '../bench/agent/mcp-proxy.js';
import { runSarvamAgent } from '../bench/agent/sarvam-agent.js';
import { createLongTelemetry, readLongRecords, summarizeLongFile, summarizeLongRecords, ToolCallCap } from '../bench/agent/long-telemetry.js';
import type { ToolCallEvent } from '../bench/agent/long-telemetry.js';

/** Fake MCP child that answers every request; `fail` names tools whose result is an error. */
function fakeChild(fail: Record<string, string> = {}) {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  const received: any[] = [];
  let buffered = '';
  stdin.setEncoding('utf8');
  stdin.on('data', (chunk: string) => {
    buffered += chunk;
    for (let end = buffered.indexOf('\n'); end >= 0; end = buffered.indexOf('\n')) {
      const request = JSON.parse(buffered.slice(0, end));
      buffered = buffered.slice(end + 1);
      received.push(request);
      if (request.id === undefined) continue;
      const name = request.params?.name as string | undefined;
      const result = request.method === 'initialize' ? { protocolVersion: '2025-03-26' }
        : name && fail[name] ? { content: [{ type: 'text', text: fail[name] }], isError: true }
        : { content: [{ type: 'text', text: `ok ${name ?? ''}` }] };
      stdout.write(JSON.stringify({ jsonrpc: '2.0', id: request.id, result }) + '\n');
    }
  });
  return { stdin, stdout, received };
}
function fakeSocket() {
  const replies: any[] = [];
  const socket: any = Object.assign(new EventEmitter(), { setEncoding: () => socket, write: (line: string) => { replies.push(JSON.parse(line)); return true; } });
  return { socket, replies, send: (message: object) => socket.emit('data', JSON.stringify(message) + '\n') };
}
const toolCall = (id: number | string, name: string, args: object = {}) => ({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } });
const settle = () => new Promise((resolve) => setTimeout(resolve, 20));

describe('ToolCallCap', () => {
  it('admits exactly N dispatches and only reports exhaustion once a call is refused', () => {
    const cap = new ToolCallCap(2);
    const fired = vi.fn();
    cap.onExhausted(fired);
    expect([cap.tryDispatch(), cap.tryDispatch()]).toEqual([true, true]);
    expect(cap.exhausted).toBe(false); // reaching N is not a limit hit; the model may still answer
    expect(cap.limitKind).toBeNull();
    expect([cap.tryDispatch(), cap.tryDispatch()]).toEqual([false, false]);
    expect(cap).toMatchObject({ dispatched: 2, blocked: 2, exhausted: true, limitKind: 'tool_calls' });
    expect(fired).toHaveBeenCalledTimes(1);
  });

  it('treats an unset or empty AGENT_MAX_TOOL_CALLS as no cap and rejects invalid values', () => {
    expect(ToolCallCap.fromEnv({}).limit).toBeNull();
    expect(ToolCallCap.fromEnv({ AGENT_MAX_TOOL_CALLS: '' }).limit).toBeNull();
    expect(ToolCallCap.fromEnv({ AGENT_MAX_TOOL_CALLS: '100' }).limit).toBe(100);
    for (const bad of ['0', '-1', '1.5', 'many']) expect(() => ToolCallCap.fromEnv({ AGENT_MAX_TOOL_CALLS: bad })).toThrow('AGENT_MAX_TOOL_CALLS');
    const unlimited = ToolCallCap.fromEnv({});
    for (let i = 0; i < 1000; i++) expect(unlimited.tryDispatch()).toBe(true);
    expect(unlimited.exhausted).toBe(false);
  });
});

describe('MCP proxy tool accounting', () => {
  it('does not count or report harness calls, tools/list or initialisation', async () => {
    const child = fakeChild();
    const cap = new ToolCallCap(1);
    const events: ToolCallEvent[] = [];
    const proxy = createMcpProxy(child, { cap, hooks: { onToolCall: (event) => events.push(event) } });
    await proxy.call('tools/call', { name: 'bench_capture', arguments: {} });
    await proxy.call('tools/call', { name: 'bench_capture', arguments: {} });
    await proxy.call('tools/list', {});
    expect(cap.dispatched).toBe(0);
    expect(events).toEqual([]);
    const { socket, replies, send } = fakeSocket();
    proxy.attach(socket);
    send({ jsonrpc: '2.0', id: 'init', method: 'initialize', params: {} });
    await settle();
    expect(cap.dispatched).toBe(0);
    send(toolCall(1, 'open', { url: 'https://example.test' }));
    await settle();
    expect(cap.dispatched).toBe(1);
    expect(replies.at(-1)).toMatchObject({ id: 1, result: { content: [{ text: 'ok open' }] } });
    proxy.close('done');
  });

  it('reports one dispatch and one result per agent call with error status, text and image counts', async () => {
    const child = fakeChild({ click: '#9 no longer exists (the page changed); call read() to refresh' });
    const events: ToolCallEvent[] = [];
    const proxy = createMcpProxy(child);
    proxy.setToolControl({ hooks: { onToolCall: (event) => events.push(event) } });
    const { socket, send } = fakeSocket();
    proxy.attach(socket);
    send(toolCall(1, 'read'));
    send(toolCall(2, 'click', { id: 9 }));
    await settle();
    expect(events.map((event) => `${event.phase}:${event.name}`).sort()).toEqual(['dispatch:click', 'dispatch:read', 'result:click', 'result:read']);
    const click = events.find((event) => event.phase === 'result' && event.name === 'click')!;
    expect(click).toMatchObject({ isError: true, source: 'proxy', arguments: { id: 9 } });
    expect(click.error).toContain('no longer exists');
    expect(new Set(events.map((event) => event.key)).size).toBe(2);
    proxy.close('done');
  });

  it('blocks dispatch past N for batched and concurrent calls, answers every one and counts failures', async () => {
    const child = fakeChild({ click: 'boom' });
    const cap = new ToolCallCap(3);
    const events: ToolCallEvent[] = [];
    const exhausted = vi.fn();
    cap.onExhausted(exhausted);
    const proxy = createMcpProxy(child, { cap, hooks: { onToolCall: (event) => events.push(event) } });
    const first = fakeSocket(), second = fakeSocket();
    proxy.attach(first.socket); proxy.attach(second.socket);
    // One socket write carrying a batch of 4 plus a concurrent call on another connection.
    first.socket.emit('data', [toolCall(1, 'click'), toolCall(2, 'read'), toolCall(3, 'read'), toolCall(4, 'read')].map((m) => JSON.stringify(m)).join('\n') + '\n');
    second.send(toolCall(10, 'read'));
    await settle();
    const forwarded = child.received.filter((request) => request.method === 'tools/call');
    expect(forwarded).toHaveLength(3);
    expect(cap).toMatchObject({ dispatched: 3, blocked: 2, limitKind: 'tool_calls' });
    expect(exhausted).toHaveBeenCalledTimes(1);
    // Every call receives a response; refused ones are tool errors naming the budget.
    // (the proxy broadcasts child output to every socket, so compare distinct ids)
    expect([...new Set(first.replies.map((reply) => reply.id))].sort()).toEqual([1, 2, 3, 4]);
    expect(second.replies.some((reply) => reply.id === 10)).toBe(true);
    const refused = [...first.replies, ...second.replies].filter((reply) => reply.result?.isError && /budget exhausted/i.test(reply.result.content[0].text));
    expect(refused).toHaveLength(2);
    // The failed click (call 1) was dispatched, so it counted.
    expect(events.filter((event) => event.phase === 'dispatch')).toHaveLength(3);
    expect(events.filter((event) => event.phase === 'blocked')).toHaveLength(2);
    expect(events.filter((event) => event.phase === 'result')).toHaveLength(3);
    proxy.close('done');
  });

  it('counts a URL-policy refusal as an agent call that returned an error', async () => {
    const child = fakeChild();
    const cap = new ToolCallCap(5);
    const events: ToolCallEvent[] = [];
    const proxy = createMcpProxy(child, { cap, hooks: { onToolCall: (event) => events.push(event) } });
    const { socket, replies, send } = fakeSocket();
    proxy.attach(socket);
    send(toolCall(1, 'open', { url: 'javascript:alert(1)' }));
    expect(child.received.filter((request) => request.method === 'tools/call')).toHaveLength(0);
    expect(replies[0].error.message).toContain('URL policy blocks');
    expect(cap.dispatched).toBe(1);
    expect(events.map((event) => event.phase)).toEqual(['dispatch', 'result']);
    expect(events[1]).toMatchObject({ isError: true });
    proxy.close('done');
  });

  it('is unchanged without tool control', async () => {
    const child = fakeChild();
    const proxy = createMcpProxy(child);
    const counted = vi.fn();
    proxy.onToolResult(counted);
    const { socket, replies, send } = fakeSocket();
    proxy.attach(socket);
    for (let i = 1; i <= 5; i++) send(toolCall(i, 'read'));
    await settle();
    expect(replies).toHaveLength(5);
    expect(counted).toHaveBeenLastCalledWith(5);
    proxy.close('done');
  });
});

describe('Sarvam direct path accounting', () => {
  const listTools = { tools: ['click', 'read', 'open'].map((name) => ({ name, description: name, inputSchema: { type: 'object', properties: {} } })) };
  const usage = (prompt: number | null, completion: number | null, cached: number | null = 0) => ({ promptTokens: prompt, completionTokens: completion, cachedTokens: cached, totalTokens: prompt === null || completion === null ? null : prompt + completion });
  const completion = (toolNames: string[], content: string | null = null, tokens = usage(100, 10)) => ({
    content, usage: tokens, latencyMs: 1, model: 'gemma-4-31b', finishReason: toolNames.length ? 'tool_calls' : 'stop',
    ...(toolNames.length ? { toolCalls: toolNames.map((name, index) => ({ id: `t${index}-${name}`, type: 'function' as const, function: { name, arguments: '{}' } })) } : {}),
  });
  const run = (replies: any[], mcp: { call: any }, extra: object = {}) => {
    const complete = vi.fn(async () => replies.shift());
    return runSarvamAgent({ client: { complete } as any, mcp, model: 'gemma-4-31b', prompt: 'p', server: 'mantis', allow: ['mcp__mantis'], maxSteps: 10, ...extra });
  };
  const mcpOf = (handler: (name: string) => unknown) => ({ call: vi.fn(async (method: string, params: any) => method === 'tools/list' ? listTools : handler(params.name)) });

  it('stops dispatching beyond N inside a batch, answers every call and reports limitKind', async () => {
    const cap = new ToolCallCap(2);
    const events: ToolCallEvent[] = [];
    const mcp = mcpOf((name) => ({ content: [{ type: 'text', text: `ok ${name}` }] }));
    const result = await run([completion(['read', 'click', 'click', 'read'])], mcp, { toolCap: cap, toolHooks: { onToolCall: (event: ToolCallEvent) => events.push(event) } });
    expect(mcp.call.mock.calls.filter(([method]) => method === 'tools/call')).toHaveLength(2);
    expect(mcp.call.mock.calls.filter(([method]) => method === 'tools/list')).toHaveLength(1); // not counted
    expect(result).toMatchObject({ limitKind: 'tool_calls', resultError: true, toolCalls: 2 });
    expect(cap).toMatchObject({ dispatched: 2, blocked: 2 });
    expect(events.filter((event) => event.phase === 'blocked')).toHaveLength(2);
  });

  it('counts failed calls, including a thrown MCP error, toward the cap', async () => {
    const cap = new ToolCallCap(3);
    const mcp = { call: vi.fn(async (method: string, params: any) => {
      if (method === 'tools/list') return listTools;
      if (params.name === 'click') throw new Error('transport down');
      return { content: [{ type: 'text', text: 'bad' }], isError: true };
    }) };
    const events: ToolCallEvent[] = [];
    const result = await run([completion(['click']), completion(['read']), completion(['read', 'read'])], mcp, { toolCap: cap, toolHooks: { onToolCall: (event: ToolCallEvent) => events.push(event) } });
    expect(cap).toMatchObject({ dispatched: 3, blocked: 1 });
    expect(result.limitKind).toBe('tool_calls');
    expect(events.filter((event) => event.phase === 'result' && event.isError)).toHaveLength(3);
  });

  it('lets the model answer after the Nth call without flagging the limit', async () => {
    const cap = new ToolCallCap(1);
    const mcp = mcpOf(() => ({ content: [{ type: 'text', text: 'ok' }] }));
    const result = await run([completion(['read']), completion([], 'ANSWER: done')], mcp, { toolCap: cap });
    expect(result).toMatchObject({ resultText: 'ANSWER: done', resultError: false });
    expect(result.limitKind).toBeUndefined();
    expect(cap.exhausted).toBe(false);
  });

  it('reports each completion interval, with unknown provider usage as null', async () => {
    const lt = createLongTelemetry({});
    const mcp = mcpOf(() => ({ content: [{ type: 'text', text: 'ok' }] }));
    await run([completion(['read'], null, usage(100, 10, 20)), completion([], 'ANSWER: x', usage(null, null, null))], mcp, { toolCap: lt.cap, toolHooks: lt.hooks });
    const completions = lt.records().filter((record) => record.kind === 'completion');
    expect(completions).toHaveLength(2);
    expect(completions[0]).toMatchObject({ inputTokens: 80, cacheReadTokens: 20, outputTokens: 10, usageKnown: true, callRange: null });
    expect(completions[1]).toMatchObject({ inputTokens: null, cacheReadTokens: null, outputTokens: null, usageKnown: false, callRange: [1, 1] });
    const summary = lt.summary();
    expect(summary.usage.inputTokens).toBeNull(); // a total is never fabricated from partial usage
    expect(summary.usage.unknownCompletions).toBe(1);
  });

  it('keeps old callers unchanged', async () => {
    const mcp = mcpOf(() => ({ content: [{ type: 'text', text: 'ok' }] }));
    const result = await run([completion(['read', 'read', 'read']), completion([], 'ANSWER: x')], mcp);
    expect(result).toMatchObject({ toolCalls: 3, resultText: 'ANSWER: x' });
    expect('limitKind' in result).toBe(false);
  });
});

describe('long telemetry records', () => {
  let clock = 1_000;
  const now = () => (clock += 10);
  const feed = (lt: ReturnType<typeof createLongTelemetry>, key: string, name: string, args: unknown, outcome: { isError?: boolean; text?: string; error?: string } = {}, source: 'proxy' | 'sarvam' = 'proxy') => {
    lt.onToolCall({ phase: 'dispatch', source, key, name, arguments: args, at: now() });
    lt.onToolCall({ phase: 'result', source, key, name, arguments: args, at: now(), dispatchedAt: clock, isError: outcome.isError ?? false, error: outcome.error ?? null, text: outcome.text ?? 'ok', images: 0 });
  };

  it('never counts harness tools and never double counts a call reported through two wirings', () => {
    const lt = createLongTelemetry({});
    lt.onToolCall({ phase: 'dispatch', source: 'proxy', key: 'h1', name: 'bench_capture', arguments: {}, at: now() });
    lt.onToolCall({ phase: 'result', source: 'proxy', key: 'h1', name: 'bench_capture', arguments: {}, at: now(), isError: false, text: 'frame' });
    feed(lt, '1:1', 'click', { id: 3 });
    feed(lt, '1:1', 'click', { id: 3 }); // duplicate delivery of the same key
    const summary = lt.summary();
    expect(summary.toolCalls).toBe(1);
    expect(summary.meaningfulActions).toBe(1);
  });

  it('keeps the MCP call index distinct from the meaningful action index', () => {
    const lt = createLongTelemetry({});
    feed(lt, 'a', 'read', {});
    feed(lt, 'b', 'click', { id: 1 });
    feed(lt, 'c', 'find', { query: 'x' });
    feed(lt, 'd', 'type', { id: 2, text: 'y' }, { isError: true, error: 'failed' });
    feed(lt, 'e', 'fill', { fields: [] });
    const calls = lt.records().filter((record) => record.kind === 'call');
    expect(calls.map((c) => [c.callIndex, c.actionIndex])).toEqual([[1, null], [2, 1], [3, null], [4, null], [5, 2]]);
    expect(lt.summary()).toMatchObject({ toolCalls: 5, meaningfulActions: 2, failedCalls: 1 });
  });

  it('classifies stale and missing refs from Mantis and tree-style error text and keeps per-opportunity rates', () => {
    const lt = createLongTelemetry({});
    feed(lt, '1', 'click', { id: 4 }, { isError: true, error: '#4 no longer exists (the page changed); call read() to refresh' });
    feed(lt, '2', 'click', { id: 99 }, { isError: true, error: 'no element #99 on this page; call read() to see current numbers' });
    feed(lt, '3', 'browser_click', { ref: 'e12' }, { isError: true, error: 'Ref e12 not found in the current page snapshot.' });
    feed(lt, '4', 'click', { id: 5 });
    feed(lt, '5', 'press', { key: 'Enter' }, { isError: true, error: 'timeout' });
    lt.recordHazardExposure(); lt.recordHazardExposure();
    const summary = lt.summary();
    expect(summary).toMatchObject({ staleRefErrors: 1, missingRefErrors: 2, refBearingActions: 4, hazardExposures: 2, failedCalls: 4 });
    expect(summary.refErrorsPerRefBearingAction).toBeCloseTo(3 / 4);
    expect(summary.refErrorsPerHazardExposure).toBeCloseTo(3 / 2);
  });

  it('keeps unknown rates null when there is no denominator', () => {
    const summary = createLongTelemetry({}).summary();
    expect(summary).toMatchObject({ toolCalls: 0, refErrorsPerRefBearingAction: null, refErrorsPerHazardExposure: null, observationTokensEstimate: null });
  });

  it('flags a successful call that mutates an unrequested entity as a silent wrong-target proxy, separate from reviewed cases', () => {
    const lt = createLongTelemetry({ requestedEntities: ['order-7'] });
    feed(lt, '1', 'click', { id: 1 });
    lt.recordMutation({ entity: 'order-7', operation: 'delete' });
    feed(lt, '2', 'click', { id: 2 });
    lt.recordMutation({ entity: 'order-8', operation: 'delete' });
    const summary = lt.summary();
    expect(summary.silentWrongTargetCalls).toBe(1);
    expect(summary.confirmedWrongTargets).toBe(0);
    lt.recordReview({ callIndex: 2, attribution: 'wrong_target', confirmedWrongTarget: true });
    expect(lt.summary()).toMatchObject({ silentWrongTargetCalls: 1, confirmedWrongTargets: 1, attributions: { wrong_target: 1 } });
  });

  it('closes a recovery only when the invariant is restored and the requested operation completed', () => {
    const lt = createLongTelemetry({ now });
    feed(lt, '1', 'click', { id: 4 }, { isError: true, error: '#4 no longer exists (the page changed); call read() to refresh' });
    feed(lt, '2', 'read', {});
    feed(lt, '3', 'click', { id: 6 }); // a later unrelated success is not a recovery
    expect(lt.summary().recoveries).toMatchObject({ attempted: 1, successful: 0, unresolved: 1 });
    lt.recordRecovered({ invariant: 'draft intact', requestedOperationCompleted: false });
    expect(lt.summary().recoveries.successful).toBe(0);
    lt.recordRecovered({ invariant: 'draft intact', requestedOperationCompleted: true });
    const recoveries = lt.summary().recoveries;
    expect(recoveries).toMatchObject({ attempted: 1, successful: 1, unresolved: 0, refreshes: 1 });
    expect(recoveries.meanCallsToRecover).toBe(2);
  });

  it('tracks checkpoint first attainment, invalidation and terminal validity', () => {
    const lt = createLongTelemetry({});
    feed(lt, '1', 'click', { id: 1 });
    lt.recordCheckpoint({ name: 'cart-ready', valid: true, revision: 'r1' });
    feed(lt, '2', 'click', { id: 2 });
    lt.recordCheckpoint({ name: 'cart-ready', valid: false, revision: 'r2' });
    lt.recordCheckpoint({ name: 'cart-ready', valid: true, revision: 'r3' });
    expect(lt.summary().checkpoints['cart-ready']).toMatchObject({ firstAttainedCall: 1, firstAttainedAction: 1, invalidations: 1, terminalValid: true, revision: 'r3' });
  });

  it('labels observation sizes as tokenizer estimates and never attributes provider usage to a batched action', () => {
    const lt = createLongTelemetry({});
    feed(lt, '1', 'read', {}, { text: 'hello world '.repeat(50) });
    feed(lt, '2', 'click', { id: 1 }, { text: 'done' });
    lt.recordCompletion({ usage: { inputTokens: 500, outputTokens: 20, cacheReadTokens: 0, cacheWriteTokens: 0 } });
    lt.recordCompletion({}); // unknown usage
    const records = lt.records();
    expect(records[0]).toMatchObject({ kind: 'identity', observationTokensAreEstimates: true });
    expect(String(records[0]!.observationTokenizer)).toContain('cl100k');
    const calls = records.filter((record) => record.kind === 'call');
    expect(calls[0]!.observation).toMatchObject({ estimate: true, chars: 600 });
    expect(calls[0]!.observation.tokensEstimate).toBeGreaterThan(50);
    expect(calls[0]!.completionIndex).toBe(1);
    expect(calls[0]).not.toHaveProperty('usage');
    const completions = records.filter((record) => record.kind === 'completion');
    expect(completions[0]).toMatchObject({ callRange: [1, 2], inputTokens: 500, cumulativeInputTokens: 500 });
    expect(completions[1]).toMatchObject({ callRange: null, inputTokens: null, outputTokens: null, usageKnown: false, cumulativeInputTokens: null });
  });

  it('writes <attempt>.long.jsonl and regrades identically offline', () => {
    const dir = mkdtempSync(join(tmpdir(), 'long-telemetry-'));
    try {
      const path = join(dir, 'run-1.long.jsonl');
      const lt = createLongTelemetry({ path, identity: { task: 't1', model: 'm', approach: 'mantis', run: 1, attempt: 1 }, maxToolCalls: 100 });
      feed(lt, '1', 'click', { id: 1 }, { isError: true, error: 'no element #1 on this page; call read() to see current numbers' });
      feed(lt, '2', 'read', {});
      lt.recordCompletion({ usage: { inputTokens: 10, outputTokens: 2 } });
      const flushed = lt.flush();
      const lines = readFileSync(path, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
      expect(lines[0]).toMatchObject({ kind: 'identity', task: 't1', approach: 'mantis', maxToolCalls: 100 });
      expect(lines.at(-1).kind).toBe('summary');
      expect(summarizeLongRecords(readLongRecords(path))).toEqual(flushed);
      expect(summarizeLongFile(path)).toEqual(flushed);
      expect(flushed).toMatchObject({ toolCalls: 2, missingRefErrors: 1 });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('reports blocked calls and the limit kind in the summary', () => {
    const lt = createLongTelemetry({ maxToolCalls: 1 });
    expect(lt.cap.tryDispatch()).toBe(true);
    expect(lt.cap.tryDispatch()).toBe(false);
    lt.onToolCall({ phase: 'blocked', source: 'proxy', key: '1:2', name: 'click', arguments: {}, at: now() });
    expect(lt.summary()).toMatchObject({ blockedCalls: 1, limitKind: 'tool_calls' });
  });
});
