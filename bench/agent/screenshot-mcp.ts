/** Screenshot-only browser for the real-agent eval, shaped like Anthropic's computer tool. */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { z } from 'zod';
import { chromiumExecutable, userAgentFor } from '../../src/userAgent.js';
import { NATIVE_SELECT_KEYBOARD_GUIDANCE } from './guidance.js';
import { resolveScreenshotKeySequence, resolveScreenshotModifiers } from './screenshot-keys.js';
import { COMPUTER_SCROLL_TICK_PIXELS, resolveComputerScroll } from './screenshot-scroll.js';

const VIEWPORT = { width: 1280, height: 800 };
const CLICK_ACTIONS = ['left_click', 'right_click', 'middle_click', 'double_click', 'triple_click'] as const;
const COMPUTER_ACTIONS = ['screenshot', 'zoom', 'cursor_position', 'wait', ...CLICK_ACTIONS, 'left_click_drag', 'left_mouse_down', 'left_mouse_up', 'mouse_move', 'type', 'key', 'hold_key', 'scroll'] as const;
type ComputerAction = typeof COMPUTER_ACTIONS[number];
type Coordinate = [number, number];
let browser: Browser | null = null;
let page: Page | null = null;
let cursor: Coordinate = [0, 0];

async function current(): Promise<Page> {
  if (!page) {
    browser = await chromium.launch({ headless: true, ...chromiumExecutable() });
    page = await (await browser.newContext({ viewport: VIEWPORT, userAgent: await userAgentFor(browser) })).newPage();
  }
  return page;
}

const text = (value: string, isError = false) => ({ content: [{ type: 'text' as const, text: value }], ...(isError ? { isError: true } : {}) });
const error = (value: string) => text(`error: ${value}`, true);
async function act(fn: (p: Page) => Promise<string>) {
  try {
    const p = await current();
    const message = await fn(p);
    await p.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => undefined);
    await p.waitForTimeout(300);
    return text(message);
  } catch (caught) {
    return error(String(caught instanceof Error ? caught.message : caught).split('\n')[0]);
  }
}

function coordinate(input: readonly number[] | undefined, label = 'coordinate'): Coordinate | string {
  if (!input) return `${label} is required`;
  const [x, y] = input;
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x > VIEWPORT.width || y > VIEWPORT.height) return `${label} must be two viewport pixels within ${VIEWPORT.width}x${VIEWPORT.height}`;
  return [x, y];
}

/** Native select popups are OS UI, unreliable in headless screenshots and hit testing. The in-page menu below is visible and coordinate-clickable while the real select remains focused for Arrow keys and Enter. A source string avoids tsx's helper injection into Playwright-evaluated functions. */
const NATIVE_SELECT_OVERLAY = String.raw`({ x: clickX, y: clickY }) => {
  const target = document.elementFromPoint(clickX, clickY);
  const select = target instanceof HTMLSelectElement ? target : target?.closest('select');
  if (!(select instanceof HTMLSelectElement) || select.multiple || select.size > 1 || select.disabled) return false;
  document.getElementById('__mantis_native_select_overlay')?.remove();
  const box = select.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.id = '__mantis_native_select_overlay'; overlay.setAttribute('role', 'listbox');
  overlay.style.cssText = ['position:fixed', 'left:' + box.left + 'px', 'top:' + Math.min(box.bottom, window.innerHeight - 4) + 'px', 'min-width:' + Math.max(box.width, 120) + 'px', 'max-height:240px', 'overflow:auto', 'z-index:2147483647', 'background:white', 'color:black', 'border:1px solid #767676', 'box-shadow:0 2px 8px #0006', 'font:13px sans-serif'].join(';');
  const close = () => { overlay.remove(); document.removeEventListener('pointerdown', closeOutside, true); document.removeEventListener('keydown', closeKey, true); };
  for (const option of Array.from(select.options)) {
    const row = document.createElement('button');
    row.type = 'button'; row.disabled = option.disabled; row.textContent = option.text;
    row.setAttribute('role', 'option'); row.setAttribute('aria-selected', String(option.selected));
    row.style.cssText = 'display:block;width:100%;min-height:32px;padding:6px 10px;text-align:left;border:0;background:' + (option.selected ? '#dbeafe' : 'white') + ';color:inherit';
    row.addEventListener('click', () => { if (option.disabled) return; select.value = option.value; select.dispatchEvent(new Event('input', { bubbles: true })); select.dispatchEvent(new Event('change', { bubbles: true })); select.focus(); close(); });
    overlay.append(row);
  }
  const closeOutside = (event) => { if (!overlay.contains(event.target) && event.target !== select) close(); };
  const closeKey = (event) => { if (event.key === 'Escape' || event.key === 'Enter') close(); };
  document.addEventListener('pointerdown', closeOutside, true);
  document.addEventListener('keydown', closeKey, true);
  document.body.append(overlay); select.focus(); return true;
}`;
async function openNativeSelectOverlayAt(p: Page, x: number, y: number): Promise<boolean> {
  return p.evaluate(`(${NATIVE_SELECT_OVERLAY})(${JSON.stringify({ x, y })})`);
}

