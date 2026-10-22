import { describe, expect, it } from 'vitest';
import { resolveScreenshotKeySequence, resolveScreenshotModifiers } from '../bench/agent/screenshot-keys.js';

describe('resolveScreenshotKeySequence', () => {
  it.each([
    ['ctrl+a', ['Control+a']],
    ['CTRL+A', ['Control+A']],
    ['Return', ['Enter']],
    ['BackSpace', ['Backspace']],
    ['shift+End', ['Shift+End']],
    ['Home', ['Home']],
    ['Page_Down', ['PageDown']],
    ['f5', ['F5']],
    ['ctrl+a BackSpace Return', ['Control+a', 'Backspace', 'Enter']],
    ['x', ['x']],
  ])('maps %s', (text, keys) => {
    expect(resolveScreenshotKeySequence(text)).toEqual({ keys });
  });

  it.each(['CTRLL+A', 'hello', 'ctrl+', '', 'F13', 'ctrl+Foo'])('rejects %j instead of typing it', (text) => {
    const result = resolveScreenshotKeySequence(text);
    expect(result).toHaveProperty('error');
    expect((result as { error: string }).error).toContain('Accepted forms');
  });
});

describe('resolveScreenshotModifiers', () => {
  it('maps modifier-only text and treats absence as none', () => {
    expect(resolveScreenshotModifiers('ctrl+shift')).toEqual({ modifiers: ['Control', 'Shift'] });
    expect(resolveScreenshotModifiers(undefined)).toEqual({ modifiers: [] });
  });
  it('rejects non-modifier keys', () => {
    expect(resolveScreenshotModifiers('Return')).toHaveProperty('error');
  });
});
