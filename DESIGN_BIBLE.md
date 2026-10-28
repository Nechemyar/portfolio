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

## 7. Hero spec: the ink-print sky intro (2026-10-28)

The hero, the reel and the trust line are one scroll over a printed sky, in
the style of a Japanese woodblock print. It leans into the name (sumi is
ink). Nechemya picked indigo over a gold-ink version, then found the indigo
ground too heavy and asked for a lighter sky-blue wash. Every size is a
multiple of the nav label `$fs-nav` (`clamp(0.78rem, 1vw, 0.95rem)`),
stepping by 1.5×, so the intro and the menu bar scale together. Mock and
references: the "Sumi Ink Clouds" artifact, with a copy in
`/mnt/project-files/sumi/ink-clouds/`.

**Structure** (`.intro`, three sections):
- `.hero` (100svh)
- `.reel` (270svh, its scroll held by CSS sticky)
- `.trust` (100svh)

All three are `data-nav-theme="dark"` (white nav), and the nav's top blur is
hidden over the whole intro (`.nav--clear`, set in `NavTheme.js`). The next
section slides on like a sheet: `-$r-xl` margin and `$r-xl` top corners, with
the sky showing round them.

**The sky** (`.intro__sky` canvas, `js/modules/InkSky.js`, WebGL1)
- The canvas is sticky for the whole intro, at 100lvh.
- **Art.** Painted with Codex in a woodblock style and keyed to alpha. It lives
  in `public/ink/`: `sun`, `wisp`, `puff`, `corner`, `bank` and `washi`.
  Prompts and the full set are on branch `claude/project-thread-w80ans` in
  `reel-research/ink-art/`.
- **Pass 1** draws the ground as a sky wash, graded from `$c-sky` at the top
  to `$c-sky-pale` at the horizon (`SKY` in InkSky.js), with soft ink
  unevenness, then the layers from far to near.
- **Pass 2** composites, in this order:
  1. The glass CTA.
  2. The bokashi band: the printer's deeper blue wipe (`$c-indigo`) along the
     top 36% of the sky. It also keeps the white nav readable.
  3. Washi multiplied at 24%, so fibres show through the ink.
  4. Fine grain.
  Paper and grain are done in the shader, not as CSS blend layers, because
  they're free there.
- **Layout.** Resting places are set per breakpoint in `GEO`, as fractions of
  the canvas. On phones the wisp and bank have height caps (`h`) so short
  screens don't grow the art down into the words, and the corner cloud is
  small and turned 18° (`rot`) so it lies level along the top: he found it
  too slanted. No cloud may cross
  the title (his feedback).
- **Drift.** Each layer drifts a few px on a slow sine. There is no drift for
  reduced motion.
- **DPR.** Capped at 1.5 on phones and 2 on wide screens.
- **No WebGL.** The bank shows as a CSS background and the CTA keeps its frost.

**The story** (`js/modules/InkStory.js`)
One scrubbed GSAP timeline (`scrub: 0.6`) runs from the top of the intro to its
bottom, measured in svh of scroll (about 257 in all) so every beat lands on
its section:
- **0–100:** the clouds part. The corner goes up and right, the bank drops, the
  wisp and puff go out to the sides, and the sun slides left.
- **0–77:** the reel card rises from under the hero and opens out a touch
  (scale only).
- **170–257:** the clouds close back in and the sun sets behind the bank,
  arriving as the trust line reaches the middle.

The sky moves by tweening `InkSky.state`, so nothing in the DOM repaints.

The hero words scroll natively. The CTA glass is drawn by the sky shader
into its patch of the sky and copied each frame into a canvas inside the
button (`.hero__cta-glass`, `InkSky.glassPatch`). Drawn straight into the
sticky sky, the glass trailed the label by a frame on phones and he saw the
button text "move"; inside the button they can't come apart.

The entrance prints the sky in one block at a time (`printIn`: sun, then far
clouds, then near clouds, 1.1s each, 0.14s stagger) while the nav builds.

