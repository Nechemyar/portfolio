import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * On the first scroll beat the hero stage's own background colour transitions
 * pink → white while every element on it leaves at once:
 *   - cat (with halo) floats up off the top
 *   - footer text, marquee, and bottom gradient slide DOWN off the bottom
 * The stage stays pinned (and on top of the featured pin via z-index) while
 * this plays so nothing from the next section can slide in over the exit.
 * Scroll-back reverses every step so the hero rebuilds cleanly.
 */
export default class ProjectsScroll {
  constructor() {
    this.init();
  }

  init() {
    const hero = document.querySelector('.hero');
    const stage = document.querySelector('.hero__stage');
    const wrapper = document.querySelector('.hero__cat-wrapper');
    if (!hero || !stage || !wrapper) return;

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

    // All exits + the stage colour shift happen together within the first
    // beat of the scrub so it reads as one continuous flow.
    tl.to(stage, {
      backgroundColor: '#ffffff',
      duration: 0.32,
      ease: 'power1.inOut',
    }, 0)
      .to(wrapper, {
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
      // Hold the cleared white state through the rest of the runway so the
      // featured pin underneath is only revealed once the hero unpinns.
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
