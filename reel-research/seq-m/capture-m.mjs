// Frame-exact MOBILE image-sequence capture for the hero reel (same method as capture-seq.mjs).
//
// iPhone context: 402x874 CSS at DPR 3 (1206x2622 frames), isMobile + hasTouch + Safari UA.
// Playwright's fake clock drives JS time; every Web Animation is paused and seeked to virtual time.
// Interactions are real touch (CDP Input.dispatchTouchEvent): taps are touchStart, a few held
// frames, touchEnd, so the browser synthesises the click itself; drags are touchMove streams.
// No cursor is drawn. cursor.json logs an eased pointer path to and from every touch, <= 70 CSS px
// per frame, with down=true while a finger is on the glass.
//
// Page scrolls ("swipes") are programmatic eased scrolls with the finger logged moving 1:1 with the
// content: a real touch fling runs on the compositor's wall clock, which would break determinism.
//
//   node scripts/run-m.mjs <take> [--frames-only]
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FPS = 30, DT = 1000 / FPS, STEP = 70;
const OUT = path.resolve('seq-m');
const VIEW = { width: 402, height: 874 }, SCALE = 3;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';

// Same animation seeker as capture-seq.mjs.
const animInit = () => {
  const seen = new WeakMap();
  const sync = (now) => {
    for (const a of document.getAnimations()) {
      if (a.timeline !== document.timeline && a.timeline !== null) continue;
      let s = seen.get(a);
      if (!s) { s = { t0: now, done: false }; seen.set(a, s); }
      if (s.done) continue;
      const ct = (now - s.t0) * (a.playbackRate || 1);
      const end = a.effect?.getComputedTiming().endTime ?? Infinity;
      if (Number.isFinite(end) && ct >= end) {
        try { a.finish(); } catch { a.pause(); a.currentTime = end; }
        s.done = true;
      } else {
        if (a.playState !== 'paused') a.pause();
        a.currentTime = Math.max(0, ct);
      }
    }
  };
  window.__seqSync = () => sync(performance.now());
  const loop = () => { try { sync(performance.now()); } catch {} requestAnimationFrame(loop); };
  setTimeout(() => requestAnimationFrame(loop), 0);
};

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - t, 3);

