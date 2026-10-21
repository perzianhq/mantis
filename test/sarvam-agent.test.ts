import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { transform } from 'esbuild';
import { SarvamClient } from '../bench/agent/sarvam.js';
import { isHarnessFailure } from '../bench/agent/integrity.js';
import { mcpToolsToOpenAi, runSarvamAgent, SARVAM_IMAGE_HISTORY_LIMIT, sarvamMaxTokens, trimSarvamImageHistory } from '../bench/agent/sarvam-agent.js';
import type { SarvamMessage } from '../bench/agent/sarvam.js';

const key = 'test-only-secret';
const reply = (message: object, finishReason?: string) => Response.json({ model: 'gemma4', choices: [{ message, ...(finishReason ? { finish_reason: finishReason } : {}) }], usage: { prompt_tokens: 10, completion_tokens: 2, total_tokens: 12, prompt_tokens_details: { cached_tokens: 0 } } });
const tools = { tools: [{ name: 'open', description: 'open a URL', inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } }] };
const base = (client: SarvamClient, mcp: { call: ReturnType<typeof vi.fn> }, maxSteps = 4) => runSarvamAgent({ client, mcp, model: 'gemma-4-31b', prompt: 'Do the task', server: 'mantis', allow: ['mcp__mantis'], deny: ['mcp__mantis__bench_capture'], maxSteps });

