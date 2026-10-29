// node capture.cjs <outdir> <url> [extra paths...]
const { chromium } = require('C:/Users/neche/Downloads/Work/Settle/unaverage/skills/unaverage/node_modules/playwright');
const fs = require('fs'), path = require('path');
const [out, url, ...extra] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const pages = ['', ...extra];
  for (const [w, h, tag, mobile] of [[390, 844, 'm', true], [1440, 900, 'd', false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 3 : 2, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage();
    for (const sub of pages) {
      const name = (sub.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home');
      await p.goto(url + sub, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto', e.message));
      await p.waitForTimeout(2500);
      // dismiss cookie banners if obvious
      await p.evaluate(() => document.querySelectorAll('[id*=cookie i],[class*=cookie i]').forEach(e => e.remove())).catch(() => {});
      await p.screenshot({ path: path.join(out, `${name}-${tag}.png`) });
      if (sub === '' && tag === 'd') {
        const info = await p.evaluate(() => {
          const colors = {};
          const bump = c => { if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) colors[c] = (colors[c] || 0) + 1; };
          document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); bump(s.backgroundColor); bump(s.color); bump(s.fill); });
          const vars = {};
          for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) if (r.selectorText === ':root' || r.selectorText === 'body') for (const k of r.style) if (k.startsWith('--')) vars[k] = r.style.getPropertyValue(k).trim(); } catch (e) {} }
          const logos = [...document.querySelectorAll('header img, header svg, a[href="/"] img, a[href="/"] svg, [class*=logo i] img, [class*=logo i] svg, img[alt*=logo i]')].slice(0, 6).map(e => e.tagName === 'IMG' ? { src: e.currentSrc || e.src } : { svg: e.outerHTML });
          const icons = [...document.querySelectorAll('link[rel*=icon]')].map(l => l.href);
          return { colors: Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 25), vars, logos, icons };
        });
        fs.writeFileSync(path.join(out, 'site-info.json'), JSON.stringify(info, null, 2));
      }
    }
    await ctx.close();
  }
  await b.close();
})();
