# Design Document: Futuristic CNC Solutions Website

## Overview

The Futuristic CNC Solutions website is a static, single-page application (SPA-style) delivered as plain HTML/CSS/JS files. It targets an ultra-premium industrial aesthetic inspired by Tesla, Apple, and SpaceX, combining Three.js WebGL rendering, GSAP scroll-driven animations, and glassmorphism UI components.

The site has no server-side runtime requirement. All interactivity is client-side. The architecture is deliberately flat — no bundler is required for production, though a simple dev server (e.g., `live-server`) is used during development.

**Core technology stack:**
- Three.js r160+ (CDN: `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`)
- GSAP 3.12+ with ScrollTrigger and ScrollSmoother (CDN)
- Vanilla ES6+ JavaScript (ES modules via `<script type="module">`)
- Google Fonts: Orbitron (headings), Inter (body)
- No framework, no build tool required for production

---

## Architecture

The site follows a **modular vanilla JS architecture** using ES modules. Each major concern is isolated into its own module file. The HTML entry point (`index.html`) bootstraps everything via a single `<script type="module" src="js/main.js">`.

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                         │
│  (DOM structure, CDN script tags, semantic sections)    │
└────────────────────┬────────────────────────────────────┘
                     │ <script type="module">
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    js/main.js                           │
│  (Orchestrator: imports all modules, init sequence)     │
└──┬──────────┬──────────┬──────────┬──────────┬──────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
engine.js  cursor.js  scroll.js  ui.js    sections/
(Three.js) (Magnetic) (GSAP SS)  (Nav,    (per-section
           Cursor)    Scroll-    Preload,  animation
                      Trigger)   Forms)    modules)
