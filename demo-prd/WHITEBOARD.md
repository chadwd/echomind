# Whiteboard — Lane-Side Appraisal in ACV MAX

> Working artifact. Captured as a fast whiteboard pass to align on problem and bet before drafting the PRD. Tone is deliberately tight; depth lives in the PRD.

---

## 1. People Problem

**Who:** A veteran used-car appraiser (10–30+ years experience) working **lane-side at a live auction** — phone in hand, dealer principal in their ear, vehicle rolling past in 60–90 seconds.

**What they're trying to do:** Decide *bid or pass*, and at what number, with enough confidence to defend the call to the GM tomorrow morning.

**What's actually there today (from the iOS app screens):**
- **Auctions tab** with Near You + By State drilldowns, pre-loaded with ADESA/Manheim schedules.
- **Auction → Lanes → Vehicles** drill-in with the full run order (year/make/model/color/miles/cylinder/VIN).
- **Vehicle detail** with four tabs — Info / Market / VHR / Books — and an Appraisal Calculator (Asking Price − Recon − Profit = Appraisal).

**What's in their way at the moment of decision:**
- The flow is built for **prep**, not for the **20–60 seconds while the car is rolling and the auctioneer is calling bids.**
- **4-tab hop** (Info → Market → VHR → Books → back to Info) to assemble a number — every tab is its own screen, requires scroll, and resets focus.
- **Asking Price is a manual input** the appraiser has to derive themselves from the Market tab. The calculator does subtraction, not synthesis.
- **No surfaced max bid** — the screen tells you what the *trade* is worth, not the ceiling you should bid to. Two different numbers in the appraiser's head, only one is on screen.
- **No live lane state** — current bid, time remaining, run-order position of the car that's actually up — none of it appears next to the appraisal you're building.
- **Recommendations (Mar 2026) is not visible on this surface.** The smartest part of ACV MAX is sitting one workflow away from the moment it would matter most.
- **Glance ergonomics are weak for a lane environment** — small tap targets, dense tabs, low contrast on the calculator inputs, every action is two-handed.

**What they do instead:** Trust gut + paper notes + remembered MMR + a quick text to a buddy. ACV's data investment is real, but it doesn't show up in the seconds it matters.

> Assumption (accepted for demo): the 2024 App Store review is treated as representative of veteran-appraiser sentiment. Real-world v1 would validate with 5–8 fresh interviews; for the hackathon we're running with this as a stand-in voice-of-customer.

## 2. Business Problem

**Where ACV is losing ground:**
- Trust on the auction side is slipping (green-light denials, slow titles, "hush money" settlements) — the brand earned its premium on condition-report rigor, and that premium is eroding.
- ACV MAX has best-in-class data depth but is described as "cumbersome and impossible to use in an auction situation." Veteran users — the ones who set the buying culture at a dealership — are the loudest critics.
- Cox's vAuto wins on bundle + integrations (Reynolds, CDK, Dealertrack, Dealer.com, NextGear). Dealerslink wins on price and simplicity for independents. ACV is squeezed in the middle.
- The Mar 2026 Recommendations launch is an AI investment on a workflow that veteran users already won't run in the lane. Without fixing the lane-side surface, the AI never reaches the decision.

**Where Cox is structurally vulnerable (the opening):**
- Opaque/variable buy-sell fees and inconsistent lane-jockey inspections — dealers call them a "necessary evil."
- Stale UX, fragmented logins, slow physical lanes.
- Their moat is bundle inertia, not product velocity. ACV's counter-bet has to be **product velocity at the moment of truth** — and the moment of truth is lane-side.

**Why now:**
- Recommendations is live (Mar 2026), so the inference engine exists; the gap is the surface that delivers it.
- The 2025 appraisal-only SKU shift signals ACV is willing to unbundle — opens room for a focused lane-side wedge.
- Hackathon timing (May 2026) gives a low-cost way to demo the bet without committing roadmap.

## 3. Company Mission

**ACV (parent):** *Fundamentally change the automotive industry by providing trust and transparency.*

**ACV MAX (product):** *Provide dealers with a customer-centric, AI-driven, and data-powered inventory management platform.*

**How this bet ladders up:**
- *Trust & transparency* → every number on the Lane Mode screen is one tap from "why this number" — provenance the appraiser can defend.
- *Customer-centric* → designed around the appraiser's real moment (60–90 seconds, lane lighting, one hand) rather than around the desk-tool tradition.
- *AI-driven* → Recommendations (Mar 2026) finally reaches the decision instead of dying behind a workflow.
- *Data-powered* → ACV's data depth shows up at the moment of decision, not 20 minutes after the gavel.

## 4. Problem to Solve (one sentence)

