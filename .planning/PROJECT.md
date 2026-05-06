# EchoMind

## What This Is

EchoMind is a unified, governed persona library plus structured PRD validators for ACV product teams. A Product Owner points a persona at a PRD (or, post-v1, a prototype) and gets a structured take-away — fit, friction, questions, refinements — backed by traceable persona data, delivered through a polished web app and a Claude Code skill that share the same engine. Built initially as an ACV hackathon project (May 2026) and shaped from day one toward real PO/designer adoption inside ACV.

## Core Value

A Product Owner can validate a PRD against a trusted, governed ACV persona in under a few minutes and walk away with a structured artifact they can defend, without scheduling research.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. v1 = full peer-polished release; the 2-day demo is a sliver of v1. -->

**Demo sliver (must work in 2 days):**

- [ ] Web app loads the GM hero persona and a hardcoded ACV MAX Auctions integration PRD, runs the validator, and renders the four output sections (fit / friction / questions / refinements)
- [ ] Claude Code skill loads the same persona + same PRD via the same validator engine and renders the same four sections in the terminal
- [ ] Both surfaces shown side-by-side in the demo against the same persona/PRD pair, producing the "we caught X" pushback moment

**Full v1 (2–3 weeks total, includes the sliver above):**

- [ ] Persona library reads from `personas/*.yaml` as the source of truth (no fork from the `agent-personas` schema)
- [ ] Hero persona refined from the existing `personas/general-manager.yaml` with documented provenance
- [ ] Validator engine takes (persona YAML, PRD text) and returns the four structured sections
- [ ] Web app: PO pastes a Confluence/Notion link to a PRD, picks a persona, runs the validator, sees the structured output, can copy/export it
- [ ] Claude Code skill: peer-polished surface that calls the same engine from the terminal with the same output schema
- [ ] LLM calls route through ACV's gateway (no raw key handling, supports the no-leak guardrail)
- [ ] All persona output is provenance-traceable to specific persona fields (supports the anti-gaming + traceability guardrails)

### Out of Scope

<!-- Explicit boundaries. -->

- **Conversational chat surface** — Trust comes from provenance and structured output, not theatrics. Chat is a v2 question after we see real validator usage. (From kickoff session 001.)
- **Prototype-validation in v1** — PRD-validation is the simpler on-ramp. Prototype-validation is the bigger long-term wedge but is v2. (From kickoff session 001.)
- **Live persona authoring UI** — Authoring rides on the in-progress `agent-personas` persona-capture skill; EchoMind reads, doesn't write. (From kickoff session 001.)
- **npm package** — Possibly v2; not needed for hackathon adoption metric. (From kickoff session 001.)
- **User auth / accounts in v1** — Single-user mode is fine for hackathon and early adopters; auth (likely SSO) is v2.
- **Free-form PRD upload (PDF, Word, etc.)** — Confluence/Notion link covers where ACV PRDs actually live. Other formats are v2.

## Context

