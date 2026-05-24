import gsap from 'gsap';

export default class Menu {
  constructor() {
    this.toggle   = document.getElementById('menu-toggle');
    this.menu     = document.getElementById('mobile-menu');
    this.card     = document.getElementById('mobile-menu-card');
    this.closeBtn = document.getElementById('mobile-menu-close-pill');
    this.backdrop = this.menu.querySelector('.mobile-menu__backdrop');
    this.menuLinks = this.menu.querySelectorAll('.menu-item');
    this.isOpen   = false;

    this._initHidden();
    this.init();
  }

  _isMobile() {
    return !window.matchMedia('(min-width: 769px)').matches;
  }

  _initHidden() {
    if (this._isMobile()) {
      gsap.set(this.menu, { clipPath: 'inset(0% 0% 100% 0%)' });
    } else {
      gsap.set(this.menu, { clearProps: 'clipPath', visibility: 'hidden' });
      gsap.set(this.backdrop, { opacity: 0 });
    }
  }

  _navBottom() {
    const nav = document.getElementById('nav');
    return window.innerHeight - nav.getBoundingClientRect().bottom;
  }

  init() {
    this.toggle.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close on backdrop click (desktop)
    this.backdrop.addEventListener('click', () => this.close());

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-label', 'Close menu');
    this.menu.classList.add('is-open');
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');

    if (this._isMobile()) {
      this._openMobile();
    } else {
      this._openDesktop();
    }
  }

  _openMobile() {
    gsap.set(this.menu, { clipPath: `inset(0px 0px ${this._navBottom()}px 0px)` });
    gsap.set(this.card, { y: 56, opacity: 0 });

    gsap.to(this.menu, {
      clipPath: 'inset(0px 0px 0px 0px)',
      duration: 0.48,
      ease: 'power3.out',
    });

    gsap.to(this.card, {
      y: 0, opacity: 1,
      duration: 0.44, ease: 'power3.out', delay: 0.14,
    });

    gsap.fromTo(this.menuLinks,
      { opacity: 0, x: -14 },
      { opacity: 1, x: 0, duration: 0.32, stagger: 0.04, ease: 'power2.out', delay: 0.22 }
    );
  }

  _openDesktop() {
    gsap.set(this.menu, { clearProps: 'clipPath', visibility: 'visible' });
    gsap.set(this.backdrop, { opacity: 0 });
    gsap.set(this.card, { y: -20, opacity: 0 });

    gsap.to(this.backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' });

    gsap.to(this.card, {
      y: 0, opacity: 1,
      duration: 0.4, ease: 'power3.out', delay: 0.05,
    });

    gsap.fromTo(this.menuLinks,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.28, stagger: 0.03, ease: 'power2.out', delay: 0.12 }
    );
  }

  close() {
    if (!this.isOpen) return;

    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-label', 'Open menu');

    if (this._isMobile()) {
      this._closeMobile();
    } else {
      this._closeDesktop();
    }
  }

  _closeMobile() {
    gsap.to(this.menuLinks, { opacity: 0, duration: 0.15 });
    gsap.to(this.card, { y: 56, opacity: 0, duration: 0.28, ease: 'power2.in' });

    gsap.to(this.menu, {
      clipPath: `inset(0px 0px ${this._navBottom()}px 0px)`,
      duration: 0.42, ease: 'power3.in', delay: 0.12,
      onComplete: () => this._resetClosed(),
    });
  }

  _closeDesktop() {
    gsap.to(this.menuLinks, { opacity: 0, duration: 0.1 });
    gsap.to(this.card, { y: -20, opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(this.backdrop, {
      opacity: 0, duration: 0.3, delay: 0.1,
      onComplete: () => this._resetClosed(),
    });
  }

  _resetClosed() {
    this.isOpen = false;
    this.menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');

    if (this._isMobile()) {
      gsap.set(this.menu, { clipPath: 'inset(0% 0% 100% 0%)' });
    } else {
      gsap.set(this.menu, { visibility: 'hidden' });
    }
  }
}
