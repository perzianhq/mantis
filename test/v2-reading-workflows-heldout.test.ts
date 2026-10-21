import { afterAll, beforeAll, expect, it } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { chromiumExecutable } from '../src/userAgent.js';
import { startFixtures } from '../bench/fixtures.js';
import { V2_READING_WORKFLOW_HELDOUT_CASES, V2_READING_WORKFLOW_HELDOUT_CHECKS, gradeV2ReadingWorkflowHeldoutCase, v2ReadingWorkflowHeldOutRoute } from '../bench/fixtures-v2-reading-workflows-heldout.js';

let browser: Browser; let page: Page; let fixtures: Awaited<ReturnType<typeof startFixtures>>;
beforeAll(async () => { browser=await chromium.launch(chromiumExecutable()); page=await browser.newPage(); fixtures=await startFixtures({checks:V2_READING_WORKFLOW_HELDOUT_CHECKS,developmentRoute:v2ReadingWorkflowHeldOutRoute}); });
afterAll(async () => { await page?.close(); await browser?.close(); await fixtures?.close(); });

it('keeps four executable held-out reading/workflow cases out of the development adapter', async () => {
  expect(V2_READING_WORKFLOW_HELDOUT_CASES).toHaveLength(4);
  for (const entry of V2_READING_WORKFLOW_HELDOUT_CASES) expect(entry.split).toBe('heldout');
  expect(v2ReadingWorkflowHeldOutRoute('/v2/reading/landmark-jump')).toBeNull();
});

it('accepts the code requested by each held-out prompt, but never a settled state from a prior document', () => {
  for (const entry of V2_READING_WORKFLOW_HELDOUT_CASES) {
    const code = entry.expected.answer.split(':').at(-1)!.trim();
    const loaded = { kind: 'load', documentId: 'current', fixtureState: { ...entry.expected.terminalState, read: false, recovered: false } } as any;
    const settled = { kind: 'settled', documentId: 'current', fixtureState: entry.expected.terminalState } as any;
    expect(gradeV2ReadingWorkflowHeldoutCase(entry.id, code, [loaded, settled]), entry.id).toEqual({ ok: true });
    const reloaded = { kind: 'load', documentId: 'new-document', fixtureState: { ...entry.expected.terminalState, read: false, recovered: false } } as any;
    expect(gradeV2ReadingWorkflowHeldoutCase(entry.id, code, [loaded, settled, reloaded]), `${entry.id}/reload`).toMatchObject({ ok: false });
    expect(gradeV2ReadingWorkflowHeldoutCase(entry.id, code, [loaded, settled, reloaded, { ...settled }]), `${entry.id}/late-old-settled`).toMatchObject({ ok: false });
  }
  const sticky = v2ReadingWorkflowHeldOutRoute('/v2-heldout/reading/sticky-context')!.body;
  expect(sticky).toContain('position:sticky');
  expect(sticky).toContain('Earlier subsection');
  expect(sticky).toContain('Current code confirmed');
});

it('proves every held-out terminal state through an opt-in Chromium route', async () => {
  for (const entry of V2_READING_WORKFLOW_HELDOUT_CASES) {
    const attempt=`${entry.id}-happy`; await page.goto(`${fixtures.baseFor(entry.id,attempt)}${entry.route}`);
    switch (entry.family) {
      case 'sticky-context': await page.locator('article').evaluate((node: HTMLElement)=>node.scrollTop=node.scrollHeight); await page.click('#read'); break;
      case 'reading-recovery': await page.click('#recover'); break;
      case 'review-submit': await page.fill('#name','Aurora'); await page.check('#ack'); await page.click('button'); break;
      case 'workflow-recovery': await page.click('#restore'); await page.click('#review'); await page.click('#finish'); break;
    }
    await page.waitForFunction(() => (window as any).__fixturePending === 0);
    const result=await fixtures.verify(entry.id,attempt);
    expect(result?.ok,entry.id).toBe(true);
    expect(gradeV2ReadingWorkflowHeldoutCase(entry.id,entry.expected.answer,result!.provenance.events),entry.id).toEqual({ok:true});
  }
});

it('rejects a reachable case-specific near miss for every held-out route', async () => {
  for (const entry of V2_READING_WORKFLOW_HELDOUT_CASES) {
    const attempt=`${entry.id}-near`; await page.goto(`${fixtures.baseFor(entry.id,attempt)}${entry.route}`);
    switch (entry.family) {
      case 'sticky-context': break; // Submit nothing: the offscreen current subsection was not read.
      case 'reading-recovery': break; // Keep the visibly stale clipped source.
      case 'review-submit': await page.fill('#name','Aurora'); await page.click('button'); break; // acknowledgement missing
      case 'workflow-recovery': await page.click('#restore'); await page.click('#review'); break; // final receipt not issued
    }
    await page.waitForFunction(() => (window as any).__fixturePending === 0);
    expect((await fixtures.verify(entry.id,attempt))?.ok,entry.nearMissId).toBe(false);
  }
});
