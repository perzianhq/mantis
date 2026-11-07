import { afterAll, beforeAll, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures, type FixtureObservation } from '../bench/fixtures.js';
import { answerForRevisitState, gradeRevisitCase, REVISIT_CHARTS, REVISIT_CHART_MONTHS, REVISIT_FULL_LABELS, REVISIT_IDS, REVISIT_ORDER, REVISIT_PRODUCTS, REVISIT_ROUTES, revisitChangeFor, revisitChartPeak, revisitRoute } from '../bench/fixtures-revisit-v1.js';
import { gradeRevisitV1Case, REVISIT_V1_CHECKS, REVISIT_V1_MANIFEST, REVISIT_V1_SUITE, REVISIT_V1_TASKS, revisitV1Route } from '../bench/agent/revisit-v1.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => { browser = await chromium.launch(chromiumExecutable()); page = await browser.newPage({ viewport: { width: 900, height: 600 } }); fixtures = await startFixtures({ checks: REVISIT_V1_CHECKS, developmentRoute: revisitV1Route }); });
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

const ACCORDION = 'revisit-accordion-field'; const VISIBLE = 'revisit-visible-field'; const CHANGING = 'revisit-changing-value'; const VISUAL = 'revisit-visual-value';
const bases = new Map<string, string>();
const baseFor = (task: string, attempt: string) => bases.get(attempt) ?? (() => { const base = fixtures.baseFor(task, attempt); bases.set(attempt, base); return base; })();
const open = async (task: string, attempt: string, route: string) => { await page.goto(`${baseFor(task, attempt)}${route}`); await page.waitForLoadState('domcontentloaded'); };
const state = async (): Promise<Record<string, unknown>> => page.evaluate(() => (window as unknown as { __fixtureState: Record<string, unknown> }).__fixtureState);
const wait = () => page.waitForFunction(() => (window as unknown as { __fixturePending: number }).__fixturePending === 0);
/** Both views of one attempt: `answer` is what regrade/answer grading sees, `full` includes the workflow. */
const verify = async (task: string, attempt: string, answer: string) => { await wait(); const result = await fixtures.verify(task, attempt); const events = result?.provenance.events ?? []; return { answer: gradeRevisitV1Case(task, answer, events), full: gradeRevisitCase(task, answer, events), check: result ? { ok: result.ok, details: result.details } : undefined, events }; };
const expectFailure = async (task: string, attempt: string, answer: string, reason: string) => { const grade = await verify(task, attempt, answer); expect(grade.full.ok, JSON.stringify(grade)).toBe(false); expect(grade.full.details).toBe(reason); return grade; };
const browse = async (task: string, attempt: string, ids: readonly string[] = REVISIT_IDS) => { for (const id of ids) { await open(task, attempt, REVISIT_ROUTES.history); await page.click(`#viewed a[href="p/${id}"]`); await page.waitForURL(new RegExp(`${REVISIT_ROUTES.product(id)}$`)); } };
const showQuestion = async (task: string, attempt: string) => { await open(task, attempt, REVISIT_ROUTES.question); await page.waitForSelector('#question-text', { state: 'attached', timeout: 2000 }).catch(() => undefined); return state(); };
const target = (fixtureState: Record<string, unknown>) => fixtureState.target as { id: string; label: string };
const answer = (fixtureState: Record<string, unknown>) => { const value = answerForRevisitState(fixtureState); if (!value) throw new Error('expected a revealed revisit target'); return value; };
const revisitTarget = async (task: string, attempt: string, fixtureState: Record<string, unknown>, expand: boolean) => { await open(task, attempt, REVISIT_ROUTES.product(target(fixtureState).id)); if (expand) await page.click('#full-specs'); };
const rowOf = (fixtureState: Record<string, unknown>) => Number(target(fixtureState).id.replace('LN-', '')) - 5800;
const questionBody = (task: string, attempt: string) => revisitRoute(REVISIT_ROUTES.question, { taskId: task, attemptId: attempt })?.body ?? '';

