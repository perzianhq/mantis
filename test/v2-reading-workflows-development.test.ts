import { expect, it } from 'vitest';
import { chromium } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import type { FixtureObservation } from '../bench/fixtures.js';
import {
  V2_READING_WORKFLOW_DEVELOPMENT_CASES,
  gradeV2ReadingWorkflowDevelopmentCase,
  v2ReadingWorkflowDevelopmentRoute,
} from '../bench/fixtures-v2-reading-workflows-development.js';

const events = (fixtureState: unknown): FixtureObservation[] => [{ kind: 'settled', fixtureState } as FixtureObservation];

it('defines only four isolated development reading cases and four workflow cases', () => {
  const cases = V2_READING_WORKFLOW_DEVELOPMENT_CASES;
  expect(cases).toHaveLength(8);
  for (const domain of ['regions-reading', 'long-workflows'] as const) {
    const domainCases = cases.filter((entry) => entry.domain === domain);
    expect(domainCases).toHaveLength(4);
    expect(new Set(domainCases.map((entry) => entry.structuralVariant)).size).toBe(4);
    expect(new Set(domainCases.map((entry) => entry.seed)).size).toBe(4);
    expect(new Set(domainCases.map((entry) => entry.oracleId)).size).toBe(4);
    expect(domainCases.every((entry) => entry.split === 'development')).toBe(true);
  }
});

it('accepts every seeded answer only with its exact terminal state', () => {
  for (const entry of V2_READING_WORKFLOW_DEVELOPMENT_CASES) {
    expect(gradeV2ReadingWorkflowDevelopmentCase(entry.id, entry.expected.answer, events(entry.expected.terminalState)), entry.id).toEqual({ ok: true });
  }
});

it('rejects target-adjacent answers and incomplete terminal states', () => {
  for (const entry of V2_READING_WORKFLOW_DEVELOPMENT_CASES) {
    for (const nearAnswer of [`${entry.expected.answer} and another answer`, `Wrong source: ${entry.expected.answer.split(': ').at(-1)}`, `ANSWER: ${entry.expected.answer}`]) {
      expect(gradeV2ReadingWorkflowDevelopmentCase(entry.id, nearAnswer, events(entry.expected.terminalState)).ok, `${entry.nearMissId}: answer`).toBe(false);
    }
    expect(gradeV2ReadingWorkflowDevelopmentCase(entry.id, entry.expected.answer, events({ kind: 'pending' }))).toMatchObject({ ok: false, details: expect.stringMatching(/terminal state/) });
  }
});

it('renders standalone routes without registering them with the shared fixture server', () => {
  for (const entry of V2_READING_WORKFLOW_DEVELOPMENT_CASES) {
    const route = v2ReadingWorkflowDevelopmentRoute(entry.route);
    expect(route?.type).toBe('text/html; charset=utf-8');
    expect(route?.body).toContain('<title>');
    expect(route?.body).toContain('window.__fixtureState');
  }
  expect(v2ReadingWorkflowDevelopmentRoute('/v2/reading/unknown')).toBeNull();
});

const entry = (id: string) => V2_READING_WORKFLOW_DEVELOPMENT_CASES.find((candidate) => candidate.id === id)!;
async function openPage(id: string) {
  const browser = await chromium.launch(chromiumExecutable());
  const page = await browser.newPage();
  await page.setContent(v2ReadingWorkflowDevelopmentRoute(entry(id).route)!.body);
  return { browser, page };
}

it('rejects a wrong comparison in a browser before accepting both catalog visits', async () => {
  const { browser, page } = await openPage('v2-workflow-cross-page-compare');
  try {
    await page.click('#aster'); await page.click('#compare');
    expect(await page.locator('#comparison').isVisible()).toBe(false);
    await page.click('#harbor'); await page.click('#compare'); await page.check('#choose'); await page.click('#purchase'); await page.click('#confirm');
    expect(await page.evaluate(() => (window as any).__fixtureState)).toEqual(entry('v2-workflow-cross-page-compare').expected.terminalState);
  } finally { await browser.close(); }
});

