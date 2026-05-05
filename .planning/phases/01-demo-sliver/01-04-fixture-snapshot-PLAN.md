---
phase: 01-demo-sliver
plan: 04
type: execute
wave: 3
depends_on:
  - 01-03-engine-gateway
files_modified:
  - fixtures/responses/gm-auctions-snapshot.json
  - packages/engine/src/llm.ts
autonomous: false
requirements_addressed:
  - DEMO-03
  - DEMO-04

must_haves:
  truths:
    - "Running echomind-validate --replay returns the exact same four sections every time (no gateway call)"
    - "The fixture contains at least one finding that constitutes a non-obvious GM pushback on the Auctions PRD"
    - "The 'we caught X' finding is identified and documented for demo narration"
    - "FixtureClient reads fixtures/responses/gm-auctions-snapshot.json and returns a valid ValidationResult"
  artifacts:
    - path: "fixtures/responses/gm-auctions-snapshot.json"
      provides: "Snapshotted ValidationResult with all four sections populated"
      contains: "fit"
  key_links:
    - from: "packages/engine/src/llm.ts FixtureClient"
      to: "fixtures/responses/gm-auctions-snapshot.json"
      via: "readFile(this.fixturePath) returns ValidationResult"
      pattern: "gm-auctions-snapshot.json"
    - from: "CLI --replay flag"
      to: "FixtureClient"
      via: "createLlmClient(replay=true) returns FixtureClient"
      pattern: "replay"
---

<objective>
Capture the best live gateway response as a JSON fixture and verify that --replay mode returns it deterministically. This is the demo-day insurance policy.

Purpose: Once the fixture is committed, both surfaces can run `--replay` (CLI) or `VITE_REPLAY_MODE=true` (web) and never touch the live gateway during the demo. The checkpoint ensures Chad/Jake identify the "we caught X" moment in the live output before snapshotting.

Output:
- fixtures/responses/gm-auctions-snapshot.json — committed, valid ValidationResult JSON
- FixtureClient verified to read and return it correctly
- "We caught X" finding identified by Chad/Jake for demo narration
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-03-engine-gateway-SUMMARY.md

<interfaces>
<!-- ValidationResult shape the snapshot must conform to -->
```typescript
interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}
```

FixtureClient reads from: `fixtures/responses/gm-auctions-snapshot.json`
CLI replay flag: `--replay` (sets `opts.replay = true` → `createLlmClient(true)` → `FixtureClient`)
Web replay flag: `VITE_REPLAY_MODE=true` in env (Plan 05 wires this)
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Capture live output as JSON fixture and verify replay mode</name>
  <files>
    fixtures/responses/gm-auctions-snapshot.json
    packages/engine/src/llm.ts
  </files>

  <read_first>
    - packages/engine/src/llm.ts — read FixtureClient implementation; verify fixturePath default is 'fixtures/responses/gm-auctions-snapshot.json'
    - packages/engine/src/index.ts — verify validate() passes opts.replay to createLlmClient()
    - .planning/phases/01-demo-sliver/01-03-engine-gateway-SUMMARY.md — use the good live output from Plan 03 as the snapshot basis
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-08 (fixture replay design), D-13 (iterate until output is great, then snapshot)
  </read_first>

  <action>
Capture the best live ValidationResult as JSON and verify the --replay path works.

**Step 1 — Export JSON from live run:**
Add a `--json` flag to the CLI (or use a temporary env var) to output raw JSON instead of markdown. Alternatively, temporarily modify the CLI to `console.log(JSON.stringify(result, null, 2))` before the markdown render, run it, capture stdout, then revert.

The simplest approach — pipe through a quick node one-liner:
```bash
source .env.local && node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  2>/dev/null > /tmp/echomind-output.md

# Check output quality, then capture the structured result by temporarily
# adding JSON output to the CLI binary:
```

Alternatively, add `--output-format json` option to the CLI binary:

In `packages/engine/bin/echomind-validate.ts`, add:
```typescript
program
  .option('--output-format <format>', 'Output format: markdown or json', 'markdown');
```

And in main():
```typescript
const outputFormat = opts.outputFormat as string;
if (outputFormat === 'json') {
  console.log(JSON.stringify(result, null, 2));
} else {
  // existing markdown render
}
```

Run with `--output-format json` to get the ValidationResult JSON, save to `fixtures/responses/gm-auctions-snapshot.json`.

**Step 2 — Validate the JSON:**
The fixture must be valid JSON matching the ValidationResult shape. Verify:
```bash
node -e "
const r = JSON.parse(require('fs').readFileSync('./fixtures/responses/gm-auctions-snapshot.json', 'utf-8'));
const ok = Array.isArray(r.fit) && Array.isArray(r.friction) && Array.isArray(r.questions) && Array.isArray(r.refinements);
console.log(ok ? 'PASS: valid ValidationResult' : 'FAIL: missing fields', JSON.stringify(Object.keys(r)));
"
```

