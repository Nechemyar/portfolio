import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader    = document.getElementById('loader');
    this.wipePath  = document.getElementById('loader-wipe-path');
    this.eye       = document.getElementById('loader-eye');
    this.lid       = document.getElementById('loader-eye-lid');
    this.sumi      = document.getElementById('loader-sumi');
    this.onComplete = onComplete;

    this.init();
  }

  _setWipePath(top, bottom, curve) {
    const d = `M 0,${top} L 100,${top} L 100,${bottom} Q 50,${bottom - curve} 0,${bottom} Z`;
    this.wipePath.setAttribute('d', d);
  }

  init() {
    document.body.style.overflow = 'hidden';

    if (document.readyState === 'complete') {
      requestAnimationFrame(() => this._buildTimeline());
    } else {
      window.addEventListener('load', () => {
        requestAnimationFrame(() => this._buildTimeline());
      });
    }
  }

  _buildTimeline() {
    const tl = gsap.timeline();

    // 1. Lid starts fully closed
    gsap.set(this.lid,  { scaleY: 1, transformOrigin: 'top center' });
    gsap.set(this.sumi, { x: 0, opacity: 1 });

    // 2. Eye opens — lid retracts upward
    tl.to(this.lid, {
      scaleY: 0,
      duration: 0.55,
      ease: 'power3.out',
    });

    // 3. Look left
    tl.to(this.sumi, {
      x: '-22%',
      duration: 0.35,
      ease: 'power2.inOut',
    });

    // 4. Look right
    tl.to(this.sumi, {
      x: '22%',
      duration: 0.45,
      ease: 'power2.inOut',
    });

    // 5. Return centre
    tl.to(this.sumi, {
      x: '0%',
      duration: 0.3,
      ease: 'power2.out',
    });

    // 6. Blink — close fast, open faster
    tl.to(this.lid, {
      scaleY: 1,
      duration: 0.12,
      ease: 'power2.in',
      transformOrigin: 'top center',
    });
    tl.to(this.lid, {
      scaleY: 0,
      duration: 0.18,
      ease: 'power3.out',
      transformOrigin: 'top center',
    });

    // 7. Brief pause
    tl.to({}, { duration: 0.25 });

    // 8. Fade SUMI just before wipe
    tl.to(this.sumi, { opacity: 0, duration: 0.3, ease: 'power2.in' });

    // 9. Curved wipe sweeps up and exits
    const proxy = { top: 0, bottom: 100, curve: 0 };
    tl.to(proxy, {
      top: -120,
      bottom: -20,
      curve: 28,
      duration: 0.85,
      ease: 'power4.inOut',
      onUpdate: () => this._setWipePath(proxy.top, proxy.bottom, proxy.curve),
      onComplete: () => {
        this.loader.style.display = 'none';
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      },
    }, '-=0.1');
  }
}
