// CaseView — the moving parts of one case study (layout B). Phones play only
// while on screen, and on desktop the pinned phone takes the screen of
// whichever part of the story sits in the middle of the view. Runs on the
// case page itself and inside the homepage's case layer, so it only ever
// looks inside the <main class="case"> it was given.
import gsap from 'gsap';
import { createLiquidGlass } from '../vendor/liquid-glass-web/liquid-glass.js';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default class CaseView {
  constructor(root, scroller = window) {
    this.root = root;
    this.scroller = scroller;
    this.observers = [];
    if (!root) return;
    this.initBack();
    if (!('IntersectionObserver' in window)) return;
    this.initClips();
    this.initPinned();
  }

  // The back pill: glass like the hero CTA, at the top until you scroll,
  // then at the bottom. Its label goes ink over the white sheet.
  initBack() {
    const el = this.root.querySelector('.case__back');
    if (!el) return;
    this.back = el;
    const chromium = navigator.userAgentData?.brands?.some((b) => b.brand === 'Chromium');
    if (chromium && !window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
      try { this.glass = createLiquidGlass(el, { shape: 'pill', refraction: 100, blur: 1, light: 70, pointer: false }); } catch (e) { /* frost stays */ }
    }
    const sections = [...this.root.querySelectorAll('[data-nav-theme]')];
    let atBottom = null;
    let tick = 0;

    const theme = () => {
      const r = el.getBoundingClientRect();
      const y = r.top + r.height / 2;
      let hit = null;
      sections.forEach((s) => {
        const b = s.getBoundingClientRect();
        if (b.top <= y && b.bottom > y) hit = s;
      });
      el.classList.toggle('is-light', hit?.dataset.navTheme === 'light');
    };

    const update = () => {
      tick = 0;
      const y = this.scroller === window ? window.scrollY : this.scroller.scrollTop;
      const bottom = y > 40;
      if (bottom !== atBottom) {
        const first = atBottom === null;
        atBottom = bottom;
        if (first || reduce()) {
          el.classList.toggle('is-bottom', bottom);
        } else {
          // Leave one edge, arrive at the other: no trip across the page.
          gsap.to(el, {
            autoAlpha: 0, y: bottom ? -12 : 12, duration: 0.18, ease: 'power1.in', overwrite: true,
            onComplete: () => {
              el.classList.toggle('is-bottom', bottom);
              theme();
              gsap.fromTo(el, { autoAlpha: 0, y: bottom ? 16 : -16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            },
          });
        }
      }
      theme();
    };
    this.onScroll = () => { if (!tick) tick = requestAnimationFrame(update); };
    this.scroller.addEventListener('scroll', this.onScroll, { passive: true });
    update();
  }

  initClips() {
    if (reduce()) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting) {
          if (video.preload !== 'auto') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '120px 0px' });
    this.root.querySelectorAll('video').forEach((v) => io.observe(v));
    this.observers.push(io);
  }

  initPinned() {
    const pinned = this.root.querySelector('.case__pinned');
    const beats = this.root.querySelectorAll('.case__beat[data-clip]');
    if (!pinned || !beats.length) return;

    let current = beats[0].dataset.clip;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const clip = target.dataset.clip;
        if (clip === current) return;
        current = clip;
        // Fade the screen out, change the clip, fade it back in.
        gsap.to(pinned, {
          opacity: 0,
          duration: reduce() ? 0 : 0.2,
          ease: 'power1.out',
          overwrite: true,
          onComplete: () => {
            pinned.poster = `/work/${clip}.webp`;
            pinned.src = `/work/${clip}.mp4`;
            if (!reduce()) pinned.play().catch(() => {});
            gsap.to(pinned, { opacity: 1, duration: reduce() ? 0 : 0.3, ease: 'power1.out' });
          },
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    beats.forEach((b) => io.observe(b));
    this.observers.push(io);
  }

  destroy() {
    if (this.onScroll) this.scroller.removeEventListener('scroll', this.onScroll);
    this.glass?.destroy?.();
    this.observers.forEach((io) => io.disconnect());
    this.observers = [];
    if (this.root) gsap.killTweensOf(this.root.querySelectorAll('.case__pinned'));
  }
}
