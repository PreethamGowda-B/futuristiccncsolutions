# Tasks: Futuristic CNC Solutions Website

## Overview

Implementation tasks for the Futuristic CNC Solutions ultra-premium static website. Tasks are ordered by dependency — each group builds on the previous. The stack is HTML5 + CSS3 + vanilla ES6+ JS, Three.js r160+, GSAP 3.12+ (ScrollTrigger + ScrollSmoother), and fast-check for property-based testing.

---

## Task List

- [x] 1. Project Setup and Foundation
  - [x] 1.1 Create the root directory structure: `css/`, `js/`, `js/sections/`, `assets/models/`, `assets/images/`, `assets/video/`, `assets/fonts/`
  - [x] 1.2 Create `package.json` with dev dependencies: `live-server`, `vitest`, `fast-check`, and a `test` script pointing to Vitest
  - [x] 1.3 Create `css/tokens.css` with all CSS custom properties defined in the design document (colors, glass, typography, spacing, animation, z-index layers)
  - [x] 1.4 Create `css/base.css` with CSS reset, `box-sizing: border-box`, `scroll-behavior: smooth`, body background `#0A0A0A`, Google Fonts import (Orbitron + Inter), and base typography rules
  - [x] 1.5 Create `css/layout.css` with section padding using `--section-padding`, `.container` max-width `--container-max`, responsive grid utilities, and the three breakpoint media queries (mobile <768px, tablet 768–1199px, desktop ≥1200px)
  - [x] 1.6 Create `css/components.css` with glassmorphism card mixin (backdrop-filter blur 20px, semi-transparent bg, neon border), button variants (primary filled, secondary outlined), form field styles, and neon glow hover states
  - [x] 1.7 Create `css/cursor.css` with `#cursor-dot` (16px filled neon circle) and `#cursor-ring` (40px outlined ring) styles, pointer-events none, fixed positioning, and transition states for hover/text/hidden modes
  - [x] 1.8 Create `css/preloader.css` with fullscreen overlay, centered logo, animated progress bar, percentage counter, and z-index `--z-preloader`
  - [x] 1.9 Create `css/animations.css` with CSS keyframe animations: industrial grid background (subtle neon grid lines at 5% opacity), glow pulse, float drift, and scroll-indicator chevron bounce

