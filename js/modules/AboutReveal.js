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
    this.typingIndicator = this.section.querySelector('.about-chat__typing');
    this.hasStartedTypingSequence = false;
    this.userScrolledChat = false;

    if (this.title) {
      this.splitTitle = new SplitType(this.title, { types: 'lines,words' });
    }

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([this.list, this.chatItems, this.infoPanel, this.infoRows, this.links, this.reactions, this.typingIndicator], {
        clearProps: 'all',
      });
      this.chatItems.forEach((item) => item.classList.add('about-chat__el--is-revealed'));
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
    this._prepareChatSequence();
    this._bindTypingSequence('top 72%');
    this._trackChatScrollIntent();

    gsap.set(this.chatItems, {
      autoAlpha: 0,
      y: 24,
      scale: 0.92,
      transformOrigin: '10% 50%',
    });
    gsap.set(this.reactions, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: 'left center',
    });

    const chatDistance = () => Math.max(0, this.chat.scrollHeight - this.chat.clientHeight);

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
        onUpdate: (self) => {
          this._setActiveChat(self.progress);
          if (!this.userScrolledChat && !this.hasStartedTypingSequence) {
            this.chat.scrollTo({ top: chatDistance() * self.progress, behavior: 'auto' });
          }
        },
      },
    });

    tl.to({}, {
      duration: 1,
    }, 0);
  }

  _mobileReveal() {
    this._titleReveal(this.header, 'top 86%');

    this._prepareChatSequence();
    this._bindTypingSequence('top 82%');
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

  _prepareChatSequence() {
    if (!this.chatItems.length) return;

    this.chat?.classList.remove('about-chat--is-typing');
    this.chatItems.forEach((item) => {
      item.classList.remove(
        'about-chat__el--is-revealed',
        'about-chat__el--is-active',
        'about-chat__el--is-full-active'
      );
    });

    gsap.set(this.chatItems, {
      y: 24,
      autoAlpha: 0,
      scale: 0.92,
      transformOrigin: '10% 50%',
    });
    gsap.set(this.reactions, {
      autoAlpha: 0,
      scale: 0,
      transformOrigin: 'left center',
    });
  }

  _bindTypingSequence(start) {
    if (!this.chat || !this.chatItems.length) return;

    ScrollTrigger.create({
      trigger: this.chat,
      start,
      once: true,
      onEnter: () => this._runTypingSequence(),
    });
  }

  _runTypingSequence() {
    if (this.hasStartedTypingSequence || !this.chatItems.length) return;
    this.hasStartedTypingSequence = true;

    const sequence = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        this.chat?.classList.remove('about-chat--is-typing');
      },
    });

    this.chatItems.forEach((item, index) => {
      const emojis = item.querySelectorAll('.about-chat__emojis');

      sequence.call(() => {
        this.chat?.classList.add('about-chat--is-typing');
        this._setActiveChatByIndex(index);
        this._scrollChatToItem(item);
      });

      sequence.to(this.typingIndicator, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.16,
      }, '<');

      sequence.to(item, {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.42,
        ease: 'back.out(1.35)',
        onStart: () => item.classList.add('about-chat__el--is-revealed'),
      }, '+=0.42');

      if (emojis.length) {
        sequence.to(emojis, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.18,
          ease: 'back.out(2)',
        }, '-=0.12');
      }

      sequence.to(this.typingIndicator, {
        autoAlpha: index === this.chatItems.length - 1 ? 0 : 1,
        duration: 0.08,
      }, '+=0.03');
    });
  }

  _scrollChatToItem(item) {
    if (!this.chat || !item) return;
    const chatDistance = Math.max(0, this.chat.scrollHeight - this.chat.clientHeight);
    if (!chatDistance) return;

    const target = Math.max(0, item.offsetTop - this.chat.clientHeight * 0.46);
    this.chat.scrollTo({
      top: Math.min(chatDistance, target),
      behavior: 'smooth',
    });
  }

  _trackChatScrollIntent() {
    if (!this.chat) return;

    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((eventName) => {
      this.chat.addEventListener(eventName, () => {
        this.userScrolledChat = true;
      }, { passive: true });
    });
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

  _setActiveChatByIndex(activeIndex) {
    this.chatItems.forEach((item, index) => {
      item.classList.toggle('about-chat__el--is-active', index <= activeIndex);
      item.classList.toggle('about-chat__el--is-full-active', index === activeIndex);
    });
  }
}
