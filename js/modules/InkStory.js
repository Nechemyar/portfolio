// ——————————————————————————————————————————————
// InkStory — the intro told as one scroll
// ——————————————————————————————————————————————
// .intro is three sections over the sticky InkSky canvas: the hero (100svh),
// the reel (180svh, pulled up so its card peeks under the hero, then held by
// CSS sticky) and the trust line (100svh). One scrubbed timeline spans the
// intro, measured in svh of scroll (about 257 in all) so every beat lands on
// its section at any screen size:
//   0–100    the clouds part round the rising card
//   0–77     the reel card rises from under the hero and opens out a touch
//   170–257  the clouds close back in and the sun sets,
//            arriving as the trust line reaches the middle
// The sky moves by tweening InkSky.state (drawn in WebGL, no DOM paint); the
// card moves by scale only.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class InkStory {
  constructor(sky) {
    this.sky = sky;
    this.intro = document.querySelector('.intro');
    this.card = document.querySelector('.reel__card');
    if (!this.intro || !this.card) return;

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
      if (reduce) return; // the card sits at full size and the sky holds still

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: this.intro, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }
      });
      tl.set({}, {}, 257);

      // 1. the clouds part
      tl.to(s.corner, { x: () => vw() * 0.32, y: () => -vh() * 0.3, duration: 100 }, 0)
        .to(s.wisp, { x: () => -vw() * 0.7, duration: 100 }, 0)
        .to(s.sun, { x: () => -vw() * 0.14, duration: 100 }, 0);

      // 2. the reel card, peeking under the hero, opens out a touch as it
      //    rises into place (scale only)
      tl.fromTo(this.card, { scale: 0.94 }, { scale: 1, duration: 77, ease: 'power1.out' }, 0);

      // 3. the clouds close in and the sun sets
      tl.to(s.wisp, { x: () => -vw() * 0.04, y: () => vh() * (phone ? 0.36 : 0.24), duration: 87 }, 170)
        .to(s.corner, { x: () => vw() * 0.14, y: () => -vh() * 0.1, duration: 87 }, 170)
        .to(s.sun, { x: 0, y: () => vh() * 0.95, s: 1.12, duration: 87 }, 170);
    });
  }

  // Printed one block at a time: sun, far clouds, near clouds.
  printIn() {
    const s = this.sky.state;
    const layers = [s.sun, s.wisp, s.corner];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(layers, { a: 1 });
      return;
    }
    gsap.to(layers, { a: 1, duration: 1.1, ease: 'power2.out', stagger: 0.14 });
  }
}
