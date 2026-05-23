import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default class HowItWorks {
  constructor() {
    this.root = document.querySelector('[data-how-it-works]');
    if (!this.root) return;

    this.inner = this.root;
    this.steps = gsap.utils.toArray('[data-process-step]', this.root);
    this.states = gsap.utils.toArray('.how-it-works__screen-state', this.root);
    if (!this.steps.length || !this.states.length) return;

    this.mm = gsap.matchMedia();
    this.init();
  }

  init() {
    this.mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([...this.steps, ...this.states], { clearProps: 'all' });
      this.setActive(0);
    });

    this.mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      this.setActive(0);
      gsap.set(this.steps, { autoAlpha: 0.38, y: 28 });
      gsap.set(this.steps[0], { autoAlpha: 1, y: 0 });
      gsap.set(this.states, { autoAlpha: 0, y: 18, scale: 0.96 });
      gsap.set(this.states[0], { autoAlpha: 1, y: 0, scale: 1 });

      const timeline = gsap.timeline({ paused: true });

      this.steps.forEach((step, index) => {
        const state = this.states[index];
        const position = index;

        timeline.to(step, {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: 'none',
          onStart: () => this.setActive(index),
          onReverseComplete: () => this.setActive(Math.max(index - 1, 0)),
        }, position);

        timeline.to(state, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.32,
          ease: 'none',
        }, position);

        if (index > 0) {
          timeline.to(this.states[index - 1], {
            autoAlpha: 0,
            y: -18,
            scale: 1.02,
            duration: 0.24,
            ease: 'none',
          }, position);
        }

        if (index < this.steps.length - 1) {
          timeline.to(step, {
            autoAlpha: 0.38,
            y: -20,
            duration: 0.22,
            ease: 'none',
          }, position + 0.68);
        }
      });

      ScrollTrigger.create({
        animation: timeline,
        trigger: this.root,
        start: 'top top',
        end: () => `+=${this.steps.length * window.innerHeight * 0.75}`,
        scrub: true,
        pin: this.inner,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    this.mm.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.set(this.states, { clearProps: 'all' });

      this.steps.forEach((step, index) => {
        gsap.fromTo(step, {
          y: 36,
          autoAlpha: 0,
        }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 86%',
            once: true,
            onEnter: () => this.setActive(index),
          },
        });
      });
    });
  }

  setActive(index) {
    this.steps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === index);
    });

    this.states.forEach((state, stateIndex) => {
      state.classList.toggle('is-active', stateIndex === index);
    });
  }
}
