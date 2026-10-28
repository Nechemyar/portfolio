// ——————————————————————————————————————————————
// SumiGlass — the glass on the hero CTA
// ——————————————————————————————————————————————
// Picks the best glass each browser can do well:
//  WebGL         SkyHero draws the glass in its own shader, bending the
//                clouds behind it. Same look in every browser.
//  No WebGL, Chromium
//                SVG displacement through backdrop-filter (liquid-glass-web).
//  Anything else .hero__cta's own CSS frost.
//  Reduced transparency
//                A solid pill (handled in _hero.scss).

import { createLiquidGlass } from '../vendor/liquid-glass-web/liquid-glass.js';

export default class SumiGlass {
  constructor(sky) {
    this.el = document.querySelector('.hero__cta');
    // The entrance waits on this so the CTA never shows a half-built glass.
    this.ready = Promise.resolve();
    if (!this.el) return;

    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
      this.el.dataset.glass = 'solid';
      return;
    }

    if (sky && sky.ok) {
      this.el.classList.add('is-gl');
      this.el.dataset.glass = 'sky';
      this.ready = sky.ready;
      return;
    }

    // userAgentData exists only in Chromium; iOS Chrome is WebKit and lacks it.
    const chromium = navigator.userAgentData?.brands?.some((b) => b.brand === 'Chromium');
    if (chromium) {
      this.glass = createLiquidGlass(this.el, { shape: 'pill', refraction: 100, blur: 1, light: 70, pointer: false });
      this.el.dataset.glass = 'svg';
      // the displacement map is built on the next frame
      this.ready = new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return;
    }

    this.el.dataset.glass = 'frost';
  }
}
