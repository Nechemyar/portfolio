import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default class AboutReveal {
  constructor() {
    this.section = document.querySelector('.about');
    if (!this.section) return;

    this.title   = this.section.querySelector('[data-about-heading]');
    this.header  = this.section.querySelector('.about__header');
    this.bubbles = this.section.querySelectorAll('[data-bubble]');
    this.cells   = this.section.querySelectorAll('[data-bento-cell]');
    this.icons   = this.section.querySelectorAll('.about__bento-icon svg');

    if (this.title) {
      this.splitTitle = new SplitType(this.title, { types: 'lines,words' });
    }

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      this.section.querySelectorAll('[data-bubble], [data-bento-cell], .about__reaction').forEach(el => {
        gsap.set(el, { clearProps: 'all' });
      });
      if (this.icons.length) {
        this.icons.forEach(svg => {
          svg.querySelectorAll('path, circle, polyline, line').forEach(p => {
            p.style.strokeDashoffset = '0';
          });
        });
      }
    });

    this.mm.add('(prefers-reduced-motion: no-preference)', () => {
      this._titleReveal();
      this._bubbleReveal();
      this._bentoReveal();
    });
  }

  _titleReveal() {
    if (!this.title) return;
    const words = this.title.querySelectorAll('.word');
    if (!words.length) return;

    gsap.fromTo(words,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.04,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: this.header,
          start: 'top 85%',
          once: true,
        }
      }
    );
  }

  _bubbleReveal() {
    if (!this.bubbles.length) return;

    // Each bubble pops in with a spring bounce, staggered by 0.3s each
    this.bubbles.forEach((bubble, i) => {
      const isPhoto = bubble.classList.contains('about__bubble--photo');
      const reactions = bubble.querySelectorAll('.about__reaction');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.section.querySelector('.about__chat'),
          start: 'top 80%',
          once: true,
        }
      });

      // Pop: scale from 0.6 + slight upward offset, spring out
      tl.fromTo(bubble,
        { scale: 0.6, autoAlpha: 0, y: 12, transformOrigin: 'left bottom' },
        {
          scale: 1,
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: i * 0.28,
        }
      );

      // Reactions ping in after the bubble lands (only text bubbles have them)
      if (!isPhoto && reactions.length) {
        tl.fromTo(reactions,
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.07,
            ease: 'back.out(2)',
          },
          // Offset from this bubble's entry point in the timeline
          i * 0.28 + 0.38
        );
      }
    });
  }

  _bentoReveal() {
    if (!this.cells.length) return;

    gsap.fromTo(this.cells,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.section.querySelector('.about__bento'),
          start: 'top 88%',
          once: true,
        }
      }
    );

    // SVG stroke-draw
    if (this.icons.length) {
      this.icons.forEach(svg => {
        const paths = svg.querySelectorAll('path, circle, polyline, line');
        if (!paths.length) return;

        const lengths = Array.from(paths).map(p => {
          try { return p.getTotalLength(); } catch { return 60; }
        });

        paths.forEach((p, i) => {
          gsap.set(p, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] });
        });

        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: svg,
            start: 'top 90%',
            once: true,
          }
        });
      });
    }
  }
}
