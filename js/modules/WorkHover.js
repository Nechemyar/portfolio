export default class WorkHover {
  constructor() {
    this.init();
  }

  init() {
    const workItems = document.querySelectorAll('.work__item');
    if (!workItems.length) return;

    workItems.forEach(item => {
      const video = item.querySelector('.work__video');
      if (!video) return;

      item.addEventListener('mouseenter', () => {
        // Play video only if a valid valid source exists
        if (video.hasAttribute('src') && video.getAttribute('src') !== '') {
          video.play().catch(e => console.warn('Video play blocked:', e));
        }
      });

      item.addEventListener('mouseleave', () => {
        if (video.hasAttribute('src') && video.getAttribute('src') !== '') {
          video.pause();
        }
      });
    });
  }
}
