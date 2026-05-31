import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkSection {
  constructor() {
    this.section = document.querySelector('.work');
    this.tagline = document.querySelector('.js-work-tagline');
    this.magic   = document.querySelector('.js-work-magic');
    this.cards   = document.querySelectorAll('.work__card');

    if (!this.section) return;
    this.init();
  }

  init() {
    window.addEventListener('load', () => ScrollTrigger.refresh());

    const mm = gsap.matchMedia();

    // Mobile — no animation, cards just visible
    mm.add('(max-width: 768px)', () => {
      if (this.tagline) gsap.set(this.tagline, { clearProps: 'all' });
      if (this.magic)   gsap.set(this.magic,   { clearProps: 'all' });
      if (this.cards.length) gsap.set(this.cards, { clearProps: 'all' });
    });

    // Desktop with motion — staggered card tracks + wipe reveals
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      if (this.tagline) gsap.set(this.tagline, { y: '110%' });
      if (this.magic)   gsap.set(this.magic,   { y: '110%' });

      // Cards start hidden, each on its own y track
      if (this.cards.length) {
        gsap.set(this.cards[0], { y: 80, opacity: 0 });
        gsap.set(this.cards[1], { y: 140, opacity: 0 }); // more offset = more stagger feel
      }

      ScrollTrigger.create({
        trigger: this.section,
        start: 'top 60%',
        once: true,
        onEnter: () => this.reveal(),
      });
    });
  }

  reveal() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    // 1. Tagline wipes up
    if (this.tagline) {
      tl.to(this.tagline, { y: '0%', duration: 0.9 });
    }

    // 2. Cards slide up on separate tracks, quick stagger
    if (this.cards.length) {
      tl.to(this.cards[0], { y: 0, opacity: 1, duration: 1.1 }, '-=0.5');
      // Card 2 has natural CSS margin-top stagger; animate from its offset position
      tl.to(this.cards[1], { y: 0, opacity: 1, duration: 1.1 }, '-=0.85');
    }

    // 3. Magic wipes up last
    if (this.magic) {
      tl.to(this.magic, {
        y: '0%',
        duration: 1.2,
        onComplete: () => {
          gsap.to(this.magic, {
            y: 14,
            duration: 3.0,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      }, '-=0.6');
    }
  }
}
