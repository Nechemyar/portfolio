import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Bundle these via Vite so production paths resolve. They're referenced only
// from JS-injected markup, so Vite can't statically detect them otherwise.
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
 * Both project cards are sized and positioned identically to the hero cat.
 * They z-stack with a physical x-offset so the back card peeks out behind the
 * front card (no blur, no opacity fade). Scrolling slides both cards left
 * together, swapping which one is in front via z-index at the visual midpoint.
 *
 * Sequence:
 *   0.0 → 0.4   "FEATURED PROJECTS" rises up; bg[0] fades in
 *   0.4 → 0.8   Cards rise up into position; title[0] + CTA fade in
 *   0.8 → 1.5   HOLD (Clinical front, Choice peeking right-behind)
 *   1.5 → 2.0   Cards slide left together; z-index swaps; bg + title crossfade
 *   2.0 → 2.7   HOLD (Choice front, Clinical peeking left-behind)
 *   2.7 → 3.0   Exit fade for clean handoff to logo-strip
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

// Tunables — how far the back card peeks out, and the slight scale-down that
// adds depth perception without violating the "real overlap, no blur" rule.
const PEEK_X = '30vw';
const BACK_SCALE = 0.92;

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

    // Section runway: 100vh pin + 150vh of scroll per project + a tail.
    section.style.height = `${100 + PROJECTS.length * 150 + 50}vh`;

    // ——— Render cards + title spans from data ———
    PROJECTS.forEach((p, i) => {
      const card = document.createElement('a');
      card.className = 'featured__card';
      card.href = p.href;
      card.dataset.idx = String(i);
      card.dataset.back = i === 0 ? 'false' : 'true';
      card.setAttribute('aria-label', `${p.name.replace('\n', ' ')} — view project`);
      card.innerHTML = `
        <span class="featured__card-halo"></span>
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
    // Centre transform via GSAP so timeline tweens compose cleanly.
    gsap.set(cards, { xPercent: -50, yPercent: -50 });

    // Card 0: starts below viewport (slides up); ends at centre, front.
    gsap.set(cards[0], { x: 0, y: '60vh', scale: 1, zIndex: 2, opacity: 1 });
    // Card 1+: starts below + offset right; ends back-right peeking.
    cards.forEach((c, i) => {
      if (i === 0) return;
      gsap.set(c, {
        x: PEEK_X,
        y: '60vh',
        scale: BACK_SCALE,
        zIndex: 1,
        opacity: 1,
      });
    });

    gsap.set(titles, { opacity: 0, y: '40%' });
    gsap.set(bgs, { opacity: 0 });
    gsap.set(cta, { opacity: 0, y: 20 });
    if (eyebrowInner) gsap.set(eyebrowInner, { y: '110%', opacity: 0 });

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

    // Phase 0: bg + "FEATURED PROJECTS" title rises up (0 → 0.4)
    tl.to(bgs[0], { opacity: 1, duration: 0.4 }, 0)
      .to(eyebrowInner, {
        y: '0%',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
      }, 0);

    // Phase 1: cards rise into position; first project title + CTA appear
    // (0.4 → 0.8)
    tl.to(cards[0], { y: 0, duration: 0.4, ease: 'power3.out' }, 0.4)
      .to(cards[1], { y: 0, duration: 0.4, ease: 'power3.out' }, 0.4)
      .to(titles[0], { opacity: 1, y: '0%', duration: 0.4, ease: 'power3.out' }, 0.5)
      .to(cta, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.55);

    // Phase 2: HOLD #1 (0.8 → 1.5)
    tl.to({}, { duration: 0.7 }, 0.8);

    // Phase 3: swap — both cards slide LEFT; z-index flips at midpoint;
    // bg + title crossfade (1.5 → 2.0)
    if (cards.length > 1) {
      tl.to(cards[0], {
        x: `-${PEEK_X}`,
        scale: BACK_SCALE,
        duration: 0.5,
      }, 1.5)
        .to(cards[1], {
          x: 0,
          scale: 1,
          duration: 0.5,
        }, 1.5)
        // Z-index swap at the visual midpoint so the previously-back card
        // becomes the top one.
        .set(cards[0], { zIndex: 1 }, 1.75)
        .set(cards[1], { zIndex: 2 }, 1.75)
        .to(bgs[0], { opacity: 0, duration: 0.4 }, 1.55)
        .to(bgs[1], { opacity: 1, duration: 0.4 }, 1.55)
        .to(titles[0], { opacity: 0, y: '-30%', duration: 0.3 }, 1.5)
        .to(titles[1], { opacity: 1, y: '0%', duration: 0.4, ease: 'power3.out' }, 1.7);

      // Phase 4: HOLD #2 (2.0 → 2.7)
      tl.to({}, { duration: 0.7 }, 2.0);

      // Phase 5: exit fade so the next section can take over cleanly
      // (2.7 → 3.0)
      tl.to([cards[cards.length - 1], titles[cards.length - 1], cta, bgs[1], eyebrowInner], {
        opacity: 0,
        duration: 0.3,
      }, 2.7);
    }

    // ——— Active-state tracking: swap CTA href + body class as the user
    // scrolls through. The body class drives the eyebrow watermark colour
    // (light bg vs orange bg). ———
    let activeIdx = 0;
    const setActive = (idx) => {
      if (idx === activeIdx) return;
      activeIdx = idx;
      cta.href = PROJECTS[idx].href;
      cta.setAttribute('aria-label', `View ${PROJECTS[idx].name.replace('\n', ' ')}`);
      document.body.classList.toggle('featured-state-1', idx === 1);
    };

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const idx = Math.min(
          PROJECTS.length - 1,
          Math.floor(self.progress * PROJECTS.length),
        );
        setActive(idx);
      },
      onLeave: () => document.body.classList.remove('featured-state-1'),
      onLeaveBack: () => document.body.classList.remove('featured-state-1'),
    });
  }
}
