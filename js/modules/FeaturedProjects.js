import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Bundle these via Vite so production paths resolve correctly. They're only
// referenced from JS-injected markup, so Vite can't statically detect them
// from the HTML or SCSS.
import catGrey from '../../assets/images/deskcatgrey.png';
import catBlack from '../../assets/images/deskcatblack.png';
import screenClinical from '../../assets/images/project-clinical.jpg';
import screenChoice from '../../assets/images/project-choice.jpg';
import screenClinicalMob from '../../assets/images/clinmob.jpg';
import screenChoiceMob from '../../assets/images/choicemob.jpg';

gsap.registerPlugin(ScrollTrigger);

/**
 * Featured Projects — pinned cat-stack carousel.
 *
 * Each project = one cat card. The active card sits centred and sharp; the next
 * project's card is parked behind-right at smaller scale, blurred and dimmed.
 * As the user scrolls, the active card slides off (scaling down + blurring)
 * while the next card slides forward (sharpening), and the background tints
 * crossfade between the two projects.
 *
 * Section height is set in JS: 100vh pin + 150vh per project of scroll runway.
 */

const PROJECTS = [
  {
    slug: 'clinical-assessments',
    name: 'Clinical\nAssessments',
    cat: catGrey,
    screen: screenClinical,
    screenMob: screenClinicalMob,
    href: 'projects/clinical-assessments.html',
  },
  {
    slug: 'choice-inventory',
    name: 'Choice\nInventory',
    cat: catBlack,
    screen: screenChoice,
    screenMob: screenChoiceMob,
    href: 'projects/choice-inventory.html',
  },
];

// Tunables
const BACK_SCALE = 0.78;
const BACK_BLUR = 14;
const BACK_OPACITY = 0.45;
const BACK_X = '28vw';

export default class FeaturedProjects {
  constructor() {
    this.init();
  }

  init() {
    const section = document.querySelector('.featured');
    const stack = document.querySelector('#featured-stack');
    const titleEl = document.querySelector('#featured-title');
    const cta = document.querySelector('#featured-cta');
    const eyebrowInner = document.querySelector('.featured__eyebrow-inner');
    const bgs = document.querySelectorAll('.featured__bg');
    if (!section || !stack || !titleEl || !cta) return;

    // Section height: 100vh pin + 150vh of runway per project.
    section.style.height = `${100 + PROJECTS.length * 150}vh`;

    // ——— Render cards + title spans from data ———
    PROJECTS.forEach((p, i) => {
      const card = document.createElement('a');
      card.className = 'featured__card';
      card.href = p.href;
      card.dataset.idx = String(i);
      card.setAttribute('aria-label', `${p.name.replace('\n', ' ')} — view project`);
      card.innerHTML = `
        <span class="featured__card-glow"></span>
        <div class="featured__card-mask">
          <div class="featured__card-screen">
            <picture>
              <source media="(max-width: 768px)" srcset="${p.screenMob}" />
              <img src="${p.screen}" alt="${p.name.replace('\n', ' ')}" loading="lazy" />
            </picture>
          </div>
        </div>
        <img class="featured__card-cat" src="${p.cat}" alt="" />
      `;
      stack.appendChild(card);

      const span = document.createElement('span');
      span.className = 'featured__title-item';
      span.dataset.idx = String(i);
      span.textContent = p.name;
      titleEl.appendChild(span);
    });

    const cards = stack.querySelectorAll('.featured__card');
    const titles = titleEl.querySelectorAll('.featured__title-item');

    // ——— Base state ———
    // GSAP owns transforms so timeline tweens compose cleanly.
    gsap.set(cards, { xPercent: -50, yPercent: -50, top: '50%', left: '50%' });
    // First card: off-left, invisible (slides in during entry)
    gsap.set(cards[0], { x: '-120vw', scale: 1, filter: 'blur(0px)', opacity: 0 });
    // Subsequent cards: parked back-right, blurred, dimmed
    cards.forEach((c, i) => {
      if (i === 0) return;
      gsap.set(c, {
        x: BACK_X,
        scale: BACK_SCALE,
        filter: `blur(${BACK_BLUR}px)`,
        opacity: 0,
      });
    });

    gsap.set(titles, { opacity: 0 });
    gsap.set(bgs, { opacity: 0 });
    gsap.set(cta, { opacity: 0, y: 20 });
    if (eyebrowInner) gsap.set(eyebrowInner, { y: '120%', opacity: 0 });

    // ——— Master timeline ———
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 0: entry (0 → 0.5)
    tl.to(bgs[0], { opacity: 1, duration: 0.5 }, 0)
      .to(eyebrowInner, { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' }, 0)
      .to(cards[0], { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0)
      .to(cards[1], { opacity: BACK_OPACITY, duration: 0.5 }, 0)
      .to(titles[0], { opacity: 1, duration: 0.3 }, 0.2)
      .to(cta, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.1);

    // Phase 1: hold #1 (0.5 → 1.5) — empty hold zone keeps card[0] locked
    tl.to({}, { duration: 1 }, 0.5);

    // Phase 2: swap (1.5 → 2.0)
    if (cards.length > 1) {
      tl.to(cards[0], {
        x: BACK_X,
        scale: BACK_SCALE,
        filter: `blur(${BACK_BLUR}px)`,
        opacity: 0,
        duration: 0.5,
      }, 1.5)
        .to(cards[1], {
          x: 0,
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 0.5,
        }, 1.5)
        .to(bgs[0], { opacity: 0, duration: 0.5 }, 1.5)
        .to(bgs[1], { opacity: 1, duration: 0.5 }, 1.5)
        .to(titles[0], { opacity: 0, duration: 0.3 }, 1.5)
        .to(titles[1], { opacity: 1, duration: 0.3 }, 1.7);

      // Phase 3: hold #2 (2.0 → 3.0)
      tl.to({}, { duration: 1 }, 2.0);

      // Phase 4: release (3.0 → 3.5) — fade everything out so logo-strip
      // can take over cleanly as the pin releases.
      tl.to([cards[cards.length - 1], titles[cards.length - 1], cta, bgs[1]], {
        opacity: 0,
        duration: 0.5,
      }, 3.0)
        .to(eyebrowInner, { opacity: 0, duration: 0.5 }, 3.0);
    }

    // ——— Active project tracking: swap CTA href based on scroll position ———
    let activeIdx = 0;
    const setActive = (idx) => {
      if (idx === activeIdx) return;
      activeIdx = idx;
      cta.href = PROJECTS[idx].href;
      cta.setAttribute('aria-label', `View ${PROJECTS[idx].name.replace('\n', ' ')}`);
    };

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        // Timeline runs from 0 to 3.5; swap point is at 1.75 → progress 0.5.
        // Cleaner: split the runway evenly across projects.
        const idx = Math.min(
          PROJECTS.length - 1,
          Math.floor(self.progress * PROJECTS.length)
        );
        setActive(idx);
      },
    });

    // Body class for sticky-cta hide
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onEnter: () => document.body.classList.add('featured-active'),
      onLeave: () => document.body.classList.remove('featured-active'),
      onEnterBack: () => document.body.classList.add('featured-active'),
      onLeaveBack: () => document.body.classList.remove('featured-active'),
    });
  }
}
