import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.wipePath  = document.getElementById('loader-wipe-path');
    this.logo      = document.getElementById('loader-logo');
    this.wordmark  = document.getElementById('loader-wordmark');
    this.onComplete = onComplete;
    this.init();
  }

  // The red panel: a rect with a curved bottom edge. Both edges sweep up and
  // off the screen (the "circular wipe"). curve bulges the bottom edge down.
  _setPath(top, bottom, curve) {
    const d = `M 0,${top} L 100,${top} L 100,${bottom} Q 50,${bottom - curve} 0,${bottom} Z`;
    this.wipePath.setAttribute('d', d);
  }

  init() {
    document.body.style.overflow = 'hidden';

    // Wait for the wordmark img to load so getBoundingClientRect is accurate.
    const ready = this.wordmark.complete
      ? Promise.resolve()
      : new Promise(res => { this.wordmark.onload = res; this.wordmark.onerror = res; });

    ready.then(() => requestAnimationFrame(() => this._buildTimeline()));
  }

  _buildTimeline() {
    // Logo starts clipped from below (mask wipe up, same as rest of site)
    gsap.set(this.logo, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      y: 30
    });

    // Red panel covers the whole screen to start
    this._setPath(0, 100, 0);

    // proxy drives the curved panel sweeping up and off
    const proxy = { top: 0, bottom: 100, curve: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.getElementById('loader')?.remove();
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      }
    });

    tl
      // 1 — logo wipes up from the bottom (same mask reveal as the site)
      .to(this.logo, {
        clipPath: 'polygon(0% -10%, 100% -10%, 100% 110%, 0% 110%)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
      // 2 — hold so the logo reads
      .to({}, { duration: 0.5 })
      // 3 — measure the nav logo, then morph the loader logo to its centre
      //     (page horizontal centre + header vertical position) and scale
      .add(() => this._measureMorph())
      .to(this.logo, {
        duration: 0.9,
        ease: 'power3.inOut',
        x: () => this._dx,
        y: () => this._dy,
        scale: () => this._scale
      }, 'morph')
      // 4 — the curved red panel sweeps up and off, revealing the page.
      //     Starts alongside the morph so the logo rides up with the red.
      .to(proxy, {
        top: -120,
        bottom: -20,
        curve: 24,
        duration: 1.1,
        ease: 'power4.inOut',
        onUpdate: () => this._setPath(proxy.top, proxy.bottom, proxy.curve)
      }, 'morph')
      // 5 — logo stays opaque (sitting in the red) until the wipe's bottom
      //     edge has swept past the nav position, then fades INTO the red so
      //     the real nav logo takes over seamlessly. Tied to when the panel's
      //     bottom edge clears the top of the screen.
      .to(this.logo, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power1.in'
      }, 'morph+=0.75');
  }

  _measureMorph() {
    // Horizontal: always the page centre (the nav logo lives in the centre
    // grid column, so its horizontal centre IS the viewport centre).
    const pageCx = window.innerWidth / 2;

    // Vertical + scale: measure whichever nav logo variant is actually
    // visible (mobile shows .nav__logo-svg; desktop shows the icon+wordmark
    // combo inside .nav__logo). Fall back to the container.
    const navSvg   = document.querySelector('.nav__logo-svg');
    const navEl    = (navSvg && navSvg.offsetParent !== null)
      ? navSvg
      : document.querySelector('.nav__logo');
    const navRect  = navEl ? navEl.getBoundingClientRect() : null;
    const logoRect = this.wordmark.getBoundingClientRect();

    if (!navRect || logoRect.height === 0) {
      // Fallback: slide up to roughly the header
      this._dx    = 0;
      this._dy    = -window.innerHeight * 0.40;
      this._scale = 0.35;
      return;
    }

    this._scale = navRect.height / logoRect.height;

    const navCy  = navRect.top   + navRect.height / 2;
    const logoCx = logoRect.left + logoRect.width  / 2;
    const logoCy = logoRect.top  + logoRect.height / 2;

    // Land on page centre horizontally, nav logo centre vertically
    this._dx = pageCx - logoCx;
    this._dy = navCy  - logoCy;
  }
}
