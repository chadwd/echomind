# Phase 1: Demo Sliver - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-04
**Phase:** 01-demo-sliver
**Areas discussed:** Engine architecture + code sharing, ACV gateway integration + fallback, Demo PRD content & format, Surface presentation (web + skill)

---

## Engine architecture + code sharing

### Q: How should the repo be laid out so web app and skill can share the validator engine cleanly?

| Option | Description | Selected |
|--------|-------------|----------|
| pnpm monorepo | `packages/engine/`, `apps/web/`, `apps/skill/`. Clean separation, single install, zero hacks for sharing types. Standard Vue 3 + Vite + pnpm pattern. Best fit for "single source of truth" (PERS-03/VALD-04). | ✓ |
| Single package, multiple entries | One `package.json`, `src/engine/`, `src/web/`, `src/skill/`. Simplest install, but mixes Vue build config with engine and skill — gets messy fast as Phase 3 grows. | |
| Two sibling dirs, vendored engine | `web/` and `skill/` each have a copy of the engine TS. Avoids tooling complexity for 2-day sliver but immediately violates "single source of truth" — next phase has to refactor. | |

**User's choice:** pnpm monorepo (recommended)

### Q: How does the Claude Code skill actually invoke the validator engine?

| Option | Description | Selected |
|--------|-------------|----------|
| CLI binary the skill shells out to | Engine package exposes a `bin/echomind-validate` Node CLI. Skill markdown invokes it via Bash with `--persona` and `--prd` args, captures stdout, renders. Clean process boundary, easy to test. | ✓ |
| Skill is a Node script directly importing engine | Skill ships with a small `run.ts` that imports the engine module and runs it. Tighter coupling but no CLI plumbing. | |
| Engine runs as local HTTP service | Web app is the server; skill calls `localhost:PORT/validate`. Avoids duplicate runtime, but demo now requires the web server running before the skill works — fragile on demo day. | |

**User's choice:** CLI binary the skill shells out to (recommended)

### Q: How does the engine reliably get the 4-section output back from Claude?

| Option | Description | Selected |
|--------|-------------|----------|
| Tool use with strict JSON schema | Engine declares a single `submit_validation` tool with a JSON schema enforcing the four sections. Claude calls the tool; engine parses tool input. Most robust against malformed output. | ✓ |
| JSON-only prompt + JSON.parse | Prompt instructs Claude to respond with JSON; engine `JSON.parse`s the response. Simple, but Claude occasionally wraps JSON in code fences — needs defensive parsing. | |
| Markdown with headed sections + parser | Claude emits markdown with `## Fit`, etc. Engine splits on headings. Most readable but brittle if Claude varies heading text. | |

**User's choice:** Tool use with strict JSON schema (recommended)

### Q: What should the engine's public API look like for both surfaces to call?

| Option | Description | Selected |
|--------|-------------|----------|
| Async function returning structured object | `async function validate(persona, prd, opts?): Promise<ValidationResult>` with `fit`, `friction`, `questions`, `refinements`. Clean TS contract; streaming added in Phase 2 without breaking it. | ✓ |
| Async generator that streams partial sections | `async function* validateStream(...)` yields each section. Enables "live progress" more honestly, but doubles complexity for the sliver and tool-use responses don't naturally stream sections separately. | |
| CLI-only (no JS API) | Engine only exposes `echomind-validate` CLI. Web app shells out too. Awkward in a Vite/Vue setup — defeats the point of TS sharing. | |

**User's choice:** Async function returning structured object (recommended)

**Notes:** All four recommended defaults selected. Foundation locked: pnpm monorepo, CLI shell-out from skill, tool-use JSON schema, async function API.

---

## ACV gateway integration + fallback

### Q: What's the current state of access to the ACV LLM gateway?

| Option | Description | Selected |
|--------|-------------|----------|
| Already have working creds + know the API shape | Chad/Jake can hit the gateway today with a sample request that returns a Claude response. | ✓ |
| Have creds but API shape is unconfirmed | Access exists but request/response format hasn't been exercised. | |
| No access yet — need to request/wait | Sliver may need to ship against direct Anthropic API and swap to gateway in Phase 2. | |
| Not sure / want researcher to find out | Defer to the researcher. | |

**User's choice:** Already have working creds + known API shape

