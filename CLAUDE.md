# Sumi Studios Portfolio

## Project
Premium web design portfolio for a freelance designer/developer (Nechemya).
Goal: win clients, build trust, showcase work.
Aesthetic: editorial, confident, bold typography, warm palette.

## Tech stack
- Vite (build)
- Vanilla JS + SCSS (no frameworks, no React, no Tailwind)
- GSAP 3.15 + ScrollTrigger + Draggable (animation)
- Lenis (smooth scroll)
- SplitType (text splitting)
- ClashDisplay Variable + DM Sans (fonts)

## Source of truth
- `PLAN.md` for the rebuild roadmap, section specs, and session handoff state. Read this FIRST at session start.
- `DESIGN_BIBLE.md` for all visual decisions (palette, typography, contrast, cards, nav)
- `AI_CONTEXT.md` for file architecture and immutable rules

## Key rules
1. No CSS transitions on GSAP-animated properties
2. Unit matching in animations (px to px, vw to vw)
3. All copy must sound human, not AI-generated. Run humanizer checks on any text.
4. Commit and push to main after every change without asking.
5. No hover effects on mobile. Use `@media (hover: hover)` to gate all `:hover` states.
6. Spacing, font sizes, and font weights must be consistent across sections. Use tokens from `_tokens.scss`, not ad-hoc values.
7. The hero sets the standard. Match its spacing, sizing, and hierarchy in every section.
8. Design must not look AI-generated: no generic gradients, no stock-photo layouts, no symmetrical grid-of-three-cards-with-icons patterns. Favor asymmetry, editorial layouts, and intentional white space.

## Git workflow
- Work on main. Do not create feature branches or worktrees.
- If Claude Code puts you in a worktree, push all changes to main: `git push origin HEAD:main`
- At the end of each session, make sure main is up to date before stopping.
- Clean up stale worktrees when you see them: `git worktree list` then `git worktree remove <path> --force`

## Dev commands
- `npm run dev` to start Vite dev server
- `npm run build` to build for production

## Session start
At the start of any task-oriented session, invoke the task-observer skill before beginning work. This ensures skill improvement opportunities are captured throughout the session.

When loading any skill, check the observation log at `skill-observations/log.md` for OPEN observations tagged to that skill. Apply their insights to the current work.

## Skill observation storage
- Observation log: `skill-observations/log.md`
- Cross-cutting principles: `skill-observations/cross-cutting-principles.md`
- Archive: `skill-observations/archive/`
- Staged skill updates: `skill-updates/`
