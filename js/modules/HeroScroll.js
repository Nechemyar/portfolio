gsap.registerPlugin(ScrollTrigger);

export default class HeroScroll {
  constructor() {
    this.init();
  }

  init() {
    this.initTurnHeads();
    this.initCardsFan();
    this.initMarquee();
  }

  initTurnHeads() {
    const turn = document.getElementById('hero-turn');
    const heads = document.getElementById('hero-heads');
    if (!turn || !heads) return;

    // TURN slides left off-screen on scroll
    gsap.to(turn, {
      x: '-120vw',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // HEADS slides right off-screen on scroll
    gsap.to(heads, {
      x: '120vw',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
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
    const track = document.getElementById('marquee-track');
    if (!track) return;

    const items = track.querySelectorAll('.marquee__item');
    if (!items.length) return;

    // Get width of one repeated block
    const singleWidth = items[0].offsetWidth;

    // Infinite horizontal scroll
    gsap.to(track, {
      x: -(singleWidth * 2),
      ease: 'none',
      duration: 20,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          return parseFloat(x) % (singleWidth * 2);
        }),
      },
    });
  }
}