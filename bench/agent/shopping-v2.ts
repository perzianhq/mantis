import type { DevelopmentFixtureRouter, FixtureObservation } from '../fixtures.js';
import { SHOPPING_V2_CASES, SHOPPING_V2_CHECKS as CHECKS, gradeShoppingV2Case, shoppingV2Route } from '../fixtures-shopping-v2.js';
import type { AgentTask } from './tasks.js';

export const SHOPPING_V2_SUITE = 'shopping-v2' as const;
export const SHOPPING_V2_TASKS: readonly AgentTask[] = Object.freeze(SHOPPING_V2_CASES.map((e) => ({ id: e.id, category: e.category, site: 'local' as const, prompt: e.prompt, expect: /\S/, check: e.check })));
export const SHOPPING_V2_CHECKS = [...CHECKS];
export const SHOPPING_V2_MANIFEST = Object.freeze(SHOPPING_V2_CASES.map((e) => ({ id: e.id, domain: e.category, family: e.family, structuralVariant: e.structuralVariant, seed: e.seed, oracleId: e.oracleId, origin: SHOPPING_V2_SUITE })));
export const shoppingV2AgentRoute: DevelopmentFixtureRouter = (path, context) => shoppingV2Route(path, context);
export function gradeShoppingV2Answer(id: string, answer: string, events: FixtureObservation[]): { pass: boolean; requirements: []; failed: string[]; details?: string } {
  const result = gradeShoppingV2Case(id, answer, events);
  const pass = result.recommendationCorrect && /\S/.test(answer);
  return { pass, requirements: [], failed: pass ? [] : [result.details ?? 'shopping recommendation failed'], ...(pass ? {} : { details: result.details }) };
}

interface ReportRow { task: string; approach: string; valid: boolean; ok: boolean; toolCalls: number; shopping?: { recommendationCorrect: boolean; visitsComplete: boolean } }
export function shoppingV2Summary(rows: readonly ReportRow[]) {
  const groups = new Map<string, { task: string; approach: string; runs: number; correct: number; recommendationCorrect: number; visitsComplete: number; toolCalls: number }>();
  for (const row of rows.filter((row) => row.valid)) {
    const key = `${row.task}:${row.approach}`;
    const group = groups.get(key) ?? { task: row.task, approach: row.approach, runs: 0, correct: 0, recommendationCorrect: 0, visitsComplete: 0, toolCalls: 0 };
    group.runs++; group.correct += Number(row.ok); group.recommendationCorrect += Number(row.shopping?.recommendationCorrect ?? false); group.visitsComplete += Number(row.shopping?.visitsComplete ?? false); group.toolCalls += row.toolCalls;
    groups.set(key, group);
  }
  return [...groups.values()];
}

/** Used by the ordinary agent report; missing grades on attempted failures count as failures. */
export function shoppingV2Markdown(rows: readonly ReportRow[]): string[] {
  if (!rows.some((row) => row.task.startsWith('shopping-v2-'))) return [];
  const shoppingRows = rows.filter((row) => row.task.startsWith('shopping-v2-'));
  const table = (groups: ReturnType<typeof shoppingV2Summary>) => [
    '| Task | Approach | Correct | Recommendation correct | Visits complete | Tool calls |',
    '|---|---|---:|---:|---:|---:|',
    ...groups.map((g) => `| ${g.task} | ${g.approach} | ${g.correct}/${g.runs} | ${g.recommendationCorrect}/${g.runs} | ${g.visitsComplete}/${g.runs} | ${g.toolCalls} |`),
  ];
  return ['## Shopping recommendation and visits', '', ...table(shoppingV2Summary(shoppingRows)), '',
    ...table(shoppingV2Summary(shoppingRows.map((row) => ({ ...row, task: 'All tasks' })))), ''];
}
