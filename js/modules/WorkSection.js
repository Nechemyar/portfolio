import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkSection {
  constructor() {
    this.section = document.querySelector('.work');
    this.tagline = document.querySelector('.js-work-tagline');
    this.magic   = document.querySelector('.js-work-magic');

    if (!this.section) return;
    this.init();
  }

  init() {
    if (this.tagline) gsap.set(this.tagline, { y: '110%' });
    if (this.magic)   gsap.set(this.magic,   { y: '110%' });

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
  }
}
