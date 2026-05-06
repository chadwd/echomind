# Session 005 — UI Design Review

**Date:** 2026-05-06
**Branch:** persona-foundation
**Skill:** /design-review (gstack)

---

## Summary

Final pre-demo design audit of the EchoMind web app. 5 findings identified, 5 fixed across 5 atomic commits. Design score lifted from B to A-.

---

## Design Score

| Metric | Before | After |
|--------|--------|-------|
| Overall Design Score | B | A- |
| AI Slop Score | A | A |
| Mobile | D | B+ |

---

## First Impression

The site communicates "focused professional tool." The warm purple palette (`#7A4F81` primary) is distinctive — not the default AI blue-to-purple gradient. First three elements the eye goes to: (1) "Get Dealer Insights" CTA, (2) PRD title in center pane, (3) Fit/Friction section headers. One word: **Purposeful.**

---

## What's Working Well

**Color system:** MD3 warm-purple — `#7A4F81` primary, forest green for success, deep red for error, navy for info. Proper semantic color mapping in both light and dark. Dark mode uses off-white text (`#EAE0E7`) and desaturated primary.

**Motion:** Breathing logo, pulse rings on active step, check-pop animation for completed steps, card stagger on results reveal. `prefers-reduced-motion` respected. Above-average motion work for a hackathon project.

**Content quality:** Loading steps ("Reading GM's profile", "Scanning the PRD", "Forming a take", "Composing insights") have personality. "Ready when you are." empty state is warm. Error messages are specific and include next steps by error kind (timeout, auth, rate_limit).

**AI Slop Test: Clean.** No gradient blobs, no 3-column icon grid, no centered everything, no bubbly borders, no decorative wavy dividers.

---

## Findings & Fixes

### FINDING-001 — Mobile layout broken (HIGH) — FIXED

**File:** `apps/web/src/App.vue`
**Commit:** `4ff72fd`

The three fixed-width columns (280px config + 464px PRD + flex results) summed to 744px+ minimum, overflowing any viewport under ~800px. On mobile there was horizontal scroll and the results pane was effectively unreachable.

**Fix:** Replaced inline `style` width attributes with CSS classes. Added `@media (max-width: 959px)` block that stacks columns vertically and hides the PRD pane. The PRD content is implementation context — on mobile, users only need to configure and see results.

```css
@media (max-width: 959px) {
  .layout-row { height: auto; flex-direction: column; }
  .pane-config { max-width: 100% !important; flex: 0 0 auto !important; }
  .pane-prd { display: none; }
  .pane-results { max-width: 100% !important; flex: 1 1 auto !important; height: auto; }
}
```

---

### FINDING-002 — PRD bold markdown renders as literal asterisks (MEDIUM) — FIXED

**File:** `apps/web/src/components/PrdPane.vue`
**Commit:** `1403b31`

The PRD parser classified paragraph blocks as `type: 'p'` and rendered them with `{{ block.text }}` — Vue's escaped text interpolation. Inline markdown like `**dealer General Manager**` appeared literally as `**dealer General Manager**` in the rendered output.

**Fix:** Added `bold()` function (identical to the one already in `SectionCard.vue`) and switched paragraphs to `v-html`. Safe because content is from a hardcoded fixture file, not user input.

```ts
function bold(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
```

```html
<p v-else class="text-body-2 mb-2 prd-para" v-html="bold(block.text)" />
```

Verified: 6 `<strong>` elements in the DOM post-fix ("dealer General Manager", "disposition score", "Reduce time-to-disposition", etc.).

---

### FINDING-003 — No results context header (MEDIUM) — FIXED

**File:** `apps/web/src/components/ResultsPane.vue`
**Commit:** `b507b9e`

When the 4 section cards appeared (Fit / Friction / Questions / Refinements), there was no header anchoring the user to what persona and PRD they ran. In a demo with multiple personas eventually, this matters.

**Fix:** Added a slim eyebrow header above the TransitionGroup when results are present:

```html
<div class="results-header d-flex align-center ga-2 mb-1">
  <v-icon icon="mdi-account-eye" size="16" color="primary" />
  <span class="text-caption text-medium-emphasis">GM's perspective on</span>
  <span class="text-caption font-weight-semibold">ACV MAX Auctions: Mobile Live Bid</span>
</div>
```

Also wraps the results in a `pb-4` container for bottom breathing room.

---

### FINDING-004 — Icon buttons missing aria-labels (MEDIUM) — FIXED

**File:** `apps/web/src/App.vue`
**Commit:** `9de2093`

Both app bar icon buttons (sidebar collapse toggle and dark mode toggle) had no `aria-label`. Screen readers would announce them as blank buttons. Also removed `size="small"` from the collapse toggle (which rendered at 40px, under the 44px touch target threshold).

**Fix:**
```html
:aria-label="showConfig ? 'Collapse sidebar' : 'Expand sidebar'"
:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
```

---

### FINDING-005 — Vuetify deprecated theme toggle API (POLISH) — FIXED

**File:** `apps/web/src/App.vue`
**Commit:** `534db8e`

`theme.global.name.value = 'dark'` throws a Vuetify upgrade warning: "use `theme.change('dark')` instead."

**Fix:** `theme.change(isDark.value ? 'light' : 'dark')`

---

## Remaining (not blocking demo)

- **Font:** Roboto is the single typeface. Generic for a Vuetify app, appropriate for ACV audience. A display font (e.g., DM Sans) would lift brand identity — not worth touching 2 days before demo.
- **Loading step layout:** 4 steps × 120px = 480px min-width. Clips at ~520px viewports. Not demo-critical on laptop.
- **Tablet breakpoint:** PRD pane is hidden at <960px. Users can still run validation and read results. Acceptable trade-off.

---

## Goodwill Score: 95/100

| Event | Delta | Score |
|-------|-------|-------|
| Start | — | 70 |
| Clean empty state with logo and warm copy | +10 | 80 |
| Context (persona + PRD) clear upfront | +5 | 85 |
| Loading animation with personality and named steps | +5 | 90 |
| 4-section structured results with semantic color coding | +5 | 95 |
| Mobile layout broken (pre-fix) | was -15 | — |
| Mobile layout fixed | restored | 95 |

---

## Trunk Test: PASS

1. What site is this? — EchoMind (logo + wordmark in header) ✓
2. What page am I on? — Single-page tool, Configure panel makes context clear ✓
3. Major sections? — Config | PRD | Results clearly delineated ✓
4. Options at this level? — "Get Dealer Insights" is the sole CTA ✓
5. Where am I? — Single-page app, no navigation needed ✓
6. Can I search? — N/A (not a search surface) ✓

---

## Commits

```
534db8e style(design): FINDING-005 — fix Vuetify deprecated theme toggle API
9de2093 style(design): FINDING-004 — add aria-labels to icon buttons, fix collapse button touch target
4ff72fd style(design): FINDING-001 — responsive layout: stack vertically on mobile, hide PRD pane <960px
b507b9e style(design): FINDING-003 — add GM perspective context header above results
1403b31 style(design): FINDING-002 — render inline bold markdown in PRD paragraphs
```
