import type { Frame, Page } from 'playwright';

export const CAPTCHA_WARNING = '⚠ CAPTCHA detected — call ask_human("captcha")';
const CAPTCHA_WARNING_NO_HUMAN = '⚠ CAPTCHA detected — Mantis cannot solve it; choose another route or report blocked';

/** True when MANTIS_NO_HUMAN=1: no person is available, so nothing should point the agent at ask_human. */
export function noHuman(): boolean {
  return process.env.MANTIS_NO_HUMAN === '1';
}

/** The warning text for the current mode (read per call so the env var can change at runtime). */
export function captchaWarning(): string {
  return noHuman() ? CAPTCHA_WARNING_NO_HUMAN : CAPTCHA_WARNING;
}

const FRAME_URL = /google\.com\/recaptcha|hcaptcha\.com|challenges\.cloudflare\.com/i;
const CAPTCHA_CANDIDATES = '.g-recaptcha, .h-captcha, .cf-turnstile, iframe[src*="google.com/recaptcha" i], iframe[src*="hcaptcha.com" i], iframe[src*="challenges.cloudflare.com" i]';
const VERIFICATION_TEXT = /\b(?:verify (?:that )?(?:you(?:'re| are) )?(?:human|not (?:a )?(?:robot|bot))|human verification|are you (?:a )?(?:robot|bot)|confirm (?:that )?you(?:'re| are) (?:a )?(?:human|not (?:a )?(?:robot|bot))|security check|prove (?:that )?you(?:'re| are) not (?:a )?(?:robot|bot))\b/i;
const VERIFICATION_ANCHORS = 'h1, h2, h3, h4, h5, h6, p, [role="heading"], [role="paragraph"], dialog, [role="dialog"], [title]';
const DIRECT_CHALLENGE_CONTROLS = 'canvas, iframe';
const CHALLENGE_BUTTONS = 'button, input[type="button"], input[type="submit"], [role="button"], [aria-label], [title]';
const IMAGE_GRID_CHOICES = 'input[type="checkbox"], input[type="radio"], [role="checkbox"], [role="radio"]';
/** The button that starts a verification step before its puzzle is rendered. */
const CHALLENGE_START_TEXT = /^\s*(?:begin|start)(?:\s+(?:the\s+)?(?:challenge|puzzle|verification|security check|check))?\s*$/i;
const CHALLENGE_CONTROL_TEXT = /\b(?:refresh|reload)\s+(?:the\s+)?(?:challenge|puzzle|verification)\b|\b(?:listen|play)\s+(?:the\s+)?(?:audio\s+)?(?:challenge|puzzle)\b|\bnew\s+(?:challenge|puzzle|verification)\b/i;

/** A widget only counts when a person could see a substantial part of it on the page. */
function renderedElement(element: Element): boolean {
  if (!element.isConnected || element.closest('template')) return false;
  const check = (element as Element & {
    checkVisibility?: (options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) => boolean;
  }).checkVisibility;
  if (typeof check === 'function') {
    if (!check.call(element, { checkOpacity: true, checkVisibilityCSS: true })) return false;
  } else {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility !== 'visible' || parseFloat(style.opacity) === 0) return false;
    }
  }
  const style = getComputedStyle(element);
  if (style.display === 'none' || style.visibility !== 'visible' || parseFloat(style.opacity) === 0) return false;
  const rect = element.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return false;
  const root = document.documentElement;
  if (!root) return false;
  const left = rect.left + scrollX;
  const top = rect.top + scrollY;
  return left + rect.width > 0 && top + rect.height > 0 && left < root.scrollWidth && top < root.scrollHeight;
}

/**
 * Detect a provider-independent verification gate only when its visible wording and challenge
 * control live in the same compact rendered region. This deliberately does not classify prose about
 * verification, or an ordinary canvas in a separate article section, as a CAPTCHA.
 */
async function detectVerificationGateInFrame(frame: Frame): Promise<boolean> {
  // Keep the whole generic scan in one execution context: pages often have hundreds of headings,
  // and a protocol round trip for each one makes a normal read unexpectedly expensive.
  return frame.evaluate(({ verificationText, anchorSelector, directControls, buttonSelector, choiceSelector, challengeButtonText, challengeStartText }) => {
    const verification = new RegExp(verificationText, 'i');
    const challengeButton = new RegExp(challengeButtonText, 'i');
    const startButton = new RegExp(challengeStartText, 'i');
    const visible = (element: Element): boolean => {
      if (!element.isConnected || element.closest('template')) return false;
      const check = (element as Element & {
        checkVisibility?: (options?: { checkOpacity?: boolean; checkVisibilityCSS?: boolean }) => boolean;
      }).checkVisibility;
      if (typeof check === 'function' && !check.call(element, { checkOpacity: true, checkVisibilityCSS: true })) return false;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility !== 'visible' || parseFloat(style.opacity) === 0) return false;
      const rect = element.getBoundingClientRect();
      const root = document.documentElement;
      if (!root) return false;
      const left = rect.left + scrollX;
      const top = rect.top + scrollY;
      return rect.width >= 10 && rect.height >= 10 && left + rect.width > 0 && top + rect.height > 0 &&
        left < root.scrollWidth && top < root.scrollHeight;
    };
    const text = (element: Element): string => [
      element instanceof HTMLElement ? element.innerText : '',
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
    ].filter(Boolean).join(' ');
    const quotedVerification = (value: string, start: number, end: number): boolean => {
      for (const [open, close] of [['"', '"'], ["'", "'"], ['“', '”'], ['‘', '’']]) {
        let cursor = 0;
        while (cursor < value.length) {
          const before = value.indexOf(open, cursor);
          if (before < 0 || before >= start) break;
          const after = value.indexOf(close, before + open.length);
          if (after < 0) break;
          if (end <= after) return true;
          cursor = after + close.length;
        }
      }
      return false;
    };
    const paragraphVerification = (value: string): boolean => {
      const matches = value.matchAll(new RegExp(verification.source, 'ig'));
      for (const match of matches) {
        const start = match.index ?? 0;
        if (!quotedVerification(value, start, start + match[0].length)) return true;
      }
      return false;
    };
    const anchorMatches = (element: Element): boolean => {
      if (!verification.test(text(element))) return false;
      const isParagraph = element.localName === 'p' || element.getAttribute('role') === 'paragraph';
      if (!isParagraph) return true;
      const visibleText = element instanceof HTMLElement ? element.innerText.replace(/\s+/g, ' ').trim() : '';
      return visibleText.length <= 120 && !element.closest('article, blockquote, q') &&
        paragraphVerification(visibleText);
    };
    const anchors = [...document.querySelectorAll(anchorSelector)]
      .filter(visible)
      .filter(anchorMatches);
    const titleMatches = verification.test(document.title);
    if (!anchors.length && !titleMatches) return false;

    const challengeButtons = [...document.querySelectorAll(buttonSelector)]
      .filter((element) => visible(element) && (challengeButton.test(text(element)) || startButton.test(text(element))));
    const controls = [
      ...[...document.querySelectorAll(directControls)].filter(visible),
      ...challengeButtons,
      ...[...document.querySelectorAll(choiceSelector)].filter((element) => {
        if (!visible(element)) return false;
        const region = element.parentElement?.parentElement ?? element.parentElement;
        return !!region && region.querySelectorAll('img, [role="img"]').length >= 3 &&
          region.querySelectorAll(choiceSelector).length >= 3;
      }),
    ];
    if (!controls.length) return false;

    const commonAncestor = (a: Element, b: Element): Element | null => {
      const seen = new Set<Element>();
      for (let node: Element | null = a; node; node = node.parentElement) seen.add(node);
      for (let node: Element | null = b; node; node = node.parentElement) if (seen.has(node)) return node;
      return null;
    };
    const compactRegion = (element: Element | null): boolean => {
      if (!element || ['html', 'body', 'main'].includes(element.localName)) return false;
      const rect = element.getBoundingClientRect();
      const root = document.documentElement;
      if (!root) return false;
      // A shared wrapper is evidence only when it is actually local to the pair. In particular,
      // a page-wide div must not turn unrelated sibling sections into a concise-page gate.
      return rect.width <= Math.min(640, root.clientWidth * 0.98) &&
        rect.height <= Math.min(600, root.clientHeight * 0.98);
    };
    const semanticRegion = (element: Element): boolean => {
      const role = element.getAttribute('role') ?? '';
      return ['article', 'aside', 'footer', 'header', 'nav', 'section'].includes(element.localName) ||
        /^(article|banner|complementary|contentinfo|navigation|region)$/.test(role);
    };
    const regionBoundary = (element: Element): boolean => {
      const role = element.getAttribute('role') ?? '';
      // A form commonly wraps the visual portion of an otherwise compact gate. It is not a
      // semantic split when the wording and widget share the surrounding compact region.
      return semanticRegion(element) || /^dialog$/.test(role) || element.localName === 'dialog';
    };
    const crossesSemanticRegion = (element: Element, stop: Element | null): boolean => {
      for (let node: Element | null = element; node && node !== stop; node = node.parentElement) {
        if (semanticRegion(node)) return true;
      }
      return false;
    };
    const sharedCompactRegion = (a: Element, b: Element): boolean => {
      const common = commonAncestor(a, b);
      if (!common || ['html', 'body', 'main'].includes(common.localName)) return false;
      // Two distinct semantic regions remain distinct even if a local wrapper encloses both.
      for (const start of [a, b]) {
        for (let node: Element | null = start; node && node !== common; node = node.parentElement) {
          if (regionBoundary(node)) return false;
        }
      }
      for (let node: Element | null = common; node && !['html', 'body', 'main'].includes(node.localName); node = node.parentElement) {
        if (compactRegion(node)) return true;
      }
      return false;
    };
    const textRects = (element: Element): DOMRect[] => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const rects = [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0);
      return rects.length ? rects : [element.getBoundingClientRect()];
    };
    const near = (a: Element, b: Element): boolean => {
      const control = b.getBoundingClientRect();
      // Block headings often span a page. Compare the control with the heading's text, not the
      // block box, so nearby but unrelated page sections do not become one gate.
      return textRects(a).some((heading) => {
        const horizontalGap = Math.max(heading.left - control.right, control.left - heading.right, 0);
        const verticalGap = Math.max(heading.top - control.bottom, control.top - heading.bottom, 0);
        return horizontalGap <= 180 && verticalGap <= 240;
      });
    };
    // A body-level group has no semantic container. Treat it as a gate only when the visible page
    // is itself concise, so a nearby heading and unrelated visual on a content-heavy page do not join.
    const littleOtherText = (document.body?.innerText ?? '').replace(/\s+/g, ' ').trim().length <= 320;
    const challengeIframe = (element: Element): boolean => element.localName === 'iframe' &&
      /\b(?:captcha|challenge|verification|verify|human|recaptcha|hcaptcha|turnstile|puzzle)\b/i
        .test(`${text(element)} ${element.getAttribute('src') ?? ''}`);
    const titleWidget = (control: Element): boolean => {
      if (challengeIframe(control)) return true;
      if (control.localName === 'canvas') {
        return challengeButtons.some((button) => sharedCompactRegion(control, button) && near(control, button));
      }
      return control.matches(choiceSelector);
    };

    return controls.some((control) => anchors.some((anchor) => {
      const container = commonAncestor(anchor, control);
      if (sharedCompactRegion(anchor, control)) return true;
      const documentWide = !container || ['html', 'body', 'main'].includes(container.localName);
      return near(anchor, control) && documentWide && littleOtherText &&
        !crossesSemanticRegion(anchor, container) && !crossesSemanticRegion(control, container);
    })) ||
      // A title has no local wording node. It can only support a widget that identifies itself as
      // a challenge (or a canvas paired with a challenge control), never an ordinary embed.
      (titleMatches && controls.some((control) => compactRegion(control.parentElement) && titleWidget(control)));
  }, {
    verificationText: VERIFICATION_TEXT.source,
    anchorSelector: VERIFICATION_ANCHORS,
    directControls: DIRECT_CHALLENGE_CONTROLS,
    buttonSelector: CHALLENGE_BUTTONS,
    choiceSelector: IMAGE_GRID_CHOICES,
    challengeButtonText: CHALLENGE_CONTROL_TEXT.source,
    challengeStartText: CHALLENGE_START_TEXT.source,
  }).catch(() => false);
}

