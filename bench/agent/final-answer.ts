/**
 * Result rows are the fallback source for blind and deterministic regrading when
 * an archived transcript is unavailable. Keep the complete final reply: callers
 * decide any presentation limits separately.
 */
export const retainFinalAnswer = (answer: string): string => answer;
