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

});
