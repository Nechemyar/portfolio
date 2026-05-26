import gsap from 'gsap';

export default class Menu {
  constructor() {
    this.toggle   = document.getElementById('menu-toggle');
    this.menu     = document.getElementById('mobile-menu');
    this.wrap     = document.getElementById('mobile-menu-card-wrap');
    this.card     = document.getElementById('mobile-menu-card');
    this.backdrop = this.menu.querySelector('.mobile-menu__backdrop');
    this.menuLinks = this.menu.querySelectorAll('.menu-item');
    this.linkTexts = this.menu.querySelectorAll('.mobile-menu__link-text');
    this.footer    = this.menu.querySelector('.mobile-menu__footer');
    this.pageWrap  = document.querySelector('main');
    this.isOpen    = false;
    this.isAnimating = false;
    this.tl        = null;

    // Button elements
    this.btnWrap   = this.toggle.querySelector('.nav__menu-letters-wrap');
    this.btnOpenLetters  = this.toggle.querySelectorAll('.nav__menu-word--open .nav__menu-letter');
    this.btnCloseLetters = this.toggle.querySelectorAll('.nav__menu-word--close .nav__menu-letter');
    
    // Width caching for bracket animation
    this.openWidth = 0;
    this.closeWidth = 0;

    this._initHidden();
    this.init();
  }

  _isMobile() {
    return !window.matchMedia('(min-width: 769px)').matches;
  }

  _initHidden() {
    // Cache widths for button
    if (this.btnWrap) {
      const openWord = this.toggle.querySelector('.nav__menu-word--open');
      const closeWord = this.toggle.querySelector('.nav__menu-word--close');
      if (openWord && closeWord) {
        this.openWidth = openWord.offsetWidth;
        this.closeWidth = closeWord.offsetWidth;
        gsap.set(this.btnWrap, { width: this.openWidth });
        gsap.set(this.btnCloseLetters, { y: '-100%' });
      }
    }

    if (this._isMobile()) {
      gsap.set(this.menu, { y: '-100%', height: '100dvh' });
      gsap.set(this.linkTexts, { y: '-100%' });
      if (this.footer) gsap.set(this.footer, { opacity: 0, y: 20 });
    } else {
      gsap.set(this.menu, { clearProps: 'clipPath,height,y', visibility: 'hidden' });
      if (this.backdrop) gsap.set(this.backdrop, { opacity: 0 });
    }
  }

  init() {
    this.toggle.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    if (this.isOpen || this.isAnimating) return;
    this.isOpen = true;
    this.isAnimating = true;

    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-label', 'Close menu');
    this.menu.classList.add('is-open');

    // Toggle button animation
    if (this.btnWrap) {
      const btnTl = gsap.timeline();
      // Animate M, E, N, U out
      btnTl.to(this.btnOpenLetters, {
        y: '100%',
        duration: 0.4,
        ease: 'power3.in',
        stagger: 0.05
      });
      // Expand bracket after a 0.2s pause
      btnTl.to(this.btnWrap, {
        width: this.closeWidth,
        duration: 0.4,
        ease: 'power3.inOut'
      }, '+=0.2');
      // Animate C, L, O, S, E in
      btnTl.to(this.btnCloseLetters, {
        y: '0%',
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.05
      }, '<0.1'); // Start slightly after bracket starts expanding
    }

    if (this._isMobile()) {
      this._openMobile();
    } else {
      this._openDesktop();
    }
  }

