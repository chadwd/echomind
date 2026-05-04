# EchoMind Whiteboarding Session — Summary

*Session date: 2026-05-04 · Type: Product Kickoff · Participants: Chad + Jake · Horizon: Hackathon as wedge toward real ACV adoption*

---

## Problem Statement

ACV doesn't have a single trusted source of truth for the personas we design and build for, so designers, product owners, and researchers can't actually consult them when making strategic or design decisions. Without a way to virtually test ideas against those personas, teams either ship on opinion or wait on real user research that is often unscoped, slow, or unavailable.

## User Profile

- **Who:** An ACV Product Owner working under timeline pressure who currently defaults to a mental persona model because real personas feel scattered, untrusted, or hard to find.
- **What they're doing in the moment:** Two trigger points — (1) validating a PRD is aimed at the right user and job-to-be-done, and (2, the bigger wedge) validating a working prototype against that persona to pressure-test design direction without scheduling a meeting or research request.
- **Downstream beneficiaries:** Designers (sharper lens), other POs (alignment), researchers (better questions), engineers (clearer build context), executives (defensible direction).

## Success Criteria

- **Hackathon:** Walk a judge through a new product idea for the *ACV MAX mobile app — Auctions integration*, validate it live against an EchoMind persona of a target dealer, and surface at least one non-obvious pushback or refinement that would otherwise have shipped uncaught.
- **User adoption (gating bar):** Number of POs and designers running ≥ 1 EchoMind validation per sprint. Speed and quality tracked but not gating.
- **Business thesis:** EchoMind reduces the risk of shipping features dealers don't want, protecting MAX adoption, marketplace transaction confidence, and Capital attachment rates.
- **Guardrails:** Persona output must be traceable to source data; POs cannot game the persona; YAML contract with `agent-personas` cannot fork; no confidential ACV data leaks into LLM prompts or logs.

## Options Considered

- **Option A — Persona Chat Studio.** Bet: conversation is highest-fidelity. Risk: theatrical, gameable, no take-away artifact.
- **Option B — Persona Verdict Engine.** Bet: structured output is defensible and shareable. Risk: less demo wow, may feel like another AI doc.
- **Option C — Persona Library + Lightweight Validators.** Bet: governance and source-of-truth are the wedge. Risk: boring demo, slower to value.

## Decision

**C+B Hybrid: Library-first foundation with structured validators as the surface, exposed through web app + Claude Code skill (and possibly npm).** Personas are the substrate; validators are the value POs feel; chat is explicitly out of scope for v1.

**Consciously trading off:** demo wow-factor (vs. chat), the conversational learning loop (deferred to v2), build complexity across multiple surfaces (mitigated by picking one to polish), prototype-validation in v1 (PRD-validation ships first as the on-ramp), and live persona authoring (rides on the in-progress persona-capture skill).

## Action Items

| # | Task | Owner | Target |
|---|---|---|---|
| 1 | Pick hero persona (target ACV MAX dealer) and document its provenance | Chad | This week |
| 2 | Draft the "ACV MAX mobile — Auctions integration" PRD that the demo validates against | Jake | This week |
| 3 | Build v1 validator — input (PRD + persona YAML), output (fit/friction/questions/refinements), web first | Chad + Jake | 2 weeks before demo |
| 4 | Stub the Claude Code skill wrapping the same validator — minimal CLI, same output schema | Chad | 1 week before demo |
| 5 | Identify the one ACV person whose post-demo reaction we're optimizing for; shape pitch around them | Chad + Jake | This week |

**Next checkpoint:** End of this week — hero persona locked, PRD draft in flight. If either slips, scope cuts before more building.

**Open questions to resolve before next session:** hero persona identity + source data; tech stack confirmation (Vue 3 + Vuetify per README, or pivot); whether the validator output schema should be symmetric with what `agent-personas` can emit, keeping the shared contract bidirectional.