- [x] 2. HTML Structure (`index.html`)
  - [x] 2.1 Create `index.html` with `<!DOCTYPE html>`, `<html lang="en">`, `<head>` containing charset, viewport meta tag, title "Futuristic CNC Solutions | Precision Engineering Redefined", Google Fonts link, and all CSS file links in order (tokens → base → layout → components → cursor → preloader → animations)
  - [x] 2.2 Add CDN `<script>` tags in `<head>` (or before `</body>`) for Three.js r160 ES module, GSAP 3.12 UMD, ScrollTrigger plugin, and ScrollSmoother plugin; add the main entry `<script type="module" src="js/main.js">` as the last script
  - [x] 2.3 Add the preloader markup: `<div id="preloader">` containing the company logo/wordmark, `<div id="preloader-bar">` progress bar, and `<span id="preloader-percent">0</span>%`
  - [x] 2.4 Add `<div id="cursor-dot"></div>` and `<div id="cursor-ring"></div>` as direct children of `<body>` before all sections
  - [x] 2.5 Add `<header>` / `<nav id="main-nav">` with company logo on the left and `<ul>` of navigation links (Hero, About, Services, Machine Showcase, Industries, Gallery, Why Choose Us, Contact) on the right; include hamburger button `<button id="nav-toggle">` for mobile
  - [x] 2.6 Wrap all scrollable content in `<div id="smooth-wrapper"><div id="smooth-content">` as required by GSAP ScrollSmoother
  - [x] 2.7 Add `<section id="hero">` with: `<video>` background (muted, autoplay, loop, playsinline), dark overlay div, Three.js `<canvas id="hero-canvas">`, and `<div class="hero-content">` containing `<h1 class="hero-title">FUTURISTIC CNC SOLUTIONS</h1>`, subheading, paragraph, two CTA buttons, and scroll-down indicator
  - [x] 2.8 Add `<section id="about">` with two-column layout: left column for heading, company narrative, and four counter stat elements (`<span class="counter" data-target="10">`, etc.), right column for visual/image placeholder, and a glassmorphism values card
  - [x] 2.9 Add `<section id="services">` with heading "OUR SERVICES" and a responsive grid of eight `.service-card` elements, each containing an icon placeholder, `<h3>` title, short description `<p>`, and hidden expanded description div
  - [x] 2.10 Add `<section id="machine-showcase">` with heading, three `.machine-viewport` containers each holding a `<canvas class="machine-canvas">`, floating spec tag elements, and a hidden `<div id="spec-panel">` for the slide-in specification panel
  - [x] 2.11 Add `<section id="industries">` with heading "INDUSTRIES WE SERVE" and six `.industry-tile` elements (Automotive, Aerospace, Manufacturing, Tool Rooms, Heavy Engineering, Precision Component Industries), each with icon, name, and tagline
  - [x] 2.12 Add `<section id="gallery">` with heading and a masonry/grid container of 12 `.gallery-item` elements with `<img loading="lazy">` tags (descriptive alt text), overlay divs, and a `<div id="lightbox">` modal with image display, prev/next buttons, and close button
  - [x] 2.13 Add `<section id="why-us">` with heading, six `.differentiator-card` glassmorphism elements (icon + heading + description), a large decorative background number/shape, and a CTA banner with "Get a Free Consultation" button
  - [x] 2.14 Add `<section id="contact">` with two-column layout: left column containing the contact form (Name, Company Name, Phone, Email, Service dropdown with all 8 options, Message textarea, Submit button, `.form-success` hidden panel), right column containing address, phone links (`tel:`), GST number, Google Maps iframe, and social/WhatsApp icon links
  - [x] 2.15 Add `<footer id="footer">` with company name, tagline, quick nav links, address, phone, GST, copyright notice, and neon gradient top border

- [x] 3. Three.js Engine (`js/engine.js`)
  - [x] 3.1 Create `js/engine.js` exporting `initEngine(canvas)` that creates a `THREE.WebGLRenderer` with `antialias: true`, sets `pixelRatio` to `Math.min(window.devicePixelRatio, 2)`, enables shadow maps, sets `toneMapping` to `THREE.ACESFilmicToneMapping`, and sizes the renderer to fill the viewport
  - [x] 3.2 Add `getScene()`, `getRenderer()`, and `getCamera()` exports; camera is `PerspectiveCamera(75, aspect, 0.1, 1000)` with a `resize` event listener that updates aspect ratio and projection matrix
  - [x] 3.3 Add scene lighting: `AmbientLight(0x111111, 0.5)`, `DirectionalLight(0xffffff, 1.5)` at position (5, 10, 5) with shadow casting enabled, and `PointLight(0x00D4FF, 2)` at (-3, 3, 3)
  - [x] 3.4 Add `startLoop(callback)` that runs `requestAnimationFrame` recursively, computes a `delta` time value, calls the optional callback each frame, and stores the animation frame ID; add `pauseLoop()` and `resumeLoop()` that cancel/restart the loop
  - [x] 3.5 Wire `document.addEventListener('visibilitychange', ...)` in `engine.js` to call `pauseLoop()` when `document.hidden` is true and `resumeLoop()` when false

- [x] 4. Particle System (`js/particles.js`)
  - [x] 4.1 Create `js/particles.js` exporting `createParticleSystem(scene, count)` that builds a `THREE.BufferGeometry` with `count` random positions in a 20×20×10 box, creates `THREE.PointsMaterial` with `color: 0x00D4FF`, `size: 0.05`, `transparent: true`, `opacity: 0.8`, and adds the `THREE.Points` mesh to the scene
  - [x] 4.2 Export `updateParticles(delta)` that drifts each particle position by its stored random velocity vector each frame, wrapping positions back into the bounding box when they exit
  - [x] 4.3 Export `setParticleCount(n)` that disposes the existing geometry and recreates the particle system with the new count (used to reduce to 100 on mobile)
  - [x] 4.4 Add smoke effect: create 5 large `THREE.PlaneGeometry` meshes with `MeshBasicMaterial({ transparent: true, opacity: 0.04 })`, position them at varying Z depths in the hero area, and animate their opacity between 0.02–0.08 each frame using a sine wave

