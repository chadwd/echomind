---
phase: 02-engine-hardening
plan: 01
subsystem: engine
tags: [types, schema, breaking-change, provenance, Finding]
dependency_graph:
  requires: []
  provides: [Finding interface, ValidationResult-Finding[], submit_validation-Finding-schema]
  affects: [llm.ts, echomind-validate.ts, useValidator.ts, SectionCard.vue, ResultsPane.vue]
tech_stack:
  added: []
  patterns: [Finding object schema, findingItemSchema constant reuse]
key_files:
  created: []
  modified:
    - packages/engine/src/types.ts
    - packages/engine/src/tool.ts
decisions:
  - "Finding (not ValidationFinding) — short, unambiguous TypeScript name per plan spec"
  - "sources: [] is valid (D-03) — no minimum length enforced, finding accepted without traced source"
  - "findingItemSchema constant defined once, reused for all four tool schema sections"
  - "llm.ts line-32 TS2537 error confirmed pre-existing (not caused by this plan)"
metrics:
  duration: ~8 minutes
  completed_date: "2026-05-06"
  tasks: 2
  files: 2
---

# Phase 02 Plan 01: Schema Foundation — Finding Interface Summary

**One-liner:** Breaking `ValidationResult` schema from `string[]` to `Finding[]` with `{text, sources}` shape, updating the `submit_validation` tool schema to require provenance fields per finding.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add Finding interface to types.ts | abc7b2e | packages/engine/src/types.ts |
| 2 | Update submit_validation tool schema and parseToolResult | a28e644 | packages/engine/src/tool.ts |

## What Was Built

### Task 1: Finding Interface (types.ts)

Added `Finding` interface between `PersonaYaml` and `ValidationResult`:

```typescript
export interface Finding {
  text: string;
  sources: string[];
}
```

Updated `ValidationResult` to use `Finding[]` for all four sections (was `string[]`):

```typescript
export interface ValidationResult {
  fit: Finding[];
  friction: Finding[];
  questions: Finding[];
  refinements: Finding[];
}
```

`PersonaYaml` and `ValidateOptions` interfaces are unchanged.

### Task 2: Tool Schema + parseToolResult (tool.ts)

- Added `Finding` import alongside `ValidationResult`
- Introduced `findingItemSchema` constant (defined once, reused for all four tool schema properties)
- Updated `submit_validation` tool `input_schema` — each section's items are now `{type: 'object', properties: {text, sources}, required: ['text', 'sources']}`
- Updated `parseToolResult` to cast to `Finding[]` instead of `string[]`

The tool schema change is the mechanism that elicits provenance from the LLM — the LLM must now provide `{text, sources}` objects for every finding.

## Verification Results

- `export interface Finding` present in types.ts at line 18
- `sources: string[]` present at line 20
- All four section arrays (`fit`, `friction`, `questions`, `refinements`) use `Finding[]`
- `required: ['text', 'sources']` present in tool.ts at line 9
- `Finding[]` casts in parseToolResult at lines 29-32
- `Finding` imported from `./types.js` at line 1 of tool.ts
- `grep -rn "fit: string[]" packages/engine/src/` returns zero results — old type eliminated
- TypeScript check (`npx tsc --noEmit` in packages/engine) shows one pre-existing error at `llm.ts(32)` — confirmed pre-existing via stash test before our change

## TypeScript Propagation Confirmed

The schema change propagates to all consumer files as designed. Downstream plans (02-02 through 02-07) will resolve each consumer:

- `packages/engine/src/llm.ts` — pre-existing TS2537 at line 32 (unrelated to schema change; separate from propagation)
- `packages/engine/bin/echomind-validate.ts` — iterates `Finding[]`, currently treats `f` as string
- `apps/web/src/components/SectionCard.vue` — `items: string[]` prop, needs `Finding[]`
- `apps/web/src/composables/useValidator.ts` — imports `ValidationResult`, will compile against new shape
- `apps/web/src/components/ResultsPane.vue` — passes results sections to SectionCard

## Deviations from Plan

None — plan executed exactly as written.

The pre-existing `llm.ts(32)` TypeScript error (TS2537: `ToolUnion[] | undefined` has no matching index signature for `number`) was investigated and confirmed pre-existing via stash verification. It is not caused by or related to our schema change. Deferred to the LLM-03 / error handling plan.

## Known Stubs

None — this plan is a pure type definition change. No rendering, no data flow, no UI stubs introduced.

## Self-Check: PASSED

- FOUND: packages/engine/src/types.ts
- FOUND: packages/engine/src/tool.ts
- FOUND: .planning/phases/02-engine-hardening/02-01-SUMMARY.md
- FOUND: commit abc7b2e (feat(02-01): add Finding interface...)
- FOUND: commit a28e644 (feat(02-01): update submit_validation tool schema...)
