# Phase 1: Demo Sliver - Context

**Gathered:** 2026-05-04
**Status:** Ready for planning

<domain>
## Phase Boundary

End-to-end demo on **two surfaces** (Vue 3 + Vuetify web app **and** Claude Code skill) that share a single validator engine. Both surfaces run the engine against the refined GM hero persona and a hardcoded ACV MAX Auctions PRD, producing the four structured output sections: `fit / friction / questions / refinements`. Demo-ready in 2 days.

In scope (Phase 1 only):
- Validator engine package (TS) callable from web and skill
- Web app shell + single demo screen wired to the engine
- Claude Code skill that shells out to the engine CLI
- Hardcoded demo PRD as a fixture file
- Cached fixture replay for demo-day reliability
- ACV gateway integration (Anthropic-compatible)

Out of Phase 1 (belongs to Phase 2 or 3):
- Provenance traceability per finding (VALD-03 — Phase 2)
- Read-only persona library UI / anti-gaming guardrail (PERS-04 — Phase 2)
- Structured error states for gateway failures (LLM-03 — Phase 2)
- Confluence/Notion link input (WEB-03 — Phase 3)
- Persona picker, copy/export, retry affordances (Phase 3)
- Skill writing output to a file (SKIL-05 — Phase 3)

</domain>

<decisions>
## Implementation Decisions

### Engine Architecture & Code Sharing
- **D-01:** Repo layout = **pnpm monorepo** with `packages/engine/` (shared TS validator + CLI bin), `apps/web/` (Vue 3 + Vuetify + Vite), and `apps/skill/` (Claude Code skill assets). Single source of truth for engine code, clean tooling boundaries.
- **D-02:** Skill → engine handoff = **CLI binary**. Engine package exposes `bin/echomind-validate` (Node CLI). Skill markdown invokes it via Bash with `--persona <yaml-path> --prd <md-path>`, captures stdout, renders. Mirrors how existing Claude Code skills shell out and gives a clean process boundary.
- **D-03:** Structured output technique = **tool use with strict JSON schema**. Engine declares a single `submit_validation` tool whose JSON schema enforces the four sections; engine parses Claude's tool-use input. Most robust shape against malformed output.
- **D-04:** Engine public API = **async function returning structured object**: `async function validate(persona: PersonaYaml, prd: string, opts?): Promise<ValidationResult>` where `ValidationResult` has `fit`, `friction`, `questions`, `refinements`. Identical contract for web and CLI consumers. Streaming is a Phase 2 concern, not now.

### ACV Gateway Integration
- **D-05:** Gateway access state = **working creds + known wire format**. Chad/Jake can hit the ACV gateway today.
- **D-06:** Gateway wire format = **Anthropic-compatible**. The gateway is a drop-in for `@anthropic-ai/sdk` — engine uses the official SDK with a `baseURL` override. Gets tool-use, retries, and types for free.
- **D-07:** LLM adapter shape = **provider interface with two implementations**. Define `LlmClient` interface in the engine; ship `GatewayClient` (real, Anthropic SDK) and `FixtureClient` (replay cached responses). Tests use Fixture; demo can flip via env.
- **D-08:** Demo-day fallback = **cached fixture replay**. After we vet a real GM-on-Auctions response we love, snapshot the validator output as a JSON fixture. Add a `--replay` flag (CLI) and a hidden hotkey or env toggle (web) that returns the cached output instantly. Demo never depends on a live LLM call when stakes are highest.
- **D-09:** Config = **`.env.local` (gitignored) + sensible defaults**. Engine reads `process.env` for `ECHOMIND_LLM_BASE_URL`, `ECHOMIND_LLM_API_KEY`, `ECHOMIND_MODEL`. Web reads via Vite's `import.meta.env` for non-secret values; secrets stay server-side via a tiny dev proxy (researcher to detail). Skill reads from environment directly. Default model: `claude-sonnet-4-6` (per project constraint).

