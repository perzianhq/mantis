import { afterAll, beforeAll, expect, it } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures, type FixtureVerification } from '../bench/fixtures.js';
import {
  V2_REMAINING_HELDOUT_CASES,
  V2_REMAINING_HELDOUT_CHECKS,
  gradeV2RemainingHeldoutCase,
  v2RemainingHeldoutRoute,
} from '../bench/fixtures-v2-remaining-heldout.js';

it('defines exactly two seeded held-out cases in each remaining v2 domain', () => {
  expect(V2_REMAINING_HELDOUT_CASES).toHaveLength(12);
  for (const domain of ['dense-tables', 'lists-scrolling', 'charts-canvas-images', 'forms-embedded-controls', 'overlays-shadow-dom', 'spa-navigation-recovery']) {
    expect(V2_REMAINING_HELDOUT_CASES.filter((entry) => entry.domain === domain), domain).toHaveLength(2);
  }
  expect(V2_REMAINING_HELDOUT_CASES.every((entry) => entry.split === 'heldout')).toBe(true);
  expect(new Set(V2_REMAINING_HELDOUT_CASES.map((entry) => entry.seed)).size).toBe(12);
  expect(new Set(V2_REMAINING_HELDOUT_CASES.map((entry) => entry.oracleId)).size).toBe(12);
  expect(new Set(V2_REMAINING_HELDOUT_CASES.map((entry) => entry.nearMiss.id)).size).toBe(12);
  expect(V2_REMAINING_HELDOUT_CHECKS.map((entry) => entry.taskId)).toEqual(V2_REMAINING_HELDOUT_CASES.map((entry) => entry.id));
});

it('serves isolated observable pages without changing the shared fixture router', () => {
  for (const entry of V2_REMAINING_HELDOUT_CASES) {
    const served = v2RemainingHeldoutRoute(entry.route);
    expect(served?.type, entry.id).toBe('text/html; charset=utf-8');
    expect(served?.body, entry.id).toContain('<title>');
    expect(served?.body, entry.id).toContain('window.__fixtureState');
  }
  expect(v2RemainingHeldoutRoute('/v2-extra/not-a-case')).toBeNull();
});

let browser: Browser;
let page: Page;
let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => { browser = await chromium.launch(chromiumExecutable()); page = await browser.newPage(); fixtures = await startFixtures({ checks: V2_REMAINING_HELDOUT_CHECKS, developmentRoute: v2RemainingHeldoutRoute }); });
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });
const entry = (id: string) => V2_REMAINING_HELDOUT_CASES.find((item) => item.id === id)!;
async function open(id: string, attempt: string): Promise<void> { await page.goto(`${fixtures.baseFor(id, attempt)}${entry(id).route}`); }
async function verify(id: string, attempt: string, ok: boolean): Promise<FixtureVerification> { await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0); const result = await fixtures.verify(id, attempt); expect(result?.ok, `${id}/${attempt}`).toBe(ok); return result!; }
async function happy(id: string): Promise<void> {
  switch (id.replace('v2-heldout-extra', 'v2-extra')) {
    case 'v2-extra-table-grouped-total': await page.click('#coastal'); await page.click('#total'); return;
    case 'v2-extra-table-recovery': await page.click('#refresh'); await page.click('#repair'); return;
    case 'v2-extra-list-offscreen-action': await page.locator(`[data-id="${entry(id).expected.state.read}"]`).click(); return;
    case 'v2-extra-list-recovery': await page.selectOption('#filter', 'Waiting'); await page.click('#reload'); await page.locator(`[data-id="${entry(id).expected.state.selected}"]`).click(); return;
    case 'v2-extra-chart-legend-filter': await page.click('#south'); await page.click('#north-april'); return;
    case 'v2-extra-chart-recovery': await page.click('#reload'); await page.click('#west'); return;
    case 'v2-extra-form-date-range': await page.fill('#start', String(entry(id).expected.state.start)); await page.fill('#end', String(entry(id).expected.state.end)); await page.click('button[type="submit"], form button'); return;
    case 'v2-extra-form-custom-toggle': await page.click('#pager'); await page.click('#apply'); return;
    case 'v2-extra-overlay-focus-trap': await page.click('#open'); await page.fill('#code', String(entry(id).expected.state.code)); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); return;
    case 'v2-extra-overlay-recovery': await page.click('#open'); await page.click('#open'); await page.click('#pin'); return;
    case 'v2-extra-spa-stale-target': await page.click('#reports'); await page.waitForTimeout(70); await page.click('#download'); return;
    case 'v2-extra-spa-error-boundary': await page.click('#start'); await page.click('#retry'); await page.click('#finish'); return;
  }
}
async function nearMiss(id: string): Promise<void> {
  switch (id.replace('v2-heldout-extra', 'v2-extra')) {
    case 'v2-extra-table-grouped-total': await page.click('#harbor'); await page.click('#total'); return;
    case 'v2-extra-table-recovery': return;
    case 'v2-extra-list-offscreen-action': { const target=String(entry(id).expected.state.read); const number=Number(target.slice(-3)); const neighbor=`alert-${String(number === 1 ? 2 : number - 1).padStart(3, '0')}`; await page.locator(`[data-id="${neighbor}"]`).click(); return; }
    case 'v2-extra-list-recovery': await page.selectOption('#filter', 'Waiting'); await page.locator(`[data-id="${entry(id).expected.state.selected}"]`).click(); return;
    case 'v2-extra-chart-legend-filter': await page.click('#north-april'); return;
    case 'v2-extra-chart-recovery': await page.click('#reload'); return;
    case 'v2-extra-form-date-range': await page.fill('#start', String(entry(id).expected.state.end)); await page.fill('#end', String(entry(id).expected.state.start)); await page.click('button[type="submit"], form button'); return;
    case 'v2-extra-form-custom-toggle': await page.click('#pager'); return;
    case 'v2-extra-overlay-focus-trap': await page.click('#open'); await page.click('#cancel'); return;
    case 'v2-extra-overlay-recovery': await page.click('#open'); return;
    case 'v2-extra-spa-stale-target': await page.click('#reports'); await page.click('#download'); return;
    case 'v2-extra-spa-error-boundary': await page.click('#start'); return;
  }
}
it('proves every held-out completion through Chromium-observed terminal evidence', async () => {
  for (const fixture of V2_REMAINING_HELDOUT_CASES) { const attempt = `${fixture.id}-happy`; await open(fixture.id, attempt); await happy(fixture.id); const result = await verify(fixture.id, attempt, true); expect(gradeV2RemainingHeldoutCase(fixture.id, fixture.expected.answer, result.provenance.events), fixture.id).toEqual({ ok: true }); }
});
it('rejects every case-specific reachable browser near miss', async () => {
  for (const fixture of V2_REMAINING_HELDOUT_CASES) { const attempt = `${fixture.id}-near`; await open(fixture.id, attempt); await nearMiss(fixture.id); await verify(fixture.id, attempt, false); }
});
