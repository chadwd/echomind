---
phase: 01-demo-sliver
plan: 07
type: execute
wave: 5
depends_on:
  - 01-05-web-app
  - 01-06-skill
files_modified:
  - DEMO.md
autonomous: false
requirements_addressed:
  - DEMO-04

must_haves:
  truths:
    - "Chad and Jake can run the full web demo from DEMO.md without improvisation"
    - "Chad and Jake can run the full skill demo from DEMO.md without improvisation"
    - "The 'we caught X' finding is named, quoted, and placed in the narration script"
    - "Both demo-day fallback commands (replay modes) are documented and verified"
    - "The runbook includes a pre-demo checklist Chad/Jake run the morning of the demo"
  artifacts:
    - path: "DEMO.md"
      provides: "Complete demo script: setup, web surface demo, skill surface demo, narration beats, fallback commands"
      contains: "we caught"
  key_links:
    - from: "DEMO.md web demo section"
      to: "pnpm --filter @echomind/web dev"
      via: "exact command in DEMO.md"
      pattern: "VITE_REPLAY_MODE"
    - from: "DEMO.md skill demo section"
      to: "echomind-validate --replay"
      via: "exact command in DEMO.md"
      pattern: "ECHOMIND_REPLAY"
---

<objective>
Write DEMO.md and run a full dress rehearsal of both surfaces. The checkpoint verifies Chad/Jake can execute the demo from the script without improvising.

Purpose: DEMO-04 is not complete until Chad and Jake have run the demo end-to-end from the script and confirmed it works. This plan produces DEMO.md and gates on a successful rehearsal.

Output:
- DEMO.md at repo root — complete demo script with setup, two surface demos, narration beats, fallback commands, pre-demo checklist
- Dress rehearsal completed and signed off by Chad/Jake
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-04-fixture-snapshot-SUMMARY.md
@.planning/phases/01-demo-sliver/01-05-web-app-SUMMARY.md
@.planning/phases/01-demo-sliver/01-06-skill-SUMMARY.md

<interfaces>
<!-- Web demo commands (from RESEARCH.md §Demo Runbook) -->
```bash
# Primary (live gateway)
cd /Users/cdunbar/Repos/echomind
pnpm --filter @echomind/web dev
# opens http://localhost:5173

# Demo-day fallback (fixture replay)
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```

<!-- Skill demo commands -->
```bash
# Primary (live gateway)
source .env.local && pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md

# Demo-day fallback (fixture replay)
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

<!-- "We caught X" finding — read from Plan 04 SUMMARY (the approved finding quote) -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write DEMO.md and run dress rehearsal</name>
  <files>
    DEMO.md
  </files>

  <read_first>
    - .planning/phases/01-demo-sliver/01-04-fixture-snapshot-SUMMARY.md — the approved "we caught X" finding quote (from checkpoint approval text)
    - .planning/phases/01-demo-sliver/01-05-web-app-SUMMARY.md — confirm web dev command and port
    - .planning/phases/01-demo-sliver/01-06-skill-SUMMARY.md — confirm CLI commands and output format
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Demo Runbook (command templates)
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-08 (fixture replay strategy), D-13 ("we caught X" insurance), D-16 (demo flow narration beat)
  </read_first>

  <action>
Write DEMO.md and execute a complete dress rehearsal of both surfaces.

**DEMO.md structure:**

```markdown
# EchoMind Demo Script

**Demo:** ACV MAX Auctions Integration PRD validated against the GM hero persona
**Surfaces:** Web app (Chad) + Claude Code skill (Jake)
**Duration:** ~5 minutes end-to-end
**Date ready:** 2026-05-06

----

## Pre-Demo Checklist (run morning of demo)

- [ ] Repo is on `main` branch: `git status`
- [ ] pnpm deps installed: `pnpm install`
- [ ] Engine is built: `pnpm --filter @echomind/engine build`
- [ ] .env.local exists with ECHOMIND_LLM_BASE_URL and ECHOMIND_LLM_API_KEY set
- [ ] Fixture replay verified: `ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md`
  - Expected: four sections print in < 2 seconds, no network call
- [ ] Web app verified: `VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev`
  - Expected: http://localhost:5173 loads, click Validate, four section cards appear within 3 seconds