### Demo PRD Content & Format
- **D-10:** PRD location = **fixtures markdown file** at `fixtures/prds/acvmax-auctions.md` (or similar). Loaded by both surfaces via path. Sets the pattern for Phase 3 where real PRDs come from URLs.
- **D-11:** PRD depth = **realistic short PRD, ~500–1000 words / 1–2 pages**. Includes problem statement, target user, proposed flow, success metrics, open questions. Detailed enough for the GM persona to find specific friction; short enough to read in the demo.
- **D-12:** PRD authorship = **Chad/Jake draft, AI helps polish**. Lands as a Phase 1 task: draft and commit `fixtures/prds/acvmax-auctions.md`. Chad/Jake know what would believably ship at ACV.
- **D-13:** "We caught X" insurance (DEMO-03) = **iterate until output is great, then snapshot fixture**. During Phase 1, run real validations against the PRD and refine the PRD wording or persona system prompt until the GM produces a non-obvious pushback we love. Snapshot that exact output as the demo-day fixture (ties to D-08).

### Surface Presentation — Web
- **D-14:** Web sliver scope = **scaffold of the full Phase 3 layout, demo content hardcoded**. App shell, header with persona name + PRD title, Validate button, results pane. Persona dropdown shows just the GM (real component, single item). PRD input shows the demo PRD title in a disabled state. Phase 3 only swaps the data sources.
- **D-15:** WEB-04 "live progress" interpretation for sliver = **staged status indicator** with discrete steps ('Loading persona → Loading PRD → Calling validator → Rendering output'), checkmark per stage. Use a Vuetify stepper component. Honest about what's happening, no streaming complexity.
- **D-16:** Demo flow = **click 'Validate' to trigger**. App loads with persona + PRD pre-shown; user clicks Validate, watches staged progress, sees output. Gives Chad/Jake a narrative beat to talk over.

### Surface Presentation — Skill
- **D-17:** Skill output rendering = **markdown with headed sections**: `# Validation: GM persona → ACV MAX Auctions PRD` followed by `## Fit / ## Friction / ## Questions / ## Refinements` with bullets. Renders in Claude Code's terminal preview, copy-pastes cleanly into Confluence/Notion comments, mirrors the file-write format Phase 3 SKIL-05 will need.

### Claude's Discretion
- Test framework choice (vitest vs jest) — researcher/planner picks based on monorepo conventions
- Specific Vuetify component choices (which stepper, button, card variants) — designer/planner discretion within the layout decisions
- Node version, package.json scripts, lint config — standard pnpm + Vue 3 + TS conventions
- Exact env var names and dev-proxy implementation for web → gateway — researcher to design within the .env + adapter pattern
- TS build tooling (tsup, tsc, unbuild) for the engine package — planner picks based on monorepo norms
- CLI argument library (commander, citty, plain process.argv parsing)
- Error format from `submit_validation` tool when Claude can't produce all four sections — engine API has flexibility here as long as `ValidationResult` shape is preserved
- Skill name (`/echomind:validate` is suggested in REQUIREMENTS but the exact slug is open)

### Folded Todos
None — no pending todos matched Phase 1.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Phase
- `.planning/PROJECT.md` — Vision, core value, constraints (especially LLM gateway / no-leak / anti-gaming guardrails), Key Decisions table
- `.planning/REQUIREMENTS.md` — Phase 1 mapped requirements: PERS-01/02/03, VALD-01/02, LLM-01/02, WEB-01/04/05, SKIL-01/02/03/04, DEMO-01/02/03/04
- `.planning/ROADMAP.md` §"Phase 1: Demo Sliver" — Phase goal and success criteria
- `.planning/STATE.md` — Current project position

### Persona Substrate
- `personas/_template.yaml` — Canonical persona schema (shared with `agent-personas`, do not fork)
- `personas/general-manager.yaml` — Hero persona starting point (refine for sliver, full provenance is Phase 2 concern)
- `personas/README.md` — Persona schema docs and conventions

### Persona Embodiment
- `prompts/persona-system-prompt.md` — Persona system-prompt template with `{{field}}` tokens and notes for implementation. Engine renders this with persona YAML fields.

### Reasoning History
- `agent-knowledge/session-001-whiteboarding.md` — Kickoff reasoning (why C+B hybrid, why both surfaces are peers, why dual-surface scope risk was accepted). Read before relitigating any locked decision.
- `planning/whiteboarding-2026-05-04.md` — Kickoff planning artifact

