# Session 004 — Engine Hardening (Phase 2)

**Date:** 2026-05-06
**Type:** Phase execution (fully automated + human checkpoint)
**Participants:** Chad, AI facilitator
**Duration:** ~1 hour
**Output artifacts:** Phase 2 complete (7 plans, 4 waves); 17 commits on `persona-foundation` branch

---

## Why this session happened

Phase 1 and 1.1 shipped a working demo — engine running, fixture loading, web app styled. But the output shape was `string[]` on every section, no finding was traceable to the persona field that drove it, the LLM error path was untyped, and the InputPane had no formal guardrail preventing persona field edits. Phase 2 hardened all of this: a single `Finding` type propagates end-to-end through the engine, web app, and CLI; every finding can carry `sources[]` back to specific persona fields; gateway errors classify into known kinds; and the anti-gaming constraint is verified by grep, not by convention.

---

## Starting state

- **Working app:** Full demo stack — engine, fixture, skill, styled web UI with 3-column layout and M3 theme.
- **Output type:** `ValidationResult` used `string[]` for all four sections — no structure on individual findings.
- **Provenance:** Non-existent. The prompt told the LLM to produce findings but gave no instruction to trace them back to persona fields.
- **Error handling:** `GatewayClient.complete()` threw raw errors. The web app had no typed error state.
- **PERS-04 guardrail:** InputPane used `readonly` on persona fields (established in Phase 1.1), but there was no formal audit or documented invariant.
- **Phase plan:** 7 plans across 4 waves. Plans 01–06 autonomous; Plan 07 human checkpoint.

---

## What was built, wave by wave

### Wave 1 — Schema foundation (Plan 01-01)

Single plan, no parallelization needed.

**`Finding` interface added to `packages/engine/src/types.ts`:**
```typescript
export interface Finding {
  text: string;
  sources: string[];
}
```
`ValidationResult` updated: all four sections (`fit`, `friction`, `questions`, `refinements`) changed from `string[]` to `Finding[]`.

**`submit_validation` tool schema updated in `packages/engine/src/tool.ts`:**
Introduced `findingItemSchema` (a reusable Zod-style JSON Schema object for `{text, sources}`) and applied it to all four tool properties. `parseToolResult` updated to cast to `Finding[]`.

**Effect:** TypeScript compiler immediately propagated errors to all 6 consumer files — `echomind-validate.ts`, `SectionCard.vue`, `useValidator.ts`, `ResultsPane.vue`, and others. This was the intended safety net: the type system finds all the wiring gaps before any agent touches a consumer file.

Note: One pre-existing TS2537 error in `llm.ts` (line 32, unrelated to schema) was confirmed by the agent as pre-existing and documented.

---

### Wave 2 — Provenance, error classification, fixture migration (Plans 02–04, parallel)

**Plan 02-02 — Provenance instruction in `prompt.ts`:**
`buildUserMessage()` now appends an explicit provenance-tracing instruction block after the PRD closing fence. The instruction names all 7 persona field names verbatim (`goals`, `daily_workflow`, `pain_points`, `vocabulary`, `tech_comfort`, `pet_peeves`, `review_lens`) and explicitly states that `sources: []` is valid when a finding is genuinely cross-cutting. The LLM now has a contract, not a hope.

**Plan 02-03 — `GatewayError` classification in `llm.ts`:**
`GatewayError` class and `GatewayErrorKind` type exported from the engine. `GatewayClient.complete()` wraps all throws in a try/catch that classifies by HTTP status:
- 401/403 → `auth`
- 429 → `rate_limit`
- ETIMEDOUT / ECONNRESET / timeout string → `timeout`
- everything else → `unknown`

A re-throw guard prevents double-wrapping. The VALD-05 no-log invariant is documented as a comment at both the module level and the `FixtureClient` class level — no console.log anywhere in the engine source.

**Plan 02-04 — Fixture migration:**
`fixtures/responses/gm-auctions-snapshot.json` migrated from `string[]` to `Finding[]`. All 20 entries (5 per section) wrapped as `{ "text": "<original verbatim>", "sources": [] }`. Original bold markers preserved. The fixture runtime shape now matches the updated `ValidationResult` type — replay mode works immediately without a type cast.

