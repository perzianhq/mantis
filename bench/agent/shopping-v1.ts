/**
 * shopping-v1: a small local suite (2 tasks) that asks whether compact observations keep enough preference-relevant
 * detail when information must be carried across several product pages. Fixtures: bench/fixtures-shopping-v1.ts.
 * Graders are deterministic (answer text plus page-reported cart and visited state); no model judge.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { SHOPPING_CASES, SHOPPING_CHECKS, gradeShoppingCase, shoppingRoute } from '../fixtures-shopping-v1.js';
import type { AgentTask } from './tasks.js';

export const SHOPPING_V1_SUITE = 'shopping-v1' as const;

const esc = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const whitespacePattern = (value: string) => value.trim().split(/\s+/).map(esc).join('\\s+');
const exact = (value: string) => new RegExp(`^\\s*(?:final(?:\\s+answer)?:\\s*)?${whitespacePattern(value)}\\.?\\s*$`, 'i');
const nonEmpty = /\S/;
const expectOf = (family: string, answer: string): RegExp => family === 'recall-detail' ? exact(answer) : nonEmpty;

export const SHOPPING_V1_TASKS: readonly AgentTask[] = Object.freeze(SHOPPING_CASES.map((entry): AgentTask => ({
  id: entry.id, category: entry.category, site: 'local', prompt: entry.prompt,
  expect: expectOf(entry.family, entry.expected.answer), check: entry.check,
})));
export const SHOPPING_V1_CHECKS: FixtureCheckEntry[] = [...SHOPPING_CHECKS];
export const SHOPPING_V1_MANIFEST = Object.freeze(SHOPPING_CASES.map((entry) => ({
  id: entry.id, domain: entry.category, family: entry.family, structuralVariant: entry.structuralVariant,
  seed: entry.seed, oracleId: entry.oracleId, nearMissId: entry.nearMiss.id, origin: 'shopping-v1',
})));
export const shoppingV1Route: DevelopmentFixtureRouter = (path) => shoppingRoute(path);

export interface ShoppingV1AnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeShoppingV1Case(id: string, answer: string, events: FixtureObservation[]): ShoppingV1AnswerGrade {
  const result = gradeShoppingCase(id, answer, events);
  return result.ok
    ? { pass: true, requirements: [], failed: [] }
    : { pass: false, requirements: [], failed: [result.details ?? 'shopping fixture oracle failed'], details: result.details };
}
