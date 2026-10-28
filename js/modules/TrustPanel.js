// ——————————————————————————————————————————————
// TrustPanel — the trust line
// ——————————————————————————————————————————————
// The last screen of the intro. The line rises through line masks, the same
// reveal as the hero title, then the sentence under it. (The sky around it
// is InkStory.js.)

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default class TrustPanel {
  constructor() {
    this.panel = document.querySelector('.trust');
    if (!this.panel) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.fonts.ready.then(() => this.initLine());
  }

  initLine() {
    const line = this.panel.querySelector('.js-trust-line');
    const what = this.panel.querySelector('.js-trust-what');
    if (!line) return;

    const split = SplitText.create(line, { type: 'lines, words', mask: 'lines', linesClass: 'trust__row' });
    const whatSplit = what
      ? SplitText.create(what, { type: 'lines', mask: 'lines', linesClass: 'trust__row' })
      : null;
    gsap.set(split.words, { yPercent: 115 });
    if (whatSplit) gsap.set(whatSplit.lines, { yPercent: 115 });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      scrollTrigger: { trigger: this.panel, start: 'top 55%', once: true },
      onComplete: () => { split.revert(); whatSplit?.revert(); }
    });
    tl.to(split.words, { yPercent: 0, duration: 1.4, stagger: 0.04 });
    if (whatSplit) tl.to(whatSplit.lines, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.35);
  }
}