it('registers four named tasks and the matching manifest', () => {
  const ids = [ACCORDION, VISIBLE, CHANGING, VISUAL];
  expect(REVISIT_V1_SUITE).toBe('revisit-v1'); expect(REVISIT_V1_TASKS.map((task) => task.id)).toEqual(ids);
  expect(REVISIT_V1_CHECKS.map((entry) => entry.taskId).sort()).toEqual([...ids].sort()); expect(REVISIT_V1_MANIFEST).toHaveLength(4);
  const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/revisit-v1.json', import.meta.url), 'utf8')) as { taskCount: number; tasks: string[] };
  expect(manifest.taskCount).toBe(4); expect(manifest.tasks).toEqual(ids);
});

it('keeps collapsed product fields hidden and serves no answer inventory in any question page', async () => {
  await open(ACCORDION, 'revisit-accordion-field-initial', REVISIT_ROUTES.product(REVISIT_PRODUCTS[0]!.id));
  const text = await page.locator('body').innerText(); for (const [label, value] of Object.entries(REVISIT_PRODUCTS[0]!.full)) { expect(text).not.toContain(label); expect(text).not.toContain(value); }
  for (const task of [ACCORDION, VISIBLE, CHANGING, VISUAL]) {
    const body = questionBody(task, `${task}-x-1-seed-1-1`); expect(body).not.toContain('var PRODUCTS=');
    for (const product of REVISIT_PRODUCTS) for (const value of [...Object.values(product.full), ...Object.values(product.visible)]) expect(body).not.toContain(value);
    expect(body).not.toMatch(/Dock \d[A-D] received/);
  }
});

it('shares the target between approaches for one (task, run) and varies it across runs', () => {
  for (const task of [ACCORDION, VISIBLE, CHANGING, VISUAL]) {
    const id = (approach: string, run: number) => `${task}-${approach}-${run}-1-1700000000${approach.length}-seed-7301-${run}`;
    for (const run of [1, 2, 3]) { const bodies = ['mantis', 'tree', 'screenshot'].map((approach) => questionBody(task, id(approach, run))); expect(new Set(bodies).size).toBe(1); }
    const targets = new Set(Array.from({ length: 12 }, (_, i) => /var T=(\{[^}]*\})/.exec(questionBody(task, id('mantis', i + 1)))?.[1]));
    expect(targets.size, task).toBeGreaterThan(1);
  }
});

it('visible-field control: a correct answer passes without a return visit, a wrong answer fails', async () => {
  const attempt = 'revisit-visible-field-control-seed-730102-1'; await browse(VISIBLE, attempt); const revealed = await showQuestion(VISIBLE, attempt);
  const grade = await verify(VISIBLE, attempt, answer(revealed));
  expect(grade.answer.pass).toBe(true); expect(grade.full.answerCorrect).toBe(true); expect(grade.full.workflowOk).toBe(true); expect(grade.full.ok).toBe(true); expect(grade.full.returned).toBe(false); expect(grade.check?.ok).toBe(true);
  const wrong = 'revisit-visible-field-wrong-seed-730102-2'; await browse(VISIBLE, wrong); await showQuestion(VISIBLE, wrong);
  const bad = await expectFailure(VISIBLE, wrong, 'not the target value', 'answer does not match target value'); expect(bad.answer.pass).toBe(false); expect(bad.full.workflowOk).toBe(true);
  const partial = 'revisit-visible-field-partial-seed-730102-3'; await browse(VISIBLE, partial, REVISIT_IDS.slice(0, 2)); await showQuestion(VISIBLE, partial);
  await expectFailure(VISIBLE, partial, 'anything', 'question page must be opened');
});

