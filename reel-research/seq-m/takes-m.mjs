// Mobile takes for capture-m.mjs (plus the desktop JSense modes take, which writes to seq/).
import { session, declineCookies } from './capture-m.mjs';
import path from 'node:path';

export const TAKES = {};
const GAP = 0.4; // pause after a reaction settles before the next input

// Wait (capturing frames) until cond() is true or maxSec passes, then hold `after` seconds.
async function until(S, cond, maxSec = 1.5, after = 0) {
  for (let i = 0; i < maxSec * 30; i++) { await S.frame(); if (i % 2 === 1 && await cond()) break; }
  if (after) await S.hold(after);
}

// ---------------------------------------------------------------- JSense
// Accessibility FAB -> bottom sheet -> reading font to OpenDyslexic -> Dark Contrast -> High Contrast
// -> close the sheet so the whole page shows in the chosen mode.
async function jsenseModes(name, { mobile }) {
  const S = await session(name, mobile ? { url: 'https://jsense.org.uk/' }
    : { url: 'https://jsense.org.uk/', view: { width: 1440, height: 900 }, scale: 2, mobile: false, out: path.resolve('seq') });
  const { page } = S;
  await declineCookies(page); await S.advance(800);
  const card = t => page.locator('button.a11y-card', { hasText: t });
  const font = page.locator('button.a11y-card--cycle');
  const fab = mobile ? page.locator('#a11y-toggle') : page.locator('#a11y-header-toggle');
  const go = async (loc, label, wait, fx = 0.5, fy = 0.5) => {
    const p = await S.center(loc, fx, fy);
    await S.moveTo(p.x, p.y);
    await S.hold(0.1);
    S.mark(label);
    if (mobile) await S.tap(p.x, p.y); else await S.click(p.x, p.y);
    await S.hold(wait);
  };
  if (mobile) S.place(250, 700); else { S.place(1000, 640); await page.mouse.move(1000, 640); }
  S.mark('start (still)'); await S.hold(0.3);
  await go(fab, mobile ? 'tap accessibility button' : 'click accessibility button', 0.6);
  for (let i = 0; i < 5; i++) {
    await go(font, `reading font ${i + 1}`, GAP, 0.5, 0.45);
    const lbl = await font.innerText();
    console.log('   font ->', lbl.replace(/\s+/g, ' '));
    if (/dyslexic/i.test(lbl)) break;
  }
  await go(card('High Contrast'), 'High Contrast', 0.3 + GAP);
  await go(card('Dark Contrast'), 'Dark Contrast', 0.3 + GAP);
  await go(page.locator('#a11y-close'), 'close panel: page in dark contrast + OpenDyslexic', 0.9);
  if (mobile) await S.moveTo(330, 560, 0.4); else await S.moveTo(1180, 700, 0.4);
  await S.hold(0.6);
  S.mark('end');
  return S.finish();
}
TAKES['jsense-modes'] = () => jsenseModes('jsense-modes', { mobile: true });
TAKES['jsense-modes-desktop'] = () => jsenseModes('jsense-modes', { mobile: false });
TAKES['jsense-modes-desktop'].out = path.resolve('seq');
TAKES['jsense-modes-desktop'].seqName = 'jsense-modes';

// ---------------------------------------------------------------- Choice Inventory
// Calculator in a srcdoc iframe. On phones the site hides the price (.result-column display:none
// under 900px), so the visible changes are the bedroom badge, the switches and the room counter.
TAKES['choice-calc'] = async () => {
  const S = await session('choice-calc', { url: 'https://choiceinventory.co.uk/pricing' });
  const { page } = S;
  await declineCookies(page); await S.advance(800);
  const top = await page.locator('iframe.grid-embed__iframe').first().evaluate(el => el.getBoundingClientRect().top + scrollY);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top + 234 - 210);
  await S.advance(1200);
  const fr = page.frameLocator('iframe.grid-embed__iframe').first();
  const badge = () => fr.locator('.slider-badge').first().innerText().catch(() => '?');
  const sb = await fr.locator('#bedroomSlider').boundingBox();
  const xAt = v => sb.x + 15 + (sb.width - 30) * (v / 6), cy = sb.y + sb.height / 2;
  S.place(300, 760);
  S.mark('start (still)'); await S.hold(0.3);
  await S.moveTo(xAt(0), cy); await S.hold(0.1);
  S.mark('touch bedrooms thumb, drag Studio -> 4');
  await S.drag(xAt(0), cy, xAt(4), cy, 1.0);
  console.log('   badge:', (await badge()).trim());
  await S.hold(GAP);
  // top edge of the sliding "Estimated total" bar (parent page), or the viewport bottom
  const barTop = () => page.evaluate(() => {
    const el = [...document.querySelectorAll('body *')].find(e => e.children.length < 6 && /estimated total/i.test(e.textContent) && e.getBoundingClientRect().height > 40 && e.getBoundingClientRect().height < 200);
    const r = el?.getBoundingClientRect(); return r && r.top < innerHeight ? r.top : innerHeight;
  });
  const total = () => page.evaluate(() => (document.body.innerText.match(/estimated total\s*£\s?(\d+)/i) || [])[1] || '?');
  const tapEl = async (loc, label, wait = GAP) => {
    let p = await S.center(loc);
    const bt = await barTop();
    if (p.y > bt - 24) { // hidden under the price bar: swipe it clear first
      const dy = Math.round(p.y - (bt - 150));
      await S.moveTo(250, 520); S.mark(`swipe up ${dy}px to clear the price bar`);
      await S.swipe(dy, 0.45, { x: 250, y: 520 }); await S.hold(0.15);
      p = await S.center(loc);
    }
    await S.moveTo(p.x, p.y); await S.hold(0.1);
    S.mark(label); await S.tap(p.x, p.y); await S.hold(wait);
    console.log(`   ${label}: total £${await total()}`);
  };
  await tapEl(fr.locator('label[for=furnishedToggle] .switch, label[for=furnishedToggle] .slider').first(), 'Furnished on');
  await tapEl(fr.locator('label[for=checkinToggle] .switch, label[for=checkinToggle] .slider').first(), 'Check-in on');
  await tapEl(fr.locator('label[for=extraToggle] .switch, label[for=extraToggle] .slider').first(), 'Additional rooms on (counter strip opens)', 0.5);
  await tapEl(fr.locator('button.counter-btn').nth(1), 'room counter +');
  await S.moveTo(S.cur.x - 60, S.cur.y + 90);
  await S.hold(0.5);
  S.mark('end');
  console.log('   counter:', await fr.locator('.counter-val').first().innerText().catch(() => '?'));
  return S.finish();
};

