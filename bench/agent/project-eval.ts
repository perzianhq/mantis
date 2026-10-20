/** Isolated adapter for the frozen project-tool A/B holdout. */
import type { FixtureObservation } from '../fixtures.js';
import { PROJECT_EVAL_CASES, PROJECT_EVAL_CHECKS, PROJECT_EVAL_MANIFEST, PROJECT_EVAL_PROTOCOL, gradeProjectEvalCase, projectEvalRoute } from '../project-eval.js';
import type { AgentTask, Category } from './tasks.js';

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = (value: string) => new RegExp(`^\\s*(?:final(?: answer)?:\\s*)?${escape(value).replace(/\\ /g, '\\s+')}\\.?\\s*$`, 'i');
const category = (domain: string): Category => domain === 'table' ? 'reading' : domain === 'feed' ? 'lists' : 'visual';

export const PROJECT_EVAL_SUITE = 'project-eval' as const;
export const PROJECT_EVAL_TASKS: readonly AgentTask[] = Object.freeze(PROJECT_EVAL_CASES.map((entry) => ({
  id: entry.id, category: category(entry.domain), site: 'local', prompt: entry.prompt,
  expect: exact(entry.expected.answer), check: entry.check,
})));
export { PROJECT_EVAL_CHECKS, PROJECT_EVAL_MANIFEST, PROJECT_EVAL_PROTOCOL, projectEvalRoute };

export interface ProjectEvalAnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeProjectEvalAnswer(id: string, answer: string, events: FixtureObservation[]): ProjectEvalAnswerGrade {
  const result = gradeProjectEvalCase(id, answer, events);
  return result.ok ? { pass: true, requirements: [], failed: [] } : { pass: false, requirements: [], failed: [result.details ?? 'project-eval oracle failed'], details: result.details };
}
