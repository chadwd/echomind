---
phase: 01-demo-sliver
plan: 06
type: execute
wave: 4
depends_on:
  - 01-04-fixture-snapshot
files_modified:
  - .claude/skills/echomind-validate/SKILL.md
  - apps/skill/README.md
autonomous: true
requirements_addressed:
  - SKIL-01
  - SKIL-02
  - SKIL-03
  - SKIL-04
  - DEMO-02

must_haves:
  truths:
    - "The .claude/skills/echomind-validate/SKILL.md file exists and Claude Code can invoke it"
    - "Running the CLI command in the SKILL.md produces four markdown sections in terminal"
    - "The --persona and --prd arguments are documented in SKILL.md (SKIL-02)"
    - "ECHOMIND_REPLAY=true skips the gateway and returns fixture output (demo-day safety)"
    - "The CLI output heading format matches UI-SPEC: '# Validation: General Manager → ACV MAX Auctions PRD'"
    - "Per-finding persona-field provenance display is deferred to Phase 2 (VALD-03). Phase 1 satisfies the 4-section terminal rendering portion of SKIL-04; provenance markup is intentionally absent."
  artifacts:
    - path: ".claude/skills/echomind-validate/SKILL.md"
      provides: "Claude Code skill entry point — name, description, usage bash commands, output contract"
      contains: "echomind-validate"
    - path: "apps/skill/README.md"
      provides: "Skill developer notes (not the Claude Code entry point)"
  key_links:
    - from: ".claude/skills/echomind-validate/SKILL.md"
      to: "packages/engine dist/bin/echomind-validate.js"
      via: "pnpm --filter @echomind/engine exec echomind-validate"
      pattern: "echomind-validate"
    - from: "CLI stdout"
      to: "UI-SPEC.md §Skill Surface markdown contract"
      via: "H1 + four H2 sections, dash bullets"
      pattern: "^## (Fit|Friction|Questions|Refinements)"
---

<objective>
Create the Claude Code skill entry point and verify the CLI skill invocation produces correct markdown output. The skill is the terminal-surface demo — same engine, same output schema, different rendering.

Purpose: SKIL-01 through SKIL-04 require a working /echomind:validate skill. This plan creates .claude/skills/echomind-validate/SKILL.md and verifies the CLI command documented in it works end-to-end.

Note: Plans 05 and 06 run in parallel (both depend only on Plan 04). Web and skill don't share files.

Output:
- .claude/skills/echomind-validate/SKILL.md — Claude Code skill definition
- Verified CLI commands that produce the four markdown sections
- apps/skill/README.md — developer notes on the skill structure
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-UI-SPEC.md
@.planning/phases/01-demo-sliver/01-04-fixture-snapshot-SUMMARY.md

<interfaces>
<!-- CLI binary interface (from Plan 01/03) -->
```bash
# Standard usage
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md

# Fixture replay (no gateway)
ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md

# Via pnpm (preferred in skill — uses workspace package)
pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

<!-- Expected stdout format (UI-SPEC §Skill Surface) -->
```markdown
# Validation: General Manager → ACV MAX Auctions PRD

## Fit

- [finding]

## Friction

- [finding]

## Questions

- [finding]

## Refinements

- [finding]
```

Rules: single H1, four H2 sections in order, dash bullets only, no bold/italic, blank lines between sections.

<!-- SKILL.md frontmatter requirements (from RESEARCH.md §Claude Code Skill Format) -->
name: echomind-validate
description: must explain when to use the skill (persona-grounded PRD review)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create .claude/skills/echomind-validate/SKILL.md and verify CLI output</name>
  <files>
    .claude/skills/echomind-validate/SKILL.md
    apps/skill/README.md
  </files>

  <read_first>
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §Claude Code Skill Format (exact SKILL.md template)
    - .planning/phases/01-demo-sliver/01-UI-SPEC.md — §Skill Surface — Markdown Contract (D-17), §Copywriting Contract (skill H1 and section headers)
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-02 (CLI binary handoff), D-17 (skill output rendering)
    - packages/engine/bin/echomind-validate.ts — verify --persona, --prd, --replay flags exist
  </read_first>

  <action>
Create the skill directory and SKILL.md file. Then verify the CLI commands documented in SKILL.md produce correct output.

**Step 1 — Create directory:**
```bash
mkdir -p .claude/skills/echomind-validate
mkdir -p apps/skill
```

**Step 2 — Create .claude/skills/echomind-validate/SKILL.md:**

```markdown
[FRONTMATTER_START]
name: echomind-validate
description: Validate a PRD against an EchoMind persona. Returns four structured sections (Fit, Friction, Questions, Refinements) grounded in the persona's goals, pain points, and review lens. Use when a Product Owner wants a persona-grounded PRD review without scheduling a research session.
[FRONTMATTER_END]

