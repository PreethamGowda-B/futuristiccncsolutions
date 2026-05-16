import { describe, it } from 'vitest';
import fc from 'fast-check';

export function computeCounterValue(target, elapsed, duration) {
  return Math.round(Math.min(elapsed / duration, 1) * target);
}

describe('counter', () => {
  it('should compute counter values correctly within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        fc.float({ min: 0, max: 1 }),
        (target, fraction) => {
          const v = computeCounterValue(target, fraction * 2, 2);
          return v >= 0 && v <= target;
        }
      ),
      { numRuns: 100 }
    );
  });
});
