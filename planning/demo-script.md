# EchoMind — Full Demo Script
*Recorded via Google Meet · Screen share only · Max 5 minutes*
*Jake: Narrator + PO · Chad: Voice of Echo-Mike (fallback: pre-loaded on screen)*

---

## SCREEN STATES OVERVIEW

| Timestamp | What's On Screen |
|---|---|
| 0:00 – 2:00 | EchoMind web app — initial "Ready to validate" state |
| 2:00 – 2:15 | EchoMind web app — Jake walks through the pre-loaded inputs |
| 2:15 – 2:30 | EchoMind web app — Jake clicks Validate, stepper animates |
| 2:30 – 3:45 | EchoMind web app — results appear, Echo-Mike reads Friction live |
| 3:45 – 4:15 | EchoMind web app — money moment, results remain on screen |
| 4:15 – 4:30 | Brief switch to terminal — Claude Skill output |
| 4:30 – 5:00 | Back to EchoMind web app — closing lines |

---

## FULL SCRIPT

---

### [0:00 – 0:30] HOOK

**ON SCREEN:** EchoMind web app, initial state. Left pane shows "General Manager" and "ACV MAX Auctions Integration" pre-loaded. Right pane shows empty state: *"Ready to validate."*

**JAKE (narrates):**
> "Every week, product owners at ACV sit down to make decisions about what to build — and most of the time, the personas they're supposed to be designing for are scattered across old research docs, outdated Confluence pages, or just living in someone's head."

---

### [0:30 – 1:30] THE PROBLEM

**ON SCREEN:** EchoMind web app remains. No change. Jake narrates over the UI.

**JAKE (narrates):**
> "So decisions get made on assumption. And user research — when it's available — can't always be there at the exact moment a team needs it. That's not a research problem. That's a timing and access problem."

> "The result? Ideas move through the full delivery cycle without ever being validated against the people we're building for. By the time anyone catches it, the feature has already shipped — and the research to understand why dealers aren't using it gets scheduled after the fact."

---

### [1:30 – 2:00] THE SOLUTION

**ON SCREEN:** EchoMind web app. Camera lingers on the Validate button and the pre-loaded inputs.

**JAKE (narrates):**
> "EchoMind gives ACV product owners and designers a single, trusted place to consult accurate personas — so they can validate ideas before development starts and ship products that actually resonate with dealers."

> "Let us show you."

---

### [2:00 – 2:30] THE DEMO — SETUP

**ON SCREEN:** Jake walks through the input pane.

**JAKE (narrates):**
> "We have a new feature idea for ACV MAX Mobile — Bid Mode. When a vehicle is rolling in the lane, the dealer taps 'Going Live' and gets a Recommended Max Bid on screen — plus MMR, market range, estimated recon, and live simulcast data. All in one view."

> "Before we take this to the sprint, let's run it through EchoMind."

*[Jake points to input pane — Persona: General Manager, PRD: ACV MAX Auctions Integration]*

> "Our persona is Mike Lott — a General Manager at a small dealership. He's the buyer, the closer, and the GM. He's in the lane 2 to 4 times a month."

*[Jake clicks Validate]*

**ON SCREEN:** Stepper activates in results pane.
- Step 1: Loading persona ✓
- Step 2: Loading PRD ✓
- Step 3: Calling validator... (active)
- Step 4: Rendering output

---

### [2:30 – 3:45] THE DEMO — ECHO-MIKE RESPONDS

**ON SCREEN:** Results cards appear — Fit, Friction, Questions, Refinements.

*Chad reads Fit first — briefly.*

**ECHO-MIKE (Chad reads Fit):**
> "The Recommended Max Bid is the number I'm already trying to calculate in my head while the auctioneer is calling — surfacing it directly removes the mental load at the worst moment. Pre-fetching comps before I walk in fits my workflow. One-tap ceiling lock is exactly right."

*[Brief pause — Jake acknowledges with a nod or "good."]*

*Chad reads Friction — this is the money moment. Slow it down.*

**ECHO-MIKE (Chad reads Friction):**
> "Four data tiles competing for attention in a 60-second window is too much. I can't read MMR, market range, recon, AND make a bid decision while the auctioneer is calling. The ceiling is the feature — everything else is noise in the lane."

---

### [3:45 – 4:15] THE MONEY MOMENT

**ON SCREEN:** Friction card remains prominent on screen.

**JAKE (as PO):**
> "So the synthesized ceiling is the feature — everything else is secondary?"

**ECHO-MIKE (Chad):**
> "The ceiling and one tap to lock it. I'll look at the why after the gavel drops. Not before."

**JAKE (narrates):**
> "The PRD proposed four data tiles for a 60-second decision window. Echo-Mike just told us one number wins. That assumption would have shipped uncaught."

---

### [4:15 – 4:30] CLAUDE SKILL — TERMINAL

**ON SCREEN:** Switch to terminal. EchoMind Claude Skill output visible.

