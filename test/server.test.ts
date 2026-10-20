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

it('retains read verification, memory expansion and recovery contracts in compact descriptions', async () => {
  const { tools } = await client.listTools();
  const description = (name: string) => tools.find((tool) => tool.name === name)!.description!;
  const read = description('read');
  expect(read).toContain('act by #number');
  expect(read).toContain('Re-read after changes');
  expect(read).toContain('~"x" names are guesses');
  expect(read).toContain('"Same as before" retains #numbers; region/full/fresh expands it');
  expect(read).toContain('Before finishing, re-read and visibly verify every task constraint (filters, sort, size, quantity, date range)');
  expect(read).toContain('If #number is stale, read() and retry; if on the wrong page, back() and keep searching');
  expect(description('find')).toContain('Case-insensitive whole-page text search, including trimmed content');
  expect(description('find')).toContain('returns #numbers and region');
  expect(description('forget')).toContain('Clear region memory; next read shows everything');
  expect(description('scroll')).toContain('Scroll up/down/left/right (default down)');
  expect(description('scroll')).toContain('id alone brings #id into view; id + direction scrolls its containing list/panel/table');
  expect(description('scroll')).toContain('For wide tables use right; without id, a scrollable container is used when the page cannot scroll');
});

it('retains neutral fallback order, visual targeting and human safety in compact descriptions', async () => {
  const { tools } = await client.listTools();
  const description = (name: string) => tools.find((tool) => tool.name === name)!.description!;
  expect(description('media')).toContain('Only if read is insufficient');
  expect(description('media')).toContain('media → data (prefer) → ocr → look (last resort) → ask_human');
  expect(description('media')).toContain('Numbered images/canvases/charts');
  expect(description('data')).toContain('Prefer; text only');
  expect(description('data')).toContain('image/SVG/chart alt, caption, text or Chart.js/ECharts/Highcharts values');
  expect(description('data')).toContain('id from read()/media(), or CSS selector');
  // Nonempty metadata is not necessarily sufficient: do not reintroduce the rejected stop cue.
  expect(description('data')).not.toMatch(/answer without|stop after|skip (?:OCR|look)/i);
  expect(description('ocr')).toContain('Text-only OCR for image/canvas. Use if data found nothing');
  expect(description('look')).toContain('LAST RESORT; only image-returning tool (PNG, max 800px)');
  expect(description('look')).toContain('Only after read/data/ocr failed');
  for (const name of ['ocr', 'look']) expect(description(name)).toContain('id or CSS selector');
  expect(description('ask_human')).toContain('CAPTCHA, 2FA, payment or login; never solves CAPTCHAs');
  expect(description('ask_human')).toContain('Waits for a page change, then returns the page');
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
