"""Recolour cut-out frames with a luminance gradient map: same shapes and grain, new inks.

Usage: python -I recolor.py <in_dir> <out_dir> <suffix> NAME [NAME ...]
Reads <in_dir>/<NAME>-cut.png and writes <out_dir>/<NAME>-<suffix>.png, keeping alpha.
"""
import os
import sys

import numpy as np
from PIL import Image

# Rose and navy from the pink Hokusai reference: line ink, wave navy, coral rose, pale pink, cream.
STOPS = [
    (0.00, '#1F2236'),
    (0.35, '#3D4466'),
    (0.58, '#D8697A'),
    (0.76, '#F1B5B8'),
    (0.88, '#F5EAE2'),
    (1.00, '#FBF4EE'),
]

pos = np.array([p for p, _ in STOPS])
rgb = np.array([[int(h[i:i + 2], 16) for i in (1, 3, 5)] for _, h in STOPS], float)

src, dst, suffix, names = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
for name in names:
    im = np.asarray(Image.open(os.path.join(src, name + '-cut.png')).convert('RGBA')).astype(float)
    lum = (0.2126 * im[..., 0] + 0.7152 * im[..., 1] + 0.0722 * im[..., 2]) / 255
    out = np.dstack([np.interp(lum, pos, rgb[:, c]) for c in range(3)] + [im[..., 3]])
    Image.fromarray(out.astype(np.uint8), 'RGBA').save(os.path.join(dst, f'{name}-{suffix}.png'), optimize=True)
    print(name, '->', f'{name}-{suffix}.png')
