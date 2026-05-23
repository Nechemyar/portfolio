/**
 * Scroll-aware nav backing.
 */
export default class NavTheme {
  constructor() {
    this.init();
  }

  init() {
    this.updateBacking();
    window.addEventListener('scroll', () => this.updateBacking(), { passive: true });
  }

  updateBacking() {
    document.body.classList.toggle('nav-has-backing', window.scrollY > 24);
  }
}
