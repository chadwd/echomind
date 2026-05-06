# Session 003 — UI Polish & Demo-Ready Frontend

**Date:** 2026-05-05
**Type:** Phase execution + iterative visual design review
**Participants:** Chad, AI facilitator
**Duration:** ~3 hours
**Output artifacts:** Phase 1.1 complete (4 plans + human checkpoint); 15 commits on `persona-foundation` branch

---

## Why this session happened

Phase 01 (demo-sliver) shipped the working engine, fixture, skill, and a functional web UI. But the UI used placeholder Vuetify defaults — blue primary color, flat grey surfaces, generic card layout. The goal of Phase 1.1 was to make the app look like a tool someone would trust, not a scaffold someone built in a day. This session executed that plan and then iterated past it based on live visual feedback.

---

## Starting state

- **Working app:** Engine ran, fixture loaded, results rendered. Everything functional.
- **Visual state:** Vuetify default blue (#1565C0), flat grey (#FAFAFA) surfaces, 2×2 grid of section cards, basic horizontal stepper, placeholder copy ("Get Feedback", "Loading persona").
- **Phase plan:** 4 plans across 3 waves. Plans 01–03 automated; Plan 04 human checkpoint.
- **No human approval yet:** The phase had never been visually verified by Chad.

---

## What we worked through

### 1. Automated Wave Execution (Plans 01–03)

Three plans ran in parallel subagents across two waves:

**Wave 1 — Plan 01:** Replaced the Vuetify placeholder theme in `main.ts` with the full M3 light scheme from `assets/material-theme-builder/material-theme.json` (26 color roles). Primary became `#7A4F81` (EchoMind purple), surface `#FFF7FA` (M3 warm white), surface-variant `#ECDFE9`. The old placeholder blue (#1565C0) and flat greys (#FAFAFA, #F5F5F5) were eliminated.

**Wave 2 — Plans 02 + 03 (parallel):**
- **Plan 02:** App bar logo polish — `object-position: left top` crops to the icon mark only (eliminates white square artifact from the PNG having a light background). `elevation="0" border="b"` replaces the Material shadow with a clean 1px divider. Uppercase wordmark.
- **Plan 03:** Component polish — InputPane card from `variant="outlined"` to `variant="flat"` with `surface-container-low` fill + `outline-variant` border. GET FEEDBACK button `elevation="2"`. SectionCard finding rows `py-3` and lighter `rgba(0,0,0,0.06)` dividers. Empty state icon changed from `surface-variant` to `secondary`.

All three plans built clean (272 modules, 0 errors).

---

### 2. Human Checkpoint — Iterative Feedback Loop

Chad reviewed the app in-browser and provided feedback across multiple rounds. Each round was implemented immediately and verified with a build. The full sequence:

**Round 1:**
- Remove all-caps from the wordmark title (we had set `text-transform: uppercase`). Added a global `VBtn` default to enforce `text-transform: none; letter-spacing: 0` across all buttons — Vuetify 3 doesn't uppercase by default but this guards against it.
- `disabled` → `readonly` on Persona + PRD fields. Inputs were grey and looked broken; `readonly` is the right treatment for demo-locked fields (same behavior, looks active).
- Replace the lightning bolt icon in the empty state with the logo image at 72px (later bumped to 144px).
- Add light/dark mode toggle to the app bar (sun/moon icon). Added the full M3 dark scheme to `main.ts` using exact values from `material-theme.json`, not approximated.

**Round 2:**
- Logo in empty state: 2× larger (72px → 144px).
- CTA copy: "Get Feedback" → "Get Dealer Insights". More specific, more resonant with the persona.

**Round 3 (emotional design, based on Tubik 2026 trends article):**
Three trends were applicable:
1. *Purposeful Motion Design* — staggered card reveal (80ms delay per section group, spring easing), CTA hover lift (2px translateY, 0.08s snap-back), empty state fade-in.
2. *AI as Collaborative Copilot* — conversational copy throughout: "Ready when you are." / "See this PRD through the GM's eyes", stepper steps reading as thought process ("Reading GM's profile → Scanning the PRD → Forming a take → Composing insights").
3. *Crafted Authenticity* — every piece of micro-copy feels authored, not scaffolded.
All animations gate on `prefers-reduced-motion`.

**Round 4 (results layout redesign):**
The 2×2 card grid was the biggest visual problem — equal weight on all four sections, text walls, no hierarchy. Decision: replace entirely with a vertical report feed.

New design: each section (Fit, Friction, Questions, Refinements) is a full-width card with:
- Colored section header (icon + title + count), 2px colored divider below
- Numbered findings as a list inside the card (no individual finding cards)
- Section colors: Fit=green (#2D6A4F), Friction=error-red, Questions=deep-blue (#1E4D8C), Refinements=primary-purple
- Added `success` and `info` colors to both light and dark themes in `main.ts` so Vuetify handles color resolution in dark mode automatically

**Round 5 (loading state redesign):**
The horizontal Vuetify stepper was generic. Replaced with a custom animated modal card:
- Centered in results pane, `680px × 400px`, `elevation="6"`, `rounded="xl"`
- Breathing logo (scale 1→1.05, opacity 0.72→1, 2.6s cycle)
- "Analyzing your PRD / The GM is weighing in…" copy
- 4 steps horizontal with flex connector lines that turn success-green as steps complete
- Step states: pending (10px muted dot, row at 35% opacity) → active (14px primary dot, two concentric pulse rings expanding to 3.4×) → complete (28px green circle, check icon springs in with rotation)

**Round 6 (3-column layout):**
Chad wanted to keep the config panel but add a PRD reference panel so POs can read feedback alongside the document that prompted it.

Final layout:
- **Config (280px, collapsible):** Toggle button in app bar (`mdi-arrow-collapse-left` / `mdi-arrow-expand-right`). Animates via CSS `max-width + opacity` transition.
- **PRD Reference (464px, independent scroll):** New `PrdPane.vue` component. Imports `fixtures/prds/acvmax-auctions.md` via Vite's `?raw` suffix (Vite config already had `assetsInclude: ['**/*.md']`). Parsed into typed blocks (h2, hr, meta, p) with section headers in primary color. Fixed header, scrollable body. `height: 100%; overflow: hidden` on the column constrains height so the pane scrolls independently, not the whole page.
- **Results (flex-grow):** Independent scroll, takes all remaining space.

**Round 7 (polish details):**
- Section card backgrounds: changed from `variant="elevated"` to `variant="flat"` with `surface-container-low` fill — matches the PRD pane for visual consistency.
- Finding separators removed; row spacing tightened (`ga-2`, `py-1`).
- PRD pane widened to 464px from 340px.

**Round 8 (bold highlights):**
Chad asked if key phrases could be bolded in the findings. Solution: add `**bold**` markdown markers to high-signal phrases in `gm-auctions-snapshot.json` (numbers, named concepts, critical gaps, action items), then add a `bold()` renderer in `SectionCard.vue` that converts `**text**` → `<strong>text</strong>` via `v-html`. Safe because content is from a controlled fixture. This pattern will also work when the live LLM returns findings with natural markdown bold.

---

## Key decisions made

| Decision | Rationale |
|----------|-----------|
| `readonly` not `disabled` on demo fields | `disabled` signals broken; `readonly` signals intentional constraint. Same behavior, better UX signal. |
| Full M3 dark scheme from source JSON | Approximated dark colors cause subtle contrast failures. The theme builder output is authoritative. |
| Vertical report feed over 2×2 grid | Equal-weight tiles flatten hierarchy. A report reads top-to-bottom; the four sections aren't equally important at a glance. Vertical feed + colored headers + numbered findings makes the output scannable. |
| Section colors use Vuetify theme tokens | Hardcoded hex colors break dark mode. Defining `success`/`info` in both `light` and `dark` themes lets Vuetify handle everything via CSS custom properties. |
| `?raw` import for PRD text | Fetch-at-runtime adds latency and failure modes. `?raw` inlines the text at build time — reliable for a demo fixture. |
| Independent column scroll via `height: 100%; overflow: hidden` | Without explicit height containment on the v-col, the inner `overflow-y-auto` has no reference height and falls back to document scroll. |
| `**bold**` in fixture + v-html renderer | Keeps the data layer clean (plain text + markdown hints), keeps the render layer simple (one regex), and works identically for live LLM output that returns markdown. |
| Loading modal card over stepper | The Vuetify stepper is horizontal and small — poor for a loading state that occupies the full results pane. A centered elevated card makes the loading state feel intentional, not like a component filling empty space. |

---

## Patterns established

**M3 theme pattern:** All color decisions flow through Vuetify CSS custom properties (`rgb(var(--v-theme-{role}))`). No hardcoded hex in component styles except as a last resort.

**Column containment pattern:** Three-column layout requires each v-col to have `height: 100%; overflow: hidden` if its child needs independent scroll. The child then uses `h-100 d-flex flex-column` with a `flex-grow-1 overflow-y-auto` scroll region.

**Markdown-in-fixture pattern:** LLM outputs (and fixture equivalents) can include `**bold**` and the UI renders them with a one-line regex. Safe because the content is internal/controlled.

**Collapsible pane pattern:** `<Transition name="config">` wrapping a `v-if` column with CSS `max-width + opacity` transition. The transition name drives `config-enter-active / config-leave-active` classes in the non-scoped `<style>` block.

---

## Problems we faced and how we resolved them

| Problem | Resolution |
|---------|------------|
| PRD pane scrolling the whole page | Added `height: 100%; overflow: hidden` to the v-col. The outer div was `h-100` + `overflow: hidden`, the scroll region was `overflow-y-auto flex-grow-1`, but without the column constraint, the browser had no reference height. |
| Vuetify `variant="outlined"` on v-card doesn't adapt to M3 theme colors | Switched to `variant="flat"` + explicit inline styles using theme CSS vars. More verbose but fully controllable. |
| `mdi-arrow-collapse-left` / `mdi-arrow-expand-right` icon availability | These are confirmed MDI 7.x icons. If they fail in a future MDI version, fallback to `mdi-chevron-left` / `mdi-chevron-right`. |
| Dark mode section colors | Hardcoded hex accent colors look wrong on dark surfaces. Resolution: add `success` (#86D998) and `info` (#93C8E8) to the dark theme; Vuetify resolves them correctly via `color="success"` prop. |
| `v-html` XSS concern | Not a concern here — content is controlled fixture JSON and internal LLM output behind an ACV gateway. If this ever accepts external user-generated content, the `bold()` function must be replaced with a sanitized markdown renderer. |

---

## What we're moving forward with

**Phase 1.1 complete.** The web app is demo-ready:
- EchoMind brand theme (M3 purple, warm white, full dark mode)
- 3-column layout with collapsible config and independent-scroll PRD reference
- Vertical report feed with color-coded section cards and numbered findings
- Custom loading animation (breathing logo, horizontal steps, pulse rings)
- Emotional design (stagger-in, hover lift, conversational copy)
- Bold highlights on key phrases in findings

**Next:** Phase 2 (Engine Hardening) — moving from fixture-only to live LLM calls via the ACV gateway. The PRD reference pane sets up a natural "show your work" surface: the validator's findings will be grounded in the same PRD the PO can read alongside them.

**Branch state:** `persona-foundation` — 15+ commits this session, all building on Phase 01's foundation.

---

## Open threads

- **PRD pane text rendering:** Currently a hand-rolled block parser (h2, hr, meta, p). Works for this fixture. A real Confluence/Notion import would need proper markdown/HTML rendering. Consider `marked` or `markdown-it` when live input lands.
- **Config pane evolution:** Currently locked to one persona + one PRD for the demo. Phase 2 unlocks real persona selection and PRD input. The `readonly` fields will need to become real selectors.
- **Bold hints from live LLM:** The `**bold**` pattern in the fixture is a convention, not a contract. When moving to live LLM calls, the system prompt should instruct the model to use `**bold**` for the 1-2 most important phrases per finding. Test whether Sonnet 4.6 does this naturally before adding explicit instructions.
- **Dark mode testing:** Dark theme colors were derived from the M3 source JSON and built clean, but were not visually verified in this session. Worth a quick review before the demo.
- **Results pane scroll:** The results column has `overflow-y: auto` at the column level. As the number of section findings grows, this will scroll. Consider whether section cards should have a max-height with internal scroll for very long finding lists, or whether full-column scroll is acceptable.
