import gsap from 'gsap';

export default class NavTheme {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.inner = document.querySelector('.nav__inner');
    this.isBacked = false;
    this.pillW = null;
    this.init();
  }

  init() {
    this._measure();
    this._check();
    window.addEventListener('scroll', () => this._check(), { passive: true });
    window.addEventListener('resize', () => {
      gsap.set(this.inner, { clearProps: 'width' });
      this._measure();
    }, { passive: true });
  }

  _isDesktop() {
    return window.matchMedia('(min-width: 769px)').matches;
  }

  // Briefly apply the backed class (without transitions) to measure the
  // natural pill width so GSAP has an exact px target to animate toward.
  _measure() {
    if (!this._isDesktop()) return;
    const wasBacked = document.body.classList.contains('nav-has-backing');
    this.inner.style.transition = 'none';
    if (!wasBacked) document.body.classList.add('nav-has-backing');
    void this.inner.offsetWidth;
    this.pillW = this.inner.scrollWidth;
    if (!wasBacked) document.body.classList.remove('nav-has-backing');
    this.inner.style.transition = '';
    void this.inner.offsetWidth;
  }

  _heroWidth() {
    const s = getComputedStyle(this.nav);
    return (
      this.nav.getBoundingClientRect().width
      - parseFloat(s.paddingLeft)
      - parseFloat(s.paddingRight)
    );
  }

  _check() {
    const should = window.scrollY > 24;
    if (should === this.isBacked) return;
    this.isBacked = should;

    // Mobile: CSS handles the full-width backed pill via class alone.
    if (!this._isDesktop()) {
      document.body.classList.toggle('nav-has-backing', should);
      return;
    }

    gsap.killTweensOf(this.inner);

    if (should) {
      // Measure current width BEFORE the class snaps width: fit-content.
      const heroW = this.inner.getBoundingClientRect().width;
      document.body.classList.add('nav-has-backing');
      gsap.fromTo(
        this.inner,
        { width: heroW },
        {
          width: this.pillW,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => gsap.set(this.inner, { clearProps: 'width' }),
        }
      );
    } else {
      // Measure current (pill) width BEFORE the class removal restores width:100%.
      const pillW = this.inner.getBoundingClientRect().width;
      document.body.classList.remove('nav-has-backing');
      gsap.fromTo(
        this.inner,
        { width: pillW },
        {
          width: this._heroWidth(),
          duration: 0.45,
          ease: 'power3.out',
          onComplete: () => gsap.set(this.inner, { clearProps: 'width' }),
        }
      );
    }
  }
}
