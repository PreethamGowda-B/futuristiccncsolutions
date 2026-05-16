/**
 * engine.js — Three.js WebGL Engine
 * Manages the shared renderer, scene, camera, lights, and animation loop.
 * Three.js is loaded via importmap CDN as the bare specifier "three".
 */

import * as THREE from 'three';

// ─── Module-level state ───────────────────────────────────────────────────────
let renderer = null;
let scene    = null;
let camera   = null;

let animFrameId  = null;
let loopCallback = null;
let lastTime     = 0;

// ─── initEngine ───────────────────────────────────────────────────────────────
/**
 * Initialise the WebGL renderer, scene, camera, and lights.
 * @param {HTMLCanvasElement} canvas  The #hero-canvas element.
 */
export function initEngine(canvas) {
  // ── Renderer ────────────────────────────────────────────────────────────────
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // ── Scene ───────────────────────────────────────────────────────────────────
  scene = new THREE.Scene();

  // ── Camera ──────────────────────────────────────────────────────────────────
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // ── Lights ──────────────────────────────────────────────────────────────────
  // Ambient — soft fill
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  // Directional key light with shadows
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width  = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far  = 50;
  scene.add(dirLight);

  // Neon accent point light
  const neonLight = new THREE.PointLight(0x00D4FF, 2, 20);
  neonLight.position.set(-3, 3, 3);
  scene.add(neonLight);

  // ── Resize handler ──────────────────────────────────────────────────────────
  window.addEventListener('resize', _onResize);

  // ── Tab visibility ──────────────────────────────────────────────────────────
  document.addEventListener('visibilitychange', _onVisibilityChange);
}

// ─── Getters ──────────────────────────────────────────────────────────────────
export function getScene()    { return scene;    }
export function getRenderer() { return renderer; }
export function getCamera()   { return camera;   }

// ─── Animation loop ───────────────────────────────────────────────────────────
/**
 * Start the requestAnimationFrame loop.
 * @param {function|null} callback  Optional per-frame callback(delta).
 */
export function startLoop(callback) {
  if (callback !== undefined) loopCallback = callback;
  lastTime = performance.now();

  function tick(now) {
    animFrameId = requestAnimationFrame(tick);

    const delta = Math.min((now - lastTime) / 1000, 0.1); // cap at 100ms
    lastTime = now;

    if (loopCallback) loopCallback(delta);

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  animFrameId = requestAnimationFrame(tick);
}

/** Pause the animation loop (e.g. when tab loses focus). */
export function pauseLoop() {
  if (animFrameId !== null) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
}

/** Resume the animation loop. */
export function resumeLoop() {
  if (animFrameId === null) {
    startLoop(); // reuses stored loopCallback
  }
}

// ─── Private helpers ──────────────────────────────────────────────────────────
function _onResize() {
  if (!renderer || !camera) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function _onVisibilityChange() {
  if (document.hidden) {
    pauseLoop();
  } else {
    resumeLoop();
  }
}
