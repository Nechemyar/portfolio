// ——————————————————————————————————————————————
// flow.js — the whole-page draft after Work (flow.html)
// ——————————————————————————————————————————————
// The hero's sun sets under the trust line. Here it carries on: one printed
// sun (.fsun) travels down the rest of the page, from one resting place
// (.sun-at) to the next, scrubbed by scroll:
//   behind the Work sheet → a halo behind each quote → the start of the
//   price rules, rolling to their end → along the month line → into the sea
//   in the about sentence → the full stop of "Questions" → up over the
//   clouds at the close.
// Each resting place is measured live, so pinned sections need no special
// case. The sky behind turns from day to evening as it goes.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const look = ['sky', 'washi', 'indigo'].find((l) => html.classList.contains(`look-${l}`)) || 'sky';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The logo must stay readable with no band behind it.
if (look === 'washi') $$('.fq, .fp, .fr, .fa, .ff').forEach((s) => { s.dataset.navTheme = 'light'; });

const FAQ = [
  ['How long does it take?', 'Most sites are live in 2 to 4 weeks. Bigger ones with a lot of pages or integrations take 4 to 6. You get the timeline in the plan before anything starts.'],
  ['Why not WordPress or a template?', 'A template looks like the thousands of other sites using it, so you blend in when someone has five tabs open. WordPress can work, but for a small business site it brings plugins, updates and security chores you don’t need.'],
  ['What about hosting?', 'It’s free or a few pounds a month. I set it up under your account, so you own it.'],
  ['Can I edit the text myself?', 'Yes, on the bigger website. You can change words, swap photos and add posts without touching code.'],
  ['Do I own the code?', 'All of it. It goes to your GitHub when we finish. Take it to any developer you like.'],
  ['What if I need changes later?', 'The bigger website includes a month of changes. After that it’s by the hour, and you’ll know the rate before I start.'],
];

function words(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

const pins = {};

/* ---------- testimonials: read along ---------- */
(() => {
  const s = $('.fq');
  const items = $$('.fq__item', s);
  const sets = items.map((it) => ({ it, w: words($('.fq__quote', it)), who: $('.fq__who', it) }));
  if (reduce) { gsap.set(sets.map((x) => x.w).flat(), { opacity: 1 }); gsap.set(items[1], { display: 'none' }); return; }
  gsap.set(items[1], { autoAlpha: 0 });
  gsap.set(sets.map((x) => x.who), { autoAlpha: 0, y: 16 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: s, pin: true, start: 'top top', end: '+=220%', scrub: 0.6 } });
  pins.q = tl.scrollTrigger;
  sets.forEach(({ it, w, who }, i) => {
    if (i) tl.set($('.fq__n', s), { textContent: i + 1 }).set(it, { autoAlpha: 1 });
    tl.to(w, { opacity: 1, stagger: 0.1, ease: 'none', duration: 0.3 })
      .to(who, { autoAlpha: 1, y: 0, duration: 0.6 })
      .to({}, { duration: 0.7 });
    if (i < sets.length - 1) tl.to(it, { autoAlpha: 0, y: -30, duration: 0.6 });
  });
})();

