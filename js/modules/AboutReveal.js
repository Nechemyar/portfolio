import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default class AboutReveal {
  constructor() {
    this.section = document.querySelector('.about');
    if (!this.section) return;

    this.photo = this.section.querySelector('.about__photo');
    this.img = this.section.querySelector('.about__photo-wrapper img');
    this.copy = this.section.querySelector('.about__copy');
    this.label = this.section.querySelector('.about__label');
    this.title = this.section.querySelector('[data-about-heading]');

    if (!this.title) return;

    // Split heading using SplitType
    this.splitHeading = new SplitType(this.title, { types: 'lines,words' });

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    // 1. Reduced Motion Match: immediately visible, no transitions/transforms
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      if (this.img) gsap.set(this.img, { clearProps: 'all' });
      if (this.photo) gsap.set(this.photo, { clearProps: 'all' });
      if (this.copy) gsap.set(this.copy, { clearProps: 'all' });
      if (this.label) gsap.set(this.label, { clearProps: 'all' });
      
      const words = this.title.querySelectorAll('.word');
      if (words.length) gsap.set(words, { clearProps: 'all' });
    });

    // 2. Desktop Match: Pinned layout features, photo parallax, word staggered reveals
    this.mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      // Photo Parallax (scrubbed through section scrolling)
      if (this.img) {
        gsap.fromTo(this.img,
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
              trigger: this.section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }

      // Title word stagger reveal
      const words = this.title.querySelectorAll('.word');
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 105, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.035,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: this.title,
              start: 'top 85%',
              once: true,
            }
          }
        );
      }

      // Copy card and tag list staggered fade/slide up
      if (this.copy) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: this.copy,
            start: 'top 85%',
            once: true,
          }
        });

        // Reveal label first
        if (this.label) {
          tl.fromTo(this.label,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power3.out' }
          );
        }

        // Slide/fade copy card in
        tl.fromTo(this.copy,
          { y: 44, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.45'
        );
      }
    });

    // 3. Mobile Match: Natural stack, simplified reveals to ensure no layout jumps
    this.mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      // Mobile title reveal
      const words = this.title.querySelectorAll('.word');
      if (words.length) {
        gsap.fromTo(words,
          { yPercent: 100, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.02,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.title,
              start: 'top 88%',
              once: true,
            }
          }
        );
      }

      // Mobile photo reveal
      if (this.photo) {
        gsap.fromTo(this.photo,
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.photo,
              start: 'top 88%',
              once: true,
            }
          }
        );
      }

      // Mobile copy card reveal
      if (this.copy) {
        gsap.fromTo(this.copy,
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.copy,
              start: 'top 88%',
              once: true,
            }
          }
        );
      }
    });
  }
}
