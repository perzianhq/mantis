import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { startFixtures, type FixtureVerification } from '../bench/fixtures.js';
import {
  PROJECT_EVAL_CASES,
  PROJECT_EVAL_CHECKS,
  PROJECT_EVAL_MANIFEST,
  PROJECT_EVAL_PROTOCOL,
  gradeProjectEvalCase,
  projectEvalRoute,
  renderProjectEvalFixture,
} from '../bench/project-eval.js';
import { LOCAL_V2_DEVELOPMENT_TASKS } from '../bench/agent/local-v2-development.js';

const browser = new MantisBrowser({ actionTimeoutMs: 1500 });
let fixtures: Awaited<ReturnType<typeof startFixtures>>;
const entry = (id: string) => PROJECT_EVAL_CASES.find((item) => item.id === id)!;
const project = async (selector: string, request: Parameters<MantisBrowser['project']>[1] = {}) => {
  const result = await browser.project({ selector }, request);
  return result.startsWith('error:') ? result : JSON.parse(result) as { fields: string[]; rows: Array<{ cells: Record<string, string>; actions: Array<{ id: number; name: string }> }>; next_cursor: string | null };
};
const buttonId = async (name: string) => {
  const view = await browser.read({ full: true });
  const match = view.match(new RegExp(`#(\\d+) button "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  if (!match) throw new Error(`button ${name} was not found in:\n${view}`);
  return Number(match[1]);
};
const selectId = async (name: string) => {
  const view = await browser.read({ full: true });
  const match = view.match(new RegExp(`#(\\d+) combobox "${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  if (!match) throw new Error(`combobox ${name} was not found in:\n${view}`);
  return Number(match[1]);
};

beforeAll(async () => { fixtures = await startFixtures({ checks: PROJECT_EVAL_CHECKS, developmentRoute: projectEvalRoute }); });
afterAll(async () => { await fixtures?.close(); await browser.close(); });

async function open(id: string, attempt: string): Promise<void> { await browser.open(`${fixtures.baseFor(id, attempt)}${entry(id).route}`); }
async function verify(id: string, attempt: string, wanted: boolean): Promise<FixtureVerification> {
  const result = await fixtures.verify(id, attempt);
  expect(result?.ok, `${id}/${attempt}`).toBe(wanted);
  return result!;
}
async function actionFromVirtual(selector: string, text: string): Promise<void> {
  for (let step = 0; step < 9; step++) {
    const result = await project(selector, { kind:'list', limit:20 });
    if (typeof result === 'string') throw new Error(result);
    const row = result.rows.find((item) => Object.values(item.cells).some((value) => value.includes(text)));
    if (row?.actions[0]) { await browser.click(row.actions[0].id); return; }
    expect(result.rows[0]?.actions[0], `no current list action while seeking ${text}`).toBeTruthy();
    await browser.scroll('down', result.rows[0]!.actions[0]!.id);
  }
  throw new Error(`virtual item ${text} was never rendered`);
}
async function actionFromCurrentList(selector: string, text: string): Promise<void> {
  const result = await project(selector, { kind:'list', limit:20 });
  if (typeof result === 'string') throw new Error(result);
  const row = result.rows.find((item) => Object.values(item.cells).some((value) => value.includes(text)));
  expect(row?.actions[0], `no action for ${text}`).toBeTruthy();
  await browser.click(row!.actions[0]!.id);
}

describe('isolated project-eval holdout', () => {
  it('freezes exactly six fresh cases in the project-eval namespace, outside normal local-v2 selection', async () => {
    expect(PROJECT_EVAL_CASES).toHaveLength(6);
    expect(Object.fromEntries(['table','feed','chart'].map((domain) => [domain, PROJECT_EVAL_CASES.filter((item) => item.domain === domain).length]))).toEqual({ table:2, feed:2, chart:2 });
    expect(PROJECT_EVAL_CASES.every((item) => item.split === 'project-eval' && item.route.startsWith('/project-eval/'))).toBe(true);
    expect(new Set(PROJECT_EVAL_CASES.map((item) => item.seed)).size).toBe(6);
    expect(PROJECT_EVAL_MANIFEST).toHaveLength(6);
    expect(PROJECT_EVAL_PROTOCOL).toMatchObject({ namespace:'project-eval', frozen:true, repeatsPerArm:3, runsPerModel:36, retiredAfterTuning:true });
    expect(PROJECT_EVAL_PROTOCOL.freezeFields).toContain('toolConfig');
    expect(LOCAL_V2_DEVELOPMENT_TASKS.some((task) => task.id.startsWith('project-eval-'))).toBe(false);
    for (const fixture of PROJECT_EVAL_CASES) expect(projectEvalRoute(fixture.route)?.body).toContain('<title>');
    for (const fixture of PROJECT_EVAL_CASES) {
      const fixed = renderProjectEvalFixture(fixture.id);
      expect(fixed).toBe(projectEvalRoute(fixture.route)?.body);
      expect(renderProjectEvalFixture(fixture.id, fixture.seed + 1), `${fixture.id} seed must drive rendered data`).not.toBe(fixed);
    }
    expect(entry('project-eval-table-wide-reorder').prompt('http://fixture')).toContain('Score column');
    expect(entry('project-eval-table-native-pages').prompt('http://fixture')).toContain('Units column');
    const normal = await startFixtures();
    try { expect((await fetch(`${normal.base}/project-eval/table/wide-reorder`)).status).toBe(404); } finally { await normal.close(); }
  });

  it('grades the explicit final answer rather than explanatory prose', async () => {
    const wide = entry('project-eval-table-wide-reorder');
    await open(wide.id, 'eval-answer-marker');
    await browser.click(await buttonId('Sort score descending'));
    const evidence = await verify(wide.id, 'eval-answer-marker', true);
    expect(gradeProjectEvalCase(wide.id, `Sorted the ledger.\n\nANSWER: ${wide.expected.answer}`, evidence.provenance.events)).toEqual({ ok:true });
  });

  it('uses bounded table fields and cursor pagination, while native pages still require their visible control', async () => {
    const wide = entry('project-eval-table-wide-reorder');
    const [wideRecord,,wideScore] = wide.expected.answer.split(' | ');
    await open(wide.id, 'eval-wide-near');
    const unsorted = await project('#ledger', { kind:'table', fields:['Record','Score'] });
    expect(typeof unsorted === 'string' ? unsorted : unsorted.rows.some((row) => row.cells.Record === wideRecord)).toBe(true);
    const wideNear = await verify(wide.id, 'eval-wide-near', false);
    expect(gradeProjectEvalCase(wide.id, wide.nearMiss.answer, wideNear.provenance.events).ok).toBe(false);
    await open(wide.id, 'eval-wide-happy');
    await browser.click(await buttonId('Sort score descending'));
    const first = await project('#ledger', { kind:'table', fields:['Record','Score'], limit:2 });
    expect(first).not.toBeTypeOf('string');
    if (typeof first === 'string') throw new Error(first);
    expect(first.fields).toEqual(['Record','Score']);
    expect(first.next_cursor).toMatch(/^p1:/);
    const second = await project('#ledger', { kind:'table', fields:['Record','Score'], cursor:first.next_cursor! });
    expect(first.rows.some((row) => row.cells.Record === wideRecord && row.cells.Score === wideScore)).toBe(true);
    expect(typeof second === 'string' ? second : second.rows).toHaveLength(2);
    const wideEvidence = await verify(wide.id, 'eval-wide-happy', true);
    expect(gradeProjectEvalCase(wide.id, wide.expected.answer, wideEvidence.provenance.events)).toEqual({ ok:true });
    expect(gradeProjectEvalCase(wide.id, wide.nearMiss.answer, wideEvidence.provenance.events).ok).toBe(false);

    const paged = entry('project-eval-table-native-pages');
    const [pagedBatch,,pagedUnits] = paged.expected.answer.split(' | ');
    await open(paged.id, 'eval-pages-near');
    const before = await project('#batches', { kind:'table' });
    expect(typeof before === 'string' ? before : JSON.stringify(before.rows)).not.toContain(pagedBatch);
    await verify(paged.id, 'eval-pages-near', false);
    await open(paged.id, 'eval-pages-happy');
    await browser.click(await buttonId('Next page'));
    const after = await project('#batches', { kind:'table', fields:['Batch','Units'] });
    expect(typeof after === 'string' ? after : after.rows.map((row) => row.cells)).toContainEqual({ Batch:pagedBatch, Units:pagedUnits });
    const pageEvidence = await verify(paged.id, 'eval-pages-happy', true);
    expect(gradeProjectEvalCase(paged.id, paged.expected.answer, pageEvidence.provenance.events)).toEqual({ ok:true });
    expect(gradeProjectEvalCase(paged.id, paged.nearMiss.answer, pageEvidence.provenance.events).ok).toBe(false);
  });

  it('uses distinct grouped and recycled feed mechanisms with reachable near misses', async () => {
    const grouped = entry('project-eval-feed-nested-grouped');
    const groupedTarget = String(grouped.expected.state.acknowledged);
    const groupedNear = String(grouped.nearMiss.state.acknowledged);
    await open(grouped.id, 'eval-grouped-near'); await browser.select(await selectId('Incident group'), 'South'); await actionFromCurrentList('#inbox', `Incident ${Number(groupedNear.slice(-2))}`);
    const groupedNearEvidence = await verify(grouped.id, 'eval-grouped-near', false);
    expect(gradeProjectEvalCase(grouped.id, grouped.nearMiss.answer, groupedNearEvidence.provenance.events).ok).toBe(false);
    await open(grouped.id, 'eval-grouped-happy'); await browser.select(await selectId('Incident group'), 'South'); await actionFromCurrentList('#inbox', `Incident ${Number(groupedTarget.slice(-2))}`);
    const groupedHappy = await verify(grouped.id, 'eval-grouped-happy', true);
    expect(gradeProjectEvalCase(grouped.id, grouped.expected.answer, groupedHappy.provenance.events)).toEqual({ ok:true });

    const recycled = entry('project-eval-feed-recycled-dispatch');
    const target = `Dispatch ${Number(String(recycled.expected.state.pinned).slice(-2))}`;
    const near = `Dispatch ${Number(String(recycled.nearMiss.state.pinned).slice(-2))}`;
    await open(recycled.id, 'eval-recycled-near'); await actionFromVirtual('#feed', near);
    const nearEvidence = await verify(recycled.id, 'eval-recycled-near', false);
    expect(gradeProjectEvalCase(recycled.id, recycled.nearMiss.answer, nearEvidence.provenance.events).ok).toBe(false);
    await open(recycled.id, 'eval-recycled-happy'); await actionFromVirtual('#feed', target);
    const happy = await verify(recycled.id, 'eval-recycled-happy', true);
    expect(gradeProjectEvalCase(recycled.id, recycled.expected.answer, happy.provenance.events)).toEqual({ ok:true });
  });

  it('does not let project bypass the visible chart reveal or the independent SVG selection workflow', async () => {
    const series = entry('project-eval-chart-long-series');
    const [, seriesWeek, seriesValue] = series.expected.answer.split(' | ');
    await open(series.id, 'eval-series-near');
    expect(await project('#series', { kind:'chart' })).toMatch(/^error: target is not visibly rendered/);
    const seriesNear = await verify(series.id, 'eval-series-near', false);
    expect(gradeProjectEvalCase(series.id, series.nearMiss.answer, seriesNear.provenance.events).ok).toBe(false);
    await open(series.id, 'eval-series-happy');
    await browser.click(await buttonId('Reveal approved series'));
    const first = await project('#series', { kind:'chart', fields:['series','category','value'], limit:30 });
    expect(typeof first === 'string' ? first : first.next_cursor).toMatch(/^p1:/);
    if (typeof first === 'string') throw new Error(first);
    const rest = await project('#series', { kind:'chart', fields:['series','category','value'], cursor:first.next_cursor! });
    expect(typeof rest === 'string' ? rest : rest.rows.some((row) => row.cells.category === seriesWeek && row.cells.value === seriesValue)).toBe(true);
    const seriesEvidence = await verify(series.id, 'eval-series-happy', true);
    expect(gradeProjectEvalCase(series.id, series.expected.answer, seriesEvidence.provenance.events)).toEqual({ ok:true });

    const svg = entry('project-eval-chart-svg-selection');
    const svgValue = svg.expected.answer.match(/(\d+) units/)![1];
    await open(svg.id, 'eval-svg-near');
    const visible = await project('#chart', { kind:'chart', fields:['text'] });
    expect(typeof visible === 'string' ? visible : JSON.stringify(visible.rows)).toContain(`Apr ${svgValue}`);
    const svgNear = await verify(svg.id, 'eval-svg-near', false);
    expect(gradeProjectEvalCase(svg.id, svg.nearMiss.answer, svgNear.provenance.events).ok).toBe(false);
    await open(svg.id, 'eval-svg-happy');
    await browser.click(await buttonId('Select April Meridian'));
    const svgEvidence = await verify(svg.id, 'eval-svg-happy', true);
    expect(gradeProjectEvalCase(svg.id, svg.expected.answer, svgEvidence.provenance.events)).toEqual({ ok:true });
  });
});
