# Phase 1 Research: Demo Sliver

**Researched:** 2026-05-05
**Domain:** pnpm monorepo (TS engine + Vue 3/Vuetify web + Claude Code skill) wired to ACV LLM gateway
**Confidence:** HIGH — all findings derived from CONTEXT.md locked decisions and existing repo files. No web searches needed.

---

## Summary

- **Architecture is locked.** pnpm monorepo: `packages/engine/`, `apps/web/`, `apps/skill/`. Engine is the single shared module; both surfaces are consumers.
- **Engine API shape is decided.** `validate(persona, prd, opts?) → Promise<ValidationResult>` using Anthropic tool-use (`submit_validation` tool) to enforce structured output.
- **LLM adapter pattern is decided.** `GatewayClient` (real, Anthropic SDK + `baseURL` override) + `FixtureClient` (JSON replay). Demo never live-dials unless you want it to.
- **All fixtures committed to repo.** `fixtures/prds/acvmax-auctions.md`, `fixtures/personas/gm.yaml` (or direct path to `personas/general-manager.yaml`), `fixtures/responses/gm-auctions-snapshot.json`.
- **Dual-surface scope in 2 days is the primary risk.** Mitigation: complete the engine and fixture snapshot on Day 1, so Day 2 is surface wiring only.

---

## Repo State

| Path | Status | Notes |
|------|--------|-------|
| `personas/general-manager.yaml` | EXISTS | Usable as-is. Schema matches template. |
| `personas/_template.yaml` | EXISTS | Canonical TS type source. |
| `prompts/persona-system-prompt.md` | EXISTS | Ready for `{{field}}` substitution in engine. |
| `agent-knowledge/session-001-whiteboarding.md` | EXISTS | Reasoning history — read before any locked decision re-litigation. |
| `packages/engine/` | MISSING | Create in Phase 1. |
| `apps/web/` | MISSING | Create in Phase 1. |
| `apps/skill/` | MISSING | Create in Phase 1. |
| `fixtures/prds/acvmax-auctions.md` | MISSING | Draft in Phase 1 (Chad/Jake + AI polish). |
| `fixtures/responses/gm-auctions-snapshot.json` | MISSING | Capture after first successful live run. |
| `pnpm-workspace.yaml` | MISSING | Create at repo root. |
| `package.json` (root) | MISSING | Create at repo root for workspace scripts. |
| `DEMO.md` | MISSING | Create at end of Phase 1. |

---

## Engine / Library Shape

Single shared package: `packages/engine/`. Published to pnpm workspace as `@echomind/engine`.

**Recommended TS build tool:** `tsup` — zero-config, outputs ESM + CJS, fast. Works cleanly in pnpm monorepos.

**Public API (one file: `src/index.ts`):**

```typescript
export interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}

export interface ValidateOptions {
  replay?: boolean;  // if true, LlmClient is FixtureClient
}

export async function validate(
  persona: PersonaYaml,
  prd: string,
  opts?: ValidateOptions
): Promise<ValidationResult>
```

**CLI bin:** `bin/echomind-validate.ts` → compiled to `dist/bin/echomind-validate.js`. Registered as `bin.echomind-validate` in `package.json`. Uses `commander` for `--persona`, `--prd`, `--replay` args (commander is simple, widely used, no exotic deps).

**Web imports:** `import { validate } from '@echomind/engine'` (workspace protocol).

**Skill invokes:** `pnpm --filter @echomind/engine exec echomind-validate --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md`

---

## Persona Loading

**Approach: use existing `personas/general-manager.yaml` directly via path.** No vendoring of `agent-personas` loader needed for Phase 1 — the schema is simple enough to load with `js-yaml` directly in the engine.

**YAML fields the engine types and reads (from `_template.yaml` + `general-manager.yaml`):**

```typescript
interface PersonaYaml {
  schema_version: number;
  role: string;
  goals: string[];
  daily_workflow: string[];
  pain_points: string[];
  vocabulary: string[];
  tech_comfort: 'low' | 'medium' | 'high';
  pet_peeves: string[];
  review_lens: string[];
}
```

**Loader (one function in `packages/engine/src/persona.ts`):**

```typescript
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';

export async function loadPersona(yamlPath: string): Promise<PersonaYaml> {
  const raw = await readFile(yamlPath, 'utf-8');
  return load(raw) as PersonaYaml;
}
```

