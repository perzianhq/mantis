import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import { SHOPPING_V2_CASES, SHOPPING_V2_ROUTES as R, shoppingV2Data, shoppingV2Route, gradeShoppingV2Case } from '../bench/fixtures-shopping-v2.js';
import { SHOPPING_V2_TASKS, SHOPPING_V2_CHECKS, SHOPPING_V2_MANIFEST, SHOPPING_V2_SUITE, shoppingV2AgentRoute, shoppingV2Summary, shoppingV2Markdown, gradeShoppingV2Answer } from '../bench/agent/shopping-v2.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  fixtures = await startFixtures({ checks: SHOPPING_V2_CHECKS, developmentRoute: shoppingV2AgentRoute });
});
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

it('registers six scenario-only tasks, matching manifest, runner routes, seeds and source hashes', () => {
  expect(SHOPPING_V2_SUITE).toBe('shopping-v2');
  const ids = SHOPPING_V2_CASES.map((entry) => entry.id);
  expect(ids).toHaveLength(6);
  expect(SHOPPING_V2_TASKS.map((task) => task.id)).toEqual(ids);
  expect(SHOPPING_V2_CHECKS.map((check) => check.taskId)).toEqual(ids);
  expect(SHOPPING_V2_MANIFEST.map((entry) => entry.id)).toEqual(ids);
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/shopping-v2.json', import.meta.url), 'utf8'));
  expect(manifest.tasks).toEqual(ids); expect(manifest.taskCount).toBe(6);
  expect(manifest.approaches).toEqual(['mantis', 'tree', 'screenshot']);
  expect(SHOPPING_V2_CASES.filter((entry) => entry.definition.visual)).toHaveLength(2);
  const runner = readFileSync(new URL('../bench/agent/run.ts', import.meta.url), 'utf8');
  for (const name of ['SHOPPING_V2_TASKS', 'SHOPPING_V2_CHECKS', 'SHOPPING_V2_MANIFEST', 'shoppingV2AgentRoute', 'gradeShoppingV2Answer', 'gradeShoppingV2Case', 'shoppingV2Summary', 'shoppingV2Markdown']) expect(runner).toContain(name);
  for (const source of ['bench/fixtures-shopping-v2.ts', 'bench/agent/shopping-v2.ts', 'bench/manifests/shopping-v2.json']) expect(runner).toContain(`'${source}'`);
  for (const task of SHOPPING_V2_TASKS) {
    expect(task.prompt('http://fixture')).not.toMatch(/shared|attribute|compare|intersection|material|pattern|swatch|colour|tier|size/i);
    expect(task.prompt('http://fixture')).toContain('recommend');
  }
});

it('uses identical deterministic task/run variants for all approaches, with changing products, preferences and errands', () => {
  for (const entry of SHOPPING_V2_CASES) {
    const variants = Array.from({ length: 12 }, (_, i) => {
      const copies = ['mantis', 'tree', 'screenshot'].map((approach) => shoppingV2Data(entry.id, `${entry.id}-${approach}-${i + 1}-other-seed-${entry.seed}-${i + 1}`));
      expect(copies[0]).toEqual(copies[1]); expect(copies[0]).toEqual(copies[2]);
      return copies[0]!;
    });
    expect(new Set(variants.map((data) => data.correctId)).size).toBeGreaterThan(1);
    expect(new Set(variants.map((data) => data.viewed[0]!.traits.join('|'))).size).toBeGreaterThan(1);
    expect(new Set(variants.map((data) => data.detours.map((d) => d.title).join('|'))).size).toBeGreaterThan(1);
    expect(new Set(variants.map((data) => data.candidates.findIndex((item) => item.id === data.correctId))).size).toBeGreaterThan(1);
    for (const data of variants) {
      expect(data.detours).toHaveLength(entry.definition.gap);
      expect(data.detours.length).toBeGreaterThanOrEqual(5); expect(data.detours.length).toBeLessThanOrEqual(8);
      expect(data.viewed.every((item) => item.traits.join('|') === data.viewed[0]!.traits.join('|'))).toBe(true);
      const matches = (id: string) => data.candidates.find((item) => item.id === id)!.traits.filter((value, i) => value === data.viewed[0]!.traits[i]).length;
      expect(matches(data.correctId)).toBe(2);
      for (const id of data.oneAttributeIds) expect(matches(id)).toBe(1);
      expect(matches(data.popularId)).toBe(0);
    }
  }
});

it('keeps oracle roles and preference values out of catalog HTML, scripts and reported state', () => {
  for (const entry of SHOPPING_V2_CASES) {
    const context = { taskId: entry.id }; const data = shoppingV2Data(entry.id);
    const catalog = shoppingV2Route(R.catalog, context)!.body;
    for (const values of entry.definition.values) for (const value of values) expect(catalog).not.toContain(value);
    const pages = [R.history, R.gap, R.catalog, ...data.viewed.map((item) => R.product(item.id)), ...data.detours.map((d) => R.detour(d.id))];
    for (const route of pages) {
      const html = shoppingV2Route(route, context)!.body;
      expect(html).not.toMatch(/correctId|oneAttributeIds|popularId|recommendationCorrect|traits\s*:/);
      expect(html).not.toContain(JSON.stringify(data.viewed[0]!.traits));
    }
    if (entry.definition.visual) {
      for (const item of data.viewed) {
        const html = shoppingV2Route(R.product(item.id), context)!.body;
        for (const value of entry.definition.values[1]) expect(html).not.toContain(value);
        expect(html).toContain('<svg'); expect(html).toContain('aria-label="Product surface"');
        expect(html).toContain(item.traits[0]);
      }
    }
  }
});

