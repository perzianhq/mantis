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
async function replay(entry: Entry, attempt: string, steps = entry.walkthrough, inspect?: (page: import('playwright').Page, base: string) => Promise<void>) {
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
    if (inspect) await inspect(page, base);
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

describe('live-long fixture regression coverage', () => {
  it('keeps canonical basket and supplier receipts across redundant commits, while a wrong cart still fails', async () => {
    const basket = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-basket-off')!;
    const basketSteps = [...basket.walkthrough];
    const coupon = basketSteps.findIndex((step) => step.target === '#apply-coupon');
    basketSteps.splice(coupon + 1, 0, { op: 'type', target: '#coupon', value: 'SPRING10' }, { op: 'click', target: '#apply-coupon' });
    const redundantCoupon = await replay(basket, 'basket-redundant-coupon', basketSteps);
    expect(redundantCoupon.verification.ok).toBe(true);
    expect((lastLong(redundantCoupon.verification.provenance.events).long!.ledger as { receipt: string }).receipt).toBe(receiptOf(basket));

    const suppliers = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-suppliers-off')!;
    const supplierSteps = [...suppliers.walkthrough];
    const compared = supplierSteps.findIndex((step) => step.target === '[data-compare="o01"]');
    supplierSteps.splice(compared + 1, 0, { op: 'click', target: '[data-compare="o01"]' });
    const redundantCommit = await replay(suppliers, 'suppliers-redundant-commit', supplierSteps);
    expect(redundantCommit.verification.ok).toBe(true);
    expect((lastLong(redundantCommit.verification.provenance.events).long!.ledger as { receipt: string }).receipt).toBe(receiptOf(suppliers));

    const wrongCartSteps = basket.walkthrough.filter((step) => step.target !== '[aria-label="Add p25"]' && step.target !== '[aria-label="Add p42"]');
    expect((await replay(basket, 'basket-redundant-wrong-cart', wrongCartSteps)).verification.ok).toBe(false);
  }, 120_000);

  it('restores a completed dispatch receipt after reload but does not promote an incomplete dispatch', async () => {
    const dispatch = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-dispatch-off')!;
    const completed = await replay(dispatch, 'dispatch-reload-complete', dispatch.walkthrough, async (page) => {
      await page.waitForFunction((value) => document.querySelector('#view')?.textContent?.includes(value), receiptOf(dispatch));
      await page.reload();
      expect(await page.locator('#view').innerText()).toContain(receiptOf(dispatch));
    });
    expect(completed.verification.ok).toBe(true);

    const incomplete = await replay(dispatch, 'dispatch-reload-incomplete', dispatch.walkthrough.slice(0, -1), async (page, base) => {
      await page.goto(`${base}/live-long/dispatch/off/receipt`);
      await page.reload();
      expect(await page.locator('#view').innerText()).not.toContain(receiptOf(dispatch));
    });
    expect(incomplete.verification.ok).toBe(false);
  }, 120_000);

  it('rebuilds selected access and retention controls after a detail-route reload', async () => {
    for (const id of ['llf-access-off', 'llf-retention-off']) {
      const entry = LIVE_LONG_FIXTURE_CASES.find((candidate) => candidate.id === id)!;
      const detail = entry.name === 'access' ? 'detail' : 'document';
      const summary = 'summary';
      const completed = await replay(entry, `${id}-detail-reload-complete`, entry.walkthrough, async (page, base) => {
        await page.goto(`${base}/live-long/${entry.name}/off/${detail}`);
        await page.reload();
        if (entry.name === 'access') {
          expect(await page.locator('#status-panel').isVisible()).toBe(true);
          await page.locator('#access-tab').click();
          await page.locator('#role').selectOption({ label: 'Viewer' });
          expect(await page.locator('#staff-title').innerText()).not.toBe('');
        } else {
          await page.locator('#versions-tab').click();
          expect(await page.locator('#version-list button').count()).toBeGreaterThan(0);
        }
        await page.goto(`${base}/live-long/${entry.name}/off/${summary}`);
      });
      expect(completed.verification.ok).toBe(true);

      const incomplete = await replay(entry, `${id}-detail-reload-incomplete`, entry.walkthrough.slice(0, 1), async (page, base) => {
        await page.goto(`${base}/live-long/${entry.name}/off/${detail}`);
        await page.reload();
      });
      expect(incomplete.verification.ok).toBe(false);
    }
  }, 120_000);

  it('accepts terminal fragments but rejects a different terminal route', async () => {
    for (const id of ['llf-access-on', 'llf-dispatch-on']) {
      const entry = LIVE_LONG_FIXTURE_CASES.find((candidate) => candidate.id === id)!;
      const { verification } = await replay(entry, `${id}-fragment`);
      const fragment = withLast(verification.provenance.events, (event) => ({ ...event, long: { ...event.long!, url: `${event.long!.url}#top` } }));
      expect(entry.check(fragment)).toBe(true);
      const wrongRoute = withLast(fragment, (event) => ({ ...event, long: { ...event.long!, url: '/live-long/other/on/summary' } }));
      expect(entry.check(wrongRoute)).not.toBe(true);
    }
  }, 120_000);

  it('grades the latest settled ledger when the last view is another page of the workflow, rejecting wrong state', async () => {
    for (const id of ['llf-access-on', 'llf-dispatch-off', 'llf-casework-off', 'llf-retention-off']) {
      const entry = LIVE_LONG_FIXTURE_CASES.find((candidate) => candidate.id === id)!;
      const { verification } = await replay(entry, `${id}-post-completion-nav`);
      const prefix = `/live-long/${entry.name}/${entry.variant}/`;
      const moved = withLast(verification.provenance.events, (event) => ({ ...event, path: `${prefix}list`, text: 'Staff list', long: { ...event.long!, url: `${prefix}list` } }));
      expect(entry.check(moved)).toBe(true);
      const wrongLedger = withLast(moved, (event) => ({ ...event, long: { ...event.long!, ledger: { ...(event.long!.ledger as object), pending: 1 } } }));
      expect(entry.check(wrongLedger)).not.toBe(true);
    }
  }, 180_000);

  it('preserves completed access and retention ledgers across a direct summary reload, while incomplete work remains failing', async () => {
    for (const id of ['llf-access-off', 'llf-retention-off']) {
      const entry = LIVE_LONG_FIXTURE_CASES.find((candidate) => candidate.id === id)!;
      const summary = entry.name === 'access' ? 'summary' : 'summary';
      const completed = await replay(entry, `${id}-reload-complete`, entry.walkthrough, async (page, base) => {
        await page.goto(`${base}/live-long/${entry.name}/off/${summary}`);
        expect(await page.locator('main').innerText()).toContain(receiptOf(entry));
      });
      expect(completed.verification.ok).toBe(true);
      const incomplete = await replay(entry, `${id}-reload-incomplete`, entry.walkthrough.slice(0, -1), async (page, base) => {
        await page.goto(`${base}/live-long/${entry.name}/off/${summary}`);
        expect(await page.locator('main').innerText()).not.toContain(receiptOf(entry));
      });
      expect(incomplete.verification.ok).toBe(false);
    }
  }, 120_000);

  it('renders charged and quoted totals from saved state, rejecting wrong selections', async () => {
    const basket = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-basket-off')!;
    const correctBasket = await replay(basket, 'basket-real-total-correct');
    expect(correctBasket.verification.ok).toBe(true);
    const wrongBasketSteps = basket.walkthrough.filter((step) => step.target !== '[aria-label="Add p25"]' && step.target !== '[aria-label="Add p42"]');
    const wrongBasket = await replay(basket, 'basket-real-total-wrong', wrongBasketSteps, async (page) => {
      expect(await page.locator('#done').innerText()).toContain('Total charged €28.39');
      expect(await page.locator('#done').innerText()).not.toContain(receiptOf(basket));
    });
    expect(wrongBasket.verification.ok).toBe(false);

    const suppliers = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-suppliers-off')!;
    const wrongSupplierSteps = suppliers.walkthrough.map((step) => step.target === '#chosen' ? { ...step, value: 'o03' } : step);
    const wrongSupplier = await replay(suppliers, 'suppliers-real-total-wrong', wrongSupplierSteps, async (page) => {
      expect(await page.locator('#quote').innerText()).toContain('EUR 850.00');
      expect(await page.locator('#quote').innerText()).not.toContain(receiptOf(suppliers));
    });
    expect(wrongSupplier.verification.ok).toBe(false);
  }, 120_000);

  it('re-renders the matching view after supplier Back and preserves a dispatch receipt through history and hash navigation', async () => {
    const suppliers = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-suppliers-off')!;
    const comparisonSteps = suppliers.walkthrough.slice(0, -3);
    const supplierBack = await replay(suppliers, 'suppliers-history-back', comparisonSteps, async (page) => {
      await page.goBack();
      expect(await page.locator('#offers').isVisible()).toBe(true);
      expect(await page.locator('#comparison').isVisible()).toBe(false);
      expect(await page.locator('#offer-list').innerText()).toContain('o01');
    });
    expect(supplierBack.verification.ok).toBe(false);

    const dispatch = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-dispatch-off')!;
    const receipt = await replay(dispatch, 'dispatch-history-receipt', dispatch.walkthrough, async (page) => {
      await page.waitForFunction((value) => document.querySelector('#view')?.textContent?.includes(value), receiptOf(dispatch));
      await page.goBack();
      await page.goForward();
      expect(await page.locator('#view').innerText()).toContain(receiptOf(dispatch));
      await page.evaluate(() => { location.hash = 'top'; });
      expect(await page.locator('#view').innerText()).toContain(receiptOf(dispatch));
    });
    expect(receipt.verification.ok).toBe(true);
  }, 120_000);

  it('restores basket history views and keeps the cart intact when returning to the catalogue', async () => {
    const basket = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-basket-off')!;
    await replay(basket, 'basket-history-catalogue', basket.walkthrough.slice(0, 3), async (page) => {
      await page.locator('#basket').click();
      expect(await page.locator('#cart').isVisible()).toBe(true);
      const beforeHistory = await page.evaluate(() => (window as typeof window & { __fixtureLong: () => unknown }).__fixtureLong());
      await page.goBack();
      expect(await page.locator('#catalog').isVisible()).toBe(true);
      expect(await page.locator('#cart').isVisible()).toBe(false);
      await page.goForward();
      expect(await page.locator('#cart').isVisible()).toBe(true);
      expect(await page.locator('#lines').innerText()).toContain('p01');
      await page.locator('#cart-catalog').click();
      expect(await page.locator('#catalog').isVisible()).toBe(true);
      expect(await page.locator('#cart').isVisible()).toBe(false);
      const afterCatalogue = await page.evaluate(() => (window as typeof window & { __fixtureLong: () => unknown }).__fixtureLong());
      expect(afterCatalogue).toEqual(beforeHistory);
    });
  }, 120_000);

  it('does not mutate the basket ledger when browser history restores the catalogue', async () => {
    const basket = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-basket-off')!;
    await replay(basket, 'basket-history-ledger', basket.walkthrough.slice(0, 3), async (page) => {
      await page.locator('#basket').click();
      const beforeBack = await page.evaluate(() => (window as typeof window & { __fixtureLong: () => unknown }).__fixtureLong());
      await page.goBack();
      const afterBack = await page.evaluate(() => (window as typeof window & { __fixtureLong: () => unknown }).__fixtureLong());
      expect(afterBack).toEqual(beforeBack);
      await page.goForward();
      expect(await page.locator('#lines').innerText()).toContain('p01');
    });
  }, 120_000);

  it('casework saves on a real Back-then-Forward re-entry, but not on summary-to-summary or forward-only history moves', async () => {
    const casework = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-casework-off')!;
    const edits = casework.walkthrough.slice(0, -3);
    const forward = await replay(casework, 'casework-forward-reentry', [...edits, { op: 'click', target: '#summary' }, { op: 'click', target: '#back-history' }], async (page) => {
      await page.goForward();
      expect(await page.locator('main').innerText()).toContain(receiptOf(casework));
    });
    expect(forward.verification.ok).toBe(true);

    // Summary -> Help -> Next -> Summary, then history.go(-3) to the first summary and Forward twice: no off-summary Back happened.
    const bypass = await replay(casework, 'casework-summary-jump', [...edits, { op: 'click', target: '#summary' }, { op: 'click', target: 'a[href="#help"]' }, { op: 'click', target: '#next' }, { op: 'click', target: '#summary' }], async (page) => {
      await page.evaluate(() => history.go(-3)); await page.waitForTimeout(300);
      await page.goForward(); await page.goForward();
      if (await page.locator('#summary').count()) await page.locator('#summary').click();
      expect(await page.locator('main').innerText()).not.toContain(receiptOf(casework));
    });
    expect(bypass.verification.ok).toBe(false);
  }, 120_000);

  it('casework counts a Back to a fragment-link history entry, and fragment entries cannot fake an ordering', async () => {
    const casework = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-casework-off')!;
    const edits = casework.walkthrough.slice(0, -3);
    const help = { op: 'click' as const, target: 'a[href="#help"]' };
    const viaHelp = await replay(casework, 'casework-help-back', [...edits, help, { op: 'click', target: '#summary' }, { op: 'click', target: '#back-history' }, { op: 'click', target: '#summary' }], async (page) => {
      expect(await page.locator('main').innerText()).toContain(receiptOf(casework));
    });
    expect(viaHelp.verification.ok).toBe(true);

    // Summary -> Help -> Next -> Help -> Next -> Summary, then summary-to-summary go(-5) and a forward go(4) into the queue: no Back off the summary.
    const forwardOnly = await replay(casework, 'casework-help-forward-only', [...edits, { op: 'click', target: '#summary' }, help, { op: 'click', target: '#next' }, help, { op: 'click', target: '#next' }, { op: 'click', target: '#summary' }], async (page) => {
      await page.evaluate(() => history.go(-5)); await page.waitForTimeout(300);
      await page.evaluate(() => history.go(4)); await page.waitForTimeout(300);
      if (await page.locator('#summary').count()) await page.locator('#summary').click();
      expect(await page.locator('main').innerText()).not.toContain(receiptOf(casework));
    });
    expect(forwardOnly.verification.ok).toBe(false);
  }, 120_000);

  it('shows a saved retention receipt only after the summary commit', async () => {
    const retention = LIVE_LONG_FIXTURE_CASES.find((entry) => entry.id === 'llf-retention-off')!;
    const completed = await replay(retention, 'retention-summary-saved', retention.walkthrough, async (page) => {
      expect(await page.locator('#summary').innerText()).toContain('Retention summary saved');
      expect(await page.locator('#summary').innerText()).toContain(receiptOf(retention));
    });
    expect(completed.verification.ok).toBe(true);

    const incomplete = await replay(retention, 'retention-summary-unsaved', [{ op: 'goto', target: '/live-long/retention/off/summary' }], async (page) => {
      const summary = await page.locator('#summary').innerText();
      expect(summary).toContain('Retention summary not saved');
      expect(summary).not.toContain('Receipt');
    });
    expect(incomplete.verification.ok).toBe(false);
  }, 120_000);
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
