import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class NavTheme {
  constructor() {
    this.sections = document.querySelectorAll('[data-nav-theme]');
    this.nav = document.getElementById('nav');
    if (!this.sections.length || !this.nav) return;

    // Set initial
    const first = this.sections[0];
    if (first) {
      this.nav.classList.add(`theme-${first.dataset.navTheme}`);
      this.nav.classList.toggle('nav--clear', !!first.closest('.intro'));
    }

    this.init();
  }

  init() {
    this.sections.forEach((section) => {
      const theme = section.dataset.navTheme;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80px', // Trigger when section hits just below the nav
        onEnter: () => this.setTheme(theme, section),
        onEnterBack: () => this.setTheme(theme, section),
      });
    });
  }

  setTheme(theme, section) {
    this.nav.classList.remove('theme-dark', 'theme-light');
    this.nav.classList.add(`theme-${theme}`);
    // No blur over the sky: the bar floats on the print.
    if (section) {
      this.nav.classList.toggle('nav--clear', !!section.closest('.intro'));
      // the band behind the bar takes the section's own colour
      if (section.dataset.bg) this.nav.style.setProperty('--nav-bg', section.dataset.bg);
      else this.nav.style.removeProperty('--nav-bg');
    }
  }
}