```

### Initialization Sequence

1. `preloader.js` — show preloader, begin asset tracking
2. `engine.js` — initialize Three.js renderer, scene, camera
3. `particles.js` — create hero particle system
4. `machines.js` — load/create machine models
5. `scroll.js` — initialize GSAP ScrollSmoother + ScrollTrigger
6. `cursor.js` — initialize magnetic cursor
7. `ui.js` — wire navigation, counters, forms, lightbox
8. `sections/*.js` — register per-section scroll animations
9. Preloader resolves → cinematic wipe out → site revealed

---

## File Structure

```
futuristic-cnc-solutions/
├── index.html                  # Single HTML entry point
├── css/
│   ├── tokens.css              # CSS custom properties (design tokens)
│   ├── base.css                # Reset, typography, global styles
│   ├── layout.css              # Section layout, grid, responsive
│   ├── components.css          # Glassmorphism cards, buttons, forms
│   ├── cursor.css              # Custom cursor styles
│   ├── preloader.css           # Preloader styles
│   └── animations.css          # CSS keyframe animations (grid, glows)
├── js/
│   ├── main.js                 # Entry point / orchestrator
│   ├── engine.js               # Three.js scene, renderer, camera, lights
│   ├── particles.js            # Hero particle system (Three.js Points)
│   ├── machines.js             # Machine showcase 3D models + interactions
│   ├── scroll.js               # GSAP ScrollSmoother + ScrollTrigger setup
│   ├── cursor.js               # Magnetic cursor logic
│   ├── preloader.js            # Preloader asset tracking + exit animation
│   ├── ui.js                   # Navigation, counters, lightbox, forms
│   └── sections/
│       ├── hero.js             # Hero section animations
│       ├── about.js            # About section scroll animations
│       ├── services.js         # Services card tilt + stagger
│       ├── industries.js       # Industries tile animations
│       ├── gallery.js          # Gallery reveal + lightbox
│       ├── whyus.js            # Why Choose Us animations
│       └── contact.js          # Contact form validation + animations
├── assets/
│   ├── models/                 # GLTF/GLB 3D models (or procedural fallback)
│   ├── images/                 # WebP optimized images
│   ├── video/                  # Hero background video (mp4 + webm)
│   └── fonts/                  # (Optional local font fallback)
└── package.json                # Dev dependencies (live-server, etc.)
```

---

## Components and Interfaces

### 1. Three.js Engine (`js/engine.js`)

Manages the shared WebGL context. All 3D scenes share a single renderer to minimize GPU overhead.

```js
// Public interface
export function initEngine(canvas)   // Initialize renderer, scene, camera
export function getScene()           // Returns THREE.Scene
export function getRenderer()        // Returns THREE.WebGLRenderer
export function getCamera()          // Returns THREE.PerspectiveCamera
export function startLoop(callback)  // Start animation loop with optional per-frame callback
export function pauseLoop()          // Pause on tab blur
export function resumeLoop()         // Resume on tab focus
```

**Key configuration:**
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- `renderer.shadowMap.enabled = true`
- `renderer.toneMapping = THREE.ACESFilmicToneMapping`
- Camera: `PerspectiveCamera(75, aspect, 0.1, 1000)`
- Ambient light: `0x111111`, intensity 0.5
- Directional key light: `0xffffff`, intensity 1.5, position (5, 10, 5)
- Point light (neon accent): `0x00D4FF`, intensity 2, position (-3, 3, 3)

### 2. Particle System (`js/particles.js`)

Renders floating particles in the hero section using `THREE.Points`.

```js
export function createParticleSystem(scene, count)  // Returns particle mesh
export function updateParticles(delta)               // Called each frame
export function setParticleCount(n)                  // Adjust for mobile (100) vs desktop (500+)
```

**Implementation:**
- `BufferGeometry` with random positions in a 20×20×10 box
- `PointsMaterial` with `color: 0x00D4FF`, `size: 0.05`, `transparent: true`
- Each frame: positions drift by a small random velocity vector
- Smoke effect: 5 large `PlaneGeometry` meshes with `MeshBasicMaterial`, animated opacity 0.02–0.08

### 3. Machine Showcase (`js/machines.js`)

Manages the three interactive machine representations.

```js
export function initMachines(scene)           // Create/load all machine models
export function onMachineHover(index)         // Increase rotation, add rim light
export function onMachineClick(index)         // Show spec panel
export function updateMachines(delta)         // Per-frame rotation updates
export function enableOrbitControls(canvas)   // Attach drag-rotate controls
```

**Machine data model:**
```js
const machines = [
  {
    id: 'vmc',
    name: 'VMC Machining Center',
    axes: '3-Axis / 5-Axis',
    spindleSpeed: '12,000 RPM',
    applications: ['Mold Making', 'Aerospace Parts', 'Automotive'],
    geometry: 'procedural' // or path to .glb
  },
  // ... 2 more
]
```

**Procedural geometry fallback:** If no GLTF model is available, build a representative machine from `BoxGeometry`, `CylinderGeometry`, and `TorusGeometry` primitives with `MeshStandardMaterial({ metalness: 0.9, roughness: 0.2 })`.

### 4. Scroll Controller (`js/scroll.js`)

Wraps GSAP ScrollSmoother and registers all ScrollTrigger animations.

```js
export function initScroll()           // Create ScrollSmoother instance
export function scrollTo(target)       // Programmatic smooth scroll to selector
export function registerTrigger(cfg)   // Register a ScrollTrigger config object
```

**ScrollSmoother config:**
```js
ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.5,
  effects: true,
  normalizeScroll: true
})
```

**Parallax data attributes** (applied in HTML):
- `data-speed="0.4"` — background layers (40% scroll speed)
- `data-speed="1"` — foreground content (normal speed)
- `data-lag="0.2"` — subtle lag for depth

### 5. Magnetic Cursor (`js/cursor.js`)

```js
export function initCursor()           // Create DOM elements, bind events
export function updateCursor(x, y)     // Called on mousemove
export function setCursorState(state)  // 'default' | 'hover' | 'text' | 'hidden'
```

**DOM structure:**
```html
<div id="cursor-dot"></div>      <!-- 16px filled circle -->
<div id="cursor-ring"></div>     <!-- 40px outlined ring -->
```

**Magnetic attraction algorithm:**
```
For each interactive element:
  distance = euclidean(cursor, element.center)
  if distance < 60px:
    strength = (60 - distance) / 60   // 0..1
    targetX = lerp(cursor.x, element.center.x, strength * 0.4)
    targetY = lerp(cursor.y, element.center.y, strength * 0.4)
```

The ring follows with `gsap.to(ring, { x, y, duration: 0.1, ease: 'power2.out' })`.

### 6. UI Module (`js/ui.js`)

Handles navigation active states, counter animations, lightbox, and form validation.

```js
export function initNavigation()       // Active link tracking, hamburger menu
export function initCounters()         // Counter_Animation on scroll entry
export function initLightbox()         // Gallery lightbox open/close/navigate
export function initContactForm()      // Form validation and submission feedback
export function animateCounter(el, target, duration)  // Core counter function
```

**Counter animation:**
Uses `gsap.to({ val: 0 }, { val: target, duration: 2, onUpdate: () => el.textContent = Math.round(obj.val) })`.

**Form validation rules:**
- Name: required, min 2 chars
- Phone: required, matches `/^[+\d\s\-()]{7,15}$/`
- Email: required, matches standard email regex
- Service: required (dropdown selection)
- Message: optional

### 7. Section Animation Modules (`js/sections/*.js`)

Each section module exports a single `init()` function that registers its ScrollTrigger animations. Called from `main.js` after scroll is initialized.

**Pattern:**
```js
// js/sections/services.js
export function init() {
  gsap.from('.service-card', {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out'
  })
  // 3D card tilt on mousemove
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', handleCardTilt)
    card.addEventListener('mouseleave', resetCardTilt)
  })
}
```

---

## Data Models

### Service Item
```js
{
  id: String,           // e.g. 'cnc-machine-services'
  icon: String,         // SVG path or Unicode symbol
  title: String,        // Display name
  shortDesc: String,    // Card description (≤80 chars)
  fullDesc: String      // Expanded hover description
}
```

### Industry Item
```js
{
  id: String,
  icon: String,         // SVG or emoji
  name: String,
  tagline: String       // One-line description
}
```

### Gallery Item
```js
{
  id: String,
  src: String,          // WebP image path
  alt: String,          // Descriptive alt text (accessibility)
  title: String,
  category: String      // 'machine' | 'project' | 'facility'
}
```

### Machine Spec
```js
{
  id: String,
  name: String,
  axes: String,
  spindleSpeed: String,
  applications: String[],
  geometry: 'procedural' | String  // GLB path
}
```

### Contact Form State
```js
{
  name: { value: String, valid: Boolean, error: String },
  company: { value: String, valid: Boolean, error: String },
  phone: { value: String, valid: Boolean, error: String },
  email: { value: String, valid: Boolean, error: String },
  service: { value: String, valid: Boolean, error: String },
  message: { value: String, valid: Boolean, error: String }
}
```

---

## CSS Design Tokens (`css/tokens.css`)

```css
:root {
  /* Colors */
  --color-bg:           #0A0A0A;
  --color-bg-secondary: #111111;
  --color-accent:       #00D4FF;
  --color-accent-glow:  rgba(0, 212, 255, 0.6);
  --color-accent-dim:   rgba(0, 212, 255, 0.15);
  --color-accent-border:rgba(0, 212, 255, 0.2);
  --color-silver:       #C0C0C0;
  --color-silver-light: #E8E8E8;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #C0C0C0;
  --color-error:        #FF4444;
  --color-success:      #00FF88;

  /* Glass */
  --glass-bg:           rgba(255, 255, 255, 0.05);
  --glass-border:       1px solid rgba(0, 212, 255, 0.2);
  --glass-blur:         blur(20px);

  /* Typography */
  --font-heading:       'Orbitron', sans-serif;
  --font-body:          'Inter', sans-serif;
  --font-size-hero:     clamp(2.5rem, 6vw, 5rem);
  --font-size-h2:       clamp(1.8rem, 4vw, 3rem);
  --font-size-h3:       clamp(1.2rem, 2.5vw, 1.8rem);
  --font-size-body:     1rem;
  --font-size-small:    0.875rem;

  /* Spacing */
  --section-padding:    clamp(4rem, 8vw, 8rem);
  --container-max:      1400px;
  --gap-card:           1.5rem;

  /* Animation */
  --transition-fast:    200ms ease;
  --transition-medium:  300ms ease;
  --transition-slow:    600ms ease;
  --glow-shadow:        0 0 20px rgba(0, 212, 255, 0.6);

  /* Z-index layers */
  --z-preloader:        1000;
  --z-cursor:           999;
  --z-nav:              100;
  --z-modal:            200;
  --z-canvas:           1;
  --z-content:          10;
}
```

---

## Three.js Scene Setup

### Hero Scene

```
Scene
├── AmbientLight (0x111111, 0.5)
├── DirectionalLight (0xffffff, 1.5) @ (5, 10, 5)
├── PointLight/neon (0x00D4FF, 2) @ (-3, 3, 3)
├── CNC_Machine_Group
│   ├── MeshStandardMaterial (metalness: 0.9, roughness: 0.2)
│   └── Auto-rotates Y-axis 0.3°/frame
│   └── Mouse-tilt ±15° on X/Y
└── ParticleSystem (THREE.Points, 500 vertices)
    └── Smoke planes (5× PlaneGeometry, animated opacity)
