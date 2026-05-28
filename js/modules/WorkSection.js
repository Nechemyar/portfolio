import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkSection {
  constructor() {
    this.magic  = document.querySelector('.js-work-magic');
    this.ticker = document.querySelector('.js-work-ticker');
    if (!this.magic && !this.ticker) return;
    this.init();
  }

  init() {
    if (this.magic) {
      gsap.set(this.magic, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        y: 40,
      });

      ScrollTrigger.create({
        trigger: this.magic,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(this.magic, {
            clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
            y: 0,
            duration: 1.4,
            ease: 'expo.out',
            onComplete: () => {
              gsap.to(this.magic, {
                y: -18,
                duration: 2.8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
              });
            },
          });
        },
      });
    }

    if (this.ticker) {
      gsap.set(this.ticker, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        y: 24,
      });

      ScrollTrigger.create({
        trigger: this.ticker,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(this.ticker, {
            clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
          });
        },
      });
    }
  }
}
