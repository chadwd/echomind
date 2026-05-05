---
phase: 01-demo-sliver
plan: 02
subsystem: fixtures
tags: [persona, yaml, prd, fixtures, gm, auctions]

# Dependency graph
requires: []
provides:
  - GM persona YAML annotated with 9 provenance comments (PERS-02 satisfied)
  - fixtures/prds/acvmax-auctions.md — 676-word ACV MAX Auctions PRD with three designed flaws
  - fixtures/responses/ directory ready for Plan 04 snapshot capture
affects:
  - 01-03-engine-gateway
  - 01-04-fixture-snapshot
  - 01-05-web-app
  - 01-06-skill

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Provenance annotation pattern: # source: comments on major YAML field blocks (PERS-02)"
    - "Fixtures directory convention: fixtures/prds/ for input PRDs, fixtures/responses/ for LLM snapshots"

key-files:
  created:
    - fixtures/prds/acvmax-auctions.md
    - fixtures/responses/.gitkeep
  modified:
    - personas/general-manager.yaml

key-decisions:
  - "PRD title revised from 'Consignment Optimizer' to 'Mobile Live Bid' per Chad review at checkpoint"
  - "Three designed flaws are intentional and confirmed in place — do not fix in engine or web layers"
  - "PERS-02 satisfied at Phase 1 scope: field-level provenance comments only; per-finding traceability deferred to Phase 2 (VALD-03)"

patterns-established:
  - "Designed flaw discipline: PRD flaws are documented in SUMMARY, not fixed — they are the demo's 'we caught X' moment"

requirements-completed:
  - PERS-02
  - DEMO-03

# Metrics
duration: ~30min
completed: 2026-05-05
---

# Phase 01 Plan 02: Demo Fixtures Summary

**676-word ACV MAX Auctions PRD with three designed GM-catchable flaws, GM persona annotated with 9 provenance source comments (PERS-02)**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-05-05T09:44:10Z
- **Completed:** 2026-05-05T09:54:13Z (+ checkpoint review)
- **Tasks:** 3 (0: persona annotation, 1: PRD draft, 2: human-verify checkpoint — PASSED)
- **Files modified:** 3

## Accomplishments

- GM persona annotated with 9 `# source:` provenance comments across all major field blocks — PERS-02 satisfied for Phase 1 (field-level; per-finding traceability deferred to Phase 2)
- 676-word PRD for "ACV MAX Auctions: Mobile Live Bid" written at realistic PM draft quality with three deliberately designed flaws the GM persona will catch
- Chad reviewed and approved the PRD at the checkpoint; one edit made: title updated from "Consignment Optimizer" to "Mobile Live Bid"
- fixtures/responses/ directory created with .gitkeep, ready for Plan 04 snapshot capture

## Task Commits

1. **Task 0: Annotate GM persona with provenance comments** — `8932309` (feat)
2. **Task 1: Draft ACV MAX Auctions PRD** — `54f7e63` (feat)
3. **Task 2: Human verify checkpoint — Chad approved, title revised** — `6f9bbaf` (edit)

## Files Created/Modified

- `personas/general-manager.yaml` — 9 `# source:` provenance comments added to all major field blocks; no data values changed
- `fixtures/prds/acvmax-auctions.md` — 676-word PRD, final title "ACV MAX Auctions: Mobile Live Bid"
- `fixtures/responses/.gitkeep` — empty placeholder tracking the responses directory for Plan 04

## Designed Flaws (Confirmed Present — Do Not Fix)

These are intentional. They exist so the GM persona has non-obvious things to catch during validation.

1. **Hidden retail/wholesale split** — The optimizer outputs a single "disposition score" (1–10). There is no separate retail probability or wholesale recommendation. The GM will flag: "What's my retail vs. wholesale breakdown?"
2. **Multi-click workflow** — The detail card is the only place to see the full score and contributing factors. The inventory list shows only the "Auction Ready" badge — no sortable score column. GM will flag: "I need to click into every unit?"
3. **Vague success metric** — "Reduce time-to-disposition" is listed as a KPI with no baseline against current turn rate. GM will flag: "Reduce from what? What's the current number?"

Open Question 2 in the PRD ("Wholesale vs. auction channel: does the score differentiate between auction and wholesale-to-dealer?") also surfaces flaw 1 naturally — a sharp reader will notice the PRD doesn't answer its own question.

## Checkpoint: Human Review (Task 2)

- **Status:** PASSED
- **Reviewer:** Chad
- **Outcome:** PRD content approved. Three designed flaws confirmed in place.
- **Edit made:** Title updated from "ACV MAX Auctions: Consignment Optimizer" to "ACV MAX Auctions: Mobile Live Bid"
- **Commit:** `6f9bbaf`

## Provenance Annotation Counts

- `# source:` lines in `personas/general-manager.yaml`: **9**
- Top-of-file provenance convention block: present
- Requirement: PERS-02 — documented provenance on major fields — SATISFIED

## Decisions Made

- PERS-02 scoped to field-level provenance for Phase 1; per-finding traceability (linking output findings back to specific persona fields) is Phase 2 work (VALD-03)
- PRD title "Mobile Live Bid" reflects Chad's preferred demo framing — all references in engine and web should use this title
- Designed flaws are a first-class artifact of the demo, not bugs — no fix should be applied upstream in engine or persona

## Deviations from Plan

None — plan executed exactly as written. The title update was a checkpoint-stage edit requested by the human reviewer, not an unplanned deviation.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Known Stubs

None — PRD is complete content, not placeholder text. Engine/web layers (Plans 03–05) will reference this file by path.

## Next Phase Readiness

- `fixtures/prds/acvmax-auctions.md` ready for Plan 03 (engine gateway smoke-test via `--prd` flag)
- `fixtures/responses/` directory ready for Plan 04 (snapshot capture)
- Designed flaws are in place — the "we caught X" moment is set up for the validator to surface
- Persona provenance annotation complete — Plan 05 (web app) can display persona field origins if needed

---
*Phase: 01-demo-sliver*
*Completed: 2026-05-05*
