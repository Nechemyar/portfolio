# Ink art layers (Codex)

Generated on Nechemya's laptop with **codex-cli 0.162.0** through the codex bridge wrapper (`codex-imagegen`, which runs gpt-image-2 with the ChatGPT login; no API key). Generated one at a time, with each file checked by eye.

**Backgrounds:** the model gives no transparent output here, so every image except B5 came out on flat magenta #FF00FF. `cut/<name>-cut.png` is the same art with the magenta keyed out to real alpha (RGBA, with fringe removed). Use the `cut/` files in the site. The keying script is `keyout.py` (`python -I keyout.py <in_dir> <out_dir> NAME ...`).

**Sizes:** Codex returns the 1024x1024 squares at 1254x1254, except B2a, which came back at 1024x1024.

S1 (the sun) and B2c (an extra gold corner take modelled on a reference Nechemya liked) were added on top of the brief.

| File | Size (px) | Cut-out |
|---|---|---|
| A1a.png | 1536 x 1024 | cut/A1a-cut.png |
| A1b.png | 1536 x 1024 | cut/A1b-cut.png |
| A2a.png | 1254 x 1254 | cut/A2a-cut.png |
| A2b.png | 1254 x 1254 | cut/A2b-cut.png |
| A3.png | 1536 x 1024 | cut/A3-cut.png |
| A4.png | 1536 x 1024 | cut/A4-cut.png |
| B1a.png | 1536 x 1024 | cut/B1a-cut.png |
| B1b.png | 1536 x 1024 | cut/B1b-cut.png |
| B2a.png | 1024 x 1024 | cut/B2a-cut.png |
| B2b.png | 1254 x 1254 | cut/B2b-cut.png |
| B3.png | 1536 x 1024 | cut/B3-cut.png |
| B4.png | 1536 x 1024 | cut/B4-cut.png |
| B5.png | 1536 x 1024 | none (full-bleed paper) |
| S1.png | 1254 x 1254 | cut/S1-cut.png |
| B2c.png | 1254 x 1254 | cut/B2c-cut.png |

## Exact prompts

### A1a (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A dense bank of spiral clouds fills the lower 55% of the image, running off the bottom, left and right edges, with a lobed, scalloped top edge. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. The upper 45% of the image is a perfectly flat pure magenta #FF00FF background with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### A1b (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A dense bank of spiral clouds fills the lower 55% of the image, running off the bottom, left and right edges, with a lobed, scalloped top edge. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. The upper 45% of the image is a perfectly flat pure magenta #FF00FF background with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### A2a (requested 1024x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A big mass of spiral clouds pours diagonally out of the top-right corner, running off the top and right edges, and ends toward the lower left in a few curling wisps. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud is a perfectly flat pure magenta #FF00FF background with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### A2b (requested 1024x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A big mass of spiral clouds pours diagonally out of the top-right corner, running off the top and right edges, and ends toward the lower left in a few curling wisps. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud is a perfectly flat pure magenta #FF00FF background with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### A3 (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of a single floating cloud made of tightly wound spiral swirls, drawn with carved, slightly broken lines. The cloud sits on the left and has a long wispy tail that flows to the right and ends in a small curl. The cloud is isolated with generous empty space around it and touches no edge. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. The background is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### A4 (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of one small floating cloud made of tightly wound spiral swirls with a short curling tail, drawn with carved, slightly broken lines. The cloud is isolated in the centre with lots of empty space around it and touches no edge. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. The background is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B1a (requested 1536x1024)

```
Japanese sumi-e ink painting of swirling clouds with curled tips: confident black ink brush outlines with varied line weight, filled with a loose warm gold watercolour wash from #C9A35B to #E3C88E. Elegant and hand-drawn. A bank of these clouds fills the lower 55% of the image, running off the bottom, left and right edges. The upper 45% of the image is a perfectly flat pure magenta #FF00FF background with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B1b (requested 1536x1024)

```
Japanese sumi-e ink painting of swirling clouds with curled tips: confident black ink brush outlines with varied line weight, filled with a loose warm gold watercolour wash from #C9A35B to #E3C88E. Elegant and hand-drawn. A bank of these clouds fills the lower 55% of the image, running off the bottom, left and right edges. The upper 45% of the image is a perfectly flat pure magenta #FF00FF background with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B2a (requested 1024x1024)

```
Japanese sumi-e ink painting: flowing gold cloud strands sweep diagonally out of the top-right corner, running off the top and right edges, and end toward the lower left in curled tips. Confident black ink brush outlines with varied line weight, filled with a loose warm gold watercolour wash from #C9A35B to #E3C88E. Elegant and hand-drawn. Everything that is not cloud is a perfectly flat pure magenta #FF00FF background with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B2b (requested 1024x1024)

```
Japanese sumi-e ink painting: flowing gold cloud strands sweep diagonally out of the top-right corner, running off the top and right edges, and end toward the lower left in curled tips. Confident black ink brush outlines with varied line weight, filled with a loose warm gold watercolour wash from #C9A35B to #E3C88E. Elegant and hand-drawn. Everything that is not cloud is a perfectly flat pure magenta #FF00FF background with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B3 (requested 1536x1024)

```
Japanese sumi-e ink painting of one floating swirl cloud with curled tips: confident black ink brush outlines with varied line weight, filled with a loose warm gold watercolour wash from #C9A35B to #E3C88E. Elegant and hand-drawn. The cloud is isolated in the centre with generous empty space around it and touches no edge. The background is a perfectly flat pure magenta #FF00FF with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B4 (requested 1536x1024)

```
Japanese sumi-e ink painting of a single red-crowned crane in flight, side view, flying from left to right with wings spread wide. Drawn in confident black ink brush line with varied line weight, with a little warm gold watercolour wash (#C9A35B to #E3C88E) and the small red crown patch on its head. Elegant and hand-drawn. The crane is isolated in the centre with generous empty space around it and touches no edge. The background is a perfectly flat pure magenta #FF00FF with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B5 (requested 1536x1024)

```
A plain cream Japanese washi paper texture, full bleed edge to edge, with soft visible fibres and subtle unevenness in tone, warm cream colour around #EEE2C3. Photographed flat and evenly lit. No drawing, no objects, no text, no signature, no seal or stamp, no border or frame, no vignette.
```

### S1 (requested 1024x1024)

```
Japanese ukiyo-e woodblock print of a single round rising sun, a flat vermilion red-orange disc (#D9573B) printed with visible ink texture, slight uneven ink coverage and fine paper grain inside the disc, crisp but hand-printed edge. The disc is centred with generous empty space around it and touches no edge. No rays, no glow, no gradient, no 3D shading. The background is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

### B2c (requested 1024x1024)

```
Japanese ink painting: a great sweep of cloud pours diagonally out of the top-right corner, running off the top and right edges. Long parallel flowing strands like combed wind lines stream toward the lower left and break into big rounded cloud heads with tightly curled spiral tips. Crisp confident black ink outlines with varied line weight; the shapes are filled with a soft warm gold watercolour wash (#C9A35B to #E3C88E) that pools unevenly, leaving some areas pale cream (#EEE2C3). Elegant, hand-drawn, airy. Everything that is not cloud is a perfectly flat pure magenta #FF00FF background with no texture, paper grain, shadow or vignette. No text, no signature, no seal or stamp, no border or frame.
```

