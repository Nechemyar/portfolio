# Cloud PNG candidates (v2)

Every PNG below was opened with Pillow and checked: mode RGBA, 245-256 distinct alpha levels (soft feathered edges, not 0/255), and no visible pixels on the image border unless noted.

Licences:
- **Pixabay Content License**: free for commercial use with no attribution required. It does not allow selling the image unaltered or redistributing it as a stock asset. Summary: https://pixabay.com/service/license-summary/
- **Unsplash License**: free for commercial use with no attribution required (credit appreciated). It does not allow compiling the photos into a competing image service. https://unsplash.com/license

Pixabay's maximum size without a login is 1280px wide, so none of the PNGs reach 1500px.

## Transparent PNGs

| File | Size (px) | Type | Source page | Author | Licence |
|---|---|---|---|---|---|
| medium-cumulus-pixabay-2421760.png | 1280 × 872 | medium cumulus, flat grey base | https://pixabay.com/illustrations/cloud-isolated-cumulus-transparent-2421760/ | 95C (pixabay.com/users/95c-484762) | Pixabay Content License |
| medium-puff-pixabay-5992791.png | 1280 × 1280 | medium round puff, greyish; may need brightening | https://pixabay.com/illustrations/cloud-cumulus-rain-cloud-fluffy-5992791/ | 95C (pixabay.com/users/95c-484762) | Pixabay Content License |
| wispy-pixabay-7081494.png | 1280 × 905 | wispy, layered | https://pixabay.com/illustrations/clouds-sky-cumulus-cutout-airspace-7081494/ | alienized (pixabay.com/users/alienized-11040952) | Pixabay Content License |
| wispy-pixabay-7081496.png | 1280 × 847 | wispy, darker underside | https://pixabay.com/illustrations/clouds-sky-cumulus-air-atmosphere-7081496/ | alienized (pixabay.com/users/alienized-11040952) | Pixabay Content License |
| small-puffy-pixabay-7296025-a.png | 704 × 340 | small puffy | https://pixabay.com/illustrations/sky-clouds-weather-cutout-7296025/ | placidplace (pixabay.com/users/placidplace-25572496) | Pixabay Content License |
| small-puffy-pixabay-7296025-b.png | 733 × 429 | small puffy | same as above | placidplace | Pixabay Content License |
| small-puffy-pixabay-7296025-c.png | 651 × 360 | small puffy | same as above | placidplace | Pixabay Content License |
| small-puffy-pixabay-7296025-d.png | 762 × 344 | small puffy | same as above | placidplace | Pixabay Content License |
| small-puffy-pixabay-7296025-e.png | 613 × 410 | small puffy | same as above | placidplace | Pixabay Content License |
| small-puffy-pixabay-7296025-f.png | 729 × 373 | small puffy | same as above | placidplace | Pixabay Content License |

Notes:
- `small-puffy-*-a` to `-f` are separate clouds cut from one 8-cloud sheet (7296025), split along the alpha channel with a 24px transparent margin. They are slightly translucent (95th-percentile alpha 217-240), so they read as soft and airy. The sheet's other two clouds touch the image edge with a hard line and were dropped.
- `wispy-pixabay-7081494.png` has a near-invisible alpha of 8 or less on its left and right borders.
- Rejected: Pixabay 9242073 (a good big cumulus, but Pixabay labels it "AI generated"), plus about 170 other Pixabay "cloud png" results that were cartoon or vector clipart, had no alpha channel, were cropped at the edge, were low-poly, or were brown or stormy.

## Big cumulus: full-resolution photos to cut out (fallback)

Pixabay had no real, non-AI, transparent big cumulus. These are single, complete clouds on a clean, even sky, fully inside the frame, at native resolution or at most 4000px wide.

| File | Size (px) | Sky | Source page | Author | Licence |
|---|---|---|---|---|---|
| photos-to-cut/unsplash-A9_IsUtjHm4.jpg | 3872 × 2592 | clean mid blue, one big cumulus | https://unsplash.com/photos/A9_IsUtjHm4 | engin akyurt | Unsplash License |
| photos-to-cut/unsplash-v4y57MHKi20.jpg | 4000 × 2667 | blue, one big cumulus, a few tiny wisps at the edges | https://unsplash.com/photos/v4y57MHKi20 | engin akyurt | Unsplash License |
| photos-to-cut/unsplash-K-Iog-Bqf8E.jpg | 4000 × 2641 | dark teal, one isolated fluffy puff | https://unsplash.com/photos/K-Iog-Bqf8E | C Dustin | Unsplash License |
| photos-to-cut/unsplash-BWCgQw25XUE.jpg | 4000 × 2251 | teal, one compact puff | https://unsplash.com/photos/BWCgQw25XUE | José Ramos | Unsplash License |
| photos-to-cut/unsplash-wA-hpHErU_I.jpg | 1892 × 3364 | light cyan, one small flat cloud | https://unsplash.com/photos/wA-hpHErU_I | Anurag Challa | Unsplash License |
