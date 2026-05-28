import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkSection {
  constructor() {
    this.section = document.querySelector('.work');
    this.tagline = document.querySelector('.js-work-tagline');
    this.magic   = document.querySelector('.js-work-magic');
    this.ticker  = document.querySelector('.js-work-ticker');
    this.tvs     = document.querySelectorAll('.js-work-ticker .js-tv');
    this.track   = document.querySelector('.work__tv-track');

    if (!this.section) return;
    this.init();
  }

  init() {
    // Hide everything initially
    if (this.tagline) {
      gsap.set(this.tagline, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 30, opacity: 1 });
    }
    if (this.magic) {
      gsap.set(this.magic, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 50 });
    }
    if (this.tvs.length) {
      gsap.set(this.tvs, { opacity: 0, scale: 0.85 });
    }
    // Hide the whole ticker row until TVs reveal
    if (this.ticker) {
      gsap.set(this.ticker, { opacity: 0 });
    }

    ScrollTrigger.create({
      trigger: this.section,
      start: 'top 65%',
      once: true,
      onEnter: () => this.reveal(),
    });
  }

  reveal() {
    const tl = gsap.timeline();

    // 1. Tagline wipes up
    if (this.tagline) {
      tl.to(this.tagline, {
        clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
      });
    }

    // 2. MAGIC image slides up
    if (this.magic) {
      tl.to(this.magic, {
        clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        onComplete: () => {
          // Float loop starts after reveal
          gsap.to(this.magic, {
            y: -16,
            duration: 2.8,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      }, '-=0.4');
    }

    // 3. Show ticker row, then stagger TVs on one at a time
    if (this.ticker && this.tvs.length) {
      tl.to(this.ticker, { opacity: 1, duration: 0.01 }, '-=0.1');

      tl.to(this.tvs, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: 'back.out(1.4)',
        stagger: 0.1,
        onComplete: () => {
          // Start CSS scroll ticker after all TVs are visible
          if (this.track) this.track.classList.add('is-rolling');
        },
      }, '-=0.2');
    }
  }
}
