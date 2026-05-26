import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class NavTheme {
  constructor() {
    this.sections = document.querySelectorAll('[data-nav-theme]');
    if (!this.sections.length) return;

    // Set initial
    const first = this.sections[0];
    if (first) {
      document.body.classList.add(`nav-theme-${first.dataset.navTheme}`);
    }

    this.init();
  }

  init() {
    this.sections.forEach((section) => {
      const theme = section.dataset.navTheme;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80px', // Trigger when section hits just below the nav
        onEnter: () => this.setTheme(theme),
        onEnterBack: () => this.setTheme(theme),
      });
    });
  }

  setTheme(theme) {
    document.body.classList.remove('nav-theme-dark', 'nav-theme-light');
    document.body.classList.add(`nav-theme-${theme}`);
  }
}
