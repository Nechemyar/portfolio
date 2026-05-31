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
import WorkSection from './modules/WorkSection.js';
import ArchSlider from './modules/ArchSlider.js';

gsap.registerPlugin(ScrollTrigger);

// Boot modules
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const navTheme = new NavTheme();
const faq = new Faq();
const workSection = new WorkSection();
new ArchSlider();

/* Hero paints in its final state — no fade-in choreography. The previous
   entrance animated nav / marquee / gradient / footer in from offset
   positions, but the stage colour underneath those elements isn't an
   exact match for the page, so the staged fade revealed colour seams.
   Showing the hero immediately at full opacity sidesteps the issue. */
// Setup initial hidden states for hero elements
const wipeElements = [
  '.hero__display-word',
  '.hero__tv-scene',
  '.hero__award-badge',
  '.nav__logo',
  '.nav__cta--right',
  '.nav__desktop-wrapper'
];
gsap.set(wipeElements, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 });

// Split text utility to dynamically wrap lines for animation based on screen size
function splitLines(element) {
  const words = element.textContent.trim().split(/\s+/);
  element.innerHTML = '';
  
  // Wrap words in standard inline spans with native text spaces between them
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    element.appendChild(span);
    if (i < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  const lines = [];
  let currentLine = [];
  let currentTop = null;

  const spans = Array.from(element.querySelectorAll('span'));
  spans.forEach(span => {
    const top = span.getBoundingClientRect().top;
    if (currentTop === null || top > currentTop + 10) {
      if (currentLine.length) lines.push(currentLine);
      currentTop = top;
      currentLine = [];
    }
    currentLine.push(span.textContent);
  });
  if (currentLine.length) lines.push(currentLine);

  element.innerHTML = '';
  lines.forEach(lineWords => {
    const lineWrapper = document.createElement('span');
    lineWrapper.className = 'hero__pitch-line';
    lineWrapper.style.display = 'block';
    lineWrapper.textContent = lineWords.join(' ');
    element.appendChild(lineWrapper);
  });
}

new Loader(() => {
  // Split lines exactly when Loader finishes, so fonts are 100% loaded and metrics are exact.
  const splitHeading = document.querySelector('.js-split-lines');
  if (splitHeading) {
    splitHeading.dataset.originalText = splitHeading.textContent.trim().replace(/\s+/g, ' ');
    splitLines(splitHeading);
    gsap.set('.hero__pitch-line', { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', y: 50 });
    gsap.set(splitHeading, { visibility: 'visible' });
  }

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
  
  // 2. Award and TV Cat wipe up
  tl.to(['.hero__tv-scene', '.hero__award-badge'], {
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

  // 4. Paragraph reveals line by line, CTA wipes up after
  gsap.set('.hero__pitch-cta', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 });
  tl.to('.hero__pitch-line', {
    clipPath: 'polygon(0% -20%, 100% -20%, 100% 120%, 0% 120%)',
    y: 0,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.1,
    onComplete: () => {
      if (splitHeading) {
        splitHeading.innerHTML = splitHeading.dataset.originalText;
      }
    }
  }, '-=0.8');
  tl.to('.hero__pitch-cta', {
    clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)',
    y: 0,
    duration: 1.0,
    ease: 'expo.out'
  }, '-=0.5');
});
