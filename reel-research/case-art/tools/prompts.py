"""Prompts for the case-art studio shoot. One shared camera/light block per project."""

SHOOT = (
    "Photorealistic studio product photograph, high-end magazine product shot, portrait 4:5. "
    "One seamless paper sweep in a single flat saturated colour, {bg}, covering the floor and curving smoothly up into the wall "
    "with no visible horizon line or seam. Lighting: one single hard key light, high and to the upper left, casting one crisp, "
    "long, sharp-edged shadow toward the lower right across the sweep; very low fill so the shadow is deep but clean; no rim light. "
    "Camera: 85mm lens, slightly above eye level, f/11, everything in sharp focus, generous negative space around the subject. "
    "Very clean, minimal, slightly playful composition. No glow, no bloom, no haze, no lens flare, no added text, no logos, no people. "
    "Devices must be real current Apple hardware with accurate proportions: iPhone 17 Pro in silver (flat aluminium edges, thin even "
    "black bezel, Dynamic Island pill, rounded corners) and MacBook Air in silver. "
    "IMPORTANT for post-production: every device screen is filled completely, edge to edge inside the bezel, with a perfectly flat, "
    "uniform, matte {key}, with no reflections, no gradient, no glare, no interface, and nothing covering or overlapping the screen. "
    "The Dynamic Island stays black. "
)
GREEN = "pure chroma green (#00FF00)"

SCENES = {
    "phone": "Subject: a single iPhone 17 Pro floating in mid-air above the sweep, screen facing camera, tilted about 18 degrees clockwise "
             "and turned slightly so a sliver of its silver side edge shows, its sharp shadow falling on the floor of the sweep below and to the right.",
    "pair": "Subject: two iPhone 17 Pro phones standing upright side by side on the sweep, both screens facing camera, the left one tilted "
            "about 10 degrees counter-clockwise and the right one tilted about 10 degrees clockwise and slightly in front, overlapping the "
            "left phone only by a few millimetres at the bezel so that both screens are fully visible and unobstructed. The LEFT phone's "
            "screen is pure chroma green (#00FF00); the RIGHT phone's screen is pure cyan (#00FFFF). Two crisp long shadows.",
    "laptop": "Subject: a silver MacBook Air open at about 110 degrees, sitting on the floor of the sweep at a three-quarter angle, "
              "rotated about 25 degrees so the screen faces the camera at a slight angle, the whole screen visible, its long hard shadow "
              "stretching across the sweep.",
}


def p(bg, scene, props=None):
    key = GREEN if scene != "pair" else "chroma colour stated below"
    body = SCENES[scene] if scene in SCENES else scene
    return SHOOT.format(bg=bg, key=key) + body


ORANGE = "Choice Inventory brand orange, exactly #F28C21 (warm saturated orange)"
BLACK = "deep matte black, #0E0E10, with the hard light making a soft pool on the floor"
WHITE = "clean bright white, #F4F4F2, with a crisp grey shadow"
PURPLE = "rich plum purple, exactly #90376B (JSense brand grape)"

JOBS = {
    "choice": {
        "01": (p(ORANGE, "phone"), {"g": "pricing-m"}),
        "02": (p(ORANGE, "pair"), {"g": "home-m", "c": "pricing-m"}),
        "03": (p(ORANGE, "laptop"), {"g": "home-d"}),
        "04": (p(ORANGE,
                 "Subject: a styled prop still life on the floor of the sweep, seen from a higher angle (about 45 degrees down): a plain "
                 "aluminium clipboard holding a printed property inventory report (white paper, a grey header block, ruled table rows "
                 "and small tick boxes rendered as abstract grey lines, no readable words), a ring of three brass house keys with a "
                 "small white paper key tag, and an iPhone 17 Pro lying flat beside the clipboard, screen up, not overlapped by anything. "
                 "Props arranged at playful angles with long hard shadows."), {"g": "home-m"}),
    },
    "clinical": {
        "01-black": (p(BLACK, "phone") + " The phone must have true iPhone 17 Pro proportions, tall and narrow (about 1 : 2.17), not wide.", {"g": "home-m"}),
        "01-white": (p(WHITE, "phone"), {"g": "home-m"}),
        # the rest use the backdrop picked after the hero test (filled in by run.py --bg)
        "02": ("pair", {"g": "home-m", "c": "our-process-m"}),
        "03": ("laptop", {"g": "home-d"}),
        "04": ("Subject: a calm, professional prop still life on the floor of the sweep, seen from a higher angle (about 45 degrees "
               "down): a plain light-wood clipboard holding a printed assessment form (white paper, ruled lines and tick boxes "
               "rendered as abstract grey lines, no readable words), a sharpened natural wooden pencil, three small plain natural-wood "
               "building blocks stacked loosely, and an iPhone 17 Pro lying flat beside the clipboard, screen up, not overlapped by "
               "anything. No medical equipment. Long hard shadows.", {"g": "services-adhd-assessments-m"}),
    },
    "jsense": {
        "01": (p(PURPLE, "phone"), {"g": "home-m"}),
        "02": (p(PURPLE, "pair"), {"g": "home-m", "c": "services-m"}),
        "03": (p(PURPLE, "laptop"), {"g": "home-d"}),
        "04": (p(PURPLE,
                 "Subject: a playful prop still life about accessibility on the floor of the sweep, seen from a higher angle (about 45 "
                 "degrees down): three oversized chunky blank keyboard keycaps (one white, one black, one sunflower yellow #F5BA14, no "
                 "letters on them), a large flat pill-shaped slide toggle switch (like an on/off accessibility setting toggle made as a physical object), black track with a sunflower-yellow round knob slid to the on position, and an iPhone 17 Pro lying flat "
                 "beside them, screen up, not overlapped by anything. Props scattered at playful angles with long hard shadows."),
               {"g": "accessibility-m"}),
    },
}