- [x] 5. Machine Showcase (`js/machines.js`)
  - [x] 5.1 Create `js/machines.js` with the three machine data objects (VMC, HMC, and a third machine type) containing `id`, `name`, `axes`, `spindleSpeed`, `applications`, and `geometry` fields
  - [x] 5.2 Export `initMachines(scene)` that attempts to load GLTF models via `THREE.GLTFLoader`; on load failure, falls back to building each machine from `BoxGeometry`, `CylinderGeometry`, and `TorusGeometry` primitives with `MeshStandardMaterial({ metalness: 0.9, roughness: 0.2 })`
  - [x] 5.3 Export `onMachineHover(index)` that increases the hovered machine's rotation speed multiplier to 3× and adds a `PointLight(0x00D4FF, 3)` rim light positioned behind the model; export `onMachineLeave(index)` that restores defaults
  - [x] 5.4 Export `onMachineClick(index)` that populates the `#spec-panel` with the clicked machine's data and triggers a GSAP slide-in animation from the right (`x: 100% → 0`)
  - [x] 5.5 Export `updateMachines(delta)` that applies per-frame Y-axis rotation to each machine group using its current rotation speed
  - [x] 5.6 Export `enableOrbitControls(canvas, index)` that attaches mouse/touch drag-rotate interaction to the specified machine canvas using either `THREE.OrbitControls` (if available via CDN) or a custom `mousedown`/`mousemove`/`mouseup` + `touchstart`/`touchmove` implementation

- [x] 6. Scroll System (`js/scroll.js`)
  - [x] 6.1 Create `js/scroll.js` exporting `initScroll()` that calls `ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.5, effects: true, normalizeScroll: true })` and stores the instance; detect touch devices and skip ScrollSmoother on touch, relying on native `scroll-behavior: smooth` instead
  - [x] 6.2 Export `scrollTo(target)` that calls `smoother.scrollTo(target, true)` on desktop or `document.querySelector(target).scrollIntoView({ behavior: 'smooth' })` on touch
  - [x] 6.3 Export `registerTrigger(cfg)` that calls `ScrollTrigger.create(cfg)` and returns the trigger instance
  - [x] 6.4 Register the navigation scroll trigger: `ScrollTrigger.create({ start: 'top -80', onEnter: () => nav.classList.add('scrolled'), onLeaveBack: () => nav.classList.remove('scrolled') })`
  - [x] 6.5 Apply `data-speed` and `data-lag` attributes to background and foreground elements in HTML (background layers get `data-speed="0.4"`, foreground content `data-speed="1"`, subtle depth elements `data-lag="0.2"`) and verify ScrollSmoother picks them up

- [x] 7. Magnetic Cursor (`js/cursor.js`)
  - [x] 7.1 Create `js/cursor.js` exporting `initCursor()` that hides the default CSS cursor on `body` (desktop only, `window.innerWidth > 1024`), creates the `#cursor-dot` and `#cursor-ring` DOM elements if not already in HTML, and binds `mousemove` to `updateCursor`
  - [x] 7.2 Export `updateCursor(x, y)` implementing the magnetic attraction algorithm: iterate all `button, a, [data-magnetic]` elements, compute Euclidean distance to each, and if distance < 60px compute `strength = (60 - distance) / 60`, then `targetX = lerp(cursor.x, element.center.x, strength * 0.4)` and `targetY = lerp(cursor.y, element.center.y, strength * 0.4)`; move `#cursor-dot` to `(targetX, targetY)` instantly and animate `#cursor-ring` with `gsap.to(ring, { x, y, duration: 0.1, ease: 'power2.out' })`
  - [x] 7.3 Export `setCursorState(state)` accepting `'default' | 'hover' | 'text' | 'hidden'`; `hover` scales ring to 60px and fills with `rgba(0,212,255,0.15)`; `text` morphs dot to a text-cursor shape; `hidden` sets opacity 0
  - [x] 7.4 Bind `mouseenter`/`mouseleave` on all interactive elements to call `setCursorState('hover')` / `setCursorState('default')` and bind on text content areas to call `setCursorState('text')`
  - [x] 7.5 On touch devices (`'ontouchstart' in window`) and viewports ≤1024px, skip cursor initialization entirely and ensure `cursor: auto` is restored on `body`

