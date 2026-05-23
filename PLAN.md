# Sumi Studios — Full Rebuild Plan

Living doc. Read this FIRST at every session start. Update the "Progress" section at the end of every session.

---

## Vision

The site should feel like one continuous scroll journey, not stacked sections. Think therawmaterials.com meets brethrendesignco.com: a warm yellow canvas that persists underneath, with content panels and cards that slide, morph, and transition over it. The cat (beanie cat watching a CRT) is the brand mascot and appears throughout the site as a character with personality. The tone is a confident independent builder talking straight, not an agency pitching. Retro warmth from the TV aesthetic carries through the whole palette.

---

## Palette (redesigned)

The current palette is scattered (coral, blush, forest green, random). New palette built from the yellow + retro TV warmth:

| Token | Hex | Use |
|-------|-----|-----|
| `$c-yellow` | `#FFB93E` | Hero bg, accent bands, highlight moments |
| `$c-mustard` | `#D4940A` | Darker yellow for borders on yellow bg, hover states, active states |
| `$c-cream` | `#FAF9F7` | Content card backgrounds, body text areas |
| `$c-warm-white` | `#FFFDF9` | Subtle alternative to cream for layering |
| `$c-rust` | `#C75B2A` | Primary CTA fill, strong accent (replaces coral -- deeper, more retro) |
| `$c-ink` | `#1A1A1A` | Text, dark sections, nav on light backgrounds |
| `$c-charcoal` | `#2C2C2C` | Dark section backgrounds (warmer than pure black) |
| `$c-paper` | `#F3EDE6` | Cards sitting on cream, subtle depth without border |
| `$c-whatsapp` | `#80FF80` | WhatsApp CTA only |

**Dropped:** `$c-forest`, `$c-blush`, `$c-peach`, `$c-peach-soft`. These were adding noise without purpose.

**Rule:** Maximum 3 colors visible in any single viewport. Yellow + ink + one accent. The restraint is what makes it feel premium.

---

## Sitemap (optimized order)

The order is designed for conversion psychology: hook > prove > explain > price > reassure > close.

### Homepage sections:

1. **Hero** (DONE -- keep as is)
   Yellow stage, cat watching TV, copy card, marquee, CTAs.

2. **Work showcase** (replaces logo-strip + proof + bento)
   Combine all proof into one powerful section. This is where trust is built. Show the work big, not in tiny cards. Scroll-driven: projects animate in one at a time as you scroll, each with a large screenshot and a one-line result statement ("Lead-gen site. Bookings up 40% in month one." -- or whatever the real number is).

3. **How it works** (replaces bento "how I work")
   Not a bento grid -- a horizontal scroll or scroll-pinned sequence. Three steps that animate in sequence as you scroll: Call > Build > Ship. Each step gets a moment. The cat could appear here watching each phase happen on its TV.

4. **About** (founder section)
   Photo + copy. Short and real. Keep it after the work so they've already seen proof before meeting the person.

5. **Services + what's included**
   Not three generic cards. One section that lists everything they get: custom design, hand-coded, responsive, SEO foundations, accessibility compliance, CMS when needed. Presented as a checklist or feature grid, not marketing fluff. The point: "this is what £3-5K buys you."

6. **Pricing** (two tiers, transparent)
   Keep Essential and Growth. Make the visual treatment match the hero: cream cards on yellow band, boxy borders, clear hierarchy. Featured tier gets the rust accent.

7. **Testimonials** (social proof)
   Two real quotes. No fake third card. Simple cream cards on a dark charcoal band. Photos of real clients.

8. **FAQ**
   Accordion. Keep it clean. The current FAQ content is mostly solid.

9. **Contact / CTA close**
   Big, confident close. Yellow band bookending the hero. The cat could reappear here, maybe looking at the visitor (breaking the fourth wall from the TV). "Let's talk about your site." Single CTA.

10. **Footer**
    Minimal. Copyright, email, location.

### What got cut:
- **Logo strip** -- merged into work showcase. You only have 2 projects, a strip of logos is misleading.
- **Bento grid** -- the "how I work" is better as a scroll-driven sequence than a card grid.
- **Separate proof section** -- merged into work showcase.

