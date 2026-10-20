import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { expect, it } from 'vitest';

const REPO = path.resolve(import.meta.dirname, '..');
const screenshotServer = () => new StdioClientTransport({
  command: process.execPath,
  args: ['--import', pathToFileURL(path.join(REPO, 'node_modules/tsx/dist/loader.mjs')).href, path.join(REPO, 'bench/agent/screenshot-mcp.ts')],
  cwd: REPO,
  stderr: 'ignore',
});

const textOf = (result: { content: unknown[] }): string => (result.content as { type: string; text?: string }[])
  .filter((part) => part.type === 'text').map((part) => part.text ?? '').join('\n');

it('starts the screenshot MCP, exposes its scroll API, and targets nested horizontal/vertical scrollers by pixel', async () => {
  const client = new Client({ name: 'screenshot-mcp-test', version: '1' });
  await client.connect(screenshotServer());
  try {
    const { tools } = await client.listTools();
    const scroll = tools.find((tool) => tool.name === 'scroll');
    expect(scroll?.description).toContain('optional viewport coordinate');
    expect(scroll?.description).toContain('deltaX/deltaY');

    const html = `<!doctype html><style>
      html,body{margin:0}#outer{position:absolute;left:20px;top:20px;width:280px;height:180px;overflow:auto}
      #target,#decoy{width:220px;height:100px;overflow:auto;white-space:nowrap}#target{margin:20px}#decoy{position:absolute;left:360px;top:20px}
      #target>div,#decoy>div{width:700px;height:400px}
    </style><div id="outer"><div id="target"><div>nested target</div></div><div style="height:300px"></div></div><div id="decoy"><div>wrong target</div></div>`;
    const url = `data:text/html,${encodeURIComponent(html)}`;
    const call = (name: string, args: Record<string, unknown>) => client.callTool({ name, arguments: args });
    const state = async () => JSON.parse(textOf(await call('bench_capture', {
      evaluate: '() => ({target:[document.querySelector("#target").scrollLeft,document.querySelector("#target").scrollTop],outer:[document.querySelector("#outer").scrollLeft,document.querySelector("#outer").scrollTop],decoy:[document.querySelector("#decoy").scrollLeft,document.querySelector("#decoy").scrollTop]})',
    }))) as { target: [number, number]; outer: [number, number]; decoy: [number, number] };

    await call('navigate', { url });
    await call('scroll', { x: 100, y: 80, direction: 'right', amount: 160 });
    expect((await state())).toMatchObject({ target: [expect.any(Number), 0], outer: [0, 0], decoy: [0, 0] });
    expect((await state()).target[0]).toBeGreaterThan(0);
    await call('scroll', { x: 100, y: 80, deltaY: 80 });
    expect((await state()).target[1]).toBeGreaterThan(0);
    expect((await state()).outer[1]).toBe(0);

    // Near miss: the neighboring scroller moves, proving the coordinate target matters.
    await call('navigate', { url });
    await call('scroll', { x: 430, y: 80, direction: 'right', amount: 160 });
    const wrongTarget = await state();
    expect(wrongTarget.target[0]).toBe(0);
    expect(wrongTarget.decoy[0]).toBeGreaterThan(0);
  } finally {
    await client.close();
  }
}, 30_000);
