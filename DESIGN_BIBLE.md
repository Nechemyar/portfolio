# Sumi Studios Design Bible

## North Star
Sumi should feel like a sharp independent studio: bold, simple, tactile, slightly playful, and commercially clear. The hero is the reference point for the rest of the redesign.

## Core Palette
- Hero yellow: `#FFB93E`
- Ink: `#050505` / `#0B0B0B`
- Warm paper: `#FAF9F7`
- Panel blush: `#F8EBE7`
- CTA coral: `#FF9C7D`
- WhatsApp green: `#80FF80`

Use black/near-black text on yellow, paper, blush, coral, and green. Do not use white nav/text on the yellow hero; it is lower contrast and less readable.

## Contrast Rules
- Body text and navigation must meet at least WCAG AA contrast.
- Prefer `#050505` on bright/warm surfaces.
- If a decorative color is low contrast, use it for fills only and put black type/icons over it.
- Before shipping a new section, check: nav readability, CTA readability, small uppercase label readability, and icon visibility.

## Typography
- Use Satoshi as the working UI/display voice.
- Hero/card headings are confident but not oversized: clamp the desktop scale so it does not dwarf mobile.
- Letter spacing should be `0` or only slightly negative for large display text. Avoid decorative tracking unless it is a small label.
- Keep important marketing copy in deliberate lines. Do not rely on accidental wrapping.

## Hero Lockup Pattern
- Desktop copy card stays pinned near the left viewport edge.
- Card width can grow fluidly on wide screens; do not center it into the page.
- Hero headline is three intentional rows:
  - `We build fast, stunning`
  - `mobile-ready websites for`
  - `service businesses`
- Mobile TV sits above the card with a small, intentional gap. Do not reposition it with arbitrary `top:%`; control the flex area/gap directly.
- TV image uses `mix-blend-mode: multiply`; never animate opacity or transforms on a parent that would create a stacking context and break the blend.

## Cards And Controls
- Use boxy 8px-14px radii, not soft pill cards.
- Hero/menu CTA border system:
  - Border: `2px solid #0B0B0B`
  - Radius: `8px`
  - Coral fill for “Book a free call”
  - Green fill for WhatsApp
- Paired CTA controls should share border thickness, radius, vertical alignment, and icon size.
- WhatsApp icon glyph size: `28px`.

## Navigation
- Nav color must respond to section background.
- On yellow/light sections, wordmark and menu icon/label should be black.
- On dark sections, use warm white.
- Keep the hero nav transparent. After the hero, give the fixed nav a section-matched backing so it never sits directly on top of large copy or FAQ text while scrolling.
- When the mobile menu is open, keep the fixed nav backing on its current section color; do not introduce a sudden black bar on the hero.
- If the nav is visually pleasing but not readable, readability wins.

## Post-Hero Sections
- Reuse the hero's visual language: warm paper fields, yellow proof bands, blush/coral accents, black borders, and 8px-10px radii.
- Large headings should be anchored left, heavy, and intentional. Keep mobile top padding generous so the fixed nav has room.
- Use boxed proof panels instead of soft floating cards; cards should feel like deliberate objects on the page.

## Mobile Menu
- Bottom sheet uses blush paper, black border, and boxy corners.
- Hide the internal scrollbar visually.
- Keep the close handle visually separated from the first nav item; add top padding rather than shrinking type.
- Menu CTAs should match hero CTA geometry for continuity.

## Layout Rhythm
- Favor full-viewport bands and strong anchored objects over centered marketing blocks.
- Use asymmetric placement: proof/image can dominate, copy card anchors the action.
- Use real section backgrounds; avoid accidental white/off-white strips between sections.
- Every mobile section needs an explicit plan for viewport height, overflow, and the transition into the next section.

## Motion
- Motion reveals structure; it should not be decoration.
- Use GSAP for animated transforms/opacity. Do not also transition the same properties in CSS.
- Keep blend-mode elements out of animated parent opacity/transform contexts.
- Menu and hero animations should never create visible scrollbars.

## Pre-Ship Checklist
- Desktop: 1280, 1440, 1920 widths.
- Mobile: 360, 390, 430 widths.
- No horizontal overflow.
- No visible internal scrollbars unless explicitly intended.
- Nav contrast is readable on the current section.
- CTA pair has matching border/radius/icon sizing.
- Section boundary does not flash or reveal the wrong background.