async function detectVerificationGate(page: Page): Promise<boolean> {
  for (const frame of page.frames()) {
    try {
      // A hidden embedded document is not a visible gate, even if its contents match.
      if (frame !== page.mainFrame()) {
        const element = await frame.frameElement().catch(() => null);
        if (!element) continue;
        try {
          if (!await element.evaluate(renderedElement)) continue;
        } finally {
          await element.dispose();
        }
      }
      if (await detectVerificationGateInFrame(frame)) return true;
    } catch {
      // Cross-origin or detached frames are not enough evidence by themselves.
    }
  }
  return false;
}

/**
 * Warning line for read() if a known CAPTCHA widget is on the page, else null.
 * Invisible reCAPTCHA (v3 badge, `size=invisible`) needs no human, so it is ignored.
 */
export async function detectCaptcha(page: Page): Promise<string | null> {
  try {
    const candidates = await page.$$(CAPTCHA_CANDIDATES);
    for (const element of candidates) {
      try {
        const candidate = await element.evaluate((node) => ({
          widget: node.matches('.g-recaptcha, .h-captcha, .cf-turnstile'),
          invisible: node.getAttribute('data-size') === 'invisible',
          src: node.getAttribute('src') ?? '',
        }));
        const known = candidate.widget || FRAME_URL.test(candidate.src);
        if (known && !candidate.invisible && !/size=invisible/i.test(candidate.src) &&
            await element.evaluate(renderedElement)) return captchaWarning();
      } catch {
        // A candidate can detach while the page is settling; inspect the rest.
      } finally {
        await element.dispose();
      }
    }
    // Frames injected by a script that never reached the DOM query above (e.g. in shadow roots).
    for (const frame of page.frames()) {
      if (frame === page.mainFrame() || !FRAME_URL.test(frame.url()) || /size=invisible/i.test(frame.url())) continue;
      const element = await frame.frameElement().catch(() => null);
      if (!element) continue;
      try {
        if (await element.evaluate(renderedElement)) return captchaWarning();
      } finally {
        await element.dispose();
      }
    }
    if (await detectVerificationGate(page)) return captchaWarning();
    return null;
  } catch {
    return null;
  }
}
