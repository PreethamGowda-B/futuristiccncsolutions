import { describe, it } from 'vitest';
import fc from 'fast-check';

export function computeAttractedPosition(cx, cy, ex, ey, distance) {
  const strength = (60 - distance) / 60;
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
  const targetX = lerp(cx, ex, strength * 0.4);
  const targetY = lerp(cy, ey, strength * 0.4);
  return { x: targetX, y: targetY };
}

describe('cursor', () => {
  it('should attract cursor correctly', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -500, max: 500, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: -500, max: 500, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: -500, max: 500, noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: -500, max: 500, noNaN: true, noDefaultInfinity: true }),
        (cx, cy, ex, ey) => {
          const dist = Math.hypot(ex - cx, ey - cy);
          if (dist >= 60 || dist === 0) return true;
          const a = computeAttractedPosition(cx, cy, ex, ey, dist);
          const dAfter = Math.hypot(ex - a.x, ey - a.y);
          return dAfter <= dist + 1e-9;
        }
      ),
      { numRuns: 100 }
    );
  });
});
