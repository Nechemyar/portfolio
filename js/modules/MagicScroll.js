import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class MagicScroll {
  constructor() {
    this.section = document.querySelector('.magic-showcase');
    this.stage = document.getElementById('magic-stage');
    this.subtitle = document.getElementById('magic-subtitle');
    this.wordmark = document.getElementById('magic-wordmark');
    this.tv = document.getElementById('magic-tv');

    if (!this.section || !this.stage) return;

    this.init();
  }

  init() {
    // 1. Initial State Setup
    // Hide everything before animation starts
    gsap.set(this.subtitle, { y: 100, opacity: 0 });
    // Wipes from center out horizontally
    gsap.set(this.wordmark, { clipPath: 'inset(0 50% 0 50%)', scale: 0.8 });
    // TV hides below screen
    gsap.set(this.tv, { y: '100vh', opacity: 0 });

    // 2. Timeline construction
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: '+=4000', // 4000px of scrolling gives plenty of time to read and enjoy the sequence
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // Sequence Step 1: Subtitle fades and slides up into the center
    tl.to(this.subtitle, { y: 0, opacity: 1, duration: 2 })
      // Pause for reading
      .to({}, { duration: 1 })
      
      // Sequence Step 2: Subtitle slides up to the top to create negative space
      .to(this.subtitle, { y: '-40vh', scale: 0.8, opacity: 0.6, duration: 2 }, "+=0.5")
      
      // Sequence Step 3: MAGIC masks on in the center
      .to(this.wordmark, { clipPath: 'inset(0 0% 0 0%)', scale: 1, duration: 2.5, ease: 'power2.inOut' }, "<0.5")
      
      // Pause to appreciate the wordmark
      .to({}, { duration: 1 })
      
      // Sequence Step 4: TV slides up from the bottom, overlapping the MAGIC wordmark
      .to(this.tv, { y: 0, opacity: 1, duration: 3, ease: 'power3.out' });

  }
}
