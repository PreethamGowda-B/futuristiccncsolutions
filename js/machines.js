/**
 * machines.js — Machine Showcase 3D Models
 *
 * ARCHITECTURE: Single shared WebGLRenderer using scissor + viewport rendering.
 * Instead of 3 separate WebGL contexts (which each consume GPU memory and
 * driver overhead), one renderer draws into each canvas's screen region per
 * frame. This cuts GPU context overhead by ~66% and is the standard approach
 * for multi-canvas Three.js scenes.
 *
 * On mobile the 3D canvases are replaced with static CSS placeholders to
 * eliminate WebGL overhead entirely on constrained devices.
 */

import * as THREE from 'three';

// ─── Machine data ─────────────────────────────────────────────────────────────
const MACHINES = [
  {
    id:           'vmc',
    name:         'VMC Machining Center',
    axes:         '3-Axis / 5-Axis',
    spindleSpeed: '12,000 RPM',
    applications: ['Mold Making', 'Aerospace Parts', 'Automotive Components'],
  },
  {
    id:           'hmc',
    name:         'HMC Machining Center',
    axes:         '4-Axis',
    spindleSpeed: '8,000 RPM',
    applications: ['Heavy Machining', 'Batch Production', 'Complex Housings'],
  },
  {
    id:           'vtl',
    name:         'VTL Vertical Turning Lathe',
    axes:         '2-Axis',
    spindleSpeed: '3,000 RPM',
    applications: ['Large Diameter Parts', 'Flanges', 'Heavy Engineering'],
  },
];

// ─── Performance tier detection ───────────────────────────────────────────────
// On mobile or low-core devices, skip WebGL entirely and show CSS placeholders.
const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
                 window.innerWidth < 768;
const isLowEnd = navigator.hardwareConcurrency <= 2;
const useWebGL = !isMobile && !isLowEnd;

// ─── Module state ─────────────────────────────────────────────────────────────
let sharedRenderer = null;      // single THREE.WebGLRenderer
const scenes        = [];       // THREE.Scene per machine
const cameras       = [];       // THREE.PerspectiveCamera per machine
const groups        = [];       // THREE.Group per machine
const rotSpeeds     = [];       // Y-rotation speed per machine
const rimLights     = [];       // neon rim PointLight per machine
const canvasEls     = [];       // HTMLCanvasElement references
let   showcaseVisible = false;  // IntersectionObserver flag

const BASE_SPEED = 0.003;