### External
- `agent-personas` repo (https://github.com/chadwd/agent-personas) — Schema source of truth; loader pattern reference (don't fork the schema; consider vendoring or re-implementing the loader to match)
- Anthropic SDK: `@anthropic-ai/sdk` — npm package; supports `baseURL` override for the gateway adapter
- Anthropic Messages API tool use: gateway is Anthropic-compatible, so tool-use semantics match the upstream API

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `personas/general-manager.yaml` — usable as-is for sliver; persona refinement is Phase 2/3 work, not blocking the demo
- `personas/_template.yaml` — schema reference; gives the TS type definition for `PersonaYaml`
- `prompts/persona-system-prompt.md` — drop-in template; engine's prompt assembly is a token-substitution pass over this file

### Established Patterns
- **No app code yet** — green field. No existing Vue patterns, no test setup, no monorepo. Phase 1 establishes them.
- **Schema sharing convention** — both EchoMind and `agent-personas` read the same YAML shape. Engine's `PersonaYaml` type and loader must match this contract; researcher should examine how `agent-personas` loads YAML to stay schema-compatible.

### Integration Points
- **Engine ↔ web**: web app imports `@echomind/engine` (the workspace package) and calls `validate(persona, prd)`. Streaming progress UI uses staged callbacks or post-hoc state transitions, not partial response data.
- **Engine ↔ skill**: skill markdown invokes `pnpm --filter @echomind/engine exec echomind-validate --persona ./personas/general-manager.yaml --prd ./fixtures/prds/acvmax-auctions.md`, captures stdout (markdown-formatted output), renders inline.
- **Engine ↔ gateway**: `GatewayClient` wraps `@anthropic-ai/sdk` with `baseURL` set from env. `FixtureClient` reads cached JSON from `fixtures/responses/` for demo-day replay.

</code_context>

<specifics>
## Specific Ideas

- **Demo narrative beat**: the user clicks Validate, the Vuetify stepper progresses through visible stages, and the four sections render together (or stage-by-stage if cheap). Chad/Jake narrate over the staged progress and land on the GM's pushback as the punch line.
- **Demo PRD vetting loop**: Phase 1 includes deliberate iteration time — write PRD, run validator, judge whether the GM output surfaces a non-obvious pushback, refine PRD wording (and possibly the persona system prompt) until it does, then snapshot. This is a planned Phase 1 task, not a "if we have time" stretch.
- **Identical output across surfaces**: web shows it as Vuetify cards/sections with the same headings the skill uses; skill prints markdown headings. Same content, different rendering. SKIL-04 / VALD-04 (single output schema) tested by serializing the same `ValidationResult` for both.

</specifics>

<deferred>
## Deferred Ideas

- **Per-finding provenance UI** — Considered in kickoff, deferred to Phase 2 (VALD-03). Engine's `ValidationResult` shape can include a `provenance` field as null/empty in Phase 1 and populate it in Phase 2 without breaking the contract.
- **Anti-gaming read-only persona UI** — PERS-04, Phase 2. Phase 1 hardcodes the GM persona; no UI affordance for swapping or editing.
- **Streaming partial sections** — Considered for WEB-04 progress UX; deferred because tool-use responses don't naturally stream sections separately and the engine API would have to change. Staged status indicator (D-15) gets the "live" feel without that cost.
- **Verdict lozenge / top-level summary** — OUT-01 in REQUIREMENTS.md, v2 only.
- **Agent-personas loader vendoring vs. re-implementing** — Engine needs a YAML loader that reads the shared schema. Whether to vendor `agent-personas`' loader or write a fresh schema-matching loader is a planner-discretion call; both are compatible with the no-fork constraint as long as the schema match is preserved.
- **Persona refinement with documented provenance (PERS-02)** — Phase 1 uses GM persona as-is. Provenance documentation is its own work and naturally belongs alongside Phase 2 (engine hardening / provenance traceability).

### Reviewed Todos (not folded)
None reviewed — todo match returned zero candidates.

</deferred>

---

*Phase: 01-demo-sliver*
*Context gathered: 2026-05-04*
