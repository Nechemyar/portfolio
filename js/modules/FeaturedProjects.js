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
    const bgs = document.querySelectorAll('.featured__bg');
    if (!section || !stack || !titleEl || !cta) return;

    // Generous height so each beat of the scrub timeline (hero overlap,
    // card 0 enter, card 0 hold, swap, card 1 hold, fade) gets roughly one
    // swipe of scroll.
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

    // The eyebrow ("Featured Projects") lives in the hero stage now and is
    // driven by ProjectsScroll — it fades out as the hero stage fades out.
    // This timeline starts the first card fading in at the same moment so
    // the user reads it as a crossfade between the title and the card.
    //
    // Featured trigger ranges scroll 200vh → ~740vh (with 350vh hero and
    // -150vh margin overlap).  In timeline units (total ~5):
    //   0    – 0.5  card 0 + title + gradient + cta fade in
    //                (concurrent with hero stage fading out)
    //   0.5  – 1.5  card 0 holds
    //   1.5  – 2.3  swap to card 1 (bg + title crossfade)
    //   2.3  – 3.3  card 1 holds
    //   3.3  – 3.7  final fade out

    tl
      // Beat: card 0 + title + gradient + cta enter (crossfade with hero out)
      .to(bgs[0], { opacity: 1, duration: 0.4 }, 0)
      .to(cards[0], {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      }, 0)
      .to('.featured__gradient', { opacity: 1, duration: 0.45 }, 0.05);

    if (cards.length > 1) {
      tl.to(cards[1], {
        x: PEEK_X,
        y: 0,
        opacity: 0.92,
        duration: 0.5,
        ease: 'power3.out',
      }, 0);
    }

    tl
      .to(titles[0], {
        opacity: 1,
        y: '0%',
        duration: 0.4,
        ease: 'power3.out',
      }, 0.1)
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      }, 0.15)
      // card 0 holds for ~one swipe
      .to({}, { duration: 1 }, 0.5);

    if (cards.length > 1) {
      tl
        // swap to card 1
        .to(cards[0], {
          x: `-${PEEK_X}`,
          scale: BACK_SCALE,
          opacity: 0.92,
          filter: BACK_BLUR,
          duration: 0.5,
        }, 1.5)
        .to(cards[1], {
          x: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
        }, 1.5)
        .set(cards[0], { zIndex: 1 }, 1.75)
        .set(cards[1], { zIndex: 2 }, 1.75)
        .to(bgs[0], { opacity: 0, duration: 0.4 }, 1.55)
        .to(bgs[1], { opacity: 1, duration: 0.4 }, 1.55)
        .to(titles[0], { opacity: 0, y: '-30%', duration: 0.3 }, 1.5)
        .to(titles[1], {
          opacity: 1,
          y: '0%',
          duration: 0.4,
          ease: 'power3.out',
        }, 1.7)
        // card 1 holds
        .to({}, { duration: 1 }, 2.3)
        // final fade
        .to(
          [cards[cards.length - 1], titles[cards.length - 1], cta, bgs[1]],
          { opacity: 0, duration: 0.4 },
          3.3,
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
