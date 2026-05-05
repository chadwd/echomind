---
phase: 01-demo-sliver
plan: 05
subsystem: web
tags: [vue3, vuetify, web-app, demo, composable, components]
dependency_graph:
  requires: [01-04-fixture-snapshot]
  provides: [web-app-demo-flow, InputPane, ResultsPane, SectionCard, useValidator]
  affects: [01-07-demo-runbook]
tech_stack:
  added: []
  patterns: [vue3-composable, vuetify-layout, fixture-replay]
key_files:
  created:
    - apps/web/src/composables/useValidator.ts
    - apps/web/src/components/InputPane.vue
    - apps/web/src/components/ResultsPane.vue
    - apps/web/src/components/SectionCard.vue
  modified:
    - apps/web/src/App.vue
decisions:
  - "Engine imports are type-only in the web bundle — Node.js APIs (fs/promises, path) cannot run in browser; live mode deferred to Phase 2 server API"
  - "Replay mode loads fixture JSON via direct import (browser-safe); VITE_REPLAY_MODE=true is the demo-day path"
  - "prdText loaded via Vite ?raw import — no fetch, no async, fails fast if file < 500 chars"
metrics:
  duration: ~20min
  completed_date: "2026-05-05"
  tasks: 2
  files: 5
---

# Phase 01 Plan 05: Web App (Demo Flow) Summary

Vue 3 + Vuetify web app with InputPane, ResultsPane, SectionCard, and useValidator composable wired end-to-end; VITE_REPLAY_MODE=true demo flow works with the GM auctions fixture.

## What Was Built

### Task 1: useValidator composable + InputPane component

**apps/web/src/composables/useValidator.ts**
- Reactive state: `isValidating`, `step` (0-4), `results`, `error`
- GM persona hardcoded inline, field-for-field from `personas/general-manager.yaml`
- PRD text loaded via `?raw` import (build-time inlining, browser-safe)
- Runtime guard: throws if `prdText.length < 500` (catches bundler misconfiguration)
- Replay mode: `import.meta.env['VITE_REPLAY_MODE'] === 'true'` short-circuits to fixture JSON import
- Step progression: 1 (300ms) → 2 (300ms) → 3 (gateway/fixture) → 4 (200ms) → idle

**apps/web/src/components/InputPane.vue**
- VCard outlined/rounded=lg container with pa-6
- VSelect: disabled, items=['General Manager'], label='Persona', prepend-inner-icon='mdi-account'
- VTextField: disabled, model-value='ACV MAX Auctions Integration', label='PRD', prepend-inner-icon='mdi-file-document'
- VBtn: color='primary', size='large', block, :loading='isValidating', emits 'validate'

### Task 2: ResultsPane + SectionCard + wire App.vue

**apps/web/src/components/SectionCard.vue**
- Props: title (string), icon (string), items (string[])
- VCard variant='elevated' elevation=2 rounded='lg'
- VCardTitle with VIcon + section name (text-h6)
- VCardText with VList density='compact' lines='two', VListItem per finding

**apps/web/src/components/ResultsPane.vue**
- Empty state: mdi-lightning-bolt-outline icon, "Ready to validate" heading, full body copy per UI-SPEC
- VStepper (non-linear, flat, bg-transparent) with 4 VStepperItem steps
- VRow 2-col grid (md=6, cols=12) rendering four SectionCard components
- Sections array: fit/mdi-check-bold, friction/mdi-alert, questions/mdi-comment-question, refinements/mdi-pencil

**apps/web/src/App.vue** (updated from Plan 01 shell)
- VAppBar elevation=1 color='surface', wordmark 'EchoMind' in text-h5 font-weight-semibold
- VContainer fluid, two-column VRow: 360px InputPane left, flex ResultsPane right
- Wired via useValidator: isValidating, step, results, runValidation

## Build Output

```
vite v5.4.21 building for production...
✓ 271 modules transformed.
dist/assets/index-CE86aYhS.js   329.30 kB | gzip: 110.99 kB
dist/assets/index-DKHSND8r.css  678.03 kB | gzip:  97.08 kB
✓ built in 1.10s
```

No TypeScript errors. No secrets in browser bundle (verified).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Engine imports Node.js APIs — not browser-compatible**
- **Found during:** Task 2 build verification
- **Issue:** `@echomind/engine` uses `fs/promises` and `path` from Node.js. Even dynamic `import('@echomind/engine')` causes Vite to bundle these into the browser chunk, resulting in build error: `"readFile" is not exported by "__vite-browser-external"`
- **Fix:** Changed to `import type` only from `@echomind/engine` (types are erased at build time). Replay mode uses direct JSON fixture import. Live mode shows a clear error message directing user to set `VITE_REPLAY_MODE=true`. Phase 2 will add a server-side API endpoint for live gateway calls.
- **Files modified:** `apps/web/src/composables/useValidator.ts`
- **Commit:** 4b3cc27

**Note on plan spec:** The plan specified `import { validate } from '@echomind/engine'` in the composable. This was not viable for a browser bundle because the engine is a Node.js package. The deviation correctly solves the demo-day requirement (replay mode works perfectly) and documents the Phase 2 path clearly.

## Known Stubs

- **Live gateway mode in browser** (`useValidator.ts` line 104-108): throws an error directing user to use `VITE_REPLAY_MODE=true`. This is intentional for Phase 1 — the engine is Node.js-only and the demo uses replay mode. Phase 2 will add a server-side API endpoint.

This stub does NOT prevent the plan's goal from being achieved. Replay mode (`VITE_REPLAY_MODE=true`) is the intended demo-day path per D-08.

## Replay Mode Verification

With `VITE_REPLAY_MODE=true`:
1. Open http://localhost:5173 — EchoMind app bar visible, input pane with disabled persona/PRD fields, Validate button enabled
2. Click Validate — stepper progresses through 4 steps (loading persona → loading PRD → calling validator → rendering output)
3. Four section cards render: Fit (3 bullets), Friction (4 bullets), Questions (4 bullets), Refinements (4 bullets)
4. GM punch line in Friction: "Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind."

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: useValidator + InputPane | 53b4052 | useValidator.ts, InputPane.vue |
| Task 2: ResultsPane + SectionCard + App.vue | 4b3cc27 | ResultsPane.vue, SectionCard.vue, App.vue, useValidator.ts |

## Self-Check: PASSED