**Step 3 — Verify FixtureClient path:**
Read `packages/engine/src/llm.ts`. Confirm `FixtureClient` default path is `'fixtures/responses/gm-auctions-snapshot.json'` (relative to process.cwd() = repo root). If it uses `import.meta.url` or a different path, fix it:

```typescript
export class FixtureClient implements LlmClient {
  private fixturePath: string;
  constructor(fixturePath = 'fixtures/responses/gm-auctions-snapshot.json') {
    this.fixturePath = fixturePath;
  }
  async complete(_systemPrompt: string, _userMessage: string): Promise<ValidationResult> {
    const raw = await readFile(this.fixturePath, 'utf-8');
    return JSON.parse(raw) as ValidationResult;
  }
}
```

**Step 4 — Rebuild and test --replay:**
```bash
pnpm --filter @echomind/engine build
node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay
```

Output should be identical to the live run output. No gateway call should occur (test by disconnecting from VPN or setting a bogus ECHOMIND_LLM_BASE_URL — output should still appear).

**Step 5 — Test ECHOMIND_REPLAY env var path (used by web):**
```bash
ECHOMIND_REPLAY=true node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```
Should also return fixture output.
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && node -e "const r=JSON.parse(require('fs').readFileSync('./fixtures/responses/gm-auctions-snapshot.json','utf-8')); const ok=['fit','friction','questions','refinements'].every(k=>Array.isArray(r[k])&&r[k].length>0); console.log(ok?'PASS':'FAIL: empty or missing sections', JSON.stringify({fit:r.fit.length,friction:r.friction.length,questions:r.questions.length,refinements:r.refinements.length}))"</automated>
  </verify>

  <acceptance_criteria>
    - fixtures/responses/gm-auctions-snapshot.json exists and is valid JSON
    - JSON contains keys: "fit", "friction", "questions", "refinements" — all arrays
    - Each array has at least 2 items (non-empty sections)
    - Running `node packages/engine/dist/bin/echomind-validate.js --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md --replay` exits 0 and prints all four ## sections
    - Running with `ECHOMIND_REPLAY=true` (no --replay flag) also returns fixture output
    - The fixture JSON can be parsed without errors by the node one-liner above
  </acceptance_criteria>

  <done>Fixture snapshot committed. --replay and ECHOMIND_REPLAY=true both return deterministic output. Demo-day gateway dependency eliminated.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 2: Identify "we caught X" finding and approve fixture for demo</name>

  <what-built>
    fixtures/responses/gm-auctions-snapshot.json contains the captured ValidationResult from the live gateway run. The --replay CLI flag returns this deterministically.
  </what-built>

  <how-to-verify>
    1. Run the replay to read the full output:
       ```bash
       cd /Users/cdunbar/Repos/echomind && node packages/engine/dist/bin/echomind-validate.js \
         --persona ./personas/general-manager.yaml \
         --prd ./fixtures/prds/acvmax-auctions.md \
         --replay
       ```

    2. Read all four sections. Look for the "we caught X" moment:
       - Did the GM call out the disposition score hiding retail/wholesale split?
       - Did the GM notice the multi-click workflow (can't see recommendations in list view)?
       - Did the GM push back on "reduce time-to-disposition" having no baseline?

    3. Pick the single most compelling, non-obvious finding — the one you'd narrate as the punch line in the demo.

    4. If the output is generic or doesn't surface any of the designed flaws: DO NOT approve. Instead, type "rerun: [what to adjust]". Options:
       - "rerun: refine PRD to make the flaw more explicit" (edit acvmax-auctions.md, re-run Plan 03)
       - "rerun: adjust system prompt in prompts/persona-system-prompt.md and re-run Plan 03"
       - "rerun: try Opus model by setting ECHOMIND_MODEL=claude-opus-4-7 in .env.local and re-run Plan 03"

    5. If the output IS compelling: type "approved: [quote the we-caught-X finding]" — this text will be included verbatim in DEMO.md.
  </how-to-verify>

  <resume-signal>
    "approved: [quote the specific finding that is the demo punch line]"
    OR
    "rerun: [what to change]"
  </resume-signal>
</task>

</tasks>

<verification>
```bash
# Replay returns all four sections
node /Users/cdunbar/Repos/echomind/packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  --replay 2>/dev/null | grep "^##" | wc -l
# Expected: 4

# Fixture JSON is valid
node -e "const r=require('./fixtures/responses/gm-auctions-snapshot.json'); console.log('sections:', Object.keys(r).join(', '))"
```
</verification>

<success_criteria>
- fixtures/responses/gm-auctions-snapshot.json committed with non-empty arrays in all four sections
- --replay mode works without gateway access
- ECHOMIND_REPLAY=true env var also triggers fixture replay
- Chad/Jake have identified and quoted the "we caught X" finding (checkpoint passed)
- Demo-day reliability established: surfaces can run entirely on fixture
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-04-fixture-snapshot-SUMMARY.md`. Include: the "we caught X" finding quote (from checkpoint approval text), section counts in the fixture (e.g., "Friction: 4 bullets"), and confirmation that both --replay paths work.
</output>
