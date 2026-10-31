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

// Playing stands for scrolling, so while a clip plays the tab bar folds into
// the small address pill, as Safari 26 does, until the clip stops. The
// status bar keeps one colour per site (dark or light), set in the markup.
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
    if (!timer) timer = setInterval(() => { if (video.paused) stop(); }, 500);
  });
  video.addEventListener('pause', stop);
  video.addEventListener('ended', stop);
}

export function watchPhones(root = document) {
  root.querySelectorAll('.work__display').forEach(watch);
}
