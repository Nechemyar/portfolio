import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export default class ScrollReveal {
  constructor() {
    this.init();
  }

  init() {
    const reveals = document.querySelectorAll('[data-reveal]');

    // Hide hero copy immediately so it's ready for animation. Do not animate
    // opacity or transform on .hero__work-card: that parent stacking context
    // prevents the TV image's multiply blend from rendering until clearProps.
    const copyCard = document.querySelector('.hero__copy-card');
    const tvWrappers = document.querySelectorAll('.hero__cat-wrapper');

    if (tvWrappers.length) gsap.set(tvWrappers, { y: 34 });
    if (copyCard) gsap.set(copyCard, { opacity: 0, y: 40 });

    // Wait for the loader to finish before animating the hero
    // We also wait to create general reveals until layout is stable
    document.addEventListener('hero:ready', () => {
      const tl = gsap.timeline();

      // Animate the TV itself, not its parent card, so mix-blend-mode stays live
      // throughout the entrance instead of popping on at the end.
      if (tvWrappers.length) {
        tl.to(tvWrappers, {
          y: 0,
          duration: 1,
          ease: 'power4.out',
          clearProps: 'y',
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

      // Everything else: create reveals ONLY after page layout stabilizes
      if (reveals.length) {
        // Force a scroll trigger refresh just in case
        ScrollTrigger.refresh();
        
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
    });
  }
}
