# ACV MAX Mobile — Bid Mode
**Product:** ACV MAX Mobile (iOS)
**Feature:** Bid Mode — Lane-Side Bid Ceiling
**Status:** Draft — hackathon demo fixture (EchoMind validation)
**Date:** 2026-05-05

---

## TL;DR

ACV MAX Mobile is the best-data app at the auction, but its current vehicle screen is built for desk prep, not for the 60–90 seconds while a vehicle is rolling and the auctioneer is calling bids. We will add **Bid Mode** — a single-tap state on the existing Vehicle detail screen that synthesizes a defensible max bid ceiling using ACV's Recommendations engine, live simulcast feed data, and contextual comps — delivering one glanceable number in under 5 seconds. The primary customer is a veteran General Manager who doubles as a buyer at live auctions, managing 10–50 units per auction day. The bet is that surfacing the right number at the right moment turns ACV's data investment into a daily-use competitive advantage at the only point where buying decisions are actually made. **North-star: 50% of veteran buyers use Bid Mode on ≥80% of vehicles they bid on, within 90 days of launch.**

---

## Customer & Problem

### Primary persona
Mike is a General Manager with 15+ years in automotive, 7+ years at the GM level, running a dealership in the suburban Midwest. He attends 2–4 live auctions per month, often buying or directing buying personally on 10–50 units per event. He carries his iPhone in the auction lane. He is tech-moderate: he adopted ACV MAX because it has the best data, not because it is the best app. He does not have patience for workflows that add steps without adding confidence.

> At a live auction, Mike is also the appraiser. His title says GM; his lane-side job is to bid or pass in 60–90 seconds and defend the call to himself and his team the next morning.

### Job-to-be-done
When a vehicle is rolling in the lane and the auctioneer is calling bids, I want to know the maximum I should pay — synthesized, not calculated — so I can act with confidence in under 60 seconds and defend the number if challenged.

### Current behavior
Mike opens ACV MAX before a vehicle comes up, navigates via Auctions → Lanes → Vehicles, then tab-hops across Info, Market, VHR, and Books to manually assemble a picture. He enters an asking price into the Appraisal Calculator, subtracts recon and pack to get a rough trade number, then applies a personal bid ceiling from memory. Total time: 3–5 minutes for a careful pass — 2–4 minutes more than the auction window allows. In practice, he does partial research pre-auction and trusts gut and remembered MMR when the car comes up live.

*Source: ACV MAX App Store reviews (Mar 2026 synthesis); ACV UX dealer shadowing notes, Q4 2024; whiteboard session with ACV product team, May 2026.*

### Pain points (ranked)

1. **No synthesized max bid.** The calculator does subtraction on numbers Mike already had to find. It does not produce the number he came for: the ceiling. He holds recon estimate, pack, profit target, and MMR delta in his head simultaneously under time pressure. (Size: every bid decision at every auction, every month.)
2. **4-tab hop under time pressure.** Each tab is a separate screen with its own scroll. Info → Market → VHR → Books and back resets focus and costs 45–90 seconds — more than the bid window on a moving lane.
3. **No live lane state.** Current bid, time remaining, and run-order position are not surfaced next to the appraisal. Mike cannot see whether he is over or under his ceiling relative to where bidding is right now.
4. **Recommendations is invisible at the moment it matters.** The Mar 2026 AI Recommendations feature is one workflow removed from the lane-side decision. It is the most valuable output ACV produces; it does not reach the surface where the decision is made.

---

## Why Now

Three things converged in Q1 2026 that make this the right quarter:

1. **Recommendations is live (Mar 2026).** The inference engine that produces AI-powered max bid estimates exists in production. The gap is the delivery surface, not the model. Bid Mode is Recommendations finally reaching the moment of truth.
2. **The lane-side gap is now the loudest complaint.** Post-Recommendations launch, App Store reviews and dealer NPS verbatims shifted from "missing data" (addressed) to "can't use in the lane" (not addressed). The data improvement landed; the UX did not follow.
3. **Cox is structurally slow on UX velocity.** vAuto + Manheim + Dealertrack remain fragmented across logins and sessions. Cox can out-integrate ACV on DMS bundle; Cox cannot out-execute on lane-side UX in a single quarter. The window is now.

