---
phase: 02-engine-hardening
plan: 05
subsystem: web-app
tags: [provenance, chips, error-state, vuetify, finding-type, pers-04]
dependency_graph:
  requires:
    - 02-01  # Finding[] type in engine/src/types.ts
    - 02-03  # GatewayError + GatewayErrorKind in engine/src/llm.ts
    - 02-04  # Fixture migrated to Finding[] shape
  provides:
    - VALD-03  # Visible provenance chips in SectionCard
    - LLM-03   # Structured web error states with retry
    - PERS-04  # No edit affordance in InputPane (confirmed)
  affects:
    - apps/web/src/components/SectionCard.vue
    - apps/web/src/composables/useValidator.ts
    - apps/web/src/components/ResultsPane.vue
    - apps/web/src/App.vue
tech_stack:
  added: []
  patterns:
    - Finding[] type threaded from engine through composable to component
    - GatewayError duck-typing (err.name === 'GatewayError') for browser-safe error classification
    - Vuetify v-chip variant=tonal for tonal provenance chips
    - Vuetify v-alert type=error for structured error panel
    - Computed errorHeading/errorBody/errorIcon from errorKind for type-specific copy
key_files:
  created:
    - apps/web/src/utils/provenance.ts
  modified:
    - apps/web/src/components/SectionCard.vue
    - apps/web/src/composables/useValidator.ts
    - apps/web/src/components/ResultsPane.vue
    - apps/web/src/App.vue
    - packages/engine/src/index.ts  # deviation: added Finding + GatewayErrorKind exports
    - packages/engine/src/llm.ts    # deviation: fixed TS2537 type cast on tools
decisions:
  - "GatewayError duck-typed by err.name in browser — class cannot be imported (Node.js-only engine)"
  - "Empty state condition updated to exclude error state — !isValidating && !results && !error"
  - "PERS-04 confirmed by grep — zero edit affordance in InputPane.vue"
metrics:
  duration: 4min
  completed_date: "2026-05-06T16:36:49Z"
  tasks: 3
  files: 7
---

# Phase 02 Plan 05: Provenance Chips + Structured Error State Summary

**One-liner:** Tonal provenance chips in SectionCard.vue for each Finding source field, plus typed GatewayError state in useValidator + ResultsPane with per-kind copywriting and retry button wired through App.vue.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create provenance.ts utility | 5343529 | apps/web/src/utils/provenance.ts |
| 2 | Update SectionCard.vue — Finding[] with chip rows | b29a31a | apps/web/src/components/SectionCard.vue |
| 3 | Upgrade useValidator, ResultsPane error state, App.vue | 5bd49c1 | useValidator.ts, ResultsPane.vue, App.vue, engine/src/index.ts, engine/src/llm.ts |

## What Was Built

### Task 1: provenance.ts utility

Created `apps/web/src/utils/provenance.ts` as the single source of truth for persona field → Vuetify color mapping:

- `FIELD_COLOR_MAP`: 7 field entries (goals→primary, pain_points→error, daily_workflow→secondary, vocabulary→tertiary, tech_comfort→info, pet_peeves→warning, review_lens→success)
- `chipColor(field)`: Returns mapped color or `'surface-variant'` fallback for unrecognized fields

### Task 2: SectionCard.vue — Finding[] + chip rows

- Props changed from `items: string[]` to `items: Finding[]`
- `bold(item)` replaced with `bold(item.text)` — reads from Finding object
- Chip row added per finding, gated by `v-if="item.sources && item.sources.length > 0"` (D-07: empty sources = no chips)
- Each chip: `variant="tonal"`, `:ripple="false"`, `size="x-small"`, `:color="chipColor(src)"`
- `aria-label` on chip container div for accessibility

### Task 3: Error state wiring

**useValidator.ts:**
- `errorKind` ref (`GatewayErrorKind | null`) added and reset in `runValidation()`
- Catch block duck-types GatewayError via `err.name === 'GatewayError'` (cannot import class in browser)
- `errorKind` returned alongside `error` in composable return

