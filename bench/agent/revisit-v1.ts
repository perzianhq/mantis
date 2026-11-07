/** Four local tasks that separate answer accuracy from delayed-question workflow evidence. */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { REVISIT_CASES, REVISIT_CHECKS, gradeRevisitCase, revisitRoute } from '../fixtures-revisit-v1.js';
import type { AgentTask } from './tasks.js';

export const REVISIT_V1_SUITE = 'revisit-v1' as const;
const nonEmpty = /\S/;
export const REVISIT_V1_TASKS: readonly AgentTask[] = Object.freeze(REVISIT_CASES.map((entry): AgentTask => ({ id: entry.id, category: entry.category, site: 'local', prompt: entry.prompt, expect: nonEmpty, check: entry.check })));
export const REVISIT_V1_CHECKS: FixtureCheckEntry[] = [...REVISIT_CHECKS];
export const REVISIT_V1_MANIFEST = Object.freeze(REVISIT_CASES.map((entry) => ({ id: entry.id, domain: entry.category, family: entry.family, structuralVariant: entry.structuralVariant, seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMiss.id, origin: 'revisit-v1' })));
export const revisitV1Route: DevelopmentFixtureRouter = (path, context) => revisitRoute(path, context);
export interface RevisitV1AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeRevisitV1Case(id: string, answer: string, events: FixtureObservation[]): RevisitV1AnswerGrade {
  const result = gradeRevisitCase(id, answer, events);
  return result.answerCorrect ? { pass: true, requirements: [], failed: [] } : { pass: false, requirements: [], failed: [result.answerDetails ?? 'answer does not match target value'], details: result.answerDetails };
}
