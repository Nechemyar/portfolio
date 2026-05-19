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

gsap.registerPlugin(ScrollTrigger);

// Boot modules during loader so content is ready
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const navTheme = new NavTheme();
const faq = new Faq();

/* Hero paints in its final state — no fade-in choreography. The previous
   entrance animated nav / marquee / gradient / footer in from offset
   positions, but the stage colour underneath those elements isn't an
   exact match for the page, so the staged fade revealed colour seams.
   Showing the hero immediately at full opacity sidesteps the issue. */
new Loader(() => {
  document.documentElement.classList.add('js-loaded');
  /* Nav entrance — flips on the wordmark fade and the hamburger
     line slide-in once the loader has cleared. */
  document.getElementById('nav')?.classList.add('is-ready');
});