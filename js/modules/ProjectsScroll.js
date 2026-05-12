import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit sequence.
 *
 * The hero keeps its pink stage visible while the scroll transition clears in
 * layers: footer first, marquee second, cat lifting quickly through the gap.
 * That sets up a cleaner handoff into the featured-projects intro.
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
      duration: 0.22,
    }, 0)
      .to(wrapper, {
        y: '-112vh',
        duration: 0.58,
        ease: 'power2.out',
      }, 0.06)
      .to('.hero__gradient', {
        opacity: 0,
        duration: 0.3,
      }, 0.08)
      .to('.marquee', {
        yPercent: 190,
        opacity: 0,
        duration: 0.4,
      }, 0.18)
      .to('.hero__halo', {
        opacity: 0,
        duration: 0.28,
      }, 0.18);

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
