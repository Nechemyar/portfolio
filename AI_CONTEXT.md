# Project: Nechemya Portfolio Website

## What This Is
A premium web design portfolio for a freelance designer/developer.
The goal is to win clients, build trust, and showcase work.
The aesthetic is editorial, confident, dark, with bold typography.

## Tech Stack
- **Build:** Vite
- **Styling:** SCSS (modular, with design tokens auto-injected)
- **Animation:** GSAP 3.15 + ScrollTrigger + Draggable (npm)
- **Smooth Scroll:** Lenis (npm)
- **Text Splitting:** SplitType (npm)
- **Fonts:** ClashDisplay Variable (self-hosted), DM Sans (Google Fonts)
- **No frameworks.** No React, Vue, Tailwind, Bootstrap. Vanilla JS + SCSS.

## File Architecture
```
scss/
├── main.scss              ← Hub (@use only)
├── base/
│   ├── _tokens.scss       ← ALL design tokens (auto-injected by Vite)
│   ├── _reset.scss        ← Reset + base body styles
│   ├── _typography.scss   ← Font faces + type utility classes
│   └── _buttons.scss      ← Button component
└── components/
    ├── _nav.scss
    ├── _menu.scss
    ├── _hero.scss
    ├── _marquee.scss
    ├── _work.scss
    ├── _services.scss
    ├── _pricing.scss
    └── _contact.scss

js/
├── main.js                ← Hub (imports + init)
└── modules/
    ├── SmoothScroll.js
    ├── Menu.js
    ├── ScrollReveal.js
    └── HeroScroll.js
```

## IMMUTABLE RULES
1. **No CSS transitions on GSAP properties.** If GSAP animates it, CSS must not transition it.
2. **Unit matching in animations.** Animate px→px or vw→vw, never mix.
3. **Use vw, not %** for full-screen horizontal measurements (prevents scrollbar jump).
4. **No svh.** Use vh only.
5. **All JS modules use ES6 import/export.** Libraries imported from npm.
6. **SCSS tokens are auto-injected.** Never @use tokens manually in component files.
7. **Output complete files.** Never say "add this somewhere." Give me the full updated file with the file path.

## Design System — Typography

| Step | Variable   | Size                              | Weight | Line Height | Letter Spacing | Use |
|------|-----------|-----------------------------------|--------|-------------|---------------|-----|
| -2   | $fs-xs    | clamp(0.64rem, 0.7vw, 0.7rem)    | 600    | 1.0         | +0.12em       | Labels, uppercase |
| -1   | $fs-sm    | clamp(0.8rem, 0.85vw, 0.85rem)   | 500-600| 1.0         | +0.04em       | Nav, captions |
| 0    | $fs-base  | clamp(0.95rem, 1vw, 1.05rem)     | 400    | 1.65        | 0             | Body text |
| 1    | $fs-md    | clamp(1.15rem, 1.3vw, 1.3rem)    | 500    | 1.5         | 0             | Large body |
| 2    | $fs-lg    | clamp(1.45rem, 1.8vw, 1.75rem)   | 600    | 1.25        | -0.01em       | Subheadings |
| 3    | $fs-xl    | clamp(1.8rem, 2.5vw, 2.4rem)     | 600    | 1.2         | -0.01em       | Section heads |
| 4    | $fs-2xl   | clamp(2.25rem, 3.5vw, 3.2rem)    | 700    | 1.1         | -0.025em      | Page headings |
| 5    | $fs-3xl   | clamp(2.8rem, 5vw, 4.5rem)       | 700    | 1.0         | -0.025em      | Hero sub |
| 6    | $fs-display| clamp(3.5rem, 8vw, 7rem)         | 700    | 0.9         | -0.04em       | Hero heading |
| 7    | $fs-massive| clamp(4.5rem, 12vw, 11rem)       | 700    | 0.9         | -0.04em       | TURN HEADS |

## Design System — Colors
- Background: $c-bg (#1A1A19), $c-bg-elevated (#242423)
- Text: $c-text (#F2F2F0), $c-text-secondary (#A0A09C), $c-text-tertiary (#6B6B67)
- Accent: $c-accent (#C3F832), $c-accent-hover (#D4FF50)
- Soft: $c-soft (#E6BBFF)
- Border: $c-border (rgba 255,255,255, 0.06), $c-border-visible (rgba 255,255,255, 0.12)

## Design System — Spacing (8px grid)
$space-4, $space-8, $space-12, $space-16, $space-24, $space-32,
$space-48, $space-64, $space-96, $space-128, $space-192

## Design System — Radius
$r-sm (8px), $r-md (12px), $r-lg (16px), $r-xl (24px), $r-full (100px)

## Design System — Animation
- Entrances: power3.out, 0.8-1.0s, y: 40px
- Scroll scrub: ease 'none'
- Micro-interactions: back.out(1.7), 0.4-0.6s
- Exits: power2.in, 0.3-0.5s
- Staggers: text 0.06s, cards 0.1s, hero 0.15s

## Anti-AI-Slop Rules
- No drop shadows on dark backgrounds
- No gradient text
- No generic icon packs
- No centered-everything layouts
- No rounded-everything
- No blue/purple gradient CTAs
- USE: generous whitespace, type scale contrast, intentional asymmetry
- USE: one accent color boldly, real content, motion to reveal not decorate

## CURRENT STATE
- [x] Hero: TURN HEADS with scroll parallax, O-grid, cards
- [x] Marquee: pink banner with scrolling text
- [x] Work: 2 project cards (Clinical Assessments, Choice Inventory)
- [x] Services: 3 cards on pink background
- [x] Pricing: 2-tier (Essential £3K, Growth £5K)
- [x] Contact: email + WhatsApp
- [x] Mobile menu: bottom sheet with GSAP drag-to-close
- [ ] Case study pages
- [ ] Page transitions
- [ ] About page
```