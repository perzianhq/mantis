import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import { MantisBrowser } from '../src/index.js';
import { chromiumExecutable } from '../src/userAgent.js';
import { CAPTCHA_WARNING, detectCaptcha } from '../src/fallback/captcha.js';
import { fixture, idOf } from './helpers.js';

let rawBrowser: Browser;
let context: BrowserContext;
let page: Page;

beforeAll(async () => {
  rawBrowser = await chromium.launch(chromiumExecutable());
  context = await rawBrowser.newContext();
  await context.route('https://www.google.com/recaptcha/**', (route) => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><title>Challenge</title><p>Challenge frame</p>',
  }));
  page = await context.newPage();
});

afterAll(async () => {
  await page?.close();
  await context?.close();
  await rawBrowser?.close();
});

afterEach(() => vi.unstubAllEnvs());

async function openCase(name: string): Promise<void> {
  await page.goto(`${fixture('hidden/captcha-rendering.html')}?case=${name}`, { waitUntil: 'load' });
}

describe('rendered CAPTCHA detection', () => {
  it.each(['visible-widget', 'visible-frame', 'shadow-visible'])('detects a rendered %s candidate', async (name) => {
    await openCase(name);
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it.each(['hidden-widget', 'display-none-frame', 'zero-frame', 'offscreen-frame', 'shadow-hidden'])('ignores the %s near miss', async (name) => {
    await openCase(name);
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('ignores many unrelated visible frames', async () => {
    await page.setContent('<main></main>');
    await page.evaluate(() => {
      for (let index = 0; index < 30; index++) {
        const frame = document.createElement('iframe');
        frame.srcdoc = `<p>Frame ${index}</p>`;
        frame.width = '30';
        frame.height = '30';
        document.body.append(frame);
      }
    });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('does not append a warning to read() for a hidden widget', async () => {
    const browser = new MantisBrowser();
    try {
      const view = await browser.open(`${fixture('hidden/captcha-rendering.html')}?case=hidden-widget`);
      expect(view).not.toContain('CAPTCHA');
      expect(await browser.read()).not.toContain('CAPTCHA');
    } finally {
      await browser.close();
    }
  });

  it('warns for a delayed generic verification gate in reads and action diffs, then clears it', async () => {
    const browser = new MantisBrowser();
    try {
      const initial = await browser.open(fixture('verification-gate.html'));
      expect(initial).not.toContain('CAPTCHA');
      const shown = await browser.click(idOf(initial, 'Begin'));
      expect(shown).toContain(CAPTCHA_WARNING);
      const view = await browser.read();
      expect(view).toContain(CAPTCHA_WARNING);
      const removed = await browser.click(idOf(view, 'Use another route'));
      expect(removed).not.toContain('CAPTCHA');
      expect(await browser.read()).not.toContain('CAPTCHA');
    } finally {
      await browser.close();
    }
  });

  it('detects a generic verification gate inside a visible iframe', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=iframe`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('does not mistake verification prose beside an ordinary canvas for a gate', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=near-miss`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('does not join a verification heading to a canvas in a separate page section', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=separate-near-miss`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('does not join sibling semantic sections through main', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=semantic-siblings`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('detects a short paragraph and widget in one compact section', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=compact-paragraph-gate`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('does not treat quoted explanatory paragraph prose as gate wording', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=quoted-prose`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('detects a concise body-level verification gate', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=body-direct`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('detects a concise body-level gate anchored by a paragraph', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=paragraph-body`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('does not treat a generic refresh control as challenge evidence', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=generic-control`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('requires a challenge-like iframe for title-only wording', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=title-video`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
    await page.goto(`${fixture('verification-gate.html')}?case=title-challenge-frame`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('requires a challenge control beside a canvas for title-only wording', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=title-canvas`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
    await page.goto(`${fixture('verification-gate.html')}?case=title-canvas-gate`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('detects a compact gate when its widget is nested in a form', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=nested-form-gate`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBe(CAPTCHA_WARNING);
  });

  it('does not join a form widget to wording in a sibling semantic section', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=nested-form-separate`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('ignores hidden verification wording in an otherwise visible panel', async () => {
    await page.goto(`${fixture('verification-gate.html')}?case=hidden-wording`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('stays null on a page with many ordinary headings', async () => {
    await page.setContent('<main></main>');
    await page.evaluate(() => {
      const main = document.querySelector('main')!;
      for (let index = 0; index < 500; index++) {
        const heading = document.createElement('h2');
        heading.textContent = `Section ${index}`;
        main.append(heading);
      }
    });
    expect(await detectCaptcha(page)).toBeNull();
  });

  it('adds the warning to find() and media()', async () => {
    const browser = new MantisBrowser();
    try {
      const initial = await browser.open(fixture('verification-gate.html'));
      await browser.click(idOf(initial, 'Begin'));
      expect(await browser.find('Human Verification')).toContain(CAPTCHA_WARNING);
      expect(await browser.media()).toContain(CAPTCHA_WARNING);
    } finally {
      await browser.close();
    }
  });

  it('uses the no-human warning for a generic verification gate', async () => {
    vi.stubEnv('MANTIS_NO_HUMAN', '1');
    await page.goto(`${fixture('verification-gate.html')}?case=iframe`, { waitUntil: 'load' });
    expect(await detectCaptcha(page)).toContain('Mantis cannot solve it');
    expect(await detectCaptcha(page)).not.toContain('ask_human');
  });
});
