---
name: echomind-validate
description: Validate a PRD against an EchoMind persona. Returns four structured sections (Fit, Friction, Questions, Refinements) grounded in the persona's goals, pain points, and review lens. Use when a Product Owner wants a persona-grounded PRD review without scheduling a research session.
---

# EchoMind Validate

Runs the EchoMind validator engine against a persona YAML and a PRD markdown file. Uses the same engine as the EchoMind web app — identical output schema.

## Usage

Run from the repo root:

```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

Arguments:
- `--persona <yaml-path>` — Path to a persona YAML file (relative to repo root)
- `--prd <md-path>` — Path to a PRD markdown file (relative to repo root)
- `--replay` — Optional. Returns cached fixture output instead of calling the gateway (instant, no network)

## Demo-Day Fixture Replay

For demo-day reliability (no live gateway dependency):

```bash
ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

Or with the --replay flag:

```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

## Output Format

Four sections as markdown:

```
# Validation: General Manager → ACV MAX Auctions PRD

## Fit

- [finding bullet]

## Friction

- [finding bullet]

## Questions

- [finding bullet]

## Refinements

- [finding bullet]
```

Rules:
- Single H1 heading: `Validation: {persona role} → {PRD title}`
- Four H2 sections in order: Fit, Friction, Questions, Refinements
- Each finding is a `-` list item (single dash)
- No bold, no italic, no nested lists

## Environment Setup

Copy `.env.local.example` to `.env.local` and set:
- `ECHOMIND_LLM_BASE_URL` — ACV gateway URL
- `ECHOMIND_LLM_API_KEY` — Gateway API key
- `ECHOMIND_MODEL` — Model (default: claude-sonnet-4-6)

Then load env before running:

```bash
source .env.local && node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

## Build

If the dist binary is missing, rebuild with:

```bash
pnpm --filter @echomind/engine build
```
