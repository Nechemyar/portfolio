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
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80px', // Trigger when section hits just below the nav
        end: 'bottom 80px',
        onToggle: () => this.update(),
      });
    });
  }

  // Sections can sit inside each other (a case page's colour pictures sit
  // inside its white sheet), so the theme comes from the innermost one under
  // the bar, checked whenever any of them crosses it.
  update() {
    let hit = null;
    this.sections.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top <= 80 && r.bottom > 80) hit = s;
    });
    if (hit) this.setTheme(hit.dataset.navTheme, hit);
  }

  setTheme(theme, section) {
    this.nav.classList.remove('theme-dark', 'theme-light');
    this.nav.classList.add(`theme-${theme}`);
    // No blur over the sky: the bar floats on the print.
    if (section) {
      this.nav.classList.toggle('nav--clear', !!section.closest('.intro'));
    }
  }
}
