import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MantisBrowser } from '../src/index.js';
import { fixture, idOf } from './helpers.js';

let b: MantisBrowser;
beforeAll(() => { b = new MantisBrowser({ actionTimeoutMs: 1500 }); });
afterAll(async () => { await b.close(); });

describe('login form', () => {
  it('shows names, roles, states, regions and headings', async () => {
    const view = await b.open(fixture('login.html'));
    const lines = view.split('\n');
    expect(lines[0]).toMatch(/^Page: Login — Acme {2}\(file:\/\/\/.*login\.html\)$/);
    expect(view).toContain('[header]');
    expect(view).toContain('[main]');
    expect(view).toContain('[form "Login"]');
    expect(view).toMatch(/^\s*# Sign in$/m);
    expect(view).toMatch(/#\d+ textbox "Email" \(email, required\)/);
    expect(view).toMatch(/#\d+ textbox "Password" \(password, required\)/);
    expect(view).toMatch(/#\d+ button "Sign in" \(primary\)/);
    expect(view).toMatch(/"Forgot your password\?" #\d+ link "Reset it"/);
    expect(view).toMatch(/#\d+ link "Home"/);
  });

  it('indents children of a region by two spaces', async () => {
    const view = await b.open(fixture('login.html'));
    const lines = view.split('\n');
    const main = lines.indexOf('[main]');
    expect(lines[main + 1]).toMatch(/^ {2}# Sign in$/);
    expect(lines.find((l) => l.includes('[form "Login"]'))).toBe('  [form "Login"]');
    expect(lines.find((l) => l.includes('textbox "Email"'))).toMatch(/^ {4}#/);
  });

  it('typing into a field shows its value on the next read; password is masked', async () => {
    let view = await b.open(fixture('login.html'));
    const email = idOf(view, 'textbox "Email"');
    const pw = idOf(view, 'textbox "Password"');
    const r1 = await b.type(email, 'ada@example.com');
    expect(r1).toContain('typed "ada@example.com" into #');
    const r2 = await b.type(pw, 'hunter2-secret');
    expect(r2).not.toContain('hunter2');
    view = await b.read();
    expect(view).toMatch(/#\d+ textbox "Email" \(email, required, value "ada@example.com"\)/);
    expect(view).toMatch(/#\d+ textbox "Password" \(password, required, value "•••"\)/);
    expect(view).not.toContain('hunter2');
  });

  it('type(..., submit=true) runs the page handler and reports the title change', async () => {
    const view = await b.open(fixture('login.html'));
    const email = idOf(view, 'textbox "Email"');
    const pw = idOf(view, 'textbox "Password"');
    await b.type(email, 'ada@example.com');
    const res = await b.type(pw, 'pw', true);
    expect(res).toContain('pressed Enter');
    expect(res).toContain('title: "Login — Acme" → "Welcome — Acme"');
    expect(await b.read()).toMatch(/^\s*# Signed in$/m);
  });
});

describe('hidden content', () => {
  it('drops everything a user cannot see and keeps what they can', async () => {
    const view = await b.open(fixture('hidden.html'));
    for (const hidden of [
      'Display none', 'Visibility hidden', 'Aria hidden', 'Opacity zero', 'Zero size',
      'Offscreen left', 'Offscreen above', 'Inert one', 'Hidden attribute', 'Hidden heading', 'Collapsed panel',
    ]) {
      expect(view, hidden).not.toContain(hidden);
    }
    expect(view).toContain('button "Visible one"');
    expect(view).toContain('link "Visible link"');
    expect(view).toContain('button "Below the fold"');
  });

  it('keeps content below the fold but records it as out of viewport', async () => {
    await b.open(fixture('hidden.html'));
    const snap = await b.snapshot();
    const below = snap.nodes.find((n) => n.name === 'Below the fold');
    const first = snap.nodes.find((n) => n.name === 'Visible one');
    expect(below?.inViewport).toBe(false);
    expect(first?.inViewport).toBe(true);
  });
});

describe('cookie dialog', () => {
  it('lists the dialog first, marked as covering, and flags buttons underneath', async () => {
    const view = await b.open(fixture('cookie.html'));
    const lines = view.split('\n');
    expect(lines[1]).toBe('[dialog "Accept cookies?" — covers page]');
    expect(view).toMatch(/^ {2}#\d+ button "Accept"$/m);
    expect(view).toMatch(/^ {2}#\d+ button "Reject"$/m);
    expect(view).toMatch(/#\d+ button "Add to cart" \(covered\)/);
    expect(view).toMatch(/#\d+ link "More products" \(.*covered\)/);
    expect(lines.find((l) => l.includes('"Accept"'))).not.toContain('covered');
  });

  it('refuses to click a covered element with a clear message', async () => {
    const view = await b.open(fixture('cookie.html'));
    const res = await b.click(idOf(view, 'button "Add to cart"'));
    expect(res).toMatch(/^error: .*covered by another element/);
    expect(res).not.toMatch(/\bat\s+\S+:\d+/); // no stack trace
  });

  it('after accepting, the dialog is gone and nothing is covered', async () => {
    const view = await b.open(fixture('cookie.html'));
    const res = await b.click(idOf(view, 'button "Accept"'));
    expect(res).toMatch(/^clicked #\d+ button "Accept"/);
    const after = await b.read();
    expect(after).not.toContain('dialog');
    expect(after).not.toContain('covered');
    expect(after).toContain('button "Add to cart"');
  });
});

describe('long lists', () => {
  it('collapses 60 links: five in full, the next ones named compactly, then a range and a find() hint', async () => {
    const view = await b.open(fixture('longlist.html'));
    expect(view).toContain('[nav "Docs"]');
    expect((view.match(/link "Item \d+"/g) ?? []).length).toBe(5);
    expect(view).toContain('link "Item 5"');
    expect(view).toContain('#6 "Item 6" · #7 "Item 7"');
    expect(view).toMatch(/…and \d+ more links \(#\d+–#60\); find\("text"\) locates one/);
  });

  it('find() reaches an item hidden by collapsing, with its number and region', async () => {
    await b.open(fixture('longlist.html'));
    const res = await b.find('item 59');
    expect(res).toMatch(/^found 1 match for "item 59"/);
    expect(res).toMatch(/#59 link "Item 59".*in \[nav "Docs"\]/);
    expect(await b.click(59)).toContain('clicked #59 link "Item 59"');
  });

  it('find() says so when nothing matches', async () => {
    await b.open(fixture('longlist.html'));
    expect(await b.find('no such thing')).toBe('no control or text containing "no such thing" on this page');
  });
});

describe('long prose', () => {
  it('keeps an inline-markup tail available to full reads and find()', async () => {
    await b.open(fixture('long-prose.html'));
    const tail = 'TAIL-NEEDLE-9f86d081884c7d65';
    const snap = await b.snapshot();
    expect(snap.nodes.find((n) => n.kind === 'prose')?.name).toContain(tail);
    expect(await b.read({ full: true })).toContain(tail);
    expect(await b.find(tail)).toMatch(new RegExp(`^found 1 match for "${tail}"`));
  });
});

describe('visible prose boundaries', () => {
  it('does not pull transparent or fully clipped descendants into visible prose, while preserving accessibility names', async () => {
    const page = 'data:text/html,' + encodeURIComponent(`<!doctype html><title>Visible text</title>
      <style>.transparent { opacity: 0 } .clipped { clip-path: inset(100%) } .visible-clip { clip-path: inset(0) }</style>
      <p>Shown before <span class="transparent">opacity secret</span> <span class="clipped">clip secret</span> <span class="visible-clip">visible child</span> shown after.</p>
      <span id="assist" class="transparent">Assistive button name</span><button aria-labelledby="assist"></button>
      <span id="clip-assist" class="clipped">Clipped assistive name</span><button aria-labelledby="clip-assist"></button>
      <button id="buy">Buy<span class="transparent"> assistive detail</span><span style="display:none"> wrong action</span><span style="visibility:hidden"> hidden action</span></button>`);
    const view = await b.open(page);
    expect(view).toContain('Shown before');
    expect(view).toContain('visible child');
    expect(view).not.toContain('opacity secret');
    expect(view).not.toContain('clip secret');
    // Referenced label text remains an explicit accessibility-name source, not visible prose.
    expect(view).toMatch(/button "Assistive button name"/);
    expect(view).toMatch(/button "Clipped assistive name"/);
    // Hard-hidden descendants are not part of a control name, while the near-transparent
    // screen-reader-only detail remains available to the accessibility-name path.
    expect(view).toMatch(/button "Buy assistive detail"/);
    expect(view).not.toContain('wrong action');
    expect(view).not.toContain('hidden action');
  });
});

describe('nested actions', () => {
  it('keeps an independently actionable child inside a custom button container without duplicating prose', async () => {
    const page = 'data:text/html,' + encodeURIComponent(`<!doctype html><title>Nested action</title>
      <div role="button" tabindex="0" aria-label="Product card"><span>Product card detail</span><button onclick="document.title='Deleted'">Delete</button></div>`);
    const view = await b.open(page);
    expect(view).toMatch(/button "Product card"/);
    expect(view).toMatch(/button "Delete"/);
    expect(view).not.toMatch(/^.*Product card detail$/m);
    expect(await b.click(idOf(view, 'button "Delete"'))).toContain('clicked #');
    expect(await b.read()).toContain('Page: Deleted');
  });
});

describe('shadow DOM', () => {
  it('shows and clicks a button inside an open shadow root', async () => {
    const view = await b.open(fixture('shadow.html'));
    expect(view).toMatch(/#\d+ button "Shadow button"/);
    const res = await b.click(idOf(view, 'Shadow button'));
    expect(res).toContain('clicked #');
    expect(res).toContain('title: "Shadow" → "Shadow clicked"');
  });
});

describe('clickables made only by script', () => {
  it('shows elements with a click listener or a pointer cursor, not plain text or the listening root', async () => {
    const view = await b.open(fixture('jsclick.html'));
    expect(view).toMatch(/#\d+ clickable "Basic plan \$5"/);
    expect(view).toMatch(/#\d+ clickable "Pro plan \$15"/);
    expect(view).toMatch(/#\d+ clickable "Open menu"/);
    expect(view).not.toMatch(/clickable "Just some text"/);
    expect(view).not.toMatch(/clickable "Plans/);
    expect(await b.click(idOf(view, '"Pro plan'))).toContain('"Chose pro"');
    expect(await b.click(idOf(view, '"Open menu"'))).toContain('"Menu opened"');
  });
});
