import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import type { Browser } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures, type FixtureObservation } from '../bench/fixtures.js';
import {
  LIVE_LONG_FIXTURE_CASES, LIVE_LONG_FIXTURE_CHECKS, LIVE_LONG_FIXTURE_MANIFEST, LIVE_LONG_FIXTURE_TASKS,
  LIVE_LONG_FIXTURES_SUITE, gradeLiveLongFixtureCase, liveLongFixtureRoute,
} from '../bench/agent/live-long-fixtures.js';

type Entry = (typeof LIVE_LONG_FIXTURE_CASES)[number];

let browser: Browser; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => {
  browser = await chromium.launch(chromiumExecutable());
  fixtures = await startFixtures({ checks: LIVE_LONG_FIXTURE_CHECKS, developmentRoute: liveLongFixtureRoute });
});
afterAll(async () => { await browser?.close(); await fixtures?.close(); });

const receiptOf = (entry: Entry): string => {
  const expected = entry.expected as { receipt?: string; workspace?: { receipt?: string } };
  return (expected.receipt ?? expected.workspace?.receipt)!;
};

/** Replay the reference walkthrough in a fresh page and return the server-side verification. */
async function replay(entry: Entry, attempt: string, steps = entry.walkthrough) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  try {
    const base = fixtures.baseFor(entry.id, attempt);
    for (const step of steps) {
      if (step.op === 'goto') await page.goto(`${base}${step.target}`);
      else if (step.op === 'click') await page.locator(step.target).first().click({ timeout: 5000 });
      else if (step.op === 'type') await page.locator(step.target).first().fill(step.value ?? '', { timeout: 5000 });
      else if (step.op === 'select') await page.locator(step.target).first().selectOption(step.value ?? '', { timeout: 5000 });
      else await page.locator(step.target).first().check({ timeout: 5000 });
    }
    await page.waitForTimeout(900);
    const verification = await fixtures.verify(entry.id, attempt);
    return { verification: verification!, errors };
  } finally { await context.close(); }
}

const lastLong = (events: FixtureObservation[]) => [...events].reverse().find((event) => event.long?.ledger !== undefined)!;
const withLast = (events: FixtureObservation[], patch: (event: FixtureObservation) => FixtureObservation) => {
  const target = lastLong(events);
  return events.map((event) => (event === target ? patch(event) : event));
};

describe('live-long-fixtures selection', () => {
  it('exposes exactly 16 tasks matching the manifest, two variants per workflow', () => {
    expect(LIVE_LONG_FIXTURES_SUITE).toBe('live-long-fixtures');
    expect(LIVE_LONG_FIXTURE_TASKS).toHaveLength(16);
    expect(LIVE_LONG_FIXTURE_CHECKS).toHaveLength(16);
    const manifest = JSON.parse(readFileSync(new URL('../bench/manifests/live-long-fixtures.json', import.meta.url), 'utf8')) as { taskCount: number; tasks: string[] };
    expect(manifest.taskCount).toBe(16);
    expect(manifest.tasks).toEqual(LIVE_LONG_FIXTURE_TASKS.map((task) => task.id));
    const names = ['basket', 'access', 'workspace', 'suppliers', 'retention', 'casework', 'budgets', 'dispatch'];
    expect(LIVE_LONG_FIXTURE_TASKS.map((task) => task.id).sort()).toEqual(names.flatMap((name) => [`llf-${name}-off`, `llf-${name}-on`]).sort());
    expect(LIVE_LONG_FIXTURE_MANIFEST).toHaveLength(16);
    for (const entry of LIVE_LONG_FIXTURE_MANIFEST) expect(entry.nearMiss.length).toBeGreaterThan(0);
  });

  it('serves every start path and keeps task prompts free of the ledger', () => {
    for (const entry of LIVE_LONG_FIXTURE_CASES) {
      expect(liveLongFixtureRoute(entry.startPath)).not.toBeNull();
      const prompt = LIVE_LONG_FIXTURE_TASKS.find((task) => task.id === entry.id)!.prompt('http://x/__attempt/a');
      expect(prompt).toContain(entry.startPath);
      expect(prompt).not.toContain(receiptOf(entry));
    }
  });
});

