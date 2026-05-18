# Portfolio plan & working state

Living doc so any new Claude session can pick up where the last one stopped
without re-deriving context. Update it as scope shifts.

## Who this is for
Solo web designer (Nechemya / SUMI STUDIOS direction). Premium hand-coded
sites. Brand-led pitch, service-business clients (Clinical Assessments,
Choice Inventory). Hero illustration is a beanie-cat watching a CRT monitor
that screens current project work through a mask cutout.

## Current branch
`claude/confident-ptolemy-5a1b43` — auto-pushed to `origin/main` after
every change (per the user's standing instruction in MEMORY.md).

## Tech stack on this site
- Vanilla HTML + SCSS + JS, bundled by Vite.
- GSAP + ScrollTrigger for scroll-pinned hero/featured.
- Lenis already imported in `js/main.js` for smooth scroll.
- Fontshare CDN for Satoshi (body); Clash Display self-hosted (display) —
  display font is still TBD, see "Open decisions" below.
- No framework. No router. Project pages are full document loads.

## Brand & layout direction
Reference mockup (user-provided) for the hero:
- MENU pill on the left, BOOK A FREE CALL pill on the right (currently
  both are right-clustered; mockup splits them).
- Optional centred SUMI STUDIOS wordmark + cat icon as the nav logo.
- Bottom of hero is a strong rust gradient band that hosts the footer
  row: `[star + tagline]` left, `[Book a free call pill]` centre,
  `[EXPLORE WORK]` right, with a cream hairline divider above.
- Marquee strip ("WEB DESIGN ★") sits ABOVE the gradient band (currently
  below it on mobile via dark band, below on desktop too).
- Tagline copy on the hero: **"I make websites for businesses that give
  a damn"** (matches the meta description). Open to swap to "service
  businesses" if positioning narrows.

## What landed (chronological, most recent first)
- `146da51` Dropped mobile CTA out of the TV body (footer 17vh, marquee 6vh).
- `833ae91` Lifted marquee, removed `.hero__headline` + `.hero__sticker` HTML.
- `a8d5571` Moved hero CTA into the footer row, added the (now-removed)
  mobile headline + 5+ years star sticker. SCSS hooks for `.hero__sticker`
  and `.hero__headline` are still in `_hero.scss` for the planned custom
  SVG sticker.
- `ff58183` Distinct nav pills (rust CTA / charcoal MENU), hero CTA in
  the centre, killed the empty space inside the MENU pill.
- `8cabd6f` Fluid nav via clamp(), marquee dark band on mobile.
- `9d8c701` Mobile hero anchored top:50%, hero-exit slide uses y:vh + autoAlpha.
- `6e5a08a` Mobile-hero.png → WebP, recalibrated mobmask cutout, shared
  reel images across breakpoints.
- `f835570` Cat-cutout assets removed, new hero composition wired up.

## Open decisions (waiting on user)
- **Display font for hero/titles.** Currently Clash Display (Variable
  woff2). Candidates from Fontshare: Khand, Bonny, Boska, General Sans,
  Clash Grotesk. User asked for "thick condensed, easy to read." Probably
  Khand or Bonny; needs vibe check.
- **Tagline X** in "I make websites for X." Default: "businesses that
  give a damn." Alternative: "service businesses."
- **Loader copy.** Current loader is the bnw cat logo + "LOADING". User
  said they want to redesign it. Open question what.

## Roadmap (in priority order)

### Tier 1 — Hero polish (DOING NOW)
- [x] Tagline + star icon in hero footer left column.
- [x] Stronger rust gradient at the bottom.
- [x] Hairline divider above the footer row.
- [x] Switch body font to Satoshi via Fontshare.
- [ ] Pick the new display font (waiting on user).
- [ ] Custom SVG sticker (user is producing this).

### Tier 2 — Loader → hero handoff
Replace the "loader fades, then GSAP entrance plays" two-step with one
continuous gesture. Suggested approach:
1. Loader is the same SVG mark as the nav logo (already
   `colbbord.svg`), centred on a charcoal field.
2. On `loader-ready`: GSAP FLIPs the mark from its centred position to
   the nav slot (top-left of viewport), scales it down to nav-logo
   size, while the charcoal field iris-opens (mask reveal) to expose
   the hero stage underneath.
3. The hero-stage entrance timeline (`new Loader(() => {...})` in
   `js/main.js`) runs *during* the iris reveal, not after — nav slides
   down behind the still-animating logo, marquee rises from below,
   gradient fades in, footer row settles.
4. Total budget: 0.9–1.2s, one ease curve across the whole thing
   (`cubic-bezier(0.65, 0, 0.35, 1)` is a safe default).

Reference: steviaplease.me preloader iris-out animation
(`scaleY(0) → 1` on grid lines with `stagger {each: 0.03, from: "center"}`).

Files to touch: `js/modules/Loader.js`, `js/main.js`, `scss/components/_loader.scss`.

### Tier 3 — Page transitions (project ↔ home)
Cinematic block-wipe in brand colour (rust), inspired by steviaplease.me
but DOM-only (no Vue/Nuxt, no WebGL). Approach:
1. Intercept `a[href*="projects/"]` clicks. `preventDefault()`.
2. GSAP-animate a grid of `.transition-block` panels from
   `transform: translateY(100%)` to `0` with `stagger {each: 0.03,
   from: "center"}` over 0.5s `cubic.out`. Panels are positioned absolutely
   over the whole viewport, rust-coloured.
3. Once the wipe is fully covering, `window.location.href` to the
   destination. The next page is preloaded via `fetch` for ~0 perceived
   load delay.
4. On the destination page (project page), the same panel grid mounts
   pre-painted, then animates out with `translateY(-100%)` + same
   stagger reversed.
5. Direction & colour vary by destination — project pages get rust,
   contact gets accent (TBD), back-to-home gets the inverse direction.

Files to add: `js/modules/PageTransition.js` + `scss/components/_transition.scss`.
Files to touch: `js/main.js` (wire it up), every `<a>` linking out of
the current document.

**Fallback**: if JS is blocked or the user has `prefers-reduced-motion`,
the panels never paint and links navigate normally.

### Tier 4 — Hover micro-interactions
- Magnetic CTA + project cards (GSAP, no WebGL). Cursor proximity tugs
  the element by a small offset, springs back on leave. ~1 hour.
- Optional: link underline draw-on with `clip-path` or `mask`.

### Tier 5 — Optional/signature
- Custom cursor state (`idle / hover / drag`) — small but adds polish.
- WebGL displacement on featured project hover — real cost, defer.
- Fluid colour-wash backdrop — real cost, defer.

## Working agreements
- **Auto-push to main**: every commit gets pushed to `origin/main` via
  `git push origin <branch>:main`, no asking. Memory file
  `feedback_auto_push.md`.
- **Minimal token usage**: user prefers tight responses, no narration.
- **Working directory** is the `confident-ptolemy-5a1b43` worktree even
  when the shell `cwd` defaults to a different worktree — always run
  git/build commands inside `confident-ptolemy-5a1b43`.
- **Preview server**: launch.json in this worktree's `.claude/` points at
  Vite on port 3000 (Vite picks 3000 itself, not the standard 5173).
- **Mask/screen geometry**: never guess. Run
  `ffmpeg -i mobmask.webp -vf "alphaextract" tmp.png` then
  `ffmpeg -loop 1 -i tmp.png -vf "cropdetect=24:2:0" -frames:v 3 -f null -`
  to get exact percentages.

## Known gotchas
- `.hero__mouth-track` and `.featured__card-screen` positions are
  alpha-channel-calibrated to the current mask files. If either mask
  changes, re-run the cropdetect snippet above and update both selectors.
- `aspect-ratio: 1672 / 941` on desktop, `941 / 1672` on mobile — these
  are the hero image aspects, not the mask aspects. They happen to
  match.
- The hero exit timeline animates `.hero__footer`, `.marquee`,
  `.hero__gradient`, and `.hero__cat-wrapper` together. Anything new in
  the hero stage needs to either join that timeline or stay outside the
  stage entirely.