it('reports calls and independent recommendation/visit counts per task and approach', () => {
  const task = SHOPPING_V2_TASKS[0]!.id;
  const rows = [
    { task, approach: 'mantis', valid: true, ok: true, toolCalls: 12, shopping: { recommendationCorrect: true, visitsComplete: true } },
    { task, approach: 'mantis', valid: true, ok: false, toolCalls: 14, shopping: { recommendationCorrect: false, visitsComplete: true } },
    { task, approach: 'tree', valid: true, ok: false, toolCalls: 5, shopping: { recommendationCorrect: true, visitsComplete: false } },
    { task, approach: 'screenshot', valid: true, ok: false, toolCalls: 7 },
    { task, approach: 'tree', valid: false, ok: false, toolCalls: 0 },
  ];
  expect(shoppingV2Summary(rows)).toEqual([
    { task, approach: 'mantis', runs: 2, correct: 1, recommendationCorrect: 1, visitsComplete: 2, toolCalls: 26 },
    { task, approach: 'tree', runs: 1, correct: 0, recommendationCorrect: 1, visitsComplete: 0, toolCalls: 5 },
    { task, approach: 'screenshot', runs: 1, correct: 0, recommendationCorrect: 0, visitsComplete: 0, toolCalls: 7 },
  ]);
  const markdown = shoppingV2Markdown(rows).join('\n');
  expect(markdown).toContain('Recommendation correct | Visits complete | Tool calls');
  expect(markdown).toContain(`| ${task} | mantis | 1/2 | 1/2 | 2/2 | 26 |`);
  expect(markdown).toContain('| All tasks | mantis | 1/2 | 1/2 | 2/2 | 26 |');
  expect(shoppingV2Markdown([])).toEqual([]);
});

for (const entry of SHOPPING_V2_CASES) {
  it(`${entry.id}: gates a browser walkthrough and grades only the final cart plus ordered phases`, async () => {
    const attempt = `${entry.id}-browser-seed-${entry.seed}-2`;
    const base = fixtures.baseFor(entry.id, attempt); const data = shoppingV2Data(entry.id, attempt);
    const open = async (route: string) => {
      await page.goto(`${base}${route}`);
      await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
    };
    await open(R.catalog); expect(await page.locator('[data-item]').count()).toBe(0);
    // Visiting notices before history does not count; even guessing their URLs cannot skip the gap.
    for (const d of data.detours) await open(R.detour(d.id));
    await open(R.gap); expect(await page.locator('#content a').count()).toBe(0);
    await open(R.history);
    for (const item of [...data.viewed].reverse()) {
      await page.getByRole('link', { name: item.name, exact: true }).click();
      await page.waitForURL(`**${R.product(item.id)}`);
      await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
      await page.getByRole('link', { name: 'Back to earlier today', exact: true }).click();
      await page.waitForURL(`**${R.history}`);
    }
    await page.getByRole('link', { name: 'Continue to errands', exact: true }).click(); await page.waitForURL(`**${R.gap}`);
    await open(R.catalog); expect(await page.locator('[data-item]').count()).toBe(0);
    for (const d of data.detours.slice(0, -1)) {
      await open(R.gap); await page.getByRole('link', { name: d.title, exact: true }).click();
      await page.waitForURL(`**${R.detour(d.id)}`); expect(await page.locator('main').innerText()).toContain(d.fact);
      await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
    }
    await open(R.catalog); expect(await page.locator('[data-item]').count()).toBe(0);
    await open(R.detour(data.detours.at(-1)!.id)); await open(R.catalog);
    expect(await page.locator('[data-item]').count()).toBe(4);
    expect(await page.locator('article').first().getAttribute('class')).toBe('popular');
    const text = await page.locator('body').innerText();
    for (const values of entry.definition.values) for (const value of values) expect(text).not.toContain(value);
    await page.locator(`[data-item="${data.popularId}"]`).click();
    await page.locator('#clear').click(); await page.locator(`[data-item="${data.correctId}"]`).click();
    // Navigation back remains allowed and preserves the cart and completed gap.
    await open(R.product(data.viewed[0]!.id)); await open(R.catalog);
    const result = await fixtures.verify(entry.id, attempt);
    expect(result?.ok, result?.details).toBe(true);
    const events = result!.provenance.events;
    expect(gradeShoppingV2Case(entry.id, 'Done', events)).toEqual({ ok: true, recommendationCorrect: true, visitsComplete: true });
    expect(gradeShoppingV2Answer(entry.id, 'Done', events).pass).toBe(true);
    expect(gradeShoppingV2Case(entry.id, '', events).ok).toBe(false);
  });
}
