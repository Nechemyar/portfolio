# Thin cloud frames (Codex)

These were generated on Nechemya's laptop through the codex bridge wrapper (`codex-imagegen`, gpt-image-2 on the ChatGPT login, with no API key), one at a time, and each was checked by eye and by measurement. They're in the same woodblock style as `../frames/`, but thin and even all the way round so they barely cover the video. The four sides are similar and the corners are no bigger than the sides, so they work as a CSS `border-image` (9-slice).

`cut/<name>-cut.png` is the same art keyed to real alpha with `../keyout.py` (`python -I keyout.py frames-thin frames-thin/cut T1a ...`). The window and the outside are fully transparent, with no pink fringe pixels left.

**Ring thickness** is measured over the middle 60% of each side, from the outer edge of the ring to where the clear window starts. The median is the typical band, and the max is the deepest lobe. **9-slice inset** is the edge margin plus the max depth, rounded up to the nearest 5 px. Use it as `border-image-slice` (in image px) so that no cloudlet is cut through by the slice lines. Because the frames are this regular, the sides also repeat cleanly with `border-image-repeat: round`.

**Rejected take:** the first T2a was off palette, with periwinkle blues (median 87,119,191) and a watercolour look, so I regenerated it with the same prompt.

**Colour note:** none of the takes hits the indigo #2B5A8A exactly. T1a/T1b lean teal (around 60,130,180). T2a/T2b lean cobalt (around 60,91,178), and T2b's pale cloudlets lean lavender. T3a/T3b are the closest to the palette. A CSS `filter: hue-rotate()` or a quick recolour can line them up if needed.

| File | Size (px) | Ring L / R / T / B, median (max) px | 9-slice inset T R B L px | Cut-out |
|---|---|---|---|---|
| T1a.png | 1254 x 1254 | 42 (70) / 41 (73) / 40 (73) / 40 (75) | 95 95 105 90 | cut/T1a-cut.png |
| T1b.png | 1254 x 1254 | 48 (78) / 49 (80) / 44 (74) / 45 (75) | 100 95 100 95 | cut/T1b-cut.png |
| T2a.png | 1536 x 1024 | 33 (57) / 33 (56) / 28 (55) / 28 (55) | 80 80 80 80 | cut/T2a-cut.png |
| T2b.png | 1536 x 1024 | 32 (47) / 32 (46) / 27 (43) / 28 (43) | 65 70 70 70 | cut/T2b-cut.png |
| T3a.png | 1024 x 1536 | 50 (78) / 49 (77) / 44 (70) / 45 (72) | 90 90 95 90 | cut/T3a-cut.png |
| T3b.png | 1024 x 1536 | 43 (74) / 43 (75) / 39 (70) / 39 (70) | 95 95 95 95 | cut/T3b-cut.png |

## Exact prompts

### T1a (requested 1024x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### T1b (requested 1024x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### T2a (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### T2b (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### T3a (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### T3b (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A very thin, delicate frame made of a single even string of small spiral cloudlets and curls, the same width on all four sides, about 4% of the image width thick, running close to the image edges with a thin margin of magenta outside it. Each corner has just one small spiral curl, no bigger than the cloudlets along the sides. No large clouds or clusters anywhere. The window inside is a large empty soft rectangle with a gently lobed inner edge, filling almost the whole image. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

All six takes use the same prompt; T1 came back at 1254 x 1254 (Codex upscales squares).

## Rose and navy recolour (`rose/`)

These are the same six frames recoloured to the palette of a pink Hokusai print Nechemya shared as a reference: navy #3D4466 for the dark ink, coral rose #D8697A, pale pink #F1B5B8 and cream #F5EAE2. A blue frame blends into the sky-blue site and its clouds, and this one reads as a frame. I did no new generation for it. `recolor.py` maps each pixel's luminance onto these inks, keeping the shapes, the grain and the alpha: `python -I recolor.py cut rose rose T1a ...`. `rose/preview-on-sky.png` shows T3a in blue next to T3a and T3b in rose, all on sky blue.
