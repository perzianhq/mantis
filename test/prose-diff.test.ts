import { describe, expect, it } from 'vitest';
import { DIFF_BUDGET_CHARS, NO_CHANGE, diffSnapshots } from '../src/diff.js';
import type { RawNode, Snapshot } from '../src/index.js';

const base = { states: [], parent: -1, depth: 0, inViewport: true, covered: false };
const prose = (name: string, o: Partial<RawNode> = {}): RawNode =>
  ({ ...base, kind: 'prose', role: 'text', name, ...o });
const text = (name: string, o: Partial<RawNode> = {}): RawNode =>
  ({ ...base, kind: 'text', role: 'text', name, ...o });
const heading = (name: string, o: Partial<RawNode> = {}): RawNode =>
  ({ ...base, kind: 'heading', role: 'heading', name, level: 2, ...o });
const button = (id: number, name: string, o: Partial<RawNode> = {}): RawNode =>
  ({ ...base, kind: 'interactive', role: 'button', id, name, ...o });
const main = (): RawNode => ({ ...base, kind: 'region', role: 'main', name: '' });
const snap = (nodes: RawNode[]): Snapshot => ({ url: 'https://x.test/a', title: 'A', nodes, truncated: false });

describe('action diffs for prose paragraphs', () => {
  it('reports added, changed, and removed prose in its existing region without disturbing stable ids', () => {
    const before = snap([main(), button(7, 'Save', { parent: 0 }), prose('Your draft is visible only to you.', { parent: 0 })]);
    const changed = snap([main(), button(7, 'Save', { parent: 0 }), prose('Your draft is now shared with the team.', { parent: 0 })]);
    const added = snap([
      main(), button(7, 'Save', { parent: 0 }), prose('Your draft is visible only to you.', { parent: 0 }),
      prose('Invite collaborators from the sharing menu.', { parent: 0 }),
    ]);
    const removed = snap([main(), button(7, 'Save', { parent: 0 })]);

    expect(diffSnapshots(before, changed)).toBe('~ "Your draft is visible only to you." → "Your draft is now shared with the team."');
    expect(diffSnapshots(before, added)).toBe('+ [main] "Invite collaborators from the sharing menu."');
    expect(diffSnapshots(before, removed)).toBe('- removed: "Your draft is visible only to you."');
  });

  it('treats a replaced paragraph as visible change while retaining unrelated controls', () => {
    const before = snap([main(), button(3, 'Continue', { parent: 0 }), prose('The old policy explains the previous terms.', { parent: 0 })]);
    const after = snap([main(), button(3, 'Continue', { parent: 0 }), prose('The new policy explains the current terms.', { parent: 0 })]);

    expect(diffSnapshots(before, after)).toContain('"The old policy explains the previous terms." → "The new policy explains the current terms."');
    expect(diffSnapshots(before, after)).not.toContain('#3');
  });

  it('does not create a prose diff for whitespace-only changes, reordering, or text already represented nearby', () => {
    const whitespaceA = snap([main(), prose('A paragraph with  normal\n whitespace.', { parent: 0 })]);
    const whitespaceB = snap([main(), prose('A paragraph with normal whitespace.', { parent: 0 })]);
    const reorderedA = snap([main(), prose('First paragraph.', { parent: 0 }), prose('Second paragraph.', { parent: 0 })]);
    const reorderedB = snap([main(), prose('Second paragraph.', { parent: 0 }), prose('First paragraph.', { parent: 0 })]);
    const duplicated = snap([
      main(), heading('Account updated', { parent: 0 }), prose('Account updated', { parent: 0 }),
      button(9, 'Save', { parent: 0 }), prose('Save', { parent: 0 }),
      text('Done', { parent: 0, live: 'status' }), prose('Done', { parent: 0 }),
    ]);

    expect(diffSnapshots(whitespaceA, whitespaceB)).toBe(NO_CHANGE);
    expect(diffSnapshots(reorderedA, reorderedB)).toBe(NO_CHANGE);
    expect(diffSnapshots(snap([]), duplicated)).toBe('+ [main]\n+ ## Account updated\n+ #9 button "Save"\n+ ℹ "Done"');
  });

  it('keeps a live message when a same-named heading would otherwise deduplicate it', () => {
    const before = snap([main()]);
    const after = snap([
      main(), heading('Payment confirmed', { parent: 0 }),
      text('Payment confirmed', { parent: 0, live: 'status' }),
    ]);

    expect(diffSnapshots(before, after)).toBe('+ [main] ℹ "Payment confirmed"');
  });

  it('does not let a different live neighbor suppress the matching heading', () => {
    const before = snap([main()]);
    const normal = snap([
      main(), prose('Payment confirmed', { parent: 0 }), heading('Payment confirmed', { parent: 0 }),
      text('You have a new notification', { parent: 0, live: 'status' }),
    ]);
    const reversed = snap([
      main(), text('You have a new notification', { parent: 0, live: 'status' }),
      heading('Payment confirmed', { parent: 0 }), prose('Payment confirmed', { parent: 0 }),
    ]);
    expect(diffSnapshots(before, normal)).toBe('+ [main] ## Payment confirmed\n+ ℹ "You have a new notification"');
    // Near miss: reversal changes render order only; it must not make the heading disappear.
    expect(diffSnapshots(before, reversed)).toBe('+ [main] ℹ "You have a new notification"\n+ ## Payment confirmed');
  });

  it('shows the differing tail of long changed prose and keeps a following new control actionable', () => {
    const prefix = 'Review the payment details before continuing. '.repeat(5);
    const before = snap([main(), prose(`${prefix}Payment denied.`, { parent: 0 })]);
    const changed = snap([main(), prose(`${prefix}Payment approved.`, { parent: 0 })]);
    const added = snap([main(), prose(`Read ${'policy '.repeat(350)}`, { parent: 0 }), button(1, 'Continue', { parent: 0 })]);

    const change = diffSnapshots(before, changed);
    const addition = diffSnapshots(snap([main()]), added);
    expect(change).toContain('Payment denied.');
    expect(change).toContain('Payment approved.');
    expect(change).not.toContain('"Review the payment details before continuing. Review the');
    expect(addition).toContain('#1 button "Continue"');
    expect(addition.length).toBeLessThanOrEqual(DIFF_BUDGET_CHARS);
  });

  it('keeps a bounded prose excerpt and obeys the diff budget', () => {
    const after = snap([main(), prose(`Start ${'detail '.repeat(300)}`, { parent: 0 })]);
    const out = diffSnapshots(snap([main()]), after);

    expect(out).toContain('+ [main] "Start');
    expect(out).toContain('…"');
    expect(out.length).toBeLessThanOrEqual(DIFF_BUDGET_CHARS);
  });
});
