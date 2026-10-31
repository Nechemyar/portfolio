const { chromium } = require('playwright');
const out = process.argv[2];
const jobs = [
  ['choice-home', 'https://choiceinventory.co.uk/', 0],
  ['choice-pricing', 'https://choiceinventory.co.uk/pricing', 0],
  ['choice-services', 'https://choiceinventory.co.uk/services', 0],
  ['choice-about', 'https://choiceinventory.co.uk/about', 0],
  ['choice-home2', 'https://choiceinventory.co.uk/', 900],
  ['clinical-home', 'https://clinicalassessments.co.uk/', 0],
  ['clinical-process', 'https://clinicalassessments.co.uk/our-process/', 0],
  ['clinical-adhd', 'https://clinicalassessments.co.uk/services/adhd-assessments/', 0],
  ['clinical-services', 'https://clinicalassessments.co.uk/services/', 0],
  ['clinical-home2', 'https://clinicalassessments.co.uk/', 900],
  ['jsense-home', 'https://jsense.org.uk/', 0],
  ['jsense-services', 'https://jsense.org.uk/services', 0],
  ['jsense-advocacy', 'https://jsense.org.uk/advocacy', 0],
  ['jsense-about', 'https://jsense.org.uk/about', 0],
  ['jsense-home2', 'https://jsense.org.uk/', 900],
];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 402, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1' });
  for (const [name, url, y] of jobs) {
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto', name, e.message));
      await p.waitForTimeout(2000);
      await p.evaluate(() => document.querySelectorAll('[id*=cookie i],[class*=cookie i],[id*=consent i]').forEach(e => e.remove())).catch(() => {});
      if (y) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(1500); }
      // let reveal animations finish
      await p.evaluate(() => document.querySelectorAll('*').forEach(e => { const s = getComputedStyle(e); if (s.opacity === '0' && e.getBoundingClientRect().top < innerHeight) {} }));
      // Safari 26's bar floats over the bottom 76pt; pinned buttons sit above it
      await p.evaluate(() => document.querySelectorAll('body *').forEach((e) => {
        const cs = getComputedStyle(e);
        if (cs.position !== 'fixed') return;
        const r = e.getBoundingClientRect();
        if (r.height < innerHeight * 0.5 && innerHeight - r.bottom < 60 && r.bottom > innerHeight * 0.6) e.style.setProperty('bottom', (parseFloat(cs.bottom) || 0) + 76 + 'px', 'important');
      }));
      await p.waitForTimeout(1500);
      await p.screenshot({ path: `${out}/${name}.png` });
      console.log('ok', name);
    } catch (e) { console.log('fail', name, e.message); }
    await p.close();
  }
  await b.close();
})();
