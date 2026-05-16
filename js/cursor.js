/**
 * js/cursor.js
 * Magnetic Cursor module for Futuristic CNC Solutions website.
 *
 * Task 7.1 — Foundation:
 *   - Exports initCursor() that hides the default CSS cursor on body (desktop only,
 *     window.innerWidth > 1024), ensures #cursor-dot and #cursor-ring exist in the DOM,
 *     and binds mousemove to updateCursor.
 *
 * Tasks 7.2–7.5 will add further exports to this file:
 *   - updateCursor(x, y)   — magnetic attraction algorithm
 *   - setCursorState(state) — 'default' | 'hover' | 'text' | 'hidden'
 *   - Hover/leave bindings on interactive elements
 *   - Touch / small-viewport guard
 */

// ─── Module-level state ──────────────────────────────────────────────────────

/** @type {HTMLElement|null} */
let dot = null;

/** @type {HTMLElement|null} */
let ring = null;

/** Whether the cursor has been initialised on this page load */
let _initialised = false;

/**
 * Tracks the current logical cursor position so the magnetic algorithm
 * can interpolate from the last known position each frame.
 * Updated on every mousemove before the attraction pass.
 */
export const cursor = { x: 0, y: 0 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Linear interpolation between two values.
 *
 * @param {number} a  - start value
 * @param {number} b  - end value
 * @param {number} t  - interpolation factor [0, 1]
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Pure function: given a cursor position, an element center, and the
 * pre-computed Euclidean distance between them, returns the attracted
 * cursor position according to the magnetic algorithm.
 *
 * If distance >= 60 (outside the attraction radius) the cursor position
 * is returned unchanged.
 *
 * This function is exported so it can be used in property-based tests
 * (task 12.6) without any DOM dependency.
 *
 * @param {number} cx       - cursor X
 * @param {number} cy       - cursor Y
 * @param {number} ex       - element center X
 * @param {number} ey       - element center Y
 * @param {number} distance - Euclidean distance between cursor and element center
 * @returns {{ x: number, y: number }}
 */
export function computeAttractedPosition(cx, cy, ex, ey, distance) {
  if (distance >= 60) {
    return { x: cx, y: cy };
  }

  const strength = (60 - distance) / 60; // 0..1
  return {
    x: lerp(cx, ex, strength * 0.4),
    y: lerp(cy, ey, strength * 0.4),
  };
}

/**
 * Returns true when the cursor should be active:
 *   - Not a touch device
 *   - Viewport wider than 1024 px
 *
 * @returns {boolean}
 */
function _isDesktop() {
  return !('ontouchstart' in window) && window.innerWidth > 1024;
}

/**
 * Ensures #cursor-dot and #cursor-ring exist in the DOM.
 * If they are already present (added in index.html) they are reused;
 * otherwise they are created and appended to <body>.
 */
function _ensureCursorElements() {
  dot = document.getElementById('cursor-dot');
  ring = document.getElementById('cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * updateCursor — called on every mousemove event.
 *
 * Implements the magnetic attraction algorithm:
 *   1. Update the module-level cursor position tracker.
 *   2. Iterate all interactive elements (button, a, [data-magnetic]).
 *   3. For each element within 60 px, compute an attracted target position
 *      using computeAttractedPosition().
 *   4. Move #cursor-dot to the target position instantly (transform).
 *   5. Animate #cursor-ring to the target position via GSAP.
 *
 * @param {number} x  - clientX from the MouseEvent
 * @param {number} y  - clientY from the MouseEvent
 */
export function updateCursor(x, y) {
  if (!dot || !ring) return;

  // 1. Update the tracked cursor position.
  cursor.x = x;
  cursor.y = y;

  // 2. Default target is the raw cursor position (no attraction).
  let targetX = x;
  let targetY = y;

  // 3. Magnetic attraction pass — find the closest element inside the radius.
  const magneticEls = document.querySelectorAll('button, a, [data-magnetic]');

  magneticEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const ex = rect.left + rect.width / 2;
    const ey = rect.top + rect.height / 2;
    const distance = Math.hypot(ex - x, ey - y);

    if (distance < 60) {
      const attracted = computeAttractedPosition(x, y, ex, ey, distance);
      // Use the first (or strongest) attraction found.
      // If multiple elements are in range the last one wins; for typical
      // layouts elements rarely overlap so this is acceptable.
      targetX = attracted.x;
      targetY = attracted.y;
    }
  });

  // 4. Move #cursor-dot instantly.
  dot.style.transform = `translate(${targetX}px, ${targetY}px)`;

  // 5. Animate #cursor-ring with GSAP (gracefully degrade if GSAP unavailable).
  if (typeof gsap !== 'undefined') {
    gsap.to(ring, {
      x: targetX,
      y: targetY,
      duration: 0.1,
      ease: 'power2.out',
    });
  } else {
    ring.style.transform = `translate(${targetX}px, ${targetY}px)`;
  }
}

/**
 * setCursorState — changes the visual appearance of the custom cursor.
 *
 * States:
 *   'default' — restore ring to 40×40 px outlined circle, dot to 16×16 px
 *               filled circle, full opacity on both elements.
 *   'hover'   — scale ring to 60×60 px and fill it with rgba(0,212,255,0.15).
 *   'text'    — morph dot into a narrow text-cursor bar (2 px × 20 px),
 *               hide the ring so only the bar is visible.
 *   'hidden'  — set opacity 0 on both dot and ring (e.g. cursor left window).
 *
 * All transitions are driven by GSAP for smooth interpolation.
 * Falls back to direct style assignment when GSAP is unavailable.
 *
 * @param {'default'|'hover'|'text'|'hidden'} state
 */
export function setCursorState(state) {
  if (!dot || !ring) return;

  // Shared GSAP tween options for smooth transitions.
  const DURATION = 0.25;
  const EASE = 'power2.out';

  switch (state) {
    case 'hover': {
      // Scale ring up to 60 px and fill with a translucent neon tint.
      if (typeof gsap !== 'undefined') {
        gsap.to(ring, {
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(0,212,255,0.15)',
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        });
        // Keep dot at default size and fully visible.
        gsap.to(dot, {
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        });
      } else {
        ring.style.width = '60px';
        ring.style.height = '60px';
        ring.style.backgroundColor = 'rgba(0,212,255,0.15)';
        ring.style.opacity = '1';
      }
      break;
    }

    case 'text': {
      // Morph dot into a narrow vertical text-cursor bar (2 px × 20 px).
      // Hide the ring so only the bar is visible.
      if (typeof gsap !== 'undefined') {
        gsap.to(dot, {
          width: '2px',
          height: '20px',
          borderRadius: '1px',
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        });
        gsap.to(ring, {
          opacity: 0,
          duration: DURATION,
          ease: EASE,
        });
      } else {
        dot.style.width = '2px';
        dot.style.height = '20px';
        dot.style.borderRadius = '1px';
        ring.style.opacity = '0';
      }
      break;
    }

    case 'hidden': {
      // Make both elements invisible (cursor has left the viewport or is
      // over an area where it should not be shown).
      if (typeof gsap !== 'undefined') {
        gsap.to([dot, ring], {
          opacity: 0,
          duration: DURATION,
          ease: EASE,
        });
      } else {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
      }
      break;
    }

    case 'default':
    default: {
      // Restore both elements to their baseline appearance.
      if (typeof gsap !== 'undefined') {
        gsap.to(dot, {
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        });
        gsap.to(ring, {
          width: '40px',
          height: '40px',
          backgroundColor: 'transparent',
          opacity: 1,
          duration: DURATION,
          ease: EASE,
        });
      } else {
        dot.style.width = '16px';
        dot.style.height = '16px';
        dot.style.borderRadius = '50%';
        dot.style.opacity = '1';
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.backgroundColor = 'transparent';
        ring.style.opacity = '1';
      }
      break;
    }
  }
}

/**
 * bindCursorEvents — attaches mouseenter/mouseleave listeners to interactive
 * and text elements so the cursor state changes automatically as the user
 * moves over them.
 *
 * Interactive elements (button, a, [data-magnetic], .service-card,
 * .gallery-item, .industry-tile, .differentiator-card):
 *   mouseenter → setCursorState('hover')
 *   mouseleave → setCursorState('default')
 *
 * Text content areas (p, h1–h6, label, .about-narrative, .service-short-desc):
 *   mouseenter → setCursorState('text')
 *   mouseleave → setCursorState('default')
 *
 * Called automatically by initCursor() after the mousemove binding.
 */
export function bindCursorEvents() {
  // ── Interactive elements ────────────────────────────────────────────────
  const interactiveSelectors = [
    'button',
    'a',
    '[data-magnetic]',
    '.service-card',
    '.gallery-item',
    '.industry-tile',
    '.differentiator-card',
  ].join(', ');

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => setCursorState('hover'));
    el.addEventListener('mouseleave', () => setCursorState('default'));
  });

  // ── Text content areas ──────────────────────────────────────────────────
  const textSelectors = [
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'label',
    '.about-narrative',
    '.service-short-desc',
  ].join(', ');

  document.querySelectorAll(textSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => setCursorState('text'));
    el.addEventListener('mouseleave', () => setCursorState('default'));
  });
}

