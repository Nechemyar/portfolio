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

    // rAF ensures one layout pass has completed so aspect-ratio heights
    // are resolved before GSAP reads yPercent pixel values
    requestAnimationFrame(() => {
      const proxy = { top: 0, bottom: 100, curve: 0 };

      gsap.timeline()
        // Step 1 — left + right wordmarks slide up into their clip masks
        .fromTo([this.wLeft, this.wRight],
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: 'power4.out' }
        )
        // Step 2 — center stacked logo follows 0.15s after step 1 starts
        .fromTo(this.stacked,
          { yPercent: 100 },
          { yPercent: 0, duration: 1, ease: 'power4.out' },
          '<0.15'
        )
        // Step 3 — wordmarks cut upward, disappearing out the top of their masks
        .to([this.wLeft, this.wRight], {
          yPercent: -100,
          duration: 0.7,
          ease: 'power3.inOut',
        })
        // Step 4 — hold center logo
        .to({}, { duration: 0.4 })
        // Step 5a — center logo fades into the black
        .to(this.stacked, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        })
        // Step 5b — black wipe sweeps off top with curved bottom edge
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
    });
  }
}
