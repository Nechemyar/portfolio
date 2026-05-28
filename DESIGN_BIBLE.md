# Sumi Studios — Design Bible

The single source of truth for this portfolio. Every visual and motion decision
lives here. If the code and this file disagree, fix one of them — they should
never drift.

Operational rules (git workflow, dev commands, session habits) live in
`CLAUDE.md`. Everything about *how the site looks and moves* lives here.

---

## 1. North Star

Sumi is a sharp independent studio: bold, confident, simple, warm. Big display
type on a warm canvas, generous space, one strong accent, and motion that
reveals rather than decorates. Editorial, not templated. It should never look
AI-generated.

**The reference points are the mobile hero and the post-loader reveal
animation.** They define the standard for type, spacing, color, and motion.
Match their feel everywhere else.

---

## 2. Fonts

Two families. No others.

| Role | Family | Source | Weights | Token |
|------|--------|--------|---------|-------|
| Display / titles | **BrandelLuchador** | self-hosted `assets/fonts/BrandelLuchador-Regular.woff2` | 400 only | `$font-display` |
| Body / UI | **Satoshi** | Fontshare CDN (`api.fontshare.com`), DM Sans fallback | 400, 500, 700, 900 | `$font-body` |

- **BrandelLuchador** is the big voice: the hero "DESIGN" word, menu links, the
  SUMI wordmark, section headings (`h1`–`h4`, `.font-display`). Always uppercase,
  `letter-spacing: 0`, `line-height` near 0.8–1.0, weight 400 (it only ships one
  weight — do not set 700/900 on it expecting a bolder cut).
- **Satoshi** carries all running text, the hero pitch heading, nav labels,
  buttons, captions. This is where weights 500/700/900 do real work.
- Token definitions (`scss/base/_tokens.scss`):
  - `$font-display: 'BrandelLuchador', sans-serif;`
  - `$font-body: 'Satoshi', 'DM Sans', sans-serif;`
- `@font-face` for BrandelLuchador lives in `scss/base/_fonts.scss`. Satoshi is
  loaded async in `index.html` `<head>`.

---

## 3. Type scale

All sizes are `clamp()` tokens in `scss/base/_tokens.scss`. Use the token, never
an ad-hoc size. Utility classes (`.fs-*`) are in `scss/base/_typography.scss`.

| Token | Size | Typical use |
|-------|------|-------------|
| `$fs-xs` | `clamp(0.64rem, 0.7vw, 0.7rem)` | Small uppercase labels |
| `$fs-sm` | `clamp(0.8rem, 0.85vw, 0.85rem)` | Nav, captions |
| `$fs-base` | `clamp(0.95rem, 1vw, 1.05rem)` | Body text |
| `$fs-md` | `clamp(1.15rem, 1.3vw, 1.3rem)` | Large body |
| `$fs-lg` | `clamp(1.45rem, 1.8vw, 1.75rem)` | Subheadings |
| `$fs-xl` | `clamp(1.8rem, 2.5vw, 2.4rem)` | — |
| `$fs-2xl` | `clamp(2.25rem, 3.5vw, 3.2rem)` | — |
| `$fs-3xl` | `clamp(2.8rem, 5vw, 4.5rem)` | — |
| `$fs-section-title` | `clamp(2.15rem, 4.6vw, 4.8rem)` | Section headings |
| `$fs-display` | `clamp(3.5rem, 8vw, 7rem)` | Display |
| `$fs-massive` | `clamp(4.5rem, 12vw, 11rem)` | Oversized statements |

**Heading defaults** (`h1`–`h4`, `.font-display`): BrandelLuchador, `line-height: 1.0`,
`font-weight: 400`, `letter-spacing: 0`, `text-transform: uppercase`.

---

## 4. Color palette

Defined in `scss/base/_tokens.scss`. These hex values are authoritative.

| Token | Hex | Use |
|-------|-----|-----|
| `$c-yellow` | `#f39e38` | Accent bands, highlight moments, default page bg |
| `$c-mustard` | `#c07820` | Borders on yellow, hover/active states |
| `$c-rust` | `#ec4a1e` | **Brand red.** Hero stage bg, primary CTA fill, strong accent |
| `$c-rust-hover` | `#c73b16` | Hover state for rust CTAs |
| `$c-cream` | `#FAF9F7` | Content card backgrounds, light body areas |
| `$c-warm-white` | `#FFFDF9` | Subtle alternative to cream for layering |
| `$c-paper` | `#F3EDE6` | Cards sitting on cream — depth without a border |
| `$c-ink` | `#1A1A1A` | Text, dark sections, nav on light backgrounds |
| `$c-charcoal` | `#2C2C2C` | Dark section backgrounds (warmer than black) |
| `$c-whatsapp` | `#80FF80` | WhatsApp CTA only |

**Semantic aliases:** `$c-bg` = yellow, `$c-text` = ink, `$c-text-secondary`
`#4A4A4A`, `$c-text-tertiary` `#73706B`, `$c-accent` = rust, `$c-border`
`rgba(26,26,26,0.12)`, `$c-border-visible` = ink.

