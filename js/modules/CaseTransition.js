// CaseTransition — tapping a work phone opens its case study without ever
// leaving the screen. The sky tile lifts out of the page and grows to fill
// the viewport while its phone keeps playing in the middle; the case page
// (fetched the moment a finger lands on the tile) is swapped in underneath,
// the phone settles into the hero and the title rises in on top. Back plays
// it in reverse into the same tile. Likely Story does the same with Barba;
// this is the small version of that idea.
//
// Two modes:
//  - 'home': the case is mounted in a fixed layer over the homepage, so the
//    homepage (its sky, its scroll position) stays alive underneath.
//  - 'page': on a case page itself, the next-project tile grows to fill the
//    screen and the browser then loads the next page, which picks up the
//    move (title in, phone settles) from sessionStorage.
// Without JavaScript every tile is still a plain link.
import gsap from 'gsap';
import CaseView from './CaseView.js';

const ARRIVE_KEY = 'sumi:case-arrive';
const EASE = 'power3.inOut';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rect = (el) => el.getBoundingClientRect();
const keyFromPath = (path) => {
  const m = path.match(/projects\/([a-z-]+)\.html/);
  return m ? m[1] : null;
};

export default class CaseTransition {
  constructor({ mode = 'home', smoothScroll = null, nav = document.getElementById('nav') } = {}) {
    this.mode = mode;
    this.smooth = smoothScroll;
    this.nav = nav;
    this.cache = new Map();
    this.busy = false;
    this.layer = null;
    this.view = null;
    this.current = null; // path key of the open case (home mode)

    if (mode === 'home') this.initHome();
    else this.initPage();
  }

  // ── Shared pieces ──────────────────────────────────────────

