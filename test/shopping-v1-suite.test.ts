import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import {
  SHOPPING_CASES, SHOPPING_CHEAPEST_ID, SHOPPING_CORRECT_ID, SHOPPING_CORRECT_NAME, SHOPPING_DECOY_ID, SHOPPING_DECOY_NAME, SHOPPING_FIRST_MATERIAL,
  SHOPPING_ICON_RATING_ID, SHOPPING_INTERSECTION_ATTRIBUTES, SHOPPING_LAST_MATERIAL, SHOPPING_PREFERENCE_ATTRIBUTES, SHOPPING_RECS, SHOPPING_ROUTES, SHOPPING_VIEWED, SHOPPING_VIEWED_IDS, shoppingAttributes, shoppingRoute,
} from '../bench/fixtures-shopping-v1.js';
import { SHOPPING_V1_CHECKS, SHOPPING_V1_MANIFEST, SHOPPING_V1_SUITE, SHOPPING_V1_TASKS, gradeShoppingV1Case, shoppingV1Route } from '../bench/agent/shopping-v1.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  page = await browser.newPage();
  fixtures = await startFixtures({ checks: SHOPPING_V1_CHECKS, developmentRoute: shoppingV1Route });
});
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

const PICK = 'shopping-pick-from-history';
const RECALL = 'shopping-recall-earlier-detail';
const attemptBases = new Map<string, string>();
const drain = () => page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
const open = async (id: string, attempt: string, route: string) => {
  // baseFor starts a fresh isolated attempt, so keep one base while a test walks several pages.
  const base = attemptBases.get(attempt) ?? fixtures.baseFor(id, attempt);
  attemptBases.set(attempt, base);
  await page.goto(`${base}${route}`);
  await page.waitForLoadState('domcontentloaded');
};
const verify = async (id: string, attempt: string, answer: string) => {
  await drain();
  const result = await fixtures.verify(id, attempt);
  return gradeShoppingV1Case(id, answer, result?.provenance.events ?? []);
};
const expectFailure = async (id: string, attempt: string, answer: string, reason: string) => {
  const graded = await verify(id, attempt, answer);
  expect(graded.pass, JSON.stringify(graded)).toBe(false);
  expect(graded.failed, JSON.stringify(graded)).toContain(reason);
};
/** Opens the history page, then each viewed product by clicking its link; optionally opens the Details panel of the given ids. */
const browseViewed = async (id: string, attempt: string, ids: readonly string[] = SHOPPING_VIEWED_IDS, openDetails: readonly string[] = []) => {
  for (const viewed of ids) {
    await open(id, attempt, SHOPPING_ROUTES.history);
    await page.click(`#viewed a[href="p/${viewed}"]`);
    await page.waitForURL(new RegExp(`${SHOPPING_ROUTES.product(viewed)}$`));
    if (openDetails.includes(viewed)) await page.click('#details-tab');
  }
};
const addToCart = async (id: string, attempt: string, ...recIds: string[]) => {
  await open(id, attempt, SHOPPING_ROUTES.recs);
  for (const rec of recIds) await page.click(`.add[data-id="${rec}"]`);
};

