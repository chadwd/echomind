# Session 002 — Evidence Grounding & Fixture Hardening

**Date:** 2026-05-05
**Type:** PRD authoring + evidence sourcing (post-whiteboard validation)
**Participants:** Chad, AI facilitator
**Duration:** ~2 hours
**Output artifacts:** `demo-prd/acvmax-bid-mode-prd.md`, `demo-prd/WHITEBOARD.md`, `demo-prd/PRD-AUTHORING-GUIDE.md`

---

## Why this session happened

Session 001 locked the *what* (EchoMind validates PRDs) and the *demo subject* (ACV MAX Auctions). But a validator is only credible if the PRD it validates is credible — and that requires an auditable evidence trail. A one-paragraph problem statement is not enough; judges need to see why we believe this problem is real, where the persona comes from, and why scope cuts make sense.

This session existed to ground the whiteboarded bet in competitive analysis and dealer feedback, transforming it from "idea that sounds right" into "fixture that can prove the validator works."

---

## Starting state

- **Whiteboard:** Problem framed, solution hypothesis sketched, north-star metric named. No persona yet, no evidence sourcing, no scope discipline doc.
- **Persona:** Generic "veteran appraiser" in the whiteboard; not yet instantiated with specifics, backstory, or sourced characteristics.
- **PRD structure:** Undefined. Did we mirror existing ACV docs? Did we invent from scratch?
- **Evidence:** Problem framing was drawn from ACV's own App Store reviews, Q4 2024 shadowing, and Recommendations launch notes — but not yet *cited* in the fixture.
- **Scope:** Whiteboard listed non-goals but without reasoning. Would need explicit "here's why we cut X" for each.

---

## What we worked through

### 1. Persona Instantiation: Whiteboard → Mike

The whiteboard named "veteran appraiser" as the JTBD holder. Too generic. We instantiated a specific persona:

**Mike (General Manager, 15+ yrs automotive, 7+ yrs as GM, suburban Midwest dealership, 10–50 units/auction, carries iPhone)**

Why this specificity mattered:
- Title signals that Mike carries both GM incentives (dealership health, margin) and buyer floor incentives (winning bids, speed)
- 15+ yrs automotive / 7+ as GM = "veteran" but with enough tenure that tech adoption is optional, not reflexive
- 10–50 units/auction = big enough that his bid decisions impact monthly COGS; small enough that he's not bidding by algorithm
- iPhone carrier = simplifies device scope (iOS v1 is sufficient signal)
- Suburban Midwest = represents the buying group size and rooftop count ACV would target for beta

**Sourced from:** ACV's internal dealer GM persona research, Q4 2024 UX shadowing notes (two rooftops), Mar 2026 App Store review synthesis. Each characteristic traces back to observed behavior, not assumption.

---

### 2. Evidence Sourcing: From Hunches to Audit Trail

Every claim in the PRD now traces to source:

| Claim | Source | Link |
|---|---|---|
| "4-tab hop costs 45–90 seconds" | ACV Q4 2024 UX shadowing (two rooftops) | `acvmax-bid-mode-prd.md:§2.3` |
| "Recommendations is live (Mar 2026)" | ACV Recommendations launch notes (product team) | `acvmax-bid-mode-prd.md:§3` |
| "Lane-side is the loudest complaint post-Recommendations" | App Store review synthesis (Mar 2026) | `acvmax-bid-mode-prd.md:§3` |
| "Veterans carry iPhones into the lane" | ACV mobile analytics | `acvmax-bid-mode-prd.md:§6.1` (assumption: High confidence) |
| "Manheim/ADESA simulcast feeds cover majority of lanes" | Partner entitlement audit needed | `acvmax-bid-mode-prd.md:§6.2` (assumption: Med confidence) |
| "Cox can out-integrate but not out-execute on UX" | Competitive intelligence (internal) | `acvmax-bid-mode-prd.md:§2.2` |

**Critical move:** Confidence levels assigned to each assumption. "We think X is true" gets a label: High (observed behavior), Med (need validation), Low (demo-only). This is what allows EchoMind's validator to distinguish between "we're confident in this" and "this is a bet."

---

### 3. Scope Discipline: Named Every Non-Goal

The whiteboard hinted at scope, but the PRD made it explicit:

| What we cut | Why | Timing |
|---|---|---|
| Android support v1 | Veteran segment is iOS-dominant; Android adds 6–8 weeks with no learning; v2 after adoption validates | Deferred to v2 |
| Auto-geo-trigger | False-positives in multi-lane facilities create trust debt faster than a manual tap costs; revisit v1.1 with opt-in | v1.1 |
| Apple Watch glance | Valuable; depends on lane adoption first | v1.1 |
| Offline-first full sync | v1 caches run-list + comps; real-time Recs + simulcast require connectivity | v1.1 |
| DMS write-back | Write-back to ACV Appraisal (✓); integration to Reynolds/CDK/Dealertrack (✗) | v2 |
| Bid placement automation | Sets a ceiling; does not place bids or automate auction actions | Out of scope permanently (trust guardrail) |
| Conversational interface ("ask ACV") | 60-second windows don't support back-and-forth; one number, one tap | Out of scope permanently (speed guardrail) |

**Why this matters:** Each non-goal is a *decision*, not a mistake. When EchoMind's validator reads the PRD, it can see that scope was consciously bounded, not accidentally narrow. This is different from "we couldn't build Android" (excuse) vs. "we chose iOS first because veterans are iOS-dominant and Android adds 8 weeks" (decision).

---

### 4. Metrics Reframing: North-Star + Guardrails

The whiteboard initially positioned adoption, speed, and quality as three equal success signals. The PRD resolved the tension:

**North-star (gating):** % of veteran buyers (GM/buyer, 10+ yrs) using Bid Mode on ≥80% of vehicles at 90 days post-GA. Target: 50%.

*Why this is gating:* Adoption is the only metric that can move in a 90-day window. Speed and quality are lagging indicators that require 6+ months of usage history.

**Input metrics (tracked but not gating):**
- Time to recommendation (<5s P50)
- VIN scan success (>95% first-attempt)
- Trust pulse (>70% top-2-box)
- NPS delta (+20 points)

*Why separate:* These are *how* adoption happens. Monitor them to diagnose if adoption is low. But don't gate the launch on them — they're second-order.

**Guardrails (must not regress):**
- Recommendation accuracy (Bid Mode MAPE ≤ desk-mode MAPE)
- Crash-free rate (≥99.5%, parity with ACV MAX)
- Desk-mode DAU/WAU (must not decline >5%)
- Arbitration claim rate (Bid Mode ≤ desk-mode + 2pp)

*Why guardrails exist:* These are "fail if this happens." Arbitration claim rate is the *real* signal that Bid Mode is encouraging worse buying decisions. If adoption goes up but claim rates spike, the feature broke trust and we need to kill it.

**Shift from whiteboard:** The whiteboard said "optimize for adoption." The PRD says "optimize for adoption, but watch these four fail-states that would make adoption meaningless."

---

### 5. Deliberate Friction: Intentional Gaps for Validator Testing

This is the most important move. We did not try to write a "perfect" PRD. We identified friction points that EchoMind's validator *should catch*, and left them in:

**Friction Point #1: Persona-problem fit**
- Mike is a "GM who doubles as a buyer." 
- JTBD: "I want a synthesized max bid."
- But is this *Mike's* JTBD, or the *floor appraiser's* JTBD? Does a GM care about fast auctions, or does he care about buying margin at the dealership level?
- **Validator should surface:** Is Bid Mode solving for the right role incentives?

**Friction Point #2: Confidence band opacity**
- Recommendations returns a ceiling with a "confidence band (±$400)."
- The PRD never defines where ±$400 comes from. Is this the model's output margin? ACV's risk tolerance? A fixed buffer?
- **Validator should surface:** Can we defend this number if a buyer challenges it?

**Friction Point #3: Simulcast entitlement ambiguity**
- Assumption: "ACV has active simulcast read entitlement from ADESA and Manheim covering the majority of lanes veteran buyers attend." Marked *Med confidence*.
- But simulcast is *hero content* in Bid Mode. If entitlement is uncertain, the core value drops to "cached data with stale label."
- **Validator should surface:** Is this a blocker assumption masquerading as a med-confidence nice-to-have?

**Friction Point #4: Veteran-only adoption metric with no ID mechanism**
- North-star targets "veteran buyers (GM/buyer role, 10+ yrs automotive)."
- PRD never defines how to *identify* a veteran buyer in the product. Is it a self-report field? Account tenure in the system? Role tag?
- **Validator should surface:** This metric is unmeasurable as stated. What's the actual instrumentation plan?

