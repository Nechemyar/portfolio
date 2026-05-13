import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class HeroScroll {
  constructor() {
    this.init();
  }

  init() {
    this.initMouthSlider();
    this.initCardsFan();
    this.initMarquee();
  }

  initMouthSlider() {
    const items = document.querySelectorAll('.hero__mouth-img');
    if (items.length < 2) return;

    // Hard cut slideshow. items[0] is already opacity:1 from CSS (so it
    // can serve as the LCP element without waiting for JS). Only hide the
    // others — never touch items[0] here, to avoid a one-frame flash.
    for (let i = 1; i < items.length; i++) gsap.set(items[i], { opacity: 0 });

    let currentIndex = 0;
    setInterval(() => {
      gsap.set(items[currentIndex], { opacity: 0 });
      currentIndex = (currentIndex + 1) % items.length;
      gsap.set(items[currentIndex], { opacity: 1 });
    }, 1000); // 1-second cuts
  }

  initCardsFan() {
    const cards = document.querySelectorAll('.hero__card');
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const rotation = (i - 1) * 6;  // -6deg, 0deg, 6deg
      const xOffset = (i - 1) * 40;   // -40px, 0px, 40px

      gsap.to(card, {
        rotation: rotation,
        x: xOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero__cards',
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    });
  }

  initMarquee() {
    const stars = document.querySelectorAll('.marquee__star-img');
    // Rotate stars strictly based on scroll position
    if (stars.length) {
      gsap.to(stars, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        }
      });
    }
  }

}