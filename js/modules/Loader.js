import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader   = document.getElementById('loader');
    this.wipePath = document.getElementById('loader-wipe-path');
    this.wLeft    = document.getElementById('loader-wordmark-left');
    this.wRight   = document.getElementById('loader-wordmark-right');
    this.stacked  = document.getElementById('loader-stacked');
    this.onComplete = onComplete;

    this.init();
  }

  _setPath(top, bottom, curve) {
    const d = `M 0,${top} L 100,${top} L 100,${bottom} Q 50,${bottom - curve} 0,${bottom} Z`;
    this.wipePath.setAttribute('d', d);
  }

  init() {
    document.body.style.overflow = 'hidden';

    // CSS already sets translateY(100%) — GSAP reinforces so its own
    // state machine starts correctly
    gsap.set([this.wLeft, this.wRight, this.stacked], { yPercent: 100 });

    const proxy = { top: 0, bottom: 100, curve: 0 };

    gsap.timeline()
      // Step 1 — left + right wordmarks slide up into their masks
      .to([this.wLeft, this.wRight], {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
      })
      // Step 2 — center stacked logo follows 0.15s later
      .to(this.stacked, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
      }, '<0.15')
      // Step 3 — wordmarks disappear bottom-up out of their masks
      .to([this.wLeft, this.wRight], {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
      })
      // Step 4 — hold center logo (short)
      .to({}, { duration: 0.4 })
      // Step 5a — fade center logo into the black
      .to(this.stacked, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      })
      // Step 5b — SVG wipe: flat rect → upward curve → off screen top
      .to(proxy, {
        top: -120,
        bottom: -20,
        curve: 24,
        duration: 1.5,
        ease: 'power4.inOut',
        onUpdate: () => this._setPath(proxy.top, proxy.bottom, proxy.curve),
        onComplete: () => {
          this.loader.style.display = 'none';
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        },
      });
  }
}
