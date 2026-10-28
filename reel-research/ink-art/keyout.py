"""Key a flat #FF00FF background out of each PNG: writes <name>-cut.png with real alpha.

Usage: python -I keyout.py <in_dir> <out_dir> NAME [NAME ...]
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

LO, HI = 40.0, 190.0  # magenta-ness (min(R,B) - G) below LO = opaque art, above HI = background

src, dst, names = sys.argv[1], sys.argv[2], sys.argv[3:]
for name in names:
    rgb = np.asarray(Image.open(os.path.join(src, name + '.png')).convert('RGB')).astype(float)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    key = np.minimum(r, b) - g
    alpha = 1.0 - np.clip((key - LO) / (HI - LO), 0, 1)
    # Treat any sizeable magenta region as background, including pockets enclosed
    # by the art; tiny pinkish specks inside the art stay opaque.
    bg = ndimage.binary_dilation(key > HI, iterations=3)
    lab, n = ndimage.label(bg)
    sizes = ndimage.sum(np.ones_like(key), lab, range(1, n + 1))
    bg_conn = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 400])
    alpha = np.where(bg_conn, alpha, 1.0)
    # None of the inks are magenta-ish, so any strongly magenta pixel left is a fringe speck.
    alpha = np.where(key > 110, 0.0, alpha)
    # Unmix the magenta out of semi-transparent edge pixels so no pink fringe remains.
    a = np.maximum(alpha, 1e-3)[..., None]
    magenta = np.array([255.0, 0.0, 255.0])
    col = np.clip((rgb - (1 - a) * magenta) / a, 0, 255)
    # Despill: wherever red and blue both exceed green, pull them down to green.
    # The inks (cream, blues, gold, black, vermilion) never have that, so only fringe changes.
    spill = np.clip(np.minimum(col[..., 0], col[..., 2]) - col[..., 1], 0, None)[..., None]
    col = col - spill * np.array([1.0, 0.0, 1.0])
    out = np.dstack([col, alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(dst, name + '-cut.png'), optimize=True)
    soft = ((alpha > 0.01) & (alpha < 0.99)).sum() / max((alpha > 0.01).sum(), 1)
    print(name, out.shape[1], 'x', out.shape[0], 'transparent share', round(float((alpha < 0.01).mean()), 2),
          'soft edge share', round(float(soft), 3))
