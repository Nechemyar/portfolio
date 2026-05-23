# Portfolio Rebuild Plan

Living doc for any session (Opus, Sonnet, Codex) to pick up without re-deriving context.

## Context
Solo web designer (Nechemya / Sumi Studios). Premium hand-coded sites for service businesses. The hero section is done and the user is happy with it. Everything else feels AI-generated, mismatched, and needs rebuilding to match the hero's quality and voice.

## Tech stack
Vanilla HTML + SCSS + JS, Vite, GSAP + ScrollTrigger, Lenis smooth scroll, Satoshi font. No frameworks.

## Source of truth
- `DESIGN_BIBLE.md` for visual decisions
- `AI_CONTEXT.md` for file architecture and immutable rules
- `CLAUDE.md` for session instructions and skill activation

## Current branch
Auto-push to `origin/main` after every change (standing instruction).

## The problem
The hero is strong: yellow stage, warm palette, boxy controls, confident copy. Everything after the hero was written and styled by AI and it shows:
- Copy uses AI patterns (rule of three, promotional language, vague claims)
- Color choices don't flow naturally from the hero palette
- Sections feel like generic SaaS templates, not a sharp independent studio
- Mobile experience wasn't designed with intention
- No visual rhythm -- sections feel disconnected

## Design principles (derived from the hero)
1. **Warm paper fields** with intentional color bands (yellow, blush, cream, dark)
2. **Boxy controls** with 8-14px radii, 2px black borders
3. **Left-anchored heavy headings**, not centered marketing blocks
4. **Deliberate line breaks** in headlines, not accidental wrapping
5. **Asymmetric layouts** where proof/image dominates and copy anchors action
6. **Black text on warm surfaces**, white text on dark surfaces only

---

## Section-by-section rebuild

Each section has: layout intent, copy direction, color, and animation notes. Copy drafts are placeholders -- run through humanizer + detect-ai before shipping.

---

### 1. Logo Strip (after hero)

**Purpose:** Transition from hero energy to proof. Quick credibility.

**Layout:** Full-width cream band. Left-aligned project links as text links with arrows, not logos. Keep it minimal.

**Color:** `$c-cream` background, `$c-charcoal` text.

**Copy direction:**
- Kill "Recent builds worth opening" -- sounds like a blog post headline
- Replace with something direct: project names as links, no label needed. Or a quiet label like "Recent work" if needed.

**Animation:** Simple fade-up on scroll reveal. No stagger needed.

**Mobile:** Single column, links stack vertically.

---

### 2. Bento Grid ("How I work")

**Purpose:** Build trust by showing process. Answer "what happens after I call you?"

**Layout:** Keep the bento grid but make the cards feel more like the hero's boxy controls. Strong borders, warm fills, intentional sizing.

**Color:**
- Section bg: `$c-cream`
- Cards: mix of `$c-blush`, `$c-yellow`, white with black border
- Stat cards: yellow fill with black text
- Process card: dark (`$c-charcoal`) with cream text for contrast

**Copy to rewrite:**
- Header: "Clear scope. Sharp design. No disappearing act." -- rewrite, sounds AI
- Card 1 (Scope): "We start with the job your website has to win." -- decent but "moodboard theatre" is try-hard. Simplify.
- Card 2 (Process): "Call. Build. Ship." -- fine, keep it
- Card 3 (2w): keep the stat, it's concrete
- Card 4 (90+): keep the stat
- Card 5 (Ownership): "Hand-coded. Yours forever." -- rewrite, "no monthly hostage situation" tries too hard

**Copy rewrite approach:** Short, flat, factual. What happens, not why it's amazing. A builder explaining their process to another adult.

**Animation:** Cards reveal on scroll with subtle y-offset, no rotation. Stagger 0.08s per card.

**Mobile:** Stack cards single column. Process card goes full width.

---

### 3. Proof (project showcase)

**Purpose:** Show the work. This is the most important section for conversion.

**Layout:** Keep the dark band but make project cards bigger and more prominent. Full-bleed images with thin captions below, not split image+text cards.

**Color:**
- Section bg: `$c-charcoal`
- Cards: images with cream caption text below
- "Why hand-coded" compare card: `$c-yellow` fill with black text and border (ties back to hero)

