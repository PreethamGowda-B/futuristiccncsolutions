export function init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.fromTo('.industry-tile',
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      stagger: 0.08,
      duration: 0.5,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '#industries',
        start: 'top 80%',
        once: true
      }
    }
  );
}