> Assumption (High confidence): The Recommendations engine already produces a per-vehicle bid ceiling that can be returned via the existing mobile API in <3 seconds. Validation: API spec review with data engineering — M1 kickoff.

---

## Goals & Non-Goals

### Goals

| Goal | Success Criterion |
|---|---|
| Veteran buyers adopt Bid Mode as their primary bid-decision tool | ≥50% of veteran buyers (GM/buyer role, 10+ yrs) use Bid Mode on ≥80% of vehicles bid on, at 90 days post-GA |
| Bid recommendation is delivered fast enough for the auction window | Median time: "Going Live" tap → Recommended Max Bid displayed **<5 seconds** on LTE |
| Buyers trust the number enough to act on it | "I trust this number" in-app pulse (top-2-box): **>70%** at 30 days |
| Veteran-buyer NPS improves | NPS delta vs ACV MAX baseline for veteran-buyer segment: **+20 points** at 60 days |

### Non-Goals

- **Android support in v1.** Scoping to iOS only; Android follows in v2 if adoption validates the bet. Veteran buyer segment is iOS-dominant per ACV mobile analytics; Android parity adds 6–8 weeks of QA with no incremental learning.
- **Automatic geo-trigger for Going Live.** The feature will not auto-activate based on geofence + run-order position in v1. Manual tap keeps the buyer in control and avoids false-positives in multi-lane facilities.
- **Apple Watch glance.** Valuable; deferred to v1.1 if lane-side adoption validates.
- **Offline-first full sync.** v1 will cache the run-list and last-seen comps before facility entry. Real-time Recommendations and simulcast data require connectivity.
- **DMS write-back.** Bid Mode ceilings write back to the ACV Appraisal record (Source: MAX Mobile). DMS integration (Reynolds, CDK, Dealertrack) is out of scope for v1.
- **Bid placement or auction automation.** Bid Mode sets a ceiling in the buyer's app; it does not place bids or automate any auction action.

---

## Proposed Solution

Mike walks into the auction facility with ACV MAX open. Before entering, the app has pre-fetched the run list and last-seen comps for all vehicles in his target lanes. As a vehicle comes up on the run order, he navigates to it via the familiar Auctions → Lanes → Vehicles path. He sees the standard Vehicle detail with its four tabs. One new element appears: a **"Going Live"** button in the action bar.

When Mike taps Going Live, the screen transitions to Bid Mode — a single-state view optimized for the next 60–90 seconds. At the top: Year/Make/Model/Trim, miles, color, run-order position in large type, no tabs. Below that, the hero number: **Recommended Max Bid**, powered by Recommendations, with a confidence band (e.g., "±$400") and a one-tap "Why this number?" that expands to show the weighted components (MMR, regional market range, estimated recon). Three supporting tiles beneath: MMR · Market Range · Est. Recon — large, no scroll. A live lane strip shows the current bid, time remaining, and lane status from the auction simulcast feed. A single primary CTA — **"Set My Ceiling at $X"** — locks the number and pins it persistently at the top of the screen while bidding continues. An "Adjust" link expands the existing Appraisal Calculator for buyers who want to override the recommendation.

When the gavel drops, if Mike set a ceiling, it writes back to the vehicle's Appraisal record with source "MAX Mobile — Bid Mode" so his desk team sees it the next morning.

### Key user flows

**Flow 1 — Standard: prep, Going Live, ceiling set**
1. Mike opens ACV MAX → Auctions → his auction → Lane 3
2. Taps vehicle arriving in 4 positions — Vehicle detail loads (existing tabs)
3. App has pre-fetched comps; "Going Live" button is visible in the action bar
4. Taps Going Live → Bid Mode screen loads, Recommended Max Bid appears within 5 seconds
5. Reviews hero number; taps "Why?" to check components
6. Taps "Set My Ceiling at $14,500" — number pins to top of screen
7. Bids to $14,200; gavel drops; ceiling auto-written to Appraisal record

