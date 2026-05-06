# PRD Authoring Guide

**Audience:** The model (or human) drafting the demo PRD that EchoMind will validate.
**Voice to write in:** A Product Owner with 15+ years of experience, including time at FAANG (think: Amazon PRFAQ rigor, Google clarity-of-intent, Meta speed-to-decision). Opinionated, evidence-led, allergic to fluff.

The goal of this guide is not to teach PRDs in the abstract — it is to set the bar for the *one* PRD we are about to produce so that EchoMind's persona validators have something real to bite into.

---

## 1. What a great PRD actually does

A PRD is a **decision document**, not a feature catalog. A reader should finish it knowing:

1. **Who the customer is** and what they are currently doing instead.
2. **What problem we are solving** and why it is worth solving *now*.
3. **What we are building** at a level of specificity that engineering can scope and design can wireframe — but no further.
4. **What we are explicitly not building** (and why).
5. **How we will know it worked** (measurable, time-bound).
6. **What we are betting** that could be wrong (assumptions, risks, open questions).

If any of those six are missing or hand-wavy, the PRD is not done.

## 2. Operating principles (FAANG-flavored)

- **Customer-first, working backwards.** Open with the customer and the problem, not the solution. If you cannot describe the customer in one sharp sentence, you do not understand them yet.
- **Narrative over bullet salad.** Lead with prose that a thoughtful exec could read in 5 minutes and brief their team on. Bullets exist to serve the narrative, not replace it.
- **Specific beats clever.** "Reduce time-to-first-insight from 4 days to under 1 hour for the median PO" beats "delight users with faster insights."
- **Numbers everywhere they belong.** Population sizes, current baselines, target deltas, confidence levels. If you cannot find a number, write "Unknown — needs research" and flag it.
- **One-way vs two-way doors.** Call out which decisions are reversible and which are not. Only the irreversible ones deserve heavy debate in the doc itself.
- **Disagree-and-commit, in writing.** Capture the alternatives considered and why they were rejected. The reader should not have to ask "did you think about X?"
- **No happy-path-only.** Every meaningful flow needs at least one named failure / edge case acknowledged.

## 3. Required sections

Use these section headings, in this order. Keep them — EchoMind validators key off structure.

### 3.1 TL;DR
Three to five sentences. What we're building, for whom, why now, and the headline success metric. A reader who stops here should still know the bet.

### 3.2 Customer & Problem
- **Primary persona** — name, role, context. One paragraph.
- **Job-to-be-done** — one sentence in the form *"When [situation], I want to [motivation], so I can [outcome]."*
- **Current behavior** — what they do today (workarounds, tools, time cost). Cite evidence.
- **Pain points** — ranked, not listed. Top one first, with the size of the pain.

### 3.3 Why Now
What changed — in the market, in the tech, in the org, in customer behavior — that makes this the right quarter to invest? If nothing changed, justify why this still beats other things on the roadmap.

### 3.4 Goals & Non-Goals
- **Goals** — outcome statements, not feature statements. Each one paired with a measurable success criterion.
- **Non-goals** — explicit list of what this product/feature will *not* do in this release, with one-line rationale.

### 3.5 Proposed Solution
Lead with a 1-paragraph narrative of the experience from the customer's POV. Then:
- **Key user flows** — 2–4 flows, each as a short numbered list of steps.
- **Surface area** — entry points, primary screens/states, integrations.
- **Information architecture** — what data shows up where, and where it comes from.
- **Out-of-scope variants** — alternatives considered and rejected, with the deciding factor.

### 3.6 Requirements
Split into:
- **Functional requirements** — what the system must do. Numbered (FR-1, FR-2…) so reviewers can reference them.
- **Non-functional requirements** — latency, availability, accessibility (WCAG 2.2 AA minimum), security/privacy, observability, cost ceilings.
- **Constraints** — anything fixed by the org, the stack, legal, or partners.

### 3.7 Success Metrics
- **North-star metric** — one. The thing that, if it moves, the bet paid off.
- **Input metrics** — 2–4 leading indicators we can read in days/weeks, not quarters.
- **Guardrails** — metrics that must *not* regress (perf, satisfaction, error rate).
- **Measurement plan** — how each metric is instrumented and reported, and the target value with a date.

### 3.8 Assumptions, Risks & Open Questions
- **Assumptions** — what must be true for this to work. Each one labeled with a confidence level (High/Med/Low) and how we'd validate it.
- **Risks** — likelihood × impact, with a mitigation per row.
- **Open questions** — owner and a "needs answer by" date.

### 3.9 Rollout & Launch
Phasing, target audience per phase, kill criteria, comms plan, and what "GA" means for this product.

### 3.10 Appendix
Research links, raw quotes, prior art, competitive scan, glossary. Anything a skeptical reviewer might ask for.

## 4. Style rules

- **Length budget:** ~3–6 pages of prose-equivalent. If it grows past that, push detail into the appendix or a linked design doc.
- **Tense:** Present tense for the product as it will exist; past tense only for evidence and prior decisions.
- **Voice:** First-person plural ("we will…"). Avoid "should/could/might" in requirements — use "must" or "will."
- **No marketing words.** Words to avoid: *seamless, robust, intuitive, world-class, leverage, synergy.* If you used one, you skipped the specific thing it was hiding.
- **Images and tables are first-class.** A flow diagram or comparison table is usually clearer than three paragraphs.
- **Cite or caveat.** Any claim about customer behavior either has a citation (interview, ticket, analytic) or a "Source: assumption — needs validation" tag.

## 5. Definition of done (PRD-level)

Before circulating, the author should be able to answer **yes** to all of the following:

- [ ] A new reader could brief their team in 5 minutes after reading only the TL;DR + Goals.
- [ ] Every requirement is testable.
- [ ] Every metric has a baseline, a target, and an owner.
- [ ] Every assumption has a way to be invalidated.
- [ ] Non-goals are explicit and at least as ambitious as the goals (i.e., we said no to real things).
- [ ] At least one named failure mode and one accessibility consideration appear.
- [ ] The doc would survive a hostile reviewer asking "what would change your mind?"

## 6. Notes for this specific demo

- The PRD is a **mock** for an EchoMind hackathon demo (2026-05-06). It must be realistic enough that a senior ACV PO would nod at it, and structured enough that EchoMind's persona validators can produce a non-trivial fit/friction read-out.
- Assumptions are **expected** — flag them inline with `> Assumption:` blockquotes so the validator can pick them up cleanly.
- Keep the domain consistent with ACV (automotive wholesale / dealer-facing tooling) unless the user's prompt specifies otherwise.
- Pair this PRD with a Confluence copy for the live demo. Keep the markdown source-of-truth here; treat Confluence as a render target.
