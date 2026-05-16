export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('.about-left', 
        { x: -60, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.about-right', 
        { x: 60, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    },
    once: true
  });
}