- **Origin:** ACV hackathon project (May 2026), built by Chad and Jake. Treated as a hackathon-as-wedge — the demo is v0, but every decision points toward real ACV adoption, not just demo theater.
- **Test PRD subject:** A new product idea for the ACV MAX mobile app — Auctions integration. Demo payoff is a "we caught X" moment where the persona surfaces a non-obvious pushback that would otherwise have shipped.
- **Adoption metric (gating bar, lagging-indicator deferred):** # of POs and designers running ≥ 1 EchoMind validation per sprint. Speed/quality are tracked but not gating; they require usage history to be meaningful.
- **Repo state:** Bare scaffold. `personas/_template.yaml`, `personas/general-manager.yaml`, `prompts/persona-system-prompt.md` already ported from `agent-personas`. No app code yet.
- **Sister project:** `agent-personas` (Chad's earlier repo) — shares the same persona YAML schema. EchoMind reads it, doesn't fork it. The contract is load-bearing infrastructure, not incidental.
- **Kickoff record:** Full reasoning behind direction lives in `agent-knowledge/session-001-whiteboarding.md`; planning summary in `planning/whiteboarding-2026-05-04.md`. Read these before relitigating any locked decision.
- **Reasoning log convention:** New session reasoning logs go in `agent-knowledge/session-NNN-<topic>.md`. Decision reversals get a new log, never a silent overwrite.

## Constraints

- **Timeline (sliver):** Hackathon demo in 2 days from 2026-05-04 (target ~2026-05-06). Web + skill + hardcoded PRD must work end-to-end.
- **Timeline (full v1):** ~2–3 weeks from 2026-05-04 to ship full v1 with Confluence input, peer-polished surfaces, gateway-routed LLM calls.
- **Tech stack (frontend):** Vue 3 + Vuetify — matches the ACVMax stack so the surface is familiar to ACV reviewers. Locked.
- **LLM routing:** Claude via ACV's existing LLM gateway/proxy. No raw API keys in this repo. Supports the no-leak guardrail.
- **Default model:** Claude Sonnet 4.6 for persona embodiment / validator runs. Reserve Opus 4.7 for harder evaluation passes if Sonnet output is too shallow. (Per `prompts/persona-system-prompt.md`.)
- **Persona schema contract:** Cannot fork from `agent-personas`. Both projects read the same YAML shape; bidirectional symmetry of the validator output schema is a desirable v2 property to discuss.
- **Privacy:** No confidential ACV data in LLM prompts/logs that leaves the gateway. Provenance must be inspectable per output finding.
- **Anti-gaming:** POs cannot tweak persona fields ad-hoc to confirm a foregone conclusion. Persona edits flow through the `agent-personas` capture skill, not the EchoMind UI.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| C+B hybrid (library-first + structured validators), chat out of v1 | Trust comes from provenance and a take-away artifact, not chat theatrics. Library-first solves both the validation-loop and persona-governance problems with one wedge. (Session 001) | — Pending |
| Primary user = ACV Product Owner (designers/researchers/engineers downstream) | PO is the single role that owns both PRD-time and prototype-time decisions; optimizing for them propagates value to others. (Session 001) | — Pending |
| Adoption (validations/sprint) is the gating metric; speed/quality are tracked but not gating | Adoption is the only metric movable in a 90-day window; speed/quality require usage history. (Session 001) | — Pending |
| Hero persona = refined `personas/general-manager.yaml` (target ACV MAX dealer GM) | Existing yaml is the closest-to-hand starting point, schema-compatible with `agent-personas`, and aligned with the demo PRD's audience. | — Pending |
| Stack = Vue 3 + Vuetify | Matches ACVMax — lower friction for ACV reviewers and post-demo adoption; Chad/Jake familiar enough to ship in hackathon time. | — Pending |
| Web + Claude Code skill polished as **peers** in v1 (reverses kickoff "polish web, stub skill") | User explicitly chose to expand scope — both surfaces are first-class. Mitigated by extending the v1 timeline to 2–3 weeks; the 2-day deadline is a sliver demo, not full v1. | ⚠️ Revisit — kickoff flagged dual-surface as a scope risk; revisit if either surface starts slipping the demo |
| 2-day demo = "sliver" only (web + skill + hardcoded Auctions PRD); full v1 ships over 2–3 weeks | Holds the chosen scope without forcing a v1 cut, but commits to a credible end-to-end demo on day 2 even if Confluence integration and persona-library polish land later. | — Pending |
| PRD input = Confluence/Notion link (v1); paste-markdown is *not* the v1 path | Where ACV PRDs actually live. Worth the integration cost to land in the PO's real workflow. Pre-v1 sliver bypasses this with a hardcoded PRD. | — Pending |
| Validator output schema = fit / friction / questions / refinements (kickoff defaults, no additions) | Hold the kickoff scope. "Verdict lozenge" and "per-finding provenance" considered and deferred to v2 once we see real outputs. | — Pending |
| LLM via ACV gateway, default model Claude Sonnet 4.6 | Supports no-leak guardrail (no raw keys), matches `prompts/persona-system-prompt.md` recommendation. | — Pending |
| No user auth in v1 | Single-user mode is enough for hackathon + early adopters; auth (likely SSO) is v2. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-04 after initialization*
