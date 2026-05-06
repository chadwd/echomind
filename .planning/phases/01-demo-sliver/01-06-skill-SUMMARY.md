---
phase: 01-demo-sliver
plan: "06"
subsystem: skill
tags: [skill, claude-code, cli, validation, replay, demo]

# Dependency graph
requires:
  - phase: 01-04-fixture-snapshot
    provides: verified --replay path and seeded fixture for demo-day safety

provides:
  - ".claude/skills/echomind-validate/SKILL.md — Claude Code skill entry point (SKIL-01)"
  - "Documented --persona and --prd flags for skill invocation (SKIL-02)"
  - "Same engine as web app — identical ValidationResult schema (SKIL-03)"
  - "Four sections render in terminal as UI-SPEC-compliant markdown (SKIL-04)"
  - "ECHOMIND_REPLAY=true demo-day fixture replay documented and verified (DEMO-02)"

affects:
  - 01-07-demo-runbook

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Claude Code skill via .claude/skills/{name}/SKILL.md with YAML frontmatter (name, description)"
    - "CLI invocation: node packages/engine/dist/bin/echomind-validate.js --persona --prd --replay"
    - "Demo-day replay: ECHOMIND_REPLAY=true env var bypasses gateway entirely"

key-files:
  created:
    - .claude/skills/echomind-validate/SKILL.md
    - apps/skill/README.md
  modified:
    - .gitignore

key-decisions:
  - "Use node CLI invocation in SKILL.md (pnpm --filter exec unavailable for own-package bins in pnpm workspaces)"
  - "Update .gitignore from .claude/ (full ignore) to .claude/* with !.claude/skills exception so SKILL.md is tracked"

patterns-established:
  - "Skill = thin markdown descriptor over CLI binary; no compiled skill-specific code in Phase 1"
  - ".claude/skills/ tracked in git via negated glob exception in .gitignore"

requirements-completed:
  - SKIL-01
  - SKIL-02
  - SKIL-03
  - SKIL-04
  - DEMO-02

# Metrics
duration: 15min
completed: 2026-05-05
---

# Phase 01 Plan 06: Skill Summary

**Claude Code skill entry point created: .claude/skills/echomind-validate/SKILL.md documents the node CLI invocation with --persona, --prd, and --replay flags; CLI produces five-header UI-SPEC-compliant markdown verified against seeded fixture**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-05T16:10:00Z
- **Completed:** 2026-05-05T16:26:54Z
- **Tasks:** 1
- **Files created:** 2 (SKILL.md, apps/skill/README.md)
- **Files modified:** 1 (.gitignore)

## Accomplishments

- Created `.claude/skills/echomind-validate/SKILL.md` with correct YAML frontmatter (`name: echomind-validate`, `description:` with context for when to invoke the skill)
- Documented `--persona`, `--prd`, and `--replay` CLI flags with working bash command examples
- Included demo-day fixture replay section (`ECHOMIND_REPLAY=true` and `--replay` flag forms)
- Created `apps/skill/README.md` as developer notes (explains skill = thin wrapper over CLI binary)
- Fixed `.gitignore` to track `.claude/skills/` while continuing to ignore worktrees, settings, etc.
- Verified CLI replay output: 1 H1 + 4 H2 headers, `→` arrow character (U+2192), `-` dash bullets only

## CLI Output Sample

```
# Validation: General Manager → ACV MAX Auctions PRD

## Fit

- The disposition score surfaces the exact inventory intelligence I already want but can't get quickly — days-on-lot, demand signals, and book-to-trade spread in one number.

## Friction

- The flow only covers auction consignment. Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind.

## Questions

- Can the threshold be set per-rooftop or per-unit-type? My gross targets for trucks versus sedans are different.

## Refinements

- Make the threshold configurable per rooftop with a sensible default — let me set it in my account settings, not call support.
```

## Verification Results

| Check | Result |
|-------|--------|
| SKILL.md exists | PASS |
| name: echomind-validate in frontmatter | PASS |
| description: with skill purpose | PASS |
| --persona and --prd documented | PASS |
| ECHOMIND_REPLAY=true section present | PASS |
| CLI H1+H2 header count = 5 | PASS |
| Arrow character → (U+2192) in H1 | PASS |
| No asterisk bullets | PASS |
| apps/skill/README.md exists | PASS |
| pnpm exec form | N/A (see deviations) |

## Task Commits

1. **Task 1: Create echomind-validate Claude Code skill entry point** - `0ee50ac` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `.claude/skills/echomind-validate/SKILL.md` — Claude Code skill descriptor with frontmatter, usage, replay, and output format sections
- `apps/skill/README.md` — Developer notes on skill structure; explains Phase 1 = thin CLI wrapper, no compiled code
- `.gitignore` — Changed `.claude/` (full ignore) to `.claude/*` with `!.claude/skills` exception

## Decisions Made

- **node CLI invocation in SKILL.md:** The plan recommended `pnpm --filter @echomind/engine exec echomind-validate` but pnpm does not symlink a package's own bin entries to its own `node_modules/.bin/`. The working invocation is `node packages/engine/dist/bin/echomind-validate.js`. The `important_context` section in the plan already specified this form; updated SKILL.md accordingly.
- **.gitignore exception for .claude/skills/:** The `.claude/` directory was fully gitignored. Changed to `.claude/*` (glob) with `!.claude/skills` negation so the skill file is tracked in git while worktrees and settings.local.json remain ignored.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] pnpm --filter exec invocation fails for own-package binaries**
- **Found during:** Task 1 verification
- **Issue:** `pnpm --filter @echomind/engine exec echomind-validate` returns "Command not found" because pnpm workspace packages do not symlink their own bin entries to their own `node_modules/.bin/`
- **Fix:** Updated SKILL.md to use `node packages/engine/dist/bin/echomind-validate.js` — the directly-working form already documented in plan's `important_context` section
- **Files modified:** `.claude/skills/echomind-validate/SKILL.md`
- **Commit:** `0ee50ac`

**2. [Rule 3 - Blocking] SKILL.md blocked by .gitignore**
- **Found during:** Task 1 pre-commit check
- **Issue:** `.claude/` was fully gitignored; `.claude/skills/echomind-validate/SKILL.md` could not be staged
- **Fix:** Changed `.gitignore` from `.claude/` (directory ignore) to `.claude/*` (glob) with `!.claude/skills` negation — preserves ignore on worktrees/settings while allowing skills to be tracked
- **Files modified:** `.gitignore`
- **Commit:** `0ee50ac`

## Known Stubs

None. The skill is a descriptor document; its content accurately reflects the working CLI invocation verified against the seeded fixture.

## Next Phase Readiness

- Plan 07 (demo runbook) can reference `/echomind:validate` skill invocation and `--replay` flag in the runbook
- The skill is Claude Code-ready: `.claude/skills/echomind-validate/SKILL.md` will be loaded at session start
- Demo narration: skill surface produces the same dealer-to-dealer wholesale gap friction bullet as the web surface — both surfaces tell the same "we caught X" story

---
*Phase: 01-demo-sliver*
*Completed: 2026-05-05*
