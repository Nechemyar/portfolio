// The phone tiles draw iOS Safari's status bar and tab bar in iPhone points
// (--pt, one 402th of the screen's width). Browsers with container query
// units get it from CSS; older ones (some Android browsers) don't, and the
// bar then spilled out of the phone. So the width is measured here too.
const ro = typeof ResizeObserver !== 'undefined'
  ? new ResizeObserver((entries) => entries.forEach((e) => {
    const w = e.contentRect.width;
    if (w) e.target.style.setProperty('--pt', `${w / 402}px`);
  }))
  : null;

export default function fitPhones(root = document) {
  watchPhones(root);
  if (!ro) return;
  root.querySelectorAll('.work__display').forEach((el) => ro.observe(el));
}

// Safari 26 has no bar behind the status line: the page's own top colour
// runs up behind the time, and the time flips black or white to suit it.
// While a clip plays, its top rows are sampled a few times a second and the
// display takes that colour. Playing stands for scrolling, so the tab bar
// folds into the small address pill until the clip stops.
const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
const ctx = canvas?.getContext('2d', { willReadFrequently: true });
if (canvas) { canvas.width = 8; canvas.height = 1; }

function tint(video, phone) {
  if (!ctx || video.readyState < 2) return;
  try {
    ctx.drawImage(video, 0, 0, video.videoWidth, Math.max(2, video.videoHeight * 0.006), 0, 0, 8, 1);
    const d = ctx.getImageData(0, 0, 8, 1).data;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < 32; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
    r = Math.round(r / 8); g = Math.round(g / 8); b = Math.round(b / 8);
    phone.style.setProperty('--sb', `rgb(${r}, ${g}, ${b})`);
    phone.style.setProperty('--sb-ink', (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#000' : '#fff');
  } catch (e) { /* a tainted frame: keep the colour in the markup */ }
}

const watched = new WeakSet();
function watch(display) {
  const video = display.querySelector('video');
  const phone = display.closest('.work__phone');
  if (!video || !phone || watched.has(video)) return;
  watched.add(video);
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; phone.classList.remove('is-scrolling'); };
  video.addEventListener('playing', () => {
    phone.classList.add('is-scrolling');
    if (!timer) timer = setInterval(() => (video.paused ? stop() : tint(video, phone)), 160);
    tint(video, phone);
  });
  video.addEventListener('pause', stop);
  video.addEventListener('ended', stop);
}

export function watchPhones(root = document) {
  root.querySelectorAll('.work__display').forEach(watch);
}
