import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import { answerForRevisitState, REVISIT_CASES, REVISIT_FULL_LABELS, REVISIT_IDS, REVISIT_PRODUCTS, REVISIT_ROUTES, revisitRoute } from '../bench/fixtures-revisit-v1.js';
import { gradeRevisitV1Case, REVISIT_V1_CHECKS, REVISIT_V1_MANIFEST, REVISIT_V1_SUITE, REVISIT_V1_TASKS, revisitV1Route } from '../bench/agent/revisit-v1.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => { browser = await chromium.launch(chromiumExecutable()); page = await browser.newPage(); fixtures = await startFixtures({ checks: REVISIT_V1_CHECKS, developmentRoute: revisitV1Route }); });
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

const ACCORDION = 'revisit-accordion-field';
const VISIBLE = 'revisit-visible-field';
const bases = new Map<string, string>();
const baseFor = (task: string, attempt: string) => bases.get(attempt) ?? (() => { const base = fixtures.baseFor(task, attempt); bases.set(attempt, base); return base; })();
const open = async (task: string, attempt: string, route: string) => { await page.goto(`${baseFor(task, attempt)}${route}`); await page.waitForLoadState('domcontentloaded'); };
const state = async (): Promise<Record<string, unknown>> => page.evaluate(() => (window as unknown as { __fixtureState: Record<string, unknown> }).__fixtureState);
const wait = () => page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
const verify = async (task: string, attempt: string, answer: string) => { await wait(); const result = await fixtures.verify(task, attempt); return gradeRevisitV1Case(task, answer, result?.provenance.events ?? []); };
const expectFailure = async (task: string, attempt: string, answer: string, reason: string) => { const grade = await verify(task, attempt, answer); expect(grade.pass, JSON.stringify(grade)).toBe(false); expect(grade.failed).toContain(reason); };
const browse = async (task: string, attempt: string, ids: readonly string[] = REVISIT_IDS) => {
  for (const id of ids) { await open(task, attempt, REVISIT_ROUTES.history); await page.click(`#viewed a[href="p/${id}"]`); await page.waitForURL(new RegExp(`${REVISIT_ROUTES.product(id)}$`)); }
};
const showQuestion = async (task: string, attempt: string) => { await open(task, attempt, REVISIT_ROUTES.question); return state(); };
const target = (fixtureState: Record<string, unknown>) => fixtureState.target as { id: string; label: string };
const answer = (fixtureState: Record<string, unknown>) => {
  const value = answerForRevisitState(fixtureState);
  if (!value) throw new Error('expected a revealed revisit target');
  return value;
};
const revisitTarget = async (task: string, attempt: string, fixtureState: Record<string, unknown>, expand: boolean) => {
  await open(task, attempt, REVISIT_ROUTES.product(target(fixtureState).id));
  if (expand) await page.click('#full-specs');
};

it('registers two named tasks and a matching manifest', () => {
  expect(REVISIT_V1_SUITE).toBe('revisit-v1');
  const ids = REVISIT_V1_TASKS.map((task) => task.id);
  expect(ids).toEqual([ACCORDION, VISIBLE]);
  expect(REVISIT_V1_CHECKS.map((entry) => entry.taskId).sort()).toEqual([...ids].sort());
  expect(REVISIT_V1_MANIFEST).toHaveLength(2);
  expect(REVISIT_V1_MANIFEST.every((entry) => entry.origin === 'revisit-v1' && entry.oracleId.length > 0 && entry.nearMissId.length > 0)).toBe(true);
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/revisit-v1.json', import.meta.url), 'utf8')) as { id: string; taskCount: number; tasks: string[]; approaches: string[]; command: string };
  expect(manifest.id).toBe('revisit-v1'); expect(manifest.taskCount).toBe(2); expect(manifest.tasks).toEqual(ids); expect(manifest.approaches).toEqual(['mantis', 'tree', 'screenshot']); expect(manifest.command).toContain('AGENT_SUITE=revisit-v1');
});

it('serves every route with the shared frame, and keeps full specifications out of initial visible text', async () => {
  const paths = [REVISIT_ROUTES.history, REVISIT_ROUTES.question, ...REVISIT_IDS.map(REVISIT_ROUTES.product)];
  expect(paths).toHaveLength(6);
  for (const path of paths) { const served = revisitV1Route(path); expect(served?.type, path).toBe('text/html; charset=utf-8'); expect(served?.body).toContain('Larkfield Supply'); expect(served?.body).toContain('<nav>'); expect(served?.body).toContain('<footer>'); }
  expect(revisitRoute('/revisit/p/missing')).toBeNull(); expect(revisitRoute('/revisit/missing')).toBeNull();
  const product = REVISIT_PRODUCTS[0]!;
  await open(ACCORDION, 'revisit-accordion-field-initial', REVISIT_ROUTES.product(product.id));
  const text = await page.locator('body').innerText();
  for (const [label, value] of Object.entries(product.full)) { expect(text).not.toContain(label); expect(text).not.toContain(value); }
  expect(text).toContain(product.visible.Brand);
});