**Flow 2 — Override: buyer adjusts the recommendation**
1. Mike enters Bid Mode; Recommendations returns $12,800 but he knows this market runs hotter
2. Taps "Adjust" → Appraisal Calculator expands inline
3. Sets ceiling manually to $14,000; taps "Set My Ceiling"
4. Override is flagged in the Appraisal record (Source: MAX Mobile — Bid Mode, user-adjusted)

**Flow 3 — Degraded: connectivity failure mid-session**
1. Mike taps Going Live; facility wifi drops before simulcast feed loads
2. App displays cached comps + Recommendations (pre-fetched); live lane strip shows "Live data unavailable — using last known"
3. Mike can still set a ceiling from cached data; live state row is clearly grayed

### Surface area
- **Entry point:** "Going Live" button on existing Vehicle detail screen — no new nav node
- **Primary screen:** Bid Mode state (tab bar replaced by single-state view; back button returns to Vehicle detail)
- **Persistent element:** Ceiling chip pinned to top of Bid Mode once set
- **Exit:** Back button or gavel-drop auto-collapse to Vehicle detail

### Information architecture

| Element | Data source |
|---|---|
| Recommended Max Bid | ACV Recommendations engine (live, Mar 2026) |
| Confidence band | Recommendations output — surface only, no new inference |
| MMR | Manheim Market Report via existing ACV MAX data pipeline |
| Market range (low–high) | ACV regional comp dataset |
| Estimated Recon | ACV condition-report-derived recon estimate |
| Current bid / Time remaining / Lane status | Auction simulcast feed (ADESA, Manheim) — new integration |
| Run-order position | Existing ACV MAX lane data |
| Appraisal write-back | ACV Appraisal record API (existing endpoint, new source tag) |

### Out-of-scope variants considered

- **Standalone "Lane Mode" app or tab.** Rejected: requires new nav discovery and breaks the existing Auctions flow buyers already use. Bid Mode as a screen state has zero discovery friction.
- **Auto-trigger via geofence + run-order.** Rejected for v1: false-positives in multi-lane facilities create trust debt faster than a tap costs. Revisit in v1.1 with opt-in.
- **Chat-style "ask ACV" interface.** Rejected: conversational UI is too slow for 60-second windows. One number, one tap.

---

## Requirements

### Functional requirements

| # | Requirement |
|---|---|
| FR-1 | The Vehicle detail screen must display a "Going Live" button when the vehicle is in an active run order and the buyer has a valid ACV MAX session. |
| FR-2 | Tapping "Going Live" must transition to Bid Mode and display the Recommended Max Bid within 5 seconds on a standard LTE connection. |
| FR-3 | Bid Mode must display: Recommended Max Bid with confidence band, MMR, Market Range (regional low–high), Estimated Recon, Current Bid, Time Remaining, and Lane Status. |
| FR-4 | "Why this number?" must be reachable in one tap and show the weighted components of the Recommended Max Bid with source labels. |
| FR-5 | "Set My Ceiling at $X" must pin the ceiling value persistently at the top of Bid Mode until the buyer manually clears it or the session ends. |
| FR-6 | "Adjust" must expand the existing Appraisal Calculator inline within Bid Mode without navigating away. |
| FR-7 | Live lane state must be sourced from the auction simulcast feed and refresh at ≤10-second intervals. |
| FR-8 | If the simulcast feed is unavailable, Bid Mode must display cached data with a clear "Live data unavailable" indicator; the ceiling-setting flow must remain functional. |
| FR-9 | When a buyer sets a ceiling, the value must write back to the vehicle's Appraisal record with the appropriate source tag within 30 seconds. |
| FR-10 | The app must pre-fetch the run list and last-seen comps for all vehicles in the buyer's target lanes on auction-day morning (background fetch). |
| FR-11 | Bid Mode must be accessible from the existing Auctions → Lanes → Vehicles path; no new top-level nav node will be added. |

### Non-functional requirements