### Q: What's the demo-day fallback if the gateway misbehaves during the live demo?

| Option | Description | Selected |
|--------|-------------|----------|
| Cached fixture replay | Snapshot a vetted real validator output as a JSON fixture. Add a `--replay` flag (and hidden hotkey on web) that returns it instantly. Demo never depends on live LLM. | ✓ |
| Direct Anthropic API as backup | Swap env to direct Anthropic API key. Real call, but introduces the "raw key" guardrail violation we're trying to avoid. | |
| No fallback — demo trusts the gateway | Live call every time. Cleanest story, riskiest demo. | |

**User's choice:** Cached fixture replay (recommended)

### Q: How should the LLM adapter be abstracted in the engine?

| Option | Description | Selected |
|--------|-------------|----------|
| Provider interface with gateway + fixture adapters | Engine takes an `LlmClient` interface; ship `GatewayClient` (real) and `FixtureClient` (replay). Tests use Fixture; demo can flip via env. | ✓ |
| Single gateway client, hardcoded | Engine talks directly to gateway HTTP, no adapter abstraction. Simpler today but no fallback hook. | |
| Anthropic SDK with gateway baseURL override | Use `@anthropic-ai/sdk` and point `baseURL` at the gateway. Free retries, streaming, types. Caveat: only works if gateway is Anthropic-compatible. | |

**User's choice:** Provider interface with gateway + fixture adapters (recommended)

**Notes:** The third option (Anthropic SDK with baseURL override) is not lost — it's a tactic *inside* the `GatewayClient` implementation, since the gateway turned out to be Anthropic-compatible (next question).

### Q: How should gateway credentials and config be supplied to the engine?

| Option | Description | Selected |
|--------|-------------|----------|
| .env file + sensible defaults | `.env.local` (gitignored) with `ECHOMIND_LLM_BASE_URL`, `ECHOMIND_LLM_API_KEY`, `ECHOMIND_MODEL`. Web reads via Vite's `import.meta.env`; secrets stay server-side via dev proxy. | ✓ |
| Single config.json checked into repo (no secrets) | Non-secret config in JSON; secrets in env. Two config sources. | |
| All env, no config file | Even the model name is an env var. Simplest, but no defaults for new contributors. | |

**User's choice:** .env file + sensible defaults (recommended)

### Q (follow-up): What wire format does the ACV gateway speak?

| Option | Description | Selected |
|--------|-------------|----------|
| Anthropic-compatible (drop-in for @anthropic-ai/sdk) | Same shape as Anthropic Messages API; SDK with baseURL override gets tool-use, streaming, retries for free. | ✓ |
| OpenAI-compatible | Same shape as OpenAI Chat Completions. | |
| Custom ACV shape | Bespoke format. Thin HTTP client. | |
| I'll document it in CONTEXT.md myself | User to describe directly. | |

**User's choice:** Anthropic-compatible — confirms the GatewayClient implementation strategy

---

## Demo PRD content & format

### Q: Where should the hardcoded ACV MAX Auctions PRD live in the repo?

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown file in fixtures dir | `fixtures/prds/acvmax-auctions.md`. Loaded by both surfaces via path. Sets pattern for Phase 3. | ✓ |
| TS string constant in engine package | `packages/engine/src/fixtures/demo-prd.ts` exporting a string. Mixes content with code. | |
| Separate `demo/` repo or gist | Adds a fetch step; not necessary for invented demo content. | |

**User's choice:** Markdown file in fixtures dir (recommended)

### Q: How detailed should the demo PRD be?

| Option | Description | Selected |
|--------|-------------|----------|
| Realistic short PRD: 1–2 pages | Real-feeling PRD with problem statement, target user, proposed flow, success metrics, open questions. ~500–1000 words. | ✓ |
| Concept brief: half a page | Faster to write but harder for persona to find specific pushback. | |
| Full PRD: 3–5 pages | More realistic but longer to write and may overflow context budget. | |

**User's choice:** Realistic short PRD: 1–2 pages (recommended)

### Q: Who drafts the demo PRD and when?

| Option | Description | Selected |
|--------|-------------|----------|
| Chad/Jake draft, AI helps polish | Lands as a Phase 1 task. Vet GM persona output before demo. | ✓ |
| AI drafts from a brief, Chad/Jake review | Faster first pass; risk of generic feel or accidentally inventing a real ACV roadmap item. | |
| Use a real recent ACV PRD (sanitized) | Most authentic but raises privacy review questions. | |

