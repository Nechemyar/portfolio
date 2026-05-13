import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader = document.getElementById('loader');
    this.text = document.getElementById('loader-text');
    this.mark = document.getElementById('loader-mark');
    this.onComplete = onComplete;

    this.init();
  }

  init() {
    // Lock scroll during load
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => this.dismiss(),
    });

    gsap.set(this.mark, {
      opacity: 0,
      y: 18,
      rotationY: -24,
      rotationZ: -1.5,
      scale: 0.94,
      transformPerspective: 900,
    });

    gsap.set(this.text?.querySelectorAll('span'), {
      opacity: 0,
      y: 8,
    });

    tl
      .to(this.mark, {
        opacity: 1,
        y: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        filter: 'grayscale(0) saturate(1) contrast(1)',
        duration: 1.05,
        ease: 'power3.out',
      })
      .to(this.text, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      }, '-=0.55')
      .to(this.text.querySelectorAll('span'), {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.045,
        ease: 'power2.out',
      }, '-=0.48')
      .to(this.mark, {
        rotationY: 7,
        rotationZ: 0.6,
        scale: 1.015,
        duration: 0.72,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut',
      }, '-=0.2')
      .to({}, { duration: 0.25 });
  }

  dismiss() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.loader.style.display = 'none';
        document.body.style.overflow = '';
        if (this.onComplete) this.onComplete();
      },
    });

    tl
      .to(this.mark, {
        y: -14,
        scale: 0.985,
        duration: 0.45,
        ease: 'power2.inOut',
      }, 0)
      .to(this.loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
      }, 0.08);
  }
}