it('registers shopping-v1 as two named tasks with a matching manifest', () => {
  expect(SHOPPING_V1_SUITE).toBe('shopping-v1');
  const ids = SHOPPING_V1_TASKS.map((task) => task.id);
  expect(ids).toEqual([PICK, RECALL]);
  expect(SHOPPING_V1_CHECKS.map((entry) => entry.taskId).sort()).toEqual([...ids].sort());
  expect(SHOPPING_V1_MANIFEST).toHaveLength(2);
  expect(SHOPPING_V1_MANIFEST.every((entry) => entry.oracleId.length > 0 && entry.nearMissId.length > 0 && entry.origin === 'shopping-v1')).toBe(true);
  expect(SHOPPING_V1_TASKS.every((task) => task.site === 'local' && task.category === 'navigation')).toBe(true);
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/shopping-v1.json', import.meta.url), 'utf8')) as { id: string; taskCount: number; tasks: string[]; approaches: string[]; command: string };
  expect(manifest.id).toBe('shopping-v1');
  expect(manifest.taskCount).toBe(2);
  expect(manifest.tasks).toEqual(ids);
  expect(manifest.approaches).toEqual(['mantis', 'tree', 'screenshot']);
  expect(manifest.command).toContain('AGENT_SUITE=shopping-v1');
  // Cart state is authoritative for pick; recall is exact while accepting collapsed whitespace.
  const [pick, recall] = SHOPPING_V1_TASKS;
  expect(pick.expect.test(`Added ${SHOPPING_CORRECT_NAME} rather than ${SHOPPING_DECOY_NAME}.`)).toBe(true);
  expect(pick.expect.test('')).toBe(false);
  expect(recall.expect.test(`Final answer: ${SHOPPING_FIRST_MATERIAL}.`)).toBe(true);
  expect(recall.expect.test(` Final\n answer:\t${SHOPPING_FIRST_MATERIAL.replace(' ', '   ')}. `)).toBe(true);
  expect(recall.expect.test(SHOPPING_LAST_MATERIAL)).toBe(false);
});

it('routes the history, four product and recommendation pages, each with the shared header, nav and footer', () => {
  for (const entry of SHOPPING_CASES) expect(entry.prompt('http://fixture'), entry.id).toContain(`http://fixture${entry.route}`);
  const paths = [SHOPPING_ROUTES.history, SHOPPING_ROUTES.recs, ...SHOPPING_VIEWED_IDS.map((id) => SHOPPING_ROUTES.product(id))];
  expect(paths).toHaveLength(6);
  for (const path of paths) {
    const served = shoppingV1Route(path);
    expect(served?.type, path).toBe('text/html; charset=utf-8');
    expect(served?.body, path).toContain('<title>');
    expect(served?.body, path).toContain('Ridgeline Outfitters');
    expect(served?.body, path).toContain('<nav>');
    expect(served?.body, path).toContain('<footer>');
  }
  expect(shoppingRoute('/shopping/p/rl-9999')).toBeNull();
  expect(shoppingRoute('/shopping/unknown')).toBeNull();
});

it('only all four viewed products isolate the preference; every pair and triple has a decoy that matches its extra shared attributes', () => {
  const attributes = (items: readonly (typeof SHOPPING_VIEWED)[number][]) => SHOPPING_INTERSECTION_ATTRIBUTES.filter((key) =>
    items.every((item) => shoppingAttributes(item)[key] === shoppingAttributes(items[0])[key]));
  const combinations = (size: number) => SHOPPING_VIEWED.flatMap((item, index) =>
    size === 2
      ? SHOPPING_VIEWED.slice(index + 1).map((other) => [item, other] as const)
      : SHOPPING_VIEWED.slice(index + 1).flatMap((second, secondIndex) => SHOPPING_VIEWED.slice(index + secondIndex + 2).map((third) => [item, second, third] as const)));
  const all = attributes(SHOPPING_VIEWED);
  expect(all).toEqual(SHOPPING_PREFERENCE_ATTRIBUTES);
  for (const subset of [...combinations(2), ...combinations(3)]) {
    const shared = attributes(subset);
    expect(shared.length).toBeGreaterThan(all.length);
    expect(all.every((key) => shared.includes(key))).toBe(true);
    expect(SHOPPING_RECS.some((rec) => rec.id !== SHOPPING_CORRECT_ID && shared.every((key) => shoppingAttributes(rec)[key] === shoppingAttributes(subset[0])[key]))).toBe(true);
  }
  // One true attribute is unavailable until the first Details panel is opened.
  expect(SHOPPING_VIEWED[0].details.some((line) => line.includes(SHOPPING_VIEWED[0].colour))).toBe(true);
  expect(shoppingRoute(SHOPPING_ROUTES.product(SHOPPING_VIEWED[0].id))!.body).not.toMatch(/<th scope="row">Colour<\/th>/);
  const newest = SHOPPING_VIEWED.at(-1)!;
  const decoy = SHOPPING_RECS.find((rec) => rec.id === SHOPPING_DECOY_ID)!;
  expect(decoy.name).toBe(SHOPPING_DECOY_NAME);
  expect([decoy.brand, decoy.material]).toEqual([newest.brand, newest.material]);
  const price = (value: string) => Number(value.replace(/[^0-9.]/g, ''));
  const cheapest = [...SHOPPING_RECS].sort((a, b) => price(a.price) - price(b.price))[0];
  expect(cheapest.id).toBe(SHOPPING_CHEAPEST_ID);
});

