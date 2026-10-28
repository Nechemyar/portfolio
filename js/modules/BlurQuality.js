/*
  BlurQuality — keeps the nav's progressive blur from dragging scroll down
  on slower machines.

  The four-layer backdrop blur looks best but every layer is a separate
  filter pass over whatever is behind the bar, repainted on every scroll
  frame. Fast GPUs don't notice; weaker laptops drop to ~20fps. So we watch
  real frame times while things move under the bar, and if they're
  consistently slow we step the blur down from four layers to two. There's
  no one-layer tier: a single masked blur shows content doubling through the
  fade and reads as cheap.
  The choice is kept for the rest of the visit so later pages start on the
  right tier.
*/
const TIERS = ['', 'nav__blur--lite'];
const STORE_KEY = 'sumi:blur-tier';
const WINDOW = 40;          // moving frames per verdict
const SLOW_MS = 19;         // mean frame time that counts as struggling (<~52fps)
const MAX_WINDOWS = 6;      // stop measuring after this many verdicts

export default class BlurQuality {
  constructor() {
    this.el = document.querySelector('.nav__blur');
    if (!this.el) return;

    this.tier = 0;
    try {
      this.tier = Math.min(TIERS.length - 1, +sessionStorage.getItem(STORE_KEY) || 0);
    } catch (e) { /* storage blocked: start on the full blur */ }
    this.apply();

    if (this.tier === TIERS.length - 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.samples = [];
    this.windows = 0;
    this.activeUntil = 0;
    this.lastFrame = 0;

    // Frames count while the page scrolls, and through the hero entrance,
    // where the wipes animate right under the bar.
    this.onScroll = () => { this.activeUntil = Math.max(this.activeUntil, performance.now() + 120); };
    this.onHero = () => { this.activeUntil = performance.now() + 2000; };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('hero:ready', this.onHero, { once: true });
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  loop(now) {
    const dt = now - this.lastFrame;
    this.lastFrame = now;

    // Only frames where content is moving under the bar tell us anything.
    // Huge gaps are tab switches or GC pauses, not steady-state cost.
    if (now < this.activeUntil && dt > 0 && dt < 200 && !document.hidden) {
      this.samples.push(dt);
    }

    if (this.samples.length >= WINDOW) {
      const mean = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
      this.samples = [];
      this.windows++;

      // One smooth window isn't proof: the entrance can be light while real
      // scrolling over images is heavy, so keep sampling a few windows.
      if (mean > SLOW_MS) {
        this.tier++;
        this.apply();
        try { sessionStorage.setItem(STORE_KEY, String(this.tier)); } catch (e) {}
      }

      if (this.tier === TIERS.length - 1 || this.windows >= MAX_WINDOWS) return this.stop();
    }

    requestAnimationFrame(this.loop);
  }

  apply() {
    TIERS.forEach((cls) => cls && this.el.classList.remove(cls));
    if (TIERS[this.tier]) this.el.classList.add(TIERS[this.tier]);
  }

  stop() {
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('hero:ready', this.onHero);
  }
}