- [x] 8. Preloader (`js/preloader.js`)
  - [x] 8.1 Create `js/preloader.js` exporting `initPreloader()` that returns a Promise; the preloader tracks asset loading progress (images, video metadata) using a counter and updates `#preloader-bar` width and `#preloader-percent` text content as each asset resolves
  - [x] 8.2 Export `exitPreloader()` that runs the GSAP timeline: animate `#preloader-bar` to 100% width over 1.2s, snap `#preloader-percent` to 100, then clip-path wipe `#preloader` out (`inset(0 0 100% 0)`) over 0.8s, then fade in `#hero-content` from `opacity: 0, y: 30`
  - [x] 8.3 Ensure the preloader is shown immediately on page load (CSS sets it visible by default) and that `exitPreloader()` is only called after `initEngine`, `createParticleSystem`, and `initMachines` have all resolved

- [x] 9. UI Module (`js/ui.js`)
  - [x] 9.1 Create `js/ui.js` exporting `initNavigation()` that: wires all `<nav>` anchor clicks to call `scrollTo()` from `scroll.js`, sets up `ScrollTrigger` instances for each section to add/remove `.active` class on the corresponding nav link, and wires the hamburger `#nav-toggle` button to toggle a `.open` class on the nav overlay with a 300ms CSS transition
  - [x] 9.2 Export `animateCounter(el, target, duration)` that uses `gsap.to({ val: 0 }, { val: target, duration, ease: 'power2.out', onUpdate() { el.textContent = Math.round(this.targets()[0].val) } })` to count up from 0 to target
  - [x] 9.3 Export `initCounters()` that registers a `ScrollTrigger` for `#about` section entry and calls `animateCounter` for each `.counter` element using its `data-target` attribute value and a 2-second duration; ensure counters only fire once
  - [x] 9.4 Export `initLightbox()` that: binds click on each `.gallery-item` to open `#lightbox` with the item's image src and title, wires prev/next buttons to cycle through gallery items array, wires the close button and `Escape` key to close the lightbox, and traps focus within the lightbox while open
  - [x] 9.5 Export `initContactForm()` that wires the contact form `submit` event, runs `validateForm()` on all fields, shows inline error messages on invalid fields (red border + error text), and on full validity shows `.form-success` panel and hides `.form-fields`
  - [x] 9.6 Create pure validation functions (exported separately for testing): `validateRequired(value)` returns `{ valid, error }`, `validatePhone(value)` tests `/^[+\d\s\-()]{7,15}$/`, `validateEmail(value)` tests standard email regex; these functions must be pure with no DOM side effects

