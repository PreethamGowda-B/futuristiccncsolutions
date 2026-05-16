/**
 * particles.js — Hero Particle System
 * Floating neon particles + layered smoke planes using Three.js Points.
 */

import * as THREE from 'three';

// ─── Module state ─────────────────────────────────────────────────────────────
let particleMesh    = null;
let velocities      = null;
let sceneRef        = null;
let currentCount    = 0;
const smokePlanes   = [];
let smokeTime       = 0;

// Bounding box for particle wrap-around
const BOUNDS = { x: 20, y: 20, z: 10 };

// ─── createParticleSystem ─────────────────────────────────────────────────────
/**
 * Build and add the particle system to the scene.
 * @param {THREE.Scene} scene
 * @param {number} count  Number of particles (500 desktop, 100 mobile).
 */
export function createParticleSystem(scene, count) {
  sceneRef     = scene;
  currentCount = count;

  // ── Geometry ────────────────────────────────────────────────────────────────
  const geometry  = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  velocities      = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * BOUNDS.x;
    positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS.y;
    positions[i3 + 2] = (Math.random() - 0.5) * BOUNDS.z;

    // Random drift velocity (slow)
    velocities[i3]     = (Math.random() - 0.5) * 0.5;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // ── Material ────────────────────────────────────────────────────────────────
  const material = new THREE.PointsMaterial({
    color:       0x00D4FF,
    size:        0.05,
    transparent: true,
    opacity:     0.8,
    sizeAttenuation: true,
    depthWrite:  false,
  });

  // ── Mesh ────────────────────────────────────────────────────────────────────
  particleMesh = new THREE.Points(geometry, material);
  scene.add(particleMesh);

  // ── Smoke planes ────────────────────────────────────────────────────────────
  _createSmokePlanes(scene);

  return particleMesh;
}

// ─── updateParticles ──────────────────────────────────────────────────────────
/**
 * Called every frame. Drifts particles and animates smoke opacity.
 * @param {number} delta  Seconds since last frame.
 */
export function updateParticles(delta) {
  if (!particleMesh) return;

  smokeTime += delta;

  // ── Drift particles ─────────────────────────────────────────────────────────
  const positions = particleMesh.geometry.attributes.position.array;
  const count     = currentCount;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3]     += velocities[i3]     * delta;
    positions[i3 + 1] += velocities[i3 + 1] * delta;
    positions[i3 + 2] += velocities[i3 + 2] * delta;

    // Wrap-around
    const hx = BOUNDS.x / 2, hy = BOUNDS.y / 2, hz = BOUNDS.z / 2;
    if (positions[i3]     >  hx) positions[i3]     = -hx;
    if (positions[i3]     < -hx) positions[i3]     =  hx;
    if (positions[i3 + 1] >  hy) positions[i3 + 1] = -hy;
    if (positions[i3 + 1] < -hy) positions[i3 + 1] =  hy;
    if (positions[i3 + 2] >  hz) positions[i3 + 2] = -hz;
    if (positions[i3 + 2] < -hz) positions[i3 + 2] =  hz;
  }

  particleMesh.geometry.attributes.position.needsUpdate = true;

  // ── Animate smoke opacity ───────────────────────────────────────────────────
  smokePlanes.forEach((plane, idx) => {
    const phase   = idx * (Math.PI * 2 / smokePlanes.length);
    const opacity = 0.02 + 0.03 * (0.5 + 0.5 * Math.sin(smokeTime * 0.4 + phase));
    plane.material.opacity = opacity;
  });
}

// ─── setParticleCount ─────────────────────────────────────────────────────────
/**
 * Dispose existing geometry and recreate with a new count.
 * Used to reduce to 100 on mobile.
 * @param {number} n  New particle count.
 */
export function setParticleCount(n) {
  if (!sceneRef) return;

  // Dispose old
  if (particleMesh) {
    particleMesh.geometry.dispose();
    particleMesh.material.dispose();
    sceneRef.remove(particleMesh);
    particleMesh = null;
  }

  createParticleSystem(sceneRef, n);
}

// ─── Private: smoke planes ────────────────────────────────────────────────────
function _createSmokePlanes(scene) {
  // Remove any existing smoke planes
  smokePlanes.forEach(p => {
    p.geometry.dispose();
    p.material.dispose();
    scene.remove(p);
  });
  smokePlanes.length = 0;

  for (let i = 0; i < 5; i++) {
    const geo = new THREE.PlaneGeometry(30, 20);
    const mat = new THREE.MeshBasicMaterial({
      color:       0x88CCFF,
      transparent: true,
      opacity:     0.04,
      depthWrite:  false,
      side:        THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(geo, mat);
    plane.position.z = -2 - i * 1.5;
    plane.position.x = (Math.random() - 0.5) * 4;
    plane.position.y = (Math.random() - 0.5) * 2;
    plane.rotation.z = Math.random() * Math.PI * 0.1;

    scene.add(plane);
    smokePlanes.push(plane);
  }
}
