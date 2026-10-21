import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { MantisBrowser } from '../src/index.js';
import { startFixtures } from '../bench/fixtures.js';
import { V21_RELIABILITY_CASES, V21_RELIABILITY_CHECKS, gradeV21ReliabilityCase, v21ReliabilityRoute } from '../bench/fixtures-v21-reliability.js';
import { LOCAL_V21_CHECKS, LOCAL_V21_MANIFEST, LOCAL_V21_SUITE, LOCAL_V21_TASKS, localV21Route } from '../bench/agent/local-v21.js';
import { LOCAL_V2_TASKS } from '../bench/agent/local-v2.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  page = await browser.newPage();
  fixtures = await startFixtures({ checks: V21_RELIABILITY_CHECKS, developmentRoute: v21ReliabilityRoute });
});
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

const open = async (entry: typeof V21_RELIABILITY_CASES[number], attempt: string) => {
  await page.goto(`${fixtures.baseFor(entry.id, attempt)}${entry.route}`);
  await page.waitForLoadState('domcontentloaded');
};

it('keeps frozen v2 intact and creates one permanent 54-task v2.1 selector across all original domains', () => {
  expect(LOCAL_V21_SUITE).toBe('local-v2.1');
  expect(LOCAL_V2_TASKS).toHaveLength(48);
  expect(LOCAL_V21_TASKS).toHaveLength(54);
  expect(LOCAL_V21_CHECKS).toHaveLength(54);
  expect(LOCAL_V21_TASKS.slice(0, 48).map((task) => task.id)).toEqual(LOCAL_V2_TASKS.map((task) => task.id));
  expect(LOCAL_V21_MANIFEST).toHaveLength(54);
  expect(new Set(LOCAL_V21_MANIFEST.map((entry) => entry.domain))).toEqual(new Set([
    'dense-tables', 'lists-scrolling', 'charts-canvas-images', 'forms-embedded-controls',
    'overlays-shadow-dom', 'spa-navigation-recovery', 'regions-reading', 'long-workflows',
  ]));
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/local-v21.json', import.meta.url), 'utf8')) as { taskCount: number; tasks: string[]; domains: string[]; reliabilityCases: { id: string; description: string }[] };
  expect(manifest.taskCount).toBe(54);
  expect(manifest.tasks).toEqual(LOCAL_V21_TASKS.map((task) => task.id));
  expect(manifest.domains).toHaveLength(8);
  expect(manifest.reliabilityCases).toHaveLength(6);
  expect(manifest.reliabilityCases.every((entry) => entry.description.length > 0)).toBe(true);
});

it('serves all six rendered reliability fixtures through the common v2.1 route without a tool-specific path', () => {
  expect(V21_RELIABILITY_CASES).toHaveLength(6);
  for (const entry of V21_RELIABILITY_CASES) {
    expect(v21ReliabilityRoute(entry.route)?.type, entry.id).toBe('text/html; charset=utf-8');
    expect(localV21Route(entry.route)?.body, entry.id).toContain('<title>');
    expect(entry.prompt('http://fixture'), entry.id).toContain(entry.route);
    expect(entry.prompt('http://fixture'), entry.id).not.toMatch(/stale[- ]?(?:id|element)|tool-specific/i);
  }
});

it('renders the iframe/open-shadow media fact in the ordinary page surface', async () => {
  const entry = V21_RELIABILITY_CASES.find((item) => item.family === 'iframe-shadow-media-fact')!;
  await open(entry, 'v21-media-rendered');
  const frame = page.frameLocator('iframe[title="Live media report"]');
  expect(await frame.locator('media-report').isVisible()).toBe(true);
  expect(await frame.locator('media-report').locator('img').getAttribute('alt')).toBe('Beacon intensity: 73 lux');
  expect(await page.getByRole('img', { name: 'Archive beacon intensity: 41 lux' }).isVisible()).toBe(true);

  const mantis = new MantisBrowser({ actionTimeoutMs: 1500 });
  try {
    const view = await mantis.open(`${fixtures.baseFor(entry.id, 'v21-media-mantis')}${entry.route}`);
    expect(view).toContain('[iframe "Live media report"]');
    expect(view).toContain('Beacon intensity: 73 lux');
  } finally { await mantis.close(); }
});

it('uses a Chart.js runtime visibility change and refreshes the recycled-control identity', async () => {
  const chart = V21_RELIABILITY_CASES.find((item) => item.family === 'visible-chart-series-over-hidden-decoy')!;
  await open(chart, 'v21-chart-runtime-visibility');
  expect(await page.locator('#shipments').isVisible()).toBe(true);
  expect(await page.locator('figcaption').textContent()).toContain('values are in units');
  expect(await page.evaluate(() => (window as any).Chart.getChart(document.querySelector('#shipments')).isDatasetVisible(1))).toBe(false);

  const recycled = V21_RELIABILITY_CASES.find((item) => item.family === 'recycled-control-current-record')!;
  await open(recycled, 'v21-recycled-refresh');
  await page.fill('#filter', 'Cedar');
  expect(await page.locator('#complete').textContent()).toBe('Complete Birch-18');
  await page.click('#refresh');
  expect(await page.locator('#complete').textContent()).toBe('Complete Cedar-73');
});

it('proves every reliability happy path with exact answer and terminal-state grading', async () => {
  for (const entry of V21_RELIABILITY_CASES) {
    const attempt = `${entry.id}-happy`;
    await open(entry, attempt);
    switch (entry.family) {
      case 'recycled-control-current-record':
        await page.fill('#filter', 'Cedar'); await page.click('#refresh'); await page.click('#complete'); break;
      case 'nested-child-action':
        await page.click('#approve'); break;
      default:
        break;
    }
    await page.waitForFunction(() => (window as any).__fixturePending === 0);
    const result = await fixtures.verify(entry.id, attempt);
    expect(result?.ok, entry.id).toBe(true);
    expect(gradeV21ReliabilityCase(entry.id, entry.expected.answer, result!.provenance.events), entry.id).toEqual({ ok: true });
  }
});

it('rejects a reachable case-specific near miss for every reliability fixture', async () => {
  for (const entry of V21_RELIABILITY_CASES) {
    const attempt = `${entry.id}-near`;
    await open(entry, attempt);
    switch (entry.family) {
      case 'recycled-control-current-record':
        await page.click('#complete'); break;
      case 'nested-child-action':
        await page.click('#request'); break;
      case 'visible-prose-over-hidden-decoy':
        expect(await page.locator('#release span').isVisible()).toBe(false); break;
      case 'visible-chart-series-over-hidden-decoy':
        expect(await page.locator('svg g').isVisible()).toBe(false); break;
      case 'iframe-shadow-media-fact':
        expect(await page.getByRole('img', { name: 'Archive beacon intensity: 41 lux' }).isVisible()).toBe(true); break;
      case 'inline-prose-tail':
        expect(await page.locator('#report').textContent()).toContain('Lark-281'); break;
    }
    await page.waitForFunction(() => (window as any).__fixturePending === 0);
    const result = await fixtures.verify(entry.id, attempt);
    expect(gradeV21ReliabilityCase(entry.id, entry.nearMiss.answer, result!.provenance.events).ok, entry.nearMiss.id).toBe(false);
    if (entry.family === 'recycled-control-current-record' || entry.family === 'nested-child-action') {
      expect(result?.ok, entry.nearMiss.id).toBe(false);
    }
  }
});
