import { initPreloader, exitPreloader } from './preloader.js';
import { initEngine, getScene, getRenderer, startLoop } from './engine.js';
import { createParticleSystem, updateParticles, setParticleCount } from './particles.js';
import { initMachines, updateMachines, enableOrbitControls } from './machines.js';
import { initScroll } from './scroll.js';
import { initCursor } from './cursor.js';
import { initNavigation, initCounters, initLightbox, initContactForm, initThemeToggle, initWhatsAppWidget, initBackToTop } from './ui.js';

import { init as initHero } from './sections/hero.js';
import { init as initAbout } from './sections/about.js';
import { init as initServices } from './sections/services.js';
import { init as initIndustries } from './sections/industries.js';
import { init as initGallery } from './sections/gallery.js';
import { init as initWhyUs } from './sections/whyus.js';
import { init as initContact } from './sections/contact.js';
import { init as initMachinesSection } from './sections/machines.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  let webglAvailable = false;
  if (canvas) {
    try {
      webglAvailable = !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch (e) {
      webglAvailable = false;
    }
  }

  if (!webglAvailable) {
    document.body.classList.add('no-webgl');
  }

  // Initialize theme early to avoid flash
  initThemeToggle();

  initPreloader().then(() => {
    if (webglAvailable) {
      initEngine(canvas);
      const scene = getScene();
      const count = 500;
      createParticleSystem(scene, count);
      initMachines();

      // Mobile performance detection
      if (window.innerWidth < 768 || navigator.hardwareConcurrency < 4) {
        setParticleCount(100);
        const renderer = getRenderer();
        if (renderer) {
          renderer.shadowMap.enabled = false;
          renderer.setPixelRatio(1);
        }
      }

      startLoop((delta) => {
        updateParticles(delta);
        updateMachines(delta);
      });

      const machineCanvases = document.querySelectorAll('.machine-canvas');
      machineCanvases.forEach((c, i) => enableOrbitControls(c, i));
    }

    initScroll();
    initCursor();
    initNavigation();
    initCounters();
    initLightbox();
    initContactForm();
    initWhatsAppWidget();
    initBackToTop();

    initHero();
    initAbout();
    initServices();
    initIndustries();
    initGallery();
    initWhyUs();
    initContact();
    initMachinesSection();

    exitPreloader();
  });
});
