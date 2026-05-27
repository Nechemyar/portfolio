import gsap from 'gsap';

export default class MagicCarousel {
  constructor() {
    this.section = document.querySelector('[data-magic-showcase]');
    if (!this.section) return;

    this.track = this.section.querySelector('[data-magic-track]');
    this.slides = gsap.utils.toArray('.magic-showcase__slide', this.track);
    this.dots = gsap.utils.toArray('.magic-showcase__dot', this.section);
    this.prevBtn = this.section.querySelector('[data-magic-prev]');
    this.nextBtn = this.section.querySelector('[data-magic-next]');
    
    this.countEl = this.section.querySelector('[data-magic-count]');
    this.titleEl = this.section.querySelector('[data-magic-title]');
    this.linkEl = this.section.querySelector('[data-magic-link]');

    this.currentIndex = 0;
    this.total = this.slides.length;

    // Define project metadata
    this.projects = [
      {
        title: "Choice Inventory",
        link: "projects/choice-inventory.html"
      },
      {
        title: "Clinical Assessments",
        link: "projects/clinical-assessments.html"
      },
      {
        title: "Project 03",
        link: "#"
      }
    ];

    this.isAnimating = false;

    this.init();
  }

  init() {
    this.updateMeta();

    this.nextBtn.addEventListener('click', () => this.next());
    this.prevBtn.addEventListener('click', () => this.prev());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });
  }

  next() {
    if (this.isAnimating) return;
    const nextIndex = (this.currentIndex + 1) % this.total;
    this.goTo(nextIndex);
  }

  prev() {
    if (this.isAnimating) return;
    const prevIndex = (this.currentIndex - 1 + this.total) % this.total;
    this.goTo(prevIndex);
  }

  goTo(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    
    this.isAnimating = true;
    this.currentIndex = index;

    // Update dots
    this.dots.forEach((dot, i) => {
      if (i === this.currentIndex) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });

    // Update Meta immediately for snappy feeling
    this.updateMeta();

    // Slide track (since slides are 100% flex items, we translate by -100% * index)
    gsap.to(this.track, {
      xPercent: -100 * this.currentIndex,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        this.isAnimating = false;
      }
    });
  }

  updateMeta() {
    const project = this.projects[this.currentIndex];
    const displayNum = String(this.currentIndex + 1).padStart(2, '0');
    const totalNum = String(this.total).padStart(2, '0');
    
    if (this.countEl) this.countEl.textContent = `${displayNum}/${totalNum}`;
    if (this.titleEl) this.titleEl.textContent = project.title;
    
    if (this.linkEl) {
      this.linkEl.href = project.link;
      if (project.link === '#') {
        this.linkEl.style.pointerEvents = 'none';
        this.linkEl.textContent = "Coming Soon";
      } else {
        this.linkEl.style.pointerEvents = 'auto';
        this.linkEl.textContent = "View full project ↗";
      }
    }
  }
}
