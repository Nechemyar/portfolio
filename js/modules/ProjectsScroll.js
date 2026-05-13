import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * On the first scroll beat, everything in the hero leaves at once:
 *   - cat + halo float up and away
 *   - footer text slides DOWN off the bottom edge
 *   - bottom gradient slides DOWN off the bottom edge
 *   - marquee slides DOWN off the bottom edge
 *   - the pink stage is wiped to white by a fading wash
 *
 * Scroll-back reverses every step so the hero rebuilds cleanly.
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
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // All exits happen together in the first beat — cat up, everything else
    // down, pink → white. After this the timeline simply holds the cleared
    // state until the featured pin takes over.
    tl.to(wrapper, {
      y: '-130vh',
      duration: 0.34,
      ease: 'power2.in',
    }, 0)
      .to('.hero__gradient', {
        yPercent: 110,
        duration: 0.32,
        ease: 'power2.in',
      }, 0)
      .to('.hero__footer', {
        yPercent: 260,
        duration: 0.32,
        ease: 'power2.in',
      }, 0)
      .to('.marquee', {
        yPercent: 260,
        duration: 0.32,
        ease: 'power2.in',
      }, 0)
      .to('.hero__scene-wash', {
        opacity: 1,
        duration: 0.26,
        ease: 'power1.out',
      }, 0.06)
      .to({}, { duration: 0.34 }, 0.34);

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