### What's new:
- Work showcase as a scroll-pinned, one-project-at-a-time experience
- How-it-works as a scroll-driven animated sequence
- Services section that's honest about what's included (SEO, accessibility, CMS, responsive)
- Cat appearances throughout as a visual thread

---

## The scroll journey (how sections flow)

This is the key differentiator. The site should NOT feel like stacked blocks.

**Hero → Work showcase:**
The hero's yellow background stays. As you scroll past the marquee, the hero content (copy card, cat, CTAs) animates out upward. The yellow persists as the canvas. Work showcase cards slide in from below onto the yellow stage, one at a time as you scroll. Each project is a cream/paper card with a big screenshot and a short description. ScrollTrigger pins each card for a beat before the next one pushes it up.

**Work showcase → How it works:**
The yellow canvas continues. The last project card scrolls away and the "how it works" sequence begins on the same yellow field. Three steps animate in sequence. The cat's TV could show each phase.

**How it works → About:**
Background transitions from yellow to cream. A smooth GSAP color tween on the body/section background, not a hard edge. The about section lives on cream.

**About → Services:**
Cream continues. Services is a cream section with cards.

**Services → Pricing:**
Background transitions back to yellow. Pricing cards are cream on yellow, matching the hero callback.

**Pricing → Testimonials:**
Hard transition to dark charcoal. This is intentional contrast -- after the warm pricing section, the dark band makes the testimonials feel serious and grounded.

**Testimonials → FAQ:**
Transition back to cream. Clean, light, readable.

**FAQ → Contact:**
Background transitions to yellow for the closing CTA band. Bookends the hero.

**Contact → Footer:**
Hard cut to charcoal. Minimal.

---

## Cat creative direction (for GPT image generation)

The cat is a beanie-wearing cat watching a CRT television. Generate variations:

1. **Hero cat** -- current, watching the TV with project work on screen (DONE)
2. **Process cat** -- watching the TV showing a wireframe → design → live site (for "how it works" section)
3. **Contact cat** -- turned toward the viewer, one paw raised like a wave. The TV behind shows a calendar/phone. Breaking the fourth wall.
4. **404 cat** -- staring at static/snow on the TV. Confused expression.
5. **Loader cat** -- the cat mark (colbbord.svg) animated: ears twitch or eyes blink during load.
6. **Favicon** -- tiny cat face, simple, reads at 32x32.

**Style consistency prompts for GPT image:**
- Same beanie (keep the color consistent with the current one)
- Same art style as the hero cat (line weight, color palette, level of detail)
- CRT TV is always the same shape/model
- White/cream background, no complex scenes -- the cat and TV are the only elements
- Warm palette: yellows, creams, rust accents in the scene

---

## Copy direction

**Voice:** A skilled builder talking to a business owner who's been burned by agencies or bad WordPress builds. Direct, specific, no fluff. Not trying to sound clever -- trying to be clear.

**Rules:**
- No em dashes
- No rule of three ("X. Y. Z." parallel structure)
- No "delve/tapestry/landscape/elevate/foster/leverage"
- No promotional superlatives ("stunning/exceptional/world-class")
- Numbers over adjectives: "2 weeks" not "fast turnaround"
- Say what it IS, not what it ISN'T (avoid "no hidden fees, no lock-in, no surprises")
- Read it out loud. If you'd never say it to someone's face, rewrite it.

**Copy will be written section by section during implementation, not all at once upfront.** Each section's copy is drafted, humanized, scored with detect-ai, and approved before moving to the next.

---

## Animation system

All GSAP + ScrollTrigger. No CSS transitions on GSAP properties. All gated with `prefers-reduced-motion`.

| Pattern | Spec | Use |
|---------|------|-----|
| **Content reveal** | `y: 40, autoAlpha: 0` → `y: 0, autoAlpha: 1`, 0.8s, `power3.out` | Default for text/cards entering |
| **Card pin** | ScrollTrigger pin, scrub: true | Work showcase -- each card pins, next pushes it |
| **Background tween** | GSAP `to` on section bg color, tied to ScrollTrigger | Smooth yellow→cream→yellow→charcoal transitions |
| **Stagger** | 0.1s between siblings | Card groups, feature lists |
| **Image scale** | `scale: 0.95` → `1`, same timing as reveal | Project screenshots |
| **Section exit** | `y: -60, autoAlpha: 0`, 0.5s | Content leaving viewport upward |
| **Magnetic hover** | Desktop only (`hover: hover`), GSAP spring | CTAs, project cards |
| **Page transition** | Full-viewport rust panels, stagger from center | Between home ↔ project pages (Phase 3) |

