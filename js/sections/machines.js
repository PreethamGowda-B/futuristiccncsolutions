import { onMachineHover, onMachineLeave, onMachineClick } from '../machines.js';

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.create({
    trigger: '#machine-showcase',
    start: 'top center',
    once: true,
    onEnter: () => {
      gsap.fromTo('.machine-canvas',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }
  });

  const viewports = document.querySelectorAll('.machine-viewport');
  viewports.forEach(vp => {
    const idx = parseInt(vp.getAttribute('data-machine-index') || '0', 10);

    vp.addEventListener('mouseenter', () => onMachineHover(idx));
    vp.addEventListener('mouseleave', () => onMachineLeave(idx));
    vp.addEventListener('click', () => onMachineClick(idx));
    
    vp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onMachineClick(idx);
      }
    });
  });

  const closeBtn = document.querySelector('.spec-panel-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const panel = document.getElementById('spec-panel');
      if (panel) {
        gsap.to(panel, { x: '100%', duration: 0.4, ease: 'power3.in', onComplete: () => {
          panel.setAttribute('aria-hidden', 'true');
        }});
      }
    });
  }
}
