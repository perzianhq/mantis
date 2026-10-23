import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { expect, it } from 'vitest';

const REPO = path.resolve(import.meta.dirname, '..');
const screenshotServer = () => new StdioClientTransport({ command: process.execPath, args: ['--import', pathToFileURL(path.join(REPO, 'node_modules/tsx/dist/loader.mjs')).href, path.join(REPO, 'bench/agent/screenshot-mcp.ts')], cwd: REPO, env: { ...process.env }, stderr: 'ignore' });
const textOf = (result: { content: unknown[] }): string => (result.content as { type: string; text?: string }[]).filter((part) => part.type === 'text').map((part) => part.text ?? '').join('\n');

async function withClient(run: (client: Client, call: (name: string, args: Record<string, unknown>) => Promise<any>) => Promise<void>) {
  const client = new Client({ name: 'screenshot-mcp-test', version: '1' });
  await client.connect(screenshotServer());
  try { await run(client, (name, args) => client.callTool({ name, arguments: args })); } finally { await client.close(); }
}

it('exposes one Anthropic-style computer tool and targets nested scrollers by coordinate', async () => {
  await withClient(async (client, call) => {
    const { tools } = await client.listTools();
    expect(tools.map((tool) => tool.name).sort()).toEqual(['back', 'bench_capture', 'computer', 'navigate']);
    expect(tools.find((tool) => tool.name === 'computer')?.description).toContain('one tick is 100 CSS pixels');
    const html = `<!doctype html><style>html,body{margin:0}#outer{position:absolute;left:20px;top:20px;width:280px;height:180px;overflow:auto}#target,#decoy{width:220px;height:100px;overflow:auto;white-space:nowrap}#target{margin:20px}#decoy{position:absolute;left:360px;top:20px}#target>div,#decoy>div{width:700px;height:400px}</style><div id="outer"><div id="target"><div>nested target</div></div><div style="height:300px"></div></div><div id="decoy"><div>wrong target</div></div>`;
    const url = `data:text/html,${encodeURIComponent(html)}`;
    const state = async () => JSON.parse(textOf(await call('bench_capture', { evaluate: '() => ({target:[document.querySelector("#target").scrollLeft,document.querySelector("#target").scrollTop],outer:[document.querySelector("#outer").scrollLeft,document.querySelector("#outer").scrollTop],decoy:[document.querySelector("#decoy").scrollLeft,document.querySelector("#decoy").scrollTop]})' }))) as { target: [number, number]; outer: [number, number]; decoy: [number, number] };
    await call('navigate', { url });
    await call('computer', { action: 'scroll', coordinate: [100, 80], scroll_direction: 'right', scroll_amount: 2 });
    expect((await state()).target[0]).toBeGreaterThan(0);
    await call('computer', { action: 'scroll', coordinate: [100, 80], scroll_direction: 'down', scroll_amount: 1 });
    expect((await state()).target[1]).toBeGreaterThan(0);
    expect((await state()).outer[1]).toBe(0);
    await call('navigate', { url });
    await call('computer', { action: 'scroll', coordinate: [430, 80], scroll_direction: 'right', scroll_amount: 2 });
    const wrongTarget = await state();
    expect(wrongTarget.target[0]).toBe(0);
    expect(wrongTarget.decoy[0]).toBeGreaterThan(0);
  });
}, 30_000);

it('uses xdotool ctrl+a to replace focused text; plain type remains an append near miss', async () => {
  await withClient(async (_client, call) => {
    const url = `data:text/html,${encodeURIComponent('<input id="field" value="old" style="position:absolute;left:20px;top:20px">')}`;
    const value = async () => textOf(await call('bench_capture', { evaluate: '() => document.querySelector("#field").value' }));
    await call('navigate', { url });
    await call('computer', { action: 'left_click', coordinate: [50, 30] });
    await call('computer', { action: 'key', text: 'ctrl+a' });
    await call('computer', { action: 'type', text: 'new' });
    expect(await value()).toBe('new');
    await call('navigate', { url });
    await call('computer', { action: 'left_click', coordinate: [50, 30] });
    await call('computer', { action: 'type', text: 'new' });
    expect(await value()).toBe('oldnew');
    const unknown = await call('computer', { action: 'key', text: 'CTRLL+A' });
    expect(textOf(unknown)).toContain('error: unknown key');
  });
}, 30_000);

it('renders a visible native-select overlay whose coordinate click changes the select and fires events', async () => {
  await withClient(async (_client, call) => {
    const html = '<select id="choice" style="position:absolute;left:20px;top:20px;width:180px"><option value="one">One</option><option value="two">Two</option></select><script>window.events=[];choice.addEventListener("input",()=>events.push("input"));choice.addEventListener("change",()=>events.push("change"));</script>';
    const url = `data:text/html,${encodeURIComponent(html)}`;
    const state = async () => JSON.parse(textOf(await call('bench_capture', { evaluate: '() => ({value:choice.value,events,overlay:!!document.querySelector("#__mantis_native_select_overlay")})' }))) as { value: string; events: string[]; overlay: boolean };
    await call('navigate', { url });
    await call('computer', { action: 'left_click', coordinate: [80, 30] });
    const screenshot = await call('computer', { action: 'screenshot' });
    expect((screenshot.content as { type: string }[]).some((part) => part.type === 'image')).toBe(true);
    expect((await state()).overlay).toBe(true);
    await call('computer', { action: 'left_click', coordinate: [80, 85] });
    expect(await state()).toEqual({ value: 'two', events: ['input', 'change'], overlay: false });

    await call('navigate', { url });
    await call('computer', { action: 'left_click', coordinate: [80, 30] });
    await call('computer', { action: 'left_click', coordinate: [500, 500] });
    expect(await state()).toEqual({ value: 'one', events: [], overlay: false });
    await call('computer', { action: 'left_click', coordinate: [80, 30] });
    await call('computer', { action: 'key', text: 'Escape' });
    expect(await state()).toEqual({ value: 'one', events: [], overlay: false });
  });
}, 30_000);

it('keeps the computer tool schema free of tuple prefixItems that Codex drops; wrong-length arrays are rejected', async () => {
  await withClient(async (client, call) => {
    const { tools } = await client.listTools();
    const schema = JSON.stringify(tools.find((tool) => tool.name === 'computer')?.inputSchema);
    expect(schema).not.toContain('prefixItems');
    expect(schema).toContain('"minItems":2');
    const bad = await call('computer', { action: 'left_click', coordinate: [10, 20, 30] });
    expect(bad.isError).toBe(true);
  });
}, 30_000);
