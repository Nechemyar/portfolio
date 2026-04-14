gsap.registerPlugin(Draggable);

export default class Menu {
  constructor() {
    this.toggle = document.getElementById('menu-toggle');
    this.menu = document.getElementById('mobile-menu');
    this.overlay = document.getElementById('menu-overlay');
    this.grabber = document.getElementById('menu-grabber');
    this.fill = document.getElementById('grabber-fill');
    this.menuLinks = this.menu.querySelectorAll('.menu-item');
    this.menuNavLinks = this.menu.querySelectorAll('.mobile-menu__link');

    this.isOpen = false;
    this.isDragging = false;
    this.DRAG_THRESHOLD = 120;

    // Store original button width for closing animation
    this.originalBtnWidth = null;

    this.init();
  }

  init() {
    // Store the natural width after render
    requestAnimationFrame(() => {
      this.originalBtnWidth = this.toggle.offsetWidth;
    });

    this.toggle.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });

    this.overlay.addEventListener('click', () => this.close());

    this.menuNavLinks.forEach((link) => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    this.initDraggable();
  }

  initDraggable() {
    const self = this;
    const track = this.grabber.querySelector('.mobile-menu__grabber-track');

    Draggable.create(this.menu, {
      type: 'y',
      trigger: this.grabber,
      bounds: { minY: 0, maxY: 300 },
      edgeResistance: 0.75,

      onDragStart() {
        self.isDragging = true;
        gsap.killTweensOf(track);
        gsap.to(track, {
          width: 60,
          duration: 0.2,
          ease: 'power1.out',
          overwrite: true,
        });
        gsap.set(self.fill, { width: '0%' });
      },

      onDrag() {
        const y = this.y;
        gsap.set(self.menu, { y });
        if (y > 10) {
          const pct = Math.min(100, (y / 300) * 100);
          gsap.set(self.fill, { width: pct + '%' });
        }
        const opacity = Math.max(0, 1 - y / 200);
        gsap.set(self.overlay, { opacity });
      },

      onDragEnd() {
        if (this.y >= self.DRAG_THRESHOLD) {
          self.close();
        } else {
          gsap.to(self.menu, { y: 0, duration: 0.4, ease: 'power2.out' });
          gsap.to(track, {
            width: 40,
            duration: 0.5,
            ease: 'back.out(1.1)',
          });
          gsap.to(self.fill, {
            width: '0%',
            duration: 0.4,
            ease: 'power2.inOut',
          });
        }
        setTimeout(() => {
          self.isDragging = false;
        }, 100);
      },
    });
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    // Toggle visual state
    this.toggle.classList.add('is-open');
    this.toggle.setAttribute('aria-label', 'Close menu');

    // Expand green pill button
    gsap.to(this.toggle, {
      width: 160,
      duration: 0.35,
      ease: 'power2.inOut',
    });

    // Show overlay
    document.body.classList.add('menu-open');
    this.overlay.classList.add('is-active');

    // Reset menu position and fill
    gsap.set(this.menu, { y: '100%' });
    gsap.set(this.fill, { width: '0%' });

    // Slide menu up from bottom
    gsap.to(this.menu, {
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.1,
    });

    // Stagger menu items in
    gsap.fromTo(
      this.menuLinks,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.25,
      }
    );
  }

  close() {
    if (!this.isOpen) return;

    // Shrink green pill back to original size
    gsap.to(this.toggle, {
      width: this.originalBtnWidth || 'auto',
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        // Remove inline width so CSS controls it again
        gsap.set(this.toggle, { clearProps: 'width' });
      },
    });

    // Toggle visual state
    this.toggle.classList.remove('is-open');
    this.toggle.setAttribute('aria-label', 'Open menu');

    // Slide menu down
    gsap.to(this.menu, {
      y: '100%',
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        this.isOpen = false;
        document.body.classList.remove('menu-open');
        this.overlay.classList.remove('is-active');
        gsap.set(this.overlay, { opacity: '' });
      },
    });
  }
}