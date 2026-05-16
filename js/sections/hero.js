import { getCamera } from '../engine.js';

export function init() {
  if (typeof gsap === 'undefined') return;

  const title = document.querySelector('.hero-title');
  if (title) {
    const text = title.textContent;
    title.innerHTML = '';
    for (let char of text) {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char;
      if (char === ' ') span.style.whiteSpace = 'pre';
      title.appendChild(span);
    }

    gsap.fromTo('.hero-title .char', 
      { opacity: 0, y: 40, rotateX: -90 }, 
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 0.8, ease: 'back.out(1.7)', delay: 0.5 }
    );
  }

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const camera = getCamera();
      if (!camera) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      gsap.to(camera.rotation, {
        y: -x * 0.26,
        x: y * 0.26,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }

  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator && typeof ScrollTrigger !== 'undefined') {
    gsap.to(scrollIndicator, {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '100px top',
        scrub: true
      }
    });
  }
}
