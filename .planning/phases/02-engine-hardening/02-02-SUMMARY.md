---
phase: 02-engine-hardening
plan: "02"
subsystem: engine
tags: [prompt-engineering, provenance, llm-instructions, typescript]

requires:
  - phase: 02-01
    provides: Finding interface and submit_validation tool schema with sources[] field

provides:
  - buildUserMessage() appends explicit provenance-tracing instruction to LLM
  - All 7 persona field names listed verbatim in the instruction

affects: [02-05, 02-06, 02-07]

tech-stack:
  added: []
  patterns:
    - "Provenance instruction appended after PRD block — natural-language companion to tool schema constraint"

key-files:
  created: []
  modified:
    - packages/engine/src/prompt.ts

key-decisions:
  - "Instruction appended cleanly after PRD closing fence — no preamble, no structural disruption to existing prompt"
  - "sources: [] (empty) explicitly permitted in instruction wording — permissive, non-blocking per D-03"
  - "All 7 field names (goals, daily_workflow, pain_points, vocabulary, tech_comfort, pet_peeves, review_lens) listed verbatim — LLM receives unambiguous enumeration"

patterns-established:
  - "Natural-language provenance instruction paired with tool schema constraint — both required to elicit populated sources[]"

requirements-completed:
  - VALD-03

duration: 1min
completed: 2026-05-06
---

# Phase 2 Plan 02: Provenance Instruction in buildUserMessage Summary

**Explicit provenance-tracing instruction appended to buildUserMessage(), naming all 7 persona field names so the LLM populates sources[] per finding**

## Performance

- **Duration:** ~1 min
- **Started:** 2026-05-06T16:28:31Z
- **Completed:** 2026-05-06T16:29:16Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added provenance instruction block after PRD closing fence in `buildUserMessage()`
- All 7 persona field names listed verbatim: goals, daily_workflow, pain_points, vocabulary, tech_comfort, pet_peeves, review_lens
- Instruction explicitly permits `sources: []` (empty) — matches D-03 permissive stance
- No other functions in `prompt.ts` were modified (`toBullets`, `extractTemplateContent`, `buildSystemPrompt` unchanged)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add provenance instruction to buildUserMessage** - `d0c1cfa` (feat)

**Plan metadata:** (final docs commit follows)

## Files Created/Modified

- `packages/engine/src/prompt.ts` - Added provenance-tracing instruction block after the PRD closing fence in buildUserMessage()

## Decisions Made

None — followed plan as specified. The exact instruction text was provided verbatim in the plan from the research phase (02-RESEARCH.md prompt.ts section).

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `prompt.ts` is complete; `buildUserMessage()` now instructs the LLM to populate `sources[]` per finding
- Wave 2 parallel plans (02-03, 02-04) are independent — no ordering constraint with this plan
- Wave 3 web/CLI surface plans (02-05, 02-06) depend on Wave 1+2 completion; this plan contributes to that readiness

---
*Phase: 02-engine-hardening*
*Completed: 2026-05-06*