it('accordion: requires return and expansion; a memory-only answer fails the workflow but not the answer grade', async () => {
  const attempt = 'revisit-accordion-field-pass-seed-730101-1'; await browse(ACCORDION, attempt); const revealed = await showQuestion(ACCORDION, attempt); await revisitTarget(ACCORDION, attempt, revealed, true);
  const pass = await verify(ACCORDION, attempt, answer(revealed)); expect(pass.full.ok).toBe(true); expect(pass.answer.pass).toBe(true); expect(pass.check?.ok).toBe(true);
  const remembered = 'revisit-accordion-field-memory-seed-730101-2'; await browse(ACCORDION, remembered);
  await open(ACCORDION, remembered, REVISIT_ROUTES.product(REVISIT_IDS[1]!)); await page.click('#full-specs'); await open(ACCORDION, remembered, REVISIT_ROUTES.product(REVISIT_IDS[2]!)); await page.click('#full-specs');
  const memoryQuestion = await showQuestion(ACCORDION, remembered); const memory = await expectFailure(ACCORDION, remembered, answer(memoryQuestion), 'target product must be revisited after question');
  expect(memory.full.answerCorrect).toBe(true); expect(memory.answer.pass).toBe(true); expect(memory.check?.ok).toBe(false);
  const noExpand = 'revisit-accordion-field-noexpand-seed-730101-3'; await browse(ACCORDION, noExpand); const q = await showQuestion(ACCORDION, noExpand); await revisitTarget(ACCORDION, noExpand, q, false);
  await expectFailure(ACCORDION, noExpand, answer(q), 'target specifications must be expanded after question');
  const wrong = 'revisit-accordion-field-wrong-seed-730101-4'; await browse(ACCORDION, wrong); const w = await showQuestion(ACCORDION, wrong); await revisitTarget(ACCORDION, wrong, w, true);
  const bad = await expectFailure(ACCORDION, wrong, 'not the value', 'answer does not match target value'); expect(bad.full.workflowOk).toBe(true); expect(bad.answer.pass).toBe(false);
});

it('validates reported state strictly: kind, family, target, visited ids, question marker', () => {
  const view = (path: string) => ({ page: path, action: 'view' });
  const good = { kind: 'revisit-v1', family: 'accordion-field', visited: [...REVISIT_IDS], questionShownAt: 4, target: { id: REVISIT_IDS[1], label: REVISIT_FULL_LABELS[0] }, events: [...REVISIT_IDS.map((id) => view(REVISIT_ROUTES.product(id))), { page: REVISIT_ROUTES.question, action: 'question-shown' }, view(REVISIT_ROUTES.product(REVISIT_IDS[1]!)), { page: REVISIT_ROUTES.product(REVISIT_IDS[1]!), action: 'expand-specs' }] };
  const events = (fixtureState: unknown) => [{ fixtureState } as FixtureObservation];
  const value = REVISIT_PRODUCTS[1]!.full[REVISIT_FULL_LABELS[0]!]!;
  expect(gradeRevisitCase(ACCORDION, value, events(good)).ok).toBe(true);
  const details = (task: string, fixtureState: unknown, given = value) => gradeRevisitCase(task, given, events(fixtureState));
  expect(details(VISIBLE, good).details).toBe('revisit state family does not match task');
  expect(details(CHANGING, good).details).toBe('revisit state family does not match task');
  expect(details(ACCORDION, { ...good, kind: 'other' }).details).toBe('revisit state kind is invalid');
  expect(details(ACCORDION, { ...good, family: 'nope' }).details).toBe('revisit state family is invalid');
  for (const bad of [null, {}, { id: 'missing', label: REVISIT_FULL_LABELS[0] }, { id: REVISIT_IDS[1], label: 'Not a label' }, { id: REVISIT_IDS[1] }, { id: 7, label: 'x' }, [], 'str']) {
    const result = details(ACCORDION, { ...good, target: bad }); expect(result.ok, JSON.stringify(bad)).toBe(false); expect(result.answerCorrect).toBe(false); expect(result.details).toBe('malformed revisit target');
  }
  expect(details(ACCORDION, { ...good, target: undefined }).ok).toBe(false);
  expect(details(ACCORDION, { ...good, visited: [...REVISIT_IDS.slice(0, 3), 'missing'] }).details).toBe('revisit visited ids are invalid');
  expect(details(ACCORDION, { ...good, visited: [REVISIT_IDS[0], REVISIT_IDS[0]] }).details).toBe('revisit visited ids are invalid');
  expect(details(ACCORDION, { ...good, visited: REVISIT_IDS.slice(0, 3) }).details).toBe('all four viewed products must be opened');
  expect(details(ACCORDION, { ...good, events: 'x' }).details).toBe('revisit events are malformed');
  expect(details(ACCORDION, { ...good, questionShownAt: 0 }).details).toBe('revisit question marker is malformed');
  expect(details(ACCORDION, { ...good, questionShownAt: 99 }).details).toBe('revisit question marker is malformed');
  expect(details(ACCORDION, { ...good, questionShownAt: null }).details).toBe('malformed revisit target');
  expect(details(ACCORDION, { ...good, questionShownAt: null, target: null }).details).toBe('question page must be opened');
  expect(gradeRevisitCase('missing-task', value, events(good)).details).toBe('unknown revisit case');
  expect(gradeRevisitCase(ACCORDION, value, []).ok).toBe(false);
  const changing = { kind: 'revisit-v1', family: 'changing-value', visited: [], questionShownAt: 1, target: { id: 'LN-5842', label: REVISIT_ORDER.label }, events: [view(REVISIT_ROUTES.order), { page: REVISIT_ROUTES.question, action: 'question-shown' }, view(REVISIT_ROUTES.order)] };
  expect(details(CHANGING, changing, 'Dock 7C received').details).toBe('malformed revisit target');
  expect(details(CHANGING, { ...changing, target: { id: 'LN-5860', label: 'Other' } }, 'x').details).toBe('malformed revisit target');
});