**User's choice:** Chad/Jake draft, AI helps polish (recommended)

### Q: How do we ensure the "we caught X" pushback moment lands on demo day (DEMO-03)?

| Option | Description | Selected |
|--------|-------------|----------|
| Run validator, iterate prompt+PRD until output is great, snapshot fixture | Real validations during Phase 1; refine until GM produces non-obvious pushback; snapshot output as demo fixture (ties to D-08). | ✓ |
| Run live each demo, accept variance | Trust prompt + persona to consistently produce good output. Riskier — LLM output varies. | |
| Hand-write the expected output, never call LLM in demo | Most reliable theater, least authentic. | |

**User's choice:** Iterate + snapshot (recommended)

---

## Surface presentation (web + skill)

### Q: What should the Phase 1 web app actually look like?

| Option | Description | Selected |
|--------|-------------|----------|
| Scaffold of full layout, demo content hardcoded | App shell, header with persona name + PRD title, Validate button, results pane. Persona dropdown shows just the GM. PRD input shows the demo PRD title disabled. Cuts Phase 3 work. | ✓ |
| Strict single demo screen, no shell | One page: header, big Validate button, results below. Faster; Phase 3 has more rework. | |
| Two screens: input + results | Closer to full v1 flow, more components/routing for the sliver. | |

**User's choice:** Scaffold of full layout (recommended)

### Q: What does WEB-04 "live progress" mean for the Phase 1 sliver?

| Option | Description | Selected |
|--------|-------------|----------|
| Staged status indicator | Discrete steps: 'Loading persona → Loading PRD → Calling validator → Rendering output' with a checkmark per stage. Vuetify stepper. | ✓ |
| Stream sections as they arrive | Tool-use streaming to render fit → friction → questions → refinements as each completes. Doubles engine complexity. | |
| Indeterminate spinner with persona/PRD title | Vuetify circular progress + text. Simplest, least informative. | |

**User's choice:** Staged status indicator (recommended)

### Q: How should the demo flow open?

| Option | Description | Selected |
|--------|-------------|----------|
| Click 'Validate' to trigger | App loads showing persona + PRD; user clicks Validate. Gives a narrative beat to talk over. | ✓ |
| Auto-run on load | Faster but removes narrative beat. | |
| Pre-rendered output, button just resets/replays | Eliminates load anxiety but undercuts live-validation framing. | |

**User's choice:** Click 'Validate' to trigger (recommended)

### Q: How should the skill render the 4-section output in the terminal?

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown with headed sections | `# Validation: GM persona → ACV MAX Auctions PRD` followed by `## Fit / ## Friction / ## Questions / ## Refinements` with bullets. Renders nicely; mirrors Phase 3 file-write format. | ✓ |
| ANSI-colored boxed sections | Polished in terminal; loses fidelity when copy-pasted; harder to test. | |
| Pretty-printed JSON dump | Easiest to ship, ugliest to demo. | |

**User's choice:** Markdown with headed sections (recommended)

---

## Claude's Discretion

Areas left to planner/researcher discretion within the locked decisions:
- Test framework choice (vitest vs jest)
- Specific Vuetify component variants (which stepper, button, card)
- Node version, package.json scripts, lint config
- Exact env var names and dev-proxy implementation for web → gateway
- TS build tooling (tsup, tsc, unbuild) for the engine package
- CLI argument library (commander, citty, plain process.argv)
- Error format from `submit_validation` tool when Claude can't produce all four sections
- Skill name (`/echomind:validate` is suggested; exact slug is open)

## Deferred Ideas

- Per-finding provenance UI — Phase 2 (VALD-03)
- Anti-gaming read-only persona UI — Phase 2 (PERS-04)
- Streaming partial sections — engine API would have to change; staged stepper covers it
- Verdict lozenge / top-level summary — v2 only (OUT-01)
- Agent-personas loader vendoring vs. re-implementing — planner discretion within the no-fork schema constraint
- Persona refinement with documented provenance (PERS-02) — Phase 1 uses GM as-is; provenance docs naturally belong alongside Phase 2
