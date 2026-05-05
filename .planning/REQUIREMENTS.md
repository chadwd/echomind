# Requirements: EchoMind

**Defined:** 2026-05-04
**Core Value:** A Product Owner can validate a PRD against a trusted, governed ACV persona in under a few minutes and walk away with a structured artifact they can defend, without scheduling research.

## v1 Requirements

Requirements for initial release. v1 = full peer-polished release; the 2-day demo is a sliver of v1 (see DEMO category). Each maps to roadmap phases.

### Persona Library

Persona substrate — read from `personas/*.yaml`, no fork from the `agent-personas` schema.

- [ ] **PERS-01**: Persona library reads any `personas/*.yaml` file using the existing `agent-personas` schema (no schema fork)
- [ ] **PERS-02**: Hero persona delivered as a refined `personas/general-manager.yaml` (target ACV MAX dealer GM) with documented provenance (where each field came from)
- [ ] **PERS-03**: Persona library exposes a programmatic loader (TypeScript/JavaScript) that both the web app and the Claude Code skill consume — single source of truth
- [ ] **PERS-04**: Persona authoring is explicitly rejected in the UI — read-only listing only (anti-gaming guardrail; authoring lives in the `agent-personas` capture skill)

### Validator Engine

The shared engine both surfaces call. Input = (persona YAML, PRD text). Output = the four structured sections.

- [ ] **VALD-01**: Validator engine accepts (persona YAML object, PRD text) and returns a structured object with `fit`, `friction`, `questions`, and `refinements` sections
- [ ] **VALD-02**: Validator renders the persona system prompt from `prompts/persona-system-prompt.md` using the persona's fields (no hardcoded persona content in the engine)
- [ ] **VALD-03**: Each finding in the output references the persona field(s) that drove it (provenance — supports the traceability and anti-gaming guardrails)
- [ ] **VALD-04**: Validator output schema is identical between the web app and the Claude Code skill (single contract)
- [ ] **VALD-05**: Validator never logs raw persona-context-plus-PRD payloads outside the ACV gateway (no-leak guardrail)

### LLM Integration

- [ ] **LLM-01**: All LLM calls route through ACV's existing LLM gateway/proxy — no raw Anthropic API keys in this repo
- [ ] **LLM-02**: Default model is Claude Sonnet 4.6; model is configurable via env/config so Opus 4.7 can be swapped in for harder runs
- [ ] **LLM-03**: Validator handles gateway errors (timeout, auth, rate limit) without crashing the surfaces — surfaces show a structured error state

### Web Surface

PO's primary surface. Polished as a peer to the skill (deliberate scope expansion vs. kickoff; see PROJECT.md Key Decisions).

- [ ] **WEB-01**: Single-page Vue 3 + Vuetify app, no auth (single-user mode)
- [ ] **WEB-02**: PO can pick a persona from a list of available `personas/*.yaml` files
- [ ] **WEB-03**: PO can paste a Confluence or Notion link to a PRD; backend fetches and parses the page text
- [ ] **WEB-04**: PO sees a "running validation" state with persona name, PRD title, and live progress
- [ ] **WEB-05**: PO sees the four output sections (fit, friction, questions, refinements) rendered cleanly with each finding's persona-field provenance visible
- [ ] **WEB-06**: PO can copy the structured output (markdown) to paste into a PRD or doc
- [ ] **WEB-07**: Web app handles validator errors with a clear, non-blaming error state and a retry affordance

### Skill Surface

Claude Code skill — peer to web in v1. Calls the same validator engine.

- [ ] **SKIL-01**: A `/echomind:validate` (or equivalent) Claude Code skill exists and is invocable from the terminal
- [ ] **SKIL-02**: Skill takes `--persona <yaml-path>` and `--prd <link-or-file-path>` arguments
- [ ] **SKIL-03**: Skill calls the same validator engine as the web app — identical output schema
- [ ] **SKIL-04**: Skill renders the four output sections in the terminal with provenance visible
- [ ] **SKIL-05**: Skill writes the structured output to a file the user can attach to a PRD (markdown)

