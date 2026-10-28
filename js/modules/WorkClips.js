// WorkClips — the work phones play a clip of each live site, but only while
// the phone is on screen. With reduced motion they stay on the poster frame.
export default class WorkClips {
  constructor() {
    this.videos = document.querySelectorAll('.work__screen');
    if (!this.videos.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    this.init();
  }

  init() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target: video, isIntersecting }) => {
        if (isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { rootMargin: '120px 0px' });

    this.videos.forEach((video) => io.observe(video));
  }
}
