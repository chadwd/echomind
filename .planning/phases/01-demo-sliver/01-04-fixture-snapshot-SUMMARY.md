---
phase: 01-demo-sliver
plan: "04"
subsystem: cli
tags: [fixture, replay, cli, validation, snapshot]

# Dependency graph
requires:
  - phase: 01-03-engine-gateway
    provides: working engine with FixtureClient, LLM gateway integration, CLI binary

provides:
  - "--output-format json flag on CLI for structured output capture"
  - "Verified --replay deterministic fixture path (no gateway dependency)"
  - "Verified ECHOMIND_REPLAY=true env var triggers fixture path"
  - "Demo-day reliability: both CLI surfaces run entirely on committed fixture"

affects:
  - 01-05-web-app
  - 01-06-skill
  - 01-07-demo-runbook

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "--output-format json CLI option for structured JSON output alongside markdown render"
    - "ECHOMIND_REPLAY=true env var triggers FixtureClient (used by web layer)"

key-files:
  created:
    - fixtures/responses/gm-auctions-snapshot.json
  modified:
    - packages/engine/bin/echomind-validate.ts

key-decisions:
  - "Skip live gateway capture — seeded fixture approved as demo-safe (Chad, 2026-05-05)"
  - "Demo punch line identified: friction bullet on dealer-to-dealer wholesale channel gap"

patterns-established:
  - "Replay-first demo pattern: --replay (CLI) and ECHOMIND_REPLAY=true (web) both bypass gateway"
  - "ValidationResult fixture shape: {fit[], friction[], questions[], refinements[]} — all arrays non-empty"

requirements-completed:
  - DEMO-03
  - DEMO-04

# Metrics
duration: 15min
completed: 2026-05-05
---

# Phase 01 Plan 04: Fixture Snapshot Summary

**GM persona replay wired end-to-end: --replay and ECHOMIND_REPLAY=true both return a seeded 15-bullet ValidationResult with dealer-to-dealer wholesale gap as demo punch line**

## Performance

- **Duration:** 15 min
- **Started:** 2026-05-05T16:00:00Z
- **Completed:** 2026-05-05T16:15:00Z
- **Tasks:** 1 (of 2 — Task 2 was a human checkpoint, resolved via "skip")
- **Files modified:** 2

## Accomplishments

- Added `--output-format json` flag to CLI binary, enabling structured JSON output from validate runs
- Verified `--replay` flag returns deterministic fixture output (all four sections, no gateway call)
- Verified `ECHOMIND_REPLAY=true` env var also routes to FixtureClient (needed by web layer in Plan 05)
- Fixture validated: `{fit: 3, friction: 4, questions: 4, refinements: 4}` — all arrays non-empty

## Demo Punch Line

Chad approved the seeded fixture. The identified "we caught X" moment for demo narration:

> "Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind."

This is the friction bullet that surfaces the PRD's hidden channel blind spot — the GM persona caught that the disposition score only covers auction consignment, not dealer-to-dealer wholesale.

## Task Commits

1. **Task 1: Add --output-format json flag and verify replay paths** - `df6dd0c` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `fixtures/responses/gm-auctions-snapshot.json` — committed ValidationResult snapshot, 15 bullets across four sections; demo-safe, no live gateway needed
- `packages/engine/bin/echomind-validate.ts` — added `--output-format <format>` option (markdown default, json for structured capture)

## Decisions Made

- **Skip live gateway capture:** No `.env.local` available in execution environment. Chad reviewed the seeded fixture directly and approved it as demo-safe. Decision: "skip — using replay only."
- **Demo punch line:** Dealer-to-dealer wholesale gap (friction section, bullet 2) identified as the most non-obvious, defensible GM pushback for demo narration.

## Deviations from Plan

### Human-Approved Scope Change

**Live gateway capture skipped — seeded fixture used as-is**
- **Found during:** Task 2 checkpoint (human-verify gate)
- **Issue:** `.env.local` with `ECHOMIND_LLM_BASE_URL` not available in execution context; live gateway capture not possible
- **Resolution:** Chad reviewed the seeded `fixtures/responses/gm-auctions-snapshot.json` and explicitly approved it as demo-ready. Checkpoint decision: "skip — using replay only."
- **Impact:** No functional gap. Fixture is substantive, contains the intended GM pushback, and replay paths work deterministically. Demo-day reliability fully established without a live gateway dependency.

---

**Total deviations:** 1 human-approved scope reduction
**Impact on plan:** No scope creep. The seeded fixture meets all acceptance criteria. Both replay paths (--replay and ECHOMIND_REPLAY=true) verified working.

## Issues Encountered

None during execution. Build and replay verification passed on first attempt.

## User Setup Required

None - no external service configuration required for replay mode. Live gateway requires `.env.local` with `ECHOMIND_LLM_BASE_URL` (documented in Plan 03).

## Next Phase Readiness

- Plan 05 (web app) can use `VITE_REPLAY_MODE=true` → `ECHOMIND_REPLAY=true` to run entirely on fixture; no gateway needed for demo
- Plan 06 (skill) can use `--replay` flag for offline demo runs
- Plan 07 (demo runbook) has the punch line quote to narrate
- Fixture section counts for runbook reference: Fit: 3, Friction: 4, Questions: 4, Refinements: 4

---
*Phase: 01-demo-sliver*
*Completed: 2026-05-05*
