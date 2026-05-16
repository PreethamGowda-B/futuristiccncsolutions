/**
 * js/scroll.js
 * GSAP ScrollSmoother + ScrollTrigger setup.
 *
 * On desktop (non-touch) devices, ScrollSmoother is initialised with the
 * smooth-wrapper / smooth-content pair defined in index.html.
 *
 * On touch devices the browser's native scroll-behavior: smooth (set in
 * css/base.css) is used instead — ScrollSmoother is skipped entirely to
 * avoid conflicts with native momentum scrolling.
 */

// ─── Module-level state ───────────────────────────────────────────────────────

/** @type {ScrollSmoother|null} The active ScrollSmoother instance (desktop only). */
let smoother = null;

/** @type {boolean} True when the current device is a touch device. */
const isTouchDevice =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window ||
    (typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)));

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialise the scroll system.
 *
 * Desktop: creates a ScrollSmoother instance and stores it in `smoother`.
 * Touch:   skips ScrollSmoother; native scroll-behavior: smooth handles it.
 *
 * Must be called after GSAP, ScrollTrigger, and ScrollSmoother are available
 * on the global scope (loaded via CDN <script> tags in index.html).
 *
 * @returns {ScrollSmoother|null} The smoother instance, or null on touch.
 */
export function initScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (
    isTouchDevice || 
    prefersReducedMotion ||
    typeof gsap === 'undefined' ||
    typeof ScrollTrigger === 'undefined' ||
    typeof ScrollSmoother === 'undefined'
  ) {
    document.body.classList.add('no-smoother');
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.normalizeScroll(false);
    }
    return null;
  }

  // Register plugins (safe to call multiple times).
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5,
    effects: true,
    normalizeScroll: true,
  });

  return smoother;
}

/**
 * Programmatically scroll to a CSS selector or element.
 *
 * Desktop: delegates to ScrollSmoother.scrollTo() for smooth momentum scroll.
 * Touch:   uses Element.scrollIntoView() with native smooth behaviour.
 *
 * @param {string|Element} target - CSS selector string or DOM element.
 */
export function scrollTo(target) {
  if (!isTouchDevice && smoother) {
    smoother.scrollTo(target, true);
  } else {
    const el =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Register a ScrollTrigger configuration and return the trigger instance.
 *
 * @param {object} cfg - A ScrollTrigger configuration object.
 * @returns {ScrollTrigger|null} The created trigger, or null if unavailable.
 */
export function registerTrigger(cfg) {
  if (typeof ScrollTrigger === 'undefined') {
    console.warn('[scroll.js] ScrollTrigger not available.');
    return null;
  }
  return ScrollTrigger.create(cfg);
}

/**
 * Register the navigation scroll trigger that adds/removes the `.scrolled`
 * class on `#main-nav` when the user scrolls past 80px.
 */
export function registerNavTrigger() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  registerTrigger({
    start: 'top -80',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
}

/**
 * Return the active ScrollSmoother instance (null on touch devices).
 *
 * @returns {ScrollSmoother|null}
 */
export function getSmoother() {
  return smoother;
}
