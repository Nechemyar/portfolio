// CaseView — the moving parts of one case study (layout B). Phones play only
// while on screen, and on desktop the pinned phone takes the screen of
// whichever part of the story sits in the middle of the view. Runs on the
// case page itself and inside the homepage's case layer, so it only ever
// looks inside the <main class="case"> it was given.
import gsap from 'gsap';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default class CaseView {
  constructor(root) {
    this.root = root;
    this.observers = [];
    if (!root || !('IntersectionObserver' in window)) return;
    this.initClips();
    this.initPinned();
  }

  initClips() {
    if (reduce()) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting) {
          if (video.preload !== 'auto') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '120px 0px' });
    this.root.querySelectorAll('video').forEach((v) => io.observe(v));
    this.observers.push(io);
  }

  initPinned() {
    const pinned = this.root.querySelector('.case__pinned');
    const beats = this.root.querySelectorAll('.case__beat[data-clip]');
    if (!pinned || !beats.length) return;

    let current = beats[0].dataset.clip;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const clip = target.dataset.clip;
        if (clip === current) return;
        current = clip;
        // Fade the screen out, change the clip, fade it back in.
        gsap.to(pinned, {
          opacity: 0,
          duration: reduce() ? 0 : 0.2,
          ease: 'power1.out',
          overwrite: true,
          onComplete: () => {
            pinned.poster = `/work/${clip}.webp`;
            pinned.src = `/work/${clip}.mp4`;
            if (!reduce()) pinned.play().catch(() => {});
            gsap.to(pinned, { opacity: 1, duration: reduce() ? 0 : 0.3, ease: 'power1.out' });
          },
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    beats.forEach((b) => io.observe(b));
    this.observers.push(io);
  }

  destroy() {
    this.observers.forEach((io) => io.disconnect());
    this.observers = [];
    if (this.root) gsap.killTweensOf(this.root.querySelectorAll('.case__pinned'));
  }
}
