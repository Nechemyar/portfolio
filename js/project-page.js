// Project sub-page entry — smooth scroll, mobile menu, nav theming.
import SmoothScroll from './modules/SmoothScroll.js';
import Menu from './modules/Menu.js';
import NavTheme from './modules/NavTheme.js';
import BlurQuality from './modules/BlurQuality.js';

new SmoothScroll();
new Menu();
new NavTheme();
new BlurQuality();

document.getElementById('nav')?.classList.add('is-ready');
