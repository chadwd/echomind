# EchoMind Demo Script

**Format:** Recorded video — submitted 2026-05-06, shown to team Thu/Fri
**Surfaces:** Web app (Chad) + Claude Code skill (Jake)
**Duration:** ~5 minutes end-to-end
**Live gateway preferred during recording** — replay is the fallback

---

## Pre-Recording Checklist

- [ ] On correct branch: `git branch` — should show `persona-foundation` or `main`
- [ ] Dependencies installed: `pnpm install`
- [ ] Engine is built: `pnpm --filter @echomind/engine build`
  - Verify: `ls packages/engine/dist/bin/echomind-validate.js`
- [ ] `.env.local` configured with live gateway credentials (preferred for recording):
  ```
  ECHOMIND_LLM_BASE_URL=<ACV gateway URL>
  ECHOMIND_LLM_API_KEY=<key>
  ECHOMIND_MODEL=claude-sonnet-4-6
  ```
- [ ] Live gateway verified (CLI — do this before hitting record):
  ```bash
  source .env.local && node packages/engine/dist/bin/echomind-validate.js \
    --persona ./personas/general-manager.yaml \
    --prd ./fixtures/prds/acvmax-auctions.md
  ```
  - Expected: four sections print, GM friction finding visible, takes 5–15 sec
- [ ] If gateway unavailable, fall back to replay (see Fallbacks below) — **do not block recording on this**
- [ ] Web app running and tested before hitting record:
  ```bash
  source .env.local && pnpm --filter @echomind/web dev
  ```
  - Or replay mode: `VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev`
  - Browser tab at http://localhost:5173 already open — do not show Vite startup on camera
- [ ] Terminal window open at repo root, history cleared (`clear`)
- [ ] Screen recording software armed, mic levels checked
- [ ] Chad: web surface. Jake: CLI/skill surface.

---

## Demo Flow

### Setup Narrative (30 sec)

> "EchoMind is a persona library plus structured PRD validators. A Product Owner points a persona at a PRD and gets a structured take-away — fit, friction, questions, refinements — backed by traceable persona data. Two ways to run it: a web app for POs, and a CLI skill for anyone in the terminal. Both call the same engine."

---

### Surface 1: Web App (Chad — ~2 min)

**Start web app** (if not already running from pre-recording checklist):
```bash
source .env.local && pnpm --filter @echomind/web dev
# Fallback: VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```
Browser already open at http://localhost:5173 before recording starts.

**As the page loads, narrate:**
> "This is the EchoMind web app. The persona is pre-loaded — our General Manager hero persona. The PRD is ACV MAX Auctions: Mobile Live Bid. We click Get Feedback."

**Click Get Feedback.** The stepper will progress through four steps. Narrate while it runs:
> "You can see it working through the steps — loading persona, loading PRD, calling the validator, rendering output. This is hitting our live LLM gateway."

*(If running replay mode, instead say: "This is running against a pre-captured fixture so the response is instant — same output you'd get from a live call.")*

**When the four section cards appear, narrate:**
> "Here's the structured take-away. Fit — what this PRD gets right for a GM. Friction — where they'd push back. Questions they'd want answered. And refinements — concrete changes to make it work for them."

**Scroll to or click the Friction section. Read the punchline finding:**
> "Here's the one that caught us: 'The flow sends me into a detail card to act on each unit individually. If I've got 12 aged units that all score 7+, I'm clicking into 12 cards and hitting Schedule for Consignment 12 times. That's not saving clicks, that's adding them.'"

**Pause. Then narrate the punchline:**
> "That's the catch. The PRD proposed a badge in the inventory list — but the actual action is buried one level deeper, inside each unit's detail card. A GM with 12 aged units has to open 12 cards to consign them. The persona surfaced that the feature solves the discovery problem but creates a new workflow problem. That's exactly the kind of thing that kills adoption after launch — and EchoMind surfaced it before the PRD ever hit stakeholder review."

---

### Surface 2: CLI / Claude Code Skill (Jake — ~2 min)

**In terminal at repo root. Live gateway preferred:**
```bash
source .env.local && node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

**Fallback — replay, no gateway:**
```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

**As the output streams, narrate:**
> "Same engine, same output, but in the terminal. I pass a persona YAML path and a PRD markdown path. The engine calls the same validator and prints four sections as markdown — no web app needed."

**Highlight the Friction section — same finding as web:**
> "There it is. Same friction bullet. 'That's not saving clicks, that's adding them.' Identical finding across both surfaces because they share the same engine — same prompt, same schema, same structured output. No drift."

**Close the demo:**
> "Copy this output straight into a Confluence comment, a PRD doc, or a Slack thread. The PO walks away with a structured artifact they can defend — without scheduling a research session."

---

## "We Caught X" Finding

**Section:** Friction
**Finding (exact quote from fixture):**
> "The flow sends me into a detail card to act on each unit individually. If I've got 12 aged units that all score 7+, I'm clicking into 12 cards and hitting 'Schedule for Consignment' 12 times. That's not saving clicks, that's adding them."

**What it caught:**
The PRD surfaced an "Auction Ready" badge in the inventory list but buried the actual consignment action inside each unit's detail card. A GM with 12 aged units has to open 12 cards individually — no bulk action, no list-level sort by score. The feature solves discovery but creates a new workflow bottleneck. This is exactly the kind of adoption-killer that surfaces in a GM review but gets missed in PM-only reviews.

**Narration beat:**
> "The PRD solved the discovery problem — GMs can see which units are auction-ready. But the action is buried one level deeper. For a GM with a dozen aged units, that's 12 clicks to do one batch job. EchoMind caught it before the PRD hit stakeholder review."

---

## Recording Fallback Procedures

### If live gateway is unreachable during recording

Both surfaces have replay modes that return the pre-vetted fixture in under 2 seconds. Output is identical to a live run — viewers watching the recording will not know the difference. Swap the narration line noted above and keep rolling.

**Web fallback:**
```bash
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```

**CLI fallback:**
```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

### If web app fails to start during recording

Skip to the CLI demo. The terminal output is a complete demo — all four sections, the "we caught X" finding, proof the engine works. Record CLI only, mention web as "the browser surface we'll show in the full build."

### If both surfaces fail

Stop recording, fix the issue, restart. Do not submit a broken take. The fixture is always available as a last resort:
```bash
cat fixtures/responses/gm-auctions-snapshot.json
```

---

## Timing Reference

| Segment | Target | Notes |
|---------|--------|-------|
| Setup narrative | 30 sec | One paragraph, no clicking |
| Web app demo | ~2 min | Get Feedback click → 4 cards → punchline |
| CLI skill demo | ~2 min | Command → output → punchline |
| Wrap / close | 30 sec | Closing line, no Q&A — this is recorded |
| **Total** | **~5 min** | |

---

*Generated by EchoMind Phase 1 planning — 2026-05-05*