| Category | Requirement |
|---|---|
| **Latency** | Going Live → Recommended Max Bid displayed: <5s P50 on LTE. Degrade to 10s on 3G; beyond that, show cached estimate with staleness label. |
| **Availability** | Bid Mode must degrade gracefully to cached data if the Recommendations API or simulcast feed is unavailable. iOS crash-free session rate: ≥99.5%. |
| **Accessibility** | WCAG 2.2 AA minimum. Hero number and ceiling chip must pass contrast ratio ≥4.5:1 in high-ambient-light (lane) conditions. Tap targets ≥44×44pt throughout. |
| **Privacy / Security** | No vehicle data or bid history leaves the ACV MAX security boundary. Simulcast feed credentials managed via ACV's existing partner credential vault. No PII in analytics events. |
| **Observability** | Instrument: Going Live taps, time-to-recommendation, ceiling-set rate, "Why?" taps, Adjust rate, write-back success/failure. Dashboard live within 1 week of launch. |
| **Cache** | Run list and last-seen comps pre-fetched on auction-day morning. Comps >24h old must be labeled as stale. |
| **Cost** | Each Going Live tap triggers one Recommendations API call. Target: <$0.05/call. Circuit breaker at 2× daily average volume. |

### Constraints

- iOS only for v1 (locked).
- Recommendations API is read-only; Bid Mode does not write to or retrain the model.
- Simulcast feed schema is partner-defined (ADESA, Manheim) and must be treated as stable-but-opaque.
- Appraisal write-back must use the existing Appraisal record API; schema changes are out of scope.

---

## Success Metrics

### North-star metric
**% of veteran buyers (GM/buyer role, 10+ yrs automotive) who use Bid Mode on ≥80% of vehicles they bid on, measured at 90 days post-GA.**
Target: 50%. Baseline: 0% (feature does not exist).

### Input metrics

| Metric | Target | Baseline | Measurement |
|---|---|---|---|
| Median time: Going Live → Recommended Max Bid displayed | <5s | Not instrumented | Client-side timing event, P50 |
| VIN scan success on first attempt in lane lighting | >95% | Unknown — needs instrumentation | Scan success/failure event |
| "I trust this number" in-app pulse (top-2-box) | >70% | Not asked (new question) | Post-session micro-survey, n≥200 |
| Veteran-buyer NPS delta vs ACV MAX baseline | +20 points | Baseline pull needed at launch | Quarterly NPS, veteran-buyer segment |

### Guardrails

| Guardrail | Threshold | Why |
|---|---|---|
| Recommendation accuracy (Bid Mode recs vs realized sale price, MAPE) | Bid Mode MAPE ≤ desk-mode MAPE | Lane Mode must not encourage worse buys |
| iOS crash-free session rate | ≥99.5% | Parity with existing ACV MAX baseline |
| Desk-mode DAU/WAU | Must not decline >5% post-launch | Adding a surface, not cannibalizing |
| Arbitration claim rate (Bid Mode vs desk-mode buys) | Bid Mode rate ≤ desk-mode + 2pp | Early signal of decision quality regression |

### Measurement plan
- Client instrumentation ships on day 1 of launch: Going Live taps, time-to-rec, ceiling-set rate, Adjust rate, write-back success/failure.
- "I trust this number" pulse: 5-question micro-survey triggered 30 seconds after gavel drop when a ceiling was set.
- NPS delta: baseline pull at launch; 60-day follow-up to veteran-buyer segment (accounts with ≥5 yrs tenure and ≥1 auction/month).
- Recommendation MAPE: join Bid Mode ceiling events to realized sale prices via auction result feed, 30-day rolling window.

---

## Assumptions, Risks & Open Questions

### Assumptions

| Assumption | Confidence | Validation |
|---|---|---|
| Recommendations engine produces a per-vehicle bid ceiling returnable via mobile API in <3s | High | API spec review — M1 kickoff |
| ACV has active simulcast read entitlement from ADESA and Manheim covering the majority of lanes veteran buyers attend | Med | Partner entitlement audit — M1 week 1 |
| Veteran buyers carry iPhones into the lane (not Android) | High | ACV mobile analytics (existing) |
| A synthesized ceiling, if trusted, will change bid behavior — buyers will act on it rather than revert to gut | Med | In-app pulse + arbitration claim rate at 30 days |
| 2026 App Store reviews are representative of veteran-buyer sentiment | Low (demo only) | Real v1 would validate with 5–8 fresh interviews |

### Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Simulcast feed latency exceeds 10s in-lane | Med | High | Degrade to cached data with clear label; launch with ADESA lanes only (higher feed SLA) |
| Recommendations accuracy is lower for auction-specific vehicles (salvage, high-mile, specialty) | Med | High | Exclude out-of-model vehicles in v1; show "Recommendation unavailable" rather than a low-confidence number |
| Veteran buyers don't trust the AI ceiling and never tap Going Live | Med | High | "Why this number?" transparency is the primary trust lever; monitor Adjust rate as early signal |
| Simulcast entitlement doesn't cover all partners in time for launch | Med | Med | Launch with ADESA + Manheim only; show "Live state unavailable" for other auctions |
| iOS crash-free rate drops below 99.5% on older devices (iPhone 12 and below) | Low | High | Test specifically on iPhone 12/13/14; restrict to iPhone 14+ at launch if needed |

### Open questions

| Question | Owner | Needs answer by |
|---|---|---|
| Is Bid Mode a free addition to all ACV MAX seats, or tied to the ACV MAX Appraisal SKU? | GM / Pricing | M1 week 2 |
| What is the simulcast feed refresh rate guarantee from ADESA and Manheim? SLA needed before committing to the 10s target. | Biz Dev / Partner Eng | M1 week 1 |
| Does the Recommendations model need retraining on auction-context vehicles vs the desk-appraisal training set? | Data Science | M1 week 2 |

---

## Rollout & Launch

### Phase 1 — Closed beta (Weeks 1–4 post-build)
- **Audience:** One buying group (3–5 rooftops, 10–15 active buyers), recruited via ACV account team.
- **Gate criteria:** Time-to-recommendation <5s P50, crash-free ≥99.5%, "I trust this number" top-2-box ≥60%.
- **Kill criteria:** Arbitration claim rate for Bid Mode buys exceeds desk-mode rate by >5pp in the first 30 days.

### Phase 2 — GA (Week 8 post-build)
- **Audience:** All ACV MAX iOS users with active auction access.
- **Comms:** In-app tooltip on first Auctions visit post-launch; account team outreach to top 50 auction-active accounts; App Store release notes.
- **"GA" definition:** Bid Mode available to 100% of eligible iOS users; simulcast feed live for ADESA and Manheim lanes; Recommendations API in production with circuit breaker active.

---

## Appendix

### Evidence base
- ACV MAX App Store reviews (Mar 2026 synthesis) — primary voice-of-customer for lane-side friction
- ACV UX dealer shadowing notes (Q4 2024) — daily workflow and tool usage observations at two rooftops
- ACV MAX Recommendations launch notes (Mar 2026) — confirms inference engine is in production
- ACV dealer GM persona research (internal) — pain point ranking and vocabulary

### Glossary

| Term | Definition |
|---|---|
| MMR | Manheim Market Report — the industry-standard wholesale valuation benchmark |
| Pack | A fixed per-vehicle overhead cost added by the dealership before profit is calculated |
| Recon | Reconditioning cost — what it costs to prepare the vehicle for retail sale |
| CSI | Customer Satisfaction Index — manufacturer-tracked dealer satisfaction score |
| Simulcast feed | Real-time data feed from auction operators (ADESA, Manheim) carrying current bid, time remaining, and lane status |

### Competitive scan
- **Manheim Marketplace app:** vehicle search and buy-now; no lane-side synthesized ceiling
- **vAuto (Cox):** desktop-first; mobile is a reporting surface, not a bidding tool
- **Dealerslink:** price-competitive; no AI recommendation layer
- **ACV MAX desk mode (current):** best-in-class data depth — the tool this feature builds on, not replaces

> Assumption (demo only): Competitive data is based on publicly available product information and ACV internal competitive intelligence as of Q1 2026. Real v1 would include hands-on competitive testing.