- [x] 10. Section Animation Modules (`js/sections/*.js`)
  - [x] 10.1 Create `js/sections/hero.js` exporting `init()` that: splits `.hero-title` text into `<span class="char">` elements via JS, runs the GSAP stagger reveal (`opacity: 0, y: 40, rotateX: -90, stagger: 0.05, duration: 0.8, ease: 'back.out(1.7)'`), wires `mousemove` on `#hero` to tilt the Three.js CNC machine model ±15° on X/Y axes, and fades out the scroll indicator when scroll > 100px
  - [x] 10.2 Create `js/sections/about.js` exporting `init()` that registers a `ScrollTrigger` for `#about` entry and animates: left column text sliding in from `x: -60, opacity: 0` and right column visual from `x: 60, opacity: 0`, both over 0.8s with `power3.out`
  - [x] 10.3 Create `js/sections/services.js` exporting `init()` that: registers a stagger ScrollTrigger for `.service-card` elements (`y: 60, opacity: 0, stagger: 0.1, duration: 0.6`), and binds `mousemove`/`mouseleave` on each card to apply CSS `perspective` + `rotateX`/`rotateY` 3D tilt up to 10° following cursor position within the card
  - [x] 10.4 Create `js/sections/industries.js` exporting `init()` that registers a stagger ScrollTrigger for `.industry-tile` elements with a fade-and-scale entrance (`opacity: 0, scale: 0.8, stagger: 0.08, duration: 0.5`)
  - [x] 10.5 Create `js/sections/gallery.js` exporting `init()` that registers a stagger ScrollTrigger for `.gallery-item` elements with a reveal animation, and wires hover events for the zoom + neon overlay effect (scale 1.08, neon gradient overlay fade-in)
  - [x] 10.6 Create `js/sections/whyus.js` exporting `init()` that registers ScrollTrigger animations for `.differentiator-card` elements alternating slide-in from left and right (`x: ±60, opacity: 0, stagger: 0.12`), and wires the CTA "Get a Free Consultation" button to call `scrollTo('#contact')`
  - [x] 10.7 Create `js/sections/contact.js` exporting `init()` that registers a ScrollTrigger for `#contact` entry and animates the form sliding in from `x: -60, opacity: 0` and the contact info from `x: 60, opacity: 0`
  - [x] 10.8 Create `js/sections/machines.js` (section animation, distinct from `js/machines.js`) exporting `init()` that registers a ScrollTrigger for `#machine-showcase` entry triggering a GSAP camera zoom-in tween on the active machine canvas, and wires `mouseenter`/`mouseleave` and `click` events on each `.machine-viewport` to call `onMachineHover`, `onMachineLeave`, and `onMachineClick` from `js/machines.js`

- [x] 11. Main Orchestrator (`js/main.js`)
  - [x] 11.1 Create `js/main.js` that imports all modules and executes the initialization sequence in order: `initPreloader()` → `initEngine(canvas)` → `createParticleSystem(scene, count)` → `initMachines(scene)` → `initScroll()` → `initCursor()` → `initNavigation()` → `initCounters()` → `initLightbox()` → `initContactForm()` → all `sections/*.js init()` calls → `exitPreloader()`
  - [x] 11.2 Add WebGL detection at the top of `main.js`: attempt `canvas.getContext('webgl2') || canvas.getContext('webgl')`; if null, add class `no-webgl` to `<body>`, skip all Three.js initialization, and show `.webgl-fallback` static containers
  - [x] 11.3 Add mobile performance detection: if `window.innerWidth < 768` or `navigator.hardwareConcurrency < 4`, call `setParticleCount(100)`, disable `renderer.shadowMap.enabled`, and set `renderer.setPixelRatio(1)` after engine init
  - [x] 11.4 Start the Three.js animation loop via `startLoop(delta => { updateParticles(delta); updateMachines(delta) })` after all modules are initialized

