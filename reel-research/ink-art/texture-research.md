# Making the ink-art hero feel printed, not digital

How to layer textures over the Codex art so the hero reads as a real woodblock print or ink painting, and stays fast.

## What makes the real thing look real

Traditional Japanese woodblock prints (mokuhanga) are printed by hand, one carved block per colour, onto damp washi paper:

- **Water-based, slightly transparent ink.** Colour sits *in* the paper rather than on top of it, so paper fibre shows through every flat area. [British Museum](https://www.britishmuseum.org/blog/how-make-woodblock-print-hiroshige), [Making a Mark](https://makingamark.blogspot.com/2025/02/about-mokuhanga-japanese-woodblock-printing.html)
- **Hand pressure varies.** The printer rubs the paper with a flat pad (a baren). Harder rubbing gives darker colour, so flat areas are never perfectly even.
- **Bokashi.** Some areas get a soft graded wash, typically sky darkening towards the top of the print. It is the only kind of gradient the style allows.
- **Registration.** Each colour block lines up with the others via notches cut into the block (kento). Real prints sit very slightly off, with a hairline of paper showing between some colours.

The website should copy these four things. It should not copy the frame, the seal or a fake aged-paper look.

## The layer stack (back to front)

1. **Indigo sky** (`#1F3A63` area): flat colour plus a vertical bokashi, slightly darker at the top. This is one CSS linear-gradient with only two close stops, so it doesn't look like a "digital gradient".
2. **Washi paper** (Codex image B5): stretched full-bleed over the sky with `mix-blend-mode: multiply` at about 0.35–0.5 opacity. The fibres then show *through* the indigo, the way real ink sits in paper. Use the same paper multiplied over every cloud layer too, so everything shares one surface.
3. **Sun** (S1 cut-out), **far clouds** (A3/A4), **corner mass** (A2), **front bank** (A1): the transparent PNG cut-outs. A little `opacity: 0.92` on the far clouds pushes them back.
4. **Grain** over the whole hero: a small (256px) pre-rendered noise PNG, tiled with `mix-blend-mode: overlay` (or `soft-light`) at 0.06–0.12 opacity. Pre-render it once, using SVG `feTurbulence` → `feColorMatrix` (grey) → export. Don't run a live SVG filter over a full-screen animated area, because the filter is re-calculated as the layers move. Lower `baseFrequency` gives coarser, more woodblock-like grain. [CSS-Tricks on grainy gradients](https://css-tricks.com/?p=351302), [ExpertBeacon guide](https://expertbeacon.com/how-to-create-grainy-css-backgrounds-using-svg-filters-an-in-depth-guide/)
5. **Headline type** sits on top as real text (not baked into art), in cream `#EEE2C3`. An optional 1px offset ghost in pale blue at low opacity gives a registration feel. Only use it on the big display line; on body text it just looks blurry.

## Small details that sell it

- **Ink edge.** The Codex art already has carved, broken lines, so don't add more distortion to it. If anything plain needs a hand-made edge (the type underline, a divider, the seal-less "Sumi" mark), use an SVG filter: `feTurbulence` into `feDisplacementMap` with a *small* scale (2–4). A large scale melts the shape. [Smashing: SVG displacement filtering](https://www.smashingmagazine.com/2021/09/deep-dive-wonderful-world-svg-displacement-filtering/), [MDN feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap)
- **Palette discipline.** Keep the art's four inks (cream, pale blue, mid blue, indigo) plus the vermilion sun. Every UI colour (buttons, links, focus rings) comes from that set. One extra colour is enough to break the illusion.
- **No drop shadows or glows** on clouds. Prints have no light source. Depth comes from overlap, scale and parallax speed.
- **Edges of the screen.** The A1 bank and A2 corner mass run off the edges by design. Let them bleed past the viewport (scale 105–110%) so a gap never shows during parallax.

## Motion that feels like an animated story, not a slideshow

- **Parallax by depth.** On scroll, the far clouds move slowest, then the sun, the corner mass, and the front bank fastest. With GSAP ScrollTrigger and `scrub`, keep the moves small (front bank ~15% of its height). Big moves look like a template.
- **Drift.** Floating clouds (A3/A4) slide a few % sideways on a slow loop (20–40s, `sine.inOut`), out of sync with each other.
- **Hand-animated "boil" (optional, used sparingly).** Classic hand animation is drawn "on twos", with the picture changing every other frame. Stepping a tiny position or rotation wobble with `ease: "steps(…)"` on one element (the crane, a curl tip) makes it feel drawn rather than tweened. Don't use it on the big layers.
- **Intro.** The sky and paper are there first. The bank rises from below, the corner mass slides in from top-right, then the sun fades up. It's like printing one block after another, and it fits the story theme.
- **`prefers-reduced-motion`.** Keep the layered still image and turn off drift and parallax (`gsap.matchMedia()`).

## Performance budget

- Export each cut-out as WebP or AVIF with alpha, at about 1.5× the largest display size it is shown at (the 1536px Codex images are fine for desktop, with a smaller set for phones via `srcset`).
- Animate only `transform` and `opacity`. Add `will-change: transform` to the 4–5 moving layers only.
- One multiply paper layer and one overlay grain layer cover the whole hero. Don't give each cloud its own texture copy.
