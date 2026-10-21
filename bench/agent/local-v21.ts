/**
 * Permanent local-v2.1 selector.  It preserves local-v2 as the historical
 * 48-case suite and appends six reliability cases as one 54-case main set.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { V21_RELIABILITY_CASES, V21_RELIABILITY_CHECKS, gradeV21ReliabilityCase, matchesV21ReliabilityAnswer, v21ReliabilityRoute } from '../fixtures-v21-reliability.js';
import { LOCAL_V2_CHECKS, LOCAL_V2_MANIFEST, LOCAL_V2_TASKS, gradeLocalV2Case, localV2Route } from './local-v2.js';
import type { AgentTask, Category } from './tasks.js';

const category = (domain: string): Category => ({
  'dense-tables': 'reading', 'lists-scrolling': 'lists', 'charts-canvas-images': 'visual',
  'forms-embedded-controls': 'forms', 'overlays-shadow-dom': 'overlays', 'spa-navigation-recovery': 'navigation',
  'regions-reading': 'reading', 'long-workflows': 'long',
}[domain] as Category);

const reliabilityTasks: AgentTask[] = V21_RELIABILITY_CASES.map((entry) => ({
  id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt,
  expect: (answer) => matchesV21ReliabilityAnswer(entry, answer), check: entry.check,
}));

export const LOCAL_V21_SUITE = 'local-v2.1' as const;
export const LOCAL_V21_TASKS: readonly AgentTask[] = Object.freeze([...LOCAL_V2_TASKS, ...reliabilityTasks]);
export const LOCAL_V21_CHECKS: FixtureCheckEntry[] = [...LOCAL_V2_CHECKS, ...V21_RELIABILITY_CHECKS];
export const LOCAL_V21_MANIFEST = Object.freeze([
  ...LOCAL_V2_MANIFEST.map((entry) => ({ ...entry })),
  ...V21_RELIABILITY_CASES.map((entry) => ({
    id: entry.id, domain: entry.domain, family: entry.family, structuralVariant: entry.structuralVariant,
    seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMiss.id, split: entry.split,
  })),
]);
export const localV21Route: DevelopmentFixtureRouter = (path) => localV2Route(path) ?? v21ReliabilityRoute(path);

export interface LocalV21AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeLocalV21Case(id: string, answer: string, events: FixtureObservation[]): LocalV21AnswerGrade {
  if (LOCAL_V2_TASKS.some((entry) => entry.id === id)) return gradeLocalV2Case(id, answer, events);
  const result = gradeV21ReliabilityCase(id, answer, events);
  return result.ok
    ? { pass: true, requirements: [], failed: [] }
    : { pass: false, requirements: [], failed: [result.details ?? 'v2.1 reliability fixture oracle failed'], details: result.details };
}
