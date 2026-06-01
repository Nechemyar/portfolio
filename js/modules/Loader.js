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
  // off the screen (the visible "circular wipe"). curve bulges the bottom edge.
  _setPath(top, bottom, curve) {
    const d = `M 0,${top} L 100,${top} L 100,${bottom} Q 50,${bottom - curve} 0,${bottom} Z`;
    this.wipePath.setAttribute('d', d);
  }

  init() {
    document.body.style.overflow = 'hidden';

    // Lock the start state IMMEDIATELY (before any paint) so there's never a
    // frame where the logo shows un-clipped — that frame was the "glitch up".
    // Centering is done HERE via GSAP (xPercent/yPercent) so the later morph
    // can animate x/y/scale without fighting a CSS transform.
    gsap.set(this.logo, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 30,
      scale: 1,
      autoAlpha: 1,                 // visibility handled by clip-path below
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
    });
    this.logo.style.visibility = 'visible'; // release the CSS hidden state
    this._setPath(0, 100, 0);              // red panel covers everything

    // Wait for the wordmark img so getBoundingClientRect is accurate.
    const ready = this.wordmark.complete
      ? Promise.resolve()
      : new Promise(res => { this.wordmark.onload = res; this.wordmark.onerror = res; });

    ready.then(() => requestAnimationFrame(() => this._buildTimeline()));
  }

  _buildTimeline() {
    const proxy = { top: 0, bottom: 100, curve: 0 };

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        document.getElementById('loader')?.remove();
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      }
    });

    // Fade is triggered POSITIONALLY (not on a fixed time offset) the instant
    // the wipe's bottom edge sweeps above the nav logo — see _setPath below.
    this._faded = false;
    const fadeLogo = () => {
      if (this._faded) return;
      this._faded = true;
      gsap.to(this.logo, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' });
    };

    tl
      // 1 — logo wipes up from nothing (same mask reveal as the rest of site)
      .to(this.logo, {
        clipPath: 'polygon(0% -10%, 100% -10%, 100% 110%, 0% 110%)',
        y: 0,
        duration: 0.9,
        ease: 'power3.out'
      })
      // 2 — hold so the logo reads
      .to({}, { duration: 0.5 })
      // 3 — measure the nav logo, anchor the morph point
      .add(() => this._measureMorph())
      .addLabel('morph')
      // 3a — morph: logo travels to page-centre-top + scales to nav size.
      //      Deltas are ADDED to the -50/-50 centering already in place.
      .to(this.logo, {
        x: () => this._dx,
        y: () => this._dy,
        scale: () => this._scale,
        duration: 1.0
      }, 'morph')
      // 4 — the curved red panel sweeps up and off AS the logo morphs.
      //     This is the circular wipe; it's the only red on screen now.
      //     The fade fires from here, the moment the edge clears the nav.
      .to(proxy, {
        top: -120,
        bottom: -20,
        curve: 24,
        duration: 1.1,
        ease: 'power4.inOut',
        onUpdate: () => {
          this._setPath(proxy.top, proxy.bottom, proxy.curve);
          // The wipe's edge is curved: at the horizontal centre (where the nav
          // logo sits) the red reaches down to (bottom - curve/2). Fade only
          // once THAT point rises above the nav logo — i.e. the red has truly
          // swept past the menu position. Avoids the early white flash.
          const edgeAtCentre = proxy.bottom - proxy.curve / 2;
          if (edgeAtCentre <= this._navPct) fadeLogo();
        }
      }, 'morph');
  }

  _measureMorph() {
    // Horizontal target: the page centre. The nav logo lives in the centre
    // grid column, so its horizontal centre IS the viewport centre.
    const pageCx = window.innerWidth / 2;

    // Vertical + scale: measure whichever nav logo variant is actually shown
    // (mobile = .nav__logo-svg, desktop = icon+wordmark inside .nav__logo).
    const navSvg = document.querySelector('.nav__logo-svg');
    const svgVisible = navSvg && navSvg.getClientRects().length > 0;
    const navEl = svgVisible ? navSvg : document.querySelector('.nav__logo');

    const navRect  = navEl ? navEl.getBoundingClientRect() : null;
    const logoRect = this.wordmark.getBoundingClientRect();

    if (!navRect || logoRect.height === 0) {
      // Fallback: slide up to roughly the header, centred horizontally
      this._dx = 0;
      this._dy = -(window.innerHeight / 2) + 40;
      this._scale = 0.35;
      this._navPct = 8; // ~top of viewport
      return;
    }

    this._scale = navRect.height / logoRect.height;

    // logoRect is the CURRENT (centred) position. The delta moves its centre
    // to (pageCx, nav centre). Because xPercent/yPercent already offset by
    // -50%, x/y are the translation of the element's centre point.
    const navCy  = navRect.top   + navRect.height / 2;
    const logoCx = logoRect.left + logoRect.width  / 2;
    const logoCy = logoRect.top  + logoRect.height / 2;

    this._dx = pageCx - logoCx;
    this._dy = navCy  - logoCy;

    // Nav logo centre as a % of viewport height — the wipe's bottom edge must
    // pass this value before the loader logo is allowed to fade.
    this._navPct = (navCy / window.innerHeight) * 100;

    console.log('[Loader morph]', {
      navEl: navEl?.className,
      navRect: { top: navRect.top, h: navRect.height, cy: navCy },
      logoRect: { top: logoRect.top, h: logoRect.height, cy: logoCy },
      dx: this._dx, dy: this._dy, scale: this._scale, navPct: this._navPct
    });
  }
}
