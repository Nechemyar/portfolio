import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.wipePath  = document.getElementById('loader-wipe-path');
    this.logo      = document.getElementById('loader-logo');
    this.wordmark  = document.getElementById('loader-wordmark');
    this.onComplete = onComplete;
    this.init();
  }

  // Curved bottom-edge path. progress 0 = full red panel, 1 = panel gone.
  _buildPath(p) {
    const topY  = 100 * (1 - p);
    const ctrlY = topY + 12;
    return `M 0,0 L 100,0 L 100,${topY} Q 50,${ctrlY} 0,${topY} Z`;
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

    // Keep the wipe panel covering the full screen initially
    this.wipePath.setAttribute('d', this._buildPath(0));

    const tl = gsap.timeline({
      onComplete: () => {
        document.getElementById('loader')?.remove();
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      }
    });

    tl
      // 1 — logo wipes up from the bottom
      .to(this.logo, {
        clipPath: 'polygon(0% -10%, 100% -10%, 100% 110%, 0% 110%)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
      // 2 — hold so the logo reads
      .to({}, { duration: 0.5 })
      // 3 — measure nav logo position, then tween loader logo to match
      .add(() => this._measureMorph())
      .to(this.logo, {
        duration: 0.85,
        ease: 'power3.inOut',
        x: () => this._dx,
        y: () => this._dy,
        scale: () => this._scale
      }, 'morph')
      // 4 — while morphing, start lifting the red panel (slightly delayed
      //     so the logo is visibly en-route before the background moves)
      .to({ p: 0 }, {
        p: 1,
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: function () {
          const path = document.getElementById('loader-wipe-path');
          const topY  = 100 * (1 - this.targets()[0].p);
          const ctrlY = topY + 12;
          path.setAttribute('d',
            `M 0,0 L 100,0 L 100,${topY} Q 50,${ctrlY} 0,${topY} Z`);
        }
      }, 'morph+=0.3')
      // 5 — fade loader logo out just as wipe clears, handing off to real nav logo
      .to(this.logo, { autoAlpha: 0, duration: 0.15 }, 'morph+=1.0');
  }

  _measureMorph() {
    // .nav__logo-svg is the real logo in the header — it sits at its
    // resting position (excluded from the hero entrance clip).
    const navEl   = document.querySelector('.nav__logo-svg') || document.querySelector('.nav__logo');
    const navRect  = navEl  ? navEl.getBoundingClientRect()        : null;
    const logoRect = this.wordmark.getBoundingClientRect();

    if (!navRect || logoRect.height === 0) {
      // Fallback: slide up-left to approximate nav position
      this._dx    = -window.innerWidth  * 0.35;
      this._dy    = -window.innerHeight * 0.40;
      this._scale = 0.35;
      return;
    }

    this._scale = navRect.height / logoRect.height;

    const navCx  = navRect.left  + navRect.width  / 2;
    const navCy  = navRect.top   + navRect.height / 2;
    const logoCx = logoRect.left + logoRect.width  / 2;
    const logoCy = logoRect.top  + logoRect.height / 2;

    this._dx = navCx - logoCx;
    this._dy = navCy - logoCy;
  }
}
