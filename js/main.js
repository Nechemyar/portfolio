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
import WorkClips from './modules/WorkClips.js';
import ArchSlider from './modules/ArchSlider.js';
import BlurQuality from './modules/BlurQuality.js';
import HeroReel from './modules/HeroReel.js';
import SumiGlass from './modules/SumiGlass.js';
import TrustPanel from './modules/TrustPanel.js';
import InkSky from './modules/InkSky.js';
import InkStory from './modules/InkStory.js';
import CaseTransition from './modules/CaseTransition.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Boot modules
const smoothScroll = new SmoothScroll();
const menu = new Menu();
const scrollReveal = new ScrollReveal();
const heroScroll = new HeroScroll();
const navTheme = new NavTheme();
const faq = new Faq();
const workSection = new WorkSection();
new WorkClips();
new ArchSlider();
new BlurQuality();
new HeroReel();
const inkSky = new InkSky();
const inkStory = new InkStory(inkSky);
const sumiGlass = new SumiGlass(inkSky);
new TrustPanel();
new CaseTransition({ mode: 'home', smoothScroll });

// Hidden start states for the elements the hero entrance wipes in
const wipeElements = [
  '.hero__sub',
  '.nav__cta--right',
  '.nav__desktop-wrapper'
];
gsap.set(wipeElements, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 });
// The reel card comes in last; its first frame is already painted, so it is
// hidden only by a clip until its turn (no see-through state)
const reelWindow = document.querySelector('.reel__window');
if (reelWindow) gsap.set(reelWindow, { clipPath: 'inset(100% 0% 0% 0%)', y: 60, scale: 0.96, transformOrigin: '50% 100%' });
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

  // Hero entrance. The sky prints in block by block and the nav builds while
  // it does; the title lands last, so the eye finishes on the one thing that
  // matters.
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

  // 2. The sky prints in: sun, far clouds, near clouds (InkStory.printIn)
  tl.call(() => inkStory.printIn?.(), null, 'frame');

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

  // The subheading follows the title up, before the CTA
  tl.to('.hero__sub', { clipPath: wipeIn, y: 0, duration: 1.2 }, 'title+=0.7');

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

  // 5. The reel last, as the button settles: it rises out of the sky and opens
  //    out, and the video starts from its first frame as it does (HeroReel).
  //    Scrolling before then brings it straight in.
  if (reelWindow) {
    const reelIn = () => {
      if (reelWindow.dataset.in) return;
      reelWindow.dataset.in = '1';
      document.dispatchEvent(new CustomEvent('reel:in'));
      gsap.to(reelWindow, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, scale: 1, duration: 1.2, ease: 'expo.out', clearProps: 'clipPath,transform' });
    };
    if (reduced) {
      gsap.set(reelWindow, { clearProps: 'clipPath,transform' });
      reelWindow.dataset.in = '1';
      document.dispatchEvent(new CustomEvent('reel:in'));
    } else {
      tl.call(reelIn, null, 'title+=1.55');
      window.addEventListener('scroll', reelIn, { once: true, passive: true });
    }
  }

  if (reduced) {
    tl.progress(1);
  }
});

// Restored from the browser's cache after a case study's All work: nothing
// loaded, so the skip-the-loader note isn't needed any more.
window.addEventListener('pageshow', (e) => {
  if (!e.persisted) return;
  try { sessionStorage.removeItem('sumi:skip-loader'); } catch (err) { /* private mode */ }
});
