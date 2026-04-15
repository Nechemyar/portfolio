import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader = document.getElementById('loader');
    this.text = document.getElementById('loader-text');
    this.fill = document.getElementById('loader-fill');
    this.onComplete = onComplete;

    this.init();
  }

  init() {
    // Lock scroll during load
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => this.dismiss(),
    });

    // 1. Fade in the name
    tl.to(this.text, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    });

    // 2. Fill the progress bar
    tl.to(this.fill, {
      width: '100%',
      duration: 1.8,
      ease: 'power1.inOut',
    }, '+=0.2');

    // 3. Brief hold
    tl.to({}, { duration: 0.3 });
  }

  dismiss() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.loader.style.display = 'none';
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      },
    });

    // Fade out loader
    tl.to(this.loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }
}
