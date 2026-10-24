/**
 * long-local-v1: eight long workflows, each with the hazard off and on
 * (16 tasks). The grader compares the full business ledger, not the answer.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { LONG_RECORDS_CASES, longRecordsRoute } from '../fixtures-long-local-records.js';
import { LONG_WORKFLOWS_CASES, longWorkflowsRoute } from '../fixtures-long-local-workflows.js';
import type { AgentTask } from './tasks.js';

export const LONG_LOCAL_V1_SUITE = 'long-local-v1' as const;

type LongCase = (typeof LONG_RECORDS_CASES)[number];
export const LONG_LOCAL_V1_CASES: readonly LongCase[] = Object.freeze([...LONG_RECORDS_CASES, ...LONG_WORKFLOWS_CASES]);

const BRIEFS: Record<string, string> = {
  basket: 'Order for Grace Hopper. The final cart must hold exactly p01 x2, p13 x1, p25 x3 and p42 x1 (remove anything else). Apply coupon SPRING10. Ship to Grace Hopper, 12 Navy Way, Arlington, 22201 with standard delivery. Pay with the test card 4242 4242 4242 4242, expiry 12/30, CVC 123. Report the order receipt number and the total charged.',
  access: 'Staff access review. Set Staff 08 and Staff 29 to Editor, Staff 16 to Admin and Staff 45 to Viewer. Deactivate Staff 35 and Staff 54. Leave everyone else unchanged and publish the changes. Report the receipt number.',
  suppliers: 'Procurement quote. Filter to category equipment and region EU. Add offers o01 to o06 to the comparison (they span two pages), open the comparison, choose o06 with quantity 10 and save the quote. Report the quote receipt number and the EUR total.',
  retention: 'Retention review. Archive version v2 of d02, v1 of d08 and v3 of d14. Restore v1 of d05. Place a legal hold on d03 and d11. Leave everything else unchanged, then view the summary. Report the receipt number.',
  workspace: 'Create a workspace. Company: Northwind Labs, size 51-200, country DE, VAT DE123456789. Admin: Ada Byron, ada@northwind.test, +49 30 1234567. Plan Growth, billed yearly, with a separate billing email billing@northwind.test. Invite exactly lin@northwind.test as admin, kai@northwind.test as member and taylor@northwind.test as member; remove the pre-filled draft invite. Accept the terms and create the workspace. Report the receipt number.',
  casework: 'Casework triage. Filter the queue to team West. Update c04 to owner Ada and status waiting, c09 to Lin and resolved, c14 to Kai and waiting, c19 to Ada and resolved (c14 and c19 are on page 2). After finishing the edits, go to the summary, use the page Back control (or browser Back) once, then return to queue page 2 and open the Casework summary again so it is saved. Report the receipt number.',
  budgets: 'Publish budgets. Engineering: limit 120000, owner Ada, carry-over on. Sales: limit 80000, owner Lin, carry-over off. Operations: limit 60000, owner Kai, carry-over on. Approval rules: Ben at threshold 30000 with two-factor, Mei at threshold 50000 with two-factor. Review and publish. Report the receipt number.',
  dispatch: 'Dispatch orders. Stage q03 quantity 2 with Post/Ground, q11 quantity 1 with Courier/Express, q19 quantity 3 with Post/Ground and q27 quantity 2 with Courier/Express. Open the outbound view and dispatch them. Report the receipt number.',
};

const expectedReceipt = (entry: LongCase): string | undefined => {
  const e = entry.expected as { receipt?: string; workspace?: { receipt?: string } };
  return e.receipt ?? e.workspace?.receipt;
};

/** The reply must carry the receipt, and the money total where the task asks for one. */
const answerPattern = (entry: LongCase): RegExp => {
  const receipt = expectedReceipt(entry);
  const receiptRe = receipt ? receipt.replace(/[-]/g, '\\-') : entry.answer.receiptPattern.replace(/^\^|\$$/g, '');
  const total = entry.name === 'basket' ? '101\\.29' : entry.name === 'suppliers' ? '870(?:\\.00)?' : null;
  return total ? new RegExp(`(?=[\\s\\S]*\\b${receiptRe}\\b)(?=[\\s\\S]*${total})`) : new RegExp(`\\b${receiptRe}\\b`);
};

