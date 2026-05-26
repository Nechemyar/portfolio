import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader   = document.getElementById('loader');
    this.wLeft    = document.getElementById('loader-wordmark-left');
    this.wRight   = document.getElementById('loader-wordmark-right');
    this.stacked  = document.getElementById('loader-stacked');
    this.onComplete = onComplete;

    this.init();
  }

  init() {
    document.body.style.overflow = 'hidden';

    gsap.set([this.wLeft, this.wRight, this.stacked], { yPercent: 100 });

    gsap.timeline()
      // Step 1 — left + right wordmarks slide up into their masks
      .to([this.wLeft, this.wRight], {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
      })
      // Step 2 — center stacked logo follows 0.15s later
      .to(this.stacked, {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
      }, '<0.15')
      // Step 3 — wordmarks disappear bottom-up out of their masks
      .to([this.wLeft, this.wRight], {
        yPercent: -100,
        duration: 0.7,
        ease: 'power3.inOut',
      })
      // Step 4 — hold center logo on screen
      .to({}, { duration: 1 })
      // Step 5 — entire loader sweeps off the top
      .to(this.loader, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          this.loader.style.display = 'none';
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        },
      });
  }
}