### Demo Sliver

Subset that has to work end-to-end in 2 days. Demo plays through both surfaces against the same hardcoded PRD + GM persona.

- [ ] **DEMO-01**: Web app loads the GM hero persona and a hardcoded ACV MAX Auctions integration PRD, runs the validator, and renders the four output sections
- [ ] **DEMO-02**: Claude Code skill loads the same persona + same PRD via the same validator engine and renders the same four sections in the terminal
- [ ] **DEMO-03**: Both surfaces produce a "we caught X" pushback when run against the demo PRD (qualitative — we vet the actual output before demo day)
- [ ] **DEMO-04**: Demo script and click-through path documented — Chad/Jake can run it without improvisation

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Auth

- **AUTH-01**: ACV SSO so EchoMind can run inside the company with identified users
- **AUTH-02**: Per-user history of validations run

### Prototype Validation

- **PROT-01**: Persona can validate a working prototype (not just a PRD) — the bigger long-term wedge
- **PROT-02**: Screenshot or click-through input as an alternative to PRD text

### Conversational Mode

- **CHAT-01**: Optional conversational follow-up after a structured validation — ask the persona "what would change your mind?"

### Output Enhancements

- **OUT-01**: Top-level "verdict" lozenge (go / no-go / caveats) summarizing the four sections
- **OUT-02**: Symmetric output schema with `agent-personas` so the contract is bidirectional

### Distribution

- **DIST-01**: npm package wrapping the validator engine for other ACV teams to embed

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Conversational chat surface | Trust comes from provenance and structured output, not theatrics. v2 question only after we see real validator usage. (Kickoff session 001) |
| Prototype-validation in v1 | PRD-validation is the simpler on-ramp; prototype-validation is the bigger long-term wedge but is v2. (Kickoff session 001) |
| Live persona authoring UI | Authoring rides on the in-progress `agent-personas` persona-capture skill — EchoMind reads, doesn't write. (Kickoff session 001) |
| User auth in v1 | Single-user mode is fine for hackathon and early adopters. SSO is v2. |
| Free-form PRD upload (PDF, Word, raw paste) | Confluence/Notion link covers where ACV PRDs actually live. Other formats are v2. |
| npm package | Possibly v2; not needed for hackathon adoption metric. |
| Multi-persona panels (run one PRD against N personas at once) | Useful, but a v2 build once single-persona usage is established |
| Verdict lozenge / per-finding provenance UI polish | Considered in kickoff conversation, deferred to v2 once we see real outputs |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PERS-01 | TBD | Pending |
| PERS-02 | TBD | Pending |
| PERS-03 | TBD | Pending |
| PERS-04 | TBD | Pending |
| VALD-01 | TBD | Pending |
| VALD-02 | TBD | Pending |
| VALD-03 | TBD | Pending |
| VALD-04 | TBD | Pending |
| VALD-05 | TBD | Pending |
| LLM-01 | TBD | Pending |
| LLM-02 | TBD | Pending |
| LLM-03 | TBD | Pending |
| WEB-01 | TBD | Pending |
| WEB-02 | TBD | Pending |
| WEB-03 | TBD | Pending |
| WEB-04 | TBD | Pending |
| WEB-05 | TBD | Pending |
| WEB-06 | TBD | Pending |
| WEB-07 | TBD | Pending |
| SKIL-01 | TBD | Pending |
| SKIL-02 | TBD | Pending |
| SKIL-03 | TBD | Pending |
| SKIL-04 | TBD | Pending |
| SKIL-05 | TBD | Pending |
| DEMO-01 | TBD | Pending |
| DEMO-02 | TBD | Pending |
| DEMO-03 | TBD | Pending |
| DEMO-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 0 (filled by roadmapper)
- Unmapped: 28 ⚠️ (filled by roadmapper)

---
*Requirements defined: 2026-05-04*
*Last updated: 2026-05-04 after initial definition*
