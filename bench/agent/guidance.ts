/** Shared, task-neutral instructions appended by the browser benchmark harness. */
export const EXPLICIT_ACTION_GUIDANCE = 'Perform explicitly requested UI actions even when the answer is already present in page text or the accessibility tree. The requested row and column keys are the visible UI labels, and values must use their displayed formatting; never substitute implementation IDs, source fields, or normalized machine values.';

/** This deliberately states the positive completion condition without encouraging early exits. */
export const COMPLETION_GUIDANCE = 'Once every requested action and constraint is verified and the required answer is available, return the final answer.';

/** Screenshot agents have pixels and keyboard input, but no DOM/select inspection. */
export const NATIVE_SELECT_KEYBOARD_GUIDANCE = 'For a native dropdown, click it to focus, use ArrowDown or ArrowUp to choose, press Enter, then take a screenshot to verify the displayed selection.';
