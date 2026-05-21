import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export default class ScrollReveal {
  constructor() {
    this.init();
  }

  init() {
    const reveals = document.querySelectorAll('[data-reveal]');

    // Hide hero elements immediately so they're ready for animation
    const copyCard = document.querySelector('.hero__copy-card');
    const workCard = document.querySelector('.hero__work-card');

    if (workCard) gsap.set(workCard, { opacity: 0, y: 30 });
    if (copyCard) gsap.set(copyCard, { opacity: 0, y: 40 });

    // Wait for the loader to finish before animating the hero
    document.addEventListener('hero:ready', () => {
      const tl = gsap.timeline();

      // Animate work card (TV) in first
      if (workCard) {
        tl.to(workCard, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          clearProps: 'all',
        });
      }

      // Animate the copy card in
      if (copyCard) {
        tl.to(copyCard, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
        }, '-=0.6');
      }
    });

    // Everything else: reveal on scroll
    if (reveals.length) {
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
}