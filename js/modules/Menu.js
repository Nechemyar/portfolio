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
    this.navItems  = this.menu.querySelectorAll('.mobile-menu__nav-item');
    this.linkTexts = this.menu.querySelectorAll('.mobile-menu__link-text');
    this.footer    = this.menu.querySelector('.mobile-menu__footer');
    this.pageWrap  = document.querySelector('main');
    this.nav       = document.getElementById('nav');
    this.isOpen    = false;
    this.tl        = null;

    this._initHidden();
    this.init();
  }

  _isMobile() {
    return !window.matchMedia('(min-width: 769px)').matches;
  }

  _initHidden() {
    if (this._isMobile()) {
      gsap.set(this.menu, { height: 0 });
      gsap.set(this.linkTexts, { clipPath: 'inset(0 0 100% 0)' });
      if (this.footer) gsap.set(this.footer, { opacity: 0, y: 10 });
    } else {
      gsap.set(this.menu, { clearProps: 'clipPath,height', visibility: 'hidden' });
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
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline();

    this.tl.set(this.menu, { visibility: 'visible', overflow: 'hidden' });

    this.tl.to(this.menu, {
      height: '100dvh',
      duration: 0.55,
      ease: 'power3.inOut',
    }, 0);

    this.tl.to(this.pageWrap, {
      y: () => window.innerHeight,
      duration: 0.55,
      ease: 'power3.inOut',
    }, 0);

    this.linkTexts.forEach((text, i) => {
      this.tl.to(text, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.5,
        ease: 'power3.out',
      }, 0.25 + i * 0.07);
    });

    if (this.footer) {
      this.tl.to(this.footer, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, 0.5);
    }
  }

  _openDesktop() {
    gsap.set(this.menu, { clearProps: 'clipPath,height', visibility: 'visible' });
    gsap.set(this.backdrop, { opacity: 0 });

    gsap.to(this.backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });

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
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      onComplete: () => this._resetClosed(),
    });

    if (this.footer) {
      this.tl.to(this.footer, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: 'power2.in',
      }, 0);
    }

    this.linkTexts.forEach((text, i) => {
      const reversed = this.linkTexts.length - 1 - i;
      this.tl.to(text, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.35,
        ease: 'power3.in',
      }, 0.05 + reversed * 0.04);
    });

    this.tl.to(this.menu, {
      height: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    }, 0.15);

    this.tl.to(this.pageWrap, {
      y: 0,
      duration: 0.5,
      ease: 'power3.inOut',
    }, 0.15);
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
      gsap.set(this.menu, { height: 0 });
      gsap.set(this.pageWrap, { y: 0 });
      gsap.set(this.linkTexts, { clipPath: 'inset(0 0 100% 0)' });
      if (this.footer) gsap.set(this.footer, { opacity: 0, y: 10 });
    } else {
      gsap.set(this.menu, { visibility: 'hidden' });
    }
  }
}
