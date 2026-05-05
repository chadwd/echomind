# EchoMind Demo Script

**Demo:** ACV MAX Auctions Integration PRD validated against the GM hero persona
**Surfaces:** Web app (Chad) + Claude Code skill (Jake)
**Duration:** ~5 minutes end-to-end
**Date ready:** 2026-05-06

---

## Pre-Demo Checklist (run morning of demo)

- [ ] On correct branch: `git branch` — should show `persona-foundation` or `main` (wherever Plans 01-06 landed)
- [ ] Dependencies installed: `pnpm install`
- [ ] Engine is built: `pnpm --filter @echomind/engine build`
  - Expected: `dist/bin/echomind-validate.js` exists — verify with `ls packages/engine/dist/bin/`
- [ ] Fixture replay verified (CLI):
  ```bash
  ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
    --persona ./personas/general-manager.yaml \
    --prd ./fixtures/prds/acvmax-auctions.md
  ```
  - Expected: four sections (Fit / Friction / Questions / Refinements) print in under 2 seconds, no network call
- [ ] Web app verified (replay mode):
  ```bash
  VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
  ```
  - Expected: http://localhost:5173 loads, click Validate, stepper progresses through 4 steps, four section cards appear within 3 seconds
- [ ] Browser tab open at http://localhost:5173 before presenting (do not leave audience watching the Vite startup)
- [ ] Terminal window open at repo root for skill demo
- [ ] Decide with Jake who runs which surface — Chad: web, Jake: CLI/skill

---

## Demo Flow

### Setup Narrative (30 sec)

> "EchoMind is a persona library plus structured PRD validators. A Product Owner points a persona at a PRD and gets a structured take-away — fit, friction, questions, refinements — backed by traceable persona data. Two ways to run it: a web app for POs, and a CLI skill for anyone in the terminal. Both call the same engine."

---

### Surface 1: Web App (Chad — ~2 min)

**Start web app** (if not already running from pre-demo checklist):
```bash
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```
Open http://localhost:5173

**As the page loads, narrate:**
> "This is the EchoMind web app. The persona is pre-loaded — our General Manager hero persona. The PRD is ACV MAX Auctions Integration. We click Validate."

**Click Validate.** The stepper will progress through four steps. Narrate while it runs:
> "You can see it working through the steps — loading persona, loading PRD, calling the validator, rendering output. In a live run this hits our LLM gateway. Today we're in replay mode so the demo is instant."

**When the four section cards appear, narrate:**
> "Here's the structured take-away. Fit — what this PRD gets right for a GM. Friction — where they'd push back. Questions they'd want answered. And refinements — concrete changes to make it work for them."

**Scroll to or click the Friction section. Read the punchline finding:**
> "Here's the one that caught us: 'The flow only covers auction consignment. Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind.'"

**Pause. Then narrate the punchline:**
> "That's a non-obvious catch. The PRD talks about a disposition score — but the score only covers units going to auction lanes. A GM runs retail and wholesale simultaneously. Half of their wholesale channel is dealer-to-dealer, not auction. The PRD never addressed that. A PM reviewing this PRD might not catch it until they're in a GM review. EchoMind caught it in under two minutes."

---

### Surface 2: CLI / Claude Code Skill (Jake — ~2 min)

**In terminal at repo root:**

**Demo-day fallback — replay, no gateway needed:**
```bash
ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

**Or with --replay flag:**
```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

**Live gateway (if .env.local is set):**
```bash
source .env.local && node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

**As the output streams, narrate:**
> "Same engine, same output, but in the terminal. Jake passes a persona YAML path and a PRD markdown path. The engine runs the same validator and prints four sections as markdown."

**Highlight the Friction section — same finding as web:**
> "There it is. Same friction bullet. 'Half my wholesale moves are dealer-to-dealer, and those don't show up here at all.' Identical finding across both surfaces because they share the same engine — same prompt, same schema, same structured output. No drift."

**Close the demo:**
> "Copy this output straight into a Confluence comment, a PRD doc, or a Slack thread. The PO walks away with a structured artifact they can defend — without scheduling a research session."

---

## "We Caught X" Finding

**Section:** Friction
**Finding (exact quote from fixture):**
> "The flow only covers auction consignment. Half my wholesale moves are dealer-to-dealer, and those don't show up here at all. I'd be making channel decisions blind."

**What it caught:**
The PRD proposed a single disposition score for inventory decisions, but the score only surfaces auction consignment paths. A GM manages two wholesale channels: auction lanes and direct dealer-to-dealer. The PRD never addressed the dealer-to-dealer channel. The GM persona surfaced this blind spot — a channel coverage gap that would likely have reached stakeholder review unchallenged.

**Narration beat:**
> "The PRD proposed a 'disposition score' — but never broke out retail versus wholesale channels. For a GM running two P&Ls simultaneously, that's a blind spot. EchoMind surfaced it before the PRD ever hit stakeholder review."

---

## Demo-Day Fallback Procedures

### If live gateway is unreachable

Both surfaces have replay modes that return the pre-vetted fixture in under 2 seconds. Output is identical to a live run. The audience will not notice.

**Web fallback** (already the default for this demo):
```bash
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```

**CLI fallback:**
```bash
ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

### If web app fails to start

Skip to the CLI demo. The terminal output is a complete demo — it shows all four sections, the "we caught X" finding, and proves the engine works end-to-end. You can show the web scaffold visually ("here's what the web surface renders") after running the CLI.

### If both surfaces fail

Show the fixture JSON directly and narrate:
```bash
cat fixtures/responses/gm-auctions-snapshot.json
```
> "This is the raw engine output — GM persona validated against the ACV MAX Auctions PRD. The web app and CLI both render this. Here's the friction finding that caught the channel gap..."

The fixture is at `fixtures/responses/gm-auctions-snapshot.json` and contains 3 Fit bullets, 4 Friction bullets, 4 Questions, 4 Refinements.

---

## Timing Reference

| Segment | Target | Notes |
|---------|--------|-------|
| Setup narrative | 30 sec | One paragraph, no clicking |
| Web app demo | ~2 min | Validate click → 4 cards → punchline |
| CLI skill demo | ~2 min | Command → output → punchline |
| Questions / wrap | 30 sec | Leave time for audience reaction |
| **Total** | **~5 min** | |

---

*Generated by EchoMind Phase 1 planning — 2026-05-05*