- [ ] Browser tab open and ready on http://localhost:5173 before presenting
- [ ] Terminal window open at repo root for skill demo

----

## Demo Flow

### Setup narrative (30 sec)

> "EchoMind is a persona library plus structured PRD validators. A Product Owner points a persona at a PRD and gets a structured take-away — fit, friction, questions, refinements — backed by traceable persona data. Two ways to run it: a web app for POs, and a Claude Code skill for anyone in the terminal. Both call the same engine."

----

### Surface 1: Web App (Chad — ~2 min)

**Start web app** (if not already running):
```bash
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```
Open http://localhost:5173

**Narrate as you demo:**
> "This is the EchoMind web app. The persona is pre-loaded — our General Manager hero. The PRD is ACV MAX Auctions Integration. We click Validate."

**Click Validate.** Watch the stepper progress. Say:
> "You can see it's working through the steps — loading persona, loading PRD, calling the validator, rendering. In a real run this is live against our LLM gateway."

**When four section cards appear:**
> "Here's the structured take-away. Fit — what this PRD gets right for a GM. Friction — where they'd push back. Questions they'd ask before buying in. And refinements — concrete changes."

**Navigate to the Friction section. Read the "we caught X" finding:**
> "[Quote the we-caught-X finding from fixtures/responses/gm-auctions-snapshot.json]"

**Narrate the punch line:**
> "That's a non-obvious catch. The PRD talked about a disposition score — but never broke it out by retail versus wholesale. A GM runs two businesses: retail and wholesale. Conflating them is exactly the kind of thing a PM wouldn't catch until a GM review. EchoMind caught it in under two minutes."

----

### Surface 2: Claude Code Skill (Jake — ~2 min)

In terminal at repo root:

**Primary (live gateway):**
```bash
source .env.local && pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

**Demo-day fallback (no gateway):**
```bash
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

**Or invoke as Claude Code skill** (if in Claude Code context):
```bash
/echomind:validate
```

**Narrate:**
> "Same engine, same output, but in the terminal. Jake pastes a PRD markdown path and a persona YAML path. The skill runs the validator and prints the four sections as markdown. Copy-pastes straight into a Confluence comment or a PRD doc."

**Highlight the Friction section — same finding as web.**
> "Identical finding across both surfaces. That's because they share the same engine — same prompt, same schema, same structured output. No drift."

----

## Demo-Day Fallback Procedures

If **live gateway is unreachable** during demo:

Web:
```bash
VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```

CLI/skill:
```bash
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

Both fallbacks return the pre-vetted fixture in under 2 seconds. Output is identical to the live run. Audience will not notice the difference.

----

## "We Caught X" Finding

**Section:** Friction
**Finding:** [PASTE THE EXACT FINDING FROM CHECKPOINT APPROVAL HERE]
**Narration:** "The PRD proposed a single 'disposition score' — but never broke it out by retail versus wholesale. For a GM running two separate P&Ls, that's a blind spot. EchoMind surfaced it before the PRD ever hit stakeholder review."

----

## Contingency: If Web App Has Issues

Skip the web app. Lead with the skill demo. The terminal output is a complete demo — it shows the same four sections, the same "we caught X" finding, and proves the engine works. Then show the web scaffold as "here's what the web surface looks like."

----

## Contingency: If Both Surfaces Have Issues

Show the fixture JSON directly:
```bash
cat fixtures/responses/gm-auctions-snapshot.json | python3 -m json.tool
```
And narrate: "This is the engine output — validated against the GM persona. The surfaces render this. Here's the friction finding..."

----
*Generated by EchoMind Phase 1 planning — 2026-05-05*
```

After writing DEMO.md, run the dress rehearsal:

**Dress rehearsal steps:**

1. Open a fresh terminal at repo root
2. Run the pre-demo checklist top to bottom — verify each checkbox
3. Run the web surface demo commands exactly as written in DEMO.md
4. Run the CLI skill demo commands exactly as written in DEMO.md
5. Confirm both produce the four sections including the "we caught X" finding
6. Confirm fixture replay mode works for both surfaces (disconnect from VPN to simulate gateway failure, run fallback commands, confirm output)
7. Note any command that failed or needed adjustment — fix DEMO.md

