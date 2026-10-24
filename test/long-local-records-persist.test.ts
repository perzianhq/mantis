import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import { LONG_LOCAL_V1_CHECKS, longLocalV1Route } from '../bench/agent/long-local-v1.js';

let browser: Browser; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  fixtures = await startFixtures({ checks: LONG_LOCAL_V1_CHECKS, developmentRoute: longLocalV1Route });
});
afterAll(async () => { await browser?.close(); await fixtures?.close(); });

async function withPage<T>(run: (page: Page) => Promise<T>): Promise<T> {
  const context = await browser.newContext();
  try { return await run(await context.newPage()); } finally { await context.close(); }
}
const ledger = (page: Page) => page.evaluate(() => (window as any).__fixtureLong().ledger);
const shown = (page: Page, selector: string) => page.locator(selector).isVisible();
const mutationCount = (page: Page) => page.evaluate(() => (window as any).__fixtureLong().revision as number);

describe('basket persistence and in-place cart updates', () => {
  const open = async (page: Page, attempt: string, variant = 'off') => {
    const base = fixtures.baseFor(`llf-basket-${variant}`, attempt);
    await page.goto(`${base}/long-local/basket/${variant}/catalog`);
    return base;
  };

  it('keeps the cart when the agent navigates back to the catalogue, per attempt only', async () => {
    await withPage(async (page) => {
      const base = await open(page, 'basket-persist-a');
      await page.locator('[data-add="p03"]').click();
      await page.locator('[data-add="p13"]').click();
      await page.goto(`${base}/long-local/basket/off/catalog`);
      await page.locator('#basket').click();
      expect((await ledger(page)).cart).toEqual([['p03', 2], ['p13', 3]]);
      expect(await page.locator('[data-quantity="p13"]').count()).toBe(1);
      // near miss: a different attempt id starts from the initial cart
      const other = fixtures.baseFor('llf-basket-off', 'basket-persist-b');
      await page.goto(`${other}/long-local/basket/off/catalog`);
      expect((await ledger(page)).cart).toEqual([['p03', 1], ['p13', 2]]);
    });
  }, 60_000);

  it('keeps the rotated product order and receipt-bearing state on the hazard variant', async () => {
    await withPage(async (page) => {
      const base = await open(page, 'basket-persist-hazard', 'on');
      const first = await page.locator('#products button').first().getAttribute('data-add');
      await page.locator(`[data-add="${first}"]`).click();
      const rotated = await page.locator('#products button').first().getAttribute('data-add');
      expect(rotated).not.toBe(first);
      await page.goto(`${base}/long-local/basket/on/catalog`);
      expect(await page.locator('#products button').first().getAttribute('data-add')).toBe(rotated);
      expect((await ledger(page)).cart).toEqual([[first, 1], ['p03', 1], ['p13', 2]].sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
    });
  }, 60_000);

  it('quantity change keeps sibling rows alive so an immediate Remove still lands', async () => {
    await withPage(async (page) => {
      await open(page, 'basket-inplace-a');
      await page.locator('#basket').click();
      const removeP13 = await page.locator('[data-remove="p13"]').elementHandle();
      await page.locator('[data-quantity="p03"]').fill('3');
      await page.locator('[data-quantity="p03"]').blur();
      expect(await removeP13!.evaluate((node) => node.isConnected)).toBe(true);
      await removeP13!.click();
      expect((await ledger(page)).cart).toEqual([['p03', 3]]);
      expect(await page.locator('#total').innerText()).toContain('€');
    });
  }, 60_000);

  it('records no mutation when the quantity is set to its current value', async () => {
    await withPage(async (page) => {
      await open(page, 'basket-inplace-b');
      await page.locator('#basket').click();
      const before = await mutationCount(page);
      await page.locator('[data-quantity="p03"]').fill('1');
      await page.locator('[data-quantity="p03"]').blur();
      expect(await mutationCount(page)).toBe(before);
    });
  }, 60_000);
});

describe('suppliers history and persistence', () => {
  const start = async (page: Page, attempt: string, path = 'offers') => {
    const base = fixtures.baseFor('llf-suppliers-off', attempt);
    await page.goto(`${base}/long-local/suppliers/off/${path}`);
    return base;
  };
  const compare = async (page: Page) => {
    for (const id of ['o01', 'o02', 'o03']) await page.locator(`[data-compare="${id}"]`).click();
    await page.locator('#compare').click();
  };

  it('Back from Comparison shows the offers view again', async () => {
    await withPage(async (page) => {
      await start(page, 'suppliers-back-a');
      await compare(page);
      expect(await shown(page, '#comparison')).toBe(true);
      await page.goBack();
      expect(page.url()).toMatch(/\/offers$/);
      expect(await shown(page, '#offers')).toBe(true);
      expect(await shown(page, '#comparison')).toBe(false);
      expect(await shown(page, '#next')).toBe(true);
    });
  }, 60_000);

  it('direct-loading /comparison then Back leads to a visible offers view', async () => {
    await withPage(async (page) => {
      const base = await start(page, 'suppliers-back-b');
      await page.goto(`${base}/long-local/suppliers/off/comparison`);
      expect(await shown(page, '#comparison')).toBe(true);
      await page.goBack();
      expect(page.url()).toMatch(/\/offers$/);
      expect(await shown(page, '#offers')).toBe(true);
      expect(await shown(page, '#comparison')).toBe(false);
    });
  }, 60_000);

  it('Back after reloading /comparison still reaches a visible offers view', async () => {
    await withPage(async (page) => {
      await start(page, 'suppliers-back-c');
      await compare(page);
      await page.reload();
      await page.goBack();
      expect(page.url()).toMatch(/\/offers$/);
      expect(await shown(page, '#offers')).toBe(true);
      expect(await shown(page, '#comparison')).toBe(false);
      expect(await shown(page, '#next')).toBe(true);
    });
  }, 60_000);

  it('a reload of /comparison keeps the compared offers; another attempt starts clean', async () => {
    await withPage(async (page) => {
      await start(page, 'suppliers-persist-a');
      await compare(page);
      await page.reload();
      expect(await shown(page, '#comparison')).toBe(true);
      expect((await ledger(page)).compared).toEqual(['o01', 'o02', 'o03']);
      expect(await page.locator('#comparison-list').innerText()).toContain('o01, o02, o03');
      await start(page, 'suppliers-persist-b');
      expect((await ledger(page)).compared).toEqual([]);
    });
  }, 60_000);
});