# EchoMind Validate

Runs the EchoMind validator engine against a persona YAML and a PRD markdown file. Uses the same engine as the EchoMind web app — identical output schema.

## Usage

Run from the repo root:

```bash
pnpm --filter @echomind/engine exec echomind-validate \
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
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

Or with the --replay flag:

```bash
pnpm --filter @echomind/engine exec echomind-validate \
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
source .env.local && pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```
```

**Step 3 — Create apps/skill/README.md** (developer notes, not the Claude Code entry point):

```markdown
# apps/skill — EchoMind Claude Code Skill

The Claude Code skill entry point lives at `.claude/skills/echomind-validate/SKILL.md` (repo root).
This directory (`apps/skill/`) is reserved for future skill assets that need workspace tooling.

## Phase 1

Phase 1 skill = a thin markdown wrapper that invokes the engine CLI binary.
No compiled code in this directory for Phase 1.

## Claude Code invocation

Claude Code picks up skills from `.claude/skills/` at the repo root.
The skill name is `echomind-validate` — invoke as `/echomind:validate` in Claude Code.

## Engine CLI commands

See `.claude/skills/echomind-validate/SKILL.md` for full usage.
```

**Step 4 — Verify CLI output format:**

Build the engine (should already be built from Plan 03):
```bash
pnpm --filter @echomind/engine build
```

Run replay to verify output format without gateway:
```bash
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

Check output against UI-SPEC markdown contract:
- Line 1: `# Validation: General Manager → ACV MAX Auctions PRD`
- Then `## Fit`, `## Friction`, `## Questions`, `## Refinements` with bullet items
- No `*` bullets (must be `-`)
- No trailing whitespace

If the CLI binary doesn't produce `→` in the H1 (might output `->` or a different format), fix `packages/engine/bin/echomind-validate.ts`:
```typescript
console.log(`# Validation: ${persona.role} → ACV MAX Auctions PRD\n`);
// The → character (U+2192) must match UI-SPEC exactly
```

After verifying, run with pnpm exec form to confirm that works too:
```bash
pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && node packages/engine/dist/bin/echomind-validate.js --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md --replay 2>/dev/null | grep -E "^# Validation|^## (Fit|Friction|Questions|Refinements)" | wc -l</automated>
  </verify>

  <acceptance_criteria>
    - .claude/skills/echomind-validate/SKILL.md exists
    - SKILL.md frontmatter contains `name: echomind-validate`
    - SKILL.md frontmatter contains `description:` with text explaining when to use the skill
    - SKILL.md contains a bash code block with `--persona` and `--prd` arguments documented (SKIL-02)
    - SKILL.md contains a demo-day replay section with `ECHOMIND_REPLAY=true` command
    - CLI output with --replay produces a line matching `^# Validation: General Manager → ACV MAX Auctions PRD`
    - CLI output with --replay produces all four `## ` H2 section headers (grep count = 5 lines: 1 H1 + 4 H2)
    - CLI output uses `-` dash bullets, not `*` asterisk bullets
    - apps/skill/README.md exists
  </acceptance_criteria>

  <done>Skill SKILL.md created. Claude Code can invoke /echomind:validate. CLI produces UI-SPEC-compliant markdown with four sections. Replay mode documented and verified.</done>
</task>

</tasks>

<verification>
```bash
# SKILL.md exists with correct frontmatter
grep "name: echomind-validate" /Users/cdunbar/Repos/echomind/.claude/skills/echomind-validate/SKILL.md && echo "PASS" || echo "FAIL"

# CLI replay output has correct structure
node /Users/cdunbar/Repos/echomind/packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay 2>/dev/null | head -20

# Check for → character in H1 (not ->)
node /Users/cdunbar/Repos/echomind/packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay 2>/dev/null | grep "^# Validation" | grep "→" && echo "PASS: arrow char correct" || echo "FAIL: check arrow character"

# No asterisk bullets
node /Users/cdunbar/Repos/echomind/packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay 2>/dev/null | grep "^\*" && echo "FAIL: asterisk bullets found" || echo "PASS: no asterisk bullets"
```
</verification>

<success_criteria>
- .claude/skills/echomind-validate/SKILL.md committed with correct frontmatter
- /echomind:validate skill invocable in Claude Code (SKIL-01)
- --persona and --prd arguments work (SKIL-02)
- Same engine as web app — ValidationResult schema identical (SKIL-03)
- Four sections render in terminal as markdown (SKIL-04)
- Replay mode documented and functional for demo-day (DEMO-02)
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-06-skill-SUMMARY.md`. Include: SKILL.md frontmatter confirmation, sample CLI output (first bullet from each section), pnpm exec form verified yes/no, and any arrow character or bullet format fixes applied.
</output>
