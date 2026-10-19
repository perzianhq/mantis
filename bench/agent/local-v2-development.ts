/**
 * Opt-in local-v2 development selector. Held-out modules are intentionally not
 * imported here: this is the only suite that normal development runs may use.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { V2_DEVELOPMENT_CASES, V2_DEVELOPMENT_CHECKS, gradeV2DevelopmentCase, v2DevelopmentRoute } from '../fixtures-v2-development.js';
import { V2_INTERACTION_DEVELOPMENT_CASES, V2_INTERACTION_DEVELOPMENT_CHECKS, gradeV2InteractionDevelopmentCase, v2InteractionDevelopmentRoute } from '../fixtures-v2-interaction-development.js';
import { V2_READING_WORKFLOW_DEVELOPMENT_CASES, V2_READING_WORKFLOW_DEVELOPMENT_CHECKS, gradeV2ReadingWorkflowDevelopmentCase, v2ReadingWorkflowDevelopmentRoute } from '../fixtures-v2-reading-workflows-development.js';
import type { AgentTask, Category } from './tasks.js';

const esc = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (value: string) => new RegExp(`^\\s*(?:final(?: answer)?:\\s*)?${esc(value).replace(/\\ /g, '\\s+')}\\.?\\s*$`, 'i');
const category = (domain: string): Category => ({
  'dense-tables': 'reading', 'lists-scrolling': 'lists', 'charts-canvas-images': 'visual',
  'forms-embedded-controls': 'forms', 'overlays-shadow-dom': 'overlays', 'spa-navigation-recovery': 'navigation',
  'regions-reading': 'reading', 'long-workflows': 'long',
}[domain] as Category);

const baseTasks: AgentTask[] = V2_DEVELOPMENT_CASES.map((entry) => {
  const answer = [entry.expected.rowKey, entry.expected.columnKey, entry.expected.value].filter(Boolean).join(' | ');
  return { id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt, expect: exact(answer), check: entry.check };
});
const interactionTasks: AgentTask[] = V2_INTERACTION_DEVELOPMENT_CASES.map((entry) => ({ id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt, expect: exact(entry.expected.answer), check: entry.check }));
const readingWorkflowTasks: AgentTask[] = V2_READING_WORKFLOW_DEVELOPMENT_CASES.map((entry) => ({ id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt, expect: exact(entry.expected.answer), check: entry.check }));

export const LOCAL_V2_DEVELOPMENT_TASKS: readonly AgentTask[] = Object.freeze([...baseTasks, ...interactionTasks, ...readingWorkflowTasks]);
export const LOCAL_V2_DEVELOPMENT_CHECKS: FixtureCheckEntry[] = [...V2_DEVELOPMENT_CHECKS, ...V2_INTERACTION_DEVELOPMENT_CHECKS, ...V2_READING_WORKFLOW_DEVELOPMENT_CHECKS];
export const localV2DevelopmentRoute: DevelopmentFixtureRouter = (path) => v2DevelopmentRoute(path) ?? v2InteractionDevelopmentRoute(path) ?? v2ReadingWorkflowDevelopmentRoute(path);
export const LOCAL_V2_DEVELOPMENT_SUITE = 'local-v2-development' as const;
const allCases = [...V2_DEVELOPMENT_CASES, ...V2_INTERACTION_DEVELOPMENT_CASES, ...V2_READING_WORKFLOW_DEVELOPMENT_CASES];
export const LOCAL_V2_DEVELOPMENT_MANIFEST = Object.freeze(allCases.map((entry) => ({ id:entry.id, domain:entry.domain, family:entry.family, structuralVariant:entry.structuralVariant, seed:entry.seed, oracleId:entry.oracleId, nearMissId:'nearMissId' in entry ? entry.nearMissId : entry.nearMiss.id })));
export interface LocalV2AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeLocalV2DevelopmentCase(id: string, answer: string, events: FixtureObservation[]): LocalV2AnswerGrade {
  let result;
  if (V2_DEVELOPMENT_CASES.some((entry) => entry.id === id)) result = gradeV2DevelopmentCase(id, answer, events);
  else if (V2_INTERACTION_DEVELOPMENT_CASES.some((entry) => entry.id === id)) result = gradeV2InteractionDevelopmentCase(id, answer, events);
  else result = gradeV2ReadingWorkflowDevelopmentCase(id, answer, events);
  return result.ok ? { pass:true, requirements:[], failed:[] } : { pass:false, requirements:[], failed:[result.details ?? 'v2 fixture oracle failed'], details:result.details };
}
