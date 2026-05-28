import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkSection {
  constructor() {
    this.section = document.querySelector('.work');
    this.tagline = document.querySelector('.js-work-tagline');
    this.magic   = document.querySelector('.js-work-magic');
    this.tvs     = document.querySelectorAll('.js-work-ticker .js-tv');
    this.ticker  = document.querySelector('.js-work-ticker');
    this.track   = document.querySelector('.work__tv-track');

    if (!this.section) return;
    this.init();
  }

  init() {
    /*
      Wrap tagline and magic in overflow:hidden containers so the clip-path
      wipe looks like text/image rising from behind a mask — same as the hero.
      We clip the *wrapper* div, not the element itself, so the element's
      natural dimensions are preserved for ScrollTrigger measurement.
    */
    if (this.tagline) {
      this._wrapInMask(this.tagline, 'work__tagline-mask');
      gsap.set(this.tagline, { yPercent: 110 });
    }

    if (this.magic) {
      this._wrapInMask(this.magic, 'work__magic-mask');
      gsap.set(this.magic, { yPercent: 100 });
    }

    if (this.tvs.length) {
      gsap.set(this.tvs, { opacity: 0, y: 30, scale: 0.88 });
    }
    if (this.ticker) {
      gsap.set(this.ticker, { opacity: 0 });
    }

    // Refresh after fonts + images settle
    window.addEventListener('load', () => ScrollTrigger.refresh());

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top 65%',
      once: true,
      onEnter: () => this.reveal(),
    });
  }

  _wrapInMask(el, className) {
    const mask = document.createElement('div');
    mask.className = className;
    mask.style.cssText = 'overflow:hidden;display:block;';
    el.parentNode.insertBefore(mask, el);
    mask.appendChild(el);
  }

  reveal() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. Tagline wipes up from behind mask
    if (this.tagline) {
      tl.to(this.tagline, {
        yPercent: 0,
        duration: 1.0,
      });
    }

    // 2. MAGIC image wipes up — slightly overlaps with tagline finish
    if (this.magic) {
      tl.to(this.magic, {
        yPercent: 0,
        duration: 1.3,
        onComplete: () => {
          gsap.to(this.magic, {
            y: -14,
            duration: 3.0,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      }, '-=0.5');
    }

    // 3. Ticker row fades in, TVs stagger pop on
    if (this.ticker && this.tvs.length) {
      tl.to(this.ticker, { opacity: 1, duration: 0.01 }, '-=0.3');

      tl.to(this.tvs, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        stagger: 0.08,
        onComplete: () => {
          if (this.track) this.track.classList.add('is-rolling');
        },
      }, '-=0.2');
    }
  }
}
