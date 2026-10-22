import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let b: MantisBrowser;
beforeAll(() => { b = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await b.close(); });

describe('iframes', () => {
  it('reads a visible iframe (cross-origin: file:// frames are opaque origins) under its own region', async () => {
    const view = await b.open(fixture('iframe.html'));
    expect(view).toContain('[iframe "Payment"]');
    expect(view).toMatch(/#1\d{4} textbox "Card number" \(required\)/); // the frame's own number range
    expect(view).toMatch(/#1\d{4} button "Pay"/);
    expect(view).not.toContain('Hidden tracker'); // zero-size frames are skipped
    expect(view).toMatch(/#\d button "Back to cart"/);
  });

  it('acts inside the frame and reports what changed there', async () => {
    const view = await b.open(fixture('iframe.html'));
    const card = idOf(view, 'textbox "Card number"');
    expect(await b.type(card, '4242')).toContain(`typed "4242" into #${card} textbox "Card number"`);
    const res = await b.click(idOf(view, 'button "Pay"'));
    expect(res).toContain('"Paid with 4242"');
  });

  it('find() searches inside frames too', async () => {
    await b.open(fixture('iframe.html'));
    expect(await b.find('card number')).toMatch(/#1\d{4} textbox "Card number".*in \[main\] › \[iframe "Payment"\]/);
  });
  it('selects custom comboboxes in same-origin and cross-origin frames, and resolves selectors there', async () => {
    const view = await b.open(fixture('frame-controls.html'));
    const sameName = idOf(view, 'textbox "Same name"');
    const sameCity = idOf(view, 'combobox "Same city"');
    const crossCity = idOf(view, 'combobox "Cross city"');
    expect(await b.type(sameName, 'Ari')).toContain(`typed "Ari" into #${sameName} textbox "Same name"`);
    expect(await b.select(sameCity, 'maple')).toContain(`selected "Maple Grove" in #${sameCity} combobox "Same city"`);
    expect(await b.select(crossCity, 'CEDAR RIDGE')).toContain(`selected "Cedar Ridge" in #${crossCity} combobox "Cross city"`);
    expect(await b.data({ selector: '#frame-art' })).toContain('alt: Embedded route map');

    // Near misses: an ambiguous or unknown option inside a frame lists candidates instead of guessing.
    expect(await b.select(sameCity, 'o')).toMatch(/^error: ambiguous option "o" in .*candidates: Maple Grove | Harbor Point/);
    expect(await b.select(crossCity, 'Atlantis')).toMatch(/^error: no option "Atlantis" in .*options: Pine Harbor | Cedar Ridge/);

    // Near miss: selectors still fail clearly when no frame contains a match.
    expect(await b.data({ selector: '#not-in-a-frame' })).toMatch(/^error: nothing matches selector "#not-in-a-frame"/);
  });
});
