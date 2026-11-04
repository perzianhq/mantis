import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import { CAPABILITY_CASES, CAPABILITY_ROUTES, GREEN_CODE, LIVE_PICKUP_CODE, LIVE_PROCESSING_MS, LIVE_READY_MS, PHOTO_SERIAL, REVISIT_ORDER_CODE, capabilityRoute } from '../bench/fixtures-capability-v1.js';
import { CAPABILITY_V1_CHECKS, CAPABILITY_V1_MANIFEST, CAPABILITY_V1_REUSED_IDS, CAPABILITY_V1_SUITE, CAPABILITY_V1_TASKS, capabilityV1Route, gradeCapabilityV1Case } from '../bench/agent/capability-v1.js';
import { LOCAL_V2_DEVELOPMENT_TASKS } from '../bench/agent/local-v2-development.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  page = await browser.newPage();
  fixtures = await startFixtures({ checks: CAPABILITY_V1_CHECKS, developmentRoute: capabilityV1Route });
});
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

const caseOf = (id: string) => CAPABILITY_CASES.find((entry) => entry.id === id)!;
const drain = () => page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
const open = async (id: string, attempt: string, route = caseOf(id).route) => {
  await page.goto(`${fixtures.baseFor(id, attempt)}${route}`);
  await page.waitForLoadState('domcontentloaded');
};
const verify = async (id: string, attempt: string, answer: string) => {
  await drain();
  const result = await fixtures.verify(id, attempt);
  return gradeCapabilityV1Case(id, answer, result?.provenance.events ?? []);
};

it('registers capability-v1 as the twelve named tasks: eight reused v2 tasks unchanged plus four new ones', () => {
  expect(CAPABILITY_V1_SUITE).toBe('capability-v1');
  const ids = CAPABILITY_V1_TASKS.map((task) => task.id);
  expect(ids).toEqual([...CAPABILITY_V1_REUSED_IDS, 'capability-colour-swatch', 'capability-photo-fact', 'capability-revisit-earlier', 'capability-live-update']);
  expect(new Set(ids).size).toBe(12);
  for (const id of CAPABILITY_V1_REUSED_IDS) expect(CAPABILITY_V1_TASKS.find((task) => task.id === id)).toBe(LOCAL_V2_DEVELOPMENT_TASKS.find((task) => task.id === id));
  expect(CAPABILITY_V1_CHECKS.map((entry) => entry.taskId).sort()).toEqual([...ids].sort());
  expect(CAPABILITY_V1_MANIFEST).toHaveLength(12);
  expect(CAPABILITY_V1_MANIFEST.every((entry) => entry.oracleId.length > 0 && entry.nearMissId.length > 0)).toBe(true);
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/capability-v1.json', import.meta.url), 'utf8')) as { id: string; taskCount: number; tasks: string[] };
  expect(manifest.id).toBe('capability-v1');
  expect(manifest.taskCount).toBe(12);
  expect(manifest.tasks).toEqual(ids);
});

it('routes every capability-v1 page, reused and new, through the one suite router', () => {
  for (const entry of CAPABILITY_CASES) {
    expect(capabilityRoute(entry.route)?.type, entry.id).toBe('text/html; charset=utf-8');
    expect(capabilityV1Route(entry.route)?.body, entry.id).toContain('<title>');
    expect(entry.prompt('http://fixture'), entry.id).toContain(`http://fixture${entry.route}`);
  }
  for (const route of ['/v2/list/virtual', '/v2/list/nested', '/v2/chart/svg', '/v2/chart/image', '/v2/chart/responsive']) expect(capabilityV1Route(route), route).not.toBeNull();
  for (const route of Object.values(CAPABILITY_ROUTES)) expect(capabilityV1Route(route), route).not.toBeNull();
});

it('swatch page names no colour in text, label or title, and only the green variant passes end to end', async () => {
  await open('capability-colour-swatch', 'cap-swatch');
  const swatches = await page.$$eval('.swatch', (nodes) => nodes.map((node) => ({ text: node.textContent, aria: node.getAttribute('aria-label'), title: node.getAttribute('title'), labelledby: node.getAttribute('aria-labelledby') })));
  expect(swatches).toHaveLength(6);
  expect(swatches.every((swatch) => !swatch.text && !swatch.aria && !swatch.title && !swatch.labelledby)).toBe(true);
  const bodyText = await page.evaluate(() => document.body.innerText);
  expect(bodyText).not.toMatch(/\b(?:green|blue|red|orange|purple|grey|gray)\b/i);
  await page.click(`[data-v="${GREEN_CODE}"]`);
  await page.click('#add');
  expect(await page.locator('#cart').textContent()).toContain(GREEN_CODE);
  const graded = await verify('capability-colour-swatch', 'cap-swatch', GREEN_CODE);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);

  // Near miss: the fifth swatch (blue) selected and added, with its own code reported.
  await open('capability-colour-swatch', 'cap-swatch-blue');
  await page.locator('.swatch').nth(4).click();
  await page.click('#add');
  const code = /SW-\d+/.exec(await page.locator('#cart').textContent() ?? '')![0];
  expect(code).not.toBe(GREEN_CODE);
  expect((await verify('capability-colour-swatch', 'cap-swatch-blue', code)).pass).toBe(false);
});

