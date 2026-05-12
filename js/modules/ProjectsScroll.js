import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * The .hero section is 250vh tall and contains a sticky .hero__stage (100vh).
 * As the user scrolls the 150vh of runway, this timeline scrubs:
 *
 *   Phase A (0.00 → 1.00):  marquee + footer slide DOWN off-screen,
 *                            bottom gradient fades, hero cat scales/shifts
 *                            to centered viewport-fit size (reel keeps cycling).
 *   Phase B (1.00 → 1.60):  hero cat slides off to the LEFT.
 *
 * After the hero releases, the next section (FeaturedProjects) takes over.
 */
export default class ProjectsScroll {
  constructor() {
    this.init();
  }

  init() {
    const hero = document.querySelector('.hero');
    const wrapper = document.querySelector('.hero__cat-wrapper');
    if (!hero || !wrapper) return;

    gsap.set(wrapper, { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // ——— Phase A: hero exit + cat to center (0 → 1) ———
    tl.to('.marquee', { yPercent: 180, duration: 1 }, 0)
      .to('.hero__footer', { yPercent: 200, opacity: 0, duration: 1 }, 0)
      .to('.hero__gradient', { opacity: 0, duration: 1 }, 0)
      .to(wrapper, {
        scale: 0.55,
        top: '50%',
        duration: 1,
      }, 0);

    // ——— Phase B: hero cat slides off LEFT (1 → 1.6) ———
    tl.to(wrapper, {
      x: '-120vw',
      duration: 0.6,
    }, 1);

    // Hide global sticky-cta while the hero sequence owns the viewport.
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => document.body.classList.add('hero-sequence-active'),
      onLeave: () => document.body.classList.remove('hero-sequence-active'),
      onEnterBack: () => document.body.classList.add('hero-sequence-active'),
      onLeaveBack: () => document.body.classList.remove('hero-sequence-active'),
    });
  }
}