  load(url) {
    const href = new URL(url, location.href).href;
    if (!this.cache.has(href)) {
      const p = fetch(href, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
        .then((text) => new DOMParser().parseFromString(text, 'text/html'))
        .catch((err) => { this.cache.delete(href); throw err; });
      this.cache.set(href, p);
    }
    return this.cache.get(href);
  }

  prefetchOn(root, selector) {
    const warm = (e) => {
      const a = e.target.closest?.(selector);
      if (a) this.load(a.href).catch(() => {});
    };
    root.addEventListener('pointerover', warm, { passive: true });
    root.addEventListener('touchstart', warm, { passive: true });
    root.addEventListener('focusin', warm);
  }

  setVh() {
    document.documentElement.style.setProperty('--case-vh', `${window.innerHeight}px`);
  }

  // The hero phone's box comes from CSS (.case__slot), so measure a probe.
  slotSize() {
    const probe = document.createElement('div');
    probe.className = 'case__slot';
    probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0;margin:0';
    document.body.appendChild(probe);
    const { width, height } = rect(probe);
    probe.remove();
    return { w: width, h: height };
  }

  // Take a tile out of the page into a fixed box over the same spot, leaving
  // a gap the same size so nothing reflows.
  lift(stage, z) {
    const r = rect(stage);
    const gap = document.createElement('div');
    gap.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none`;
    stage.parentNode.insertBefore(gap, stage);
    stage._gap = gap;
    document.body.appendChild(stage);
    stage.classList.add('case-fly');
    gsap.set(stage, { left: r.left, top: r.top, width: r.width, height: r.height, zIndex: z });
    return r;
  }

  land(stage) {
    if (stage._gap) {
      stage._gap.parentNode.replaceChild(stage, stage._gap);
      stage._gap = null;
    }
    stage.classList.remove('case-fly');
    gsap.set(stage, { clearProps: 'all' });
  }

  pin(phone, r, box) {
    gsap.set(phone, {
      position: 'absolute', margin: 0, xPercent: 0, yPercent: 0, x: 0, y: 0,
      left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height,
    });
  }

  play(phone) {
    const v = phone?.querySelector('video');
    if (v && !reduce()) { v.preload = 'auto'; v.play().catch(() => {}); }
  }

  setNav(theme, clear) {
    if (!this.nav) return;
    this.nav.classList.remove('theme-dark', 'theme-light');
    this.nav.classList.add(`theme-${theme}`);
    this.nav.classList.toggle('nav--clear', !!clear);
  }

  // Phase one: the tile grows to the viewport, the phone stays centred and
  // grows to its hero size.
  grow(stage, phone) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const { w, h } = this.slotSize();
    const tl = gsap.timeline();
    tl.to(stage, { left: 0, top: 0, width: W, height: H, duration: 0.9, ease: EASE }, 0)
      .to(phone, { left: (W - w) / 2, top: (H - h) / 2, width: w, height: h, duration: 0.9, ease: EASE }, 0);
    if (reduce()) tl.timeScale(30);
    return tl;
  }

  // Phase two: the phone eases down into the hero and the title rises in.
  arrive(main, phone, fromY) {
    const words = main.querySelectorAll('.case__ln > span');
    const bits = main.querySelectorAll('.case__back, .case__lead');
    const tl = gsap.timeline();
    tl.fromTo(phone, { y: fromY }, { y: 0, duration: 0.85, ease: EASE }, 0)
      .fromTo(words, { yPercent: 110, y: 0 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 }, 0.32)
      .fromTo(bits, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06 }, 0.45);
    if (reduce()) tl.timeScale(30);
    return tl;
  }

  // ── Home: cases open in a layer over the homepage ──────────

  initHome() {
    this.cards = document.querySelector('.work__cards');
    if (!this.cards) return;
    this.homeTitle = document.title;

    this.prefetchOn(this.cards, 'a[data-case-link]');
    this.cards.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-case-link]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (this.busy) return;
      const href = a.href; // resolve before the URL changes
      history.scrollRestoration = 'manual';
      history.pushState({ sumiCase: true }, '', href);
      this.openHome(a.querySelector('.work__stage'), href, false);
    });

    window.addEventListener('popstate', () => {
      const key = keyFromPath(location.pathname);
      if (this.current && !key) this.closeHome();
      else if (key && !this.current) {
        const a = this.cards.querySelector(`a[href$="${key}.html"]`);
        if (a) this.openHome(a.querySelector('.work__stage'), a.href, false);
      }
    });

    // Warm the case pages once the work section is close.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const go = () => this.cards.querySelectorAll('a[data-case-link]').forEach((a) => this.load(a.href).catch(() => {}));
        ('requestIdleCallback' in window) ? requestIdleCallback(go) : setTimeout(go, 400);
      }, { rootMargin: '600px 0px' });
      io.observe(this.cards);
    }
  }

  cardStage(key) {
    return this.cards.querySelector(`a[href$="${key}.html"] .work__stage`);
  }

  async openHome(stage, href, fromLayer) {
    if (this.busy || !stage) return;
    this.busy = true;
    this.setVh();
    const docP = this.load(href);
    const phone = stage.querySelector('.work__phone');
    this.play(phone);
    if (!fromLayer) this.smooth?.stop();

    const pr = rect(phone);
    const r = this.lift(stage, fromLayer ? 1101 : 1099);
    this.pin(phone, pr, r);
    const H = window.innerHeight;
    const { h } = this.slotSize();

    let doc;
    try {
      [, doc] = await Promise.all([this.grow(stage, phone).then(), docP]);
    } catch (err) {
      location.href = href; // fall back to a normal page load
      return;
    }
    const src = doc.querySelector('main.case');
    if (!src) { location.href = href; return; }

    // The tile now covers the screen: swap the case in underneath it.
    if (!this.layer) {
      this.layer = document.createElement('div');
      this.layer.className = 'case-layer';
      this.layer.addEventListener('click', (e) => this.onLayerClick(e));
      this.layer.addEventListener('scroll', () => this.onLayerScroll(), { passive: true });
      this.prefetchOn(this.layer, 'a[data-case-link]');
      document.body.appendChild(this.layer);
    }
    this.unmountCase();

    const main = document.importNode(src, true);
    const slot = main.querySelector('.case__slot');
    slot.replaceChildren();
    main.classList.add('is-arriving');
    main.querySelector('.case__hero').classList.add('is-clear');
    this.layer.style.visibility = '';
    this.layer.appendChild(main);
    this.layer.scrollTop = 0;
    document.title = doc.title;
    gsap.set(stage, { zIndex: 1099 });
    this.setNav('dark', true);

    slot.appendChild(phone);
    gsap.set(phone, { clearProps: 'all' });
    const fromY = (H - h) / 2 - rect(slot).top;
    const key = keyFromPath(new URL(href).pathname);

    this.arrive(main, phone, fromY).then(() => {
      main.querySelector('.case__hero').classList.remove('is-clear');
      main.classList.remove('is-arriving');
      if (stage.closest('.work__card') || stage._gap?.closest('.work__card')) this.land(stage);
      else stage.remove();
      gsap.set(phone, { clearProps: 'all' });
      gsap.set(main.querySelectorAll('.case__ln > span, .case__back, .case__lead'), { clearProps: 'all' });
      this.view = new CaseView(main);
      this.current = key;
      this.busy = false;
    });
  }

  // Leave the layer empty; the outgoing hero phone goes home to its card.
  unmountCase() {
    const old = this.layer?.querySelector('main.case');
    if (!old) return;
    this.view?.destroy();
    this.view = null;
    const oldPhone = old.querySelector('.case__slot > .work__phone');
    const home = this.current && this.cardStage(this.current);
    if (oldPhone && home && !home.querySelector('.work__phone')) {
      gsap.set(oldPhone, { clearProps: 'all' });
      home.appendChild(oldPhone);
    }
    old.remove();
  }

  onLayerClick(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const next = e.target.closest('a[data-case-link]');
    if (next) {
      e.preventDefault();
      if (this.busy) return;
      const href = next.href;
      history.replaceState(history.state, '', href);
      this.openHome(next.querySelector('.case__tile'), href, true);
      return;
    }
    if (e.target.closest('.case__back')) {
      e.preventDefault();
      if (this.busy) return;
      if (history.state?.sumiCase) history.back();
      else {
        history.replaceState(null, '', new URL('../index.html#work', location.href).href);
        this.closeHome();
      }
    }
  }

  // The nav takes the theme of whatever sits under it in the layer.
  onLayerScroll() {
    if (this.busy || this.scrollTick) return;
    this.scrollTick = requestAnimationFrame(() => {
      this.scrollTick = null;
      const main = this.layer?.querySelector('main.case');
      if (!main) return;
      let hit = null;
      main.querySelectorAll('[data-nav-theme]').forEach((s) => {
        const r = rect(s);
        if (r.top <= 80 && r.bottom > 80) hit = s;
      });
      if (hit) this.setNav(hit.dataset.navTheme, hit.classList.contains('case__hero'));
    });
  }

  async closeHome() {
    if (this.busy || !this.current || !this.layer) return;
    this.busy = true;
    const key = this.current;
    const main = this.layer.querySelector('main.case');
    const slot = main.querySelector('.case__slot');
    const phone = slot.querySelector('.work__phone');
    const target = this.cardStage(key);

    // Back to the top of the case first, so the hero is where it started.
    if (this.layer.scrollTop > 0) {
      const s = { y: this.layer.scrollTop };
      await gsap.to(s, {
        y: 0, duration: Math.min(0.7, 0.25 + s.y / 4000), ease: 'power2.inOut',
        onUpdate: () => { this.layer.scrollTop = s.y; },
      });
    }

    this.setVh();
    const W = window.innerWidth;
    const H = window.innerHeight;
    const sr = rect(slot);
    this.view?.destroy();
    this.view = null;
    this.setNav('dark', true);

    // If this case was reached through "Next", bring its card into view.
    const tr0 = rect(target);
    if (tr0.bottom < 0 || tr0.top > H) {
      const y = window.scrollY + tr0.top - (H - tr0.height) / 2;
      if (this.smooth?.lenis) this.smooth.lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }

    const spare = target.querySelector('.work__phone');
    const tr = this.lift(target, 1099);
    gsap.set(target, { left: 0, top: 0, width: W, height: H });
    if (spare) spare.remove();
    target.appendChild(phone);
    this.pin(phone, sr, { left: 0, top: 0 });
    main.querySelector('.case__hero').classList.add('is-clear');
    main.classList.add('is-arriving');

    const th = tr.height * 0.84;
    const tw = th * 703 / 1411;
    const tl = gsap.timeline();
    tl.to(main.querySelectorAll('.case__ln > span'), { yPercent: 110, duration: 0.45, ease: 'power3.in', stagger: 0.04 }, 0)
      .to(main.querySelectorAll('.case__back, .case__lead'), { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' }, 0)
      .to(phone, { top: (H - sr.height) / 2, duration: 0.6, ease: EASE }, 0.1)
      .add(() => {
        this.layer.style.visibility = 'hidden';
        this.setNav('light', false);
      }, 0.55)
      .to(target, { left: tr.left, top: tr.top, width: tr.width, height: tr.height, duration: 0.85, ease: EASE }, 0.55)
      .to(phone, { left: (tr.width - tw) / 2, top: (tr.height - th) / 2, width: tw, height: th, duration: 0.85, ease: EASE }, 0.55);
    if (reduce()) tl.timeScale(30);
    await tl;

    main.remove();
    this.layer.remove();
    this.layer = null;
    this.land(target);
    gsap.set(phone, { clearProps: 'all' });
    document.title = this.homeTitle;
    this.smooth?.start();
    this.current = null;
    this.busy = false;
  }

  // ── Case page: the next tile flies, then the next page loads ─

  initPage() {
    this.main = document.querySelector('main.case');
    if (!this.main) return;
    this.view = new CaseView(this.main);

    const key = this.main.dataset.case;
    if (sessionStorage.getItem(ARRIVE_KEY) === key) {
      sessionStorage.removeItem(ARRIVE_KEY);
      this.arriveOnLoad();
    }
    document.documentElement.classList.remove('case-arriving');

    this.prefetchOn(this.main, 'a[data-case-link]');
    this.main.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-case-link]');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (this.busy) return;
      this.flyToNext(a);
    });

    // Coming back to this page from the browser's cache: put the tile back.
    window.addEventListener('pageshow', (e) => {
      if (!e.persisted || !this.flying) return;
      const { stage, phone } = this.flying;
      this.land(stage);
      gsap.set(phone, { clearProps: 'all' });
      this.flying = null;
      this.busy = false;
      this.smooth?.start();
    });
  }

  arriveOnLoad() {
    this.setVh();
    const slot = this.main.querySelector('.case__slot');
    const phone = slot?.querySelector('.work__phone');
    if (!phone) return;
    const H = window.innerHeight;
    const fromY = (H - rect(slot).height) / 2 - rect(slot).top;
    this.arrive(this.main, phone, fromY).then(() => {
      gsap.set(this.main.querySelectorAll('.case__ln > span, .case__back, .case__lead'), { clearProps: 'all' });
      gsap.set(phone, { clearProps: 'all' });
    });
  }

  async flyToNext(a) {
    this.busy = true;
    this.setVh();
    this.smooth?.stop();
    const stage = a.querySelector('.case__tile');
    const phone = stage.querySelector('.work__phone');
    this.play(phone);
    const pr = rect(phone);
    const r = this.lift(stage, 1099);
    this.pin(phone, pr, r);
    this.flying = { stage, phone };
    this.setNav('dark', true);
    await Promise.all([this.grow(stage, phone).then(), this.load(a.href).catch(() => {})]);
    sessionStorage.setItem(ARRIVE_KEY, a.dataset.caseLink);
    location.assign(a.href);
  }
}
