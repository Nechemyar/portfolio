gsap.registerPlugin(ScrollTrigger);

export default class ScrollReveal {
  constructor() {
    this.init();
  }

  init() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!reveals.length) return;

    // Hero elements: stagger in on load
    const heroReveals = document.querySelectorAll('.hero [data-reveal]');
    if (heroReveals.length) {
      gsap.to(heroReveals, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    // Everything else: reveal on scroll
    reveals.forEach((el) => {
      const isHero = el.closest('.hero');
      if (isHero) return;

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }
}