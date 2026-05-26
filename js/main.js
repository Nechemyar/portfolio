// ——————————————————————————————————————————————
// main.js — Hub
// ——————————————————————————————————————————————

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import ScrollReveal from './modules/ScrollReveal.js';
import HeroScroll from './modules/HeroScroll.js';
import NavTheme from './modules/NavTheme.js';
import Faq from './modules/Faq.js';
import Loader from './modules/Loader.js';
import BgScroll from './modules/BgScroll.js';
import WorkShowcase from './modules/WorkShowcase.js';
import HowItWorks from './modules/HowItWorks.js';
import AboutReveal from './modules/AboutReveal.js';

gsap.registerPlugin(ScrollTrigger);

// Boot modules during loader so content is ready
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const navTheme = new NavTheme();
const faq = new Faq();
// const bgScroll = new BgScroll();
const workShowcase = new WorkShowcase();
const howItWorks = new HowItWorks();
const aboutReveal = new AboutReveal();

/* Hero paints in its final state — no fade-in choreography. The previous
   entrance animated nav / marquee / gradient / footer in from offset
   positions, but the stage colour underneath those elements isn't an
   exact match for the page, so the staged fade revealed colour seams.
   Showing the hero immediately at full opacity sidesteps the issue. */
// Setup initial hidden states for hero elements
const wipeElements = [
  '.hero__display-word',
  '.hero__kicker-zone',
  '.hero__tv-scene',
  '.hero__award-badge',
  '.hero__cta-row',
  '.nav__logo',
  '.nav__cta--right',
  '.nav__desktop-wrapper'
];
gsap.set(wipeElements, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 });

new Loader(() => {
  document.documentElement.classList.add('js-loaded');
  document.getElementById('nav')?.classList.add('is-ready');
  document.dispatchEvent(new CustomEvent('hero:ready'));
  
  // Hero Entrance Sequence
  const tl = gsap.timeline();
  
  // 1. DESIGN word wipes up
  tl.to('.hero__display-word', {
    clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
    y: 0,
    duration: 1.4,
    ease: 'expo.out'
  });
  
  // 2. Award, CTA, and TV Cat wipe up
  tl.to(['.hero__tv-scene', '.hero__award-badge', '.hero__cta-row'], {
    clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
    y: 0,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1
  }, '-=1.0');

  // 3. Nav elements wipe up
  tl.to(['.nav__logo', '.nav__cta--right', '.nav__desktop-wrapper'], {
    clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
    y: 0,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1
  }, '-=1.1');

  // 4. Kicker ("We are Sumi Studios") wipes up last
  tl.to('.hero__kicker-zone', {
    clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
    y: 0,
    duration: 1.2,
    ease: 'expo.out'
  }, '-=1.0');
});
