# Session 001 — Whiteboarding Kickoff

**Date:** 2026-05-04
**Type:** Product whiteboarding (6-phase framework)
**Participants:** Chad, Jake (collaborator), AI facilitator
**Duration:** ~45 min
**Output artifact:** `planning/whiteboarding-2026-05-04.md`

---

## Why this session happened

EchoMind existed as a bare-bones scaffold (persona YAML schema and a single prompt template ported from `agent-personas`) with a one-paragraph README describing it as a "virtual users app for testing ACV products." Chad and Jake had a directional idea but no shared problem statement, no agreed user, no success criteria, and no decision on what shape the product should take. The risk was building toward a hackathon demo that looked impressive but didn't connect to any real ACV pain — the classic "win the demo, lose the adoption" failure mode.

This session existed to lock the foundations *before* any code got written: what is actually broken, who feels the pain, what does success look like, and what shape should EchoMind take.

---

## Starting state

- **Repo:** Scaffold only — `personas/` (YAML schema), `prompts/persona-system-prompt.md`, README. Two commits.
- **Stack:** Undecided. README mentions "likely Vue 3 + Vuetify" to match ACVMax.
- **Relationship to `agent-personas`:** Shared YAML schema, different surface (async UX review vs. interactive validation). No formal contract enforcement yet.
- **Mental model going in:** "Virtual users that pressure-test product concepts" — solution-shaped, not problem-shaped.

---

## What we worked through

### Phase 1 — Problem Framing
The biggest unlock of the session. The original framing ("we don't have virtual users") was circular. Pushing for *what human behavior or business outcome is broken* surfaced two distinct problems sitting next to each other:
- **Validation loop problem:** Personas exist as documents but aren't consulted during prototyping. POs default to opinion-based decisions because real research is slow, unscoped, or unavailable.
- **Governance problem:** Personas are fragmented across product lines. No source of truth. Designers and POs don't know where to find them or whether they're current.

Chad and Jake explicitly chose to make EchoMind solve **both**, which raised the bar significantly — the YAML contract with `agent-personas` becomes load-bearing infrastructure, not incidental.

The problem statement went through two drafts. V1 was too long, mixed too many threads, and leaned on specifics ("two researchers on medical leave") that Chad correctly flagged as irrelevant — the problem isn't researcher headcount, it's the absence of a fast, trustworthy validation step regardless of how many researchers exist.

### Phase 2 — User & Context
Pushed back on the "everyone benefits" answer to force a primary user. Landed on **Product Owner** as #1, with designers/researchers/engineers as downstream beneficiaries.

Important reframe Chad introduced: PRD-time isn't about *writing the PRD with persona insight*, it's about *validating that the PRD is even aimed at the right user and job-to-be-done*. That changed the question shape EchoMind needs to answer at that touchpoint.

Locked: prototype-validation is the bigger wedge, but PRD-validation is the structurally simpler on-ramp.

### Phase 3 — Success Definition
Three clean answers (hackathon, user, business) plus guardrails. Pushback moment: Chad initially picked "all three user-layer metrics equally weighted" (speed, quality, adoption). I pushed back because hackathons need one yardstick to win, and only adoption is movable in a 90-day window — speed and quality are lagging indicators that require usage history. Chad accepted the recommendation. Adoption became the gating bar; speed and quality are tracked but not gating.

Demo subject locked: **ACV MAX mobile app — Auctions integration**.

All four guardrails locked without debate: provenance, anti-gaming, contract integrity, and data privacy.

### Phase 4 — Solution Exploration
Seeded three options to map the tradeoff space:
- **A — Persona Chat Studio** (conversational, theatrical, gameable)
- **B — Persona Verdict Engine** (structured output, defensible, less wow)
- **C — Persona Library + Lightweight Validators** (governance-first, slower to value)

Chad and Jake skipped past the "pick one" framing and named a hybrid: **C as the foundation, with B's structured-validator surface, delivered through web app + Claude Code skill (and possibly npm)**. This was the right call given the bigger-bet decision in Phase 1 to solve both governance and validation.

### Phase 5 — Decision & Tradeoffs
Formalized the C+B hybrid. Forced explicit naming of what's being given up:
- Demo wow-factor (vs. chat)
- Conversational learning loop (deferred to v2)
- Build complexity from multiple surfaces
- Prototype-validation in v1 (PRD-validation ships first)
- Live persona authoring (rides on the in-progress persona-capture skill)

