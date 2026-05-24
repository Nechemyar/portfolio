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

  // Measure the natural pill width by briefly applying the backed class
  // without any transitions so the measurement is instant and accurate.
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
    const style = getComputedStyle(this.nav);
    return (
      this.nav.getBoundingClientRect().width
      - parseFloat(style.paddingLeft)
      - parseFloat(style.paddingRight)
    );
  }

  _check() {
    const should = window.scrollY > 24;
    if (should === this.isBacked) return;
    this.isBacked = should;
    document.body.classList.toggle('nav-has-backing', should);

    // Mobile: class toggle is enough — CSS handles the full-width pill.
    if (!this._isDesktop()) return;

    gsap.killTweensOf(this.inner);

    if (should) {
      const heroW = this.inner.getBoundingClientRect().width;
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
      const pillW = this.inner.getBoundingClientRect().width;
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
