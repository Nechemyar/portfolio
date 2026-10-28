# Ink art cloud frames (Codex)

These were generated on Nechemya's laptop through the codex bridge wrapper (`codex-imagegen`, which runs gpt-image-2 on the ChatGPT login, with no API key). They are in the same style as the A set one level up. I made them one at a time and checked each by eye and by measurement: margins to the image edges, a closed ring, and a flat window.

Each frame is a ring of clouds around an empty window, so it can sit on the sky-blue site with a video masked into the opening. The model returns flat magenta #FF00FF, and `cut/<name>-cut.png` is the same art keyed to real alpha with `../keyout.py` (`python -I keyout.py frames frames/cut F1a ...`). In every cut-out the window and the outside are fully transparent (alpha 0), with no pink fringe pixels left.

**Rejected take:** the first F4a had a gap in the top of the ring, so the window was open to the outside. I regenerated it with the same prompt.

The window column gives the window's outer extent, measured from lobe tip to lobe tip. The clear rectangle inside it is a little smaller.

| File | Size (px) | Window (bounding box) | Cut-out |
|---|---|---|---|
| F1a.png | 1024 x 1536 | 88% x 81% | cut/F1a-cut.png |
| F1b.png | 1024 x 1536 | 84% x 79% | cut/F1b-cut.png |
| F2a.png | 1536 x 1024 | 92% x 79% | cut/F2a-cut.png |
| F2b.png | 1536 x 1024 | 92% x 80% | cut/F2b-cut.png |
| F3a.png | 1024 x 1536 | 91% x 86% | cut/F3a-cut.png |
| F3b.png | 1024 x 1536 | 91% x 84% | cut/F3b-cut.png |
| F4a.png | 1536 x 1024 | 91% x 85% | cut/F4a-cut.png |
| F4b.png | 1536 x 1024 | 91% x 84% | cut/F4b-cut.png |

## Exact prompts

### F1a (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A frame made entirely of spiral clouds encircles a large tall empty window in the middle. The cloud ring is slim along the left and right sides (about 8% of the width), a little fuller along the top, and fullest along the bottom (about 14% of the height), with a few bigger swirls at the corners. The window is a soft rounded tall rectangle, about 84% of the width and 76% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F1b (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A frame made entirely of spiral clouds encircles a large tall empty window in the middle. The cloud ring is slim along the left and right sides (about 8% of the width), a little fuller along the top, and fullest along the bottom (about 14% of the height), with a few bigger swirls at the corners. The window is a soft rounded tall rectangle, about 84% of the width and 76% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F2a (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A frame made entirely of spiral clouds encircles a large wide empty window in the middle. The cloud ring is slim along the left and right sides and along the top, and fullest along the bottom (about 14% of the height), with a few bigger swirls at the corners. The window is a soft rounded wide rectangle, about 86% of the width and 74% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F2b (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. A frame made entirely of spiral clouds encircles a large wide empty window in the middle. The cloud ring is slim along the left and right sides and along the top, and fullest along the bottom (about 14% of the height), with a few bigger swirls at the corners. The window is a soft rounded wide rectangle, about 86% of the width and 74% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F3a (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. An asymmetric frame made entirely of spiral clouds encircles a large tall empty window in the middle. The clouds gather mostly in the bottom-left and top-right corners in big swirling clusters, and the ring is very thin elsewhere. The window is a soft rounded tall rectangle, about 84% of the width and 76% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F3b (requested 1024x1536)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. An asymmetric frame made entirely of spiral clouds encircles a large tall empty window in the middle. The clouds gather mostly in the bottom-left and top-right corners in big swirling clusters, and the ring is very thin elsewhere. The window is a soft rounded tall rectangle, about 84% of the width and 76% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F4a (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. An asymmetric frame made entirely of spiral clouds encircles a large wide empty window in the middle. The clouds gather mostly in the bottom-left and top-right corners in big swirling clusters, and the ring is very thin elsewhere. The window is a soft rounded wide rectangle, about 86% of the width and 74% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

### F4b (requested 1536x1024)

```
Japanese ukiyo-e woodblock print of clouds made of tightly wound spiral swirls, drawn with carved, slightly broken lines. An asymmetric frame made entirely of spiral clouds encircles a large wide empty window in the middle. The clouds gather mostly in the bottom-left and top-right corners in big swirling clusters, and the ring is very thin elsewhere. The window is a soft rounded wide rectangle, about 86% of the width and 74% of the height, with a scalloped cloud-lobed inner edge. A thin margin of magenta shows all round outside the ring. Palette strictly limited to cream #EEE2C3, pale blue #B9CDE0, mid blue #86A6C9 and indigo #2B5A8A. Flat printed colour with visible ink and paper grain inside the shapes, elegant and hand-printed. No gradients, no 3D shading, no glow. Everything that is not cloud, both inside the window and outside the frame, is a perfectly flat pure magenta #FF00FF with no texture, grain, shadow or vignette. No text, no signature, no seal or stamp, no straight lines, no rectangular border.
```

