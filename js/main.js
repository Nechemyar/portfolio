// ——————————————————————————————————————————————
// main.js — Hub
// ——————————————————————————————————————————————

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import ScrollReveal from './modules/ScrollReveal.js';
import HeroScroll from './modules/HeroScroll.js';
import NavTheme from './modules/NavTheme.js';
import Faq from './modules/Faq.js';
import Loader from './modules/Loader.js';
import WorkSection from './modules/WorkSection.js';
import ArchSlider from './modules/ArchSlider.js';
import BlurQuality from './modules/BlurQuality.js';
import HeroReel from './modules/HeroReel.js';
import SumiGlass from './modules/SumiGlass.js';
import TrustPanel from './modules/TrustPanel.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Boot modules
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const navTheme = new NavTheme();
const faq = new Faq();
const workSection = new WorkSection();
new ArchSlider();
new BlurQuality();
new HeroReel();
const sumiGlass = new SumiGlass();
new TrustPanel();

// Hidden start states for the elements the hero entrance wipes in
const wipeElements = [
  '.hero__line',
  '.hero__base-right',
  '.nav__cta--right',
  '.nav__desktop-wrapper'
];
gsap.set(wipeElements, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 });
/* .nav__logo is NOT wiped in — the loader's SUMI wordmark morphs directly
   onto it, so it must sit stationary at its resting position for a seamless
   handoff when the loader fades out. */

new Loader(() => {
  // Split the title once the loader is done, so fonts are loaded and the
  // line breaks are final. Each line gets an overflow mask; the words rise
  // inside it (transform only, so it stays on the compositor).
  const title = document.querySelector('.hero__title');
  const split = title
    ? SplitText.create(title, { type: 'lines, words', mask: 'lines', linesClass: 'hero__title-line' })
    : null;
  if (split) {
    gsap.set(split.words, { yPercent: 115, willChange: 'transform' });
    gsap.set(title, { visibility: 'visible' });
  }

  document.documentElement.classList.add('js-loaded');
  document.getElementById('nav')?.classList.add('is-ready');
  document.dispatchEvent(new CustomEvent('hero:ready'));

  // Hero entrance. The frame builds first (nav, then the bottom row) and the
  // title lands last, so the eye finishes on the one thing that matters.
  const wipeIn = 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)';
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // 1. Nav wipes up (logo excluded — it was handed off from the loader)
  tl.addLabel('frame', 0)
    .to(['.nav__cta--right', '.nav__desktop-wrapper'], {
      clipPath: wipeIn,
      y: 0,
      duration: 1.2,
      stagger: 0.1
    }, 'frame');

  // 2. Bottom row wipes up, mirroring the nav
  tl.to(['.hero__line', '.hero__base-right'], {
    clipPath: wipeIn,
    y: 0,
    duration: 1.2,
    stagger: 0.1
  }, 'frame+=0.15');

  // 3. Title last: words rise through their line masks, slow and soft
  tl.addLabel('title', 'frame+=0.55');
  if (split) {
    tl.to(split.words, {
      yPercent: 0,
      duration: 1.8,
      stagger: { each: 0.08 },
      onComplete: () => split.revert()
    }, 'title');
  }

  // 4. The CTA comes last, once the title has landed AND its glass is fully
  //    built, so it never shows as frost and then switches to glass.
  //    (.hero__cta starts hidden in CSS so nothing shows before this.)
  const slotted = document.querySelectorAll('.hero__cta-slot > *');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slotted.length) {
    gsap.set(slotted, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40, visibility: 'visible' });
    // clearProps: once in, drop the clip so the glass shadow isn't cut square at its sides
    const ctaIn = () => gsap.to(slotted, { clipPath: wipeIn, y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'clipPath' });
    const glassReady = Promise.race([sumiGlass.ready, new Promise((r) => setTimeout(r, 2500))]);
    if (reduced) {
      glassReady.then(() => gsap.set(slotted, { clipPath: 'none', y: 0 }));
    } else {
      tl.call(() => glassReady.then(ctaIn), null, 'title+=1.4');
    }
  }

  if (reduced) {
    tl.progress(1);
  }
});
