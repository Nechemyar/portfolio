import gsap from 'gsap';

export default class Menu {
  constructor() {
    this.toggle   = document.getElementById('menu-toggle');
    this.menu     = document.getElementById('mobile-menu');
    this.card     = document.getElementById('mobile-menu-card');
    this.closeBtn = document.getElementById('mobile-menu-close-pill');
    this.menuLinks = this.menu.querySelectorAll('.menu-item');
    this.isOpen   = false;

    // Start fully clipped — invisible until opened
    gsap.set(this.menu, { clipPath: 'inset(0% 0% 100% 0%)' });

    this.init();
  }

  init() {
    this.toggle.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  _navBottom() {
    const nav = document.getElementById('nav');
    const rect = nav.getBoundingClientRect();
    return window.innerHeight - rect.bottom;
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-label', 'Close menu');
    this.menu.classList.add('is-open');
    document.documentElement.classList.add('menu-open');
    document.body.classList.add('menu-open');

    // Clip starts at the nav bar's bottom edge — menu appears to grow from it
    gsap.set(this.menu, { clipPath: `inset(0px 0px ${this._navBottom()}px 0px)` });
    gsap.set(this.card, { y: 56, opacity: 0 });

    // Expand orange bg to full screen
    gsap.to(this.menu, {
      clipPath: 'inset(0px 0px 0px 0px)',
      duration: 0.48,
      ease: 'power3.out',
    });

    // Card rises up
    gsap.to(this.card, {
      y: 0,
      opacity: 1,
      duration: 0.44,
      ease: 'power3.out',
      delay: 0.14,
    });

    // Nav links stagger in
    gsap.fromTo(
      this.menuLinks,
      { opacity: 0, x: -14 },
      {
        opacity: 1,
        x: 0,
        duration: 0.32,
        stagger: 0.04,
        ease: 'power2.out',
        delay: 0.22,
      }
    );
  }

  close() {
    if (!this.isOpen) return;

    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-label', 'Open menu');

    // Fade links
    gsap.to(this.menuLinks, { opacity: 0, duration: 0.15 });

    // Card drops
    gsap.to(this.card, {
      y: 56,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
    });

    // Collapse orange bg back to the nav bar
    gsap.to(this.menu, {
      clipPath: `inset(0px 0px ${this._navBottom()}px 0px)`,
      duration: 0.42,
      ease: 'power3.in',
      delay: 0.12,
      onComplete: () => {
        this.isOpen = false;
        this.menu.classList.remove('is-open');
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('menu-open');
        // Reset to fully hidden for next open
        gsap.set(this.menu, { clipPath: 'inset(0% 0% 100% 0%)' });
      },
    });
  }
}