async function click(p: Page, at: Coordinate, action: typeof CLICK_ACTIONS[number], modifierText: string | undefined): Promise<string> {
  const modifiers = resolveScreenshotModifiers(modifierText);
  if ('error' in modifiers) throw new Error(modifiers.error);
  cursor = at;
  if (action === 'left_click' && await openNativeSelectOverlayAt(p, ...at)) return `opened native dropdown at (${at.join(', ')})`;
  const button = action === 'right_click' ? 'right' : action === 'middle_click' ? 'middle' : 'left';
  const clickCount = action === 'double_click' ? 2 : action === 'triple_click' ? 3 : 1;
  await p.mouse.click(...at, { button, clickCount, modifiers: modifiers.modifiers as ('Alt' | 'Control' | 'Meta' | 'Shift')[] });
  return `${action} at (${at.join(', ')})`;
}

const server = new McpServer({ name: 'screenshot', version: '0.2.0' });
server.registerTool('navigate', { description: 'Go to a URL. This benchmark-only browser navigation is separate from the computer tool.', inputSchema: { url: z.string() } }, ({ url }) => act(async (p) => { await p.goto(url, { waitUntil: 'domcontentloaded' }); return `navigated to ${p.url()}`; }));
server.registerTool('back', { description: 'Go back one page.', inputSchema: {} }, () => act(async (p) => { await p.goBack(); return `back to ${p.url()}`; }));
server.registerTool('upload', {
  description: 'Select one existing local file in a file input at a viewport coordinate. This only selects the file; it does not submit a form.',
  inputSchema: { coordinate: z.array(z.number()).length(2), path: z.string() },
}, async ({ coordinate: point, path: file }) => {
  const at = coordinate(point);
  if (typeof at === 'string') return error(at);
  return act(async (p) => {
    const input = await p.evaluateHandle(([x, y]) => {
      const node = document.elementFromPoint(x, y);
      if (node instanceof HTMLInputElement && node.type === 'file') return node;
      if (node instanceof HTMLLabelElement && node.control instanceof HTMLInputElement && node.control.type === 'file') return node.control;
      return node?.closest('label')?.querySelector('input[type="file"]') ?? null;
    }, at);
    const element = input.asElement();
    if (!element) throw new Error('coordinate does not identify a file input or its label');
    await element.setInputFiles(file);
    return `selected ${file.split(/[\\/]/).pop() ?? 'file'}`;
  });
});
server.registerTool('computer', {
  description: `Anthropic-style coordinate computer tool for a ${VIEWPORT.width}x${VIEWPORT.height} viewport. screenshot returns the viewport; zoom crops region [x0,y0,x1,y1]. Click coordinates are [x,y], click text is optional ctrl/alt/shift/meta modifiers. key accepts portable xdotool-style names and space-separated presses. scroll_amount is wheel ticks; one tick is ${COMPUTER_SCROLL_TICK_PIXELS} CSS pixels. ${NATIVE_SELECT_KEYBOARD_GUIDANCE}`,
  inputSchema: {
    action: z.enum(COMPUTER_ACTIONS), coordinate: z.array(z.number()).length(2).optional().describe('Viewport [x, y].'), start_coordinate: z.array(z.number()).length(2).optional().describe('Drag start viewport [x, y].'), region: z.array(z.number()).length(4).optional().describe('Zoom [x0, y0, x1, y1].'), text: z.string().optional(), duration: z.number().positive().max(10).optional().describe('Seconds, maximum 10.'), scroll_direction: z.enum(['up', 'down', 'left', 'right']).optional(), scroll_amount: z.number().positive().max(100).optional().describe(`Wheel ticks; one tick is ${COMPUTER_SCROLL_TICK_PIXELS} CSS pixels.`),
  },
}, async (input) => {
  const action = input.action as ComputerAction;
  try {
    const p = await current();
    if (action === 'screenshot') { const png = await p.screenshot({ type: 'png' }); return { content: [{ type: 'image' as const, data: png.toString('base64'), mimeType: 'image/png' }] }; }
    if (action === 'zoom') {
      const region = input.region;
      if (!region) return error('region is required for zoom');
      const [x0, y0, x1, y1] = region;
      if (![x0, y0, x1, y1].every(Number.isFinite) || x0 < 0 || y0 < 0 || x1 <= x0 || y1 <= y0 || x1 > VIEWPORT.width || y1 > VIEWPORT.height) return error('region must be [x0,y0,x1,y1] within the viewport with x1>x0 and y1>y0');
      const png = await p.screenshot({ type: 'png', clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } });
      return { content: [{ type: 'image' as const, data: png.toString('base64'), mimeType: 'image/png' }] };
    }
    if (action === 'cursor_position') return text(`cursor position: (${cursor.join(', ')})`);
    if (CLICK_ACTIONS.includes(action as typeof CLICK_ACTIONS[number])) { const at = coordinate(input.coordinate); if (typeof at === 'string') return error(at); return act((active) => click(active, at, action as typeof CLICK_ACTIONS[number], input.text)); }
    if (action === 'left_click_drag') {
      const start = coordinate(input.start_coordinate, 'start_coordinate'); const end = coordinate(input.coordinate);
      if (typeof start === 'string' || typeof end === 'string') return error(typeof start === 'string' ? start : end);
      cursor = end;
      return act(async (active) => { await active.mouse.move(...start); await active.mouse.down(); await active.mouse.move(...end); await active.mouse.up(); return `dragged from (${start.join(', ')}) to (${end.join(', ')})`; });
    }
    if (action === 'mouse_move') { const at = coordinate(input.coordinate); if (typeof at === 'string') return error(at); cursor = at; return act(async (active) => { await active.mouse.move(...at); return `moved to (${at.join(', ')})`; }); }
    if (action === 'left_mouse_down' || action === 'left_mouse_up') return act(async (active) => { if (action === 'left_mouse_down') await active.mouse.down(); else await active.mouse.up(); return action.replaceAll('_', ' '); });
    if (action === 'type') { if (input.text === undefined) return error('text is required for type'); return act(async (active) => { await active.keyboard.type(input.text); return `typed ${JSON.stringify(input.text)}`; }); }
    if (action === 'key') { if (!input.text) return error('text is required for key'); const keys = resolveScreenshotKeySequence(input.text); if ('error' in keys) return error(keys.error); return act(async (active) => { for (const key of keys.keys) await active.keyboard.press(key); return `pressed ${keys.keys.join(' ')}`; }); }
    if (action === 'hold_key') {
      if (!input.text || input.duration === undefined) return error('text and duration are required for hold_key');
      const keys = resolveScreenshotKeySequence(input.text); if ('error' in keys) return error(keys.error); if (keys.keys.length !== 1) return error('hold_key accepts one key or chord');
      const held = keys.keys[0].split('+');
      return act(async (active) => { for (const key of held) await active.keyboard.down(key); await active.waitForTimeout(input.duration * 1000); for (const key of held.reverse()) await active.keyboard.up(key); return `held ${input.text} for ${input.duration} seconds`; });
    }
    if (action === 'scroll') {
      const at = coordinate(input.coordinate); if (typeof at === 'string') return error(at);
      if (!input.scroll_direction || input.scroll_amount === undefined) return error('scroll_direction and scroll_amount are required for scroll');
      const { deltaX, deltaY } = resolveComputerScroll(input.scroll_direction, input.scroll_amount); cursor = at;
      return act(async (active) => { await active.mouse.move(...at); await active.mouse.wheel(deltaX, deltaY); return `scrolled ${input.scroll_direction} ${input.scroll_amount} tick(s) at (${at.join(', ')})`; });
    }
    if (action === 'wait') { if (input.duration === undefined) return error('duration is required for wait'); return act(async (active) => { await active.waitForTimeout(input.duration * 1000); return `waited ${input.duration} seconds`; }); }
    return error(`unsupported computer action ${action}`);
  } catch (caught) { return error(String(caught instanceof Error ? caught.message : caught).split('\n')[0]); }
});

server.registerTool('bench_capture', { description: 'Harness-only viewport capture; with `evaluate` (source of a function, as in browser_evaluate), also returns its result as text.', inputSchema: { evaluate: z.string().optional() } }, async ({ evaluate }) => {
  if (!page || page.isClosed()) return error('No live page to capture.');
  const png = await page.screenshot({ type: 'png', fullPage: false, scale: 'css' });
  const content: ({ type: 'image'; data: string; mimeType: string } | { type: 'text'; text: string })[] = [{ type: 'image', data: png.toString('base64'), mimeType: 'image/png' }];
  if (evaluate) try { const value: unknown = await page.evaluate(`(${evaluate})()`); content.push({ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) ?? String(value) }); } catch { /* Screenshot remains useful. */ }
  return { content };
});

const close = (): void => { void browser?.close().finally(() => process.exit(0)); };
process.stdin.on('close', close);
process.on('SIGTERM', close);
await server.connect(new StdioServerTransport());