---

### Wave 3 — Web app wiring + CLI renderer (Plans 02-05 and 02-06, parallel)

**Plan 02-05 — Web app Finding[] wiring (3 tasks):**

*Task 1 — `provenance.ts` created:*
`apps/web/src/utils/provenance.ts` exports `FIELD_COLOR_MAP` (all 7 persona fields → Vuetify color tokens) and `chipColor(field: string)` which returns the token or falls back to `secondary`. This is the single source of truth for chip colors across any future component.

*Task 2 — `SectionCard.vue` updated:*
Finding rows now render from `Finding[]`. A chip row appears below each finding text, guarded by `item.sources.length > 0` — so the migrated fixture (all `sources: []`) renders cleanly with no chips, and live LLM output with populated sources will render chips automatically.

*Task 3 — Error state wired through the stack:*
`useValidator.ts` now exposes `errorKind` (typed as `GatewayErrorKind | null`). `ResultsPane.vue` renders a `v-alert` with computed heading/body/icon based on the kind. `App.vue` threads `error`, `errorKind`, and a `runValidation` retry handler down to `ResultsPane`. The retry button closes the loop.

**Auto-fixed deviations (Rule 1 — bug):**
- `packages/engine/src/index.ts` was missing `Finding` and `GatewayErrorKind` exports. Added both so the web app type-checks cleanly against the engine's public API.
- `packages/engine/src/llm.ts` had a pre-existing TS2537 type cast error on the `tools` parameter. Fixed with conditional type inference instead of direct indexing.

**PERS-04 audit result:** InputPane confirmed by grep to have zero edit affordance — `readonly` v-select and v-text-field, no tooltips, no lock icons, no edit hints, no click handlers on persona fields.

**Plan 02-06 — CLI renderer:**
`packages/engine/bin/echomind-validate.ts` updated in all four section renderers. The old bare-string pattern (`- ${f}`) that TypeScript now correctly rejected was replaced with the D-08 annotation pattern:
```typescript
const ann = f.sources.length ? ` *(${f.sources.join(', ')})*` : '';
console.log(`- ${f.text}${ann}`);
```
Engine TypeScript build: clean. CLI smoke-test with `--replay`: exit 0, all 20 findings rendered correctly, no annotation shown (fixture has `sources: []`). JSON output format (`--output-format json`) also verified — `Finding[]` serializes correctly with `text` and `sources` keys.

---

### Wave 4 — Integration gate (Plan 02-07, checkpoint)

Automated checks (Task 1, 7 checks):

| Check | Result |
|-------|--------|
| Engine `tsc --noEmit` | PASS |
| Web app `vue-tsc --noEmit` | PASS (after deviation fix below) |
| CLI smoke-test (`--replay`, markdown) | PASS |
| VALD-04 JSON schema (Finding[] shape) | PASS |
| VALD-05 no-log audit (zero console.log in engine/composables) | PASS |
| PERS-04 guardrail grep on InputPane | PASS |
| Finding type import on both surfaces | PASS |

**Deviation — `apps/web/env.d.ts` created:**
`vue-tsc` was failing on `?raw` imports, `import.meta.env`, and CSS side-effect imports. The Vite project had no `/// <reference types="vite/client" />` declaration. The agent created `env.d.ts` with this reference — standard Vite project setup that was missing from the initial scaffold.

Human sign-off: **approved**.

---

## Key decisions made

| Decision | Rationale |
|----------|-----------|
| `findingItemSchema` defined once in `tool.ts`, reused for all 4 sections | DRY at the schema level — a single change updates all four tool property shapes simultaneously |
| `sources: []` explicitly permitted in provenance instruction | Some findings are genuinely cross-cutting. Forcing a source on every finding would produce noise or hallucinated field names. Empty array is the honest signal. |
| `GatewayError` re-throw guard | Without it, a `GatewayError` thrown by an inner helper and caught by `complete()`'s outer catch would be wrapped a second time, losing the original `kind`. |
| VALD-05 documented as a comment, not just enforced by lint | The no-log invariant must survive developer onboarding. A comment at the module level explains *why* — not just that it's prohibited. |
| Chip row guarded by `sources.length > 0` | The migrated fixture has `sources: []` everywhere. Rendering empty chip rows would look broken. The guard means the architecture is correct now; chips appear automatically when the live LLM populates sources. |
| `provenance.ts` as a separate utility module | Keeps `FIELD_COLOR_MAP` out of `SectionCard.vue` — it's reusable by any future component that needs persona-field color tokens. |