// ─── initMachines ─────────────────────────────────────────────────────────────
export function initMachines() {
  const viewports = document.querySelectorAll('.machine-viewport');

  if (!useWebGL) {
    // Mobile / low-end: replace canvases with lightweight CSS placeholders
    _injectCSSFallbacks(viewports);
    _wireSpecPanel();
    return;
  }

  // Create ONE shared renderer — no canvas attached yet (we use setViewport/setScissor)
  sharedRenderer = new THREE.WebGLRenderer({
    antialias: false,   // off for performance; looks fine at normal viewing distance
    alpha:     true,
    powerPreference: 'high-performance',
  });
  sharedRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  sharedRenderer.shadowMap.enabled = false;
  sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  sharedRenderer.autoClear = false; // we clear manually per viewport

  // Size the shared canvas to full window; it sits behind all machine-viewports
  const sharedCanvas = sharedRenderer.domElement;
  sharedCanvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 5;
  `;
  document.body.appendChild(sharedCanvas);
  _resizeSharedRenderer();

  // Build a scene + camera + group per machine viewport
  viewports.forEach((vp, idx) => {
    const canvas = vp.querySelector('.machine-canvas');
    canvasEls.push(canvas);

    // Hide the individual canvas elements — rendering happens on sharedCanvas
    if (canvas) canvas.style.display = 'none';

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(5, 10, 5);
    scene.add(dir);
    const neon = new THREE.PointLight(0x00D4FF, 1.5, 20);
    neon.position.set(-3, 3, 3);
    scene.add(neon);
    scenes.push(scene);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);
    cameras.push(camera);

    const group = _buildMachineGeometry(idx);
    scene.add(group);
    groups.push(group);

    rotSpeeds.push(BASE_SPEED);
    rimLights.push(null);
  });

  // Pause rendering when machine showcase is off-screen
  const section = document.getElementById('machine-showcase');
  if (section) {
    new IntersectionObserver(
      ([entry]) => { showcaseVisible = entry.isIntersecting; },
      { threshold: 0.05 }
    ).observe(section);
  }

  // Handle window resize
  window.addEventListener('resize', _resizeSharedRenderer, { passive: true });

  _wireSpecPanel();
}

// ─── onMachineHover ───────────────────────────────────────────────────────────
export function onMachineHover(index) {
  if (!useWebGL || index < 0 || index >= groups.length) return;
  rotSpeeds[index] = BASE_SPEED * 3;
  if (!rimLights[index]) {
    const rim = new THREE.PointLight(0x00D4FF, 3, 10);
    rim.position.set(0, 0, -3);
    groups[index].add(rim);
    rimLights[index] = rim;
  }
}

// ─── onMachineLeave ───────────────────────────────────────────────────────────
export function onMachineLeave(index) {
  if (!useWebGL || index < 0 || index >= groups.length) return;
  rotSpeeds[index] = BASE_SPEED;
  if (rimLights[index]) {
    groups[index].remove(rimLights[index]);
    rimLights[index].dispose?.();
    rimLights[index] = null;
  }
}

// ─── onMachineClick ───────────────────────────────────────────────────────────
export function onMachineClick(index) {
  if (index < 0 || index >= MACHINES.length) return;

  const machine = MACHINES[index];
  const panel   = document.getElementById('spec-panel');
  const content = document.getElementById('spec-panel-content');
  if (!panel || !content) return;

  content.innerHTML = `
    <h3>${machine.name}</h3>
    <div class="spec-row">
      <span class="spec-label">Axes</span>
      <span class="spec-value">${machine.axes}</span>
    </div>
    <div class="spec-row">
      <span class="spec-label">Spindle Speed</span>
      <span class="spec-value">${machine.spindleSpeed}</span>
    </div>
    <div class="spec-row">
      <span class="spec-label">Applications</span>
      <span class="spec-value">${machine.applications.join(', ')}</span>
    </div>
  `;

  panel.setAttribute('aria-hidden', 'false');
  panel.style.display = 'block';
  document.body.style.overflow = 'hidden';

  if (typeof gsap !== 'undefined') {
    gsap.fromTo(panel, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'power3.out' });
  } else {
    panel.style.transform = 'translateX(0)';
  }
}

// ─── closeSpecPanel ───────────────────────────────────────────────────────────
export function closeSpecPanel() {
  const panel = document.getElementById('spec-panel');
  if (!panel || panel.getAttribute('aria-hidden') === 'true') return;

  if (typeof gsap !== 'undefined') {
    gsap.to(panel, {
      x: '100%', duration: 0.3, ease: 'power3.in',
      onComplete: () => {
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = '';
        document.body.style.overflow = '';
      },
    });
  } else {
    panel.style.transform = 'translateX(100%)';
    panel.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// ─── updateMachines ───────────────────────────────────────────────────────────
export function updateMachines(delta) {
  if (!useWebGL || !sharedRenderer || !showcaseVisible) return;

  const renderer = sharedRenderer;
  const dpr      = renderer.getPixelRatio();

  renderer.clear();

  const viewports = document.querySelectorAll('.machine-viewport');

  viewports.forEach((vp, idx) => {
    if (idx >= scenes.length) return;

    // Rotate the group
    groups[idx].rotation.y += rotSpeeds[idx];

    // Get the viewport's position in the window
    const rect = vp.getBoundingClientRect();

    // Skip if off-screen
    if (rect.bottom < 0 || rect.top > window.innerHeight ||
        rect.right  < 0 || rect.left > window.innerWidth) return;

    // Convert CSS pixels → physical pixels for scissor/viewport
    const x      = Math.round(rect.left   * dpr);
    const y      = Math.round((window.innerHeight - rect.bottom) * dpr);
    const width  = Math.round(rect.width  * dpr);
    const height = Math.round(rect.height * dpr);

    if (width <= 0 || height <= 0) return;

    // Update camera aspect
    cameras[idx].aspect = rect.width / rect.height;
    cameras[idx].updateProjectionMatrix();

    renderer.setViewport(x, y, width, height);
    renderer.setScissor(x, y, width, height);
    renderer.setScissorTest(true);
    renderer.clearDepth();
    renderer.render(scenes[idx], cameras[idx]);
  });

  renderer.setScissorTest(false);
}

// ─── enableOrbitControls ─────────────────────────────────────────────────────
export function enableOrbitControls(canvas, index) {
  // canvas param kept for API compatibility; we listen on the viewport element
  const vp = document.querySelectorAll('.machine-viewport')[index];
  if (!vp || !useWebGL) return;

  let isDragging = false, prevX = 0, prevY = 0;
  const onDown = (x, y) => { isDragging = true; prevX = x; prevY = y; };
  const onMove = (x, y) => {
    if (!isDragging || !groups[index]) return;
    groups[index].rotation.y += (x - prevX) * 0.01;
    groups[index].rotation.x += (y - prevY) * 0.01;
    prevX = x; prevY = y;
  };
  const onUp = () => { isDragging = false; };

  vp.addEventListener('mousedown',  e => onDown(e.clientX, e.clientY));
  vp.addEventListener('mousemove',  e => onMove(e.clientX, e.clientY));
  vp.addEventListener('mouseup',    onUp);
  vp.addEventListener('mouseleave', onUp);
  vp.addEventListener('touchstart', e => { const t = e.touches[0]; onDown(t.clientX, t.clientY); }, { passive: true });
  vp.addEventListener('touchmove',  e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });
  vp.addEventListener('touchend',   onUp);
}

// ─── Private helpers ──────────────────────────────────────────────────────────

function _resizeSharedRenderer() {
  if (!sharedRenderer) return;
  sharedRenderer.setSize(window.innerWidth, window.innerHeight);
}

function _wireSpecPanel() {
  const closeBtn = document.querySelector('.spec-panel-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSpecPanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSpecPanel(); });
}

/**
 * On mobile: replace each .machine-canvas with a styled CSS div showing
 * the machine name and icon — zero GPU cost.
 */
function _injectCSSFallbacks(viewports) {
  const icons = ['⚙', '🔧', '🌀'];
  viewports.forEach((vp, idx) => {
    const canvas = vp.querySelector('.machine-canvas');
    if (!canvas) return;
    const fallback = document.createElement('div');
    fallback.className = 'machine-canvas-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = `<span class="mcf-icon">${icons[idx] || '⚙'}</span>`;
    canvas.replaceWith(fallback);
  });
}

function _buildMachineGeometry(index) {
  const group  = new THREE.Group();
  const metal  = new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.3, color: 0xdddddd });
  const accent = new THREE.MeshStandardMaterial({ metalness: 0.8, roughness: 0.2, color: 0x00D4FF, emissive: 0x003344 });

  if (index === 0) {
    // VMC
    group.add(_mesh(new THREE.BoxGeometry(1.2, 2.5, 1.0), metal,  [0,    0,    0]));
    group.add(_mesh(new THREE.BoxGeometry(2.0, 0.15, 1.5), metal, [0,   -1.1,  0.3]));
    group.add(_mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), accent, [0, 0.8, 0]));
    group.add(_mesh(new THREE.TorusGeometry(0.3, 0.04, 6, 16), accent, [0, 1.5, 0]));
  } else if (index === 1) {
    // HMC
    group.add(_mesh(new THREE.BoxGeometry(2.0, 1.8, 1.2), metal,  [0, 0, 0]));
    group.add(_mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.6, 12), accent, [0, 0, 0]));
    group.rotation.z = Math.PI / 2;
    group.add(_mesh(new THREE.TorusGeometry(0.25, 0.04, 6, 16), accent, [0.9, 0, 0]));
  } else {
    // VTL
    group.add(_mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 24), metal,  [0, -0.5, 0]));
    group.add(_mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 10), accent, [0, 0.5, 0]));
    group.add(_mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), metal, [0.8, 0.2, 0]));
    group.add(_mesh(new THREE.TorusGeometry(0.8, 0.05, 6, 24), accent, [0, -0.5, 0]));
  }

  return group;
}

function _mesh(geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  return mesh;
}