it('icon-only rating page has no rating text in the served HTML: five identical glyphs, three coloured', async () => {
  const served = shoppingV1Route(SHOPPING_ROUTES.product(SHOPPING_ICON_RATING_ID))!.body;
  expect(served).not.toMatch(/rating|stars?\b|review|out of|\/ ?5/i);
  expect(served).not.toMatch(/\b[1-5]\.0\b/);
  await open(PICK, 'shop-icons', SHOPPING_ROUTES.product(SHOPPING_ICON_RATING_ID));
  const glyphs = await page.$$eval('#glyphs svg', (nodes) => nodes.map((node) => ({ cls: node.getAttribute("class"), d: node.innerHTML, label: node.getAttribute("aria-label") ?? node.getAttribute("title") })));
  expect(glyphs).toHaveLength(5);
  expect(new Set(glyphs.map((glyph) => glyph.d)).size).toBe(1);
  expect(glyphs.filter((glyph) => glyph.cls?.includes("on"))).toHaveLength(3);
  expect(glyphs.every((glyph) => !glyph.label)).toBe(true);
  expect(await page.textContent('#glyphs')).toBe('');
  // The other three viewed pages state the rating as text, so only this one needs the icons.
  for (const item of SHOPPING_VIEWED.filter((entry) => entry.id !== SHOPPING_ICON_RATING_ID)) expect(shoppingV1Route(SHOPPING_ROUTES.product(item.id))!.body, item.id).toMatch(/Rating<\/th><td>\d\.0 \/ 5/);
});

it('first page shows its colour and fabric only inside the Details panel until that panel is opened', async () => {
  const first = SHOPPING_VIEWED[0];
  await open(RECALL, 'shop-details', SHOPPING_ROUTES.product(first.id));
  const before = await page.evaluate(() => document.body.innerText);
  expect(before).not.toContain(first.material);
  expect(before).not.toMatch(/olive/i);
  expect(await page.getAttribute('#details-tab', 'aria-expanded')).toBe('false');
  await page.click('#details-tab');
  expect(await page.textContent('#details-panel')).toContain(first.material);
  expect(await page.textContent('#details-panel')).toMatch(/olive/i);
  // The other three pages never print the first page's fabric; the last page's fabric is a different string.
  for (const item of SHOPPING_VIEWED.slice(1)) expect(shoppingV1Route(SHOPPING_ROUTES.product(item.id))!.body, item.id).not.toContain(first.material);
  expect(SHOPPING_LAST_MATERIAL).not.toBe(first.material);
});

it('pick task: cart of exactly the intended item after opening all four viewed pages passes; cart state tolerates a rejected decoy in the answer', async () => {
  await browseViewed(PICK, 'shop-pick');
  await addToCart(PICK, 'shop-pick', SHOPPING_CORRECT_ID);
  expect(await page.textContent('#cart-count')).toBe('Cart (1)');
  expect(await page.textContent('#cart-list')).toContain(SHOPPING_CORRECT_NAME);
  const graded = await verify(PICK, 'shop-pick', `Added ${SHOPPING_CORRECT_NAME} rather than ${SHOPPING_DECOY_NAME}.`);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);
  // Fresh attempt: an empty answer remains an answer-oracle failure.
  await browseViewed(PICK, 'shop-pick-empty-answer');
  await addToCart(PICK, 'shop-pick-empty-answer', SHOPPING_CORRECT_ID);
  await expectFailure(PICK, 'shop-pick-empty-answer', '', 'answer does not match the shopping oracle');
});