**Rules:**
- Max 3 colors visible in any single viewport (canvas + ink + one accent). The
  restraint is what reads as premium.
- Black/near-black (`$c-ink`) text on bright/warm surfaces. Never white text on
  yellow — low contrast.
- Body text and nav must meet WCAG AA. If a color is pretty but not readable,
  readability wins.
- No generic gradients. One accent used boldly beats many soft ones.

---

## 5. Spacing, radius, motion tokens

**Spacing** — 8px grid (`$space-4` … `$space-192`). Use tokens, not ad-hoc rems.
Page gutter: `$page-padding: clamp(1.25rem, 4vw, 4rem)`.

**Radius** — `$r-sm` 8px · `$r-md` 12px · `$r-lg` 16px · `$r-xl` 24px ·
`$r-full` 100px. Favor boxy 6–14px radii over soft pills.

**Non-GSAP motion tokens** (CSS transitions only):
`$ease-out: cubic-bezier(0.16, 1, 0.3, 1)` · `$duration-fast: 0.3s` ·
`$duration-med: 0.6s`.

---

## 6. Reveal animation system

This is the signature of the site. **One feel everywhere: a mask wiping up.**
Content is hidden, then wipes/slides upward into place with `expo` easing and a
short stagger. The post-loader hero sequence is the gold standard — simple,
clear, and beautiful. Reuse it; do not invent new entrance styles per section.

### 6.1 Loader → hero handoff (the approved timing)
1. `Loader` runs, then fires its completion callback.
2. The callback splits the hero pitch heading into lines, sets `js-loaded`,
   marks the nav ready, and dispatches `hero:ready`.
3. A single GSAP timeline plays the entrance (see 6.2). The overlapping,
   `expo.out` cadence is the feel to preserve.

Lives in `js/main.js` (entrance timeline) and `js/modules/Loader.js`.

### 6.2 Mechanism A — clip-path wipe up (hero + nav entrance)
The default reveal for blocks and large type.

```
from: { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 }
to:   { clipPath: 'polygon(0% -50%, 100% -50%, 100% 150%, 0% 150%)', y: 0,
        duration: 1.2–1.5, ease: 'expo.out', stagger: 0.1 }
```

Hero sequence order (overlapping with negative offsets):
1. `.hero__display-word` — 1.4s
2. `.hero__tv-scene`, `.hero__award-badge`, `.hero__cta-row` — 1.2s, stagger 0.1, `-=1.0`
3. `.nav__logo`, `.nav__cta--right`, `.nav__desktop-wrapper` — 1.2s, stagger 0.1, `-=1.1`
4. `.hero__pitch-line` (text lines) — 1.5s, stagger 0.2, `-=0.8`

Text-line variant (tighter clip):
```
from: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', y: 50 }
to:   { clipPath: 'polygon(0% -20%, 100% -20%, 100% 120%, 0% 120%)', y: 0 }
```

### 6.3 Mechanism B — overflow mask + translateY (menu)
For text in a fixed-height row (menu links). Same upward-wipe feel, achieved by
clipping the wrapper instead of clip-path.

```
wrapper:  overflow: hidden;
inner:    from { y: '-100%' }  →  to { y: '0%', duration: 1.0, ease: 'expo.out', stagger: 0.06 }
```

Menu choreography (`js/modules/Menu.js`):
- Page pushes down `y: 150`, `expo.inOut`, 1.35s (anticipation drag).
- White panel drops `y: -100% → 0`, `expo.inOut`, 1.2s, starting `+0.15s`.
- Link texts wipe up in their masks, staggered 0.06s, once the panel covers them.
- MENU↔CLOSE button: letters slide out/in (`power3`), bracket width tweens between cached open/close widths.

### 6.4 Section scroll reveals
Currently `js/modules/ScrollReveal.js` fades `[data-reveal]` elements
(`opacity` + `y`, `power3.out`, `ScrollTrigger start: 'top 88%'`, `once`).
**Direction:** migrate section reveals to the same wipe-up feel as 6.2/6.3 for
consistency — wrap content in an `overflow:hidden` (`.reveal-overflow`) element
and wipe it up on enter. The fade is the legacy path; the wipe is the standard.

### 6.5 Rules
- **No CSS transitions on any property GSAP animates.** Pick one engine per
  property.
- **Unit matching:** animate px→px or vw→vw, never mix.
- Keep blend-mode elements out of animated parent opacity/transform contexts
  (a parent stacking context kills `mix-blend-mode`).
- Animations must never create visible scrollbars.
- `prefers-reduced-motion`: resolve immediately to the final state. No motion.

---

## 7. Hero spec

The current hero is a full-bleed **rust (`#ec4a1e`)** stage. Section carries
`data-nav-theme="dark"` and `data-bg="#ec4a1e"`. `min-height: 100vh/100dvh`.

**Mobile hero is the approved reference.** Match its simplicity and clarity.

Elements (top → bottom):
- **Pitch heading** (`.hero__pitch-heading`, `h1`, Satoshi, weight 500, white):
  mobile `clamp(1.35rem, 5.2vw, 2rem)`, desktop `clamp(2rem, 2.8vw, 3.2rem)`,
  `line-height: 1.1`, `max-width: 40ch`, left-aligned, vertically centered with a
  bottom offset. Copy: *"We design and develop strategic, beautiful websites that
  capture your brand, convert your audience, and grow with your business."*
