const PROJECTS = [
  { label: '01 / 03', href: 'projects/choice-inventory.html' },
  { label: '02 / 03', href: 'projects/clinical-assessments.html' },
  { label: '03 / 03', href: '#' },
];

export default class MagicReel {
  constructor() {
    this.slides  = document.querySelectorAll('.work__slide');
    if (!this.slides.length) return;

    this.counter = document.querySelector('.work__counter');
    this.link    = document.querySelector('.work__link');
    this.currentIndex = 0;
    this.intervalTime = 2000;

    this.init();
  }

  init() {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === 0);
    });
    this._updateUI();
    this.startReel();
  }

  startReel() {
    setInterval(() => {
      this.slides[this.currentIndex].classList.remove('is-active');
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      this.slides[this.currentIndex].classList.add('is-active');
      this._updateUI();
    }, this.intervalTime);
  }

  _updateUI() {
    const p = PROJECTS[this.currentIndex];
    if (this.counter) this.counter.textContent = p.label;
    if (this.link)    this.link.href = p.href;
  }
}
