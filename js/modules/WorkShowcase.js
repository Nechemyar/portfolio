import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class WorkShowcase {
  constructor() {
    this.wrap = document.querySelector('[data-work-showcase]');
    if (!this.wrap) return;

    this.cards = gsap.utils.toArray('[data-work-card]', this.wrap);
    if (!this.cards.length) return;

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(this.cards, { clearProps: 'all' });
      gsap.set(this.cards.map((card) => card.querySelector('.work-showcase__card-img img')), {
        clearProps: 'all',
      });
    });

    this.mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      this.cards.forEach((card, index) => {
        const image = card.querySelector('.work-showcase__card-img img');
        const copy = card.querySelector('.work-showcase__card-copy');
        const isLast = index === this.cards.length - 1;

        gsap.set(card, {
          zIndex: index + 1,
        });

        gsap.set(image, { scale: 0.95 });
        gsap.set(copy, { y: 24 });

        const timeline = gsap.timeline({ paused: true });

        timeline
          .to(image, {
            scale: 1,
            duration: 0.22,
            ease: 'none',
          })
          .to(copy, {
            y: 0,
            duration: 0.18,
            ease: 'none',
          }, 0.06);

        if (!isLast) {
          timeline.to(card, {
            y: -72,
            autoAlpha: 0.78,
            duration: 0.2,
            ease: 'none',
          }, 0.82);
        }

        ScrollTrigger.create({
          animation: timeline,
          trigger: card,
          start: 'center center',
          end: '+=120%',
          scrub: true,
          pin: true,
          pinType: 'transform',
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });
    });

    this.mm.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(this.cards, { clearProps: 'all' });

      this.cards.forEach((card) => {
        gsap.fromTo(card, {
          y: 40,
          autoAlpha: 0,
        }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        });
      });
    });
  }
}