Sign-off: just Chad + Jake for hackathon. Demo hero: both web and skill, demo flips between them. I flagged this as a scope risk for Phase 6 since polishing both is unrealistic in hackathon time.

### Phase 6 — Path Forward
Five action items, owned and time-bound. First checkpoint: end of this week. Validator built 2 weeks before demo, Claude Code skill stub 1 week before. Open questions surfaced (tech stack, schema symmetry with `agent-personas`, identifying the post-demo target audience).

---

## Problems we faced and how we resolved them

| Problem | How it surfaced | Resolution |
|---|---|---|
| Solution-shaped framing in the README | "Virtual users that pressure-test concepts" doesn't say what's broken without it | Phase 1 questions forced the underlying pain into the open: opinion-driven decisions, fragmented personas, no validation loop |
| Two distinct problems blurred together | Validation loop and persona governance are different shapes | Named both explicitly and asked Chad/Jake to consciously decide whether EchoMind solves one or both — they chose both |
| Problem statement too long and meandering on first draft | Mixed researcher-leave specifics, "inert artifacts" framing, and competitive risk all in one block | Cut to two sentences, dropped the researcher-leave detail (irrelevant), led with Jake's "no source of truth" frame |
| Over-distributed primary user | Initial answers named multiple roles as benefiting | Forced single primary user (PO) with downstream beneficiaries ranked |
| Vague trigger moment | "PRD" as a single touchpoint conflated divergent and convergent use | Split into PRD-validation (right user/JTBD?) and prototype-validation (right direction?) — same persona, two question shapes |
| All-three-equally success metric | Tempting but creates fuzzy success bar | Pushed back; landed on adoption as gating, others as long-term evidence |
| Hybrid decision risked diluting Phase 4 | Chad/Jake jumped to C+B before the option space was fully sat with | Accepted because the hybrid was well-reasoned and grounded in the bigger-bet decision from Phase 1, not a dodge |
| Multi-surface scope risk for hackathon | Choosing both web and Claude skill as "demo hero" doubles build surface | Surfaced as Phase 6 risk: polish web, stub the skill convincingly, don't try to ship two finished surfaces |

---

## What we're moving forward with

**Direction:** EchoMind = unified, governed persona library (C) with structured validators (B's surface) exposed via web app + Claude Code skill. Personas are the substrate; structured validation is the value POs feel; chat is explicitly out of scope for v1.

**Hackathon wedge:** Walk a judge through a new product idea for the ACV MAX mobile app — Auctions integration, validate it live against an EchoMind persona of a target dealer, surface a non-obvious pushback that would have shipped uncaught.

**Adoption metric (gating):** POs and designers running ≥ 1 EchoMind validation per sprint.

**v1 scope:**
- One hero persona with documented provenance
- One validator question shape (PRD-validation), structured output: fit / friction / questions / refinements
- Web app polished, Claude Code skill stubbed but functional
- Demo PRD: ACV MAX mobile Auctions integration concept

**Out of v1:**
- Conversational chat surface
- Prototype-validation (deferred to v2)
- Live persona authoring (rides on persona-capture skill)
- npm package (deferred, possibly v2)

---

## Open threads for future sessions

- Hero persona identity and source data — must be locked before any building
- Tech stack confirmation: README guesses Vue 3 + Vuetify; not yet decided
- Validator output schema: should it be symmetric with what `agent-personas` can emit, keeping the shared YAML contract bidirectional?
- Identify the single ACV person whose post-demo reaction we're optimizing for — needed to shape the pitch
- v2 questions to revisit later: when does prototype-validation enter? when does conversational mode become worth building? what does persona governance look like at scale (who curates, who approves, how do updates propagate)?

---

## Why this log exists

This is the reasoning record behind the artifact in `planning/whiteboarding-2026-05-04.md`. The planning doc says *what* we decided. This log says *why* — what alternatives we considered, what we consciously gave up, what tensions we worked through, and what's still open. Future sessions and future contributors should read this before relitigating any of the above. If a decision in here turns out to be wrong, update the log with the new reasoning rather than silently overwriting it.
