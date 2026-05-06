---
phase: 01-demo-sliver
plan: 03
type: execute
wave: 2
depends_on:
  - 01-01-monorepo-scaffold
  - 01-02-demo-fixtures
files_modified:
  - packages/engine/src/index.ts
  - packages/engine/src/llm.ts
  - packages/engine/src/prompt.ts
  - packages/engine/src/tool.ts
  - packages/engine/bin/echomind-validate.ts
  - .env.local.example
autonomous: true
requirements_addressed:
  - VALD-01
  - VALD-02
  - LLM-01
  - LLM-02
  - SKIL-02

must_haves:
  truths:
    - "Running echomind-validate --persona ... --prd ... against the ACV gateway returns a ValidationResult with all four sections populated"
    - "Model defaults to claude-sonnet-4-6 and is overridable via ECHOMIND_MODEL"
    - "All LLM calls route through ECHOMIND_LLM_BASE_URL — no raw anthropic.com traffic"
    - "The system prompt rendered to Claude contains the GM persona fields (role, goals, pain_points, etc.) substituted from general-manager.yaml"
    - "The tool-use response is parsed into a ValidationResult with fit/friction/questions/refinements arrays"
  artifacts:
    - path: "packages/engine/src/llm.ts"
      provides: "GatewayClient making real Anthropic tool-use calls via gateway baseURL"
      contains: "ECHOMIND_LLM_BASE_URL"
    - path: "packages/engine/src/prompt.ts"
      provides: "buildSystemPrompt rendering persona-system-prompt.md template"
      exports: ["buildSystemPrompt", "buildUserMessage"]
    - path: ".env.local.example"
      provides: "Template for required env vars (never committed with real values)"
      contains: "ECHOMIND_LLM_BASE_URL"
  key_links:
    - from: "packages/engine/bin/echomind-validate.ts"
      to: "packages/engine/src/index.ts validate()"
      via: "CLI calls validate(persona, prd, opts)"
      pattern: "validate\\("
    - from: "packages/engine/src/llm.ts GatewayClient"
      to: "@anthropic-ai/sdk Anthropic({ baseURL })"
      via: "baseURL from ECHOMIND_LLM_BASE_URL env var"
      pattern: "baseURL"
    - from: "packages/engine/src/index.ts"
      to: "prompts/persona-system-prompt.md"
      via: "readFile at runtime for template, then buildSystemPrompt()"
      pattern: "persona-system-prompt.md"
---

<objective>
Wire the engine end-to-end: verify the real gateway call path works, add .env.local.example, and confirm the CLI binary produces valid markdown output against the demo PRD and GM persona.

Purpose: This is the Day 1 critical milestone. Once this plan passes, we have proof that the engine works. Both surfaces (web + skill) are built on top of this working engine in Plans 05 and 06. If this plan reveals problems with the gateway wire format, we find out before wiring surfaces.

Output:
- A live gateway call succeeds: `echomind-validate --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md` returns four populated sections
- .env.local.example committed with all required env vars documented
- Engine source corrections if Plan 01 scaffolding needs adjustment after real testing
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/phases/01-demo-sliver/01-CONTEXT.md
@.planning/phases/01-demo-sliver/01-RESEARCH.md
@.planning/phases/01-demo-sliver/01-01-monorepo-scaffold-SUMMARY.md

<interfaces>
<!-- Files the executor MUST reference — these are the contracts from Plan 01 -->

packages/engine/src/types.ts exports: ValidationResult, PersonaYaml, ValidateOptions
packages/engine/src/index.ts exports: validate(persona, prd, opts?), loadPersona()
packages/engine/src/llm.ts contains: GatewayClient, FixtureClient, createLlmClient(replay)
packages/engine/src/prompt.ts contains: buildSystemPrompt(persona, template), buildUserMessage(prd)
packages/engine/src/tool.ts contains: submitValidationTool, parseToolResult(input)