Fill in the "We Caught X" Finding section with the exact quote from the Plan 04 checkpoint approval.
  </action>

  <verify>
    <automated>grep -c "VITE_REPLAY_MODE\|ECHOMIND_REPLAY\|we caught\|Pre-Demo Checklist" /Users/cdunbar/Repos/echomind/DEMO.md 2>/dev/null</automated>
  </verify>

  <acceptance_criteria>
    - DEMO.md exists at repo root
    - DEMO.md contains "Pre-Demo Checklist" section with at least 5 checklist items
    - DEMO.md contains the web surface demo with `VITE_REPLAY_MODE=true` fallback command
    - DEMO.md contains the CLI skill demo with `ECHOMIND_REPLAY=true` fallback command
    - DEMO.md contains the "We Caught X" section with the exact finding quote (not a placeholder)
    - DEMO.md contains narration text for each surface (not just commands)
    - All bash commands in DEMO.md use paths relative to repo root (no absolute paths)
    - grep for "VITE_REPLAY_MODE" in DEMO.md returns at least 1 match
    - grep for "ECHOMIND_REPLAY" in DEMO.md returns at least 1 match
  </acceptance_criteria>

  <done>DEMO.md written. "We caught X" finding quoted. All commands documented. Dress rehearsal commands ready for checkpoint.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Dress rehearsal — both surfaces end-to-end from DEMO.md</name>

  <what-built>
    DEMO.md is complete with pre-demo checklist, web surface demo script, skill demo script, narration beats, fallback commands, and the "we caught X" finding.
  </what-built>

  <how-to-verify>
    Run the full dress rehearsal from DEMO.md:

    1. **Pre-demo checklist:** Run each item in the checklist. All should pass.

    2. **Web surface demo:**
       ```bash
       VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
       ```
       Open http://localhost:5173. Click Validate. Confirm:
       - Stepper progresses through 4 steps
       - Four section cards appear with findings
       - The "we caught X" finding is visible in the Friction section

    3. **Skill surface demo:**
       ```bash
       ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
         --persona ./personas/general-manager.yaml \
         --prd ./fixtures/prds/acvmax-auctions.md
       ```
       Confirm: four sections print in terminal, same "we caught X" finding appears.

    4. **Narration check:** Read the narration beats in DEMO.md. Does the story make sense? Is the punch line clear?

    5. **Fallback check:** Confirm both replay commands work (they should — you just ran them).

    6. **Timing:** Rough timing — is the web demo completable in ~2 minutes? Skill demo ~2 minutes?

    Type "approved" if the dress rehearsal passed and DEMO.md is correct.
    Type "fix: [what to change]" if something needs adjustment.
  </how-to-verify>

  <resume-signal>
    "approved" — demo is ready, both surfaces work, script is correct
    OR
    "fix: [specific issue]"
  </resume-signal>
</task>

</tasks>

<verification>
```bash
# DEMO.md exists and has key sections
grep -n "^## " /Users/cdunbar/Repos/echomind/DEMO.md

# Replay commands present
grep -c "VITE_REPLAY_MODE\|ECHOMIND_REPLAY" /Users/cdunbar/Repos/echomind/DEMO.md

# No absolute paths (should be repo-relative)
grep "\/Users\/" /Users/cdunbar/Repos/echomind/DEMO.md && echo "WARN: absolute paths in DEMO.md" || echo "PASS: no absolute paths"
```
</verification>

<success_criteria>
- DEMO.md committed at repo root
- Pre-demo checklist covers: git status, pnpm install, engine build, .env.local, fixture replay verified, web replay verified
- Web demo script: exact commands that work, narration text, "we caught X" punch line
- Skill demo script: exact commands that work, narration text
- Both replay fallbacks documented and verified functional
- Chad and Jake have run the dress rehearsal and approved (checkpoint passed)
- Phase 1 complete: both surfaces demo-ready, "we caught X" finding identified and scripted
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-07-demo-runbook-SUMMARY.md`. Include: dress rehearsal result (pass/any fixes), timing for each surface demo, the "we caught X" finding quote, and confirmation of phase completion.
</output>
