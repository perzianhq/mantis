/**
 * Full local-v2 selector. This is the only adapter that combines the frozen
 * development split with the previously isolated held-out cases.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { V2_REMAINING_HELDOUT_CASES, V2_REMAINING_HELDOUT_CHECKS, gradeV2RemainingHeldoutCase, v2RemainingHeldoutRoute } from '../fixtures-v2-remaining-heldout.js';
import { V2_READING_WORKFLOW_HELDOUT_CASES, V2_READING_WORKFLOW_HELDOUT_CHECKS, gradeV2ReadingWorkflowHeldoutCase, v2ReadingWorkflowHeldOutRoute } from '../fixtures-v2-reading-workflows-heldout.js';
import { LOCAL_V2_DEVELOPMENT_CHECKS, LOCAL_V2_DEVELOPMENT_MANIFEST, LOCAL_V2_DEVELOPMENT_TASKS, gradeLocalV2DevelopmentCase, localV2DevelopmentRoute } from './local-v2-development.js';
import type { AgentTask, Category } from './tasks.js';

const esc = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (value: string) => new RegExp(`^\\s*(?:final(?: answer)?:\\s*)?${esc(value).replace(/\\ /g, '\\s+')}\\.?\\s*$`, 'i');
const category = (domain: string): Category => ({
  'dense-tables': 'reading', 'lists-scrolling': 'lists', 'charts-canvas-images': 'visual',
  'forms-embedded-controls': 'forms', 'overlays-shadow-dom': 'overlays', 'spa-navigation-recovery': 'navigation',
  'regions-reading': 'reading', 'long-workflows': 'long',
}[domain] as Category);

const remainingTasks: AgentTask[] = V2_REMAINING_HELDOUT_CASES.map((entry) => ({
  id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt, expect: exact(entry.expected.answer), check: entry.check,
}));
const readingWorkflowTasks: AgentTask[] = V2_READING_WORKFLOW_HELDOUT_CASES.map((entry) => ({
  id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt, expect: exact(entry.expected.answer), check: entry.check,
}));

export const LOCAL_V2_SUITE = 'local-v2' as const;
export const LOCAL_V2_TASKS: readonly AgentTask[] = Object.freeze([...LOCAL_V2_DEVELOPMENT_TASKS, ...remainingTasks, ...readingWorkflowTasks]);
export const LOCAL_V2_CHECKS: FixtureCheckEntry[] = [...LOCAL_V2_DEVELOPMENT_CHECKS, ...V2_REMAINING_HELDOUT_CHECKS, ...V2_READING_WORKFLOW_HELDOUT_CHECKS];
export const LOCAL_V2_MANIFEST = Object.freeze([
  ...LOCAL_V2_DEVELOPMENT_MANIFEST.map((entry) => ({ ...entry, split: 'development' as const })),
  ...V2_REMAINING_HELDOUT_CASES.map((entry) => ({ id: entry.id, domain: entry.domain, family: entry.family, structuralVariant: entry.structuralVariant, seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMiss.id, split: entry.split })),
  ...V2_READING_WORKFLOW_HELDOUT_CASES.map((entry) => ({ id: entry.id, domain: entry.domain, family: entry.family, structuralVariant: entry.structuralContract, seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMissId, split: entry.split })),
]);
export const localV2Route: DevelopmentFixtureRouter = (path) => localV2DevelopmentRoute(path) ?? v2RemainingHeldoutRoute(path) ?? v2ReadingWorkflowHeldOutRoute(path);

export interface LocalV2AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeLocalV2Case(id: string, answer: string, events: FixtureObservation[]): LocalV2AnswerGrade {
  let result;
  if (LOCAL_V2_DEVELOPMENT_TASKS.some((entry) => entry.id === id)) {
    return gradeLocalV2DevelopmentCase(id, answer, events);
  }
  if (V2_REMAINING_HELDOUT_CASES.some((entry) => entry.id === id)) result = gradeV2RemainingHeldoutCase(id, answer, events);
  else result = gradeV2ReadingWorkflowHeldoutCase(id, answer, events);
  return result.ok ? { pass: true, requirements: [], failed: [] } : { pass: false, requirements: [], failed: [result.details ?? 'v2 fixture oracle failed'], details: result.details };
}