describe('Sarvam benchmark agent loop', () => {
  it('keeps the Sarvam result-summary runner syntactically loadable', async () => {
    const source = readFileSync(new URL('../bench/agent/run.ts', import.meta.url), 'utf8');
    await expect(transform(source, { loader: 'ts', format: 'esm', target: 'node20' })).resolves.toMatchObject({ code: expect.any(String) });
    expect(source).toContain("process.env.BENCH_SCREENSHOT_MCP");
    expect(source).toContain("SCREENSHOT_MCP.endsWith('.ts')");
    expect(source).toContain("PROVIDER === 'sarvam' ? 10 : 3");
  });

  it('round-trips an OpenAI-style tool call through fake MCP using mocked fetch', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, reasoning_content: 'internal chain preserved', tool_calls: [{ id: 'one', type: 'function', function: { name: 'open', arguments: '{"url":"https://fixture.test"}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'ANSWER: done' }));
    const client = new SarvamClient({ apiKey: key, fetch: fetcher });
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValueOnce({ content: [{ type: 'text', text: 'opened' }] }) };
    const result = await base(client, mcp);
    expect(mcp.call).toHaveBeenNthCalledWith(1, 'tools/list', {}, undefined);
    expect(mcp.call).toHaveBeenNthCalledWith(2, 'tools/call', { name: 'open', arguments: { url: 'https://fixture.test' } }, undefined);
    expect(result).toMatchObject({ resultText: 'ANSWER: done', toolCalls: 1, turns: 2, connected: true, totalInputTokens: 20 });
    const second = JSON.parse(fetcher.mock.calls[1]![1]?.body as string);
    expect(second.messages.at(-2)).toMatchObject({ role: 'assistant', reasoning_content: 'internal chain preserved' });
    expect(second.messages.at(-1)).toMatchObject({ role: 'tool', tool_call_id: 'one', content: 'opened' });
    expect(JSON.parse(fetcher.mock.calls[0]![1]?.body as string)).toMatchObject({ max_tokens: 8192 });
  });

  it('keeps terminal rate-limit telemetry in the completed agent result', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('', { status: 429 }));
    const mcp = { call: vi.fn().mockResolvedValue(tools) };
    const result = await base(new SarvamClient({ apiKey: key, fetch: fetcher, retries: 0 }), mcp);
    expect(result).toMatchObject({ resultError: true, apiAttempts: 1, rateLimits: 1, timing: { activeRequestMs: expect.any(Number) } });
  });

  it('gives 105b a completion budget and explicitly disables its thinking mode', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(reply({ content: 'ANSWER: done' }));
    const mcp = { call: vi.fn().mockResolvedValue(tools) };
    await runSarvamAgent({ client: new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, model: 'sarvam-105b', prompt: 'Do it', server: 'mantis', allow: ['mcp__mantis'], maxSteps: 1 });
    expect(JSON.parse(fetcher.mock.calls[0]![1]?.body as string)).toMatchObject({ model: 'sarvam-105b', max_tokens: 8192, reasoning_effort: null });
  });

  it('continues length-truncated replies without losing an answer prefix', async () => {
    const continued = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: 'ANSWER: split ' }, 'length'))
      .mockResolvedValueOnce(reply({ content: 'answer' }, 'stop'));
    const mcp = { call: vi.fn().mockResolvedValue(tools) };
    const completed = await base(new SarvamClient({ apiKey: key, fetch: continued }), mcp, 2);
    expect(completed).toMatchObject({ resultText: 'ANSWER: split answer', resultError: false, turns: 2 });
    expect(JSON.parse(continued.mock.calls[1]![1]?.body as string).messages.at(-1)).toMatchObject({ role: 'user', content: expect.stringContaining('Continue') });

    // Near miss: a normal stop remains a finished answer and does not request another turn.
    const stopped = vi.fn<typeof fetch>().mockResolvedValue(reply({ content: 'ANSWER: done' }, 'stop'));
    const stoppedResult = await base(new SarvamClient({ apiKey: key, fetch: stopped }), mcp, 2);
    expect(stoppedResult).toMatchObject({ resultText: 'ANSWER: done', resultError: false, turns: 1 });
    expect(stopped).toHaveBeenCalledTimes(1);

    // An empty truncated fragment still continues and retains the completed fragment.
    const emptyLength = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: '' }, 'length'))
      .mockResolvedValueOnce(reply({ content: 'ANSWER: recovered' }, 'stop'));
    await expect(base(new SarvamClient({ apiKey: key, fetch: emptyLength }), mcp, 2)).resolves.toMatchObject({ resultText: 'ANSWER: recovered', resultError: false });

    const capped = vi.fn<typeof fetch>().mockResolvedValue(reply({ content: 'ANSWER: partial' }, 'length'));
    const cappedResult = await base(new SarvamClient({ apiKey: key, fetch: capped }), mcp, 1);
    expect(cappedResult).toMatchObject({ resultError: true, resultText: expect.stringContaining('completion token limit (length)') });
    expect(capped).toHaveBeenCalledTimes(1);
    expect(sarvamMaxTokens('256')).toBe(256);
    expect(() => sarvamMaxTokens('0')).toThrow('SARVAM_MAX_TOKENS must be a positive integer');
  });

  it('stops repeated empty length completions while allowing a tool turn to reset the streak', async () => {
    const repeatedLength = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: '' }, 'length'))
      .mockResolvedValueOnce(reply({ content: '' }, 'length'));
    const mcp = { call: vi.fn().mockResolvedValue(tools) };
    const stopped = await base(new SarvamClient({ apiKey: key, fetch: repeatedLength }), mcp, 4);
    expect(stopped).toMatchObject({ resultText: 'Sarvam completion token limit (length).', resultError: true, turns: 2 });
    expect(repeatedLength).toHaveBeenCalledTimes(2);

    // A tool reply breaks the no-tool length streak, so a later length reply gets its retry.
    const resetByTool = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: '' }, 'length'))
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'one', type: 'function', function: { name: 'open', arguments: '{}' } }] }, 'stop'))
      .mockResolvedValueOnce(reply({ content: 'ANSWER: recovered' }, 'length'))
      .mockResolvedValueOnce(reply({ content: '' }, 'stop'));
    const resetMcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValueOnce({ content: [{ type: 'text', text: 'ok' }] }) };
    const reset = await base(new SarvamClient({ apiKey: key, fetch: resetByTool }), resetMcp, 4);
    expect(reset).toMatchObject({ resultText: 'ANSWER: recovered', resultError: false, turns: 4, toolCalls: 1 });
  });

  it('retains a length-truncated prefix across tool calls', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: 'ANSWER: tool-', tool_calls: [{ id: 'one', type: 'function', function: { name: 'open', arguments: '{}' } }] }, 'length'))
      .mockResolvedValueOnce(reply({ content: 'continued' }, 'stop'));
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValueOnce({ content: [{ type: 'text', text: 'ok' }] }) };
    await expect(base(new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, 2)).resolves.toMatchObject({ resultText: 'ANSWER: tool-continued', toolCalls: 1, resultError: false });
  });

  it('returns the malformed-JSON retry to the model once, without calling MCP', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'bad', type: 'function', function: { name: 'open', arguments: '{bad' } }] }))
      .mockResolvedValueOnce(reply({ content: 'ANSWER: recovered' }));
    const mcp = { call: vi.fn().mockResolvedValue(tools) };
    const result = await base(new SarvamClient({ apiKey: key, fetch: fetcher }), mcp);
    expect(result.resultText).toBe('ANSWER: recovered');
    expect(result.toolErrors).toBe(1);
    expect(mcp.call).toHaveBeenCalledTimes(1);
    const retry = JSON.parse(fetcher.mock.calls[1]![1]?.body as string);
    expect(retry.messages.at(-1).content).toContain('Retry');
  });

  it('ends cleanly at the configured step budget', async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => reply({ content: null, tool_calls: [{ id: 'again', type: 'function', function: { name: 'open', arguments: '{"url":"https://fixture.test"}' } }] }));
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValue({ content: [{ type: 'text', text: 'opened' }] }) };
    const result = await base(new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, 2);
    expect(result).toMatchObject({ resultError: true, resultText: 'Agent step budget exhausted.', toolCalls: 2, turns: 2 });
  });

  it('normalizes MCP schemas and carries screenshot bytes in a separate vision turn', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'shot', type: 'function', function: { name: 'open', arguments: '{}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'FINAL_URL: https://fixture.test/done' }));
    const trace: unknown[] = [];
    const mcp = { call: vi.fn().mockResolvedValueOnce({ tools: [{ name: 'open', inputSchema: { $schema: 'https://example.test/schema', type: 'object', properties: {} } }] })
      .mockResolvedValueOnce({ content: [{ type: 'text', text: 'opened' }, { type: 'image', data: 'aW1hZ2U=', mimeType: 'image/png' }] }) };
    await runSarvamAgent({ client: new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, model: 'gemma-4-31b', prompt: 'Do it', server: 'mantis', allow: ['mcp__mantis'], maxSteps: 2, trace: (event) => trace.push(event) });
    const second = JSON.parse(fetcher.mock.calls[1]![1]?.body as string);
    expect(second.tools[0].function.parameters).not.toHaveProperty('$schema');
    expect(second.messages.at(-2)).toMatchObject({ role: 'tool', tool_call_id: 'shot', content: 'opened' });
    expect(second.messages.at(-1)).toMatchObject({ role: 'user' });
    expect(second.messages.at(-1).content.some((part: { type: string }) => part.type === 'image_url')).toBe(true);
    expect(second.messages.at(-2).content).toBe('opened');
    expect(trace).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'sarvam.tool_result', arguments: {}, resultText: 'opened' }),
      expect.objectContaining({ type: 'sarvam.summary', resultText: 'FINAL_URL: https://fixture.test/done' }),
    ]));
  });

  it('describes image-only tool results as forwarded observations, not omitted images', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'shot', type: 'function', function: { name: 'open', arguments: '{}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'done' }));
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValueOnce({ content: [{ type: 'image', data: 'aQ==', mimeType: 'image/png' }] }) };
    await base(new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, 2);
    const messages = JSON.parse(fetcher.mock.calls[1]![1]?.body as string).messages;
    expect(messages.at(-2).content).toContain('follow in a separate message');
    // Near miss: the old wording incorrectly claimed the image had been omitted.
    expect(messages.at(-2).content).not.toContain('image result omitted');
  });

  it('finishes every tool reply in a batch before appending image observations', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [
        { id: 'one', type: 'function', function: { name: 'open', arguments: '{}' } },
        { id: 'two', type: 'function', function: { name: 'open', arguments: '{}' } },
      ] }))
      .mockResolvedValueOnce(reply({ content: 'done' }));
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools)
      .mockResolvedValueOnce({ content: [{ type: 'image', data: 'aQ==', mimeType: 'image/png' }] })
      .mockResolvedValueOnce({ content: [{ type: 'image', data: 'ag==', mimeType: 'image/png' }] }) };
    await runSarvamAgent({ client: new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, model: 'gemma-4-31b', prompt: 'Do it', server: 'mantis', allow: ['mcp__mantis'], maxSteps: 2 });
    const messages = JSON.parse(fetcher.mock.calls[1]![1]?.body as string).messages;
    expect(messages.slice(-3).map((message: { role: string }) => message.role)).toEqual(['tool', 'tool', 'user']);
    expect(messages.at(-3)).toMatchObject({ tool_call_id: 'one' });
    expect(messages.at(-2)).toMatchObject({ tool_call_id: 'two' });
  });

  it('does not send image bytes to a non-vision model', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'shot', type: 'function', function: { name: 'open', arguments: '{}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'done' }));
    const mcp = { call: vi.fn().mockResolvedValueOnce(tools).mockResolvedValueOnce({ content: [{ type: 'image', data: 'aW1hZ2U=', mimeType: 'image/png' }] }) };
    await runSarvamAgent({ client: new SarvamClient({ apiKey: key, fetch: fetcher }), mcp, model: 'glm-5.3', prompt: 'Do it', server: 'mantis', allow: ['mcp__mantis'], maxSteps: 2 });
    const messages = JSON.parse(fetcher.mock.calls[1]![1]?.body as string).messages;
    expect(JSON.stringify(messages)).not.toContain('image_url');
    expect(messages.at(-1).content).toContain('cannot receive image observations');
    expect(mcpToolsToOpenAi({ tools: [{ name: 'ignored', inputSchema: { type: 'object' } }] }, 'mantis', ['mcp__other'])).toEqual([]);
  });

  it('retains transport detail from MCP failures but not ordinary rejected calls', async () => {
    const transport = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'one', type: 'function', function: { name: 'open', arguments: '{}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'done' }));
    const failingMcp = { call: vi.fn().mockResolvedValueOnce(tools).mockRejectedValueOnce(new Error('MCP transport connection closed')) };
    const transportResult = await base(new SarvamClient({ apiKey: key, fetch: transport }), failingMcp, 2);
    expect(isHarnessFailure({ status: 'wrong_answer', error: '', diagnostics: transportResult.diagnostics })).toBe(true);

    const ordinary = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(reply({ content: null, tool_calls: [{ id: 'one', type: 'function', function: { name: 'open', arguments: '{}' } }] }))
      .mockResolvedValueOnce(reply({ content: 'done' }));
    const rejectedMcp = { call: vi.fn().mockResolvedValueOnce(tools).mockRejectedValueOnce(new Error('tool rejected invalid arguments')) };
    const ordinaryResult = await base(new SarvamClient({ apiKey: key, fetch: ordinary }), rejectedMcp, 2);
    expect(isHarnessFailure({ status: 'wrong_answer', error: '', diagnostics: ordinaryResult.diagnostics })).toBe(false);
  });

  it('caps long screenshot history while retaining the latest image observations', () => {
    const messages: SarvamMessage[] = Array.from({ length: SARVAM_IMAGE_HISTORY_LIMIT + 3 }, (_, index) => ({
      role: 'user', content: [{ type: 'text', text: `screenshot ${index}` }, { type: 'image_url', image_url: { url: `data:image/png;base64,${index}` } }],
    }));
    trimSarvamImageHistory(messages);
    const images = messages.flatMap((message) => Array.isArray(message.content) ? message.content : []).filter((part) => part.type === 'image_url');
    expect(images).toHaveLength(SARVAM_IMAGE_HISTORY_LIMIT);
    expect(messages.slice(0, 3).every((message) => JSON.stringify(message.content).includes('Earlier image observation omitted'))).toBe(true);
    expect(messages.at(-1)?.content).toEqual([{ type: 'text', text: `screenshot ${SARVAM_IMAGE_HISTORY_LIMIT + 2}` }, { type: 'image_url', image_url: { url: `data:image/png;base64,${SARVAM_IMAGE_HISTORY_LIMIT + 2}` } }]);
  });

  it('leaves an image history below the cap untouched', () => {
    const messages: SarvamMessage[] = [{ role: 'user', content: [{ type: 'image_url', image_url: { url: 'data:image/png;base64,aQ==' } }] }];
    const content = messages[0]!.content;
    trimSarvamImageHistory(messages);
    expect(messages[0]!.content).toBe(content);
  });
});