```

**Canvas placement:** The Three.js canvas is positioned `fixed` behind all content (`z-index: 1`), covering the full viewport. The hero section content (text, CTAs) sits above it via `z-index: 10`.

### Machine Showcase Scene

A separate `<canvas id="machine-canvas">` inside the Machine_Showcase section. Uses the same renderer via `renderer.setScissor` / `renderer.setViewport` technique to render multiple "viewports" in one draw call, or alternatively three separate small canvases.

**Recommended approach:** Three separate `<canvas>` elements, each with its own `WebGLRenderer` instance (acceptable since only one is visible at a time and they are small). This simplifies OrbitControls per-machine.

---

## GSAP Animation System

### ScrollTrigger Registration Pattern

All triggers are registered after `ScrollSmoother.create()` completes. Each section module calls `registerTrigger()` from `scroll.js`.

```
Section          Trigger Start    Animation
─────────────────────────────────────────────────────────
Hero             page load        Logo letter stagger (1.5s)
About            top 75%          Text slide-left, visual slide-right
Services         top 80%          Cards stagger from below (100ms gap)
Machine          top 60%          Camera zoom-in tween
Industries       top 80%          Tiles fade+scale stagger
Gallery          top 85%          Items reveal stagger
Why Choose Us    top 75%          Cards alternate left/right slide
Contact          top 80%          Form slide-left, info slide-right
```

### Preloader Exit Animation

```js
// Timeline: preloader → site reveal
const tl = gsap.timeline()
tl.to('#preloader-bar', { width: '100%', duration: 1.2, ease: 'power2.inOut' })
  .to('#preloader-percent', { textContent: '100', duration: 1.2, snap: { textContent: 1 } }, '<')
  .to('#preloader', { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' })
  .from('#hero-content', { opacity: 0, y: 30, duration: 0.6 }, '-=0.2')
```

### Hero Logo Reveal

```js
gsap.from('.hero-title .char', {
  opacity: 0,
  y: 40,
  rotateX: -90,
  stagger: 0.05,
  duration: 0.8,
  ease: 'back.out(1.7)',
  delay: 0.3
})
```

Characters are split by wrapping each letter in `<span class="char">` via JS on page load.

### Navigation Scroll Behavior

```js
ScrollTrigger.create({
  start: 'top -80',
  onEnter: () => nav.classList.add('scrolled'),
  onLeaveBack: () => nav.classList.remove('scrolled')
})
```

`.nav.scrolled` applies `backdrop-filter: blur(20px)` and `background: rgba(10,10,10,0.8)`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**PBT Applicability Assessment:**

This project is primarily a static website with UI rendering, CSS animations, and Three.js visuals. Most behavior is visual and not amenable to property-based testing. However, two subsystems contain pure logic that benefits from property-based testing:

1. **Contact form validation** — a pure function mapping field values to validation state. Input variation (different strings, lengths, formats) meaningfully affects output. 100 iterations will find edge cases (whitespace-only names, international phone formats, malformed emails).
2. **Counter animation value clamping** — the counter must always produce integer values between 0 and the target, never exceeding the target.
3. **Magnetic cursor lerp** — the attraction algorithm is a pure mathematical function; the output position must always be between the cursor and the element center.

All Three.js rendering, GSAP animations, CSS layout, and scroll behavior are **not** suitable for PBT (UI rendering, external library behavior, visual output).

---

### Property 1: Form validation rejects invalid phone numbers

*For any* string that does not match the pattern `/^[+\d\s\-()]{7,15}$/` (e.g., empty strings, strings with letters, strings shorter than 7 or longer than 15 characters), the phone field validator SHALL return `valid: false`.

**Validates: Requirements 13.6**

---

### Property 2: Form validation accepts valid phone numbers

*For any* string that matches the pattern `/^[+\d\s\-()]{7,15}$/`, the phone field validator SHALL return `valid: true`.

**Validates: Requirements 13.6**

---

### Property 3: Form validation rejects empty required fields

*For any* required field (name, phone, email, service), passing an empty string or whitespace-only string SHALL return `valid: false` with a non-empty error message.

**Validates: Requirements 13.6**

---

### Property 4: Counter animation never exceeds target

*For any* target value `n` and any elapsed time `t` during the counter animation, the displayed integer value SHALL be in the range `[0, n]` and SHALL equal `n` when the animation completes.

**Validates: Requirements 7.4**

---

### Property 5: Magnetic cursor attraction stays between cursor and target

*For any* cursor position `(cx, cy)`, element center `(ex, ey)`, and distance less than 60px, the computed attracted position `(ax, ay)` SHALL satisfy: `distance(attracted, element) ≤ distance(cursor, element)` — i.e., attraction always moves the cursor closer to the element, never further away.

**Validates: Requirements 3.3**

---

## Error Handling

### WebGL Unavailable
- Detect via `canvas.getContext('webgl2') || canvas.getContext('webgl')`
- If null: add class `no-webgl` to `<body>`, hide all `<canvas>` elements, show `.webgl-fallback` static image containers
- CSS: `.no-webgl .canvas-container { display: none }` / `.no-webgl .webgl-fallback { display: block }`

### Asset Load Failures
- GLTF model load failure: fall back to procedural geometry (BoxGeometry + CylinderGeometry primitives)
- Video load failure: hide `<video>` element, show static hero background image
- Font load failure: system sans-serif fallback already in font stack

### Form Submission
- Since this is a static site with no backend, form submission shows a success message after client-side validation passes
- A `mailto:` link or a third-party form service (Formspree, Netlify Forms) can be wired in as a progressive enhancement
- The success state is purely UI: show `.form-success` panel, hide `.form-fields`

### Tab Visibility
```js
document.addEventListener('visibilitychange', () => {
  document.hidden ? pauseLoop() : resumeLoop()
})
```

### Mobile Performance
- On `window.innerWidth < 768`: `setParticleCount(100)`, disable `renderer.shadowMap`, set `renderer.setPixelRatio(1)`
- Detect via `navigator.hardwareConcurrency < 4` as additional low-power signal

---

## Testing Strategy

This project is a static website with primarily visual and interactive behavior. The testing approach is:

**Unit tests (Vitest or Jest):**
- Form validation functions (`validatePhone`, `validateEmail`, `validateRequired`) — pure functions, fully testable
- Counter animation value clamping logic
- Magnetic cursor lerp calculation
- Navigation active-section detection logic

**Property-based tests (fast-check, JavaScript):**
- Property 1–3: Form field validators across generated string inputs
- Property 4: Counter value bounds across generated target values and time fractions
- Property 5: Cursor attraction direction invariant across generated position pairs

**Manual / visual testing:**
- Three.js rendering, GSAP animations, scroll behavior, responsive layout
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Lighthouse performance audit (target ≥ 70 desktop)
- Keyboard navigation and screen reader spot-check

**Property test configuration:**
- Library: `fast-check` (npm dev dependency)
- Minimum 100 iterations per property
- Tag format: `// Feature: futuristic-cnc-website, Property N: <property_text>`

**No property-based tests for:**
- Three.js scene rendering (external library, visual output)
- GSAP animation timelines (external library, time-based)
- CSS layout and responsive breakpoints (visual)
- ScrollTrigger behavior (external library)
- Lightbox open/close (DOM interaction, example-based)
