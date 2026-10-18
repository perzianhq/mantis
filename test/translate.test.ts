import { describe, expect, it } from 'vitest';
import type { RawNode, Snapshot } from '../src/capture/index.js';
import { estimateTokens, translate } from '../src/translate.js';

const link = (id: number, name: string, inViewport = true, parent = -1): RawNode => ({
  kind: 'interactive', id, role: 'link', name, states: [], parent, depth: 0, inViewport, covered: false,
});
const text = (name: string, inViewport = true): RawNode => ({
  kind: 'text', role: 'text', name, states: [], parent: -1, depth: 0, inViewport, covered: false,
});
const prose = (name: string, inViewport = true): RawNode => ({
  kind: 'prose', role: 'text', name, states: [], parent: -1, depth: 0, inViewport, covered: false,
});
const region = (role: string, name: string): RawNode => ({
  kind: 'region', role, name, states: [], parent: -1, depth: 0, inViewport: true, covered: false,
});
const snap = (nodes: RawNode[]): Snapshot => ({ url: 'https://x.test/', title: 'T', nodes, truncated: false });

describe('translate', () => {
  it('estimates tokens as ceil(chars/4)', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
    expect(estimateTokens('')).toBe(0);
  });

  it('collapses only runs longer than 8', () => {
    const eight = translate(snap(Array.from({ length: 8 }, (_, i) => link(i + 1, `L${i + 1}`))));
    expect(eight).not.toContain('more');
    const nine = translate(snap(Array.from({ length: 9 }, (_, i) => link(i + 1, `L${i + 1}`))));
    // the hidden part is still named, compactly, while it fits
    expect(nine).toContain('#6 "L6" · #7 "L7" · #8 "L8" · #9 "L9"');
    expect(nine).not.toContain('…and');
  });

  it('pluralises -x roles with es', () => {
    const boxes: RawNode[] = Array.from({ length: 80 }, (_, i) => ({ ...link(i + 1, `A rather long field label number ${i}`), role: 'textbox' }));
    expect(translate(snap(boxes))).toMatch(/…and \d+ more textboxes \(#\d+–#80\); find\("text"\) locates one/);
  });

  it('drops offscreen text first and notes the trim once over budget', () => {
    const nodes: RawNode[] = [link(1, 'Top')];
    for (let i = 0; i < 40; i++) nodes.push(text(`Offscreen note number ${i} with padding text`, false));
    nodes.push(link(2, 'Bottom', false));
    const full = translate(snap(nodes), 1_000_000);
    expect(full).toContain('Offscreen note number 0');
    expect(full).not.toContain('trimmed');
    const trimmed = translate(snap(nodes), 600);
    expect(trimmed).not.toContain('Offscreen note');
    expect(trimmed).toContain('link "Bottom"'); // offscreen controls survive while they fit
    expect(trimmed).toMatch(/\(trimmed: 40 items offscreen — scroll or read again\)$/);
  });

  it('stays within the budget and says so when it has to cut lines', () => {
    // alternate roles so nothing collapses
    const nodes = Array.from({ length: 300 }, (_, i) => ({ ...link(i + 1, `Distinct item ${i}`), role: i % 2 ? 'link' : 'button' }));
    const out = translate(snap(nodes), 1500);
    expect(out.length).toBeLessThanOrEqual(1500);
    expect(out).toMatch(/\(trimmed: \d+ (more lines|items offscreen)/);
  });

  it('shows every paragraph unclipped, offscreen ones too, when the page fits the budget', () => {
    const paras = Array.from({ length: 20 }, (_, i) => `Paragraph ${i} ${'long running text '.repeat(10)}end ${i}.`);
    const out = translate(snap(paras.map((p, i) => prose(p, i < 5))));
    for (const p of paras) expect(out).toContain(`"${p}"`);
    expect(out).not.toContain('more paragraph');
  });

  it('trims prose to the viewport, clipped, with an actionable note, when the page is over budget', () => {
    const paras = Array.from({ length: 40 }, (_, i) => `Paragraph ${i} ${'long running text '.repeat(10)}end ${i}.`);
    const out = translate(snap(paras.map((p, i) => prose(p, i < 20))));
    const shown = out.split('\n').filter((l) => l.startsWith('"Paragraph'));
    expect(shown.length).toBe(8);
    expect(shown.every((l) => l.length <= 122 && l.endsWith('…"'))).toBe(true);
    expect(out).toMatch(/\n…32 more paragraphs — find\("text"\) or read\(full=true\)$/);
  });

  it('matches quoted region labels after their role', () => {
    const nodes = [region('dialog', 'Preferences'), { ...link(1, 'Apply'), parent: 0, depth: 1 }];
    const unquoted = translate(snap(nodes), undefined, { region: 'dialog Preferences' });
    for (const target of ['dialog "Preferences"', "dialog 'Preferences'", 'dialog “Preferences”', 'dialog ‘Preferences’']) {
      const quoted = translate(snap(nodes), undefined, { region: target });
      expect(quoted.split('\n').filter((line) => line.startsWith('#'))).toEqual(unquoted.split('\n').filter((line) => line.startsWith('#')));
    }
    expect(translate(snap(nodes), undefined, { region: '"Preferences"' })).toContain('#1 link "Apply"');
  });

  it('prefers the exact main label over a navigation region named Main', () => {
    const nodes = [
      region('nav', 'Main'), { ...link(1, 'Navigation destination'), parent: 0, depth: 1 },
      region('main', ''), { ...link(2, 'Content destination'), parent: 2, depth: 1 },
    ];
    const out = translate(snap(nodes), undefined, { region: ' MaIn ' });
    expect(out).toContain('#2 link "Content destination"');
    expect(out).not.toContain('Navigation destination');
    expect(translate(snap(nodes), undefined, { region: 'nav "Main"' })).toContain('#1 link "Navigation destination"');
  });

  it('keeps all duplicate exact labels after normalizing quotes, excluding longer labels', () => {
    const nodes = [
      region('dialog', 'Preferences'), { ...link(1, 'First apply'), parent: 0, depth: 1 },
      region('dialog', 'Preferences'), { ...link(2, 'Second apply'), parent: 2, depth: 1 },
      region('dialog', 'Preferences archive'), { ...link(3, 'Archived apply'), parent: 4, depth: 1 },
    ];
    for (const target of ['dialog Preferences', 'dialog "Preferences"', "dialog 'Preferences'", 'dialog “Preferences”', 'dialog ‘Preferences’']) {
      const out = translate(snap(nodes), undefined, { region: target });
      expect(out).toContain('#1 link "First apply"');
      expect(out).toContain('#2 link "Second apply"');
      expect(out).not.toContain('Archived apply');
    }
  });

  it('retains substring matching across regions when no full label matches', () => {
    const nodes = [
      region('nav', 'Main'), { ...link(1, 'Primary destination'), parent: 0, depth: 1 },
      region('nav', 'Main archive'), { ...link(2, 'Archived destination'), parent: 2, depth: 1 },
      region('aside', 'Help'), { ...link(3, 'Help destination'), parent: 4, depth: 1 },
    ];
    for (const target of ['main', '"Main"', 'nav ma']) {
      const out = translate(snap(nodes), undefined, { region: target });
      expect(out).toContain('#1 link "Primary destination"');
      expect(out).toContain('#2 link "Archived destination"');
      expect(out).not.toContain('Help destination');
    }
    expect(translate(snap(nodes), undefined, { region: 'missing' })).toMatch(/^error: no region matching "missing"/);
  });

  it('selects a nested exact region without leaking its substring-matching ancestor', () => {
    const nodes = [
      region('main', 'Archive'), { ...link(1, 'Outer destination'), parent: 0, depth: 1 },
      { ...region('main', ''), parent: 0, depth: 1 },
      { ...link(2, 'Nested destination'), parent: 2, depth: 2 },
      { ...region('main', ''), parent: 2, depth: 2 },
      { ...link(3, 'Deep destination'), parent: 4, depth: 3 },
    ];
    const out = translate(snap(nodes), undefined, { region: 'main' });
    expect(out).not.toContain('Outer destination');
    expect(out.match(/#2 link "Nested destination"/g)).toHaveLength(1);
    expect(out.match(/#3 link "Deep destination"/g)).toHaveLength(1);
  });

  it('leaves inner and mismatched quotes in region labels alone', () => {
    const nodes = [
      region('dialog', "Don't save"),
      { ...link(1, 'Keep changes'), parent: 0, depth: 1 },
      region('dialog', '5" screen'),
      { ...link(2, 'Use display'), parent: 2, depth: 1 },
      region('dialog', '"Preferences\''),
      { ...link(3, 'Keep literal quotes'), parent: 4, depth: 1 },
    ];
    expect(translate(snap(nodes), undefined, { region: "dialog Don't save" })).toContain('#1 link "Keep changes"');
    expect(translate(snap(nodes), undefined, { region: 'dialog 5" screen' })).toContain('#2 link "Use display"');
    expect(translate(snap(nodes), undefined, { region: 'dialog "Preferences\'' })).toContain('#3 link "Keep literal quotes"');
  });

  it('shares identical dropdown option descriptions only across repeated table rows', () => {
    const select = (id: number, row: number): RawNode => ({
      ...link(id, 'Status'), role: 'combobox', row, rowGroup: 7, tableRow: true,
      options: ['Draft', 'Published'],
    });
    const out = translate(snap([select(1, 1), select(2, 2), select(3, 3)]));
    expect(out).toContain('#1 combobox "Status" (options: Draft | Published)');
    expect(out).toContain('#2 combobox "Status" (options: same as #1)');
    expect(out).toContain('#3 combobox "Status" (options: same as #1)');

    const listRows = translate(snap([
      { ...select(4, 4), tableRow: false },
      { ...select(5, 5), tableRow: false },
    ]));
    expect(listRows).not.toContain('options: same as');
  });

  it('keeps table dropdown options explicit when ordering or disabled state differs', () => {
    const base = (id: number, row: number, options: string[], states: string[] = []): RawNode => ({
      ...link(id, 'Status'), role: 'combobox', row, rowGroup: 8, tableRow: true, options, states,
    });
    const out = translate(snap([
      base(1, 1, ['Draft', 'Published']),
      base(2, 2, ['Published', 'Draft']),
      base(3, 3, ['Draft', 'Published'], ['disabled']),
    ]));
    expect(out).toContain('#2 combobox "Status" (options: Published | Draft)');
    expect(out).toContain('#3 combobox "Status" (disabled, options: Draft | Published)');
    expect(out).not.toContain('options: same as');
  });

  it('never points table dropdown options at an omitted or later definition', () => {
    const select = (id: number, row: number, extra: Partial<RawNode> = {}): RawNode => ({
      ...link(id, 'Status', extra.inViewport ?? true), role: 'combobox', row, rowGroup: 9, tableRow: true,
      options: ['Draft', 'Published'], ...extra,
    });
    // At the final compaction level, the offscreen first row is dropped. The
    // first visible row must become the definition rather than pointing to it.
    const trimmed = translate(snap([
      select(1, 1, { inViewport: false }), select(2, 2), select(3, 3),
      ...Array.from({ length: 80 }, (_, i) => text(`Visible filler ${i}`)),
    ]), 500);
    expect(trimmed).not.toContain('#1');
    expect(trimmed).toContain('#2 combobox "Status" (options: Draft | Published)');
    expect(trimmed).toContain('#3 combobox "Status" (options: same as #2)');

    // Blocking regions render before earlier source siblings. The dialog row
    // must be explicit because the main-region definition has not appeared yet.
    const blocking = region('dialog', 'Confirm');
    blocking.covers = true;
    const reordered = translate(snap([
      region('main', ''), { ...select(4, 4), parent: 0, depth: 1 },
      blocking, { ...select(5, 5), parent: 2, depth: 1 },
    ]));
    expect(reordered.indexOf('#5 combobox')).toBeLessThan(reordered.indexOf('#4 combobox'));
    expect(reordered).toContain('#5 combobox "Status" (options: Draft | Published)');
    expect(reordered).not.toContain('#5 combobox "Status" (options: same as #4)');
  });

  it('makes an earlier non-compact table row the options anchor before later compact rows', () => {
    const select = (id: number, row: number): RawNode => ({
      ...link(id, 'Status'), role: 'combobox', row, rowGroup: 11, tableRow: true,
      options: ['Draft', 'Published'],
    });
    const button = (id: number, row: number): RawNode => ({
      ...link(id, 'Edit'), role: 'button', row, rowGroup: 11, tableRow: true,
    });
    // Row 1 has one control and does not qualify for row compaction. Rows 2-4
    // do. Their preformatted text must not claim #2 as an anchor before #1 is
    // actually appended to the response.
    const out = translate(snap([
      select(1, 1),
      select(2, 2), button(20, 2),
      select(3, 3), button(30, 3),
      select(4, 4), button(40, 4),
    ]));
    expect(out).toContain('#1 combobox "Status" (options: Draft | Published)');
    expect(out).toContain('#2 combobox "Status" (options: same as #1)');
    expect(out).not.toContain('#1 combobox "Status" (options: same as #2)');
  });

  it('keeps option anchors inside the response selected by full, region, and memory reads', () => {
    const select = (id: number, row: number, parent: number): RawNode => ({
      ...link(id, 'Status'), role: 'combobox', row, rowGroup: 10, tableRow: true,
      options: ['Draft', 'Published'], parent, depth: 1,
    });
    const nodes = [
      region('aside', 'Saved'), select(1, 1, 0),
      region('main', 'Current'), select(2, 2, 2), select(3, 3, 2),
    ];
    const full = translate(snap(nodes), undefined, { full: true });
    expect(full).not.toContain('options: same as');

    const picked = translate(snap(nodes), undefined, { region: 'Current' });
    expect(picked).toContain('#2 combobox "Status" (options: Draft | Published)');
    expect(picked).toContain('#3 combobox "Status" (options: same as #2)');
    expect(picked).not.toContain('#1 combobox');

    const collapsed = translate(snap(nodes), undefined, {}, {
      collapse: () => [['[aside summary]'], null],
      shown: () => {},
    });
    expect(collapsed).toContain('#2 combobox "Status" (options: Draft | Published)');
    expect(collapsed).toContain('#3 combobox "Status" (options: same as #2)');
    expect(collapsed).not.toContain('options: same as #1');
  });

  it('does not share options from a dropdown rejected by the 600-character run budget', () => {
    const select = (id: number, options: string[]): RawNode => ({
      ...link(id, `Status ${id}`), role: 'combobox', row: id, rowGroup: 12, tableRow: true, options,
    });
    const short = ['Draft', 'Published'];
    // The first five controls are kept verbatim. #6 introduces a new, very
    // large option list; the run's 600-character named-rest budget rejects its
    // line. A later matching dropdown must therefore render that list itself.
    const large = Array.from({ length: 30 }, (_, i) => `Long option ${i} ${'x'.repeat(24)}`);
    const nodes = [
      ...Array.from({ length: 5 }, (_, i) => select(i + 1, short)),
      ...Array.from({ length: 7 }, (_, i) => select(i + 6, large)),
      text('After collapsed controls'),
      select(13, large),
    ];
    const out = translate(snap(nodes));
    expect(out).not.toContain('#6 combobox "Status 6"');
    expect(out).toContain('#13 combobox "Status 13" (options: Long option 0');
    expect(out).not.toContain('#13 combobox "Status 13" (options: same as #6)');
  });

  it('uses the first emitted fallback as the anchor in a compact multi-control row', () => {
    const select = (id: number, row: number, name: string, options: string[]): RawNode => ({
      ...link(id, name), role: 'combobox', row, rowGroup: 13, tableRow: true, options,
    });
    const status = Array.from({ length: 30 }, (_, i) => `Status option ${i} ${'x'.repeat(24)}`);
    const priority = ['Low', 'High'];
    // #6 is rejected by the named-rest budget after registering as an anchor.
    // The remaining compact rows each have two dropdowns. #13 is the first
    // emitted Status definition, so later Status controls can safely share it
    // without affecting Priority.
    const nodes = [
      ...Array.from({ length: 5 }, (_, i) => select(i + 1, i + 1, 'Short', ['Yes', 'No'])),
      select(6, 6, 'Status', status),
      ...Array.from({ length: 6 }, (_, i) => select(i + 7, i + 7, 'Other', ['Yes', 'No'])),
      text('After collapsed controls'),
      select(13, 13, 'Status', status), select(14, 13, 'Priority', priority),
      select(15, 14, 'Status', status), select(16, 14, 'Priority', priority),
      select(17, 15, 'Status', status), select(18, 15, 'Priority', priority),
    ];
    const out = translate(snap(nodes));
    expect(out).not.toContain('#6 combobox "Status"');
    expect(out).toContain('#13 combobox "Status" (options: Status option 0');
    expect(out).toContain('#14 combobox "Priority" (options: Low | High)');
    expect(out).toContain('#15 combobox "Status" (options: same as #13)');
    expect(out).toContain('#16 "Priority" (options: same as #14)');
  });

  it('keeps reversed compact-row dropdown definitions separate from dangling references', () => {
    const select = (id: number, row: number, name: string, options: string[]): RawNode => ({
      ...link(id, name), role: 'combobox', row, rowGroup: 15, tableRow: true, options,
    });
    const status = Array.from({ length: 30 }, (_, i) => `Status option ${i} ${'x'.repeat(24)}`);
    const priority = ['Low', 'High'];
    const nodes = [
      ...Array.from({ length: 5 }, (_, i) => select(i + 1, i + 1, 'Short', ['Yes', 'No'])),
      select(6, 6, 'Status', status),
      ...Array.from({ length: 6 }, (_, i) => select(i + 7, i + 7, 'Other', ['Yes', 'No'])),
      text('After collapsed controls'),
      // Priority is an explicit definition first; Status still points at the
      // omitted #6 and must be materialized with Status (not Priority) options.
      select(13, 13, 'Priority', priority), select(14, 13, 'Status', status),
      select(15, 14, 'Priority', priority), select(16, 14, 'Status', status),
      select(17, 15, 'Priority', priority), select(18, 15, 'Status', status),
    ];
    const out = translate(snap(nodes));
    expect(out).toContain('#13 combobox "Priority" (options: Low | High)');
    expect(out).toContain('#14 combobox "Status" (options: Status option 0');
    expect(out).not.toContain('#14 combobox "Status" (options: same as #6)');
    expect(out).toContain('#15 combobox "Priority" (options: same as #13)');
    expect(out).toContain('#16 "Status" (options: same as #14)');
    expect(out).not.toContain('options: same as #6');
  });

  it('preserves dollar signs when materializing dropdown options', () => {
    const select = (id: number, row: number): RawNode => ({
      ...link(id, 'Plan'), role: 'combobox', row, rowGroup: 14, tableRow: true,
      options: [`$1 ${'starter '.repeat(100)}`, '$& enterprise'],
    });
    const out = translate(snap([
      ...Array.from({ length: 5 }, (_, i) => ({ ...link(i + 1, 'Short'), role: 'combobox', row: i + 1, rowGroup: 14, tableRow: true, options: ['Yes', 'No'] })),
      select(6, 6),
      ...Array.from({ length: 6 }, (_, i) => ({ ...link(i + 7, 'Other'), role: 'combobox', row: i + 7, rowGroup: 14, tableRow: true, options: ['Yes', 'No'] })),
      text('After collapsed controls'), select(13, 13),
    ]));
    expect(out).not.toContain('#6 combobox "Plan"');
    expect(out).toContain('#13 combobox "Plan" (options: $1 starter ');
    expect(out).toContain('$& enterprise)');
  });

  it('treats a literal option named "same as #6" as content, not a reference', () => {
    const select = (id: number, row: number): RawNode => ({
      ...link(id, 'Mode'), role: 'combobox', row, rowGroup: 16, tableRow: true,
      options: ['same as #6', 'Explicit'],
    });
    const out = translate(snap([select(1, 1), select(2, 2), select(3, 3)]));
    expect(out).toContain('#1 combobox "Mode" (options: same as #6 | Explicit)');
    expect(out).toContain('#2 combobox "Mode" (options: same as #1)');
  });

  it('keeps the requested budget when a missing dropdown anchor falls back to explicit options', () => {
    const select = (id: number, row: number, options: string[]): RawNode => ({
      ...link(id, `Status ${id}`), role: 'combobox', row, rowGroup: 17, tableRow: true, options,
    });
    const short = ['Yes', 'No'];
    const large = Array.from({ length: 20 }, (_, i) => `Long option ${i} ${'x'.repeat(24)}`);
    const out = translate(snap([
      ...Array.from({ length: 5 }, (_, i) => select(i + 1, i + 1, short)),
      select(6, 6, large),
      ...Array.from({ length: 6 }, (_, i) => select(i + 7, i + 7, short)),
      text('After collapsed controls'),
      select(13, 13, large),
    ]), 900);
    expect(out.length).toBeLessThanOrEqual(900);
    // If the fallback is retained, it is a real definition, never a dangling
    // reference to the omitted #6 control.
    expect(out).not.toContain('options: same as #6');
  });
});
