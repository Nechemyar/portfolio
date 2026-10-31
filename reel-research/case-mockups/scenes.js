const T = {
  choice: { bg: '#f08a24', light: 'radial-gradient(120% 90% at 18% 8%, rgba(255,230,190,.35), transparent 55%), radial-gradient(90% 80% at 95% 100%, rgba(120,40,0,.16), transparent 60%)',
    shadow: 'drop-shadow(3px 4px 3px rgba(80,30,0,.35)) drop-shadow(34px 44px 26px rgba(90,30,0,.30))', host: 'choiceinventory.co.uk' },
  clinical: { bg: '#f3f1ec', grain: .22, light: 'radial-gradient(120% 90% at 18% 8%, rgba(255,255,255,.6), transparent 55%), radial-gradient(90% 80% at 95% 100%, rgba(60,50,30,.08), transparent 60%)',
    shadow: 'drop-shadow(3px 4px 3px rgba(40,30,20,.22)) drop-shadow(34px 44px 30px rgba(40,30,20,.18))', host: 'clinicalassessments.co.uk' },
  jsense: { bg: '#8b3468', light: 'radial-gradient(120% 90% at 18% 8%, rgba(255,200,230,.22), transparent 55%), radial-gradient(90% 80% at 95% 100%, rgba(40,0,25,.25), transparent 60%)',
    shadow: 'drop-shadow(3px 4px 3px rgba(30,0,20,.4)) drop-shadow(34px 44px 26px rgba(30,0,20,.32))', host: 'jsense.org.uk' },
};
const SB = { 'choice-about': '#574d54', 'choice-home': '#343231', 'choice-home2': '#ffffff', 'choice-pricing': '#606061', 'choice-services': '#717273',
  'clinical-adhd': '#ffffff', 'clinical-home': '#ffffff', 'clinical-home2': '#ffffff', 'clinical-process': '#ffffff', 'clinical-services': '#ffffff',
  'jsense-about': '#a13e78', 'jsense-advocacy': '#a13e78', 'jsense-home': '#a13e78', 'jsense-home2': '#a13e78', 'jsense-services': '#a13e78' };
const P = (k, page, w, x, y, r, z) => ({ page: `${k}-${page}`, sb: SB[`${k}-${page}`], host: T[k].host, w, x, y, r, z });
const S = {};
const pages = { choice: ['home', 'pricing', 'services', 'about', 'home2'], clinical: ['home', 'process', 'adhd', 'services', 'home2'], jsense: ['home', 'advocacy', 'services', 'about', 'home2'] };
for (const k of Object.keys(T)) {
  const [a, b, c, d, e] = pages[k];
  const base = { bg: T[k].bg, light: T[k].light, shadow: T[k].shadow, grain: T[k].grain };
  // 01: one phone, lying a little askew
  S[`${k}-01`] = { ...base, phones: [P(k, a, 560, 330, 170, -7)] };
  // 02: two phones fanned, the right one lower and on top
  S[`${k}-02`] = { ...base, phones: [P(k, b, 470, 110, 150, -9, 1), P(k, c, 470, 620, 330, 6, 2)] };
  // 03: in close, the page running off the frame
  S[`${k}-03`] = { ...base, phones: [P(k, e, 1000, -90, 230, -10)] };
  // 04: three pages in a loose cascade
  S[`${k}-04`] = { ...base, phones: [P(k, d, 370, 70, 110, -6, 1), P(k, a, 370, 410, 320, 3, 2), P(k, b, 370, 750, 540, 9, 3)] };
}
module.exports = S;
