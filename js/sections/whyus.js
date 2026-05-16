import { scrollTo } from '../scroll.js';

export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const cards = document.querySelectorAll('.differentiator-card');
  cards.forEach((card, index) => {
    const xOffset = index % 2 === 0 ? -60 : 60;
    gsap.fromTo(card,
      { x: xOffset, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: index * 0.12,
        scrollTrigger: {
          trigger: '#why-us',
          start: 'top 70%',
          once: true
        }
      }
    );
  });

  const ctaBtn = document.querySelector('.why-us-cta .btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo('#contact');
    });
  }
}