describe('live-long-fixtures answers', () => {
  it('requires the displayed receipt (and the money total where asked) in the reply', () => {
    for (const entry of LIVE_LONG_FIXTURE_CASES) {
      const task = LIVE_LONG_FIXTURE_TASKS.find((candidate) => candidate.id === entry.id)!;
      const receipt = receiptOf(entry);
      const good = entry.name === 'basket' ? `Receipt ${receipt}, total $101.29` : entry.name === 'suppliers' ? `Quote ${receipt}, total EUR 870.00` : `Receipt ${receipt}`;
      expect((task.expect as RegExp).test(good)).toBe(true);
      expect((task.expect as RegExp).test(good.replace(receipt, 'X-0000'))).toBe(false);
    }
    const basket = LIVE_LONG_FIXTURE_TASKS.find((task) => task.id === 'llf-basket-off')!;
    expect((basket.expect as RegExp).test(`Receipt ${receiptOf(LIVE_LONG_FIXTURE_CASES.find((e) => e.id === 'llf-basket-off')!)} only`)).toBe(false);
  });
});

describe.each(LIVE_LONG_FIXTURE_CASES.map((entry) => [entry.id, entry] as const))('%s', (_id, entry) => {
  it('the reference walkthrough passes the grader, with no page errors', async () => {
    const { verification, errors } = await replay(entry, `${entry.id}-pass`);
    expect(errors).toEqual([]);
    expect(verification.details).toBeUndefined();
    expect(verification.ok).toBe(true);
    const terminal = verification.provenance.longTerminal!;
    expect((terminal.long!.ledger as { receipt?: string }).receipt ?? (terminal.long!.ledger as { workspace?: { receipt?: string } }).workspace?.receipt).toBe(receiptOf(entry));
    expect(terminal.text).toContain(receiptOf(entry));
    const grade = gradeLiveLongFixtureCase(entry.id, `Done. Receipt ${receiptOf(entry)} total 101.29 and 870`, verification.provenance.events);
    expect(grade.pass).toBe(true);
    expect(gradeLiveLongFixtureCase(entry.id, 'no receipt here', verification.provenance.events).pass).toBe(false);
  }, 120_000);

  it('fails the named near-miss ledger, a rollback after success and a late revision', async () => {
    const { verification } = await replay(entry, `${entry.id}-near`);
    const events = verification.provenance.events;
    expect(entry.check(events)).toBe(true);
    const near = withLast(events, (event) => ({ ...event, long: { ...event.long!, ledger: entry.nearMiss.ledger } }));
    expect(entry.check(near)).not.toBe(true);
    const rollback: FixtureObservation[] = [...events, { ...lastLong(events), arrival: 9999, long: { ...lastLong(events).long!, ledger: { ...(lastLong(events).long!.ledger as object), completed: false } } }];
    expect(entry.check(rollback)).not.toBe(true);
    const late: FixtureObservation[] = [...events, { ...lastLong(events), arrival: 9999, long: { ...lastLong(events).long!, revision: (lastLong(events).long!.revision ?? 0) + 1 } }];
    expect(entry.check(late)).not.toBe(true);
    const pending = withLast(events, (event) => ({ ...event, long: { ...event.long!, ledger: { ...(event.long!.ledger as object), pending: 1 } } }));
    expect(entry.check(pending)).not.toBe(true);
    const elsewhere = withLast(events, (event) => ({ ...event, long: { ...event.long!, url: '/live-long/other/off/x' } }));
    expect(entry.check(elsewhere)).not.toBe(true);
  }, 120_000);

  it('passes the same business state reached through a different number of commits', async () => {
    const { verification } = await replay(entry, `${entry.id}-path`);
    const events = verification.provenance.events;
    const bump = (revision: number) => withLast(events, (event) => ({ ...event, long: { ...event.long!, revision, ledger: { ...(event.long!.ledger as object), revision } } }));
    expect(entry.check(bump((lastLong(events).long!.revision ?? 0) + 3))).toBe(true);
    const mismatch = withLast(events, (event) => ({ ...event, long: { ...event.long!, revision: (event.long!.revision ?? 0) + 3 } }));
    expect(entry.check(mismatch)).not.toBe(true);
  }, 120_000);

  it('does not pass when the workflow stops before the final step', async () => {
    const { verification } = await replay(entry, `${entry.id}-stop`, entry.walkthrough.slice(0, -1));
    expect(verification.ok).toBe(false);
  }, 120_000);
});
