export default class MagicReel {
  constructor() {
    this.slides = document.querySelectorAll('.magic-showcase__slide');
    if (!this.slides.length) return;
    
    this.currentIndex = 0;
    this.intervalTime = 1500; // Jump cut every 1.5 seconds
    
    this.init();
  }

  init() {
    // Ensure the first slide is active
    this.slides.forEach((slide, index) => {
      if (index === 0) {
        slide.classList.add('is-active');
      } else {
        slide.classList.remove('is-active');
      }
    });

    // Start the interval
    this.startReel();
  }

  startReel() {
    setInterval(() => {
      // Remove active class from current
      this.slides[this.currentIndex].classList.remove('is-active');
      
      // Increment and wrap
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      
      // Add active class to new
      this.slides[this.currentIndex].classList.add('is-active');
    }, this.intervalTime);
  }
}
