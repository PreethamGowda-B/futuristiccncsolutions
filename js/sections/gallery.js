export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.fromTo('.gallery-item',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 80%',
        once: true
      }
    }
  );

  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    item.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.08, duration: 0.4, ease: 'power2.out' });
      if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' });
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    });
  });
}
