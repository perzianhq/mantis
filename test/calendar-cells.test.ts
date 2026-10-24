import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture } from './helpers.js';

let browser: MantisBrowser;
beforeAll(() => { browser = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await browser.close(); });

describe('delegated grid cells', () => {
  it('numbers repeated pointer-styled cells and clicks the selected value', async () => {
    await browser.open(fixture('calendar-cells.html'));
    const snap = await browser.snapshot();
    const cell = snap.nodes.find((node) => node.kind === 'interactive' && node.name === '23');
    expect(cell?.id).toBeTypeOf('number');
    await browser.click(cell!.id!);
    expect(await browser.read()).toContain('value "2026-10-23"');
  });

  it('keeps ordinary numeric data and disabled outside cells unnumbered', async () => {
    await browser.open(fixture('calendar-cells.html'));
    const snap = await browser.snapshot();
    const outside = snap.nodes.filter((node) => node.kind === 'interactive' && node.name === '30');
    expect(outside.length === 0 || outside.every((node) => node.states.includes('disabled'))).toBe(true);
    const numericText = snap.nodes.filter((node) => node.kind === 'text' && node.name === '23');
    expect(numericText.length).toBeGreaterThan(0);
  });
});

describe('date-attribute cells without pointer styling', () => {
  it('numbers cells carrying a repeated date attribute and leaves unmarked numeric rows as text', async () => {
    await browser.open(fixture('calendar-data-date.html'));
    const snap = await browser.snapshot();
    const cells = snap.nodes.filter((node) => node.kind === 'interactive' && node.name === '23');
    expect(cells).toHaveLength(1);
    await browser.click(cells[0].id!);
    expect(await browser.read()).toContain('value "20261023"');
    const plain = snap.nodes.filter((node) => node.kind === 'text' && node.name === '23');
    expect(plain.length).toBeGreaterThan(0);
  });
});
