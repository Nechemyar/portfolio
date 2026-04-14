import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export default class SmoothScroll {
  constructor() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Sync Lenis scroll position with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for the Lenis RAF loop (smoother than raw rAF)
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Hijack anchor links for smooth scrolling via Lenis
    this.initAnchorLinks();
  }

  initAnchorLinks() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          this.lenis.scrollTo(targetId, {
            offset: -100, // Offset for fixed nav header
            duration: 1.2
          });
        }
      });
    });
  }

  stop() {
    this.lenis.stop();
  }

  start() {
    this.lenis.start();
  }

  destroy() {
    this.lenis.destroy();
  }
}