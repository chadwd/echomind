# Roadmap: EchoMind

## Overview

EchoMind ships in three coarse phases. Phase 1 is a 2-day sprint delivering an end-to-end demo: both the Vue 3 web app and the Claude Code skill run the validator against a hardcoded ACV MAX Auctions PRD and the GM hero persona, producing the four structured output sections. Phase 2 hardens the shared engine — adding provenance tracing, the anti-gaming read-only guardrail, and gateway error handling. Phase 3 completes the full v1 web surface (Confluence/Notion link input, persona picker, copy/export, error states) and polishes the skill to peer parity.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Demo Sliver** - End-to-end demo on both surfaces against the hardcoded ACV MAX Auctions PRD + GM persona
- [ ] **Phase 1.1: UI Polish** (INSERTED) - Material 3 brand theme, logo header, component styling for recording
- [ ] **Phase 2: Engine Hardening** - Provenance tracing, anti-gaming guardrail, gateway error handling
- [ ] **Phase 3: Full v1 Surfaces** - Confluence/Notion link input, persona picker, copy/export, error states, skill file output

## Phase Details

### Phase 1: Demo Sliver
**Goal**: Both the web app and the Claude Code skill run the validator end-to-end against the GM hero persona and the hardcoded ACV MAX Auctions PRD, producing the four structured output sections — demo-ready on day 2
**Depends on**: Nothing (first phase)
**Requirements**: PERS-01, PERS-02, PERS-03, VALD-01, VALD-02, LLM-01, LLM-02, WEB-01, WEB-04, WEB-05, SKIL-01, SKIL-02, SKIL-03, SKIL-04, DEMO-01, DEMO-02, DEMO-03, DEMO-04
**Success Criteria** (what must be TRUE):
  1. The web app renders all four sections (fit, friction, questions, refinements) against the hardcoded demo PRD and GM persona without manual intervention
  2. The Claude Code skill (`/echomind:validate` or equivalent) renders the same four sections in the terminal using the same engine
  3. At least one finding in the output constitutes a non-obvious GM pushback on the Auctions PRD — the "we caught X" moment — vetted before demo day
  4. Chad and Jake can run the full demo on both surfaces end-to-end from a documented script without improvising
  5. All LLM calls route through ACV's gateway — no raw Anthropic API key is present in the repo
**Plans**: 7 plans across 5 waves

Plans:
- [x] 01-01-monorepo-scaffold-PLAN.md — pnpm monorepo root + engine package (types, loader, prompt, LLM adapter, CLI) + Vue 3/Vuetify web shell
- [x] 01-02-demo-fixtures-PLAN.md — ACV MAX Auctions PRD fixture (with designed flaws) + PRD content checkpoint
- [x] 01-03-engine-gateway-PLAN.md — Live gateway smoke-test, .env.local.example, engine proven end-to-end
- [x] 01-04-fixture-snapshot-PLAN.md — Capture best live response as JSON fixture, verify --replay, "we caught X" checkpoint
- [x] 01-05-web-app-PLAN.md — InputPane, ResultsPane, SectionCard components + useValidator composable wired to engine
- [x] 01-06-skill-PLAN.md — .claude/skills/echomind-validate/SKILL.md + CLI output verified
- [x] 01-07-demo-runbook-PLAN.md — DEMO.md + dress rehearsal checkpoint

### Phase 1.1: UI Polish (INSERTED)
**Goal**: Apply the Material 3 brand theme, refine the logo header treatment, and polish component styling so the app looks intentional and on-brand for the demo recording
**Depends on**: Phase 1
**Requirements**: (no new REQ-IDs — polish and presentation layer only)
**Success Criteria** (what must be TRUE):
  1. The app uses the EchoMind brand purple (`#7A4F81`) as primary color — not the placeholder blue (`#1565C0`)
  2. The app bar logo renders cleanly on camera — icon readable, no white square artifact, no tagline text visible
  3. Section cards, surfaces, and outlines use the M3 neutral palette (warm tints, not flat greys)
  4. The overall visual reads as intentional/designed, not generic Vuetify default
**Plans**: 4 plans across 3 waves

Plans:
- [x] 01.1-01-PLAN.md — M3 light scheme applied to Vuetify theme in main.ts (primary, surface, secondary, error, all neutral roles)
- [x] 01.1-02-PLAN.md — App bar logo header polish in App.vue (icon-only crop, no white square, drop-in replaceable PNG)
- [x] 01.1-03-PLAN.md — Component polish: InputPane sidebar card, SectionCard finding spacing, empty state secondary icon
- [ ] 01.1-04-PLAN.md — Human visual checkpoint: dev server + Chad sign-off before demo recording

### Phase 2: Engine Hardening
**Goal**: The shared validator engine becomes provenance-traceable, the anti-gaming guardrail is enforced in the UI, and gateway errors surface as structured error states instead of crashes
**Depends on**: Phase 1
**Requirements**: VALD-03, VALD-04, VALD-05, PERS-04, LLM-03
**Success Criteria** (what must be TRUE):
  1. Every finding in the validator output references the specific persona field(s) that drove it — visible to the user
  2. The web app shows a read-only persona list with no edit affordance (no path to ad-hoc persona tweaking)
  3. A gateway timeout, auth failure, or rate-limit error produces a clear structured error state on both surfaces rather than a crash or blank screen
  4. The validator output schema is identical between the web surface and the skill — verified by shared type/contract
**Plans**: 7 plans across 4 waves

Plans:
- [x] 02-01-PLAN.md — Engine types + tool schema: Finding interface, ValidationResult Breaking change, parseToolResult update
- [x] 02-02-PLAN.md — Prompt provenance instruction: buildUserMessage appends field-tracing instruction for LLM
- [x] 02-03-PLAN.md — Gateway error handling + VALD-05 audit: GatewayError class, classification, no-log invariant
- [x] 02-04-PLAN.md — Fixture migration: gm-auctions-snapshot.json wrapped to Finding[] format
- [x] 02-05-PLAN.md — Web app: provenance chips (SectionCard), error state (ResultsPane), structured error (useValidator), App.vue wiring, PERS-04 confirm
- [x] 02-06-PLAN.md — CLI annotation: echomind-validate.ts italic inline sources annotation per D-08
- [ ] 02-07-PLAN.md — Integration gate: TypeScript build verify, CLI smoke-test, VALD-05/PERS-04 audit, human checkpoint

### Phase 3: Full v1 Surfaces
**Goal**: The web app accepts a real Confluence or Notion link as PRD input and exposes the full PO workflow (persona picker, running state, four sections, copy/export, error recovery); the skill writes its output to a file
**Depends on**: Phase 2
**Requirements**: WEB-02, WEB-03, WEB-06, WEB-07, SKIL-05
**Success Criteria** (what must be TRUE):
  1. A PO can paste a Confluence or Notion URL, pick any persona from the library, run the validator, and see the four output sections — no hardcoded content required
  2. The web app shows a "running" state with persona name and PRD title visible while validation is in progress
  3. The PO can copy the structured output as markdown with one click and paste it into a PRD or doc
  4. A validator or fetch error shows a clear, non-blaming error state with a retry affordance — no dead end
  5. The skill writes the structured output to a markdown file the user can attach to a PRD
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 1.1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Demo Sliver | 7/7 | Complete | 2026-05-05 |
| 1.1. UI Polish | 1/4 | In Progress|  |
| 2. Engine Hardening | 6/7 | In Progress|  |
| 3. Full v1 Surfaces | 0/? | Not started | - |