it('changing-value page is long, hides the deep row from the first screen and never serves V2 before the reveal', async () => {
  const attempt = 'revisit-changing-value-long-seed-730103-1'; await open(CHANGING, attempt, REVISIT_ROUTES.order);
  const text = await page.locator('body').innerText(); const initial = await state(); expect(initial.questionShownAt).toBeNull();
  const targetRow = Number(/id="target-row"/.test(await page.content()) ? await page.evaluate(() => (document.getElementById('target-row')?.querySelector('strong')?.textContent ?? '').replace('Line LN-', '')) : 0) - 5800;
  const change = revisitChangeFor(targetRow); const rowId = `LN-${5800 + targetRow}`;
  expect(text.indexOf(rowId)).toBeGreaterThan(4000); expect(text.indexOf(rowId)).toBeLessThan(text.length - 1500);
  expect(text.slice(0, 4000)).not.toContain(rowId); expect(text.slice(0, 4000)).not.toContain(change.before);
  expect(await page.locator('#events li').count()).toBeGreaterThanOrEqual(60);
  expect(await page.locator('#target-row').innerText()).toContain(change.before); expect(text).not.toContain(change.after);
  // No page served without the reveal, for any seed, contains the updated value of its target row.
  for (let run = 1; run <= 16; run++) {
    const id = `revisit-changing-value-mantis-${run}-seed-730103-${run}`; const question = questionBody(CHANGING, id);
    const row = Number(/"id":"LN-(\d+)"/.exec(question)?.[1]) - 5800; const after = revisitChangeFor(row).after;
    for (const route of [REVISIT_ROUTES.history, REVISIT_ROUTES.question, REVISIT_ROUTES.order, ...REVISIT_IDS.map(REVISIT_ROUTES.product)]) expect(revisitRoute(route, { taskId: CHANGING, attemptId: id, revealed: false })?.body, `${route} run ${run}`).not.toContain(after);
    expect(revisitRoute(REVISIT_ROUTES.order, { taskId: CHANGING, attemptId: id, revealed: true })?.body).toContain(after);
  }
});

it('changing-value: passes only with V2 after a post-reveal order view; row-seen is informational', async () => {
  const attempt = 'revisit-changing-value-pass-seed-730103-2'; await open(CHANGING, attempt, REVISIT_ROUTES.order); const revealed = await showQuestion(CHANGING, attempt); expect(revealed.questionShownAt).not.toBeNull();
  const change = revisitChangeFor(rowOf(revealed)); await open(CHANGING, attempt, REVISIT_ROUTES.order);
  expect(await page.locator('#events').innerText()).toContain(change.after); expect(await page.locator('#events').innerText()).not.toContain(change.before);
  const unscrolled = await verify(CHANGING, attempt, change.after);
  expect(unscrolled.full.ok, JSON.stringify(unscrolled)).toBe(true); expect(unscrolled.answer.pass).toBe(true); expect(unscrolled.check?.ok).toBe(true); expect(unscrolled.full.returned).toBe(true);
  const scrolled = 'revisit-changing-value-scroll-seed-730103-3'; await open(CHANGING, scrolled, REVISIT_ROUTES.order); const q = await showQuestion(CHANGING, scrolled); await open(CHANGING, scrolled, REVISIT_ROUTES.order);
  await page.locator('#target-row').scrollIntoViewIfNeeded(); await page.waitForFunction(() => (window as unknown as { __fixtureState: { rowSeen: boolean } }).__fixtureState.rowSeen === true);
  const seen = await verify(CHANGING, scrolled, answer(q)); expect(seen.full.ok).toBe(true); expect(typeof seen.full.rowSeen).toBe("boolean"); /* informational: the observer fires after the last posted observation, so the grader may not see it */
});