Tool-use wire format (send to gateway):
```typescript
// In GatewayClient.complete():
const response = await this.client.messages.create({
  model: this.model,                    // claude-sonnet-4-6
  max_tokens: 4096,
  system: systemPrompt,                 // rendered from persona-system-prompt.md
  messages: [{ role: 'user', content: userMessage }],
  tools: [submitValidationTool],
  tool_choice: { type: 'tool', name: 'submit_validation' },
});
// Parse: response.content.find(b => b.type === 'tool_use').input
```

Env vars required for live run:
```
ECHOMIND_LLM_BASE_URL=https://acv-gateway.example.com/v1   # real gateway URL
ECHOMIND_LLM_API_KEY=<gateway key>
ECHOMIND_MODEL=claude-sonnet-4-6
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Smoke-test engine end-to-end, fix any issues, add .env.local.example</name>
  <files>
    packages/engine/src/index.ts
    packages/engine/src/llm.ts
    packages/engine/src/prompt.ts
    packages/engine/src/tool.ts
    packages/engine/bin/echomind-validate.ts
    .env.local.example
  </files>

  <read_first>
    - packages/engine/src/index.ts — read current state before any edits
    - packages/engine/src/llm.ts — read current state before any edits
    - packages/engine/src/prompt.ts — read current state before any edits
    - packages/engine/src/tool.ts — read current state before any edits
    - packages/engine/bin/echomind-validate.ts — read current state before any edits
    - prompts/persona-system-prompt.md — verify template tokens match buildSystemPrompt() replacements
    - personas/general-manager.yaml — verify all fields present that buildSystemPrompt() references
    - .planning/phases/01-demo-sliver/01-RESEARCH.md — §ACV LLM Gateway Integration, §Prompt Construction
    - .planning/phases/01-demo-sliver/01-CONTEXT.md — D-05, D-06, D-07, D-09
  </read_first>

  <action>
Build the engine and run the CLI binary against the real gateway. Fix any issues discovered. Then commit .env.local.example.

**Step 1 — Build:**
```bash
pnpm --filter @echomind/engine build
```

**Step 2 — Verify .env.local exists** (Chad should have created this before execution):
```bash
cat .env.local
```
Required vars: ECHOMIND_LLM_BASE_URL, ECHOMIND_LLM_API_KEY, ECHOMIND_MODEL (can be omitted — defaults to claude-sonnet-4-6).

**Step 3 — Run live validation:**
```bash
source .env.local && node packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

Expected output format (from UI-SPEC.md §Skill Surface):
```
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

**Step 4 — Diagnose and fix any errors.** Common issues to check:

A. **import.meta.url path to persona-system-prompt.md** — the compiled dist/ file resolves `../../prompts/persona-system-prompt.md` relative to `packages/engine/dist/`. This resolves to `packages/prompts/persona-system-prompt.md` which doesn't exist. Fix: use `process.cwd()` or an absolute path from repo root instead:

```typescript
// In packages/engine/src/index.ts, replace the templatePath line:
const templatePath = join(process.cwd(), 'prompts/persona-system-prompt.md');
// Add: import { join } from 'path';
```

B. **Tool-use response parsing** — if `response.content[0].type` is not `tool_use`, log the full response and check if gateway requires different `tool_choice` syntax.

C. **Anthropic SDK tool type mismatch** — if TypeScript complains about `submitValidationTool` shape, cast it:
```typescript
tools: [submitValidationTool] as Parameters<typeof this.client.messages.create>[0]['tools'],
```

D. **Gateway auth header** — if gateway returns 401, verify `apiKey` is passed. The ACV gateway uses standard Bearer auth (`Authorization: Bearer $ECHOMIND_LLM_API_KEY`).

**Step 5 — Create .env.local.example** (committed to git, real values are in .env.local which is gitignored):
```
# ACV LLM Gateway configuration
# Copy to .env.local and fill in real values
# .env.local is gitignored — NEVER commit it

