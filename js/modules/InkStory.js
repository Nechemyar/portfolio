// ——————————————————————————————————————————————
// InkStory — the intro told as one scroll
// ——————————————————————————————————————————————
// .intro is three sections over the sticky InkSky canvas: the hero (100svh),
// the reel (270svh, its scroll held by CSS sticky) and the trust line
// (100svh). One scrubbed timeline spans the intro, measured in svh so every
// beat lands on its section at any screen size:
//   0–125    the clouds part to let the scroll through
//   105–210  the scroll unrolls the reel (down on phones, outward on desktop)
//   270–370  the clouds close back in and the sun sets behind the bank,
//            arriving as the trust line reaches the middle
// The sky moves by tweening InkSky.state (drawn in WebGL, no DOM paint); the
// scroll moves by transforms on phones and a clip on desktop.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class InkStory {
  constructor(sky) {
    this.sky = sky;
    this.intro = document.querySelector('.intro');
    this.scroll = document.querySelector('.reel__scroll');
    if (!this.intro || !this.scroll) return;

    this.sheet = this.scroll.querySelector('.reel__sheet');
    this.paper = this.scroll.querySelector('.reel__paper');
    this.picture = this.scroll.querySelector('.reel__picture');

    // torn washi edges, redrawn whenever the scroll changes size
    let last = '';
    new ResizeObserver(() => {
      const size = `${this.paper.offsetWidth}x${this.paper.offsetHeight}`;
      if (size === last) return;
      last = size;
      this.deckle(this.paper, 2.2, 0.5, 11);
      this.deckle(this.picture, 3.6, 1.4, 23);
    }).observe(this.paper);

    this.build();
  }

  build() {
    const s = this.sky.state;
    const vw = () => this.sky.vw || window.innerWidth;
    const vh = () => this.sky.vh || window.innerHeight;
    const mm = gsap.matchMedia();

    mm.add({
      phone: '(max-width: 759px)',
      wide: '(min-width: 760px)',
      reduce: '(prefers-reduced-motion: reduce)'
    }, (ctx) => {
      const { phone, reduce } = ctx.conditions;
      if (reduce) return; // the scroll shows open and the sky holds still

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: this.intro, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }
      });
      tl.set({}, {}, 370);

      // 1. the clouds part
      tl.to(s.corner, { x: () => vw() * 0.32, y: () => -vh() * 0.3, duration: 125 }, 0)
        .to(s.bank, { y: () => vh() * 0.38, duration: 125 }, 0)
        .to(s.wisp, { x: () => -vw() * 0.7, duration: 125 }, 0)
        .to(s.puff, { x: () => vw() * 0.6, duration: 125 }, 0)
        .to(s.sun, { x: () => -vw() * 0.14, duration: 125 }, 0);

      // 2. the scroll unrolls. Phone: a curtain made of two opposite
      //    translates (transform only). Desktop: a clip from the middle out.
      const ease = 'power1.inOut';
      if (phone) {
        tl.fromTo(this.sheet, { yPercent: -100 }, { yPercent: 0, duration: 105, ease }, 105)
          .fromTo(this.paper, { yPercent: 100 }, { yPercent: 0, duration: 105, ease }, 105)
          .fromTo('.reel__rod--bottom', { y: () => -this.sheet.offsetHeight }, { y: 0, duration: 105, ease }, 105);
      } else {
        tl.fromTo(this.sheet, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 105, ease }, 105)
          .fromTo('.reel__rod--left', { x: () => this.sheet.offsetWidth / 2 }, { x: 0, duration: 105, ease }, 105)
          .fromTo('.reel__rod--right', { x: () => -this.sheet.offsetWidth / 2 }, { x: 0, duration: 105, ease }, 105);
      }

      // 3. the clouds close in and the sun sets behind the bank
      tl.to(s.bank, { y: () => -vh() * 0.04, duration: 100 }, 270)
        .to(s.wisp, { x: () => -vw() * 0.04, y: () => vh() * (phone ? 0.36 : 0.24), duration: 100 }, 270)
        .to(s.puff, { x: 0, y: () => vh() * 0.08, duration: 100 }, 270)
        .to(s.corner, { x: () => vw() * 0.14, y: () => -vh() * 0.1, duration: 100 }, 270)
        .to(s.sun, { x: 0, y: () => vh() * 0.6, s: 1.12, duration: 100 }, 270);
    });
  }

  // Printed one block at a time: sun, far clouds, near clouds.
  printIn() {
    const s = this.sky.state;
    const layers = [s.sun, s.wisp, s.puff, s.corner, s.bank];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(layers, { a: 1 });
      return;
    }
    gsap.to(layers, { a: 1, duration: 1.1, ease: 'power2.out', stagger: 0.14 });
  }

  // A torn-paper edge: the element's outline, wobbled by a few slow waves and
  // a little fine tooth, then softened, applied as a mask.
  deckle(el, amp, soft, seed) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    let r = seed;
    const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
    const waves = Array.from({ length: 4 }, (_, i) => [rand() * 6.28, 0.008 + i * 0.019 + rand() * 0.01, amp / (i + 1.2)]);
    const wob = (t) => waves.reduce((v, [ph, f, a]) => v + Math.sin(t * f + ph) * a, 0) + (rand() - 0.5) * amp * 0.5;
    const pad = amp * 2;
    const pts = [];
    const edge = (x0, y0, x1, y1, nx, ny, offset) => {
      const len = Math.hypot(x1 - x0, y1 - y0);
      const n = Math.max(2, Math.round(len / 5));
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const d = wob(offset + t * len) - amp;
        pts.push(`${(x0 + (x1 - x0) * t + nx * d).toFixed(1)},${(y0 + (y1 - y0) * t + ny * d).toFixed(1)}`);
      }
    };
    edge(pad, pad, w - pad, pad, 0, -1, 0);
    edge(w - pad, pad, w - pad, h - pad, 1, 0, w);
    edge(w - pad, h - pad, pad, h - pad, 0, 1, w + h);
    edge(pad, h - pad, pad, pad, -1, 0, w * 2 + h);
    // the polygon sits `pad` inside the box; scale it back out to the edges
    const sx = w / (w - pad * 2);
    const sy = h / (h - pad * 2);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>`
      + `<filter id='s'><feGaussianBlur stdDeviation='${soft}'/></filter>`
      + `<polygon filter='url(#s)' fill='#fff' transform='translate(${-pad * (sx - 1)} ${-pad * (sy - 1)}) scale(${sx} ${sy})' points='${pts.join(' ')}'/></svg>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    el.style.webkitMaskImage = url;
    el.style.maskImage = url;
  }
}
