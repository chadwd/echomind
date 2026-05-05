---
phase: 01-demo-sliver
plan: "07"
subsystem: demo
tags: [demo, runbook, recorded-video, script, gateway, fixture]

# Dependency graph
requires:
  - phase: 01-05-web-app
    provides: web app with VITE_REPLAY_MODE replay path and four section cards
  - phase: 01-06-skill
    provides: CLI binary with --replay flag and echomind-validate SKILL.md
  - phase: 01-04-fixture-snapshot
    provides: pre-vetted fixture with "we caught X" dealer-to-dealer finding

provides:
  - "DEMO.md at repo root — complete recorded-video demo script with pre-recording checklist, two surface demos, narration beats, punchline, fallback procedures (DEMO-04)"
  - "Live gateway capture in fixtures/responses/gm-auctions-snapshot.json (DEMO-01, DEMO-03)"
  - "Dress rehearsal approved: both surfaces verified end-to-end from script"

affects:
  - phase-01-completion

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Recorded video demo format — pre-recording checklist gates on live gateway verification before hitting record"
    - "Dual fallback: VITE_REPLAY_MODE=true (web) and --replay flag (CLI) return pre-vetted fixture in <2 seconds"
    - "Live fixture capture via source .env.local && node packages/engine/dist/bin/echomind-validate.js"

key-files:
  created:
    - DEMO.md
    - fixtures/responses/gm-auctions-snapshot.json

key-decisions:
  - "Demo format changed from live audience presentation to recorded video submitted 2026-05-06 — script updated to reflect recording context (no audience Q&A, replay narration swap line included)"
  - "Live fixture capture moved to plan 07 — .env.local credentials were not available until this plan, making plan 04 unable to make a live gateway call at the time"
  - "Fixture replay is the preferred demo-day mode for both surfaces — swaps silently with no visible difference to viewers"

patterns-established:
  - "Demo script = pre-recording checklist + narrative beats + fallback procedures; narration text is part of the artifact, not improvised"
  - "Each surface demo has a live path and a fallback path; recording does not block on gateway availability"

requirements-completed:
  - DEMO-01
  - DEMO-03
  - DEMO-04

# Metrics
duration: 45min
completed: 2026-05-05
---

# Phase 01 Plan 07: Demo Runbook Summary

**DEMO.md written for recorded video format (~5 min script, two surfaces, live narration beats); dress rehearsal approved with live gateway confirmed working (claude-sonnet-4-6 via ACV gateway) and fixture updated from live capture**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-05-05
- **Completed:** 2026-05-05
- **Tasks:** 2 (Task 1: write DEMO.md; Task 2: dress rehearsal checkpoint — approved)
- **Files created:** 1 (DEMO.md); fixture updated with live capture

## Accomplishments

- Written `DEMO.md` at repo root: pre-recording checklist (8 items), web surface demo (~2 min), CLI/skill surface demo (~2 min), setup narrative (30 sec), closing line (30 sec), "We Caught X" section with exact finding quote, dual fallback procedures (VITE_REPLAY_MODE=true and --replay), timing reference table
- Revised format from live-audience script to recorded-video script — narration beats include swap lines for replay mode, contingency section updated (no live audience so "stop recording" is the contingency, not "skip ahead")
- Live gateway confirmed working end-to-end: `source .env.local && node packages/engine/dist/bin/echomind-validate.js` against claude-sonnet-4-6 via ACV proxy — four sections returned, friction finding present
- Fixture `fixtures/responses/gm-auctions-snapshot.json` updated with live gateway capture — replaces the seeded placeholder from plan 04
- Dress rehearsal checkpoint approved: DEMO.md reviewed, live gateway verified, fixture committed, format confirmed

## "We Caught X" Finding

**Section:** Friction
**Finding (exact):**
> "The flow only covers auction consignment. Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind."

**What it caught:** The PRD proposed a disposition score for inventory decisions, but the score only surfaces auction consignment paths. A GM manages two wholesale channels — auction lanes and direct dealer-to-dealer. The PRD never addressed the dealer-to-dealer channel. A PM reviewing this PRD would likely not catch it until a GM review. EchoMind surfaced it before stakeholder review.

## Task Commits

1. **Task 1: Write DEMO.md demo script** - `7eeed0d` (feat)
2. **Task 1 (edit): Update DEMO.md for recorded video format** - `c7c8ee2` (edit)
3. **Live fixture capture (plan 04 work completed here)** - `f2adfda` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `DEMO.md` — Complete recorded-video demo script: pre-recording checklist, two surface demos with narration, "we caught X" punchline, dual fallback procedures, timing table
- `fixtures/responses/gm-auctions-snapshot.json` — Updated from seeded placeholder to live gateway capture (claude-sonnet-4-6 via ACV proxy)