> **The Auctions section in ACV MAX Mobile gets the appraiser to the right vehicle, but at the moment that vehicle is rolling and the bid is rising, the app cannot synthesize a defensible max bid faster than the appraiser's gut — so the appraisal, the data, and the AI Recommendations engine all fail to show up at the only moment that decides whether ACV won the deal.**

## 5. Directional Solution Hypothesis

> Labeled as a **hypothesis** — not a committed plan. The PRD will pressure-test it. Note: this builds **on top of** the existing Auctions → Lanes → Vehicles flow, not as a replacement.

Add a **"Bid Mode"** to the existing Vehicle screen — a third state alongside *prep* (today's tabs) and *saved appraisal*. Triggered by a single button on the Vehicle detail ("Going Live" / "Up Now") or auto-activated when the appraiser is on-site and the run-order position matches the live lane.

**One screen, glanceable, optimized for the 20–60 second window:**

| Region | Content |
|---|---|
| Top | Year/Make/Model/Trim, miles, color, run-order # — large type, no tabs |
| Hero number | **Recommended Max Bid** (Recommendations-powered) with a confidence band and a one-tap "why" |
| Supporting trio | MMR · Market range (low–high for region) · Estimated Recon — three big tiles, no scroll |
| Live state | Current bid · Time remaining · Lane status — pulled from the auction's simulcast feed where available |
| Action | Single primary CTA: "Set My Ceiling at $X" — locks the number and shows it persistently while bidding continues |
| Escape hatch | "Adjust" → expands to today's Appraisal Calculator for the appraiser who wants to override |

**Bet shape:**
- *Synthesize, don't subtract.* Today's calculator does math on numbers the user already had to find. Bid Mode produces the number the user came for.
- *Built on existing nav, not bolted alongside.* Same Auctions → Lanes → Vehicles path; Bid Mode lives at the leaf, so adoption is one new state, not a new app.
- *Recommendations earns its keep.* The Mar 2026 AI lands as the hero number on the only screen where the bidding decision happens.
- *Provenance over magic.* Every component of the recommended ceiling is one tap from its source — protects the trust pillar of ACV's mission.

**Why this is the bet, not a bigger one:** Cox can out-integrate ACV indefinitely. Cox cannot out-execute on the lane-side moment because their UX velocity is slow and their workflow is fragmented across vAuto + Manheim + Dealertrack. A focused, fast bid-ceiling surface inside an app the appraiser is *already* opening at the auction is a wedge Cox cannot copy in a quarter.

## 6. How Success Would Be Measured

**North-star:**
- % of self-identified veteran appraisers (10+ yrs) who use Lane Mode on ≥80% of vehicles they bid on, measured 90 days post-launch. **Target: 50%.**

**Input metrics (read in days/weeks):**
- Time from app open → bid recommendation displayed. **Target: <5s median.** (Today: not instrumented; anecdotal "too slow to use.")
- VIN scan success on first attempt in lane lighting. **Target: >95%.**
- "I trust this number" in-app pulse, top-2-box. **Target: >70%.**
- Veteran-appraiser NPS delta vs current ACV MAX baseline. **Target: +20 points.**

**Guardrails (must not regress):**
- Recommendation accuracy vs realized auction sale price — Lane Mode recs must be ≥ desk-mode recs in MAPE.
- iOS crash-free session rate ≥ 99.5%.
- Desk-mode DAU/WAU — we're adding a surface, not cannibalizing the existing one.

**Counter-metric to watch:**
- Arbitration claim rate on vehicles bought via Lane Mode vs desk-mode. If Lane Mode encourages worse buys, we'll see it here within 30 days.

## 7. Open Questions for the PRD

1. Is Bid Mode a free addition to existing ACV MAX seats, or part of the unbundled ACV MAX Appraisal SKU?
2. **Live lane data:** Manheim/ADESA simulcast feeds — do we have entitlement to read current-bid/time-remaining in real time, or is Bid Mode a "best estimate without live state" surface for non-ACV lanes? (Affects whether the Live State row is core or progressive enhancement.)
3. **Trigger:** Should "Up Now" auto-activate based on geofence + run-order position, or stay manual to keep the appraiser in control?
4. Hardware target — iPhone only for v1, or include Apple Watch glance ("ceiling = $X · still under? y/n")?
5. Do we need an offline mode for spotty auction-facility wifi (cache the run-list + last comps before walking in)?
6. What's the smallest believable customer cohort for the hackathon demo — one rooftop, one buying group, or one vertical (independent vs franchise)?
7. Does a saved Bid Mode ceiling write back to the existing Appraisal record (Source: MAX Mobile) so the desk team sees it the next day?

---

## Echo to EchoMind

This whiteboard is the input the EchoMind validators will be pointed at via the demo PRD. Persona expected: a veteran ACV-customer appraiser. Validator should produce structured fit/friction on §4 (problem framing), §5 (solution hypothesis), and §6 (metrics) with traceable persona evidence per finding.