/* ---------- pricing: numbers roll into place, rules draw ---------- */
(() => {
  $$('.fp__price[data-price]').forEach((el) => {
    el.setAttribute('aria-label', el.dataset.price);
    el.innerHTML = [...el.dataset.price].map((ch) => /\d/.test(ch)
      ? `<span class="col" data-d="${ch}" aria-hidden="true">${'0123456789'.split('').map((n) => `<span>${n}</span>`).join('')}</span>`
      : `<span class="st" aria-hidden="true">${ch}</span>`).join('');
  });
  if (reduce) { $$('.fp__price .col').forEach((c) => gsap.set(c, { yPercent: -10 * c.dataset.d })); return; }
  // the rules draw as the sun rolls along them, scrubbed with it
  gsap.fromTo('.fp__rule', { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: '.fp__rows', start: 'top 72%', end: 'bottom 62%', scrub: 0.6 } });
  $$('.fp__row').forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } });
    tl.from($$('.fp__top > *, .fp__what', row), { y: 18, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.1);
    const cols = $$('.col', row);
    cols.forEach((c, i) => tl.fromTo(c, { yPercent: 0 }, { yPercent: -10 * c.dataset.d, duration: 1.4 + i * 0.12, ease: 'expo.out' }, 0.15));
    if (!cols.length) tl.from($('.fp__price', row), { yPercent: 100, duration: 1, ease: 'expo.out' }, 0.15);
  });
  gsap.from('.fp .ftitle, .fp .flead', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.fp .ftitle', start: 'top 85%' } });
  gsap.fromTo('.fcloud--p', { xPercent: 20 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.fp', start: 'top bottom', end: 'bottom top', scrub: true } });
})();

/* ---------- process: the month slides along the line ---------- */
(() => {
  const s = $('.fr'), track = $('.fr__track', s), fill = $('.fr__fill', s);
  if (reduce) return;
  const dist = () => Math.max(0, track.scrollWidth - innerWidth + 40);
  const tl = gsap.timeline({ scrollTrigger: { trigger: s, pin: true, start: 'top top', end: () => '+=' + (dist() * 1.3 + innerHeight * 0.4), scrub: 0.6, invalidateOnRefresh: true } });
  pins.r = tl.scrollTrigger;
  tl.to(track, { x: () => -dist(), ease: 'none', duration: 1 })
    .to(fill, { scaleX: 1, ease: 'none', duration: 1 }, 0)
    .to({}, { duration: 0.15 });
  gsap.from('.fr__title', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 70%' } });
})();

/* ---------- about: the sentence fills in, pictures open inside it ---------- */
(() => {
  const s = $('.fa'), p = $('.fa__line', s);
  [...p.childNodes].forEach((n) => {
    if (n.nodeType !== 3) return;
    const f = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach((t) => {
      if (!t) return;
      if (/^\s+$/.test(t)) { f.append(t); return; }
      const sp = document.createElement('span'); sp.className = 'w'; sp.textContent = t; f.append(sp);
    });
    n.replaceWith(f);
  });
  if (reduce) { gsap.set($$('.w', p), { opacity: 1 }); gsap.set($$('.fa__pill', p), { width: '2.3em' }); return; }
  const tl = gsap.timeline({ scrollTrigger: { trigger: s, pin: true, start: 'top top', end: '+=170%', scrub: 0.5 } });
  pins.a = tl.scrollTrigger;
  [...p.children].forEach((el) => {
    if (el.classList.contains('w')) tl.to(el, { opacity: 1, duration: 0.12, ease: 'none' });
    else { if (el.classList.contains('fa__pill--sea')) tl.addLabel('sea'); tl.to(el, { width: '2.3em', duration: 0.5, ease: 'power3.out' }); }
  });
  tl.to({}, { duration: 0.6 });
  pins.aSea = () => tl.labels.sea / tl.duration();
})();

/* ---------- faq: big list ---------- */
(() => {
  const box = $('.ff__list');
  box.innerHTML = FAQ.map(([q, a], i) => `<div class="ff__item"><span class="ff__rule"></span><button class="ff__q" aria-expanded="false" aria-controls="ffa${i}"><b>${q}</b><span class="ff__plus" aria-hidden="true"></span></button><div class="ff__a" id="ffa${i}" role="region"><p>${a}</p></div></div>`).join('');
  $$('.ff__item', box).forEach((it) => {
    if (!reduce) gsap.timeline({ scrollTrigger: { trigger: it, start: 'top 90%' } })
      .fromTo($('.ff__rule', it), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut' })
      .from($('.ff__q', it), { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.2);
    const q = $('.ff__q', it), a = $('.ff__a', it), plus = $('.ff__plus', it);
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      q.setAttribute('aria-expanded', String(!open));
      gsap.to(a, { height: open ? 0 : 'auto', duration: 0.6, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
      gsap.to(plus, { rotation: open ? 0 : 135, duration: 0.5, ease: 'expo.out' });
      if (!open) gsap.from($('p', a), { y: 12, opacity: 0, duration: 0.6, ease: 'expo.out' });
    });
  });
  if (!reduce) gsap.from('.ff .ftitle', { y: 30, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.ff .ftitle', start: 'top 85%' } });
})();

/* ---------- close: the clouds part, the chips pop in ---------- */
(() => {
  if (reduce) return;
  const s = $('.fc');
  gsap.timeline({ scrollTrigger: { trigger: s, start: 'top bottom', end: 'top top', scrub: 0.6 } })
    .fromTo('.fcloud--c1', { xPercent: -30 }, { xPercent: 0, ease: 'none' }, 0)
    .fromTo('.fcloud--c2', { xPercent: 30 }, { xPercent: 0, ease: 'none' }, 0)
    .from('.fc__title', { y: 50, opacity: 0, ease: 'power2.out' }, 0.4);
  gsap.from('.fc__chips li', { scale: 0.5, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.fc__chips', start: 'top 92%' } });
  gsap.from('.fc__cta', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.fc__cta', start: 'top 96%' } });
})();

/* ---------- the day: sky colour after Work ---------- */
(() => {
  const sky = $('.fsky');
  const days = {
    sky: [['#4a86c3', '#9ec6e4'], ['#3f79b8', '#b9d3e6'], ['#3a6aa3', '#e2c9b0']],
    washi: [['#4a86c3', '#9ec6e4'], ['#4a86c3', '#9ec6e4'], ['#3f74b0', '#b9d3e6']],
    indigo: [['#1e518d', '#4a86c3'], ['#0f2d4d', '#1e518d'], ['#0f2d4d', '#1e518d']],
  }[look];
  const home = ['#4a86c3', '#9ec6e4']; // the hero's sky, for the close
  gsap.set(sky, { '--f-sky-top': days[0][0], '--f-sky-bot': days[0][1] });
  gsap.timeline({ scrollTrigger: { trigger: '.fq', start: 'top bottom', endTrigger: '.ff', end: 'bottom bottom', scrub: true } })
    .to(sky, { '--f-sky-top': days[1][0], '--f-sky-bot': days[1][1], ease: 'none' })
    .to(sky, { '--f-sky-top': days[2][0], '--f-sky-bot': days[2][1], ease: 'none' });
  // back to the sky: the hero's blue returns as the close comes up
  gsap.fromTo(sky, { '--f-sky-top': days[2][0], '--f-sky-bot': days[2][1] }, { '--f-sky-top': home[0], '--f-sky-bot': home[1], ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.fc', start: 'top bottom', end: 'top 20%', scrub: true } });
})();

/* ---------- the sun ---------- */
(() => {
  const sun = $('.fsun');
  const at = (k) => $(`[data-sun="${k}"]`);
  // a plain marker per resting place, made once; its start is the moment
  const plain = (k, start = 'center center') => {
    const el = at(k);
    const st = el && ScrollTrigger.create({ trigger: el, start });
    return () => (st ? st.start : 0);
  };
  // where each resting place is reached, in px of scroll
  const STOPS = [
    { k: 'work', s: plain('work', 'bottom bottom') },
    { k: 'q1', s: () => pins.q ? pins.q.start : plain('q1')() },
    { k: 'q2', s: () => pins.q ? pins.q.end - innerHeight * 0.2 : plain('q2')() },
    { k: 'p1', s: plain('p1', 'center 72%') },
    { k: 'p2', s: plain('p2', 'center 62%') },
    { k: 'r1', s: () => pins.r ? pins.r.start : plain('r1')() },
    { k: 'r2', s: () => pins.r ? pins.r.end - innerHeight * 0.1 : plain('r2')() },
    { k: 'a1', s: () => pins.a ? pins.a.start + (pins.a.end - pins.a.start) * (pins.aSea() + 0.06) : plain('a1')() },
    { k: 'a1', s: () => pins.a ? pins.a.end - innerHeight * 0.1 : plain('a1')() + 1 },
    { k: 'f1', s: plain('f1', 'center 45%') },
    { k: 'c1', s: plain('c1', 'center 50%') },
  ].map((o) => ({ ...o, el: at(o.k) })).filter((o) => o.el);

  // small suns sit on top of lines and in the sea; big ones glow behind the words
  const FRONT = new Set(['p1', 'p2', 'r1', 'r2', 'a1', 'f1']);
  let pos = [];
  const measure = () => { pos = STOPS.map((o) => o.s()); };
  ScrollTrigger.addEventListener('refresh', measure);

  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width }; };
  const ease = gsap.parseEase('sine.inOut');
  let shown = false;
  const draw = () => {
    if (!pos.length) return;
    const y = window.scrollY;
    if (y < pos[0] - innerHeight) { if (shown) { gsap.set(sun, { opacity: 0 }); shown = false; } return; }
    if (!shown) { gsap.set(sun, { opacity: 1 }); shown = true; }
    let i = 0;
    while (i < pos.length - 2 && y >= pos[i + 1]) i++;
    const a = box(STOPS[i].el), b = box(STOPS[i + 1].el);
    const raw = (y - pos[i]) / Math.max(1, pos[i + 1] - pos[i]);
    const t = ease(Math.min(1, Math.max(0, raw)));
    // a little swing out to the side on the long drops, like something falling
    const swing = Math.sin(Math.PI * t) * Math.min(innerWidth, 600) * 0.12 * (i % 2 ? 1 : -1);
    const d = a.d + (b.d - a.d) * t;
    const x = a.x + (b.x - a.x) * t + (Math.abs(a.y - b.y) > innerHeight * 0.5 ? swing : 0);
    const yy = a.y + (b.y - a.y) * t;
    gsap.set(sun, { x: x - d / 2, y: yy - d / 2, scale: d / 100 });
    const near = STOPS[t < 0.5 ? i : i + 1].k;
    sun.classList.toggle('is-front', FRONT.has(near));
    sun.classList.toggle('is-sky', near === 'c1' || near === 'work');
  };
  gsap.ticker.add(draw);

  ScrollTrigger.sort();
  addEventListener('load', () => ScrollTrigger.refresh());
  ScrollTrigger.refresh();
})();