// ---------------------------------------------------------------- Clinical Assessments
// Meet the Team: swipe so the cards glide in (Elementor fadeInUp re-armed below the fold, the
// same trick as the desktop take), then See Profile on Dr. Ruth M. Deutsch opens her page.
TAKES['clinical-team'] = async () => {
  const S = await session('clinical-team', { url: 'https://clinicalassessments.co.uk/team/' });
  const { page } = S;
  await declineCookies(page);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate(yy => scrollTo(0, yy), y); await S.advance(150); }
  await page.evaluate(() => scrollTo(0, 0)); await S.advance(1200);
  const n = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.elementor-element[data-settings*=fadeInUp], .e-loop-item')]
      .filter(g => g.getBoundingClientRect().top + scrollY > innerHeight - 40);
    for (const g of els) { g.classList.remove('animated', 'fadeInUp'); g.classList.add('elementor-invisible'); g.style.animationDuration = ''; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('elementor-invisible'); e.target.classList.add('animated', 'fadeInUp'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -60px 0px' });
    els.forEach(g => io.observe(g));
    return els.length;
  });
  console.log('   re-armed:', n);
  await S.advance(300);
  const cards = page.locator('.e-loop-item');
  S.place(300, 760);
  S.mark('start (still)'); await S.hold(0.3);
  // swipe so card 2 (Ruth) sits fully in view
  const target = await cards.nth(1).evaluate(e => e.getBoundingClientRect().top + scrollY - 70);
  await S.moveTo(260, 700);
  S.mark(`swipe up to Dr. Ruth M. Deutsch (${Math.round(target)}px)`);
  await S.swipe(target, 0.9, { x: 260, y: 700 });
  await S.hold(0.5);
  const sp = cards.nth(1).getByText('See Profile');
  const p = await S.center(sp);
  await S.moveTo(p.x, p.y); await S.hold(0.1);
  S.mark('tap See Profile');
  const url0 = page.url();
  await S.tap(p.x, p.y);
  for (let i = 0; i < 60 && !/team-member/.test(page.url()); i++) await S.frame();
  // network wait for the new page is compressed (not captured); its own animations play from here
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  S.mark('profile page: ' + page.url().replace(/^https:\/\/[^/]+/, ''));
  await S.moveTo(330, 600);
  await S.hold(1.2);
  S.mark('end');
  return S.finish();
};

// ---------------------------------------------------------------- Settle (?demo)
// Phone layout: swipe the to-do cards so "£1,880 to Tom" leads, Open it (case page, the gauge
// draws), then press and hold the sticky Mark Paid bar through to the paid screen and the bill.
TAKES['settle-paid'] = async () => {
  const S = await session('settle-paid', { url: 'https://settle.nechemyar.workers.dev/?demo' });
  const { page } = S;
  const step = await page.evaluate(() => { const li = document.querySelectorAll('ul.needs-list > li'); return li[1].offsetLeft - li[0].offsetLeft; });
  S.place(300, 760);
  S.mark('start (still)'); await S.hold(0.3);
  await S.moveTo(330, 290);
  S.mark(`swipe to-do cards left ${step}px: "£1,880 to Tom" to the front`);
  await S.swipeX('ul.needs-list', step, 0.45, { x: 330, y: 290 });
  await S.hold(0.3);
  const open = page.locator('button.need-btn', { hasText: 'Open' }).first();
  let p = await S.center(open);
  await S.moveTo(p.x, p.y); await S.hold(0.1);
  S.mark('tap Open'); await S.tap(p.x, p.y);
  await until(S, () => page.locator('button', { hasText: 'Mark Paid' }).first().isVisible().catch(() => false), 2);
  S.mark('case page: gauge drawing');
  await S.moveTo(250, 640);
  await S.hold(0.55);
  S.mark('gauge drawn');
  p = await S.center(page.locator('button', { hasText: 'Mark Paid' }).first());
  await S.moveTo(p.x, p.y); await S.hold(0.1);
  S.mark('press and hold Mark Paid');
  await S.press(p.x, p.y, 5, () => page.evaluate(() => /Marked as paid/i.test(document.body.innerText)));
  S.mark('released (Marked as paid showing)');
  await S.moveTo(S.cur.x - 50, S.cur.y - 120, 0.5);
  await S.hold(2.2);
  S.mark('end');
  return S.finish();
};
