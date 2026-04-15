import gsap from 'gsap';

export default class Menu {
  constructor() {
    this.toggle = document.getElementById('menu-toggle');
    this.menu = document.getElementById('mobile-menu');
    this.overlay = document.getElementById('menu-overlay');
    this.closeBtn = document.getElementById('mobile-menu-close');
    this.menuLinks = this.menu.querySelectorAll('.menu-item');
    this.isOpen = false;

    this.init();
  }

  init() {
    this.toggle.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    this.overlay.addEventListener('click', () => this.close());
    this.closeBtn.addEventListener('click', () => this.close());

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

    // Make visible, then animate in
    this.menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    this.overlay.classList.add('is-active');

    gsap.fromTo(this.menu,
      { y: '100%' },
      { y: 0, duration: 0.5, ease: 'power3.out' }
    );

    gsap.to(this.overlay, { opacity: 1, duration: 0.3 });

    gsap.fromTo(
      this.menuLinks,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2,
      }
    );
  }

  close() {
    if (!this.isOpen) return;

    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-label', 'Open menu');

    gsap.to(this.menuLinks, { opacity: 0, y: -10, duration: 0.2 });

    gsap.to(this.menu, {
      y: '100%',
      duration: 0.4,
      ease: 'power3.in',
      delay: 0.1,
      onComplete: () => {
        this.isOpen = false;
        this.menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        this.overlay.classList.remove('is-active');
        gsap.set(this.overlay, { opacity: 0 });
      },
    });
  }
}