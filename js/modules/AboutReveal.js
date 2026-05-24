import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default class AboutReveal {
  constructor() {
    this.section = document.querySelector('.about');
    if (!this.section) return;

    this.container = this.section.querySelector('.about__container');
    this.title = this.section.querySelector('[data-about-heading]');
    this.header = this.section.querySelector('.about__header');
    this.chat = this.section.querySelector('.about-chat');
    this.list = this.section.querySelector('.about-chat__list');
    this.chatItems = this.section.querySelectorAll('.about-chat__el');
    this.infoPanel = this.section.querySelector('.about-infos');
    this.infoRows = this.section.querySelectorAll('.about-infos__skill, .about-infos__client');
    this.links = this.section.querySelectorAll('.about-links__contact, .about-links__arrow, .about-links__block');
    this.reactions = this.section.querySelectorAll('.about-chat__emojis');

    if (this.title) {
      this.splitTitle = new SplitType(this.title, { types: 'lines,words' });
    }

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([this.list, this.chatItems, this.infoPanel, this.infoRows, this.links, this.reactions], {
        clearProps: 'all',
      });
      this._setActiveChat(1);
    });

    this.mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      this._desktopPinnedSequence();
    });

    this.mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      this._mobileReveal();
    });
  }

  _desktopPinnedSequence() {
    if (!this.list || !this.chat || !this.chatItems.length) return;

    this._titleReveal(this.header, 'top 80%');
    this._contentReveal();

    gsap.set(this.chatItems, {
      autoAlpha: 0.42,
      scale: 0.96,
      transformOrigin: '10% 50%',
    });
    gsap.set(this.chatItems[0], {
      autoAlpha: 1,
      scale: 1,
    });
    gsap.set(this.reactions, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: 'left center',
    });
    gsap.set(this.chatItems[0].querySelectorAll('.about-chat__emojis'), {
      autoAlpha: 1,
      scale: 1,
    });

    const chatDistance = () => Math.max(0, this.list.scrollHeight - this.chat.clientHeight);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: () => `+=${Math.max(window.innerHeight * 2.2, chatDistance() * 1.4)}`,
        pin: this.section,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => this._setActiveChat(self.progress),
      },
    });

    tl.to(this.list, {
      y: () => -chatDistance(),
      duration: 1,
    }, 0);

    this.chatItems.forEach((item, index) => {
      const at = this.chatItems.length <= 1 ? 0 : index / (this.chatItems.length - 1);
      const emojis = item.querySelectorAll('.about-chat__emojis');

      tl.to(item, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.12,
      }, at);

      if (emojis.length) {
        tl.to(emojis, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.08,
          ease: 'back.out(2)',
        }, Math.min(0.98, at + 0.03));
      }

      if (index > 0) {
        tl.to(this.chatItems[index - 1], {
          autoAlpha: 0.62,
          scale: 0.985,
          duration: 0.1,
        }, at);
      }
    });
  }

  _mobileReveal() {
    this._titleReveal(this.header, 'top 86%');

    if (this.chatItems.length) {
      gsap.fromTo(this.chatItems,
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

    this._contentReveal();
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

  _contentReveal() {
    const revealTargets = [this.infoPanel, ...this.infoRows, ...this.links].filter(Boolean);
    if (!revealTargets.length) return;

    gsap.fromTo(revealTargets,
      { y: 24, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.72,
        stagger: 0.055,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.infoPanel || this.container,
          start: 'top 84%',
          once: true,
        },
      }
    );
  }

  _setActiveChat(progress) {
    if (!this.chatItems.length) return;

    const activeIndex = Math.min(
      this.chatItems.length - 1,
      Math.floor(progress * this.chatItems.length)
    );

    this.chatItems.forEach((item, index) => {
      item.classList.toggle('about-chat__el--is-active', index <= activeIndex);
      item.classList.toggle('about-chat__el--is-full-active', index === activeIndex);
    });
  }
}