```
# Validation: General Manager → ACV MAX Auctions PRD

## Fit
- The Recommended Max Bid removes the mental load at the worst moment
- Pre-fetching comps fits the morning workflow
- One-tap ceiling lock is exactly right

## Friction
- Four data tiles in a 60-second window is too much
- The ceiling is the feature — everything else is noise in the lane

## Questions
- Is the Recommended Max Bid net of pack and recon, or a gross number?
- Can I see bid history vs. ceiling over time?

## Refinements
- Lead with one hero number — collapse everything else behind "Why?"
- Show the confidence band prominently — that's what drives the decision to act or pass
```

**JAKE (narrates):**
> "Same validation. Same persona. Available as a Claude Skill — right where product owners already work."

---

### [4:30 – 5:00] THE CLOSE

**ON SCREEN:** Switch back to EchoMind web app — full results visible.

**JAKE (narrates):**
> "That just happened in 90 seconds. Without EchoMind, that assumption ships. With it, the team course-corrects before a single sprint starts."

> "EchoMind isn't a static persona library. Every user interview makes any persona more accurate — more reflective of what real dealers actually experience. The more we learn, the smarter the validation gets."

> "These aren't forgotten artifacts collecting dust in a Confluence page. They scale with our research, our product lines, and our dealers."

---

## ON-SCREEN COPY REFERENCE

### Web App — Initial State (Right Pane)

| Element | Copy |
|---|---|
| Empty state heading | "Ready to validate" |
| Empty state body | "Select a persona and PRD above, then click Validate to see the structured take-away." |

### Web App — Input Pane (Pre-loaded, Disabled)

| Element | Copy |
|---|---|
| Persona | General Manager |
| PRD | ACV MAX Auctions Integration |
| Button | Validate |

### Web App — Stepper Labels

| Step | Label |
|---|---|
| 1 | Loading persona |
| 2 | Loading PRD |
| 3 | Calling validator |
| 4 | Rendering output |

### Web App — Results Cards (Bid Mode Fixture)

**Fit**
- The Recommended Max Bid is the number I'm already trying to calculate in my head while the auctioneer is calling — surfacing it directly removes the mental load at the worst moment.
- Pre-fetching comps before I walk in fits my workflow: I review the lot first thing, so updated data is there when I need it.
- One-tap ceiling lock is exactly right — I set my number and stop second-guessing.

**Friction**
- Four data tiles competing for attention in a 60-second window is too much. I can't read MMR, market range, recon, AND make a bid decision while the auctioneer is calling. The ceiling is the feature — everything else is noise in the lane.
- The "Going Live" button adds a tap I have to remember under pressure. If I forget to tap it before the car comes up, I've lost time.
- No mention of whether the Recommended Max Bid is net of my pack and recon. I need to know if the number is already my cost or if I'm doing that math myself.

**Questions**
- Is the Recommended Max Bid already net of pack and estimated recon, or is it a gross number I need to adjust?
- What happens if the Recommendations API is unavailable mid-lane — does Bid Mode degrade gracefully or show nothing?
- Can I see a history of what I bid versus the ceiling? I want to know if I'm learning to trust the number over time.

**Refinements**
- Lead with one hero number — the ceiling — and collapse MMR, market range, and recon behind a "Why?" tap. Don't make me read four tiles to make a 60-second decision.
- Show the confidence band prominently — that's what determines whether I act or pass, not the supporting data.
- Consider auto-activating Bid Mode when I navigate to a vehicle already on the run list — so I don't have to remember to tap "Going Live."

### Terminal — Claude Skill Output

```
# Validation: General Manager → ACV MAX Auctions PRD

## Fit

- The Recommended Max Bid removes the mental load at the worst moment
- Pre-fetching comps fits the morning workflow
- One-tap ceiling lock is exactly right

## Friction

- Four data tiles in a 60-second window is too much
- The ceiling is the feature — everything else is noise in the lane
- No clarity on whether the bid ceiling is net of pack and recon

## Questions

- Is the Recommended Max Bid net of pack and recon, or a gross number?
- Can I see bid history vs. ceiling over time to build trust in the number?

## Refinements

- Lead with one hero number — collapse everything else behind "Why?"
- Show the confidence band prominently — that drives the act-or-pass decision
- Consider auto-activating Bid Mode when a vehicle is already on the run list
```

---

## FIXTURE FILE — UPDATE REQUIRED

> The current `fixtures/responses/gm-auctions-snapshot.json` is based on the **Consignment Optimizer** PRD.
> For the demo, Chad needs to update this fixture with the **Bid Mode** content above so the on-screen output matches the script.

---

## RECORDING NOTES

- Jake holds the narrative throughout — no handoff needed mid-section
- Chad voices Echo-Mike live; if timing slips, fallback is pre-loaded fixture on screen
- **Hold on the Friction card** — that is the money moment, don't rush it
- Terminal section is brief (15 seconds) — mention it, show it, move on
- End on the web app, not the terminal
- Final line lands on silence — no trailing commentary