## Decisions Made

- **Recorded video format:** The demo context shifted from a live audience presentation to a recorded video submitted 2026-05-06 and shown to the team Thu/Fri. DEMO.md was revised to remove live-audience affordances (no Q&A section, no "pause for reactions" beats) and add recording-specific guidance (pre-recording checklist, "stop recording" contingency, replay swap narration).
- **Live fixture capture moved to plan 07:** Plan 04 was originally designed to capture the live gateway response, but `.env.local` credentials were not available at plan 04 execution time. The seeded fixture was approved as demo-safe. Capture happened here (plan 07) when `.env.local` was configured as part of gateway verification.

## Deviations from Plan

### Format Change

**1. [Rule 2 - Enhancement] Demo format revised from live-audience to recorded-video**
- **Found during:** Task 1 (DEMO.md authoring)
- **Issue:** The plan described a live-audience format ("Chad and Jake can run the full demo without improvising"), but the actual demo context is a recorded video submitted 2026-05-06
- **Fix:** Updated DEMO.md to recorded-video format: pre-recording checklist (not pre-demo), "before hitting record" gates, contingency = stop-and-restart (not skip-ahead), removed live-Q&A handling
- **Files modified:** `DEMO.md`
- **Commits:** `7eeed0d`, `c7c8ee2`

### Live Fixture Capture in Plan 07

**2. [Context shift] Live gateway capture completed here, not in plan 04**
- **Found during:** Task 1 / dress rehearsal
- **Reason:** `.env.local` credentials were unavailable at plan 04 execution time; seeded fixture was approved as demo-safe (Chad, 2026-05-05). Credentials became available in plan 07 as part of gateway verification for dress rehearsal.
- **Fix:** Captured live response during dress rehearsal verification; committed fixture update as `f2adfda`
- **Files modified:** `fixtures/responses/gm-auctions-snapshot.json`
- **Commit:** `f2adfda`

## Checkpoint Outcome

**Type:** human-verify (dress rehearsal)
**Outcome:** Approved — "approved — dress rehearsal passed"
**Verified:**
- DEMO.md reviewed and approved
- Live gateway confirmed working (claude-sonnet-4-6 via ACV gateway)
- Live fixture captured and committed
- .env.local created with working credentials (gitignored, not committed)
- Format confirmed: recorded video, submitted 2026-05-06, shown to team Thu/Fri

## Phase 1 Completion Status

All 7 plans complete. Phase 1 — Demo Sliver — is done.

| Plan | Name | Status |
|------|------|--------|
| 01-01 | Monorepo scaffold | Complete |
| 01-02 | Demo fixtures | Complete |
| 01-03 | Engine + gateway | Complete |
| 01-04 | Fixture snapshot | Complete |
| 01-05 | Web app | Complete |
| 01-06 | Skill | Complete |
| 01-07 | Demo runbook | Complete |

**Phase 1 success criteria met:**
1. Web app renders all four sections against hardcoded demo PRD and GM persona — PASS (VITE_REPLAY_MODE verified)
2. Claude Code skill renders same four sections in terminal — PASS (--replay verified)
3. At least one non-obvious GM pushback identified and scripted — PASS (dealer-to-dealer wholesale gap finding)
4. Chad and Jake can run the full demo from DEMO.md without improvising — PASS (dress rehearsal approved)
5. All LLM calls route through ACV gateway — PASS (no raw Anthropic API key in repo)

## Known Stubs

None. DEMO.md is a human-readable script; all command examples are verified working. The "We Caught X" finding section contains the exact fixture quote, not a placeholder.

## Self-Check: PASSED

- `DEMO.md` exists at `/Users/cdunbar/Repos/echomind/DEMO.md` — FOUND
- `fixtures/responses/gm-auctions-snapshot.json` committed in `f2adfda` — FOUND
- Commits `7eeed0d`, `c7c8ee2`, `f2adfda` all present in git log — FOUND
- "We Caught X" finding quote present in DEMO.md (not a placeholder) — FOUND
- VITE_REPLAY_MODE and ECHOMIND_REPLAY / --replay documented in DEMO.md — FOUND

---
*Phase: 01-demo-sliver*
*Completed: 2026-05-05*
