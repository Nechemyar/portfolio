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

const PEEK_X = '24vw';
const BACK_SCALE = 0.86;
const BACK_BLUR = 'blur(10px)';

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

    // Generous height so each "beat" of the scrub timeline (hero overlap,
    // eyebrow rise, eyebrow hold, swap, etc.) gets roughly one swipe of
    // scroll. ~100vh per timeline unit (timeline total is 5).
    section.style.height = `${100 + PROJECTS.length * 220 + 100}vh`;

    PROJECTS.forEach((project, index) => {
      const card = document.createElement('a');
      card.className = 'featured__card';
      card.href = project.href;
      card.dataset.idx = String(index);
      card.dataset.back = index === 0 ? 'false' : 'true';
      card.setAttribute('aria-label', `${project.name.replace('\n', ' ')} - view project`);
      card.innerHTML = `
        <span class="featured__card-halo"></span>
        <div class="featured__card-mask">
          <div class="featured__card-screen">
            <picture>
              <source media="(max-width: 768px)" srcset="${project.screenMob}" />
              <img src="${project.screen}" alt="${project.name.replace('\n', ' ')}" loading="lazy" />
            </picture>
          </div>
        </div>
        <img class="featured__card-cat" src="${project.cat}" alt="" />
      `;
      stack.appendChild(card);

      const span = document.createElement('span');
      span.className = 'featured__title-item';
      span.dataset.idx = String(index);
      span.textContent = project.name;
      titleEl.appendChild(span);
    });

    const cards = stack.querySelectorAll('.featured__card');
    const titles = titleEl.querySelectorAll('.featured__title-item');

    gsap.set(cards, { xPercent: -50, yPercent: -50 });
    gsap.set(cards[0], {
      x: '28vw',
      y: '18vh',
      scale: 1,
      zIndex: 2,
      opacity: 0,
      filter: 'blur(0px)',
    });

    cards.forEach((card, index) => {
      if (index === 0) return;
      gsap.set(card, {
        x: '56vw',
        y: '18vh',
        scale: BACK_SCALE,
        zIndex: 1,
        opacity: 0,
        filter: BACK_BLUR,
      });
    });

    gsap.set(titles, { opacity: 0, y: '40%' });
    gsap.set(bgs, { opacity: 0 });
    gsap.set(cta, { opacity: 0, y: 20 });
    gsap.set('.featured__gradient', { opacity: 0 });
    if (eyebrowInner) gsap.set(eyebrowInner, { y: '110%', opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Beats are laid out so each one is roughly one swipe of scroll. The
    // 0 → 0.7 region holds while the hero stage (which is z-indexed above
    // the featured pin) is still covering, so the eyebrow only starts
    // rising once the hero has fully unpinned.
    //
    //  0   – 0.7  hold during hero overlap
    //  0.7 – 1.3  "Featured Projects" rises up
    //  1.3 – 2.5  "Featured Projects" holds (lands the first swipe)
    //  2.5 – 3.1  eyebrow leaves, card 0 + title 0 + gradient enter
    //  3.1 – 3.7  card 0 holds
    //  3.7 – 4.3  card 0 → card 1 swap (bg crossfades, title crossfades)
    //  4.3 – 4.8  card 1 holds
    //  4.8 – 5.0  everything fades out before the next section

    tl
      // Beat 1: hero overlap hold
      .to({}, { duration: 0.7 }, 0)

      // Beat 2: eyebrow rises
      .to(bgs[0], { opacity: 1, duration: 0.3 }, 0.7)
      .to(eyebrowInner, {
        y: '0%',
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
      }, 0.75)

      // Beat 3: eyebrow holds — a full swipe of "Featured Projects" on screen
      .to({}, { duration: 1.2 }, 1.3)

      // Beat 4: eyebrow leaves while card 0 + title + gradient + cta enter
      .to(eyebrowInner, {
        opacity: 0,
        y: '-22%',
        duration: 0.45,
        ease: 'power2.in',
      }, 2.5)
      .to(cards[0], {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }, 2.5)
      .to(cards[1] || {}, {
        x: PEEK_X,
        y: 0,
        opacity: 0.92,
        duration: 0.6,
        ease: 'power3.out',
      }, 2.5)
      .to('.featured__gradient', { opacity: 1, duration: 0.5 }, 2.55)
      .to(titles[0], {
        opacity: 1,
        y: '0%',
        duration: 0.5,
        ease: 'power3.out',
      }, 2.6)
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, 2.65)

      // Beat 5: card 0 holds
      .to({}, { duration: 0.6 }, 3.1);

    if (cards.length > 1) {
      tl
        // Beat 6: swap card 0 → card 1 (bg + title crossfade together)
        .to(cards[0], {
          x: `-${PEEK_X}`,
          scale: BACK_SCALE,
          opacity: 0.92,
          filter: BACK_BLUR,
          duration: 0.5,
        }, 3.7)
        .to(cards[1], {
          x: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
        }, 3.7)
        .set(cards[0], { zIndex: 1 }, 3.95)
        .set(cards[1], { zIndex: 2 }, 3.95)
        .to(bgs[0], { opacity: 0, duration: 0.4 }, 3.75)
        .to(bgs[1], { opacity: 1, duration: 0.4 }, 3.75)
        .to(titles[0], { opacity: 0, y: '-30%', duration: 0.35 }, 3.7)
        .to(titles[1], {
          opacity: 1,
          y: '0%',
          duration: 0.4,
          ease: 'power3.out',
        }, 3.9)

        // Beat 7: card 1 holds
        .to({}, { duration: 0.5 }, 4.3)

        // Beat 8: final fade out
        .to(
          [cards[cards.length - 1], titles[cards.length - 1], cta, bgs[1]],
          { opacity: 0, duration: 0.3 },
          4.8,
        );
    }

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
        const idx = Math.min(
          PROJECTS.length - 1,
          Math.floor(self.progress * PROJECTS.length),
        );
        setActive(idx);
      },
    });
  }
}
