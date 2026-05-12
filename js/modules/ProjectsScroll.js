import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * The .hero section is 250vh tall and contains a sticky .hero__stage (100vh).
 * As the user scrolls the 150vh of runway, this timeline scrubs in a single
 * phase: the cat slides UP off-screen while the marquee, footer, and bottom
 * gradient slide DOWN off-screen simultaneously. No zoom — both elements just
 * leave, exposing the pink stage colour beneath.
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

    // Cat slides UP off-screen (no scale). Text/gradient/footer slide DOWN.
    // Halo fades. All in parallel — the user sees the cat lift and the bottom
    // chrome drop, leaving the pink stage clean for the next section.
    tl.to(wrapper, { y: '-110vh', duration: 1 }, 0)
      .to('.marquee', { yPercent: 180, duration: 1 }, 0)
      .to('.hero__footer', { yPercent: 200, opacity: 0, duration: 1 }, 0)
      .to('.hero__gradient', { opacity: 0, duration: 1 }, 0)
      .to('.hero__halo', { opacity: 0, duration: 1 }, 0);

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
