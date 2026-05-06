# Phase 2: Engine Hardening - Context

**Gathered:** 2026-05-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Add provenance tracing to every validator finding, enforce the anti-gaming read-only persona guardrail (PERS-04), and surface gateway errors as structured states on both the web app and the CLI skill — without breaking the web/skill schema parity contract (VALD-04). No new features, no new surfaces. Engine, web, and skill are all in scope; Confluence input and persona picker are Phase 3.

In scope (Phase 2 only):
- Breaking schema change to `ValidationResult` to carry per-finding provenance
- LLM tool schema update (`submit_validation`) to elicit provenance from the LLM
- Web app `SectionCard.vue` update to render provenance chips per finding
- CLI skill output update to render provenance as italic inline annotation
- Structured gateway error handling in `GatewayClient` and `useValidator`
- Read-only persona enforcement confirmed in UI (PERS-04)
- No-leak guardrail audit (VALD-05) — no raw persona+PRD logging outside gateway

Out of Phase 2:
- Live gateway wiring for the web browser (server-side API endpoint) — Claude's discretion on whether Phase 2 or Phase 3 based on LLM-03 scope
- Persona picker (Phase 3 — WEB-02)
- Confluence/Notion link input (Phase 3 — WEB-03)
- Copy/export (Phase 3 — WEB-06)

</domain>

<decisions>
## Implementation Decisions

### Provenance Schema (VALD-03 / VALD-04)

- **D-01:** Each finding in `ValidationResult` becomes an object: `{text: string; sources: string[]}`. The four section arrays become `Finding[]` where `Finding = {text: string; sources: string[]}`. This is a **breaking change** to the schema — both surfaces must update in the same phase (satisfying VALD-04 automatically).
- **D-02:** `sources` contains **field names only** — e.g., `['pain_points', 'review_lens']`. No quoted excerpts, no array indices. Simple, readable, renderable as a tag.
- **D-03:** Missing provenance is represented as **`sources: []`** (empty array, always present). The engine accepts and passes through findings with no traced source. Web and skill render them normally without a chip/annotation. This is permissive — does not block a finding for a tracing miss.
- **D-04:** The `submit_validation` tool schema in `tool.ts` must be updated to reflect the new `Finding` shape. The LLM is asked to trace each finding to persona fields; the tool schema enforces the structure.

### Provenance UI — Web App (VALD-03)

- **D-05:** Provenance appears as **small chips below each finding bullet** in `SectionCard.vue`. Chips are always visible (no hover required) — provenance is primary reference data, not hidden metadata.
- **D-06:** Chip color reflects the **persona field type**, not the section. Each persona field category (e.g., `pain_points`, `review_lens`, `goals`, `daily_workflow`, `pet_peeves`, `vocabulary`, `tech_comfort`) has a consistent accent color across all four sections. A finding with `sources: ['pain_points', 'review_lens']` renders two chips in their respective field colors regardless of whether it appears in Friction or Refinements.
- **D-07:** Chips with `sources: []` are simply not rendered — the finding row shows without any chip, which is valid.

### Provenance UI — CLI Skill (VALD-03)

- **D-08:** Each finding in the skill output is followed by an **italic inline annotation**: `- Finding text *(pain_points, review_lens)*`. Renders in Claude Code's markdown preview, copy-pastes cleanly into Confluence/Notion, visible without color support. If `sources: []`, no annotation is appended.

### Anti-Gaming Guardrail (PERS-04)

- **D-09:** The web app must show **no edit affordance** for persona data at any point. The existing read-only `v-select` in `InputPane.vue` is correct. Phase 2 confirms this holds — no tooltip, no link, no edit button is added. The guardrail is the absence of any authoring path, not a visible "read-only" label.

### Claude's Discretion

- Chip color palette — define a consistent map of persona field name → M3 theme color (use the available M3 color roles from `material-theme.json`; 6–7 distinct colors needed for the 8 persona fields)
- Whether Phase 2 wires a real server-side API endpoint for the web browser (enabling live mode and real gateway errors) or defers that to Phase 3 — decide based on LLM-03 scope and implementation cost
- Gateway error classification detail (timeout vs auth vs rate limit vs unexpected) and web UX (inline error vs replace results pane; retry button or not) — implement per LLM-03 goal without further user input
- VALD-05 implementation detail — audit and remove any `console.log` or SDK debug logging that could emit raw persona+PRD payloads; add explicit guards if needed
- TypeScript type name for the new finding shape (`Finding`, `ValidationFinding`, etc.)
- Whether to update `ValidateOptions` or add a new option type for Phase 2 additions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Engine — current types and tool schema (must change)
- `packages/engine/src/types.ts` — Current `ValidationResult` and `PersonaYaml` types; `Finding` type must be added here
- `packages/engine/src/tool.ts` — `submit_validation` tool schema and `parseToolResult`; both must be updated for the new `Finding` shape
- `packages/engine/src/llm.ts` — `GatewayClient` and `FixtureClient`; error handling and no-leak audit target
- `packages/engine/src/index.ts` — Engine public API surface; re-exports must stay clean
- `packages/engine/src/prompt.ts` — `buildUserMessage` may need to instruct the LLM to trace findings to persona fields

