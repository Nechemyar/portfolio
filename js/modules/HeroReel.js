// ——————————————————————————————————————————————
// HeroReel — the reel card under the hero
// ——————————————————————————————————————————————
// The <video> ships with <source data-src> children and preload="none", so
// nothing downloads during first paint. Sources are attached once the loader
// hands off (hero:ready), the video fades in when it can play, and it pauses
// whenever it is off screen. Reduced-motion and Save-Data visitors keep the
// empty card.

export default class HeroReel {
  constructor() {
    this.video = document.querySelector('.hero__video');
    this.pauseBtn = document.querySelector('.hero__pause');
    if (!this.video) return;

    const sources = this.video.querySelectorAll('source[data-src]');
    if (!sources.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (reduced || saveData) return;

    this.sources = sources;
    this.userPaused = false;
    this.inView = true;

    if (document.documentElement.classList.contains('js-loaded')) {
      this.load();
    } else {
      document.addEventListener('hero:ready', () => this.load(), { once: true });
    }
  }

  load() {
    this.sources.forEach((source) => {
      source.src = source.dataset.src;
    });
    this.video.load();

    this.video.addEventListener('playing', () => {
      this.video.classList.add('is-playing');
    }, { once: true });

    new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting;
      this.sync();
    }).observe(this.video);

    if (this.pauseBtn) {
      this.pauseBtn.hidden = false;
      this.pauseBtn.addEventListener('click', () => {
        this.userPaused = !this.userPaused;
        this.pauseBtn.setAttribute('aria-label', this.userPaused ? 'Play the reel' : 'Pause the reel');
        this.sync();
      });
    }

    this.sync();
  }

  sync() {
    if (this.inView && !this.userPaused) {
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  }
}
