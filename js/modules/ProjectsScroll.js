import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class ProjectsScroll {
  constructor() {
    this.init();
  }

  init() {
    const section = document.querySelector('.projects');
    const track = document.querySelector('.projects__track');
    const title = document.querySelector('.projects__title');
    if (!section || !track) return;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    // ——— Hero exit: as user scrolls past hero, marquee/footer fade,
    // cat scales down + shifts up so the transition into Projects feels intentional.
    gsap.to('.marquee', {
      yPercent: 80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'bottom 95%',
        end: 'bottom 30%',
        scrub: 1,
      },
    });
    gsap.to('.hero__footer', {
      yPercent: 60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'bottom 95%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    // ——— Pinned scroll: title slides in, then horizontal cat track scrubs left.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getDistance() + window.innerHeight}`,
        pin: '.projects__pin',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (title) {
      tl.from(title, { yPercent: -200, opacity: 0, duration: 0.4, ease: 'none' });
    }

    tl.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      duration: 2,
    });

    // ——— Hide the global sticky CTA while Projects owns the viewport.
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => document.body.classList.add('projects-active'),
      onLeave: () => document.body.classList.remove('projects-active'),
      onEnterBack: () => document.body.classList.add('projects-active'),
      onLeaveBack: () => document.body.classList.remove('projects-active'),
    });
  }
}
