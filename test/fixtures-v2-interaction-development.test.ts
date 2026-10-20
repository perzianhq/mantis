import { afterAll, beforeAll, expect, it } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import {
  V2_INTERACTION_DEVELOPMENT_CASES,
  V2_INTERACTION_DEVELOPMENT_CHECKS,
  gradeV2InteractionDevelopmentCase,
  v2InteractionDevelopmentRoute,
} from '../bench/fixtures-v2-interaction-development.js';
import { startFixtures } from '../bench/fixtures.js';
import type { FixtureVerification } from '../bench/fixtures.js';
import { chromiumExecutable } from '../src/userAgent.js';

it('has four deterministic interaction cases in each development domain', () => {
  expect(V2_INTERACTION_DEVELOPMENT_CASES).toHaveLength(12);
  expect(Object.fromEntries(['forms-embedded-controls', 'overlays-shadow-dom', 'spa-navigation-recovery'].map((domain) => [domain, V2_INTERACTION_DEVELOPMENT_CASES.filter((entry) => entry.domain === domain).length]))).toEqual({
    'forms-embedded-controls': 4,
    'overlays-shadow-dom': 4,
    'spa-navigation-recovery': 4,
  });
  expect(new Set(V2_INTERACTION_DEVELOPMENT_CASES.map((entry) => entry.seed)).size).toBe(12);
  expect(V2_INTERACTION_DEVELOPMENT_CHECKS.map((entry) => entry.taskId)).toEqual(V2_INTERACTION_DEVELOPMENT_CASES.map((entry) => entry.id));
});

it('rejects appended or contradictory interaction final answers', () => {
  const fixture = V2_INTERACTION_DEVELOPMENT_CASES[0]!;
  const events = [{ kind: 'settled', fixtureState: fixture.expected.state }] as any;
  expect(gradeV2InteractionDevelopmentCase(fixture.id, fixture.expected.answer, events)).toEqual({ ok: true });
  expect(gradeV2InteractionDevelopmentCase(fixture.id, `${fixture.expected.answer} Also changed billing alerts.`, events).ok).toBe(false);
});

it('accepts the benchmark ANSWER protocol for every interaction oracle', () => {
  for (const fixture of V2_INTERACTION_DEVELOPMENT_CASES) {
    const events = [{ kind: 'settled', fixtureState: fixture.expected.state }] as any;
    expect(gradeV2InteractionDevelopmentCase(fixture.id, `ANSWER: ${fixture.expected.answer}`, events), fixture.id).toEqual({ ok: true });
  }
});

it('keeps interaction routes opt-in and isolated from the shared fixture router', () => {
  for (const fixture of V2_INTERACTION_DEVELOPMENT_CASES) {
    const served = v2InteractionDevelopmentRoute(fixture.route);
    expect(served?.type, fixture.id).toBe('text/html; charset=utf-8');
    expect(served?.body, fixture.id).toContain('<title>');
  }
  expect(v2InteractionDevelopmentRoute('/v2-interaction/not-a-case')).toBeNull();
});

it('does not register V2 interaction routes unless a caller opts in', async () => {
  const frozen = await startFixtures();
  try {
    expect((await fetch(`${frozen.base}/v2-interaction/forms/preferences`)).status).toBe(404);
  } finally {
    await frozen.close();
  }
});

let browser: Browser;
let page: Page;
let fixtures: Awaited<ReturnType<typeof startFixtures>>;

beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  page = await browser.newPage();
  fixtures = await startFixtures({ checks: V2_INTERACTION_DEVELOPMENT_CHECKS, developmentRoute: v2InteractionDevelopmentRoute });
});

afterAll(async () => {
  await page?.close();
  await browser?.close();
  await fixtures?.close();
});

async function open(caseId: string, attemptId: string): Promise<void> {
  const fixture = V2_INTERACTION_DEVELOPMENT_CASES.find((entry) => entry.id === caseId)!;
  await page.goto(`${fixtures.baseFor(caseId, attemptId)}${fixture.route}`);
}

async function verification(caseId: string, attemptId: string, expected: boolean): Promise<FixtureVerification> {
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
  const result = await fixtures.verify(caseId, attemptId);
  expect(result?.ok, `${caseId}/${attemptId}`).toBe(expected);
  expect(result).not.toBeNull();
  return result!;
}

