import gsap from 'gsap';

export default class Menu {
  constructor() {
    this.toggle   = document.getElementById('menu-toggle');
    this.menu     = document.getElementById('mobile-menu');
    this.wrap     = document.getElementById('mobile-menu-card-wrap');
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
      gsap.set(this.menu, { clearProps: 'all' });
      gsap.set(this.wrap, { y: '100%' });
      gsap.set(this.backdrop, { opacity: 0 });
    } else {
      gsap.set(this.menu, { clearProps: 'clipPath', visibility: 'hidden' });
      gsap.set(this.backdrop, { opacity: 0 });
    }
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
    gsap.set(this.menu, { visibility: 'visible' });
    gsap.to(this.backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.to(this.wrap, { y: '0%', duration: 0.52, ease: 'power4.out' });
    gsap.fromTo(this.menuLinks,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.3 }
    );
  }

  _openDesktop() {
    gsap.set(this.menu, { clearProps: 'clipPath', visibility: 'visible' });
    gsap.set(this.backdrop, { opacity: 0 });

    gsap.to(this.backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });

    // Items come in from below; brief rust tint settles to white
    gsap.fromTo(this.menuLinks,
      { opacity: 0, y: 50, color: '#d07933' },
      { opacity: 1, y: 0, color: '#ffffff', duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.1 }
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
    gsap.to(this.menuLinks, { opacity: 0, y: 6, duration: 0.15, ease: 'power2.in' });
    gsap.to(this.backdrop, { opacity: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to(this.wrap, {
      y: '100%',
      duration: 0.44, ease: 'power4.in', delay: 0.06,
      onComplete: () => this._resetClosed(),
    });
  }

  _closeDesktop() {
    gsap.to(this.menuLinks, { opacity: 0, y: -30, duration: 0.22, stagger: 0.04, ease: 'power2.in' });
    gsap.to(this.backdrop, {
      opacity: 0, duration: 0.35, delay: 0.15,
      onComplete: () => this._resetClosed(),
    });
  }

  _resetClosed() {
    this.isOpen = false;
    this.menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');

    if (this._isMobile()) {
      gsap.set(this.wrap, { y: '100%' });
    } else {
      gsap.set(this.menu, { visibility: 'hidden' });
    }
  }
}
