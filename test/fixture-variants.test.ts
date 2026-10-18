import { afterEach, expect, it } from 'vitest';
import { chromium } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures, type FixtureObservation } from '../bench/fixtures.js';
import { fixtureVariant } from '../bench/fixture-variants.js';
import { TASKS, gradeTaskAnswer } from '../bench/agent/tasks.js';
import { LONG_EXPECT } from '../bench/fixtures-long.js';

const servers: Array<Awaited<ReturnType<typeof startFixtures>>> = [];
afterEach(async () => { await Promise.all(servers.splice(0).map((server) => server.close())); });

const task = (id: string) => {
  const found = TASKS.find((entry) => entry.id === id);
  if (!found) throw new Error(`missing task ${id}`);
  return found;
};
const event = (path: string, text: string, fixtureState?: unknown): FixtureObservation => ({
  arrival: 0, path, kind: 'settled', documentId: 'seeded', actionId: 1,
  target: { tag: 'button', id: '', name: '', type: '', ariaLabel: '', text: '', href: '', value: '', checked: false },
  controls: {}, text, fixtureState,
});

it('uses seeded task answers, rejecting stale canonical answers', () => {
  const variant = fixtureVariant(20261018);
  const plans = variant.task(task('plans-pick'));
  const faq = variant.task(task('faq-refund'));
  expect(gradeTaskAnswer(plans, 'The confirmation code is BIZ-77.').pass).toBe(true);
  expect(gradeTaskAnswer(plans, 'The confirmation code is PRO-77.').pass).toBe(false);
  expect(gradeTaskAnswer(faq, 'You can ask within 45 days.').pass).toBe(true);
  expect(gradeTaskAnswer(faq, 'You can ask within 30 days.').pass).toBe(false);
});

it('preserves harness attempt URLs and accepts a quoted final answer after prose', () => {
  const variant = fixtureVariant(20261018);
  const attemptUrl = 'http://fixture/faq-refund-mantis-1-1-123';
  expect(variant.task(task('faq-refund')).prompt(attemptUrl)).toContain(attemptUrl);
  const cart = variant.task(task('cookie-cart'));
  expect(gradeTaskAnswer(cart, 'Completed the action.\nANSWER: "Cart updated (1 item)."').pass).toBe(true);
});

it('changes the prompt or answer oracle for every one of the 25 local tasks', () => {
  const variant = fixtureVariant(20261018);
  const local = TASKS.filter((entry) => entry.site === 'local');
  expect(local).toHaveLength(25);
  for (const canonical of local) {
    const seeded = variant.task(canonical);
    const changed = canonical.prompt('http://fixture') !== seeded.prompt('http://fixture') ||
      canonical.expect.source !== seeded.expect.source ||
      JSON.stringify(canonical.answerRequirements ?? []) !== JSON.stringify(seeded.answerRequirements ?? []);
    expect(changed, canonical.id).toBe(true);
  }
});

it('renders seeded data without corrupting unrelated words', async () => {
  const fixtures = await startFixtures({ variant: fixtureVariant(20261018) });
  servers.push(fixtures);
  const page = await fetch(`${fixtures.baseFor('plans-pick', 'seeded-render')}/plans`).then((response) => response.text());
  expect(page).toContain('Business');
  expect(fixtureVariant(20261018).forward('Product Profile')).toBe('Product Profile');
});

it('accepts a seeded terminal shop state through the production checker', async () => {
  const variant = fixtureVariant(20261018);
  const fixtures = await startFixtures({ variant, checks: [{ taskId: 'long-shop', check: task('long-shop').check }] });
  servers.push(fixtures);
  const attemptId = 'seeded-shop'; fixtures.baseFor('long-shop', attemptId);
  const seededState = variant.forward(JSON.stringify(LONG_EXPECT.shop.state));
  await fetch(`${fixtures.base}/__verify/${attemptId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(event('/shop', 'Order #S-5856 confirmed. Total charged: $101.29.', JSON.parse(seededState))) });
  expect((await fixtures.verify('long-shop', attemptId))?.ok).toBe(true);
  const seededTask = variant.task(task('long-shop'));
  expect(gradeTaskAnswer(seededTask, 'Order S-5856; total charged $101.29.').pass).toBe(true);
  expect(gradeTaskAnswer(seededTask, 'Order S-1814; total charged $101.29.').pass).toBe(false);
});

it('accepts a seeded terminal onboarding state through the production checker', async () => {
  const variant = fixtureVariant(20261018);
  const fixtures = await startFixtures({ variant, checks: [{ taskId: 'long-onboard', check: task('long-onboard').check }] });
  servers.push(fixtures);
  const attemptId = 'seeded-onboard'; fixtures.baseFor('long-onboard', attemptId);
  const seededState = variant.forward(JSON.stringify(LONG_EXPECT.onboard.state));
  await fetch(`${fixtures.base}/__verify/${attemptId}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(event('/onboard', 'Workspace W-8780 created for Aster Works (Growth, yearly, 3 invites).', JSON.parse(seededState))) });
  expect((await fixtures.verify('long-onboard', attemptId))?.ok).toBe(true);
  const seededTask = variant.task(task('long-onboard'));
  expect(gradeTaskAnswer(seededTask, 'The workspace ID is W-8780.').pass).toBe(true);
  expect(gradeTaskAnswer(seededTask, 'The workspace ID is W-3248.').pass).toBe(false);
});

it('runs the seeded shop workflow in a real browser', async () => {
  const variant = fixtureVariant(20261018);
  const fixtures = await startFixtures({ variant, checks: [{ taskId: 'long-shop', check: task('long-shop').check }] });
  servers.push(fixtures);
  const browser = await chromium.launch(chromiumExecutable());
  try {
    const page = await browser.newPage(); const attemptId = 'seeded-shop-browser';
    await page.goto(`${fixtures.baseFor('long-shop', attemptId)}/shop`);
    const add = async (name: string, count: number) => {
      await page.fill('#q', name);
      for (let index = 0; index < count; index++) await page.locator(`article[aria-label="${name}"] button`).click();
    };
    await add('Summit Flask', 2); await add('Harbor Satchel', 1); await add('Cedar Wrap', 3); await add('Cotton Smock', 1);
    await page.click('#cartbtn'); await page.fill('#coupon', 'AUTUMN15'); await page.click('#apply'); await page.click('#tocheckout');
    await page.fill('#fn', 'Maya Lin'); await page.fill('#st', '84 Cedar Lane'); await page.fill('#ci', 'Portland'); await page.fill('#zip', '97205'); await page.click('#topay');
    await page.fill('#cn', '4242 4242 4242 4242'); await page.fill('#ex', '12/30'); await page.fill('#cvc', '123'); await page.click('#pay');
    expect((await page.locator('#v-done').innerText()).replace(/\s+/g, ' ')).toContain('Order #S-5856 confirmed. Total charged: $101.29.');
    await page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
    const verified = await fixtures.verify('long-shop', attemptId);
    expect(verified?.ok, verified?.details).toBe(true);
  } finally { await browser.close(); }
});

it('rejects unknown frozen seeds', () => {
  expect(() => fixtureVariant(1)).toThrow('Unknown AGENT_FIXTURE_SEED');
});
