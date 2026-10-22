/**
 * live-long-fixtures: eight long workflows, each with the hazard off and on
 * (16 tasks). The grader compares the full business ledger, not the answer.
 */
import type { DevelopmentFixtureRouter, FixtureCheckEntry, FixtureObservation } from '../fixtures.js';
import { LONG_RECORDS_CASES, longRecordsRoute } from '../fixtures-live-long-records.js';
import { LONG_WORKFLOWS_CASES, longWorkflowsRoute } from '../fixtures-live-long-workflows.js';
import type { AgentTask } from './tasks.js';

export const LIVE_LONG_FIXTURES_SUITE = 'live-long-fixtures' as const;

type LongCase = (typeof LONG_RECORDS_CASES)[number];
export const LIVE_LONG_FIXTURE_CASES: readonly LongCase[] = Object.freeze([...LONG_RECORDS_CASES, ...LONG_WORKFLOWS_CASES]);

const BRIEFS: Record<string, string> = {
  basket: 'Order for Grace Hopper. The final cart must hold exactly p01 x2, p13 x1, p25 x3 and p42 x1 (remove anything else). Apply coupon SPRING10. Ship to Grace Hopper, 12 Navy Way, Arlington, 22201 with standard delivery. Pay with the test card 4242 4242 4242 4242, expiry 12/30, CVC 123. Report the order receipt number and the total charged.',
  access: 'Staff access review. Set Staff 08 and Staff 29 to Editor, Staff 16 to Admin and Staff 45 to Viewer. Deactivate Staff 35 and Staff 54. Leave everyone else unchanged and publish the changes. Report the receipt number.',
  suppliers: 'Procurement quote. Filter to category equipment and region EU. Add offers o01 to o06 to the comparison (they span two pages), open the comparison, choose o06 with quantity 10 and save the quote. Report the quote receipt number and the EUR total.',
  retention: 'Retention review. Archive version v2 of d02, v1 of d08 and v3 of d14. Restore v1 of d05. Place a legal hold on d03 and d11. Leave everything else unchanged, then view the summary. Report the receipt number.',
  workspace: 'Create a workspace. Company: Northwind Labs, size 51-200, country DE, VAT DE123456789. Admin: Ada Byron, ada@northwind.test, +49 30 1234567. Plan Growth, billed yearly, with a separate billing email billing@northwind.test. Invite exactly lin@northwind.test as admin, kai@northwind.test as member and taylor@northwind.test as member; remove the pre-filled draft invite. Accept the terms and create the workspace. Report the receipt number.',
  casework: 'Casework triage. Filter the queue to team West. Update c04 to owner Ada and status waiting, c09 to Lin and resolved, c14 to Kai and waiting, c19 to Ada and resolved (c14 and c19 are on page 2). End on queue page 2 and open the Casework summary so it is saved. Report the receipt number.',
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

export const LIVE_LONG_FIXTURE_TASKS: readonly AgentTask[] = Object.freeze(LIVE_LONG_FIXTURE_CASES.map((entry): AgentTask => ({
  id: entry.id, category: 'long', site: 'local',
  prompt: (base) => `${base}${entry.startPath}\n${BRIEFS[entry.name]}`,
  expect: answerPattern(entry), check: entry.check,
})));
export const LIVE_LONG_FIXTURE_CHECKS: FixtureCheckEntry[] = LIVE_LONG_FIXTURE_CASES.map((entry) => ({ taskId: entry.id, check: entry.check }));
export const LIVE_LONG_FIXTURE_MANIFEST = Object.freeze(LIVE_LONG_FIXTURE_CASES.map((entry) => ({
  id: entry.id, workflow: entry.name, hazard: entry.variant, seed: entry.seed, devSeed: entry.devSeed,
  referenceActions: entry.referenceActions, nearMiss: entry.nearMiss.name, hazardTrigger: entry.hazard.trigger,
})));
export const liveLongFixtureRoute: DevelopmentFixtureRouter = (path) => longRecordsRoute(path) ?? longWorkflowsRoute(path);

export interface LiveLongAnswerGrade { pass: boolean; requirements: []; failed: string[]; details?: string }
export function gradeLiveLongFixtureCase(id: string, answer: string, events: FixtureObservation[]): LiveLongAnswerGrade {
  const entry = LIVE_LONG_FIXTURE_CASES.find((candidate) => candidate.id === id);
  if (!entry) return { pass: false, requirements: [], failed: [`unknown live-long fixture ${id}`] };
  const failed: string[] = [];
  if (!answerPattern(entry).test(answer)) failed.push('answer does not carry the displayed receipt');
  const result = entry.check(events);
  const ok = typeof result === 'boolean' ? result : result.ok;
  if (!ok) failed.push((typeof result === 'object' && result.details) || 'terminal ledger does not match the expected state');
  return failed.length ? { pass: false, requirements: [], failed, details: failed.join('; ') } : { pass: true, requirements: [], failed: [] };
}