it('withholds the concrete question until four visits; labels match across products with distinct values and targets are middle products', async () => {
  const attempt = 'revisit-accordion-field-withheld';
  for (const path of [REVISIT_ROUTES.history, ...REVISIT_IDS.slice(0, 3).map(REVISIT_ROUTES.product)]) { await open(ACCORDION, attempt, path); expect(await page.locator('body').innerText()).not.toMatch(/What is the .+ of .+\?/); }
  await open(ACCORDION, attempt, REVISIT_ROUTES.question);
  expect(await page.locator('body').innerText()).toContain('Finish reviewing your recently viewed items first.');
  await open(ACCORDION, attempt, REVISIT_ROUTES.product(REVISIT_IDS[3]!));
  const revealed = await showQuestion(ACCORDION, attempt);
  expect(await page.locator('#question-text').innerText()).toMatch(/^What is the .+ of .+\?$/);
  expect(REVISIT_FULL_LABELS).toHaveLength(12);
  for (const label of REVISIT_FULL_LABELS) {
    expect(REVISIT_PRODUCTS.map((product) => product.full[label]).filter(Boolean)).toHaveLength(4);
    expect(new Set(REVISIT_PRODUCTS.map((product) => product.full[label])).size).toBe(4);
  }
  for (const [task, token] of [[ACCORDION, 'revisit-accordion-field-middle'], [VISIBLE, 'revisit-visible-field-middle']] as const) {
    await browse(task, token); const selected = target(await showQuestion(task, token)); const index = REVISIT_IDS.indexOf(selected.id);
    expect(index).toBeGreaterThan(0); expect(index).toBeLessThan(REVISIT_IDS.length - 1);
  }
  expect(target(revealed).label).toBeDefined();
});

it('accordion task passes only after a post-question revisit and specification expansion', async () => {
  const attempt = 'revisit-accordion-field-pass';
  await browse(ACCORDION, attempt); const revealed = await showQuestion(ACCORDION, attempt); await revisitTarget(ACCORDION, attempt, revealed, true);
  const grade = await verify(ACCORDION, attempt, `Final answer: ${answer(revealed)}.`);
  expect(grade.pass, JSON.stringify(grade)).toBe(true);
});

it('accordion task rejects remembered, wrong-product, incomplete, unexpanded, and unopened-question cases', async () => {
  await browse(ACCORDION, 'revisit-accordion-field-no-return'); const remembered = await showQuestion(ACCORDION, 'revisit-accordion-field-no-return');
  await expectFailure(ACCORDION, 'revisit-accordion-field-no-return', answer(remembered), 'target product must be revisited after question');

  await browse(ACCORDION, 'revisit-accordion-field-wrong'); const wrong = await showQuestion(ACCORDION, 'revisit-accordion-field-wrong'); await revisitTarget(ACCORDION, 'revisit-accordion-field-wrong', wrong, true);
  const other = REVISIT_PRODUCTS.find((product) => product.id !== target(wrong).id)!;
  await expectFailure(ACCORDION, 'revisit-accordion-field-wrong', other.full[target(wrong).label]!, 'answer does not match target value');

  await browse(ACCORDION, 'revisit-accordion-field-short', REVISIT_IDS.slice(0, 3)); await showQuestion(ACCORDION, 'revisit-accordion-field-short');
  await expectFailure(ACCORDION, 'revisit-accordion-field-short', 'anything', 'all four viewed products must be opened');

  await browse(ACCORDION, 'revisit-accordion-field-closed'); const closed = await showQuestion(ACCORDION, 'revisit-accordion-field-closed'); await revisitTarget(ACCORDION, 'revisit-accordion-field-closed', closed, false);
  await expectFailure(ACCORDION, 'revisit-accordion-field-closed', answer(closed), 'target specifications must be expanded after question');

  await browse(ACCORDION, 'revisit-accordion-field-no-question');
  await expectFailure(ACCORDION, 'revisit-accordion-field-no-question', 'anything', 'question page must be opened');
});

it('visible-field control passes after a post-question revisit and rejects one without it', async () => {
  const attempt = 'revisit-visible-field-pass';
  await browse(VISIBLE, attempt); const revealed = await showQuestion(VISIBLE, attempt); await revisitTarget(VISIBLE, attempt, revealed, false);
  expect((await verify(VISIBLE, attempt, answer(revealed))).pass).toBe(true);
  await browse(VISIBLE, 'revisit-visible-field-no-return'); const noReturn = await showQuestion(VISIBLE, 'revisit-visible-field-no-return');
  await expectFailure(VISIBLE, 'revisit-visible-field-no-return', answer(noReturn), 'target product must be revisited after question');
});
