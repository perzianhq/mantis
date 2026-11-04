/**
 * capability-v1: a small local suite (12 tasks) that shows where a browser tool works and fails on dynamic and
 * visual pages. Eight tasks are reused unchanged from local-v2-development (virtualised/paginated/reordered/
 * nested lists and four chart/image variants); four are new synthetic fixtures (bench/fixtures-capability-v1.ts).
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { CAPABILITY_CASES, CAPABILITY_CHECKS, capabilityRoute, gradeCapabilityCase } from '../fixtures-capability-v1.js';
import { LOCAL_V2_DEVELOPMENT_CHECKS, LOCAL_V2_DEVELOPMENT_MANIFEST, LOCAL_V2_DEVELOPMENT_TASKS, gradeLocalV2DevelopmentCase, localV2DevelopmentRoute } from './local-v2-development.js';
import type { AgentTask } from './tasks.js';

export const CAPABILITY_V1_SUITE = 'capability-v1' as const;
export const CAPABILITY_V1_REUSED_IDS = Object.freeze([
  'v2-list-virtual-target', 'v2-list-paginated-filter', 'v2-list-reordered-item', 'v2-list-nested-scroll',
  'v2-chart-svg-series', 'v2-chart-canvas-point', 'v2-chart-image-fact', 'v2-chart-responsive',
] as const);
const reusedIds: readonly string[] = CAPABILITY_V1_REUSED_IDS;

const reusedTasks: AgentTask[] = CAPABILITY_V1_REUSED_IDS.map((id) => {
  const task = LOCAL_V2_DEVELOPMENT_TASKS.find((candidate) => candidate.id === id);
  if (!task) throw new Error(`capability-v1 reuses ${id}, which is missing from local-v2-development`);
  return task;
});
const esc = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (value: string) => new RegExp(`^\\s*(?:final(?: answer)?:\\s*)?${esc(value).replace(/\\ /g, '\\s+')}\\.?\\s*$`, 'i');
const newTasks: AgentTask[] = CAPABILITY_CASES.map((entry) => ({
  id: entry.id, category: entry.category, site: 'local', prompt: entry.prompt,
  expect: exact(entry.expected.answer), check: entry.check,
}));

export const CAPABILITY_V1_TASKS: readonly AgentTask[] = Object.freeze([...reusedTasks, ...newTasks]);
export const CAPABILITY_V1_CHECKS: FixtureCheckEntry[] = [
  ...LOCAL_V2_DEVELOPMENT_CHECKS.filter((entry) => reusedIds.includes(entry.taskId)),
  ...CAPABILITY_CHECKS,
];
export const CAPABILITY_V1_MANIFEST = Object.freeze([
  ...LOCAL_V2_DEVELOPMENT_MANIFEST.filter((entry) => reusedIds.includes(entry.id)).map((entry) => ({ ...entry, origin: 'local-v2-development' })),
  ...CAPABILITY_CASES.map((entry) => ({
    id: entry.id, domain: entry.category, family: entry.family, structuralVariant: entry.structuralVariant,
    seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMiss.id, origin: 'capability-v1',
  })),
]);
export const capabilityV1Route: DevelopmentFixtureRouter = (path) => localV2DevelopmentRoute(path) ?? capabilityRoute(path);

export interface CapabilityV1AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeCapabilityV1Case(id: string, answer: string, events: FixtureObservation[]): CapabilityV1AnswerGrade {
  if (reusedIds.includes(id)) return gradeLocalV2DevelopmentCase(id, answer, events);
  const result = gradeCapabilityCase(id, answer, events);
  return result.ok
    ? { pass: true, requirements: [], failed: [] }
    : { pass: false, requirements: [], failed: [result.details ?? 'capability fixture oracle failed'], details: result.details };
}
