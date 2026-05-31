import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader    = document.getElementById('loader');
    this.wipePath  = document.getElementById('loader-wipe-path');
    this.wLeft     = document.getElementById('loader-wordmark-left');
    this.wRight    = document.getElementById('loader-wordmark-right');
    this.stacked   = document.getElementById('loader-stacked');
    this.maskLeft  = document.getElementById('loader-mask-left');
    this.maskRight = document.getElementById('loader-mask-right');
    this.onComplete = onComplete;

    this.init();
  }

  _setPath(top, bottom, curve) {
    const d = `M 0,${top} L 100,${top} L 100,${bottom} Q 50,${bottom - curve} 0,${bottom} Z`;
    this.wipePath.setAttribute('d', d);
  }

  init() {
    document.body.style.overflow = 'hidden';

    const imgs = [this.wLeft, this.wRight, this.stacked];
    Promise.all(
      imgs.map(img =>
        img.complete ? Promise.resolve() : img.decode().catch(() => {})
      )
    ).then(() => {
      requestAnimationFrame(() => this._buildTimeline());
    });
  }

  _buildTimeline() {
    this.loader.querySelector('.loader__inner').style.visibility = 'visible';
    const proxy = { top: 0, bottom: 100, curve: 0 };

    gsap.timeline()
      // Step 1 — wordmarks stagger in left-to-right
      .fromTo(this.wLeft,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'power4.out' }
      )
      .fromTo(this.wRight,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: 'power4.out' },
        '<0.12'
      )
      // Step 2 — stacked logo follows quickly
      .fromTo(this.stacked,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: 'power4.out' },
        '-=0.3'
      )
      // Step 3 — wordmarks exit: mask clips from bottom up (logos stay still)
      .fromTo([this.maskLeft, this.maskRight],
        { clipPath: 'inset(0 0 0% 0)' },
        { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power3.inOut' }
      )
      // Step 4 — brief hold
      .to({}, { duration: 0.25 })
      // Step 5 — wipe starts, stacked logo vanishes 0.3s in
      .to(proxy, {
        top: -120,
        bottom: -20,
        curve: 24,
        duration: 0.9,
        ease: 'power4.inOut',
        onUpdate: () => this._setPath(proxy.top, proxy.bottom, proxy.curve),
        onComplete: () => {
          this.loader.style.display = 'none';
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        },
      }, 'wipe')
      .set(this.stacked, { autoAlpha: 0 }, 'wipe+=0.4');
  }
}
