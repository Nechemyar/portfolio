import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * The hero resolves into a single white scene on the first scroll beat:
 * footer and marquee clear, the cat/halo leave together, the dark veil fades,
 * and a white wash takes over before the featured intro arrives.
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

    tl.to('.hero__footer', {
      yPercent: 220,
      opacity: 0,
      duration: 0.12,
    }, 0)
      .to(wrapper, {
        y: '-165vh',
        duration: 0.22,
        ease: 'power2.out',
      }, 0.02)
      .to('.marquee', {
        yPercent: 220,
        opacity: 0,
        duration: 0.18,
      }, 0.08)
      .to('.hero__gradient', {
        opacity: 0,
        duration: 0.14,
      }, 0.08)
      .to('.hero__scene-wash', {
        opacity: 1,
        duration: 0.18,
      }, 0.12)
      // The hero exit should be visually complete before the first full swipe
      // ends; this short hold preserves the finished state through the handoff.
      .to({}, { duration: 0.14 }, 0.3);

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