**Friction Point #5: Write-back schema change not scoped**
- Appraisal record gets "Source: MAX Mobile — Bid Mode, user-adjusted" tag.
- PRD says "existing Appraisal API, no schema changes."
- But if the Appraisal schema doesn't support a "user-adjusted" flag, this write-back fails silently.
- **Validator should surface:** What's the actual API contract? Is this a blocker?

**Why we left these in:** A "complete" PRD would have answered all five. Instead, we left them as intentional gaps to test whether EchoMind's validator *actually identifies* the friction that would block execution. If the validator reads this PRD and doesn't flag these five, it's not sophisticated enough to be useful.

---

## Problems we faced and how we resolved them

| Problem | How it surfaced | Resolution |
|---|---|---|
| Persona too generic | "Veteran appraiser" conflates multiple roles (floor appraiser, GM buyer, independent buyer) | Named specific Mike with role, tenure, dealership size, tech comfort — each characteristic sourced from research |
| Evidence scattered across comments | Pain points claimed but not sourced; assumptions unranked by confidence | Created evidence map; every claim now traces to source document with confidence label |
| Scope unclear | Whiteboard listed non-goals without reasoning; felt like features we couldn't build | Reframed non-goals as *decisions* with explicit reasoning ("why we cut this, when we revisit it") |
| Metrics over-inclusive | Three success metrics without priority created fuzzy gating | Split into gating (adoption) + input metrics (diagnostics) + guardrails (failure modes). Only adoption gates launch. |
| "Perfect" PRD hid validator testing | Filling every gap would create a PRD that looks done but has hidden assumptions | Kept five intentional friction points visible so validator testing is real, not theater |

---

## What we're moving forward with

**Locked fixture:** `demo-prd/acvmax-bid-mode-prd.md` — evidence-grounded, scope-disciplined, deliberately-gapped PRD ready to be validated by EchoMind's GM persona.

**Demo flow:** 
1. Show the whiteboard (problem framing + competitive context)
2. Show the PRD (solution hypothesis + requirements + metrics)
3. Point out the five friction points we left in *on purpose*
4. Run EchoMind's validator against the PRD
5. Surface the validator's findings: fit / friction / questions / refinements
6. Close with: "This is what EchoMind does — finds non-obvious tension that product teams should resolve before shipping"

**Evidence trail:** Every claim in the PRD is citable. If a judge asks "why do you think Mike cares about this," the answer is "Q4 2024 UX shadowing + Mar 2026 App Store synthesis + internal dealer research," not "it seems obvious."

**Persona for validator:** Mike (GM, 15+ yrs, suburban, iPhone) with job-to-be-done ("synthesized max bid, defensible, <60 seconds") and sourced pain points (no synthesis, 4-tab hop, no live state, Recs invisible).

---

## Open threads for future sessions

- **Validator confidence vs. evidence density:** Does the validator produce higher-confidence findings when given the full evidence trail (whiteboard + PRD + research artifacts) vs. PRD alone? This is a signal for whether EchoMind should require evidence submission from POs, or if the validator works on specs without backup.

- **Designer persona validation:** Mike is the user persona. What about the **designer** persona? Should Bid Mode's solution be validated against a designer's workflow (can we build this in 4 weeks? is it testable?) before the judge sees it?

- **Post-demo validation:** Are the five friction points we left in *actually obvious* to real ACV stakeholders, or did we miss the real gotchas? This is a humility check on our own validator output.

- **Evidence provenance in validator output:** If EchoMind surfaces a friction point, should it cite the evidence that grounded the concern? ("Your metric is unmeasurable because your PRD doesn't define how to ID veteran buyers — that's a data collection problem, not a hypothetical")

- **V2 scope questions:** When do we validate prototype/code (not just PRD)? When does the validator surface implementation risk, not just product risk?

---

## Why this log exists

This is the reasoning record behind the demo fixture. Session 001 established *what* to demo and *why*. This session established *how* to make the demo credible — by grounding the bet in evidence, making scope cuts explicit, and leaving intentional friction points for the validator to find.

If a future contributor asks "why is there a confidence band in the PRD without defining it?" the answer is "because we wanted to test whether the validator would catch it." If they ask "why is Mike a GM instead of a floor appraiser?" the answer is "because Q4 2024 UX shadowing showed that GMs are the buying decision-maker at most dealerships, and their incentive structure is different."

The PRD is not a final spec — it's a *test artifact*. It was written to be validated, not to be executed. That's the entire point of the hackathon demo.