**Reduced motion:** All animations resolve immediately. Elements appear in final position. No motion.

---

## Phases

### Phase 1: Foundation ✅ DONE
- [x] Update `_tokens.scss` with new palette
- [x] Remove dropped colors, update all SCSS files referencing old tokens
- [x] Set up the scroll-driven background color system (GSAP ScrollTrigger tweening body/wrapper background)
- [x] Restructure `index.html` to the new sitemap order
- [x] Remove sections that got cut (logo-strip, bento, old proof)
- [x] Create new section shells (work-showcase, how-it-works)

### Phase 2: Work showcase
- [x] Build the scroll-pinned project card system
- [x] Large project screenshots with one-line descriptions
- [x] ScrollTrigger pin + push animation
- [x] Mobile: stack vertically with reveal animations
- [x] Write copy for project descriptions (humanize pass done; detect-ai API key unavailable locally)

### Phase 3: How it works
- [x] Build the scroll-driven three-step sequence
- [x] Plan cat illustration for this section (provide GPT prompt)
- [x] Animate steps in sequence on scroll
- [x] Write copy (humanize pass done; detect-ai API key unavailable locally)

### Phase 4: About
- [x] Redesign layout to match new palette and spacing
- [x] Rewrite copy — direct voice, specific numbers, no em dashes, no agency fluff
- [x] About label changed to yellow tag (matching hero visual language)
- [x] About meta tags replace single signature line (location + worldwide + design+code)
- [x] Services background corrected from $c-yellow to $c-cream (matches data-bg)
- [x] Services card labels changed to yellow, card bodies to $c-paper for depth
- [x] Background transition from yellow → cream works via existing BgScroll.js

### Phase 5: Services + what's included
- [ ] Build the honest feature list/grid
- [ ] Include: custom design, hand-coded, responsive, SEO, accessibility, CMS
- [ ] Write copy (humanize + detect-ai)

### Phase 6: Pricing
- [ ] Restyle cards to match hero visual language (cream on yellow, boxy borders)
- [ ] Keep two tiers, refine copy
- [ ] Background transition back to yellow

### Phase 7: Testimonials + FAQ + Contact
- [ ] Testimonials: two real cards on dark charcoal band, cut the fake third card
- [ ] FAQ: clean up, keep content, ensure accordion uses GSAP not CSS
- [ ] Contact: yellow band, big CTA, cat illustration (provide GPT prompt)
- [ ] Write/rewrite copy across all three (humanize + detect-ai)

### Phase 8: Polish
- [ ] Mobile pass at 360, 390, 430px for every section
- [ ] Hover states gated with `@media (hover: hover)`
- [ ] Magnetic CTA effects (desktop)
- [ ] Loader animation with cat mark
- [ ] Page transitions (home ↔ project pages)
- [ ] Performance audit (run performance skill)
- [ ] Accessibility audit (run accessibility skill)
- [ ] SEO audit (run seo-optimizer skill)
- [ ] Final humanizer pass on all visible copy
- [ ] Design consistency check against hero (spacing, sizing, weights, radii)

---

## Progress

### Completed
- [x] Hero section (design approved)
- [x] Skills environment set up (33 skills)
- [x] CLAUDE.md, DESIGN_BIBLE.md configured
- [x] Stale worktrees cleaned up
- [x] Phase 1: Foundation
- [x] Phase 2: Work showcase
- [x] Phase 3: How it works
- [x] Phase 4: About

### Current phase
Phase 5: Services + what's included

### Decisions made
- Cat is the brand, will appear in 3-4 places across the site
- Scroll-driven journey with yellow canvas persisting, background tweens between sections
- Two-tier pricing stays, transparent
- Homepage priority over project pages
- New palette: yellow/mustard/rust/ink/cream (dropped blush, forest, peach)
- New sitemap: Hero > Work > How it works > About > Services > Pricing > Testimonials > FAQ > Contact

### Next session
Start Phase 5: rebuild the Services section as an honest feature checklist/grid — custom design, hand-coded, responsive, SEO foundations, accessibility compliance, CMS when needed. The goal is to make it clear what the price buys, not to sell the services abstractly.

