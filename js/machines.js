/**
 * machines.js — Machine Showcase 3D Models
 * Manages three interactive CNC machine representations using Three.js.
 * Falls back to procedural geometry if GLTF models are unavailable.
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
    geometry:     'procedural',
  },
  {
    id:           'hmc',
    name:         'HMC Machining Center',
    axes:         '4-Axis',
    spindleSpeed: '8,000 RPM',
    applications: ['Heavy Machining', 'Batch Production', 'Complex Housings'],
    geometry:     'procedural',
  },
  {
    id:           'vtl',
    name:         'VTL Vertical Turning Lathe',
    axes:         '2-Axis',
    spindleSpeed: '3,000 RPM',
    applications: ['Large Diameter Parts', 'Flanges', 'Heavy Engineering'],
    geometry:     'procedural',
  },
];

// ─── Module state ─────────────────────────────────────────────────────────────
const machineGroups   = [];   // THREE.Group per machine
const machineScenes   = [];   // THREE.Scene per canvas
const machineRenderers = [];  // THREE.WebGLRenderer per canvas
const machineCameras  = [];   // THREE.PerspectiveCamera per canvas
const rotationSpeeds  = [];   // current Y-rotation speed per machine
const rimLights       = [];   // neon rim PointLight per machine (null when inactive)
const visibleFlags    = [];   // whether each canvas is in the viewport

const BASE_SPEED = 0.003;     // radians per frame at 60fps equivalent
const isMobile   = window.innerWidth < 768 || navigator.hardwareConcurrency < 4;

// ─── initMachines ─────────────────────────────────────────────────────────────
/**
 * Create a renderer/scene/camera for each .machine-canvas element and
 * build procedural machine geometry.
 */
export function initMachines() {
  const canvases = document.querySelectorAll('.machine-canvas');

  // IntersectionObserver to pause rendering of off-screen canvases
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = Array.from(canvases).indexOf(entry.target);
      if (idx >= 0) visibleFlags[idx] = entry.isIntersecting;
    });
  }, { threshold: 0.1 });

  canvases.forEach((canvas, idx) => {
    // Per-machine renderer — disable shadows and cap pixel ratio for performance
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth || 400, canvas.clientHeight || 300);
    renderer.shadowMap.enabled = false;  // shadows disabled — too expensive for 3 simultaneous renderers
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    machineRenderers.push(renderer);

    // Per-machine scene
    const scene = new THREE.Scene();
    machineScenes.push(scene);

    // Lights — simplified for performance
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const dir = new THREE.DirectionalLight(0xffffff, 2.0);
    dir.position.set(5, 10, 5);
    dir.castShadow = false;
    scene.add(dir);
    const neon = new THREE.PointLight(0x00D4FF, 2, 20);
    neon.position.set(-3, 3, 3);
    scene.add(neon);

    // Per-machine camera
    const w = canvas.clientWidth  || 400;
    const h = canvas.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 1.5, 5);
    camera.lookAt(0, 0, 0);
    machineCameras.push(camera);

    // Build procedural machine group
    const group = _buildMachineGeometry(idx);
    scene.add(group);
    machineGroups.push(group);

    rotationSpeeds.push(BASE_SPEED);
    rimLights.push(null);
    visibleFlags.push(true);

    // Observe for visibility
    observer.observe(canvas);
  });

  // Wire spec panel close button
  const closeBtn = document.querySelector('.spec-panel-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', _closeSpecPanel);
  }
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') _closeSpecPanel();
  });
}

// ─── onMachineHover ───────────────────────────────────────────────────────────
export function onMachineHover(index) {
  if (index < 0 || index >= machineGroups.length) return;

  // 3× rotation speed
  rotationSpeeds[index] = BASE_SPEED * 3;

  // Add rim light if not already present
  if (!rimLights[index]) {
    const rim = new THREE.PointLight(0x00D4FF, 3, 10);
    rim.position.set(0, 0, -3);
    machineGroups[index].add(rim);
    rimLights[index] = rim;
  }
}

// ─── onMachineLeave ───────────────────────────────────────────────────────────
export function onMachineLeave(index) {
  if (index < 0 || index >= machineGroups.length) return;

  rotationSpeeds[index] = BASE_SPEED;

  if (rimLights[index]) {
    machineGroups[index].remove(rimLights[index]);
    rimLights[index].dispose?.();
    rimLights[index] = null;
  }
}

// ─── onMachineClick ───────────────────────────────────────────────────────────
export function onMachineClick(index) {
  if (index < 0 || index >= MACHINES.length) return;

  const machine   = MACHINES[index];
  const panel     = document.getElementById('spec-panel');
  const content   = document.getElementById('spec-panel-content');
  if (!panel || !content) return;

  // Populate spec panel
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

  // Ensure panel is visible before animating
  panel.setAttribute('aria-hidden', 'false');
  panel.style.display = 'block';

  // Prevent body scroll while panel is open
  document.body.style.overflow = 'hidden';

  // Slide in from right using GSAP
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(panel,
      { x: '100%' },
      { x: '0%', duration: 0.4, ease: 'power3.out' }
    );
  } else {
    panel.style.transform = 'translateX(0)';
  }
}