**Copy to rewrite:**
- "Proof, not perfume" -- too clever. Something like "Work" or "Recent projects" or nothing at all
- "The work has to make the business easier to trust." -- this is actually good but could be shorter
- Project descriptions: kill the AI copywriting. Just say what you did: "Lead-gen site for an inventory company" and "Professional service site for a clinical practice." Flat and honest.
- "Why hand-coded?" list: rewrite the items. "Cleaner/Faster/Yours" with single sentences is fine structurally but the descriptions are weak

**Animation:** Image cards scale up slightly from 0.95 on scroll entry. Caption fades in after image settles.

**Mobile:** Stack cards vertically. Images full width.

---

### 4. About (founder section)

**Purpose:** Put a face to the work. Build personal trust.

**Layout:** Keep the two-column layout (photo left, copy right). Photo should be a real, natural shot -- not a studio headshot.

**Color:** `$c-cream` or `$c-blush` background. Black text.

**Copy to rewrite:**
- "Hi, I'm Nechemya" label -- fine
- "One person. Hand-coded. No agency markup." -- the structure is AI (rule of three). Rewrite as a single clear sentence.
- Body copy: "Most clients come to me after a WordPress build that cost too much..." -- this paragraph is decent but reads like AI copywriting. Make it more personal and specific. What do YOU actually do differently?
- "No account managers. No mystery sprint. No upsells." -- AI pattern (triple negative). Rewrite.
- Signature: "Based in Herzliya. Working worldwide." -- fine, keep it

**Animation:** Photo and copy reveal together with a subtle y-offset.

**Mobile:** Photo above copy, full width.

---

### 5. Services

**Purpose:** What you actually offer. Keep it tight.

**Layout:** Three cards on yellow band. Cards should have `$c-cream` fill with black border, sitting on the yellow background. This creates visual continuity with the hero.

**Color:**
- Section bg: `$c-yellow` (matches hero, creates a callback)
- Cards: `$c-cream` fill, `2px solid $c-charcoal` border, `8px` radius
- Labels: coral pill badges (like bento kickers)

**Copy to rewrite:**
- "Three things, done properly." -- rewrite, AI-sounding
- Card titles are trying too hard to be clever. "A site that doesn't look like everyone else's" -- just say what the service IS
- Simpler approach: "Design" / "Development" / "Strategy" as labels, then 1-2 sentences of what's included. No headlines trying to be witty.

**Animation:** Cards stagger in from below.

**Mobile:** Cards stack vertically.

---

### 6. Pricing

**Purpose:** Remove price anxiety. Make the next step obvious.

**Layout:** Two cards side by side. Featured card gets a yellow accent or border treatment, not just a badge. Make the visual hierarchy clear.

**Color:**
- Section bg: `$c-cream`
- Standard card: white with subtle border
- Featured card: `$c-yellow` border or left-side accent stripe

**Copy to rewrite:**
- "Pick a scope. Get a fixed price." -- actually decent, might keep
- "The number in the proposal is the number on the invoice." -- good, keep
- Feature lists are fine as-is
- "Most popular" badge -- keep
- Footer "Need something bigger?" -- keep

