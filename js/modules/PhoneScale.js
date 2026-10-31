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
  if (!ro) return;
  root.querySelectorAll('.work__display').forEach((el) => ro.observe(el));
}
