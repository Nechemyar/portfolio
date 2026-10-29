# Case art options (studio sweep)

One seamless colour sweep per project with a single hard key light, 4:5 at 1600x2000, webp q85.

- `choice/`: Choice Inventory orange #F28C21
- `clinical/`: white #F4F4F2 picked for the set; `01-black-alt.webp` is the black hero option
- `jsense/`: JSense grape #90376B

Plates come from Codex image generation with flat chroma screens. `tools/comp.py` then warps the real
live-site screenshots into them, so every screen shows the real site. Each folder has `palette.json`,
the extracted logos/icons, `prompts.md` and `contact.jpg`.

Known flaw: laptop keycap legends are AI-made glyphs (fine at card size, visible on a tight crop).