### Web app — components to update
- `apps/web/src/components/SectionCard.vue` — finding renderer; must handle `Finding[]` (object array) and render provenance chips
- `apps/web/src/composables/useValidator.ts` — error state management; must handle structured gateway errors
- `apps/web/src/components/InputPane.vue` — confirm no edit affordance added (read-only v-select already in place)
- `apps/web/src/components/ResultsPane.vue` — may need error state rendering slot

### CLI skill — output renderer
- `packages/engine/bin/echomind-validate.ts` — output renderer; must handle `Finding[]` and render italic inline annotations

### Theme reference (for chip colors)
- `assets/material-theme-builder/material-theme.json` — M3 theme export; source of color roles for chip color palette

### Phase and requirements
- `.planning/REQUIREMENTS.md` §VALD-03, VALD-04, VALD-05, PERS-04, LLM-03 — exact acceptance criteria for each requirement
- `.planning/ROADMAP.md` §Phase 2 — Phase goal and success criteria
- `.planning/phases/01-demo-sliver/01-CONTEXT.md` — Prior schema decisions (D-03 tool-use, D-04 engine API shape) — must be extended, not replaced

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GatewayClient` and `FixtureClient` in `llm.ts` — adapter pattern is established; error handling is additive
- `parseToolResult` in `tool.ts` — function to update for the new `Finding` shape; logic is simple enough to replace in-place
- Vuetify `v-chip` component — available in the existing Vuetify setup; no new dependencies needed for provenance chips
- M3 theme color roles in `apps/web/src/main.ts` — 26 roles already mapped; 6–7 will be selected for the persona field chip palette

### Established Patterns
- `ValidationResult` is the engine's public API contract — changing it requires coordinated update across `types.ts`, `tool.ts`, `index.ts`, CLI bin, and web composable/components
- Error handling in `useValidator`: currently catches any thrown error and sets `error.value` as a string — same catch block can be extended for structured gateway errors
- CLI output: `result.fit.forEach(f => console.log('- ${f}'))` — must change to iterate `Finding[]` and append italic annotation

### Integration Points
- Engine → web: `ValidationResult` is imported as a type only in `useValidator.ts`; changing the type triggers TS errors that guide every update site
- Engine → CLI: `echomind-validate.ts` iterates the four section arrays directly; the new `Finding[]` shape will break compilation, surfacing all touch points
- `submit_validation` tool → LLM: the tool's `input_schema` is what the LLM uses to structure its response; changing the schema here is the mechanism that elicits provenance

</code_context>

<specifics>
## Specific Ideas

- Persona field → chip color map (Claude's discretion): 8 persona fields; use M3 secondary/tertiary/error-container and their variants for distinct but on-brand colors. A simple `Record<string, string>` constant in a new `provenance.ts` helper is likely the right shape.
- The `buildUserMessage` function in `prompt.ts` may need an explicit instruction to the LLM: "For each finding, identify which persona fields (goals, pain_points, daily_workflow, vocabulary, tech_comfort, pet_peeves, review_lens) informed it, and include them in the `sources` array." Without this, the LLM may leave `sources: []` for most findings even if the tool schema allows it.
- `FixtureClient` replay: the fixture `gm-auctions-snapshot.json` currently has the old `string[]` shape per section. It must be migrated to `Finding[]` as part of Phase 2, or a migration step must convert it on read. Prefer migrating the fixture to maintain a single format.

</specifics>

<deferred>
## Deferred Ideas

- Live gateway API endpoint for the web browser — whether this lands in Phase 2 or Phase 3 is Claude's discretion; the user did not weigh in. If Phase 2, it enables real gateway error testing against LLM-03. If Phase 3, Phase 2 LLM-03 work applies primarily to the CLI skill and engine error handling.
- Error state UX design (retry button, error classification by type) — Claude decides within LLM-03 scope
- Dark mode provenance chip colors — follows dark mode deferral from Phase 1.1

### Reviewed Todos (not folded)
None reviewed — todo match returned zero candidates.

</deferred>

---

*Phase: 02-engine-hardening*
*Context gathered: 2026-05-05*