**ResultsPane.vue:**
- New props: `error: string | null`, `errorKind: GatewayErrorKind | null`
- `defineEmits<{ retry: [] }>()` added
- Computed: `errorHeading`, `errorBody`, `errorIcon` — all switch on errorKind covering 4 cases
- Error state block: `v-else-if="error"` with `v-alert type="error" variant="tonal"` + Try again button emitting `'retry'`
- Empty state condition updated: `!isValidating && !results && !error`

**App.vue:**
- Destructures `error` and `errorKind` from `useValidator()`
- Passes `:error`, `:error-kind`, `@retry="runValidation"` to `<ResultsPane>`

## PERS-04 Audit — InputPane.vue (confirm only, no changes)

Grep evidence confirming no edit affordance:
```
grep -n "v-tooltip|mdi-lock|mdi-pencil-off|persistent-hint" apps/web/src/components/InputPane.vue
→ (no output)

grep -rn "edit|authoring|mdi-lock|mdi-pencil" apps/web/src/components/InputPane.vue
→ (no output)
```

InputPane.vue uses `readonly` v-select (persona) and `readonly` v-text-field (PRD) — display-only. PERS-04 confirmed: zero edit affordance.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing Finding and GatewayErrorKind exports from engine public API**
- **Found during:** Task 3 TypeScript type check
- **Issue:** `packages/engine/src/index.ts` exported `PersonaYaml`, `ValidationResult`, `ValidateOptions` but NOT `Finding` (defined in types.ts) or `GatewayErrorKind` (defined in llm.ts). Both were needed by the web app per the plan.
- **Fix:** Added `Finding` to the import from `./types.js` and re-exported it; added `export type { GatewayErrorKind } from './llm.js'`
- **Files modified:** `packages/engine/src/index.ts`
- **Commit:** 5bd49c1

**2. [Rule 1 - Bug] Pre-existing TS2537 type cast error in llm.ts blocking engine build**
- **Found during:** Task 3 — engine rebuild triggered by deviation 1
- **Issue:** `tools: [submitValidationTool as Parameters<typeof this.client.messages.create>[0]['tools'][number]]` → TS2537: `ToolUnion[] | undefined` has no matching index signature for `number`
- **Fix:** Replaced with `as unknown as Parameters<...>[0] extends { tools?: (infer T)[] } ? T : never` — correctly extracts the element type without index signature error
- **Files modified:** `packages/engine/src/llm.ts`
- **Commit:** 5bd49c1

### Out-of-Scope Pre-existing Errors (Not Fixed)

The following pre-existing TypeScript errors exist in files outside this plan's scope and were not addressed:
- `PrdPane.vue`: `Cannot find module '*.md?raw'` — needs vite-env.d.ts type declaration
- `useValidator.ts`: `Property 'env' does not exist on type 'ImportMeta'` — same vite-env.d.ts issue
- `main.ts`: Cannot find side-effect imports for vuetify/styles and @mdi/font — needs CSS module type declarations

These are tracked for a future plan (UI/type cleanup).

## Known Stubs

None — all data paths in this plan are fully wired. The provenance chips receive real `sources: string[]` data from the fixture (migrated in 02-04). The error state is functional but won't render in normal demo flow (replay mode doesn't throw errors).

## Self-Check: PASSED

Files created/modified exist:
- FOUND: apps/web/src/utils/provenance.ts
- FOUND: apps/web/src/components/SectionCard.vue (modified)
- FOUND: apps/web/src/composables/useValidator.ts (modified)
- FOUND: apps/web/src/components/ResultsPane.vue (modified)
- FOUND: apps/web/src/App.vue (modified)
- FOUND: packages/engine/src/index.ts (modified)
- FOUND: packages/engine/src/llm.ts (modified)

Commits verified:
- 5343529 — feat(02-05): create provenance.ts utility
- b29a31a — feat(02-05): update SectionCard.vue with Finding[] chip rows
- 5bd49c1 — feat(02-05): wire Finding[] error state
