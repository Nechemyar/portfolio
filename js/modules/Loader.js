import gsap from 'gsap';

export default class Loader {
  constructor(onComplete) {
    this.loader = document.getElementById('loader');
    this.mark = document.getElementById('loader-mark');
    this.onComplete = onComplete;

    this.init();
  }

  init() {
    // Lock scroll during load
    document.body.style.overflow = 'hidden';

    gsap.set(this.loader, {
      yPercent: 0,
      borderRadius: 0,
    });

    const tl = gsap.timeline({
      onComplete: () => this.dismiss(),
    });

    gsap.set(this.mark, {
      opacity: 0,
      y: 12,
      scale: 0.94,
    });

    tl
      .to(this.mark, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power3.out',
      })
      .to(this.mark, {
        scale: 1.02,
        duration: 0.55,
        ease: 'sine.inOut',
      })
      .to({}, { duration: 0.18 });
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
        y: -18,
        opacity: 0,
        scale: 0.98,
        duration: 0.35,
        ease: 'power2.in',
      }, 0)
      .to(this.loader, {
        yPercent: -115,
        borderBottomLeftRadius: '50% 12vh',
        borderBottomRightRadius: '50% 12vh',
        duration: 0.8,
        ease: 'power3.inOut',
      }, 0.05);
  }
}