export const LONG_LOCAL_V1_TASKS: readonly AgentTask[] = Object.freeze(LONG_LOCAL_V1_CASES.map((entry): AgentTask => ({
  id: entry.id, category: 'long', site: 'local',
  prompt: (base) => `${base}${entry.startPath}\n${BRIEFS[entry.name]}`,
  expect: answerPattern(entry), check: (events) => checkLongLocalV1Case(entry.id, events),
})));
export const LONG_LOCAL_V1_CHECKS: FixtureCheckEntry[] = LONG_LOCAL_V1_CASES.map((entry) => ({ taskId: entry.id, check: (events) => checkLongLocalV1Case(entry.id, events) }));
export const LONG_LOCAL_V1_MANIFEST = Object.freeze(LONG_LOCAL_V1_CASES.map((entry) => ({
  id: entry.id, workflow: entry.name, hazard: entry.variant, seed: entry.seed, devSeed: entry.devSeed,
  referenceActions: entry.referenceActions, nearMiss: entry.nearMiss.name, hazardTrigger: entry.hazard.trigger,
})));
export const longLocalV1Route: DevelopmentFixtureRouter = (path) => longRecordsRoute(path) ?? longWorkflowsRoute(path);

export interface LongLocalAnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
/** The final ledger proves the result; this proves that the variant's exercised hazard was not skipped. */
const targetText = (event: FixtureObservation): string => [
  event.target.id, event.target.name, event.target.ariaLabel, event.target.text,
].filter(Boolean).join(' ');

/** A click only counts when it landed on an actual control, never on a container that merely contains the label. */
const isControlClick = (event: FixtureObservation): boolean =>
  event.kind === 'click' && /^(?:button|a|input|select|textarea)$/i.test(event.target.tag);
const clickOn = (pattern: RegExp) => (events: FixtureObservation[]): boolean =>
  events.some((event) => isControlClick(event) && pattern.test(targetText(event)));
const operationIs = (event: FixtureObservation, operationId: string): boolean => event.long?.operationId === operationId;
const routeOf = (event: FixtureObservation): string => event.long?.url?.split(/[?#]/, 1)[0] ?? '';
/**
 * Summary visit, then a real backward traversal off the summary route (fragment navigation keeps the route,
 * and a traversal before any summary visit leaves from elsewhere), then the summary reached again.
 */
const caseworkTraversal = (events: FixtureObservation[]): boolean => {
  const firstSummary = events.findIndex((event) => operationIs(event, 'casework-summary'));
  if (firstSummary < 0) return false;
  const traversal = events.findIndex((event, index) => index > firstSummary && event.kind === 'popstate'
    && /^\/long-local\/casework\//.test(routeOf(event)) && !/\/summary$/.test(routeOf(event)));
  return traversal > 0 && events.some((event, index) => index > traversal && operationIs(event, 'casework-summary'));
};

/** Each workflow's events must prove the interaction that exercises its hazard, never just describe it. */
const HAZARD_TRIGGER_EVIDENCE: Record<string, (events: FixtureObservation[]) => boolean> = {
  basket: clickOn(/\badd\b/i),
  access: clickOn(/\bstage\b/i),
  suppliers: (events) => events.some((event) => isControlClick(event) && (event.target.id === 'next' || /^next offers$/i.test(event.target.text))),
  retention: clickOn(/\barchive\b/i),
  workspace: clickOn(/\bremove\b/i),
  casework: caseworkTraversal,
  budgets: (events) => events.some((event) => event.kind === 'click' && /^(engineering|sales|operations)$/i.test(event.target.text)),
  // The late revision only exists after the dispatch click; merely viewing the outbound page proves nothing.
  dispatch: (events) => events.some((event) => isControlClick(event) && (event.target.id === 'dispatch' || /^dispatch staged orders$/i.test(event.target.text))),
};
const hasHazardTriggerEvidence = (entry: LongCase, events: FixtureObservation[]): boolean => {
  const trigger = HAZARD_TRIGGER_EVIDENCE[entry.name];
  return !!trigger && trigger(events);
};
/** The state checker is authoritative and also requires evidence that the fixture hazard was exercised. */
export function checkLongLocalV1Case(id: string, events: FixtureObservation[]): { ok: boolean; details?: string } {
  const entry = LONG_LOCAL_V1_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { ok: false, details: `unknown long-local fixture ${id}` };
  const result = entry.check(events);
  const ok = typeof result === 'boolean' ? result : result.ok;
  const failures = !ok ? [(typeof result === 'object' && result.details) || 'terminal ledger does not match the expected state'] : [];
  if (!hasHazardTriggerEvidence(entry, events)) failures.push(`missing hazard-trigger evidence (${entry.hazard.trigger})`);
  return failures.length ? { ok: false, details: failures.join('; ') } : { ok: true };
}
export function gradeLongLocalV1Case(id: string, answer: string, events: FixtureObservation[]): LongLocalAnswerGrade {
  const entry = LONG_LOCAL_V1_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { pass: false, requirements: [], failed: [`unknown long-local fixture ${id}`] };
  const failed: string[] = [];
  if (!answerPattern(entry).test(answer)) failed.push('answer does not carry the displayed receipt');
  const check = checkLongLocalV1Case(id, events);
  if (!check.ok) failed.push(check.details ?? 'terminal ledger does not match the expected state');
  return failed.length ? { pass: false, requirements: [], failed, details: failed.join('; ') } : { pass: true, requirements: [], failed: [] };
}
