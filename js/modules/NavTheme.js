import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Background-aware nav logo + menu colour.
 *
 * Each section declares a `data-nav-theme="light"` (light bg → dark text) or
 * `data-nav-theme="dark"` (dark bg → light text). A per-section ScrollTrigger
 * fires when the section crosses the nav line and swaps a body class.
 *
 * Default = dark theme (matches site bg). The body class drives CSS rules in
 * _nav.scss — single source of truth.
 */
export default class NavTheme {
  constructor() {
    this.init();
  }

  init() {
    const sections = document.querySelectorAll('[data-nav-theme]');
    if (!sections.length) return;

    this.updateBacking();
    window.addEventListener('scroll', () => this.updateBacking(), { passive: true });

    sections.forEach((section) => {
      const theme = section.dataset.navTheme;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60px',
        end: 'bottom 60px',
        onEnter: () => this.setTheme(theme, section.id),
        onLeave: () => this.setTheme('dark'),
        onEnterBack: () => this.setTheme(theme, section.id),
        onLeaveBack: () => this.setTheme('dark'),
      });
    });

    // Initial state on load — first light section above the fold wins.
    const first = sections[0];
    if (first) {
      const rect = first.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom > 60) {
        this.setTheme(first.dataset.navTheme, first.id);
      }
    }
  }

  setTheme(theme, sectionId = '') {
    document.body.classList.toggle('nav-theme-light', theme === 'light');
    document.body.dataset.navSection = sectionId;
  }

  updateBacking() {
    document.body.classList.toggle('nav-has-backing', window.scrollY > 24);
  }
}
