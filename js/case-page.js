// Case study page entry — smooth scroll, menu, nav theming, and the case's
// own moving parts (CaseView via CaseTransition, which also flies the
// next-project tile into the next case).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import NavTheme from './modules/NavTheme.js';
import CaseTransition from './modules/CaseTransition.js';

gsap.registerPlugin(ScrollTrigger);

const smoothScroll = new SmoothScroll();
new Menu();
new NavTheme();
new CaseTransition({ mode: 'page', smoothScroll });

document.getElementById('nav')?.classList.add('is-ready');
