export default class Faq {
  constructor() {
    this.init();
  }

  init() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    // Close other items when one opens (accordion behavior).
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  }
}