async function happyPath(caseId: string): Promise<void> {
  switch (caseId) {
    case 'v2-interaction-form-preferences':
      await page.selectOption('#topic', 'Security'); await page.check('#digest'); await page.getByRole('button', { name: 'Save preferences' }).click(); return;
    case 'v2-interaction-form-frame-payment': {
      const frame = page.frameLocator('iframe[title="Secure payment"]');
      await frame.locator('#card').selectOption('7719'); await frame.getByRole('button', { name: 'Confirm card' }).click();
      await expect.poll(() => page.getByRole('status').textContent()).toContain('paid with card ending 7719'); return;
    }
    case 'v2-interaction-form-combobox':
      await page.fill('#region', 'West Ridge'); await page.getByRole('button', { name: 'Assign' }).click(); return;
    case 'v2-interaction-form-validation-recovery':
      await page.getByRole('button', { name: 'Send invite' }).click(); expect(await page.getByRole('alert').textContent()).toBe('Use a northwind.test address.');
      await page.fill('#email', 'ada@northwind.test'); await page.getByRole('button', { name: 'Send invite' }).click(); return;
    case 'v2-interaction-overlay-dialog':
      await page.getByRole('button', { name: 'Use essential only' }).click(); await page.getByRole('button', { name: 'Export report' }).click(); return;
    case 'v2-interaction-overlay-shadow':
      await page.locator('display-density').locator('select').selectOption('Compact'); await page.locator('display-density').getByRole('button', { name: 'Apply density' }).click(); return;
    case 'v2-interaction-overlay-modal':
      await page.getByRole('button', { name: 'Rename project' }).click(); await page.fill('#name', 'Aurora'); await page.getByRole('button', { name: 'Save name' }).click(); return;
    case 'v2-interaction-overlay-toast':
      await page.getByRole('button', { name: 'Archive Q3 plan' }).click(); await page.getByRole('button', { name: 'Undo' }).click(); return;
    case 'v2-interaction-spa-client-route':
      await page.getByRole('link', { name: 'Open Mercury' }).click(); await page.getByRole('button', { name: 'Mark Mercury complete' }).click(); return;
    case 'v2-interaction-spa-history-draft':
      await page.fill('#draft', 'Release notes'); await page.locator('#app').getByRole('link', { name: 'Preview' }).click(); return;
    case 'v2-interaction-spa-route-recovery':
      expect(await page.getByRole('alert').textContent()).toContain('no longer available'); await page.getByRole('link', { name: 'Recover notification settings' }).click();
      await page.check('#sms'); await page.getByRole('button', { name: 'Save notifications' }).click(); return;
    case 'v2-interaction-spa-retry-recovery':
      await page.getByRole('button', { name: 'Sync now' }).click(); expect(await page.getByRole('status').textContent()).toBe('Sync failed. Retry required.');
      expect(await page.getByRole('button', { name: 'Sync now' }).isDisabled()).toBe(true); await page.getByRole('button', { name: 'Retry sync' }).click(); return;
  }
}

async function nearMiss(caseId: string): Promise<void> {
  switch (caseId) {
    case 'v2-interaction-form-preferences':
      await page.selectOption('#topic', 'Security'); await page.check('#digest'); await page.locator('#f').dispatchEvent('change'); return;
    case 'v2-interaction-form-frame-payment':
      await page.frameLocator('iframe[title="Secure payment"]').getByRole('button', { name: 'Confirm card' }).click(); return;
    case 'v2-interaction-form-combobox':
      await page.fill('#region', 'South Harbor'); await page.getByRole('button', { name: 'Assign' }).click(); return;
    case 'v2-interaction-form-validation-recovery':
      await page.getByRole('button', { name: 'Send invite' }).click(); return;
    case 'v2-interaction-overlay-dialog':
      await page.getByRole('button', { name: 'Accept all' }).click(); await page.getByRole('button', { name: 'Export report' }).click(); return;
    case 'v2-interaction-overlay-shadow':
      await page.locator('display-density').getByRole('button', { name: 'Apply density' }).click(); return;
    case 'v2-interaction-overlay-modal':
      await page.getByRole('button', { name: 'Rename project' }).click(); await page.getByRole('button', { name: 'Cancel' }).click(); return;
    case 'v2-interaction-overlay-toast':
      await page.getByRole('button', { name: 'Archive Q3 plan' }).click(); return;
    case 'v2-interaction-spa-client-route':
      await page.getByRole('link', { name: 'Projects' }).click(); return;
    case 'v2-interaction-spa-history-draft':
      await page.locator('#app').getByRole('link', { name: 'Preview' }).click(); return;
    case 'v2-interaction-spa-route-recovery':
      await page.getByRole('link', { name: 'Recover notification settings' }).click(); await page.check('#sms'); return;
    case 'v2-interaction-spa-retry-recovery':
      await page.getByRole('button', { name: 'Sync now' }).click(); return;
  }
}

it('proves every V2 interaction happy path through browser-observed terminal evidence', async () => {
  for (const fixture of V2_INTERACTION_DEVELOPMENT_CASES) {
    const attemptId = `${fixture.id}-happy`;
    await open(fixture.id, attemptId); await happyPath(fixture.id);
    const result = await verification(fixture.id, attemptId, true);
    expect(result.provenance.events.some((event) => event.kind === 'settled' && JSON.stringify(event.fixtureState) === JSON.stringify(fixture.expected.state)), fixture.id).toBe(true);
    expect(gradeV2InteractionDevelopmentCase(fixture.id, fixture.expected.answer, result.provenance.events), fixture.id).toEqual({ ok: true });
  }
});

it('rejects reachable browser near misses rather than fabricated terminal state', async () => {
  for (const fixture of V2_INTERACTION_DEVELOPMENT_CASES) {
    const attemptId = `${fixture.id}-near-miss`;
    await open(fixture.id, attemptId); await nearMiss(fixture.id);
    await verification(fixture.id, attemptId, false);
  }
});

it('records iframe completion from the parent document after the frame message', async () => {
  const fixture = V2_INTERACTION_DEVELOPMENT_CASES.find((entry) => entry.id === 'v2-interaction-form-frame-payment')!;
  const attemptId = 'v2-interaction-frame-parent-observer';
  await open(fixture.id, attemptId);
  const frame = page.frameLocator('iframe[title="Secure payment"]');
  await frame.locator('#card').selectOption('7719'); await frame.getByRole('button', { name: 'Confirm card' }).click();
  const result = await verification(fixture.id, attemptId, true);
  expect(result.provenance.events.some((event) => event.kind === 'settled' && event.target.tag === 'body' && JSON.stringify(event.fixtureState) === JSON.stringify(fixture.expected.state))).toBe(true);
});
