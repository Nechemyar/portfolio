// ——————————————————————————————————————————————
// TrustPanel — the hand-off from the reel to the first screen after it
// ——————————————————————————————————————————————
// The hero is sticky inside .intro, so it holds while the white trust screen
// slides up over it. As the sheet rises, the hero stage eases back like the
// view behind an iOS sheet: it scales down, rounds its corners and dims.
// Scrubbed to the scroll at native speed (no pin, no snapping). The trust
// line then rises through line masks, the same reveal as the hero title.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default class TrustPanel {
  constructor() {
    this.panel = document.querySelector('.trust');
    this.stage = document.querySelector('.hero__stage');
    if (!this.panel || !this.stage) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.initRecede();
    document.fonts.ready.then(() => this.initLine());
  }

  initRecede() {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.panel,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.6
      }
    })
      .to(this.stage, { scale: 0.92, borderRadius: 24, duration: 1 }, 0)
      .to('.hero__dim', { opacity: 0.55, duration: 1 }, 0);
  }

  initLine() {
    const line = this.panel.querySelector('.js-trust-line');
    if (!line) return;

    const split = SplitText.create(line, { type: 'lines, words', mask: 'lines', linesClass: 'trust__row' });
    gsap.set(split.words, { yPercent: 115 });

    gsap.to(split.words, {
      yPercent: 0,
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.04,
      scrollTrigger: { trigger: this.panel, start: 'top 55%', once: true },
      onComplete: () => split.revert()
    });
  }
}
