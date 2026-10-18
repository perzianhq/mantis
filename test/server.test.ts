import { afterAll, beforeAll, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { MantisBrowser, createServer } from '../src/index.js';
import { fixture } from './helpers.js';

const browser = new MantisBrowser({ actionTimeoutMs: 1500 });
const client = new Client({ name: 'test', version: '0' });

beforeAll(async () => {
  const [a, z] = InMemoryTransport.createLinkedPair();
  await Promise.all([createServer(browser).connect(a), client.connect(z)]);
});
afterAll(async () => {
  await client.close();
  await browser.close();
});

const call = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await client.callTool({ name, arguments: args });
  const content = res.content as { type: string; text: string }[];
  return { text: content[0].text, isError: res.isError === true };
};

it('exposes the core tools and the fallback ladder', async () => {
  const { tools } = await client.listTools();
  expect(tools.map((t) => t.name).sort()).toEqual(['ask_human', 'back', 'click', 'data', 'fill', 'find', 'forget', 'look', 'media', 'ocr', 'open', 'press', 'read', 'scroll', 'select', 'type']);
});

it('guides bottom-loaded feed search through End and the returned region', async () => {
  const { tools } = await client.listTools();
  const description = (name: string) => tools.find((tool) => tool.name === name)!.description!;
  expect(description('press')).toContain('For bottom-loaded feeds, try End (Control+End if no movement) to load more');
  expect(description('press')).toContain('repeat only while new items appear');
  expect(description('find')).toContain('For adjacent paragraph context, read the returned region');
  expect(description('find')).toContain('a matched heading is not a region label');
});

it('a heading hit supplies a real region for adjacent paragraph context, not a heading-as-region', async () => {
  const html = `<!doctype html><title>Bulletin</title>
    <main aria-label="Bulletins"><h2>Entry Alpha</h2><p>Neighbor note: amber.</p>
    <h2>Entry Beta</h2><p>Target note: indigo.</p></main>
    <aside aria-label="Archive"><h2>Entry Gamma</h2><p>Unrelated note: teal.</p></aside>`;
  await call('open', { url: 'data:text/html,' + encodeURIComponent(html) });
  const found = await call('find', { text: 'Entry Beta' });
  expect(found.text).toContain('## Entry Beta');
  expect(found.text).not.toContain('Target note: indigo.');
  const region = found.text.match(/in \[([^\]]+)\]/)![1];
  const context = await call('read', { region });
  expect(context.isError).toBe(false);
  expect(context.text).toMatch(/Entry Beta[\s\S]*Target note: indigo\./);
  expect(context.text).not.toContain('Unrelated note: teal.');
  // A heading match is not itself a valid region, even though its paragraph exists.
  const wrongRegion = await call('read', { region: 'Entry Beta' });
  expect(wrongRegion.isError).toBe(true);
});

it('open then click by number over MCP', async () => {
  const opened = await call('open', { url: fixture('shadow.html') });
  const n = Number(opened.text.match(/#(\d+) button "Shadow button"/)![1]);
  const clicked = await call('click', { id: n });
  expect(clicked.isError).toBe(false);
  expect(clicked.text).toContain('title: "Shadow" → "Shadow clicked"');
});

it('read accepts optional region and full over MCP', async () => {
  await call('open', { url: fixture('login.html') });
  const plain = await call('read');
  expect(plain.text).toContain('link "Home"');
  const part = await call('read', { region: 'form' });
  expect(part.text).toContain('textbox "Email"');
  expect(part.text).not.toContain('link "Home"');
  const bad = await call('read', { region: 'nope' });
  expect(bad.isError).toBe(true);
  expect((await call('read', { full: true })).isError).toBe(false);
});

it('flags errors with isError', async () => {
  const res = await call('click', { id: 4242 });
  expect(res.isError).toBe(true);
  expect(res.text).toMatch(/^error: no element #4242/);
});