**The reel** (`.reel__card`)
- **Frame.** The footage is masked into the window of a ring of printed
  clouds, painted with Codex in the same woodblock style as the sky
  (`public/ink/frames/`; prompts and raws on branch `claude/project-thread-w80ans`
  in `reel-research/ink-art/frames/`). Phones use a tall frame (2:3), wide
  screens a wide one (3:2). Each frame has a window mask (`-mask.png`) that
  tucks the video under the inner cloud edge but never past the ring. Swap
  frames with `--frame` and `--frame-mask` on `.reel`. No card edge and no
  shadow: he rejected the washi scroll with rods as fake (2026-10-28), then
  asked for a cloud frame.
- **Peek.** `.reel` is pulled up so the frame's top shows from under the
  near clouds at the bottom of the first screen (`--reel-peek`). The clouds
  part as it scrolls up, opening out from 0.94 scale, then it holds under
  the menu bar (`--reel-top`) while the sky moves round it. Side margin
  `--reel-edge` (8px on phones).
- **Layers.** Back to front: the sky canvas, the reel, the near clouds
  (bank and puff, as `<img>`s in `.intro__front`, placed by InkSky with the
  same maths in the same frame, washi baked into the files), then the hero
  and trust words. `.intro` isolates its stacking.
- **Sources.** Phones get `reel-m` (portrait). Wide screens get `reel.webm`
  (1200px and up) or `reel-720` (16:9).
- **Loading.** `HeroReel.js` loads the video after the loader, fades it in and
  pauses it off screen.
- **Pause.** A pause button sits at the bottom of the held card (WCAG 2.2.2).

The reel is a 27s seamless loop of the real sites, rendered with HyperFrames.
Its sources are in `/mnt/project-files/sumi/reel/loop/`.

**Type.** All type on the sky is white (`$c-sky-type`) with a soft blue
shadow (`$c-sky-shade`). He tried ink-blue type on the sky wash and preferred
white. There are no symbols or seals: he
asked for the kanji to go.
- **Title** (`.hero__title`, `h1`, Satoshi 400):
  - Size `$fs-hero-title` on desktop and `$fs-hero-title-mobile` on phones.
  - `line-height: 0.98`, `letter-spacing: -0.045em`, centred, `max-width: 13ch`.
  - The whole group is centred at 50% (46% on wide screens), in the open sky
    between the corner clouds and the bank.
  - Copy: *"Building what AI can't."* BrandelLuchador is used only in the menu.
- **Subheading** (`.hero__sub`): *"Websites and apps you can't one-shot."*
  - Size 1.625 × the nav label (1.375 × on phones), at 92% opacity.
  - It sits 1.25 × the nav label under the title.
- **CTA** (`.hero__cta`): "Book a free call ↗", a light glass pill.
  - Type matches the nav label, and the height is `max(44px, 3.375 × nav label)`.
  - `SumiGlass.js` lets InkSky draw the glass in its shader whenever WebGL is
    up, so it bends the clouds the same way in every browser.
  - The rim refracts with a small colour split. Light falls only on the edges
    facing it (top left), with a bevel and no full white border.
  - Without WebGL, Chromium gets liquid-glass-web and everything else gets
    frost. Reduced transparency gets a solid pill.
  - Never darken the glass itself to help legibility.

**Entrance** (`js/main.js`):
- The nav wipes up while the sky prints in.
- At +0.55s the title's words rise through SplitText line masks (1.8s,
  `expo.out`, stagger 0.08), and the subheading follows.
- The CTA waits for both the title (+1.4s) and the glass being ready (capped at
  2.5s), so it never shows as frost first.
- Reduced motion jumps to the end state.

### 7.1 The trust line

The last screen of the intro sits on the sky, centred, with no eyebrow label.
- **The line** (Satoshi 400, 2.25 × the nav label on phones and 3.375 × on
  desktop, max 20ch, break set by a `<br>`): *"AI can build you a website.
  It can't build you trust."* "trust." is in `$c-rust`.
- **The sentence under it** (`.trust__what`, 1.5 × the nav label, white at 92%,
  max 40ch): one plain sentence on what Sumi does.
- **Reveal.** The line's words rise through line masks, then the sentence follows
  (`TrustPanel.js`).
- The clouds close in round it as it arrives.

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
