#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MantisBrowser } from './browser.js';
import { noHuman } from './fallback/captcha.js';

const reply = (text: string) => ({
  content: [{ type: 'text' as const, text }],
  ...(text.startsWith('error:') ? { isError: true } : {}),
});

/** Build the MCP server around a browser (launched lazily on first tool call). */
export function createServer(browser: MantisBrowser = new MantisBrowser()): McpServer {
  const server = new McpServer({ name: 'mantis', version: '0.1.1' });
  const id = z.number().int();
  const humanAvailable = !noHuman();

  server.registerTool(
    'open',
    { description: 'Open URL as numbered page text; act by #number.', inputSchema: { url: z.string() } },
    async ({ url }) => reply(await browser.open(url)),
  );
  server.registerTool(
    'read',
    {
      description:
        'Numbered text; act by #number. Re-read after changes. ~"x" names are guesses. ' +
        '"Same as before" retains #numbers; region/full/fresh expands it. ' +
        'Before finishing, re-read and visibly verify every task constraint (filters, sort, size, quantity, date range). ' +
        'If #number is stale, read() and retry; if on the wrong page, back() and keep searching.',
      inputSchema: {
        region: z.string().optional().describe('Label substring, e.g. "nav"; if none matches, text inside a region also works'),
        full: z.boolean().optional().describe('No trimming'),
        fresh: z.boolean().optional().describe('Expand seen regions too (this call only)'),
      },
    },
    async ({ region, full, fresh }) => reply(await browser.read({ region, full, fresh })),
  );
  server.registerTool(
    'find',
    {
      description:
        'Case-insensitive whole-page text search, including trimmed content; returns #numbers and region. ' +
        'For adjacent paragraph context, read the returned region; a matched heading is not a region label.',
      inputSchema: { text: z.string() },
    },
    async ({ text }) => reply(await browser.find(text)),
  );
  server.registerTool(
    'forget',
    {
      description: 'Clear region memory; next read shows everything.',
      inputSchema: {},
    },
    async () => reply(await browser.forget()),
  );
  server.registerTool(
    'click',
    { description: 'Click element #id.', inputSchema: { id } },
    async ({ id }) => reply(await browser.click(id)),
  );
  server.registerTool(
    'type',
    {
      description: 'Replace input #id text; submit presses Enter.',
      inputSchema: { id, text: z.string(), submit: z.boolean().optional() },
    },
    async ({ id, text, submit }) => reply(await browser.type(id, text, submit ?? false)),
  );
  server.registerTool(
    'select',
    { description: 'Choose option text in select or combobox #id.', inputSchema: { id, option: z.string() } },
    async ({ id, option }) => reply(await browser.select(id, option)),
  );
  server.registerTool(
    'fill',
    {
      description: 'Fill several fields at once: text, dropdown option, or true/false for checkboxes.',
      inputSchema: { fields: z.array(z.object({ id, value: z.union([z.string(), z.boolean()]) })) },
    },
    async ({ fields }) => reply(await browser.fill(fields)),
  );
  server.registerTool(
    'press',
    {
      description: 'Press a key, e.g. Enter. For bottom-loaded feeds, try End (Control+End if no movement) to load more; repeat only while new items appear.',
      inputSchema: { key: z.string() },
    },
    async ({ key }) => reply(await browser.press(key)),
  );
  server.registerTool(
    'scroll',
    {
      description: 'Scroll up/down/left/right (default down). id alone brings #id into view; id + direction scrolls its containing list/panel/table. For wide tables use right; without id, a scrollable container is used when the page cannot scroll.',
      inputSchema: { direction: z.enum(['up', 'down', 'left', 'right']).optional(), id: id.optional() },
    },
    async ({ direction, id }) =>
      reply(await (id !== undefined && direction ? browser.scroll(direction, id) : browser.scroll(id ?? direction ?? 'down'))),
  );
  server.registerTool(
    'back',
    { description: 'Back one page in history.', inputSchema: {} },
    async () => reply(await browser.back()),
  );
  server.registerTool(
    'wait_for',
    {
      description: 'Wait up to 10s for text or #id state, then show changes.',
      inputSchema: {
        text: z.string().optional(),
        id: id.optional(),
        state: z.enum(['appears', 'disappears', 'present', 'enabled']).optional(),
        timeout_seconds: z.number().positive().max(10).optional(),
      },
    },
    async ({ text, id, state, timeout_seconds }) => reply(await browser.waitFor({ text, id, state, timeoutSeconds: timeout_seconds })),
  );
  server.registerTool(
    'hover',
    { description: 'Hover element #id and show changes.', inputSchema: { id } },
    async ({ id }) => reply(await browser.hover(id)),
  );
  server.registerTool(
    'upload',
    {
      description: 'Set local file path(s) on #id.',
      inputSchema: {
        id,
        path: z.string().optional(),
        paths: z.array(z.string()).min(1).optional(),
        files: z.array(z.string()).min(1).optional(),
      },
    },
    async ({ id, path, paths, files }) => {
      const supplied = [path === undefined ? undefined : [path], paths, files].filter((value): value is string[] => value !== undefined);
      return reply(supplied.length === 1 ? await browser.upload(id, supplied[0]!) : 'error: give exactly one of path, paths, or files');
    },
  );
  server.registerTool(
    'tabs',
    {
      description: 'List tabs, or switch/close tab #id.',
      inputSchema: { action: z.enum(['list', 'switch', 'close']).optional(), id: id.optional() },
    },
    async ({ action, id }) => reply(await browser.tabs(action, id)),
  );

  // ---- fallback ladder: only when read() is not enough. Try in this order. ----
  const visual = {
    id: id.optional(),
    selector: z.string().optional().describe('CSS selector'),
  };
  server.registerTool(
    'media',
    {
      description: `Only if read is insufficient: media → data (prefer) → ocr → look (last resort)${humanAvailable ? ' → ask_human' : ''}. Numbered images/canvases/charts.`,
      inputSchema: {},
    },
    async () => reply(await browser.media()),
  );
  server.registerTool(
    'data',
    {
      description:
        'Prefer; text only. Extract image/SVG/chart alt, caption, text or Chart.js/ECharts/Highcharts values. id from read()/media(), or CSS selector.',
      inputSchema: visual,
    },
    async ({ id, selector }) => reply(await browser.data({ id, selector })),
  );
  server.registerTool(
    'ocr',
    {
      description: 'Text-only OCR for image/canvas. Use if data found nothing. id or CSS selector.',
      inputSchema: visual,
    },
    async ({ id, selector }) => reply(await browser.ocr({ id, selector })),
  );
  server.registerTool(
    'look',
    {
      description:
        'LAST RESORT; only image-returning tool (PNG, max 800px). Only after read/data/ocr failed. id or CSS selector.',
      inputSchema: visual,
    },
    async ({ id, selector }) => {
      const r = await browser.look({ id, selector });
      if ('error' in r) return reply(r.error);
      return {
        content: [
          { type: 'image' as const, data: r.png.toString('base64'), mimeType: 'image/png' },
          { type: 'text' as const, text: r.text },
        ],
      };
    },
  );
  if (humanAvailable) {
    server.registerTool(
      'ask_human',
      {
        description:
          'Human handoff for CAPTCHA, 2FA, payment or login; never solves CAPTCHAs. Waits for a page change, then returns the page.',
        inputSchema: {
          reason: z.string().describe('What the human must do'),
          until: z.string().optional().describe('url_change | selector_gone:<css> | selector_present:<css>; default: URL or content change'),
          timeout_seconds: z.number().positive().optional().describe('Default 300'),
        },
      },
      async ({ reason, until, timeout_seconds }) => reply(await browser.askHuman(reason, until, timeout_seconds)),
    );
  }
  return server;
}

async function main(): Promise<void> {
  const browser = new MantisBrowser();
  const server = createServer(browser);
  const shutdown = (): void => {
    void browser.close().finally(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.stdin.on('close', shutdown);
  await server.connect(new StdioServerTransport());
}

// Run only when executed directly (not when imported by tests).
const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(realpathSync(entry)).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
