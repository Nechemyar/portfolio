// CaseView — the moving parts of one case study (layout B). Phones play only
// while on screen, and on desktop the pinned phone takes the screen of
// whichever part of the story sits in the middle of the view. Runs on the
// case page itself and inside the homepage's case layer, so it only ever
// looks inside the <main class="case"> it was given.
import gsap from 'gsap';
import PillGlass from './PillGlass.js';

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

  // The back pills, glass like the hero CTA. One opens the hero and scrolls
  // away with it; once it's gone, the dock rises from the bottom edge and
  // stays in thumb reach. Its label goes ink over the white sheet.
  initBack() {
    const top = this.root.querySelector('.case__back--top');
    const dock = this.root.querySelector('.case__back--dock');
    const glassy = !window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    const heroSky = this.root.querySelector('.case__hero > .case__sky');

    if (top && glassy) {
      const g = new PillGlass(top);
      // The pill moves with the sky, so one draw holds until a resize.
      this.drawTop = () => { this.topDrawn = !!heroSky && g.draw(heroSky.getBoundingClientRect()); };
      g.ready?.then(this.drawTop);
      window.addEventListener('resize', this.drawTop);
    }
    if (!dock) return;
    this.dock = dock;
    this.dockGlass = glassy ? new PillGlass(dock) : null;
    this.docked = false;
    const sections = [...this.root.querySelectorAll('[data-nav-theme]')];

    const theme = () => {
      const r = dock.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const hit = sections.find((s) => {
        const b = s.getBoundingClientRect();
        return b.top <= y && b.bottom > y;
      });
      const light = hit?.dataset.navTheme === 'light';
      dock.classList.toggle('is-light', light);
      if (!light && hit && this.dockGlass) {
        const sky = hit.querySelector(':scope > .case__sky') || hit;
        this.dockGlass.draw(sky.getBoundingClientRect());
      }
    };

    let tick = 0;
    const update = () => {
      tick = 0;
      if (this.drawTop && !this.topDrawn) this.drawTop();
      if (this.dockLocked) return;
      // Dock once the hero's pill has gone off the top.
      const want = top ? top.getBoundingClientRect().bottom < 0 : true;
      if (want !== this.docked) {
        if (want) this.showDock(); else this.hideDock();
      }
      if (this.docked) theme();
    };
    this.onScroll = () => { if (!tick) tick = requestAnimationFrame(update); };
    this.scroller.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onScroll);
    this.dockGlass?.ready?.then(this.onScroll);
    update();
  }

  dockOffset() {
    return this.dock.offsetHeight + 40;
  }

  showDock() {
    if (!this.dock) return;
    this.docked = true;
    gsap.fromTo(this.dock,
      { autoAlpha: 1, y: this.dockOffset() },
      { y: 0, duration: reduce() ? 0 : 0.55, ease: 'power3.out', overwrite: true });
  }

  // `lock` keeps it down for good (the case is closing).
  hideDock(lock = false) {
    if (lock) this.dockLocked = true;
    if (!this.dock || !this.docked) return;
    this.docked = false;
    gsap.to(this.dock, {
      y: this.dockOffset(), duration: reduce() ? 0 : 0.3, ease: 'power2.in', overwrite: true,
      onComplete: () => gsap.set(this.dock, { autoAlpha: 0 }),
    });
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
    if (this.onScroll) {
      this.scroller.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
    }
    if (this.drawTop) window.removeEventListener('resize', this.drawTop);
    this.observers.forEach((io) => io.disconnect());
    this.observers = [];
    if (this.root) gsap.killTweensOf(this.root.querySelectorAll('.case__pinned'));
  }
}