it('photo page shows the serial only inside a PNG: it is absent from text, alt and page source', async () => {
  await open('capability-photo-fact', 'cap-photo');
  await page.waitForFunction(() => (document.getElementById('label') as HTMLImageElement).complete);
  const src = await page.getAttribute('#label', 'src');
  expect(src).toMatch(/^data:image\/png;base64,/);
  expect(src!.length).toBeGreaterThan(2000);
  expect(await page.evaluate(() => (document.getElementById('label') as HTMLImageElement).naturalWidth)).toBe(640);
  const served = capabilityRoute(CAPABILITY_ROUTES.photo)!.body;
  expect(served).not.toContain(PHOTO_SERIAL);
  expect(served).not.toContain('48273');
  expect(await page.evaluate(() => document.body.innerText)).not.toContain('48273');
  expect(await page.getAttribute('#label', 'alt')).toBe('Photo of a parcel label');
  const graded = await verify('capability-photo-fact', 'cap-photo', PHOTO_SERIAL);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);
});

it('revisit flow shows the order code on page A only, and passes when it is entered on page D', async () => {
  await open('capability-revisit-earlier', 'cap-revisit');
  expect(await page.textContent('main')).toContain(REVISIT_ORDER_CODE);
  for (const [link, route] of [['Continue to delivery', CAPABILITY_ROUTES.revisitB], ['Continue to review', CAPABILITY_ROUTES.revisitC], ['Continue to verification', CAPABILITY_ROUTES.revisitD]] as const) {
    await page.getByRole('link', { name: link }).click();
    await page.waitForURL(new RegExp(`${route}$`));
    expect(await page.textContent('main'), route).not.toContain(REVISIT_ORDER_CODE);
  }
  await page.fill('#order-code', REVISIT_ORDER_CODE);
  await page.click('button[type="submit"]');
  expect(await page.textContent('#out')).toBe('Verification received.');
  const graded = await verify('capability-revisit-earlier', 'cap-revisit', REVISIT_ORDER_CODE);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);

  // Near miss: jumping straight to the form skips steps 2 and 3.
  await open('capability-revisit-earlier', 'cap-revisit-skip', CAPABILITY_ROUTES.revisitD);
  await page.fill('#order-code', REVISIT_ORDER_CODE);
  await page.click('button[type="submit"]');
  expect((await verify('capability-revisit-earlier', 'cap-revisit-skip', REVISIT_ORDER_CODE)).pass).toBe(false);
});

it('live page gates the action on Ready: an early click collects nothing, a click after Ready yields the code', async () => {
  await open('capability-live-update', 'cap-live-early');
  expect(await page.textContent('#status')).toBe('Pending');
  expect(await page.getAttribute('#collect', 'aria-disabled')).toBe('true');
  await page.click('#collect', { force: true });
  expect(await page.textContent('#out')).toBe('Not ready yet.');
  expect((await verify('capability-live-update', 'cap-live-early', LIVE_PICKUP_CODE)).pass).toBe(false);

  const start = Date.now();
  await open('capability-live-update', 'cap-live');
  await page.waitForFunction(() => document.getElementById('status')?.textContent === 'Processing');
  await page.waitForFunction(() => document.getElementById('status')?.textContent === 'Ready');
  expect(Date.now() - start).toBeGreaterThanOrEqual(LIVE_READY_MS - 500);
  expect(LIVE_PROCESSING_MS).toBeLessThan(LIVE_READY_MS);
  expect(await page.getAttribute('#collect', 'aria-disabled')).toBe('false');
  await page.click('#collect');
  expect(await page.textContent('#out')).toContain(LIVE_PICKUP_CODE);
  const graded = await verify('capability-live-update', 'cap-live', LIVE_PICKUP_CODE);
  expect(graded.pass, JSON.stringify(graded)).toBe(true);
}, 30_000);
