// CaseView — the moving parts of one case study. Phones play only while on
// screen; paragraphs fill in word by word as you read down, shots wipe up
// into place, the collage drifts at two speeds, the statement rises word by
// word and the next case widens to the edges (after Our Revolution's case
// pages). Runs on the case page itself and inside the homepage's case
// layer, so it only ever looks inside the <main class="case"> it was given.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PillGlass from './PillGlass.js';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default class CaseView {
  constructor(root, scroller = window) {
    this.root = root;
    this.scroller = scroller;
    this.observers = [];
    this.motion = [];
    if (!root) return;
    this.initBack();
    this.initMotion();
    if (!('IntersectionObserver' in window)) return;
    this.initClips();
  }

  // ScrollTrigger options against this view's scroller.
  st(vars) {
    return this.scroller === window ? vars : { ...vars, scroller: this.scroller };
  }

  words(el, masked) {
    const list = el.textContent.trim().split(/\s+/);
    el.innerHTML = list.map((w) => (masked ? `<span class="cs__w"><span>${w}</span></span>` : `<span>${w}</span>`)).join(' ');
    return el.querySelectorAll(masked ? '.cs__w > span' : 'span');
  }

  initMotion() {
    if (reduce()) return;
    const r = this.root;
    const add = (tw) => { this.motion.push(tw); return tw; };

    // Read-along: each paragraph starts faint and fills in as it passes.
    r.querySelectorAll('.js-fill').forEach((p) => {
      add(gsap.fromTo(this.words(p, false), { opacity: 0.18 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: this.st({ trigger: p, start: 'top 88%', end: 'bottom 58%', scrub: true }),
      }));
    });

    // Shots wipe up out of their own box, the picture settling inside.
    r.querySelectorAll('.js-wipe').forEach((el) => {
      const img = el.querySelector(':scope > img');
      const tl = gsap.timeline({ scrollTrigger: this.st({ trigger: el, start: 'top 92%', once: true }) });
      tl.fromTo(el, { clipPath: 'inset(22% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' }, 0);
      if (!el.hasAttribute('data-speed')) tl.fromTo(el, { y: 60 }, { y: 0, duration: 1.2, ease: 'expo.out' }, 0);
      if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.4, ease: 'expo.out' }, 0);
      add(tl);
    });

    // Collage: the two shots drift at different speeds.
    r.querySelectorAll('[data-speed]').forEach((el) => {
      const d = (parseFloat(el.dataset.speed) - 1) * 160;
      add(gsap.fromTo(el, { y: d }, {
        y: -d, ease: 'none',
        scrollTrigger: this.st({ trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }),
      }));
    });

    // The statement's words rise in their masks; its dots part.
    r.querySelectorAll('.js-rise').forEach((p) => {
      add(gsap.fromTo(this.words(p, true), { yPercent: 110 }, {
        yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.06,
        scrollTrigger: this.st({ trigger: p, start: 'top 85%', once: true }),
      }));
    });
    r.querySelectorAll('.cs__dots').forEach((d) => {
      add(gsap.fromTo(d, { gap: '1.25rem' }, {
        gap: '8.75rem', ease: 'none',
        scrollTrigger: this.st({ trigger: d, start: 'top 95%', end: 'top 60%', scrub: true }),
      }));
    });

    // Numbers count up once.
    r.querySelectorAll('[data-count]').forEach((el) => {
      const raw = el.dataset.count;
      const m = raw.match(/[\d.,]+/);
      if (!m) return;
      const num = parseFloat(m[0].replace(/,/g, ''));
      const dec = (m[0].split('.')[1] || '').length;
      const o = { v: 0 };
      add(gsap.to(o, {
        v: num, duration: 1.4, ease: 'power3.out',
        scrollTrigger: this.st({ trigger: el, start: 'top 90%', once: true }),
        onUpdate: () => { el.textContent = raw.replace(m[0], o.v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec })); },
      }));
    });

    // The next case widens to the gutters' edges as it comes up.
    const next = r.querySelector('.case__next');
    if (next) {
      this.nextGrow = add(gsap.fromTo(next, { clipPath: 'inset(6% 7% 0% 7%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: this.st({ trigger: next, start: 'top bottom', end: 'top 30%', scrub: true }),
      }));
    }
  }

  // Before the next tile flies: open it out fully and let its words go, so
  // the tile that lifts off is exactly the one on screen.
  prepareNext() {
    const next = this.root?.querySelector('.case__next');
    if (!next) return Promise.resolve();
    this.nextGrow?.scrollTrigger?.kill();
    this.nextGrow?.kill();
    const d = reduce() ? 0 : 0.3;
    return gsap.timeline()
      .to(next, { clipPath: 'inset(0% 0% 0% 0%)', duration: d, ease: 'power2.out' }, 0)
      .to(next.querySelector('.case__next-copy'), { autoAlpha: 0, y: -8, duration: d, ease: 'power2.in' }, 0)
      .then();
  }

  refresh() {
    this.motion.forEach((tw) => tw.scrollTrigger?.refresh());
  }

  // The back pills, glass like the hero CTA. One opens the hero and scrolls
  // away with it; once it's gone, the dock rises from the bottom edge and
  // stays in thumb reach. Its label goes ink over the white sheet.
  initBack() {
    const top = this.root.querySelector('.case__back--top');
    const dock = this.root.querySelector('.case__back--dock');
    const glassy = !window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
    const heroSky = this.root.querySelector('.case__hero > .case__sky');

    const tone = getComputedStyle(this.root);
    const page = tone.getPropertyValue('--tone-page').trim();
    if (page) document.documentElement.style.setProperty('--nav-scrim', page);
    const skyTop = tone.getPropertyValue('--tone-top');
    const skyBot = tone.getPropertyValue('--tone-bot');

    if (top && glassy) {
      const g = new PillGlass(top);
      g.setSky(skyTop, skyBot);
      // The pill moves with the sky, so one draw holds until a resize.
      this.drawTop = () => { this.topDrawn = !!heroSky && g.draw(heroSky.getBoundingClientRect()); };
      g.onPaper = this.drawTop;
      g.ready?.then(this.drawTop);
      window.addEventListener('resize', this.drawTop);
    }
    if (!dock) return;
    this.dock = dock;
    this.dockGlass = glassy ? new PillGlass(dock) : null;
    this.dockGlass?.setSky(skyTop, skyBot);
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

    if (this.dockGlass) this.dockGlass.onPaper = () => { if (this.docked) theme(); };

    let tick = 0;
    const update = () => {
      tick = 0;
      if (this.drawTop && !this.topDrawn) this.drawTop();
      if (this.dockLocked) return;
      // Dock once the hero's pill has gone off the top, and step aside
      // again when the next case comes up: that card is the way on, and
      // the pill would sit over it and the footer.
      const end = this.root.querySelector('.cs__next-wrap');
      const pastTop = top ? top.getBoundingClientRect().bottom < 0 : true;
      const atEnd = end ? end.getBoundingClientRect().top < window.innerHeight * 0.85 : false;
      const want = pastTop && !atEnd;
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

  destroy() {
    if (this.onScroll) {
      this.scroller.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
    }
    if (this.drawTop) window.removeEventListener('resize', this.drawTop);
    document.documentElement.style.removeProperty('--nav-scrim');
    this.observers.forEach((io) => io.disconnect());
    this.observers = [];
    this.motion.forEach((tw) => { tw.scrollTrigger?.kill(); tw.kill(); });
    this.motion = [];
  }
}