/**
 * initCursor — initialises the magnetic cursor system.
 *
 * On desktop viewports (> 1024 px, non-touch):
 *   1. Hides the default CSS cursor on <body>.
 *   2. Ensures #cursor-dot and #cursor-ring exist in the DOM.
 *   3. Binds mousemove on the document to updateCursor.
 *   4. Binds hover/leave events on interactive and text elements via
 *      bindCursorEvents().
 *
 * On touch devices or viewports ≤ 1024 px the function returns early,
 * restores cursor: auto on body, and sets opacity 0 on #cursor-dot and
 * #cursor-ring so they remain invisible even if inline styles were applied.
 */
export function initCursor() {
  if (_initialised) return;

  // Guard: touch devices and small viewports — skip entirely.
  if (!_isDesktop()) {
    // Ensure the default cursor is visible (defensive reset).
    document.body.style.cursor = 'auto';

    // Explicitly hide cursor elements in case they were partially initialised
    // or have inline styles from a previous run (e.g. hot-reload / resize).
    const dotEl = document.getElementById('cursor-dot');
    const ringEl = document.getElementById('cursor-ring');
    if (dotEl) dotEl.style.opacity = '0';
    if (ringEl) ringEl.style.opacity = '0';

    return;
  }

  // 1. Ensure DOM elements exist (reuse from HTML or create dynamically).
  _ensureCursorElements();

  // 2. Hide the native OS cursor on the body.
  document.body.style.cursor = 'none';

  // 3. Bind mousemove → updateCursor.
  document.addEventListener('mousemove', (e) => {
    updateCursor(e.clientX, e.clientY);
  });

  // 4. Bind hover/leave state changes on interactive and text elements.
  bindCursorEvents();

  _initialised = true;
}