---

## Problems we faced and how we resolved them

| Problem | Resolution |
|---------|------------|
| `Finding` and `GatewayErrorKind` not exported from engine's public API | `packages/engine/src/index.ts` was missing these exports. Auto-fixed by the 02-05 agent when it hit the type error on import in the web app. |
| Pre-existing TS2537 in `llm.ts` (tools parameter) | The `tools` property type was indexed incorrectly — fixed with conditional type inference. This was pre-existing, not introduced by Phase 2. |
| `apps/web/env.d.ts` missing | Vite project needs `/// <reference types="vite/client" />` for `import.meta.env` and `?raw` imports to type-check. Created during the integration gate. |

---

## Patterns established

**`Finding[]` end-to-end contract:** Engine tool schema enforces `{text, sources}` at the LLM boundary. `types.ts` owns the TypeScript type. Web and CLI both import from `@echomind/engine`. The fixture matches the runtime shape. This is the full stack — changing the Finding shape in `types.ts` propagates errors everywhere via TypeScript.

**Provenance instruction convention:** The `buildUserMessage()` function appends a structured instruction block that names persona fields verbatim. This is the pattern for any future prompt extension that needs the LLM to self-annotate its output with metadata.

**`GatewayErrorKind` classification pattern:** HTTP status → named kind → typed prop → UI copy. Adding a new error kind (e.g., `quota_exceeded`) means: (1) add to the union in `llm.ts`, (2) add a classification branch in `complete()`, (3) add a case in `ResultsPane.vue`'s computed. No other files need to change.

**Chip color from `provenance.ts`:** All persona-field color decisions live in `FIELD_COLOR_MAP`. Components call `chipColor(field)` — they don't know the map. This is the single place to update if field names or color assignments change.

---

## What we're moving forward with

**Phase 2 complete.** Verified: 14/14 must-haves, all 5 requirements satisfied (VALD-03, VALD-04, VALD-05, PERS-04, LLM-03).

The app currently renders the fixture with `sources: []` everywhere — correct for the demo. When the live LLM populates `sources`, provenance chips will appear automatically in `SectionCard.vue` without any further wiring.

**Phase 3 is the next planned phase** — Confluence/Notion link input, persona picker, copy/export, running state, and skill file output. This is the gap between "hackathon demo" and "PO actually uses this in a sprint." Whether to proceed depends on priority: if the demo is the goal, Phase 3 is not urgent.

**Branch state:** `persona-foundation` — all Phase 2 commits on this branch.

---

## Open threads

- **Live provenance chips not yet tested:** The fixture has `sources: []` everywhere, so no chips render in the current demo. The architecture is correct but the chip rendering path (populated `sources[]` from a live LLM call) has not been visually verified. Worth testing with a live run before a PO demo.
- **Live error state not yet tested:** The `v-alert` error state is wired and TypeScript-verified but has only been confirmed by code review, not by intentionally triggering a gateway error. Test by temporarily setting `VITE_REPLAY_MODE=false` with no valid gateway credentials.
- **`env.d.ts` was missing from the scaffold:** The Phase 1 monorepo scaffold did not include this file. If the project is cloned fresh, `vue-tsc` will fail until `env.d.ts` is present. Worth noting in onboarding docs or a `postinstall` check.
- **`DEMO.md` narration gap (carried from Phase 1 VERIFICATION):** The demo script references a "dealer-to-dealer" friction finding that doesn't exist in the current fixture. Still needs to be fixed before the demo recording — update `DEMO.md` to quote one of the 5 actual friction findings.
