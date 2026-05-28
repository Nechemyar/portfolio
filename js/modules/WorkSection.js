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
    if (this.tagline) gsap.set(this.tagline, { y: '110%' });
    if (this.magic)   gsap.set(this.magic,   { y: '110%' });
    if (this.tvs.length) gsap.set(this.tvs, { opacity: 0, y: 30, scale: 0.88 });
    if (this.ticker)     gsap.set(this.ticker, { opacity: 0 });

    window.addEventListener('load', () => ScrollTrigger.refresh());

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top 65%',
      once: true,
      onEnter: () => this.reveal(),
    });
  }

  reveal() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    if (this.tagline) {
      tl.to(this.tagline, { y: '0%', duration: 1.0 });
    }

    if (this.magic) {
      tl.to(this.magic, {
        y: '0%',
        duration: 1.3,
        onComplete: () => {
          // Float goes DOWN only so the top never clips the overflow:hidden parent
          gsap.to(this.magic, {
            y: 14,
            duration: 3.0,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      }, '-=0.5');
    }

    if (this.ticker && this.tvs.length) {
      tl.to(this.ticker, { opacity: 1, duration: 0.01 }, '-=0.4');
      tl.to(this.tvs, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
        stagger: 0.08,
        onComplete: () => this._startTicker(),
      }, '-=0.2');
    }
  }

  _startTicker() {
    if (!this.track) return;
    // GSAP-driven ticker — smoother than CSS animation, no layout thrash
    // Half the track width = one full set of 5 items (the seamless loop point)
    const halfW = this.track.scrollWidth / 2;
    gsap.to(this.track, {
      x: -halfW,
      duration: halfW / 80, // ~80px/s — adjust to taste
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % halfW),
      },
    });
  }
}