CLI calls `loadPersona(args.persona)`. Web hardcodes the GM YAML object directly (import the file at build time via Vite's `?raw` import or bundle the JSON — simpler than a runtime file read from the browser).

---

## ACV LLM Gateway Integration

**Env vars (standardized):**

```
ECHOMIND_LLM_BASE_URL=https://acv-gateway.example.com/v1
ECHOMIND_LLM_API_KEY=<gateway key>
ECHOMIND_MODEL=claude-sonnet-4-6
```

For web (Vite): `VITE_REPLAY_MODE=true` toggles demo-day fixture replay (the only web-visible env var — no secrets in Vite env).

**LlmClient interface (`packages/engine/src/llm.ts`):**

```typescript
export interface LlmClient {
  complete(systemPrompt: string, userMessage: string): Promise<ValidationResult>;
}
```

**GatewayClient:** Wraps `@anthropic-ai/sdk` `Anthropic({ baseURL, apiKey })`. Sends tool-use request with `submit_validation` tool. Parses `tool_use` block from response.

**FixtureClient:** Reads `fixtures/responses/gm-auctions-snapshot.json`, returns parsed `ValidationResult`. Used when `ECHOMIND_REPLAY=true` (CLI env) or `VITE_REPLAY_MODE=true` (web).

**Web dev proxy:** For local development where secrets can't go in Vite env, add a tiny Vite dev-server proxy (`vite.config.ts` `server.proxy`) that forwards `/api/llm` to the gateway. Production (hackathon demo) can point the web app at a local Node process or just use fixture replay — keep it simple.

---

## Validator Output Schema

Lives in `packages/engine/src/types.ts`. Shared by everything.

```typescript
export interface ValidationResult {
  fit: string[];           // things the PRD aligns well with this persona
  friction: string[];      // specific friction points the persona would hit
  questions: string[];     // questions the persona would ask before buying in
  refinements: string[];   // concrete changes the PRD should make
}
```

**Provenance:** VALD-03 is Phase 2. In Phase 1, `provenance` field is omitted from the schema entirely — adding it as `provenance?: FindingProvenance[]` per section in Phase 2 won't break Phase 1 consumers.

**Tool use schema Claude must emit (in `packages/engine/src/tool.ts`):**

```typescript
const submitValidationTool = {
  name: 'submit_validation',
  description: 'Submit the structured persona validation result.',
  input_schema: {
    type: 'object',
    properties: {
      fit:          { type: 'array', items: { type: 'string' } },
      friction:     { type: 'array', items: { type: 'string' } },
      questions:    { type: 'array', items: { type: 'string' } },
      refinements:  { type: 'array', items: { type: 'string' } },
    },
    required: ['fit', 'friction', 'questions', 'refinements'],
  },
};
```

Engine sends `tool_choice: { type: 'tool', name: 'submit_validation' }` to force tool use. Parses `response.content[0].input` as `ValidationResult`.

---

## Prompt Construction

System prompt = `prompts/persona-system-prompt.md` rendered with persona fields.

**Renderer (`packages/engine/src/prompt.ts`):**

```typescript
export function buildSystemPrompt(persona: PersonaYaml, template: string): string {
  return template
    .replace('{{role}}', persona.role)
    .replace('{{goals as bullets}}', toBullets(persona.goals))
    .replace('{{daily_workflow as bullets}}', toBullets(persona.daily_workflow))
    .replace('{{pain_points as bullets}}', toBullets(persona.pain_points))
    .replace('{{pet_peeves as bullets}}', toBullets(persona.pet_peeves))
    .replace('{{vocabulary as bullets}}', toBullets(persona.vocabulary))
    .replace('{{tech_comfort}}', persona.tech_comfort)
    .replace('{{review_lens as bullets}}', toBullets(persona.review_lens));
}

function toBullets(arr: string[]): string {
  return arr.map(s => `- ${s}`).join('\n');
}
```

**User message (appended after system):**

```
You are reviewing the following PRD as the persona described above.

Return a structured validation using the submit_validation tool. For each section:
- fit: what this PRD gets right for you
- friction: specific pain points or workflow breaks you foresee
- questions: what you'd need answered before you'd back this feature
- refinements: concrete changes that would address your friction

PRD:
---
{prd text}
---
```

Engine reads the template from `prompts/persona-system-prompt.md` at runtime (Node) or via static import (Vite `?raw`).

---

## Vue 3 + Vuetify Scaffold

Stack: `Vite 5 + Vue 3 + Vuetify 3 + TypeScript`. No Pinia, no Vue Router in Phase 1 (single page, single component tree, `ref`/`reactive` composables only).

**File tree:**

```
apps/web/
├── index.html
├── vite.config.ts           # Vuetify plugin + /api proxy
├── src/
│   ├── main.ts              # createApp + Vuetify plugin
│   ├── App.vue              # Root: VApp wrapper
│   ├── components/
│   │   ├── InputPane.vue    # VCard with VSelect + VTextField + VBtn
│   │   ├── ResultsPane.vue  # VStepper while validating, VRow/VCol cards when done
│   │   └── SectionCard.vue  # VCard per output section (fit/friction/questions/refinements)
│   └── composables/
│       └── useValidator.ts  # isValidating, results, runValidation()
```

**useValidator composable (key state):**

```typescript
const isValidating = ref(false);
const step = ref(0);           // 1-4 for stepper
const results = ref<ValidationResult | null>(null);

async function runValidation() {
  isValidating.value = true;
  step.value = 1; // persona loaded (instant)
  step.value = 2; // PRD loaded (instant)
  step.value = 3; // calling validator
  results.value = await validate(gmPersona, prdText, { replay: replayMode });
  step.value = 4; // rendering
  isValidating.value = false;
}
```

Vuetify 3 install: `npm create vite@latest` → Vue + TS, then `npm install vuetify @mdi/font`. Use `createVuetify()` with `icons: { defaultSet: 'mdi' }` in `main.ts`.

---

## Claude Code Skill Format

Location: `apps/skill/` (in pnpm workspace) but the skill entry point that Claude Code sees is `.claude/skills/echomind-validate/SKILL.md`.

**SKILL.md:**

```markdown
---
name: echomind-validate
description: Validate a PRD against an EchoMind persona. Returns four structured sections: fit, friction, questions, refinements. Use when a Product Owner wants a persona-grounded PRD review without scheduling research.
---

# EchoMind Validate

Runs the EchoMind validator engine against a persona YAML and a PRD markdown file.

## Usage

```bash
pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

For demo-day fixture replay (no gateway call):

```bash
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

## Output

Renders four sections as markdown: Fit, Friction, Questions, Refinements.
```

CLI stdout must be valid markdown matching the contract in UI-SPEC.md (H1 + four H2 sections, `-` bullets).

---

## Demo Fixtures

| Path | Purpose |
|------|---------|
| `fixtures/prds/acvmax-auctions.md` | ~500–800 word PRD: problem, target user (GM), proposed flow, success metrics, open questions. Draft Day 1, iterate until GM pushback is non-obvious. |
| `fixtures/responses/gm-auctions-snapshot.json` | Captured `ValidationResult` JSON after a live run we love. Used by `FixtureClient`. |

**No separate persona fixture needed.** Both surfaces reference `personas/general-manager.yaml` directly. Keeps one source of truth.

**PRD must contain at least one exploitable flaw** the GM persona would catch via `review_lens` (e.g., a flow that adds clicks, a metric that doesn't map to turn rate or aging, a workflow assumption that doesn't match the GM's day). This is the "we caught X" story (DEMO-03). Plan deliberate iteration time on Day 1 to land it.

---

## Demo Runbook

Single artifact: `DEMO.md` at repo root.

**Web surface demo (Chad's terminal):**

```bash
cd /Users/cdunbar/Repos/echomind
pnpm --filter @echomind/web dev
# opens http://localhost:5173
# [in browser] click Validate, watch stepper, read output
# [demo-day fallback] VITE_REPLAY_MODE=true pnpm --filter @echomind/web dev
```

**Skill surface demo (Jake's terminal / Claude Code):**

```bash
# in Claude Code terminal:
/echomind:validate
# or direct:
pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
# [demo-day fallback]
ECHOMIND_REPLAY=true pnpm --filter @echomind/engine exec echomind-validate \
  --persona ./personas/general-manager.yaml \
  --prd ./fixtures/prds/acvmax-auctions.md
```

DEMO.md also documents: what "we caught X" is, which section it appears in, how to narrate the punch line.

---

## Top Risk

**Dual surface in 2 days.** The engine (shared logic, tool-use parsing, prompt rendering) is the hard part. If it slips, both surfaces slip. Resolution: on Day 1 morning, build and test the engine end-to-end first — gateway call succeeds, `ValidationResult` parses, CLI prints markdown. Only after that green signal start web scaffold and skill wiring. If engine takes all of Day 1, be prepared to demo the skill only (terminal output is still a compelling story) and show the web scaffold as a preview. Snapshot the fixture immediately after the first good live run so Day 2 surfaces never touch the gateway.

---

## Open Questions for Planner

- **Vite web → gateway proxy shape:** Does the ACV gateway require any non-standard auth header beyond `Authorization: Bearer`? Affects how the Vite dev proxy is configured. Planner should assume standard `Authorization: Bearer $ECHOMIND_LLM_API_KEY` unless Chad/Jake confirm otherwise.
- **`pnpm --filter @echomind/engine exec` vs global install:** Skill invocation assumes engine is installed in workspace. Planner should verify this is the right pnpm invocation for the Claude Code context (cwd must be repo root).
- **Skill file location:** REQUIREMENTS says `/echomind:validate`. Planner confirm whether `.claude/skills/echomind-validate/SKILL.md` is the right path for Claude Code to pick it up, or if it's `~/.claude/skills/` (user-global vs repo-local).
- **`js-yaml` vs `yaml` package:** Either works for YAML parsing. Planner pick one and stay consistent. `js-yaml` is more widely used; `yaml` has better TS types. Either is fine.
- **PRD content review gate:** Phase 1 must include explicit time for Chad/Jake to judge validator output quality (DEMO-03). Planner should treat "PRD vetting loop" as a named task with a time box, not a stretch goal.
