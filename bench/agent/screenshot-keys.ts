/** Translate the small, portable xdotool/X11 key vocabulary to Playwright keys. */
export type ScreenshotKeyMapping = { keys: string[] } | { error: string };

const ACCEPTED_FORMS = 'single characters; ctrl/control, alt, shift, super/meta/cmd; Return/Enter, BackSpace, Delete, Home, End, Page_Up/Prior, Page_Down/Next, Escape/Esc, Tab, space, arrows, F1-F12; use + for chords and spaces between presses';

const NAMED_KEYS: Record<string, string> = {
  ctrl: 'Control', control: 'Control', alt: 'Alt', shift: 'Shift',
  super: 'Meta', meta: 'Meta', cmd: 'Meta',
  return: 'Enter', enter: 'Enter', backspace: 'Backspace', delete: 'Delete',
  home: 'Home', end: 'End', page_up: 'PageUp', prior: 'PageUp',
  page_down: 'PageDown', next: 'PageDown', escape: 'Escape', esc: 'Escape',
  tab: 'Tab', space: 'Space',
  up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight',
};

/**
 * Maps an xdotool-style sequence without touching browser state, so callers can
 * reject typos rather than accidentally type them into a focused field.
 */
export function resolveScreenshotKeySequence(text: string): ScreenshotKeyMapping {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return { error: `unknown key: empty input. Accepted forms: ${ACCEPTED_FORMS}.` };
  const keys: string[] = [];
  for (const token of tokens) {
    const parts = token.split('+');
    if (parts.some((part) => !part)) return { error: `unknown key ${JSON.stringify(token)}. Accepted forms: ${ACCEPTED_FORMS}.` };
    const mapped: string[] = [];
    for (const part of parts) {
      const lower = part.toLowerCase();
      const named = NAMED_KEYS[lower];
      const functionKey = /^f([1-9]|1[0-2])$/i.exec(part);
      if (named) mapped.push(named);
      else if (functionKey) mapped.push(`F${functionKey[1]}`);
      else if ([...part].length === 1) mapped.push(part);
      else return { error: `unknown key ${JSON.stringify(part)}. Accepted forms: ${ACCEPTED_FORMS}.` };
    }
    keys.push(mapped.join('+'));
  }
  return { keys };
}

/** Resolve a click modifier string and reject non-modifier key names. */
export function resolveScreenshotModifiers(text: string | undefined): { modifiers: string[] } | { error: string } {
  if (!text) return { modifiers: [] };
  const mapped = resolveScreenshotKeySequence(text);
  if ('error' in mapped) return mapped;
  const modifiers = mapped.keys.flatMap((key) => key.split('+'));
  if (modifiers.some((key) => !['Control', 'Alt', 'Shift', 'Meta'].includes(key))) {
    return { error: `click modifiers must be ctrl/control, alt, shift, super/meta/cmd. Accepted key forms: ${ACCEPTED_FORMS}.` };
  }
  return { modifiers };
}
