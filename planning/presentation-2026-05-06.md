# EchoMind — Hackathon Presentation
*Deadline: EOD 2026-05-06 · Format: Recorded demo, max 5 minutes*

---

## Pre-Work Disclosure

Work completed before the hackathon hacking period:
- Competitive analysis of ACV vs. COX Automotive to ground the problem space

Everything else — problem framing, whiteboarding, persona foundation, and this presentation — was completed during the hackathon.

---

## Format Decisions

| Decision | Choice |
|---|---|
| Recording format | Screen share — recorded, not live |
| Demo interface | Static web app UI mockup + terminal output from Chad's engine |
| Claude Skill | Terminal output demonstrates EchoMind as a Claude Skill |
| Narrator / PO | Jake — same voice throughout |
| EchoMind voice | Chad if time allows; fallback = response generates on screen, Jake reads it |
| Persona | Mike Lott — GM, small dealership |
| PRD being validated | ACV MAX Mobile: Auction Bid Mode |

---

## Presentation Structure

### [0:00 – 0:30] Hook
> "Every week, ACV product teams make decisions about what to build — and most of those decisions are based on someone's best guess about who they're building for."

### [0:30 – 1:30] The Problem

- ACV doesn't have a single trusted source of truth for the personas we design and build for
- Designers, POs, and researchers can't consult them when making strategic decisions
- Teams either ship on misaligned opinions or wait on research that is slow and unavailable
- As a PO: I'm making bets based on personal assumptions rather than user truth

### [1:30 – 2:00] The Solution

> "EchoMind gives ACV product owners and designers a single, trusted place to consult accurate personas — so they can validate ideas before development starts and ship products that actually resonate with dealers."

### [2:00 – 4:15] The Demo

*On screen: Static EchoMind web app UI mockup, loaded with Mike Lott — GM persona.*
*Jake narrates and plays the PO. Chad voices Mike Lott if available; otherwise response appears on screen.*

---

**Jake (as narrator/PO):**
> "We have a new feature idea for ACV MAX Mobile — Bid Mode. When a vehicle is rolling in the lane, the dealer taps 'Going Live' and gets a Recommended Max Bid on screen — plus MMR, market range, estimated recon, and live simulcast data. All in one view. Before we take this to the sprint, let's run it through EchoMind."

**Mike Lott (EchoMind):**
> "I've got 60 seconds while that car is rolling. Give me the ceiling — one number — and tell me I can trust it. The rest of that? MMR, market range, recon tiles? That's noise while the auctioneer is calling. If I have to read four things to make a decision, I've already missed the car."

**Jake (as PO):**
> "So the synthesized ceiling is the feature — everything else is secondary?"

**Mike Lott (EchoMind):**
> "The ceiling and one tap to lock it. I'll look at the why after the gavel drops. Not before."

---

*Money moment: The PRD proposed four data tiles. Mike just told us one number wins. That assumption would have shipped uncaught.*

*On screen: Switch to terminal — EchoMind Claude Skill output.*

### [4:15 – 5:00] The Close

*On screen: Structured EchoMind output artifact — web app mockup and terminal side by side.*

- **Fit:** Strong — Bid Mode solves a real lane-side pain
- **Friction:** Information overload — four tiles compete with the ceiling
- **Refinement:** Lead with one hero number; collapse everything else behind "Why?"
- **Question:** Does the buyer trust the AI ceiling enough to act without checking comps first?

> "That just happened in 90 seconds. Without EchoMind, that assumption ships. With it, the team course-corrects before a single sprint starts."

---

## Recording Notes

- Jake narrates throughout — no handoff needed
- Chad voices Mike Lott live if time allows; otherwise let the response render on screen
- Hold on the money moment — don't rush past it
- Close with both surfaces on screen: mockup + terminal side by side
- End on the closing line, not a feature list

---

## Pre-Recording Checklist

### 1. Demo Interface
- [x] Static web app UI mockup — primary surface
- [x] Terminal output from Chad's engine — secondary surface (Claude Skill)
- [x] Screen share only — no live audience
- [ ] Test recording setup before the real take

### 2. Hero Persona YAML
- [x] GM — Mike Lott
- [x] general-manager.yaml confirmed as source of truth
- [ ] Verify persona system prompt renders correctly from the YAML

### 3. Jake's PO Pitch
- [x] PRD: ACV MAX Mobile — Bid Mode (Confluence)
- [x] Assumption to challenge: four data tiles in a 60-second window
- [ ] Rehearse delivery — keep it under 30 seconds

### 4. Persona On Screen
- [x] Named persona: Mike Lott, GM
- [x] Name visible in web app mockup during demo
- [ ] Confirm mockup shows Mike Lott's name and role clearly

### 5. Demo Script
- [x] Jake's opening line — finalized
- [x] Mike Lott's pushback — finalized
- [x] Jake's follow-up — finalized
- [x] Closing line — finalized

### 6. Close
- [x] Option B + C confirmed — demo proves value + artifact on screen
- [x] Structured output defined: fit / friction / refinement / question
- [ ] Static mockup of output artifact needs to be designed
- [ ] Terminal output from Chad's engine needs to be captured/ready
- [ ] Write the closing line for the recording
