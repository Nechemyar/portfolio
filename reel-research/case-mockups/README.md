# Case page mockups

The case shots (`public/work/case/<project>-01..04.webp`) are flat lays built from
Apple's official iPhone 17 Pro bezel (Silver, from developer.apple.com/design/resources)
with the real sites in the screen and iOS 26 Safari chrome drawn over them.

1. `node capture.js cap` captures each page at 402x812 @3x (the iPhone 17 Pro screen below the
   status bar), lifting pinned buttons above Safari's bottom bar.
2. `node shoot.js ./scenes.js [prefix]` renders each scene in `render.html` (needs `washi.jpg`
   from `public/ink/` next to it) and writes `out/<name>.png`; resize to 1200x1500 webp.

`scenes.js` holds the colours, shadows and layouts. `ios-chrome.py` is the same chrome as markup
for the live phone tiles (used by the case page generator).
