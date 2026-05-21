import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export default class ScrollReveal {
  constructor() {
    this.init();
  }

  init() {
    const reveals = document.querySelectorAll('[data-reveal]');

    // Hero entrance timeline
    const tl = gsap.timeline({ delay: 0.2 });
    
    const kicker = document.querySelector('.hero__kicker');
    const lines = document.querySelectorAll('.hero__pitch-line');
    const workCard = document.querySelector('.hero__work-card');
    const helloCard = document.querySelector('.hero__hello-card');
    
    if (kicker) {
      gsap.fromTo(kicker, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    if (lines.length) {
      gsap.fromTo(lines, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out'
        },
        "-=0.6"
      );
    }
    
    if (workCard) {
      gsap.fromTo(workCard, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' },
        "-=0.8"
      );
    }

    if (helloCard) {
      gsap.fromTo(helloCard, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.9"
      );
    }

    // Everything else: reveal on scroll
    if (reveals.length) {
      reveals.forEach((el) => {
        const isHero = el.closest('.hero');
        if (isHero) return;

        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });
    }
  }
}