ECHOMIND_LLM_BASE_URL=https://acv-gateway.example.com/v1
ECHOMIND_LLM_API_KEY=your-gateway-key-here
ECHOMIND_MODEL=claude-sonnet-4-6

# Set to 'true' to use fixture replay instead of live gateway
ECHOMIND_REPLAY=false

# Web app: set to 'true' for demo-day fixture replay
VITE_REPLAY_MODE=false
```

Also confirm .gitignore includes `.env.local` — add it if not present.

**Step 6 — Verify output quality** (not the checkpoint, just a quick sanity check): Do the returned findings reference anything specific to the GM persona? If output is generic ("this PRD is well-structured") with no mention of GMs or dealership operations, the system prompt may not be rendering correctly. Debug by printing the rendered system prompt before the API call:
```typescript
// Temporary debug — remove before commit
console.error('=== SYSTEM PROMPT ===\n', systemPrompt.slice(0, 500));
```

After confirming a good output, rebuild and proceed to Plan 04 for snapshotting.
  </action>

  <verify>
    <automated>cd /Users/cdunbar/Repos/echomind && pnpm --filter @echomind/engine build 2>&1 | tail -5 && ls packages/engine/dist/bin/echomind-validate.js</automated>
  </verify>

  <acceptance_criteria>
    - pnpm --filter @echomind/engine build exits 0 with no TypeScript errors
    - Running the CLI with real .env.local produces stdout containing all four markdown sections: "## Fit", "## Friction", "## Questions", "## Refinements"
    - CLI stdout begins with "# Validation: General Manager → ACV MAX Auctions PRD"
    - .env.local.example exists at repo root and contains ECHOMIND_LLM_BASE_URL, ECHOMIND_LLM_API_KEY, ECHOMIND_MODEL, ECHOMIND_REPLAY, VITE_REPLAY_MODE
    - .gitignore contains ".env.local" (verify with grep)
    - packages/engine/src/llm.ts contains no hardcoded "anthropic.com" URL (only ECHOMIND_LLM_BASE_URL)
    - The system prompt rendered to the gateway contains the string "General Manager" (persona.role substituted)
    - CLI output contains at least 2 bullets in the ## Friction section (confirms persona-grounded output, not empty)
  </acceptance_criteria>

  <done>Live gateway call succeeds. CLI prints four markdown sections. System prompt renders GM persona fields. .env.local.example committed. Engine is proven end-to-end.</done>
</task>

</tasks>

<verification>
```bash
# Full smoke test — requires .env.local to be configured
source /Users/cdunbar/Repos/echomind/.env.local && \
  node /Users/cdunbar/Repos/echomind/packages/engine/dist/bin/echomind-validate.js \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md \
  2>/dev/null | grep -E "^# Validation|^## (Fit|Friction|Questions|Refinements)" | wc -l
# Expected: 5 (1 H1 + 4 H2 sections)

# No anthropic.com hardcoded
grep -r "anthropic.com" /Users/cdunbar/Repos/echomind/packages/engine/src/ && echo "FAIL" || echo "PASS: no hardcoded URL"

# .env.local.example present
grep "ECHOMIND_LLM_BASE_URL" /Users/cdunbar/Repos/echomind/.env.local.example && echo "PASS" || echo "FAIL"
```
</verification>

<success_criteria>
- Engine builds without TypeScript errors
- Live CLI run against real ACV gateway returns all four sections populated
- Findings are GM-persona-grounded (mention dealer operations context — not generic)
- .env.local.example committed with all five env var templates
- .env.local is gitignored (real creds never committed)
- Ready for Plan 04 to snapshot the first great response
</success_criteria>

<output>
After completion, create `.planning/phases/01-demo-sliver/01-03-engine-gateway-SUMMARY.md`. Include: CLI output sample (first 2 bullets from each section), any engine source fixes applied, gateway connection confirmed, model used.
</output>
