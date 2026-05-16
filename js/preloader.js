/**
 * js/preloader.js
 * Preloader asset tracking and exit animation.
 *
 * Task 8.1 — initPreloader()
 * Task 8.2 — exitPreloader()  (stub; implemented in task 8.2)
 */

// ─── Internal state ──────────────────────────────────────────────────────────

/** @type {HTMLElement|null} */
let _bar = null;

/** @type {HTMLElement|null} */
let _percent = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Update the progress bar and percentage counter.
 * @param {number} loaded  Number of assets that have finished loading.
 * @param {number} total   Total number of tracked assets.
 */
function _updateProgress(loaded, total) {
  const pct = total > 0 ? Math.round((loaded / total) * 100) : 100;

  if (_bar) {
    _bar.style.width = `${pct}%`;
  }

  if (_percent) {
    _percent.textContent = String(pct);
  }
}

/**
 * Return a Promise that resolves when the given <img> element has loaded
 * (or immediately if it is already complete).
 * @param {HTMLImageElement} img
 * @returns {Promise<void>}
 */
function _trackImage(img) {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
    } else {
      img.addEventListener('load', () => resolve(), { once: true });
      img.addEventListener('error', () => resolve(), { once: true }); // count errors as "done"
    }
  });
}

/**
 * Return a Promise that resolves when the given <video> element has loaded
 * enough metadata (or immediately if it already has).
 * @param {HTMLVideoElement} video
 * @returns {Promise<void>}
 */
function _trackVideo(video) {
  return new Promise((resolve) => {
    // readyState >= 1 means HAVE_METADATA
    if (video.readyState >= 1) {
      resolve();
    } else {
      video.addEventListener('loadedmetadata', () => resolve(), { once: true });
      video.addEventListener('error', () => resolve(), { once: true });
    }
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialise the preloader and begin tracking asset loading progress.
 *
 * Collects all <img> elements and the hero <video> element, then resolves
 * the returned Promise once every tracked asset has loaded (or after a 5-second
 * safety-net timeout, whichever comes first).
 *
 * Progress is reflected in real-time via:
 *   • #preloader-bar  — width set as a percentage string
 *   • #preloader-percent — textContent set to the integer percentage
 *
 * @returns {Promise<void>}
 */
export function initPreloader() {
  // Cache DOM references
  _bar     = document.getElementById('preloader-bar');
  _percent = document.getElementById('preloader-percent');

  // Collect trackable assets
  const images = Array.from(document.querySelectorAll('img'));
  const video  = document.querySelector('#hero video');

  /** @type {Array<Promise<void>>} */
  const assetPromises = [];

  images.forEach((img) => assetPromises.push(_trackImage(img)));

  if (video) {
    assetPromises.push(_trackVideo(/** @type {HTMLVideoElement} */ (video)));
  }

  const total = assetPromises.length;

  // If there is nothing to track, resolve immediately at 100 %
  if (total === 0) {
    _updateProgress(0, 0);
    return Promise.resolve();
  }

  // Set initial state
  _updateProgress(0, total);

  // Wrap each asset promise so we can update the counter as each one settles
  let loaded = 0;

  const trackingPromises = assetPromises.map((p) =>
    p.then(() => {
      loaded += 1;
      _updateProgress(loaded, total);
    })
  );

  // Race: all assets loaded vs. 5-second safety-net timeout
  const allLoaded = Promise.all(trackingPromises);
  const timeout   = new Promise((resolve) => setTimeout(resolve, 5000));

  return Promise.race([allLoaded, timeout]).then(() => {
    // Guarantee the bar shows 100 % after the race resolves
    _updateProgress(total, total);
  });
}

/**
 * Exit the preloader with a cinematic GSAP wipe animation.
 *
 * Timeline:
 *   1. Animate #preloader-bar to 100 % width over 1.2 s
 *   2. Snap #preloader-percent to "100"
 *   3. Clip-path wipe #preloader out (inset 0 0 100% 0) over 0.8 s
 *   4. Fade in #hero-content from opacity 0, y 30
 *
 * NOTE: Implemented in task 8.2. This stub is intentionally left here so
 * that main.js can import the symbol without errors before 8.2 is complete.
 *
 * @returns {void}
 */
export function exitPreloader() {
  // Task 8.2 — exitPreloader() implementation
  const tl = gsap.timeline();

  tl.to('#preloader-bar', {
    width: '100%',
    duration: 1.2,
    ease: 'power2.inOut'
  }, 0)
  .set('#preloader-percent', { textContent: 100 }, 0)
  .to('#preloader', {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.style.display = 'none';
    }
  })
  .fromTo('.hero-content', 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    '-=0.4'
  );
}
