import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default class AboutReveal {
  constructor() {
    this.section = document.querySelector('.about');
    if (!this.section) return;

    this.title = this.section.querySelector('[data-about-heading]');
    this.header = this.section.querySelector('.about__header');
    this.chat = this.section.querySelector('.about__chat');
    this.bento = this.section.querySelector('.about__bento');
    this.bubbles = this.section.querySelectorAll('[data-bubble]');
    this.cells = this.section.querySelectorAll('[data-bento-cell]');
    this.icons = this.section.querySelectorAll('.about__bento-icon svg');

    if (this.title) {
      this.splitTitle = new SplitType(this.title, { types: 'lines,words' });
    }

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([this.bubbles, this.cells, this.section.querySelectorAll('.about__reaction')], {
        clearProps: 'all',
      });
      this._drawIconsInstantly();
    });

    this.mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      this._desktopPinnedSequence();
    });

    this.mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      this._mobileReveal();
    });
  }

  _desktopPinnedSequence() {
    if (!this.chat || !this.bento || !this.bubbles.length) return;

    this._titleReveal(this.header, 'top 80%');
    this._bentoReveal();

    gsap.set(this.bubbles, {
      y: () => window.innerHeight * 0.7,
      autoAlpha: 0,
      scale: 0.94,
      transformOrigin: 'left bottom',
    });
    gsap.set(this.bubbles[0], {
      y: 0,
      autoAlpha: 1,
      scale: 1,
    });
    gsap.set(this.section.querySelectorAll('.about__reaction'), {
      scale: 0,
      autoAlpha: 0,
      transformOrigin: 'left center',
    });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: () => `+=${this.bubbles.length * window.innerHeight * 0.75}`,
        pin: this.section,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    this.bubbles.forEach((bubble, index) => {
      const reactions = bubble.querySelectorAll('.about__reaction');
      const at = index * 0.85;

      if (index > 0) {
        tl.to(bubble, {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.38,
          ease: 'back.out(1.4)',
        }, at);
      }

      if (reactions.length) {
        if (index === 0) {
          gsap.set(reactions, { scale: 1, autoAlpha: 1 });
        }

        tl.to(reactions, {
          scale: 1,
          autoAlpha: 1,
          duration: 0.16,
          stagger: 0.04,
          ease: 'back.out(2)',
        }, at + 0.24);
      }

      tl.to(bubble, {
        y: () => -window.innerHeight * 0.46,
        autoAlpha: 0,
        scale: 0.98,
        duration: 0.35,
      }, at + 0.78);
    });
  }

  _mobileReveal() {
    this._titleReveal(this.header, 'top 86%');

    if (this.bubbles.length) {
      gsap.fromTo(this.bubbles,
        { y: 32, autoAlpha: 0, scale: 0.96 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'back.out(1.35)',
          scrollTrigger: {
            trigger: this.chat,
            start: 'top 88%',
            once: true,
          },
        }
      );
    }

    this._bentoReveal();
  }

  _titleReveal(trigger, start) {
    if (!this.title || !trigger) return;
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
          trigger,
          start,
          once: true,
        },
      }
    );
  }

  _bentoReveal() {
    if (!this.cells.length) return;

    gsap.fromTo(this.cells,
      { y: 22, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.bento,
          start: 'top 85%',
          once: true,
        },
      }
    );

    this._drawIcons();
  }

  _drawIcons() {
    if (!this.icons.length) return;

    this.icons.forEach((svg) => {
      const paths = svg.querySelectorAll('path, circle, polyline, line');
      if (!paths.length) return;

      const lengths = Array.from(paths).map((path) => {
        try { return path.getTotalLength(); } catch { return 60; }
      });

      paths.forEach((path, index) => {
        gsap.set(path, {
          strokeDasharray: lengths[index],
          strokeDashoffset: lengths[index],
        });
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
        },
      });
    });
  }

  _drawIconsInstantly() {
    if (!this.icons.length) return;

    this.icons.forEach((svg) => {
      svg.querySelectorAll('path, circle, polyline, line').forEach((path) => {
        path.style.strokeDashoffset = '0';
      });
    });
  }
}
