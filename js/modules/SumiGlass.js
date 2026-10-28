// ——————————————————————————————————————————————
// SumiGlass — the glass on the hero CTA
// ——————————————————————————————————————————————
// Picks the best glass each browser can do well:
//  Chromium      SVG displacement through backdrop-filter (liquid-glass-web).
//                Composited on the GPU and bends anything behind it.
//  Safari, Firefox, iOS Chrome
//                VideoGlass, which refracts the reel itself. They ignore SVG
//                filters in backdrop-filter, and @supports still says yes,
//                so this is decided by engine, not feature query.
//  No reel yet, no WebGL, slow device
//                .hero__cta's own CSS frost.
//  Reduced transparency
//                A solid pill (handled in _hero.scss).

import { createLiquidGlass } from '../vendor/liquid-glass-web/liquid-glass.js';
import VideoGlass from './VideoGlass.js';

export default class SumiGlass {
  constructor() {
    this.el = document.querySelector('.hero__cta');
    this.video = document.querySelector('.hero__video');
    // The entrance waits on this so the CTA never shows a half-built glass.
    this.ready = Promise.resolve();
    if (!this.el) return;

    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
      this.el.dataset.glass = 'solid';
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

    // Nothing to refract until the reel has sources: keep the frost.
    if (!this.video || !this.video.querySelector('source')) {
      this.el.dataset.glass = 'frost';
      return;
    }
    this.glass = new VideoGlass(this.el, this.video);
    this.ready = this.glass.ready;
    if (!this.glass.ok) this.el.dataset.glass = 'frost';
  }
}
