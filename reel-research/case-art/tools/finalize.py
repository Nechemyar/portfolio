"""python finalize.py <gen dir> <cap dir> <portfolio repo>
Upscales plates, composites real screens, writes webp/contact/prompts/palette into reel-research/case-art/<project>/."""
import os, sys, json, shutil, subprocess
import cv2
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
from prompts import JOBS, p, WHITE

GEN, CAP, REPO = sys.argv[1:4]
HERE = os.path.dirname(__file__)
NAMES = {"choice": "choice", "clinical": "clinical", "jsense": "jsense"}
ORDER = {"choice": ["01", "02", "03", "04"], "clinical": ["01-white", "01-black", "02", "03", "04"], "jsense": ["01", "02", "03", "04"]}
OUTNAME = {"01-white": "01", "01-black": "01-black-alt"}
PALETTE = {
    "choice": {"source": "https://choiceinventory.co.uk (logo PNG + computed CSS)", "backdrop": "#F28C21",
               "colors": {"brand-orange": "#F28C21", "ink": "#1D1E20", "white": "#FFFFFF", "grey": "#8C8C8C"}},
    "clinical": {"source": "https://clinicalassessments.co.uk (computed CSS, Astra/Elementor globals)", "backdrop": "#F4F4F2 (white chosen; black alt #0E0E10)",
                 "colors": {"indigo": "#312B72", "teal": "#4A7973", "teal-dark": "#426A65", "ink": "#121212", "grey": "#6D7882", "off-white": "#F5F5F5"}},
    "jsense": {"source": "https://jsense.org.uk (CSS tokens, OKLCH converted to hex; logo SVG fills)", "backdrop": "#90376B",
               "colors": {"grape": "#90376B", "grape-oklch": "oklch(47.7% 0.134 347)", "grape-dark": "#6B224D", "grape-band": "#AE4883",
                          "logo-plum": "#8B2C6A", "logo-orange": "#F5821F", "logo-green": "#518B5D", "sun": "#F5BA14", "ink": "#2C252B"}},
}
SCREENS = {}  # filled from prompts.JOBS


def upscale(src, dst):
    im = cv2.imread(src); h, w = im.shape[:2]; t = 0.8
    if abs(w / h - t) > 0.01:
        if w / h > t: nw = int(h * t); im = im[:, (w - nw) // 2:(w - nw) // 2 + nw]
        else: nh = int(w / t); im = im[(h - nh) // 2:(h - nh) // 2 + nh]
    cv2.imwrite(dst, cv2.resize(im, (1600, 2000), interpolation=cv2.INTER_LANCZOS4))


report = {}
for proj, ids in ORDER.items():
    out = os.path.join(REPO, "reel-research", "case-art", NAMES[proj]); os.makedirs(out, exist_ok=True)
    md = [f"# {NAMES[proj]} case art: prompts\n",
          "Generated with Codex CLI image generation (gpt-image-2). Each plate is rendered with flat chroma screens "
          "(#00FF00, and #00FFFF for the second phone); the real live-site screenshot (captured headless at 390x844 @3x "
          "and 1440x900 @2x) is then perspective-warped into the screen with `comp.py`, with the chroma mask as alpha.\n"]
    tiles = []
    for jid in ids:
        raw = os.path.join(GEN, proj, f"{jid}-raw.png")
        if not os.path.exists(raw):
            report[f"{proj}/{jid}"] = "missing plate"; continue
        prompt, scr = JOBS[proj][jid]
        if proj == "clinical" and not jid.startswith("01"): prompt = p(WHITE, prompt)
        up = raw.replace("-raw", "-up"); upscale(raw, up)
        comp = raw.replace("-raw", "-comp")
        args = [sys.executable, os.path.join(HERE, "comp.py"), up, comp] + [f"{k}={os.path.join(CAP, proj, v + '.png')}" for k, v in scr.items()]
        r = subprocess.run(args, capture_output=True, text=True)
        ok = r.returncode == 0
        name = OUTNAME.get(jid, jid)
        Image.open(comp if ok else up).convert("RGB").save(os.path.join(out, f"{name}.webp"), "WEBP", quality=85, method=6)
        report[f"{proj}/{name}"] = ("real screens: " + ", ".join(v for v in scr.values())) if ok else "PLACEHOLDER screen (" + r.stdout.strip() + ")"
        tiles.append((name, os.path.join(out, f"{name}.webp")))
        md += [f"\n## {name}\n", f"Screens composited: {', '.join(f'{k}={v}.png' for k, v in scr.items())}\n", f"```\n{prompt}\n```\n"]
    open(os.path.join(out, "prompts.md"), "w", encoding="utf-8").write("\n".join(md))
    json.dump(PALETTE[proj], open(os.path.join(out, "palette.json"), "w"), indent=2)
    # contact sheet
    tw, th, pad, lab = 400, 500, 24, 40
    sheet = Image.new("RGB", (pad + len(tiles) * (tw + pad), th + lab + 2 * pad), "white")
    d = ImageDraw.Draw(sheet)
    try: font = ImageFont.truetype("arial.ttf", 22)
    except OSError: font = ImageFont.load_default()
    for i, (n, f) in enumerate(tiles):
        x = pad + i * (tw + pad)
        sheet.paste(Image.open(f).resize((tw, th)), (x, pad))
        d.text((x, pad + th + 10), f"{NAMES[proj]} / {n}", fill="black", font=font)
    sheet.save(os.path.join(out, "contact.jpg"), quality=88)
print(json.dumps(report, indent=2))