Note: hero CTA button still uses hardcoded #FF9C7D (old salmon/blush). Needs updating to $c-rust (#C75B2A) — deferred, hero is "keep as-is" until Phase 8 polish pass.

Latest Phase 4 verification:
- About section completely redesigned for premium typography and vertical photo parallax reveals using GSAP ScrollTrigger and SplitType.
- Desktop layout powered by CSS Grid areas, aligning photo on the left with title/bio stack on the right.
- Mobile layout redesigned to stack in correct editorial order: header introduces Nechemya first, then centers the yellow-matted photo, then presents the bio card.
- Removed opaque section-level backgrounds across all major sections (.about, .services, .pricing, .faq, .testimonials, .work-showcase) to make body's color-changing scroll transitions completely transparent and seamless.
- Tests updated in `tests/about.test.cjs`. `npm test` passes (14 tests) and production Vite build compiles successfully.

Latest Phase 2 verification:
- `npm test` passes (3 tests)
- `npm run build` passes
- Browser checked at desktop 1280/1440/1920 and mobile 360/390/430 with no horizontal overflow
- HumanizerAI detect-ai could not run because `HUMANIZERAI_API_KEY` was not set

Latest Phase 3 verification:
- Work showcase pin rechecked in browser: pinned card center matches viewport center at desktop 1280x900
- Header weights aligned to the hero pitch heading weight (`font-weight: 500`)
- `npm test` passes (8 tests)
- `npm run build` passes
- Browser checked How it works at desktop 1280 and mobile 360/390/430 with no horizontal overflow
- HumanizerAI detect-ai could not run because `HUMANIZERAI_API_KEY` was not set

Latest pin/process polish verification:
- Work showcase pin uses transform pinning; browser measured 0px left/center delta through pin entry at desktop 1280/1440/1920
- How it works desktop content fits inside a 900px viewport; stage bottom stays within viewport at 1280/1440/1920 widths
- Nav backing on yellow sections is translucent yellow with blur/saturate instead of a solid menu bar
- Mobile How it works rechecked at 360/390/430 with no horizontal overflow
- `npm test` passes (9 tests)
- `npm run build` passes

Latest nav polish verification:
- Nav no longer changes colour by section; logo, menu label, and mobile hamburger stay black
- Nav morphs from transparent top state into a blurred white glass pill with 8px button-matched corners after scroll
- Browser checked desktop and mobile hash navigation to How it works; nav backing remains white, blurred, rounded, and without horizontal overflow
- `npm test` passes (10 tests)
- `npm run build` passes

Latest compact nav polish verification:
- Desktop nav now morphs into a compact centered solid cream pill with 14px corners, no glass/blur, and tighter logo/menu spacing
- Sumi wordmark is smaller on desktop and mobile
- Mobile open menu edges align to the hero card edges at 8px margins
- Browser checked desktop 1280/1920 and mobile 390 with no horizontal overflow
- `npm test` passes (11 tests)
- `npm run build` passes

Process cat GPT prompt:
Create a warm editorial illustration in the same style as the existing Sumi Studios hero cat: a beanie-wearing cat sitting beside a chunky CRT television, cream background, black ink outlines, warm yellow and rust accents, no extra room details. The TV screen shows a simple three-stage website build sequence: wireframe, visual design, live site. Keep the same beanie color, same CRT shape, same line weight, and the same soft retro texture as the hero image. The cat should face the TV with focused builder energy, slightly curious, not goofy. Transparent or cream background, subject centered, enough negative space for use inside a web section.

---

## Session handoff protocol

**Ending a session:**
1. Update the "Progress" section above
2. Note what was completed, what's next
3. Commit and push

**Starting a session:**
1. Read this PLAN.md
2. Read DESIGN_BIBLE.md if doing visual work
3. Check skill-observations/log.md for open observations
4. Continue from the current phase

## Working agreements
- Auto-push to main after every change
- Minimal token usage, concise responses
- Run humanizer on all copy before committing
- Check mobile at 360/390/430px after layout changes
- No hover effects without `@media (hover: hover)` gate
- Use tokens from `_tokens.scss`, no ad-hoc values
- The hero sets the standard for spacing, sizing, and hierarchy