- [x] 12. Property-Based Tests
  - [x] 12.1 Create `js/tests/validators.test.js` and install/configure Vitest with fast-check; write a standard unit test suite first covering `validateRequired`, `validatePhone`, and `validateEmail` with known valid and invalid examples to confirm the pure functions work before running PBT
  - [x] 12.2 Write property test for Property 1 — phone rejection: `fc.property(fc.string().filter(s => !/^[+\d\s\-()]{7,15}$/.test(s)), s => validatePhone(s).valid === false)` with 100 iterations — **Validates: Requirements 13.6**
  - [x] 12.3 Write property test for Property 2 — phone acceptance: generate strings matching the phone pattern using `fc.stringMatching(/^[+\d\s\-()]{7,15}$/)` or a constrained arbitrary, assert `validatePhone(s).valid === true` — **Validates: Requirements 13.6**
  - [x] 12.4 Write property test for Property 3 — empty required fields: `fc.property(fc.constantFrom('name', 'phone', 'email', 'service'), fc.oneof(fc.constant(''), fc.string().map(s => s.trim() === '' ? s : '   ')), (field, value) => validateRequired(value).valid === false && validateRequired(value).error.length > 0)` — **Validates: Requirements 13.6**
  - [x] 12.5 Create `js/tests/counter.test.js`; extract the counter value computation into a pure function `computeCounterValue(target, elapsed, duration)` that returns `Math.round(Math.min(elapsed / duration, 1) * target)`; write property test for Property 4: `fc.property(fc.integer({ min: 0, max: 10000 }), fc.float({ min: 0, max: 1 }), (target, fraction) => { const v = computeCounterValue(target, fraction * 2, 2); return v >= 0 && v <= target })` — **Validates: Requirements 7.4**
  - [x] 12.6 Create `js/tests/cursor.test.js`; extract the lerp attraction into a pure function `computeAttractedPosition(cx, cy, ex, ey, distance)` that returns `{ x, y }` using the design's formula; write property test for Property 5: `fc.property(fc.float({ min: -500, max: 500 }), fc.float({ min: -500, max: 500 }), fc.float({ min: -500, max: 500 }), fc.float({ min: -500, max: 500 }), (cx, cy, ex, ey) => { const dist = Math.hypot(ex - cx, ey - cy); if (dist >= 60 || dist === 0) return true; const a = computeAttractedPosition(cx, cy, ex, ey, dist); const dAfter = Math.hypot(ex - a.x, ey - a.y); return dAfter <= dist + 1e-9 })` — **Validates: Requirements 3.3**
  - [x] 12.7 Run the full test suite (`npm test`) and confirm all 5 properties pass with 100 iterations each; update PBT status for each property test

- [x] 13. Responsive Design and Accessibility Pass
  - [x] 13.1 Audit and fix all three breakpoints: verify the services grid is 4-col/2-col/1-col, navigation collapses to hamburger below 768px, hero heading uses `clamp()` font sizes, and no horizontal scrollbar appears at any viewport width
  - [x] 13.2 Verify all `<img>` elements have descriptive `alt` attributes; add `aria-label` to icon-only buttons (hamburger, lightbox prev/next/close, social icons); add `role="dialog"` and `aria-modal="true"` to the lightbox and `aria-live="polite"` to the form success/error regions
  - [x] 13.3 Test keyboard navigation: Tab through all interactive elements, verify visible focus indicators (neon outline), verify lightbox traps focus, verify Escape closes lightbox and mobile nav overlay, verify Enter/Space activate buttons
  - [x] 13.4 Verify WCAG AA contrast: body text (#FFFFFF or #C0C0C0) against `#0A0A0A` background must meet 4.5:1 minimum; adjust any failing text colors
  - [x] 13.5 Add `prefers-reduced-motion` media query in `css/animations.css` that disables GSAP scroll animations and CSS keyframe animations for users who have requested reduced motion; in `main.js` check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip ScrollSmoother / GSAP timeline setup if true

- [x] 14. Performance Optimization and Final Polish
  - [x] 14.1 Add `loading="lazy"` to all gallery `<img>` elements and verify the hero video has `preload="metadata"` (not `preload="auto"`) to avoid blocking initial load
  - [x] 14.2 Verify `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` is set in `engine.js` and that mobile path sets it to 1; verify `renderer.shadowMap.enabled` is disabled on mobile
  - [x] 14.3 Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` in `<head>` before the Google Fonts stylesheet link to reduce font load latency
  - [x] 14.4 Add `<link rel="preload" as="video" href="assets/video/hero.mp4">` for the hero video and `<link rel="preload" as="style">` for `tokens.css` and `base.css` to prioritize critical resources
  - [x] 14.5 Verify the tab visibility handler (`visibilitychange` → `pauseLoop` / `resumeLoop`) works correctly by manually switching tabs during development and confirming the Three.js loop pauses
  - [x] 14.6 Final visual QA pass: verify neon glow hover states appear within 200ms on all interactive elements, glassmorphism panels render correctly, the industrial grid background is visible at 5% opacity, the preloader exit animation plays smoothly, and the hero logo stagger reveal fires correctly on first load
  - [x] 14.7 Cross-browser smoke test: open `index.html` via `live-server` in Chrome, Firefox, and Edge; verify Three.js canvas renders, GSAP scroll animations trigger, and the contact form validation works in all three browsers