- **Award badge** (`.hero__award-badge`, bottom-left): `Award.svg`, rendered
  white via `brightness(0) invert(1)`.
- **CTA** (`.hero__cta-row`, bottom-right): a *text link* "Book a free call" with
  an arrow circle — white, uppercase, weight 700, `letter-spacing: 0.04em`. Not a
  filled pill in the hero.
- **"DESIGN" word** (`.hero__display-word`, bottom, BrandelLuchador 400, white):
  base `clamp(10rem, 75vw, 35rem)`, desktop `clamp(20rem, 25vw, 40rem)`, ≤420px
  `clamp(8rem, 70vw, 22rem)`, `line-height: 0.78`, uppercase, `white-space: nowrap`.
- **Marquee** (`.marquee`): "WEB DESIGN" + star, scrolling.

### Open / not-yet-final (do NOT enshrine as decided)
- **Bottom curve divider** (`.hero-divider`): currently 50vh, `border-radius:
  50% / 100%`. The shape is *wrong* and unresolved — treat as a work in progress,
  not a locked decision. Revisit before documenting a final value.
- **Desktop hero layout**: not finalized. Mobile is the reference; the desktop
  composition still needs work.

---

## 8. Navigation

- Fixed, `z-index: 1200` (above the menu overlay so logo + button stay visible).
- Three-column grid: **MENU** (left) · **SUMI** logo (center) · **Contact** (right).
- Single color system: `.nav.theme-dark` → white text/logo (used on the rust hero
  and dark sections); default → ink. When the menu is open, nav is forced back to
  ink because the menu panel is white.
- MENU button animates its label between **MENU** and **CLOSE** (per-letter slide
  + bracket-width tween). Letters live in `.nav__menu-word--open/--close`.
- Nav labels, CTA, and the menu button use **Satoshi** weight 700 uppercase. The
  SUMI wordmark uses **BrandelLuchador**.

---

## 9. Full-page menu

- Full-page **white** panel, fixed, drops from the top and pushes the page down
  (choreography in 6.3).
- Links use **BrandelLuchador**, uppercase: mobile `clamp(5rem, 20vw, 10rem)`,
  desktop `clamp(3rem, 6vw, 7rem)`, weight 500, `line-height` ~0.85. Each link
  text sits in an `overflow:hidden` item so it wipes up.
- Footer: email + WhatsApp, **Satoshi**, centered at the bottom.
- Desktop hover tints links rust; gate with `@media (hover: hover)`.

---

## 10. Anti-AI / anti-template rules

- No generic gradients, no gradient text, no drop shadows on dark backgrounds.
- No three symmetrical icon-cards as a section's primary layout.
- No stock-photo symmetry. Favor asymmetry, full-bleed objects, intentional space.
- Left-align headings by default; center only short content (e.g. contact CTA).
- Vary heading scale between sections — not everything is the same size.
- All copy must read human. Run the humanizer before committing copy. Top tells to
  kill: "no-X" triple lists and em dashes. Numbers over adjectives.

---

## 11. Touch & hover

- Gate **all** `:hover` states with `@media (hover: hover)`. No hover effects on
  touch devices.
- Mobile tap targets ≥ 44px.
- No generic scale-up-on-hover (1.05 + shadow). If a hover state exists, make it
  one intentional change (color, border, or a small translate) — not all three.

---

## 12. Pre-ship checklist

- Desktop widths: 1280, 1440, 1920. Mobile widths: 360, 390, 430.
- No horizontal overflow. No unintended internal scrollbars.
- Nav contrast readable on the current section.
- Reveal timing matches the hero feel (wipe up, `expo`, staggered).
- Reduced-motion path resolves to final state.
- Tokens only — no ad-hoc sizes, colors, or spacing.

---

## 13. SCSS architecture

- `scss/main.scss` is the hub: it `@use`s every base + component partial.
- **Tokens are NOT auto-injected.** Each partial that needs tokens starts with
  `@use '../base/tokens' as *;` (or `'base/tokens'` from the root). This is the
  correct, current setup — there is no Vite `additionalData` injection.
- Base: `_tokens`, `_fonts`, `_reset`, `_typography`, `_buttons`.
- Components: one partial per section (`_nav`, `_menu`, `_hero`, `_marquee`,
  `_magic-showcase`, `_how-it-works`, `_about`, `_services`, `_pricing`,
  `_testimonials`, `_faq`, `_contact`, `_project-page`, `_loader`).
- JS: ES6 modules under `js/modules/`, wired up in `js/main.js`. Libraries from npm.

### Engineering invariants
1. No CSS transitions on GSAP-animated properties.
2. Unit matching in animations (px→px, vw→vw).
3. Use `vw`, not `%`, for full-screen horizontal measurements (avoids scrollbar jump).
4. Use `vh`, not `svh`.
5. ES6 `import`/`export` for all JS modules.
6. Every SCSS partial `@use`s `tokens` explicitly — never hard-code token values.
