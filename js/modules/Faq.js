import gsap from 'gsap';

export default class Faq {
  constructor() {
    this.init();
  }

  init() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach((item) => {
      const summary = item.querySelector('summary');
      const answer = item.querySelector('.faq__answer');
      if (!summary || !answer) return;

      gsap.set(answer, { height: item.open ? 'auto' : 0 });
      item.classList.toggle('is-open', item.open);

      summary.addEventListener('click', (event) => {
        event.preventDefault();
        const shouldOpen = !item.open;

        if (shouldOpen) {
          items.forEach((other) => {
            if (other !== item && other.open) this.closeItem(other);
          });
          this.openItem(item);
        } else {
          this.closeItem(item);
        }
      });
    });
  }

  openItem(item) {
    const answer = item.querySelector('.faq__answer');
    if (!answer) return;

    item.open = true;
    item.classList.add('is-open');

    gsap.killTweensOf(answer);
    gsap.fromTo(answer, {
      height: 0,
    }, {
      height: answer.scrollHeight,
      duration: 0.45,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set(answer, { height: 'auto' });
      },
    });
  }

  closeItem(item) {
    const answer = item.querySelector('.faq__answer');
    if (!answer) return;

    gsap.killTweensOf(answer);
    gsap.set(answer, { height: answer.scrollHeight });
    item.classList.remove('is-open');

    gsap.to(answer, {
      height: 0,
      duration: 0.28,
      ease: 'power3.out',
      onComplete: () => {
        item.open = false;
      },
    });
  }
}
