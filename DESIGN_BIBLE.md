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
1. `.nav__cta--right`, `.nav__desktop-wrapper` — 1.2s, stagger 0.1, at 0
2. `.hero__base-right` — 1.2s, at +0.15s
3. Title words (SplitText, line masks) — `yPercent` 115 → 0, 1.8s, stagger 0.08, at +0.55s (lands last)

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

Full-screen reel hero (2026-10-28). Section carries `data-nav-theme="light"`.
`height: 100svh`. Every size is a multiple of the nav label `$fs-nav`
(`clamp(0.78rem, 1vw, 0.95rem)`), stepping by 1.5×, so the hero and the menu
bar scale together. Research notes and sources: `/hero-lab/` on the
`claude/project-thread-djm481` preview branch.

Layers (back → front):
- **Reel** (`.hero__reel` / `.hero__video`): fills the whole hero. `$c-reel`
  grey until the video exists. Add `<source data-src>` children (WebM, then MP4)
  and a poster; `js/modules/HeroReel.js` attaches them after `hero:ready`, fades
  the video in once it plays, pauses it off screen, and skips it for
  reduced-motion and Save-Data. The pause button (WCAG 2.2.2) appears only when a
  reel is loaded. Keep the centre of every shot calm so the title stays legible.
  The reel (2026-10-28) is a 27s seamless loop in `public/reel/`: Choice (slider
  drag, price roll, toggles), Clinical (Meet the team glide and hover), JSense
  (accessibility modes), Settle (filters, case arc, hold to pay, paid screen).
  It is HTML motion design over frame-exact recordings of the live sites,
  rendered with HyperFrames; generators and takes live in
  `/mnt/project-files/sumi/reel/loop/`. Portrait screens get their own cut
  (`reel-m.webm` / `reel-m.mp4`, 720×1560, chosen by `media="(orientation:
  portrait)"` on the sources): the camera works close and every click lands
  above the title or below the CTA. It keeps the cursor (his pick over a
  finger dot).
- **Scrim** (`.hero__reel::after`): a fixed dark overlay so white type reads over
  any footage or colour: black 55% at the top, 42% through the middle with a
  soft 32% radial behind the title, 60% at the bottom (darkened for the real
  reel, whose sites are mostly light). Every hero element is
  white (`$c-warm-white`), and the hero is
  `data-nav-theme="dark"` so the nav is white over it. Over the hero the nav's
  top blur is hidden (`.nav--clear`, set by `NavTheme.js` when the active
  section is `#hero`) because a frosted band over moving footage looks odd; it
  fades back in once the trust sheet takes over.
- **Title** (`.hero__title`, `h1`, Satoshi 400): `$fs-hero-title` (5.0625 × nav
  label, ~80px at 1440) and `$fs-hero-title-mobile` (3.375 ×, ~44px at 390),
  `line-height: 0.98`, `letter-spacing: -0.045em`, centred, `max-width: 13ch`.
  Copy: *"Building what AI can't."* BrandelLuchador is not used in the hero; it
  stays in the menu.
- **Subheading** (`.hero__sub`): *"Websites and apps you can't one-shot."*
  Satoshi 400 at 1.625 × nav label (1.375 × on phones), white at 82%,
  1.25 × nav label under the title. The CTA sits 2.5 × nav label below it.
  It wipes up 0.7s after the title starts.
- **CTA** (`.hero__cta` in `.hero__cta-slot`, 2026-10-28): "Book a free call ↗"
  as a muted liquid glass pill under the title, quieter than the rust buttons
  (premium sites keep a hero CTA but tone it down). Nav-label type (700,
  uppercase, +0.06em), height `max(44px, 3.375 × nav label)`. Light glass,
  not smoked: a 5% white tint, refraction 100 and blur 1 so the bending of the
  footage behind it shows, with a soft text shadow keeping the white label
  readable. A dark tint was tried and it flattened the refraction. `js/modules/SumiGlass.js` picks the
  renderer: Chromium gets SVG refraction via backdrop-filter
  (`js/vendor/liquid-glass-web`, MIT); Safari, Firefox and iOS Chrome get
  `VideoGlass.js`, a small WebGL canvas inside the button that refracts the
  reel behind it, and it drops back to the CSS frost if its first 60 frames run
  over 4 ms. Until the reel has sources those browsers keep the frost.
  Reduced transparency gets a solid ink pill. Research and benchmarks: the Hero
  Glass Lab artifact and `/mnt/project-files/sumi/hero-glass/`.
- **Bottom row** (`.hero__base`): mirrors the nav's height and gutter. Only
  "See my work ↓" at nav-label style, on the right; the left line was dropped
  once the subheading existed (it repeated it). Never say "hand-coded" anywhere;
  use "Designed and built by me". The glass CTA above is the hero's only booking prompt; the
  big booking moment still comes after the work section.

Entrance (in `js/main.js`): the frame builds first and the title lands last.
Nav wipes up (1.2s), See my work wipes up (+0.15s), then the title: GSAP
SplitText splits it into words inside line masks and the words rise
(`yPercent` 115 → 0, 1.8s, `expo.out`, stagger 0.08) starting at +0.55s. The
split reverts when done. The CTA is `visibility: hidden` until it wipes up,
and it waits for both title +1.4s and `SumiGlass.ready` (glass fully built and
showing its first frame, capped at 2.5s), so it never appears as frost first
and then swaps to glass.
Reduced motion jumps to the end state.

### 7.1 Leaving the hero: the trust sheet (2026-10-28)

The hero is `position: sticky` inside `.intro`, so it holds while the first
section after it (`.trust`, white, `$r-xl` top corners) slides up over it like
a sheet. As the sheet rises the hero stage (`.hero__stage`) eases back the way
the view behind an iOS sheet does: `scale 1 → 0.92`, `borderRadius 0 → 24px`,
and `.hero__dim` (ink) `0 → 0.55`, with the ink `.hero` background showing
round the corners. Scrubbed (`scrub: 0.6`) from the sheet's top hitting the
bottom of the screen to it reaching the top. Native scroll speed, no pin, no
snapping (NN/g: scrolljacking hurts most when it changes scroll speed while
people read). The sticky ends with `.intro`, so later sections never stack on
the hero. Lives in `js/modules/TrustPanel.js`.

Centred, no eyebrow label (small-caps labels read as AI to him). The trust
line (Satoshi 400, 2.25 × nav on mobile, 3.375 × on desktop, max 20ch, break set by a <br>) is
*"AI can build you a website. It can't build you trust."* with "trust." in
`$c-rust`. Under it, one plain sentence on what Sumi does (`.trust__what`,
1.5 × nav, `$c-text-secondary`, max 40ch, three lines at most because it's
centred), since the hero title doesn't say it (NN/g: say what you do at a
glance). The line's words rise through SplitText line masks, then the
sentence's lines follow, when the sheet passes 55% of the screen. Reduced
motion: no recede, no reveal.
Research and the options he chose from: the "After the Reel" artifact,
copy in `/mnt/project-files/sumi/scroll-story/`.

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