  _openMobile() {
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      onComplete: () => { this.isAnimating = false; }
    });

    this.tl.set(this.menu, { visibility: 'visible', overflow: 'hidden' });

    // The site pushes down FIRST, giving a heavy anticipation drag
    this.tl.to(this.pageWrap, {
      y: 150,
      duration: 1.35,
      ease: 'expo.inOut',
    }, 0);

    // Menu drops down heavily a fraction of a second later
    this.tl.to(this.menu, {
      y: 0,
      duration: 1.2,
      ease: 'expo.inOut',
    }, 0.15);

    // Flip the nav text to black once the white menu actually covers it
    // Using 0.55s because the expo.inOut curve starts slowly
    this.tl.call(() => {
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
    }, null, 0.55);

    // Staggered slide up for the menu items - delayed until screen is white
    this.linkTexts.forEach((text, i) => {
      this.tl.fromTo(text, 
        { y: '-100%' },
        {
          y: '0%',
          duration: 1.0,
          ease: 'expo.out',
        }, 0.95 + i * 0.06);
    });

    if (this.footer) {
      this.tl.fromTo(this.footer,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'expo.out',
        }, 1.15);
    }
  }

  _openDesktop() {
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');
    
    gsap.set(this.menu, { clearProps: 'clipPath,height,y', visibility: 'visible' });
    if (this.backdrop) gsap.set(this.backdrop, { opacity: 0 });

    if (this.backdrop) gsap.to(this.backdrop, { opacity: 1, duration: 0.35, ease: 'power2.out' });

    gsap.fromTo(this.menuLinks,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.1, onComplete: () => { this.isAnimating = false; } }
    );
  }

  close() {
    if (!this.isOpen || this.isAnimating) return;
    this.isAnimating = true;

    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-label', 'Open menu');

    // Toggle button animation close
    if (this.btnWrap) {
      const btnTl = gsap.timeline();
      // Animate C, L, O, S, E out
      btnTl.to(this.btnCloseLetters, {
        y: '-100%',
        duration: 0.4,
        ease: 'power3.in',
        stagger: { each: 0.05, from: 'end' } // Reverse stagger
      });
      // Contract bracket after 0.2s
      btnTl.to(this.btnWrap, {
        width: this.openWidth,
        duration: 0.4,
        ease: 'power3.inOut'
      }, '+=0.2');
      // Animate M, E, N, U in
      btnTl.to(this.btnOpenLetters, {
        y: '0%',
        duration: 0.4,
        ease: 'power3.out',
        stagger: { each: 0.05, from: 'end' }
      }, '<0.1');
    }

    if (this._isMobile()) {
      this._closeMobile();
    } else {
      this._closeDesktop();
    }
  }

  _closeMobile() {
    if (this.tl) this.tl.kill();
    this.tl = gsap.timeline({
      onComplete: () => {
        this._resetClosed();
        this.isAnimating = false;
      },
    });

    if (this.footer) {
      this.tl.to(this.footer, {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: 'power2.in',
      }, 0);
    }

    // Stagger slide out menu items
    this.linkTexts.forEach((text, i) => {
      this.tl.to(text, {
        y: '-100%',
        duration: 0.5,
        ease: 'expo.in',
      }, 0.05 + i * 0.04);
    });

    // Menu pulls up FIRST
    this.tl.to(this.menu, {
      y: '-100%',
      duration: 1.2,
      ease: 'expo.inOut',
    }, 0.5);

    // Remove the menu-open class slightly before the menu finishes pulling up
    // so the nav transitions to white EXACTLY as the menu clears the top of the screen
    this.tl.call(() => {
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
    }, null, 1.4);

    // Delayed pageWrap pull up AFTER menu leaves
    this.tl.to(this.pageWrap, {
      y: 0,
      duration: 1.2,
      ease: 'expo.inOut',
    }, 0.65);
  }

  _closeDesktop() {
    gsap.to(this.menuLinks, { opacity: 0, y: -30, duration: 0.22, stagger: 0.04, ease: 'power2.in' });
    if (this.backdrop) {
      gsap.to(this.backdrop, {
        opacity: 0, duration: 0.35, delay: 0.15,
        onComplete: () => {
          this._resetClosed();
          this.isAnimating = false;
        },
      });
      // remove menu-open earlier on desktop too
      setTimeout(() => {
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
      }, 150);
    } else {
      setTimeout(() => {
        this._resetClosed();
        this.isAnimating = false;
      }, 350);
    }
  }

  _resetClosed() {
    this.isOpen = false;
    this.menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    document.body.classList.remove('menu-open');

    if (this._isMobile()) {
      gsap.set(this.menu, { y: '-100%', height: '100dvh' });
      gsap.set(this.pageWrap, { y: 0 });
      gsap.set(this.linkTexts, { y: '-100%' });
      if (this.footer) gsap.set(this.footer, { opacity: 0, y: 20 });
    } else {
      gsap.set(this.menu, { visibility: 'hidden' });
    }
  }
}