it('changing-value: stale, near-duplicate, no-return and unopened-question answers fail', async () => {
  const stale = 'revisit-changing-value-stale-seed-730103-4'; await open(CHANGING, stale, REVISIT_ROUTES.order); const sq = await showQuestion(CHANGING, stale); await open(CHANGING, stale, REVISIT_ROUTES.order);
  const g = await expectFailure(CHANGING, stale, revisitChangeFor(rowOf(sq)).before, 'answer is stale (value before the update)'); expect(g.answer.pass).toBe(false); expect(g.answer.failed).toEqual(['answer is stale (value before the update)']);
  const near = 'revisit-changing-value-near-seed-730103-5'; await open(CHANGING, near, REVISIT_ROUTES.order); const nq = await showQuestion(CHANGING, near); await open(CHANGING, near, REVISIT_ROUTES.order);
  const first = await verify(CHANGING, near, revisitChangeFor(rowOf(nq)).near[0]); for (const wrong of revisitChangeFor(rowOf(nq)).near) { const result = gradeRevisitCase(CHANGING, wrong, first.events); expect(result.ok).toBe(false); expect(result.details).toBe("answer does not match target value"); expect(gradeRevisitV1Case(CHANGING, wrong, first.events).pass).toBe(false); }
  const noReturn = 'revisit-changing-value-no-return-seed-730103-6'; await open(CHANGING, noReturn, REVISIT_ROUTES.order); const rq = await showQuestion(CHANGING, noReturn);
  const memory = await expectFailure(CHANGING, noReturn, revisitChangeFor(rowOf(rq)).after, 'order page must be revisited after question'); expect(memory.full.answerCorrect).toBe(true); expect(memory.check?.ok).toBe(false);
  const unopened = 'revisit-changing-value-unopened-seed-730103-7'; await open(CHANGING, unopened, REVISIT_ROUTES.order);
  await expectFailure(CHANGING, unopened, revisitChangeFor(REVISIT_ORDER.firstRow).after, 'question page must be opened');
  const skipped = 'revisit-changing-value-skip-seed-730103-8'; const early = await showQuestion(CHANGING, skipped); expect(early.questionShownAt).toBeNull();
  await open(CHANGING, skipped, REVISIT_ROUTES.order); await expectFailure(CHANGING, skipped, 'x', 'question page must be opened');
});
// ---- visual-value: the answer exists only as drawn shapes ----
const visualAttempt = (name: string) => `revisit-visual-value-${name}-seed-730104-1`;
const visualState = async (attempt: string) => { await browse(VISUAL, attempt); return showQuestion(VISUAL, attempt); };
/** An attempt token for each of the four target products (the target is seeded from the token's seed and run). */
const attemptsByTarget = (): Map<string, string> => { const found = new Map<string, string>(); for (let run = 1; run <= 200 && found.size < REVISIT_IDS.length; run++) { const id = `${VISUAL}-mantis-${run}-seed-730104-${run}`; const targetId = /"id":"(lf-\d+)"/.exec(questionBody(VISUAL, id))?.[1]; if (targetId && !found.has(targetId)) found.set(targetId, id); } return found; };
const chartMarkup = (body: string) => /<div id="returns-chart">([\s\S]*?)<\/div>/.exec(body)?.[1] ?? '';

