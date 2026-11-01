// ——————————————————————————————————————————————
// SumiDay — everything after Work, told as one day on the printed sky
// ——————————————————————————————————————————————
// The hero's sun sets under the trust line (InkStory). Here it carries on:
// one printed sun travels down the rest of the page from one resting place
// (.sun-at) to the next, scrubbed by scroll:
//   behind the Work sheet → a halo behind each quote → along the price
//   rules → along the month line → into the sea in the about sentence →
//   the full stop of "Questions" → up over the clouds at the close.
// The sky behind turns towards evening and back to the hero's blue.
//
// Why two suns: a fixed element moved by JS every frame trails the page by a
// frame on phones (scrolling runs off the main thread), so it shakes against
// the lines it rides. So the sun lives in the page (.day-sun--page, absolute)
// and the browser scrolls it; JS only nudges it along its path. Inside a
// pinned scene, where its resting places hold still on screen, a fixed twin
// (.day-sun--pin) takes over, and they swap where both stand on the same spot.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function words(el) {
  el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  return $$('.w', el);
}

export default function initDay() {
  if (!$('.fq')) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    // the pictures keep their room in the line from the start and open with a
    // clip, so the sentence never reflows (and the sun's spot in the sea holds still)
    const shut = 'inset(0% 50% 0% 50% round 999px)', open = 'inset(0% 0% 0% 0% round 999px)';
    if (reduce) { gsap.set($$('.w', p), { opacity: 1 }); return; }
    gsap.set($$('.fa__pill', p), { clipPath: shut });
    const tl = gsap.timeline({ scrollTrigger: { trigger: s, pin: true, start: 'top top', end: '+=170%', scrub: 0.5 } });
    pins.a = tl.scrollTrigger;
    [...p.children].forEach((el) => {
      if (el.classList.contains('w')) tl.to(el, { opacity: 1, duration: 0.12, ease: 'none' });
      else { if (el.classList.contains('fa__pill--sea')) tl.addLabel('sea'); tl.fromTo(el, { clipPath: shut }, { clipPath: open, duration: 0.5, ease: 'power3.out' }); }
    });
    tl.to({}, { duration: 0.6 });
    pins.aSea = () => tl.labels.sea / tl.duration();
  })();

  /* ---------- faq: big list ---------- */
  (() => {
    const box = $('.ff__list');
    if (!box) return;
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

  /* ---------- the day: day to evening and back, by opacity only ---------- */
  (() => {
    const eve = $('.day-sky__eve');
    if (!eve || reduce) return;
    gsap.timeline({ scrollTrigger: { trigger: '.fq', start: 'top bottom', endTrigger: '.fc', end: 'top 20%', scrub: true } })
      .fromTo(eve, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 3 })
      .to(eve, { opacity: 0, ease: 'none', duration: 1 });
  })();


  /* ---------- the sun ---------- */
  (() => {
    const page = $('.day-sun--page'), pin = $('.day-sun--pin');
    if (!page || !pin || reduce) return;
    const at = (k) => $(`[data-sun="${k}"]`);
    const plain = (k, start = 'center center') => {
      const el = at(k);
      const st = el && ScrollTrigger.create({ trigger: el, start });
      return () => (st ? st.start : 0);
    };
    const span = (p, f) => p.start + (p.end - p.start) * f;
    // where each resting place is reached, in px of scroll. A stop inside a
    // pin is reached while the pin holds, and the next one is left only once
    // the pin lets go, so a segment is either wholly pinned or wholly free.
    const STOPS = [
      { k: 'work', s: plain('work', 'bottom bottom') },
      { k: 'q1', s: () => (pins.q ? pins.q.start : 0) },
      { k: 'q2', s: () => (pins.q ? pins.q.end : 0), pin: 'q' },
      { k: 'p1', s: plain('p1', 'center 72%') },
      { k: 'p2', s: plain('p2', 'center 62%') },
      { k: 'r1', s: () => (pins.r ? pins.r.start : 0) },
      { k: 'r2', s: () => (pins.r ? pins.r.end : 0), pin: 'r' },
      { k: 'a1', s: () => (pins.a ? span(pins.a, pins.aSea() + 0.06) : 0) },
      { k: 'a1', s: () => (pins.a ? pins.a.end : 0), pin: 'a' },
      { k: 'f1', s: plain('f1', 'center 45%') },
      { k: 'c1', s: plain('c1', 'center 50%') },
    ].map((o) => ({ ...o, el: at(o.k) })).filter((o) => o.el);
    if (STOPS.length < 2) return;

    // small suns sit on top of lines and in the sea; big ones glow behind words
    const FRONT = new Set(['p1', 'p2', 'r1', 'r2', 'a1', 'f1']);
    let pos = [];
    let sy = window.scrollY; // the eased scroll the sun follows
    const measure = () => { pos = STOPS.map((o) => o.s()); sy = window.scrollY; };
    ScrollTrigger.addEventListener('refresh', measure);

    // centre and size in page px (y measured from the top of the document)
    const box = (el, y0) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 + y0, d: r.width }; };
    const ease = gsap.parseEase('sine.inOut');
    let mode = 'none';
    const setMode = (m) => {
      if (m === mode) return;
      mode = m;
      page.style.visibility = m === 'page' ? 'visible' : 'hidden';
      pin.style.visibility = m === 'pin' ? 'visible' : 'hidden';
    };

    const draw = (time, dt) => {
      if (!pos.length) return;
      const now = window.scrollY;
      if (now < pos[0] - innerHeight) { sy = now; setMode('none'); return; }
      if (mode === 'none') sy = now;
      // the pinned scenes follow the scroll with scrub 0.6; the sun eases too
      sy += (now - sy) * (1 - Math.exp(-(dt || 16) / 180));
      if (Math.abs(now - sy) < 0.5) sy = now;

      let i = 0;
      while (i < pos.length - 2 && sy >= pos[i + 1]) i++;
      const raw = (sy - pos[i]) / Math.max(1, pos[i + 1] - pos[i]);
      const t = ease(Math.min(1, Math.max(0, raw)));
      const pinned = !!STOPS[i + 1].pin && raw > 0 && raw < 1;
      // pinned: viewport px for the fixed twin; free: page px for the page sun
      const y0 = pinned ? 0 : now;
      const a = box(STOPS[i].el, y0), b = box(STOPS[i + 1].el, y0);
      const d = a.d + (b.d - a.d) * t;
      let x = a.x + (b.x - a.x) * t;
      // a little sway on the long drops, never half off the screen
      if (!pinned && Math.abs(a.y - b.y) > innerHeight * 0.5) x += Math.sin(Math.PI * t) * Math.min(innerWidth, 600) * 0.06 * (i % 2 ? 1 : -1);
      if (t > 0.02 && t < 0.98) x = Math.min(innerWidth - d / 2 - 8, Math.max(d / 2 + 8, x));
      const y = a.y + (b.y - a.y) * t;
      const el = pinned ? pin : page;
      gsap.set(el, { x: x - d / 2, y: y - d / 2, scale: d / 100 });
      setMode(pinned ? 'pin' : 'page');
      const near = STOPS[t < 0.5 ? i : i + 1].k;
      // only step in front of the words once it's small, so it never pops over text
      el.classList.toggle('is-front', FRONT.has(near) && d < 48);
    };
    gsap.ticker.add(draw);
  })();


  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
