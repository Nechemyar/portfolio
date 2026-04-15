// ——————————————————————————————————————————————
// main.js — Hub
// ——————————————————————————————————————————————

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import ScrollReveal from './modules/ScrollReveal.js';
import HeroScroll from './modules/HeroScroll.js';
import WorkHover from './modules/WorkHover.js';
import Loader from './modules/Loader.js';

gsap.registerPlugin(ScrollTrigger);

// Hide hero elements until loader finishes
gsap.set('.nav', { autoAlpha: 0, y: -30 });
gsap.set('.marquee', { autoAlpha: 0, y: 60 });
gsap.set('.hero__footer', { autoAlpha: 0, y: 40 });
gsap.set('.hero__gradient', { autoAlpha: 0 });
gsap.set('.sticky-cta', { autoAlpha: 0, x: 100 }); // Hide CTA before anything renders

// Boot modules NOW (during loader) so content is ready
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const workHover = new WorkHover();

// Boot the loader, then reveal the hero
new Loader(() => {
  document.documentElement.classList.add('js-loaded');

  // ——— Awwwards-level entrance choreography ———
  const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Nav slides down from above
  entrance.to('.nav', {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
  });

  // Marquee text rises from below
  entrance.to('.marquee', {
    autoAlpha: 1,
    y: 0,
    duration: 1,
  }, '-=0.5');

  // Bottom gradient fades in
  entrance.to('.hero__gradient', {
    autoAlpha: 1,
    duration: 0.8,
  }, '-=0.6');

  // Footer bar rises in
  entrance.to('.hero__footer', {
    autoAlpha: 1,
    y: 0,
    duration: 0.8,
  }, '-=0.6');
});