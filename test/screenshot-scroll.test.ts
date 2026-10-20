import { expect, it } from 'vitest';
import { NATIVE_SELECT_KEYBOARD_GUIDANCE } from '../bench/agent/guidance.js';
import { resolveScreenshotScroll, SCREENSHOT_SCROLL_DESCRIPTION, screenshotScrollSchema } from '../bench/agent/screenshot-scroll.js';

it('resolves directional, horizontal, and direct screenshot scrolling deterministically', () => {
  expect(resolveScreenshotScroll({ direction: 'down' })).toEqual({ deltaX: 0, deltaY: 700 });
  expect(resolveScreenshotScroll({ direction: 'left', amount: 240 })).toEqual({ deltaX: -240, deltaY: 0 });
  expect(resolveScreenshotScroll({ direction: 'right', amount: 240 })).toEqual({ deltaX: 240, deltaY: 0 });
  expect(resolveScreenshotScroll({ deltaX: 30, deltaY: -45 })).toEqual({ deltaX: 30, deltaY: -45 });
});

it('requires a complete coordinate target and one coherent scrolling mode', () => {
  expect(screenshotScrollSchema.safeParse({ x: 20 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ x: 20, y: 30, direction: 'right', amount: 120 }).success).toBe(true);
  expect(screenshotScrollSchema.safeParse({ direction: 'right', deltaX: 120 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ amount: 120, deltaY: 120 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ deltaX: 0, deltaY: 0 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ deltaX: 0 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ deltaY: 0 }).success).toBe(false);
  expect(screenshotScrollSchema.safeParse({ deltaX: 25, deltaY: -40 }).success).toBe(true);
});

it('keeps screenshot guidance pixel-only and gives native selects generic keyboard recovery', () => {
  expect(SCREENSHOT_SCROLL_DESCRIPTION).toContain('optional viewport coordinate');
  expect(SCREENSHOT_SCROLL_DESCRIPTION).toContain('deltaX/deltaY');
  expect(NATIVE_SELECT_KEYBOARD_GUIDANCE).toContain('ArrowDown or ArrowUp');
  expect(NATIVE_SELECT_KEYBOARD_GUIDANCE).toContain('press Enter');
  expect(NATIVE_SELECT_KEYBOARD_GUIDANCE).toContain('screenshot to verify');
  expect(NATIVE_SELECT_KEYBOARD_GUIDANCE).not.toMatch(/\b(?:\d{2,}|option \w+|at \()\b/i);
});
