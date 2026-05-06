---
phase: 02-engine-hardening
plan: "03"
subsystem: api
tags: [typescript, anthropic-sdk, error-handling, gateway]

# Dependency graph
requires:
  - phase: 02-01
    provides: Finding/ValidationResult types that GatewayError consumers will handle

provides:
  - GatewayErrorKind type exported from packages/engine/src/llm.ts
  - GatewayError class exported from packages/engine/src/llm.ts
  - Classified error throws in GatewayClient.complete() covering auth/rate_limit/timeout/unknown
  - VALD-05 no-log invariant documented in llm.ts

affects:
  - 02-05 (web composable useValidator.ts imports GatewayError for instanceof check)
  - 02-07 (integration gate verifies zero console.log and structured error shape)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GatewayError extends Error with a kind discriminant — callers use instanceof + kind for typed error handling"
    - "VALD-05 invariant enforced by comment prohibition — no logger hook, no debug flag"

key-files:
  created: []
  modified:
    - packages/engine/src/llm.ts

key-decisions:
  - "GatewayError re-throw guard: catch block checks instanceof GatewayError first and re-throws to avoid double-wrapping"
  - "VALD-05 compliance via comment-only invariant — codebase already had zero logging; comment documents the contract for future contributors"

patterns-established:
  - "Error classification pattern: status codes map to semantic kinds before throwing, so callers never parse HTTP status codes"

requirements-completed:
  - LLM-03
  - VALD-05

# Metrics
duration: 8min
completed: 2026-05-06
---

# Phase 02 Plan 03: Gateway Error Classification Summary

**GatewayError class with kind discriminant (auth/rate_limit/timeout/unknown) exported from llm.ts; GatewayClient.complete() wraps all throws with HTTP-status-based classification; VALD-05 no-log invariant documented in both client classes.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-06T16:28:41Z
- **Completed:** 2026-05-06T16:36:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added `GatewayErrorKind` type (`'timeout' | 'auth' | 'rate_limit' | 'unknown'`) exported from llm.ts
- Added `GatewayError extends Error` with `kind` field and `name = 'GatewayError'` exported from llm.ts
- Wrapped `GatewayClient.complete()` in try/catch with HTTP status classification (401/403 → auth, 429 → rate_limit, ETIMEDOUT/ECONNRESET/timeout → timeout, else → unknown)
- Added re-throw guard for already-classified `GatewayError` instances to prevent double-wrapping
- Documented VALD-05 no-log invariant in module-level comment and FixtureClient class comment
- Confirmed zero `console.log(` calls in llm.ts (invariant comment references the pattern by name only)

## Task Commits

1. **Task 1: Add GatewayError + error classification to llm.ts** - `71a5123` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `packages/engine/src/llm.ts` — Added GatewayErrorKind type, GatewayError class, try/catch classification in GatewayClient.complete(), VALD-05 invariant comments in both client classes

## Decisions Made

- **GatewayError re-throw guard first in catch block** — ensures already-classified errors are never double-wrapped when GatewayError is thrown from inner code (e.g., tool-not-called case) and caught by the outer catch
- **VALD-05 comment-only approach** — research confirmed zero logging already existed; a comment documents the contract for future contributors rather than adding a lint rule (lint enforcement is 02-07 scope)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Pre-existing TypeScript error TS2537 on `tools` cast (`Parameters<typeof this.client.messages.create>[0]['tools'][number]`) was present before this plan and remains unchanged. This is a known type-cast workaround for the Anthropic SDK's `ToolUnion[]` index type — not introduced by this plan.

## Known Stubs

None — this plan has no stub values that flow to UI rendering. GatewayError is a pure type/class definition with no hardcoded data.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `GatewayError` and `GatewayErrorKind` are now exported and ready for 02-05 (web composable) to import via `instanceof GatewayError` check
- `useValidator.ts` in 02-05 can expose `errorKind: GatewayErrorKind | null` using these exports
- VALD-05 requirement satisfied: no console.log calls, invariant documented

---
*Phase: 02-engine-hardening*
*Completed: 2026-05-06*
