import { z } from 'zod';

export type ScreenshotScrollDirection = 'up' | 'down' | 'left' | 'right';

export interface ScreenshotScrollInput {
  direction?: ScreenshotScrollDirection;
  /** Screen-pixel magnitude for a directional scroll; defaults to 700. */
  amount?: number;
  /** Direct wheel deltas; use these instead of `direction` for diagonal/custom movement. */
  deltaX?: number;
  deltaY?: number;
  /** Optional viewport coordinate at which to target the wheel event. */
  x?: number;
  y?: number;
}

export const SCREENSHOT_SCROLL_DESCRIPTION = 'Scroll the page or the scrollable UI under an optional viewport coordinate. Use direction (up/down/left/right) with optional amount, or direct deltaX/deltaY for custom or diagonal movement.';

export const screenshotScrollSchema = z.object({
  direction: z.enum(['up', 'down', 'left', 'right']).optional(),
  amount: z.number().positive().max(5_000).optional(),
  deltaX: z.number().min(-5_000).max(5_000).optional(),
  deltaY: z.number().min(-5_000).max(5_000).optional(),
  x: z.number().min(0).max(1_280).optional(),
  y: z.number().min(0).max(800).optional(),
}).refine(({ x, y }) => (x === undefined) === (y === undefined), { message: 'x and y must be supplied together' })
  .refine(({ direction, deltaX, deltaY }) => !direction || (deltaX === undefined && deltaY === undefined), { message: 'use direction or deltaX/deltaY, not both' })
  .refine(({ amount, deltaX, deltaY }) => amount === undefined || (deltaX === undefined && deltaY === undefined), { message: 'amount applies only to directional scrolling' })
  .refine(({ deltaX, deltaY }) => deltaX === undefined && deltaY === undefined || (deltaX ?? 0) !== 0 || (deltaY ?? 0) !== 0, { message: 'a direct wheel delta must move on at least one axis' });

/** Convert the public API to Playwright mouse-wheel pixel deltas deterministically. */
export function resolveScreenshotScroll(input: ScreenshotScrollInput): { deltaX: number; deltaY: number } {
  if (input.deltaX !== undefined || input.deltaY !== undefined) {
    return { deltaX: input.deltaX ?? 0, deltaY: input.deltaY ?? 0 };
  }
  const amount = input.amount ?? 700;
  switch (input.direction ?? 'down') {
    case 'up': return { deltaX: 0, deltaY: -amount };
    case 'left': return { deltaX: -amount, deltaY: 0 };
    case 'right': return { deltaX: amount, deltaY: 0 };
    default: return { deltaX: 0, deltaY: amount };
  }
}
