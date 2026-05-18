import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero exit + Featured Projects intro.
 *
 * Everything happens within the hero's pinned region (350vh tall — 100vh
 * visible + 250vh of scroll runway):
 *
 *   Beat 1 (scroll 0–50vh)    hero exits + bg pink→white. The eyebrow
 *                             starts rising near the end of this beat so
 *                             "Featured Projects" appears AS the screen
 *                             turns white (no blank-white pause).
 *   Beat 2 (scroll 30–100vh)  eyebrow finishes rising
 *   Beat 3 (scroll 100–200vh) eyebrow holds — lands the first swipe
 *   Beat 4 (scroll 200–250vh) hero stage fades out (eyebrow fades with
 *                             it as a child) while the featured pin
 *                             underneath fades the first card in — reads
 *                             as a clean crossfade between the two.
 *
 * The hero stage is z-indexed above the featured pin so the featured pin
 * can't paint over the hero during the overlap; the hero stage only stops
 * blocking the featured pin once its opacity goes to 0.
 */
export default class ProjectsScroll {
  constructor() {
    this.init();
  }

  init() {
    const hero = document.querySelector('.hero');
    const stage = document.querySelector('.hero__stage');
    const wrapper = document.querySelector('.hero__cat-wrapper');
    const eyebrowInner = document.querySelector('.hero__intro-eyebrow-inner');
    if (!hero || !stage || !wrapper) return;

    gsap.set(wrapper, { xPercent: -50, yPercent: -50 });
    if (eyebrowInner) gsap.set(eyebrowInner, { y: '110%', opacity: 0 });

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

    // Beat 1: hero exit (cat up, footer/gradient/marquee down, bg pink → white)
    tl.to(stage, {
      backgroundColor: '#F6F2EB',
      duration: 0.6,
      ease: 'power1.inOut',
    }, 0)
      .to(wrapper, {
        y: '-130vh',
        duration: 0.65,
        ease: 'power2.in',
      }, 0)
      /* Gradient stays put as the cat exits — its solid-rust bottom
         lines up with the featured section underneath, so the seam
         between hero and the next section is invisible. */
      // y in vh keeps the slide consistent across breakpoints — yPercent
      // alone underflowed on mobile where the footer sat at bottom: 24vh
      // (CTA above the marquee) and 260% of its own height wasn't enough
      // to clear the viewport. autoAlpha pairs with it so the element is
      // hidden once it's offscreen rather than just translated away.
      .to('.hero__footer', {
        y: '50vh',
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.in',
      }, 0)
      .to('.marquee', {
        y: '50vh',
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.in',
      }, 0);

    // Beat 2: eyebrow rises (starts inside beat 1 so the title appears AS
    // the screen turns white, not after a blank pause).
    if (eyebrowInner) {
      tl.to(eyebrowInner, {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.4);
    }

    // Beat 3: eyebrow holds (consumes scroll without visual change so the
    // user lands cleanly on the "Featured Projects" frame after swipe 1).
    tl.to({}, { duration: 1.2 }, 1.2);

    // Beat 4: hero stage fades out — the eyebrow goes with it (child of
    // the stage), and FeaturedProjects crossfades the first card in at the
    // same time, so the swap reads as eyebrow → card 0. autoAlpha so the
    // stage also goes visibility:hidden once invisible (otherwise it would
    // still absorb clicks intended for the featured card underneath).
    tl.to(stage, {
      autoAlpha: 0,
      duration: 0.6,
      ease: 'power1.inOut',
    }, 2.4);
    tl.to({}, { duration: 0.2 }, 3.0);

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