// ─── _closeSpecPanel ─────────────────────────────────────────────────────────
export function closeSpecPanel() {
  const panel = document.getElementById('spec-panel');
  if (!panel || panel.getAttribute('aria-hidden') === 'true') return;

  if (typeof gsap !== 'undefined') {
    gsap.to(panel, {
      x: '100%',
      duration: 0.3,
      ease: 'power3.in',
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

function _closeSpecPanel() {
  closeSpecPanel();
}

// ─── updateMachines ───────────────────────────────────────────────────────────
/**
 * Per-frame update: rotate each machine and re-render its canvas.
 * Skips canvases that are not currently visible in the viewport.
 * @param {number} delta  Seconds since last frame.
 */
export function updateMachines(delta) {
  machineGroups.forEach((group, idx) => {
    // Skip rendering if canvas is off-screen — major perf win
    if (!visibleFlags[idx]) return;
    group.rotation.y += rotationSpeeds[idx];
    machineRenderers[idx].render(machineScenes[idx], machineCameras[idx]);
  });
}

// ─── enableOrbitControls ─────────────────────────────────────────────────────
/**
 * Attach drag-rotate interaction to a machine canvas.
 * Uses a custom mouse/touch implementation (no OrbitControls dependency).
 * @param {HTMLCanvasElement} canvas
 * @param {number} index
 */
export function enableOrbitControls(canvas, index) {
  let isDragging = false;
  let prevX = 0, prevY = 0;

  function onDown(x, y) { isDragging = true; prevX = x; prevY = y; }
  function onMove(x, y) {
    if (!isDragging) return;
    const dx = x - prevX;
    const dy = y - prevY;
    if (machineGroups[index]) {
      machineGroups[index].rotation.y += dx * 0.01;
      machineGroups[index].rotation.x += dy * 0.01;
    }
    prevX = x; prevY = y;
  }
  function onUp() { isDragging = false; }

  canvas.addEventListener('mousedown',  e => onDown(e.clientX, e.clientY));
  canvas.addEventListener('mousemove',  e => onMove(e.clientX, e.clientY));
  canvas.addEventListener('mouseup',    onUp);
  canvas.addEventListener('mouseleave', onUp);

  canvas.addEventListener('touchstart', e => { const t = e.touches[0]; onDown(t.clientX, t.clientY); }, { passive: true });
  canvas.addEventListener('touchmove',  e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); }, { passive: true });
  canvas.addEventListener('touchend',   onUp);
}

// ─── Private: procedural geometry ────────────────────────────────────────────
function _buildMachineGeometry(index) {
  const group   = new THREE.Group();
  const metal   = new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.3, color: 0xdddddd });
  const accent  = new THREE.MeshStandardMaterial({ metalness: 0.8, roughness: 0.2, color: 0x00D4FF, emissive: 0x003344 });

  if (index === 0) {
    // VMC — vertical column + table + spindle
    group.add(_mesh(new THREE.BoxGeometry(1.2, 2.5, 1.0), metal, [0, 0, 0]));
    group.add(_mesh(new THREE.BoxGeometry(2.0, 0.15, 1.5), metal, [0, -1.1, 0.3]));
    group.add(_mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 16), accent, [0, 0.8, 0]));
    group.add(_mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 12), metal, [0, 0.1, 0]));
    group.add(_mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 24), accent, [0, 1.5, 0]));
  } else if (index === 1) {
    // HMC — horizontal spindle
    group.add(_mesh(new THREE.BoxGeometry(2.0, 1.8, 1.2), metal, [0, 0, 0]));
    group.add(_mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.6, 16), accent, [0, 0, 0]));
    group.rotation.z = Math.PI / 2;
    group.add(_mesh(new THREE.BoxGeometry(0.8, 0.8, 0.15), metal, [0.9, 0, 0]));
    group.add(_mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 24), accent, [0.9, 0, 0]));
  } else {
    // VTL — vertical turning lathe (large disc + column)
    group.add(_mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 32), metal, [0, -0.5, 0]));
    group.add(_mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 12), accent, [0, 0.5, 0]));
    group.add(_mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), metal, [0.8, 0.2, 0]));
    group.add(_mesh(new THREE.TorusGeometry(0.8, 0.05, 8, 32), accent, [0, -0.5, 0]));
  }

  return group;
}

function _mesh(geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow    = true;
  mesh.receiveShadow = true;
  return mesh;
}