**Animation:** Cards reveal together, no stagger (they're peers).

**Mobile:** Cards stack. Featured card on top.

---

### 7. Testimonials

**Purpose:** Social proof from real clients.

**Layout:** Keep the dark band. Two real testimonial cards + one positioning card. Make testimonial cards feel like quoted notes (cream paper on dark background).

**Color:**
- Section bg: `$c-charcoal`
- Cards: `$c-cream` fill, subtle border
- Third card (positioning note): `$c-blush` fill

**Copy to rewrite:**
- "Client words" label -- fine
- "What they said after." -- fine
- Testimonial quotes: these read real (they probably are real quotes). Keep as-is.
- Third card: "The best sites do three jobs quickly..." -- this is AI writing pretending to be a testimonial. Either get a third real testimonial or cut this card entirely.

**Animation:** Cards stagger in.

**Mobile:** Stack vertically.

---

### 8. FAQ

**Purpose:** Handle objections. Reduce call anxiety.

**Layout:** Keep the accordion pattern. Clean, wide, no fuss.

**Color:** `$c-cream` background. Black text. Accordion borders in `$c-border`.

**Copy to rewrite:**
- "Common questions" / "Things people ask on the call." -- fine
- FAQ answers: mostly solid and specific. Light humanizer pass but don't over-edit. These read reasonably natural already.
- "Templates look like the next 10,000 sites built from the same template, which makes you forgettable when a customer is comparing five tabs." -- this sentence is good, keep it.

**Animation:** Accordion open/close with GSAP height tween (not CSS transition, per immutable rule).

**Mobile:** Full width, generous padding.

---

### 9. Contact

**Purpose:** Close the deal. Single clear CTA.

**Layout:** Centered. Big headline, subtitle, buttons.

**Color:** `$c-blush` or `$c-cream` background. Consider a full-width yellow band to bookend with the hero.

**Copy to rewrite:**
- "Want a site that feels like this?" -- too meta/self-referential. The visitor hasn't been thinking about "this site" -- they've been thinking about THEIR site.
- Better direction: speak to what they want. "Ready to start?" or "Let's talk about your site." Simple, direct.
- "No pitch deck, no pressure." -- decent but "If we are not the right fit, I will say so" is AI-speak. Shorten.

**Animation:** Subtle fade-up.

**Mobile:** Stack buttons vertically.

---

### 10. Footer

**Purpose:** Minimal. Copyright + email.

**Color:** `$c-charcoal` with cream text.

**No changes needed.** It's already clean.

---

## Copy rewriting rules (for any session)

1. Run every piece of copy through the **humanizer** skill
2. Check AI score with **detect-ai** skill -- target under 20
3. No em dashes. No rule of three. No "delve/tapestry/landscape/elevate"
4. Write like you're explaining your work to a friend at a bar, not pitching an investor
5. Specific beats clever: "2 weeks" beats "lightning-fast turnaround"
6. If a headline needs to be clever, make it ONE thing. Not three things in parallel.
7. Read the copy out loud. If you'd never say it in person, rewrite it.

## Color flow (section order)

| Section | Background | Nav theme |
|---------|-----------|-----------|
| Hero | `$c-yellow` | light (black nav) |
| Logo strip | `$c-cream` | light |
| Bento | `$c-cream` | light |
| Proof | `$c-charcoal` | dark (white nav) |
| About | `$c-blush` | light |
| Services | `$c-yellow` | light |
| Pricing | `$c-cream` | light |
| Testimonials | `$c-charcoal` | dark |
| FAQ | `$c-cream` | light |
| Contact | `$c-yellow` or `$c-blush` | light |
| Footer | `$c-charcoal` | dark |

This creates a rhythm: warm-warm-DARK-warm-WARM-warm-DARK-warm-WARM-dark. The yellow sections (hero, services, contact) bookend the page and create visual landmarks.

## Animation system

All animations use GSAP + ScrollTrigger. No CSS transitions on animated properties.

- **Reveal:** `y: 30, autoAlpha: 0` -> `y: 0, autoAlpha: 1`, duration 0.7s, ease `power2.out`
- **Stagger:** 0.08s between sibling elements
- **Images:** scale from 0.97 to 1 on reveal
- **Reduced motion:** Skip all motion animations, show elements immediately

## Execution order (priority)

### Phase 1: Copy rewrite (do first, all sections)
Rewrite all copy across every section. Run humanizer + detect-ai. This is the fastest way to make the site stop feeling AI.

### Phase 2: Color and layout alignment
Update SCSS for each section to match the color flow table. Fix backgrounds, borders, card fills, and typography to match hero language.

### Phase 3: Mobile pass
Walk through every section at 360px, 390px, 430px. Fix padding, stacking, overflow, font sizes.

### Phase 4: Animation polish
Wire up GSAP reveals for all sections. Test with reduced motion.

### Phase 5: Loader and transitions (from old plan)
- Loader iris-out animation
- Page transition wipe between home and project pages
- Magnetic CTA hover effects

## Session handoff protocol

When ending a session:
1. Update this PLAN.md with what was completed (mark with [x])
2. Note any decisions made or copy approved
3. Note what to do next
4. Commit and push

When starting a session:
1. Read PLAN.md first
2. Read DESIGN_BIBLE.md if doing visual work
3. Check skill-observations/log.md for open observations
4. Continue from where the last session stopped

## Working agreements
- Auto-push to main after every change
- Minimal token usage, no narration
- Run humanizer on all copy
- Check mobile at 360/390/430px after layout changes
