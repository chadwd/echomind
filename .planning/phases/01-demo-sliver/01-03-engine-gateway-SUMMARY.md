---
phase: 01-demo-sliver
plan: 03
subsystem: engine
tags: [anthropic-sdk, gateway, cli, tool-use, system-prompt, persona, validation]

# Dependency graph
requires:
  - phase: 01-demo-sliver/plan-01
    provides: engine scaffold (GatewayClient, FixtureClient, validate(), types)
  - phase: 01-demo-sliver/plan-02
    provides: demo fixtures (acvmax-auctions.md PRD, general-manager.yaml persona)
provides:
  - End-to-end CLI binary that renders four-section markdown validation output
  - Fixed system prompt path resolution (process.cwd() instead of import.meta.url)
  - Template extraction that strips markdown wrapper from persona-system-prompt.md
  - .env.local.example with all required env vars documented
  - gm-auctions-snapshot.json fixture for replay smoke testing
affects: [01-04-fixture-snapshot, 01-05-web-ui, 01-06-skill-surface]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "process.cwd() for repo-root-relative file paths in compiled ESM modules"
    - "Extract template content from markdown code block before LLM submission"
    - "FixtureClient + --replay flag for gateway-free smoke testing"

key-files:
  created:
    - .env.local.example
    - fixtures/responses/gm-auctions-snapshot.json
  modified:
    - packages/engine/src/index.ts
    - packages/engine/src/prompt.ts

key-decisions:
  - "Use process.cwd() instead of import.meta.url for system prompt template path — import.meta.url resolves to packages/prompts/ in compiled dist/ which doesn't exist"
  - "Extract template from markdown code block in persona-system-prompt.md — send only the raw prompt text to LLM, not the surrounding documentation"
  - "Seed gm-auctions-snapshot.json with substantive GM-voice content for replay tests — Plan 04 will capture real gateway output and replace this seed"

patterns-established:
  - "CLI smoke test uses --replay flag against gm-auctions-snapshot.json to verify end-to-end render without gateway credentials"
  - "buildSystemPrompt() accepts full markdown file content and extracts the template block internally"

requirements-completed: [VALD-01, VALD-02, LLM-01, LLM-02, SKIL-02]

# Metrics
duration: 25min
completed: 2026-05-05
---

# Phase 01 Plan 03: Engine-Gateway Summary

**Engine end-to-end wired: process.cwd() path fix + code block extraction lets CLI render GM-grounded four-section markdown via replay without gateway credentials**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-05-05T00:00:00Z
- **Completed:** 2026-05-05T00:25:00Z
- **Tasks:** 1
- **Files modified:** 4 (2 source fixes, 1 example file, 1 fixture)

## Accomplishments
- Fixed critical path resolution bug: `import.meta.url` in compiled ESM resolves to `packages/prompts/` not repo root; replaced with `process.cwd()` + `join()`
- Fixed system prompt quality bug: full markdown documentation file (with headers, fences, notes) was being sent to Claude; now extracts only the raw template from the code block
- Created `.env.local.example` with all five required env vars (ECHOMIND_LLM_BASE_URL, ECHOMIND_LLM_API_KEY, ECHOMIND_MODEL, ECHOMIND_REPLAY, VITE_REPLAY_MODE)
- Seeded `fixtures/responses/gm-auctions-snapshot.json` with substantive GM-voice content (4 fit, 4 friction, 4 questions, 4 refinements) for replay smoke testing
- CLI produces correct markdown header and four populated sections via `--replay`

## Task Commits

Each task was committed atomically:

1. **Task 1: Smoke-test engine end-to-end, fix issues, add .env.local.example** - `76510c9` (feat)

**Plan metadata:** `[pending final commit]` (docs: complete plan)

## CLI Output Sample

Running with `--replay`:

```
# Validation: General Manager → ACV MAX Auctions PRD

## Fit
- The disposition score surfaces the exact inventory intelligence I already want but can't get quickly — days-on-lot, demand signals, and book-to-trade spread in one number.
- Running nightly and refreshing each morning fits my workflow: I review the lot first thing, so updated scores are there when I need them.

## Friction
- A fixed 7/10 threshold doesn't account for my margin targets or risk tolerance — a unit I'd retail at a premium might get flagged and a slow-mover I know won't clear the lane might not.
- The flow only covers auction consignment. Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind.

## Questions
- Can the threshold be set per-rooftop or per-unit-type? My gross targets for trucks versus sedans are different.
- Does the disposition score differentiate 'run it through the lane' from 'wholesale to a dealer in my 20 group'? Those are different economics.

## Refinements
- Make the threshold configurable per rooftop with a sensible default — let me set it in my account settings, not call support.
- Add a 'Wholesale to dealer' channel option alongside the auction lane so the disposition score covers both paths.
```

