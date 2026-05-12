import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Unified hero → projects sequence.
 *
 * The .hero section is 500vh tall and contains a sticky .hero__stage (100vh).
 * As the user scrolls the 400vh of runway, this single timeline scrubs:
 *
 *   Phase A (0.00 → 1.00):  marquee + footer slide DOWN off-screen,
 *                            bottom gradient fades, hero cat scales/shifts
 *                            to centered viewport-fit size (reel keeps cycling).
 *   Phase B (1.00 → 1.60):  hero cat slides off to the LEFT.
 *   Phase C (1.20 → 2.00):  "PROJECTS" title slides + fades in from above.
 *                            Background color overlay fades in.
 *   Phase D (1.80 → 4.50):  horizontal cat carousel scrubs from right → left.
 *
 * Total timeline duration ≈ 4.5s, mapped to the 400vh scroll runway by scrub.
 */
export default class ProjectsScroll {
  constructor() {
    this.init();
  }

  init() {
    const hero = document.querySelector('.hero');
    const wrapper = document.querySelector('.hero__cat-wrapper');
    const track = document.querySelector('.hero__projects-track');
    const title = document.querySelector('.hero__projects-title');
    if (!hero || !wrapper || !track) return;

    // Base state — let GSAP own these transforms so timeline tweens compose cleanly.
    gsap.set(wrapper, { xPercent: -50, yPercent: -50 });
    gsap.set(title, { xPercent: -50, yPercent: -200, opacity: 0 });

    const getTrackTravel = () => {
      const trackWidth = track.scrollWidth;
      const pad = window.innerWidth * 0.1;
      return Math.max(0, trackWidth - window.innerWidth + pad);
    };

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

    // ——— Phase C: background shifts + "PROJECTS" title comes in (1.0 → 2.0) ———
    tl.to('.hero__bg-shift', { opacity: 1, duration: 1 }, 1)
      .to(title, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
      }, 1.2);

    // ——— Phase D: horizontal cat carousel scrubs (1.8 → 4.5) ———
    tl.to(track, {
      x: () => `-${getTrackTravel()}px`,
      duration: 2.7,
    }, 1.8);

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