it('requires a persisted choice, the escalation branch, and expanded context in a browser', async () => {
  const saved = await openPage('v2-workflow-save-resume');
  try {
    await saved.page.fill('#title', 'Quarterly plan'); await saved.page.click('#interrupt');
    expect(await saved.page.locator('#interruption').isVisible()).toBe(false);
    await saved.page.click('#save'); await saved.page.click('#interrupt'); await saved.page.click('#resume'); await saved.page.click('#publish');
    expect(await saved.page.evaluate(() => (window as any).__fixtureState)).toEqual(entry('v2-workflow-save-resume').expected.terminalState);
  } finally { await saved.browser.close(); }
  const branch = await openPage('v2-workflow-conditional-branch');
  try {
    await branch.page.check('#escalate'); await branch.page.click('#classify');
    expect(await branch.page.locator('#submit-workflow').isVisible()).toBe(false);
    await branch.page.selectOption('#file', 'case-file'); await branch.page.click('#attach'); await branch.page.check('#approve'); await branch.page.click('#submit-workflow');
    expect(await branch.page.evaluate(() => (window as any).__fixtureState)).toEqual(entry('v2-workflow-conditional-branch').expected.terminalState);
  } finally { await branch.browser.close(); }
  const reading = await openPage('v2-reading-collapsed-context');
  try {
    await reading.page.fill('#submission', entry('v2-reading-collapsed-context').expected.answer); await reading.page.click('#submit');
    expect(await reading.page.evaluate(() => (window as any).__fixtureState)).toMatchObject({ kind: 'reading-pending' });
    await reading.page.locator('#retained').evaluate((node: HTMLDetailsElement) => { node.open = true; node.dispatchEvent(new Event('toggle')); }); await reading.page.click('#read'); await reading.page.click('#submit');
    expect(await reading.page.evaluate(() => (window as any).__fixtureState)).toEqual(entry('v2-reading-collapsed-context').expected.terminalState);
  } finally { await reading.browser.close(); }
});

it('drives the remaining reading and workflow cases through real browser happy and reachable near-miss paths', async () => {
  const cases: Array<[string, (p: any) => Promise<void>, (p: any) => Promise<void>]> = [
    ['v2-reading-landmark-jump', async p => { await p.click('#current'); await p.click('#open'); await p.fill('#submission', entry('v2-reading-landmark-jump').expected.answer); await p.click('#submit'); }, async p => { await p.click('#old'); await p.fill('#submission', entry('v2-reading-landmark-jump').expected.answer); await p.click('#submit'); }],
    ['v2-reading-deep-fact', async p => { await p.click('#appendix'); await p.click('#c31'); await p.fill('#submission', entry('v2-reading-deep-fact').expected.answer); await p.click('#submit'); }, async p => { await p.click('#appendix'); await p.click('#c30'); await p.fill('#submission', entry('v2-reading-deep-fact').expected.answer); await p.click('#submit'); }],
    ['v2-reading-cross-region', async p => { await p.click('#retain'); await p.click('#read'); await p.fill('#submission', entry('v2-reading-cross-region').expected.answer); await p.click('#submit'); }, async p => { await p.fill('#submission', entry('v2-reading-cross-region').expected.answer); await p.click('#submit'); }],
    ['v2-workflow-multi-step-order', async p => { await p.selectOption('#configuration', 'custom'); await p.click('#configure'); await p.check('#express'); await p.click('#shipping'); await p.check('#invoice'); await p.click('#payment'); await p.click('#confirm'); }, async p => { await p.selectOption('#configuration', 'custom'); await p.click('#configure'); await p.check('#express'); await p.click('#shipping'); await p.check('#invoice'); await p.click('#payment'); await p.selectOption('#configuration', ''); await p.click('#confirm'); }],
  ];
  for (const [id, complete, miss] of cases) {
    const happy = await openPage(id); try { await complete(happy.page); expect(await happy.page.evaluate(() => (window as any).__fixtureState)).toEqual(entry(id).expected.terminalState); } finally { await happy.browser.close(); }
    const near = await openPage(id); try { await miss(near.page); expect(await near.page.evaluate(() => (window as any).__fixtureState)).not.toEqual(entry(id).expected.terminalState); } finally { await near.browser.close(); }
  }
});