export async function session(name, { url, warmMs = 2500, view = VIEW, scale = SCALE, mobile = true, out = OUT, still = 0.3 } = {}) {
  const dir = path.join(out, name);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: view, deviceScaleFactor: scale, reducedMotion: 'no-preference',
    ...(mobile ? { isMobile: true, hasTouch: true, userAgent: UA } : {}),
  });
  const T0 = new Date('2026-10-29T09:00:00Z').getTime();
  await ctx.clock.install({ time: T0 - 1000 });
  await ctx.clock.pauseAt(T0);
  await ctx.addInitScript(animInit);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const writes = [];
  page.on('request', r => { if (!['GET', 'HEAD', 'OPTIONS'].includes(r.method())) writes.push(r.method() + ' ' + r.url()); });

  let f = 0;
  const cur = { x: view.width * 0.7, y: view.height * 0.85, down: false };
  const log = [], marks = [];
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, radiusX: 6, radiusY: 6, force: 1 }] });
  const S = {
    page, ctx, browser, cdp, dir, writes, cur, log, marks, view,
    get t() { return f / FPS; },
    async advance(ms, step = 100) {
      for (let t = 0; t < ms; t += step) { await ctx.clock.runFor(step); await page.waitForTimeout(15); }
    },
    async sync() { for (const fr of page.frames()) await fr.evaluate(() => window.__seqSync?.()).catch(() => {}); },
    async frame() {
      await ctx.clock.runFor(DT);
      await page.waitForTimeout(8);
      await S.sync();
      const sy = await page.evaluate(() => scrollY).catch(() => null);
      await page.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
      log.push({ f, x: +cur.x.toFixed(1), y: +cur.y.toFixed(1), down: cur.down, scrollY: sy });
      f++;
    },
    async hold(sec) { const n = Math.round(sec * FPS); for (let i = 0; i < n; i++) await S.frame(); },
    mark(label) { marks.push({ t: +S.t.toFixed(2), f, label }); console.log(`  ${S.t.toFixed(2)}s  ${label}`); },
    place(x, y) { cur.x = x; cur.y = y; },
    // pointer travel only (no hover on a phone): eased, slight arc, <= 70 css px per frame
    // default duration scales with distance: 0.15 s for a nudge up to 0.45 s across the screen
    async moveTo(x, y, sec) {
      const sx = cur.x, sy = cur.y, dx = x - sx, dy = y - sy, d = Math.hypot(dx, dy);
      if (sec == null) sec = Math.min(0.45, Math.max(0.15, 0.12 + d / 1000));
      const n = Math.max(Math.round(sec * FPS), Math.ceil(d / STEP * 1.5), 1);
      const arc = Math.min(30, d * 0.08);
      for (let i = 1; i <= n; i++) {
        const e = ease(i / n), s = Math.sin(Math.PI * e);
        cur.x = sx + dx * e - (dy / (d || 1)) * arc * s;
        cur.y = sy + dy * e + (dx / (d || 1)) * arc * s;
        if (!mobile) await page.mouse.move(cur.x, cur.y); // desktop: real hover
        await S.frame();
      }
    },
    // desktop: real mouse click
    async click(x = cur.x, y = cur.y, holdFrames = 3) {
      cur.x = x; cur.y = y; await page.mouse.move(x, y);
      cur.down = true; await page.mouse.down();
      for (let i = 0; i < holdFrames; i++) await S.frame();
      await page.mouse.up(); cur.down = false;
    },
    // real tap: touchStart, held frames, touchEnd (browser synthesises the click)
    async tap(x = cur.x, y = cur.y, holdFrames = 3) {
      cur.x = x; cur.y = y; cur.down = true;
      await touch('touchStart', x, y);
      for (let i = 0; i < holdFrames; i++) await S.frame();
      await touch('touchEnd'); cur.down = false;
    },
    // press and hold until cond() or maxSec
    async press(x, y, maxSec, cond) {
      cur.x = x; cur.y = y; cur.down = true;
      await touch('touchStart', x, y);
      for (let i = 0; i < maxSec * FPS; i++) { await S.frame(); if (cond && i % 3 === 0 && await cond()) break; }
      await touch('touchEnd'); cur.down = false;
    },
    // real touch drag (sliders): touchStart, eased touchMoves, touchEnd
    async drag(x0, y0, x1, y1, sec) {
      cur.x = x0; cur.y = y0; cur.down = true;
      await touch('touchStart', x0, y0); await S.frame(); await S.frame();
      const n = Math.max(Math.round(sec * FPS), Math.ceil(Math.hypot(x1 - x0, y1 - y0) / STEP));
      for (let i = 1; i <= n; i++) {
        const e = ease(i / n);
        cur.x = x0 + (x1 - x0) * e; cur.y = y0 + (y1 - y0) * e;
        await touch('touchMove', cur.x, cur.y); await S.frame();
      }
      await S.frame();
      await touch('touchEnd'); cur.down = false;
    },
    // swipe-scroll: finger goes down at (x, y), content scrolls by dy (eased), finger tracks it 1:1
    // for the first part, then lifts while the page glides on (like a light fling)
    async swipe(dy, sec, { x = cur.x, y = cur.y, el = null } = {}) {
      const get = () => page.evaluate(sel => sel ? document.querySelector(sel).scrollTop : scrollY, el);
      const set = v => page.evaluate(([sel, v]) => sel ? (document.querySelector(sel).scrollTop = v) : window.scrollTo({ top: v, behavior: 'instant' }), [el, v]);
      const from = await get();
      cur.x = x; cur.y = y; cur.down = true;
      const n = Math.round(sec * FPS), lift = Math.round(n * 0.45);
      for (let i = 1; i <= n; i++) {
        const e = easeOut(i / n);
        await set(from + dy * e);
        if (i <= lift) { cur.y = y - (from + dy * e - from); } else if (i === lift + 1) { cur.down = false; }
        await S.frame();
      }
      cur.down = false;
    },
    // horizontal swipe in a scroller (carousels)
    async swipeX(sel, dx, sec, { x = cur.x, y = cur.y } = {}) {
      const from = await page.evaluate(s => document.querySelector(s).scrollLeft, sel);
      await page.evaluate(s => { const e = document.querySelector(s); e.style.scrollSnapType = 'none'; e.style.scrollBehavior = 'auto'; }, sel);
      cur.x = x; cur.y = y; cur.down = true;
      const n = Math.round(sec * FPS), lift = Math.round(n * 0.5);
      for (let i = 1; i <= n; i++) {
        const e = easeOut(i / n);
        await page.evaluate(([s, v]) => { document.querySelector(s).scrollLeft = v; }, [sel, from + dx * e]);
        if (i <= lift) cur.x = x - dx * e; else if (i === lift + 1) cur.down = false;
        await S.frame();
      }
      cur.down = false;
    },
    async center(locator, fx = 0.5, fy = 0.5) {
      const b = await locator.boundingBox();
      if (!b) throw new Error('no box: ' + locator);
      return { x: b.x + b.width * fx, y: b.y + b.height * fy, b };
    },
    async finish() {
      fs.writeFileSync(path.join(dir, 'cursor.json'), JSON.stringify({ fps: FPS, cssWidth: view.width, cssHeight: view.height, scale, input: mobile ? 'touch' : 'mouse', marks, frames: log }));
      await ctx.close(); await browser.close();
      console.log(`${name}: ${f} frames = ${(f / FPS).toFixed(2)}s; non-GET requests: ${writes.length ? writes.join(', ') : 'none'}`);
      return { frames: f, marks, writes };
    },
  };
  if (url) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 40; i++) { await ctx.clock.runFor(100); await page.waitForTimeout(60); }
    await page.waitForLoadState('networkidle').catch(() => {});
    await S.advance(warmMs);
  }
  return S;
}

export function encode(name, out = OUT) {
  const dir = path.join(out, name);
  const mp4 = path.join(out, name + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.jpg'),
    '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
  // contact sheet: every 3rd frame, 10x3 tiles, frame number burned in
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%05d.jpg'),
    '-vf', "select='not(mod(n\\,3))',scale=200:-1,drawtext=text='%{n}':x=4:y=4:fontsize=22:fontcolor=red:box=1:boxcolor=white@0.7,tile=10x2",
    '-vsync', 'vfr', path.join(out, name + '-sheet%02d.jpg')]);
  const mb = fs.statSync(mp4).size / 1e6;
  console.log(`${mp4}: ${mb.toFixed(1)} MB`);
  return mb;
}

export const declineCookies = page => page.evaluate(() => {
  const b = [...document.querySelectorAll('button,a')].find(e => /reject|decline|only necessary|necessary only/i.test(e.innerText));
  b?.click(); return b?.innerText || null;
});

// Takes live in takes-m.mjs; run them with: node scripts/run-m.mjs <take> [--frames-only]