## Files Created/Modified
- `packages/engine/src/index.ts` - Fixed template path from import.meta.url to process.cwd() + join()
- `packages/engine/src/prompt.ts` - Added extractTemplateContent() to strip markdown fences before LLM submission
- `.env.local.example` - Template for required env vars (never committed with real values)
- `fixtures/responses/gm-auctions-snapshot.json` - GM-voice seed fixture for replay smoke tests

## Decisions Made
- `process.cwd()` for template path: tsup bundles ESM with `import.meta.url` pointing to `dist/`, so `../../prompts/` resolves to `packages/prompts/` which doesn't exist. `process.cwd()` anchors to repo root where the binary is always run from.
- Extract template from code block: `persona-system-prompt.md` wraps the prompt in a markdown code block for documentation purposes. Sending the full file (with headers, fences, notes) to Claude as a system prompt would corrupt the persona framing. The `extractTemplateContent()` function strips the wrapper.
- Seed fixture with substantive content: Plan 04 will capture real gateway output to replace this. The seed enables Plans 05 and 06 (web + skill surfaces) to develop against realistic output shape without blocking on live gateway access.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed import.meta.url path resolving to wrong directory**
- **Found during:** Task 1 (smoke test step)
- **Issue:** `new URL('../../prompts/persona-system-prompt.md', import.meta.url)` in `dist/chunk-*.js` resolves to `/packages/prompts/` not the repo root
- **Fix:** Replaced with `join(process.cwd(), 'prompts', 'persona-system-prompt.md')` plus added `import { join } from 'path'`
- **Files modified:** `packages/engine/src/index.ts`
- **Verification:** `buildSystemPrompt()` tested from dist — system prompt length 3,246 chars, contains "General Manager", no unresolved `{{tokens}}`
- **Committed in:** `76510c9` (Task 1 commit)

**2. [Rule 1 - Bug] Fixed system prompt including full markdown documentation wrapper**
- **Found during:** Task 1 (reviewing persona-system-prompt.md structure)
- **Issue:** The full markdown file (headers, code fences, implementation notes) was being passed as the system prompt, not just the template inside the code block
- **Fix:** Added `extractTemplateContent()` in `prompt.ts` that extracts content between the first markdown code fence pair
- **Files modified:** `packages/engine/src/prompt.ts`
- **Verification:** Extracted content starts with "You are responding as a virtual user…", contains all `{{tokens}}`, no markdown fences present
- **Committed in:** `76510c9` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 — bugs in Plan 01 scaffolding found during smoke test)
**Impact on plan:** Both fixes essential for correct LLM behavior. Path bug would cause runtime crash; template bug would send irrelevant documentation to Claude as system prompt.

## Issues Encountered

- No `.env.local` exists in the worktree (no real gateway credentials available). Live gateway validation deferred to Plan 04 when Chad runs the snapshot capture. CLI tested successfully with `--replay` flag.
- `fixtures/responses/gm-auctions-snapshot.json` seeded with GM-voice content for replay testing. Plan 04 replaces this with real gateway output captured by Chad.

## User Setup Required

To run against the real ACV gateway:
1. Copy `.env.local.example` to `.env.local`
2. Fill in `ECHOMIND_LLM_BASE_URL` and `ECHOMIND_LLM_API_KEY` with real values
3. Run: `source .env.local && node packages/engine/dist/bin/echomind-validate.js --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md`

## Known Stubs

- `fixtures/responses/gm-auctions-snapshot.json` — seeded with hand-authored GM-voice content, not a real gateway response. Plan 04 captures the real output. The stub is intentional and documented; it enables Plans 05/06 surface development without blocking on live gateway access.

## Next Phase Readiness

- Plan 04 (fixture snapshot): Chad runs live gateway call, captures real output, replaces the seed fixture. Engine is proven to produce correct markdown format.
- Plan 05 (web UI): Engine validate() + FixtureClient fully functional. Web can call validate() with replay for development.
- Plan 06 (skill surface): CLI binary works end-to-end with `--replay`. Skill can use it immediately.

---
*Phase: 01-demo-sliver*
*Completed: 2026-05-05*
