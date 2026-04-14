// ——————————————————————————————————————————————
// main.js — Hub
//
// CDN globals: gsap, ScrollTrigger, Draggable, Lenis
// ——————————————————————————————————————————————

import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import ScrollReveal from './modules/ScrollReveal.js';
import HeroScroll from './modules/HeroScroll.js';

// ——————————————————————————————————————————————
// SAFETY CHECK
// ——————————————————————————————————————————————
if (typeof gsap === 'undefined') {
  console.error('GSAP not loaded. Check CDN script tags.');
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Signal to CSS that JS is working (enables reveal animations)
  document.documentElement.classList.add('js-loaded');

  // ——————————————————————————————————————————
  // GLOBAL MODULES (persist across everything)
  // ——————————————————————————————————————————
  const smoothScroll = new SmoothScroll();
  const menu = new Menu();

  // ——————————————————————————————————————————
  // PAGE MODULES
  // ——————————————————————————————————————————
  const scrollReveal = new ScrollReveal();
  const heroScroll = new HeroScroll();
}