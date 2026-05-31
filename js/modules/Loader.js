import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.wipePath = document.getElementById('loader-wipe-path');
    this.logo     = document.getElementById('loader-logo');
    this.wordmark = document.getElementById('loader-wordmark');
    this.letters  = document.querySelectorAll('.loader__letter');
    this.onComplete = onComplete;
    this.init();
  }

  init() {
    // Curved wipe path for a given progress (0–1). 0 = full panel, 1 = lifted off.
    const buildPath = (p) => {
      const topY = 100 * (1 - p);
      const ctrlY = topY + 12; // convex bulge at the bottom edge
      return `M 0,0 L 100,0 L 100,${topY} Q 50,${ctrlY} 0,${topY} Z`;
    };
    gsap.set(this.wipePath, { attr: { d: buildPath(0) } });

    // Letters start hidden, dropped slightly — they rise in one at a time
    gsap.set(this.letters, { autoAlpha: 0, yPercent: 60 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.querySelector('.loader')?.remove();
        if (this.onComplete) this.onComplete();
      }
    });

    tl
      // 1 — SUMI letters rise in, one at a time
      .to(this.letters, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.12
      })
      // 2 — hold a beat
      .to({}, { duration: 0.35 })
      // 3 — shrink + slide up so the loader logo lands exactly on the nav logo
      .add(() => this.morphToNav(), 'morph')
      .to(this.logo, {
        duration: 0.9,
        ease: 'power3.inOut',
        x: () => this._dx,
        y: () => this._dy,
        scale: () => this._scale
      }, 'morph')
      // 4 — wipe lifts the red panel away to reveal the page underneath.
      //     The real nav logo sits in the exact same spot, so it's seamless.
      .to({}, {
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: function () {
          gsap.set(document.getElementById('loader-wipe-path'),
            { attr: { d: buildPath(this.progress()) } });
        }
      }, 'morph+=0.45')
      // logo fades out just before the wipe fully clears, handing off to the real nav logo
      .to(this.logo, { autoAlpha: 0, duration: 0.2 }, 'morph+=1.1');
  }

  // Measure the nav logo and the loader logo, compute the transform delta so
  // the loader wordmark scales/translates to overlap the nav logo precisely.
  morphToNav() {
    // .nav__logo sits at its resting position (it's excluded from the hero
    // entrance wipe), so we can measure it directly.
    const navLogo = document.querySelector('.nav__logo-svg') || document.querySelector('.nav__logo');
    if (!navLogo) { this._dx = 0; this._dy = -window.innerHeight * 0.35; this._scale = 0.4; return; }

    const navRect  = navLogo.getBoundingClientRect();
    const logoRect = this.wordmark.getBoundingClientRect();

    // Scale loader wordmark down to the nav logo's height
    this._scale = navRect.height / logoRect.height;

    // Centre-to-centre delta (logo is centered via translate(-50%,-50%))
    const navCx  = navRect.left + navRect.width / 2;
    const navCy  = navRect.top + navRect.height / 2;
    const logoCx = logoRect.left + logoRect.width / 2;
    const logoCy = logoRect.top + logoRect.height / 2;

    this._dx = navCx - logoCx;
    this._dy = navCy - logoCy;
  }
}
