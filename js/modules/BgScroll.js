import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// BgScroll — smooth background color transitions between sections.
// Each section with a [data-bg] attribute defines its background color.
// ScrollTrigger tweens document.body background as the section enters view.

export default class BgScroll {
  constructor() {
    this.sections = document.querySelectorAll('[data-bg]');
    if (!this.sections.length) return;

    // Set initial body background from the first section
    const first = this.sections[0];
    if (first) {
      document.body.style.backgroundColor = first.dataset.bg;
    }

    this.init();
  }

  init() {
    this.sections.forEach((section) => {
      const color = section.dataset.bg;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        onEnter: () => this.tween(color),
        onEnterBack: () => this.tween(color),
      });
    });
  }

  tween(color) {
    // Reduced-motion: skip animation, set instantly
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.style.backgroundColor = color;
      return;
    }

    gsap.to(document.body, {
      backgroundColor: color,
      duration: 0.9,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }
}
