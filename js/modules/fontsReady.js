// Resolves once Satoshi is actually usable, so nothing is measured or shown
// in the fallback font. The Fontshare stylesheet loads async (media="print"
// swap), and until it lands document.fonts knows nothing about Satoshi, so
// wait for the sheet first, then for the weights the first screen uses.
// Capped, so a blocked CDN never traps the visitor behind the loader.
const WEIGHTS = [400, 500, 700, 900];

export default function fontsReady(timeout = 4000) {
  if (!document.fonts) return Promise.resolve();
  const link = document.getElementById('satoshi-css');
  const sheet = new Promise((res) => {
    if (!link || link.media === 'all') return res();
    link.addEventListener('load', () => res(), { once: true });
    link.addEventListener('error', () => res(), { once: true });
  });
  const fonts = sheet
    .then(() => Promise.all(WEIGHTS.map((w) => document.fonts.load(`${w} 1em Satoshi`))))
    .then(() => document.fonts.ready)
    .catch(() => {});
  return Promise.race([fonts, new Promise((res) => setTimeout(res, timeout))]);
}