it('pick task near misses: newest-only decoy, no history visit, a partial visit and two items in the cart all fail', async () => {
  await browseViewed(PICK, 'shop-pick-decoy');
  await addToCart(PICK, 'shop-pick-decoy', SHOPPING_DECOY_ID);
  await expectFailure(PICK, 'shop-pick-decoy', SHOPPING_DECOY_NAME, `cart must contain only ${SHOPPING_CORRECT_NAME}`);

  await addToCart(PICK, 'shop-pick-skip', SHOPPING_CORRECT_ID);
  expect(await page.textContent('#cart-list')).toContain(SHOPPING_CORRECT_NAME);
  await expectFailure(PICK, 'shop-pick-skip', SHOPPING_CORRECT_NAME, 'all four viewed products must be opened');

  await browseViewed(PICK, 'shop-pick-partial', SHOPPING_VIEWED_IDS.slice(2));
  await addToCart(PICK, 'shop-pick-partial', SHOPPING_CORRECT_ID);
  await expectFailure(PICK, 'shop-pick-partial', SHOPPING_CORRECT_NAME, 'all four viewed products must be opened');

  await browseViewed(PICK, 'shop-pick-two');
  await addToCart(PICK, 'shop-pick-two', SHOPPING_CORRECT_ID, SHOPPING_CHEAPEST_ID);
  await expectFailure(PICK, 'shop-pick-two', SHOPPING_CORRECT_NAME, `cart must contain only ${SHOPPING_CORRECT_NAME}`);

  await browseViewed(PICK, 'shop-pick-empty');
  await open(PICK, 'shop-pick-empty', SHOPPING_ROUTES.recs);
  await expectFailure(PICK, 'shop-pick-empty', SHOPPING_CORRECT_NAME, `cart must contain only ${SHOPPING_CORRECT_NAME}`);
});

it('recall task: the first page fabric after opening all four pages and its Details panel passes', async () => {
  await browseViewed(RECALL, 'shop-recall', SHOPPING_VIEWED_IDS, [SHOPPING_VIEWED_IDS[0]]);
  const graded = await verify(RECALL, 'shop-recall', SHOPPING_FIRST_MATERIAL);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);
  expect(SHOPPING_V1_TASKS.find((task) => task.id === RECALL)!.expect.test(`Final answer: ${SHOPPING_FIRST_MATERIAL.toLowerCase()}.`)).toBe(true);
});

it('recall task near misses: last-page fabric, a partial answer, skipped pages and an unopened Details panel all fail', async () => {
  await browseViewed(RECALL, 'shop-recall-last', SHOPPING_VIEWED_IDS, [SHOPPING_VIEWED_IDS[0]]);
  await expectFailure(RECALL, 'shop-recall-last', SHOPPING_LAST_MATERIAL, 'answer does not match the shopping oracle');

  await browseViewed(RECALL, 'shop-recall-short', SHOPPING_VIEWED_IDS, [SHOPPING_VIEWED_IDS[0]]);
  await expectFailure(RECALL, 'shop-recall-short', 'Recycled nylon', 'answer does not match the shopping oracle');

  await browseViewed(RECALL, 'shop-recall-verbose', SHOPPING_VIEWED_IDS, [SHOPPING_VIEWED_IDS[0]]);
  await expectFailure(RECALL, 'shop-recall-verbose', `The fabric is ${SHOPPING_FIRST_MATERIAL} and also ${SHOPPING_LAST_MATERIAL}`, 'answer does not match the shopping oracle');

  // Right answer, but only the first page was opened (and its Details panel).
  await browseViewed(RECALL, 'shop-recall-partial', SHOPPING_VIEWED_IDS.slice(0, 1), [SHOPPING_VIEWED_IDS[0]]);
  await expectFailure(RECALL, 'shop-recall-partial', SHOPPING_FIRST_MATERIAL, 'all four viewed products must be opened');

  // Right answer, all four pages opened, but the Details panel was never opened (a guess).
  await browseViewed(RECALL, 'shop-recall-nodetails');
  await expectFailure(RECALL, 'shop-recall-nodetails', SHOPPING_FIRST_MATERIAL, 'first viewed product Details panel must be opened');
});