it('visual-value: every chart has a distinct peak month and a close runner-up', () => {
  const peaks = REVISIT_IDS.map((id) => revisitChartPeak(id)); expect(new Set(peaks).size).toBe(REVISIT_IDS.length);
  for (const id of REVISIT_IDS) { const counts = [...REVISIT_CHARTS[id]!].sort((a, b) => b - a); expect(counts[0]! - counts[1]!).toBeGreaterThan(0); expect(counts[0]! - counts[1]!).toBeLessThanOrEqual(5); expect(REVISIT_CHARTS[id]).toHaveLength(REVISIT_CHART_MONTHS.length); }
  expect(revisitChartPeak('missing')).toBeUndefined();
});

it('visual-value: no served page contains a month label or a text equivalent of a chart, for any seed', () => {
  const answers = [...new Set(REVISIT_IDS.map((id) => revisitChartPeak(id)!))];
  const seen = attemptsByTarget(); expect(seen.size).toBe(REVISIT_IDS.length);
  const attempts = [...seen.values(), ...Array.from({ length: 24 }, (_, i) => `${VISUAL}-tree-${i + 1}-seed-730104-${i + 1}`), `${VISUAL}-adhoc`];
  for (const attempt of attempts) {
    for (const route of [REVISIT_ROUTES.history, REVISIT_ROUTES.question, REVISIT_ROUTES.order, ...REVISIT_IDS.map(REVISIT_ROUTES.product)]) {
      for (const revealed of [false, true]) {
        const body = revisitRoute(route, { taskId: VISUAL, attemptId: attempt, revealed })?.body; expect(body, route).toBeTruthy();
        for (const month of REVISIT_CHART_MONTHS) expect(body, `${route} ${month}`).not.toContain(month);
        for (const month of answers) expect(body, `${route} ${month}`).not.toMatch(new RegExp(`\\b${month}\\b`, 'i'));
      }
    }
    for (const id of REVISIT_IDS) {
      const chart = chartMarkup(revisitRoute(REVISIT_ROUTES.product(id), { taskId: VISUAL, attemptId: attempt })!.body); expect(chart).toContain('<svg');
      expect(chart).not.toMatch(/<text[\s>]|<title|<desc|<img|<canvas|<script|\balt=|\btitle=|data-/i);
      expect(chart.replace(/<[^>]*>/g, '').trim(), 'no text node inside the chart').toBe('');
      expect(chart.match(/aria-label="[^"]*"/g)).toEqual(['aria-label="Returns by month"']);
    }
    expect(questionBody(VISUAL, attempt)).not.toMatch(/"(?:answer|expected|peak|month)"/i);
  }
  // Only the visual family draws a chart.
  for (const task of [ACCORDION, VISIBLE, CHANGING]) expect(revisitRoute(REVISIT_ROUTES.product(REVISIT_IDS[0]!), { taskId: task, attemptId: `${task}-x` })!.body).not.toContain('<svg');
});

it('visual-value: the browser exposes no text for the chart, and the target varies across all four products', async () => {
  await open(VISUAL, visualAttempt('dom'), REVISIT_ROUTES.product(REVISIT_IDS[0]!));
  const dom = await page.evaluate(() => { const chart = document.getElementById('returns-chart')!; const svg = chart.querySelector('svg')!; return { text: chart.textContent?.trim() ?? '', pageText: document.body.innerText, title: document.title, url: location.href, shapes: chart.querySelectorAll('path').length, height: svg.getBoundingClientRect().height }; });
  expect(dom.text).toBe(''); expect(dom.shapes).toBeGreaterThanOrEqual(4); expect(dom.height).toBeGreaterThan(200);
  for (const month of REVISIT_CHART_MONTHS) for (const where of [dom.pageText, dom.title, dom.url]) expect(where).not.toMatch(new RegExp(`\\b${month}\\b`));
  expect(new Set(attemptsByTarget().keys()).size).toBe(REVISIT_IDS.length);
});

it('visual-value: passes with the target peak and a return visit after the question', async () => {
  const attempt = visualAttempt('pass'); const revealed = await visualState(attempt); const id = target(revealed).id;
  expect(target(revealed).label).toBe('Battery returns chart'); expect(answer(revealed)).toBe(revisitChartPeak(id));
  await open(VISUAL, attempt, REVISIT_ROUTES.product(id));
  const pass = await verify(VISUAL, attempt, answer(revealed).toLowerCase());
  expect(pass.full.ok, JSON.stringify(pass)).toBe(true); expect(pass.answer.pass).toBe(true); expect(pass.check?.ok).toBe(true); expect(pass.full.returned).toBe(true);
});

it('visual-value near misses: another product peak, no return visit, fewer than four visits, question never opened', async () => {
  const wrongProduct = visualAttempt('wrong'); const w = await visualState(wrongProduct); await open(VISUAL, wrongProduct, REVISIT_ROUTES.product(target(w).id));
  const otherId = REVISIT_IDS.find((id) => id !== target(w).id)!;
  const wrong = await expectFailure(VISUAL, wrongProduct, revisitChartPeak(otherId)!, "answer is another product's chart value");
  expect(wrong.full.workflowOk).toBe(true); expect(wrong.answer.pass).toBe(false); expect(wrong.check?.ok).toBe(true);
  const nonsenseAttempt = visualAttempt('nonsense'); const n = await visualState(nonsenseAttempt); await open(VISUAL, nonsenseAttempt, REVISIT_ROUTES.product(target(n).id));
  const nonsense = await expectFailure(VISUAL, nonsenseAttempt, 'DEC', 'answer does not match target value'); expect(nonsense.answer.pass).toBe(false);
  const memory = visualAttempt('memory'); const m = await visualState(memory);
  const remembered = await expectFailure(VISUAL, memory, answer(m), 'target product must be revisited after question');
  expect(remembered.full.answerCorrect).toBe(true); expect(remembered.answer.pass).toBe(true); expect(remembered.check?.ok).toBe(false); expect(remembered.full.returned).toBe(false);
  // Viewing only a different product after the question is not a return to the target.
  const elsewhere = visualAttempt('elsewhere'); const e = await visualState(elsewhere); await open(VISUAL, elsewhere, REVISIT_ROUTES.product(REVISIT_IDS.find((id) => id !== target(e).id)!));
  await expectFailure(VISUAL, elsewhere, answer(e), 'target product must be revisited after question');
  const partial = visualAttempt('partial'); await browse(VISUAL, partial, REVISIT_IDS.slice(0, 3)); const p = await showQuestion(VISUAL, partial); expect(p.questionShownAt).toBeNull();
  await expectFailure(VISUAL, partial, 'MAR', 'question page must be opened');
  const unopened = visualAttempt('unopened'); await browse(VISUAL, unopened); await expectFailure(VISUAL, unopened, 'MAR', 'question page must be opened');
});

it('visual-value: strict state validation (fewer than four visits, wrong family, wrong target label or id)', () => {
  const view = (path: string) => ({ page: path, action: 'view' }); const targetId = REVISIT_IDS[2]!; const peak = revisitChartPeak(targetId)!;
  const questionShown = { page: REVISIT_ROUTES.question, action: 'question-shown' };
  const full = { kind: 'revisit-v1', family: 'visual-value', visited: [...REVISIT_IDS], questionShownAt: 4, target: { id: targetId, label: 'Battery returns chart' }, events: [...REVISIT_IDS.map((id) => view(REVISIT_ROUTES.product(id))), questionShown, view(REVISIT_ROUTES.product(targetId))] };
  const grade = (fixtureState: unknown, given: string) => gradeRevisitCase(VISUAL, given, [{ fixtureState } as FixtureObservation]);
  expect(grade(full, peak).ok).toBe(true); expect(grade(full, peak.toLowerCase()).ok).toBe(true);
  const three = { ...full, visited: REVISIT_IDS.slice(0, 3), questionShownAt: 3, events: [...REVISIT_IDS.slice(0, 3).map((id) => view(REVISIT_ROUTES.product(id))), questionShown, view(REVISIT_ROUTES.product(targetId))] };
  expect(grade(three, peak).details).toBe('all four viewed products must be opened');
  expect(grade({ ...full, events: full.events.slice(0, 5) }, peak).details).toBe('target product must be revisited after question');
  expect(grade({ ...full, family: 'accordion-field' }, peak).details).toBe('revisit state family does not match task');
  expect(grade({ ...full, target: { id: targetId, label: 'Weight' } }, peak).details).toBe('malformed revisit target');
  expect(grade({ ...full, target: { id: 'missing', label: 'Battery returns chart' } }, peak).details).toBe('malformed revisit target');
});
