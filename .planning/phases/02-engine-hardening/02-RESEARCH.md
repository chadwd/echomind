# Phase 02: Engine Hardening — Research

**Researched:** 2026-05-06
**Method:** Direct codebase reading (researcher agent failed 3× on API timeouts; orchestrator read files directly)

---

## Requirements Coverage

| REQ-ID | Topic | Status |
|--------|-------|--------|
| VALD-03 | Provenance tracing per finding | Needs implementation |
| VALD-04 | Identical schema web ↔ skill | Blocked by VALD-03 (same change) |
| VALD-05 | No raw persona+PRD logging | Needs audit |
| PERS-04 | Read-only persona UI guardrail | Already partially met — needs confirmation |
| LLM-03 | Structured gateway error states | Needs implementation |

---

## Existing Code — What We Found

### types.ts (current state)

```typescript
export interface ValidationResult {
  fit: string[];
  friction: string[];
  questions: string[];
  refinements: string[];
}
```

**What must change:** Each section becomes `Finding[]` where:
```typescript
export interface Finding {
  text: string;
  sources: string[];  // persona field names, e.g. ['pain_points', 'review_lens']
}

export interface ValidationResult {
  fit: Finding[];
  friction: Finding[];
  questions: Finding[];
  refinements: Finding[];
}
```

This is a **single-file breaking change** that propagates to 6 other files via TypeScript compiler errors — exactly the mechanism to catch all update sites.

### tool.ts (current state)

```typescript
// input_schema section items:
fit: { type: 'array', items: { type: 'string' } }
```

**What must change:** Each section's `items` must become the `Finding` object schema:
```typescript
fit: {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      text:    { type: 'string' },
      sources: { type: 'array', items: { type: 'string' } },
    },
    required: ['text', 'sources'],
  }
}
```

`parseToolResult` is a 5-line pass-through. The existing cast `(input['fit'] as string[])` must change to `(input['fit'] as Finding[]) ?? []`. Since the LLM tool input is already validated by the JSON schema, no defensive mapping is needed here.

### llm.ts (current state)

`GatewayClient.complete()` throws a raw `Error('submit_validation tool not called in response')` for malformed responses. No error classification exists for network/auth/rate-limit errors. The Anthropic SDK throws `Anthropic.APIError` for HTTP errors — it has `.status` (HTTP status code) and `.message` fields.

**What must change for LLM-03:**

Wrap `GatewayClient.complete()` with a try/catch that classifies errors:

```typescript
export type GatewayErrorKind = 'timeout' | 'auth' | 'rate_limit' | 'unknown';

export class GatewayError extends Error {
  constructor(public readonly kind: GatewayErrorKind, message: string) {
    super(message);
    this.name = 'GatewayError';
  }
}
```

Classification logic:
- `err.status === 401 || err.status === 403` → `'auth'`
- `err.status === 429` → `'rate_limit'`
- `err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET' || err.message.includes('timeout')` → `'timeout'`
- Everything else → `'unknown'`

`FixtureClient` needs no changes for error handling (it never fails in controlled test scenarios).

**VALD-05 audit result:** No `console.log` or debug logging found in `llm.ts`, `tool.ts`, `prompt.ts`, or `index.ts`. The `GatewayClient` constructor, `complete()`, and `FixtureClient.complete()` have zero logging. The CLI `echomind-validate.ts` only logs output (not inputs). `useValidator.ts` logs nothing. **No logging guardrail code is needed** — the codebase is already clean. The plan for VALD-05 is: add a comment in `llm.ts` and `useValidator.ts` explicitly documenting the no-log invariant, and verify no debug flags can be set to enable logging.

### prompt.ts (current state)

`buildUserMessage()` returns a prompt that asks the LLM to return findings in four sections but **does not instruct it to trace findings to persona fields**. The `submit_validation` tool schema update (in tool.ts) will structurally require `sources: []` per finding, but without a natural-language instruction in the prompt, the LLM will likely produce `sources: []` for most findings.

**What must change:** Append to `buildUserMessage()`:
```
For each finding, populate the `sources` array with the persona field names
(one or more of: goals, daily_workflow, pain_points, vocabulary, tech_comfort,
pet_peeves, review_lens) that most directly informed that finding.
If a finding draws from multiple fields, include all relevant ones.
If you cannot trace a finding to a specific field, leave sources as an empty array.
```

### SectionCard.vue (current state)

Props: `items: string[]`. The template iterates items and renders `v-html="bold(item)"` where `bold()` does a `**text**` → `<strong>` replacement on the raw string.

**What must change:**
- Prop type: `items: Finding[]`
- Template: `v-html="bold(item.text)"` (was `bold(item)`)
- Add chip row after finding text:
  ```html
  <div v-if="item.sources.length" class="chip-row d-flex flex-wrap ga-1 mt-1">
    <v-chip
      v-for="src in item.sources"
      :key="src"
      :color="fieldColor(src)"
      size="x-small"
      label
      :aria-label="`Sourced from persona field: ${src}`"
    >
      {{ src }}
    </v-chip>
  </div>
  ```
- Add `fieldColor(src: string): string` helper that maps field name → M3 color role name (see chip palette below)

**Chip color palette (from M3 theme in main.ts):**
| Persona Field | Color Role | Rationale |
|---|---|---|
| `pain_points` | `error-container` | Friction/pain signal |
| `pet_peeves` | `error` | Stronger pain signal |
| `goals` | `primary-container` | Aspiration/intent |
| `review_lens` | `primary` | Evaluation lens |
| `daily_workflow` | `success` | Process/workflow |
| `vocabulary` | `secondary-container` | Communication |
| `tech_comfort` | `info` | Technical dimension |
| `daily_workflow` | `success` | Already covered |
| Unknown/fallback | `surface-variant` | Neutral |

The `fieldColor` helper is a simple `Record<string, string>` constant — extractable to a new `apps/web/src/utils/provenance.ts` file for testability.

### useValidator.ts (current state)

- `results` is typed as `ValidationResult | null` — when `ValidationResult` changes, TS will enforce `Finding[]` shape automatically.
- `error.value` is set to `err instanceof Error ? err.message : String(err)` — a string. For LLM-03, this needs to handle `GatewayError` with `kind` field.
- The `fixtureData` is imported with `as ValidationResult` — when the type changes, the cast will still compile (TypeScript doesn't deep-check JSON imports with `as`), but the actual runtime shape will be wrong until the fixture is migrated.
- **Live mode stub** currently `throw new Error('Live gateway mode is not yet supported...')`. This throws from the catch block as a string error. Per CONTEXT.md: whether Phase 2 wires a real server-side API endpoint for the browser is Claude's discretion. Given the browser can't call Node.js APIs and a server endpoint requires infrastructure, **defer live browser mode to Phase 3**. Phase 2 LLM-03 scope for the web = structured error state for the existing live-mode throw + gateway errors from the CLI path.
- **Error handling upgrade** for `useValidator.ts`: check if `err instanceof GatewayError` and expose `err.kind` alongside `err.message` so the UI can render a type-specific error state.

### ResultsPane.vue (current state)

Three states: empty (no results, not validating), loading (isValidating), results. **No error state exists.** The `error` ref from `useValidator` is not passed to `ResultsPane.vue`.

**What must change:**
- Accept an `error` prop from the parent (App.vue passes it through)
- Add error state between the loading state and the results state:
  ```html
  <div v-else-if="error" class="...error-state...">
    <v-alert type="error" ...>
      {{ errorHeading }} / {{ errorBody }}
    </v-alert>
  </div>
  ```
- Error state replaces the results area (same container, exclusive with loading/results/empty)
- Headlines and bodies from UI-SPEC:
  - `'timeout'` → "Connection timed out" / "Check your connection and try again."
  - `'auth'` → "Authentication failed" / "Contact your ACV admin if this continues."
  - `'rate_limit'` → "Request limit reached" / "Wait a moment and try again."
  - `'unknown'` → "Something went wrong" / "Try again — if it keeps happening, check the engine logs."

### InputPane.vue — PERS-04

Current state: `v-select` with `readonly` attribute — **already correct**. No tooltip, no edit button, no link to persona editing is present. PERS-04 is architecturally satisfied by the absence of any edit affordance. **No changes needed.** The plan should confirm this with a `grep` for `edit|authoring|link.*persona` to prove no path was introduced.

### echomind-validate.ts (CLI) — Current

```typescript
result.fit.forEach(f => console.log(`- ${f}`));
```

**What must change:** `f` is now `Finding`, not `string`:
```typescript
result.fit.forEach(f => {
  const ann = f.sources.length ? ` *(${f.sources.join(', ')})*` : '';
  console.log(`- ${f.text}${ann}`);
});
```

Apply the same pattern to `friction`, `questions`, `refinements`. The JSON output path (`--output-format json`) gets the new shape automatically via `JSON.stringify(result)` — no change needed there.

### Fixture migration — gm-auctions-snapshot.json

Currently: `{ fit: string[], friction: string[], questions: string[], refinements: string[] }`

Must become: `{ fit: Finding[], friction: Finding[], questions: Finding[], refinements: Finding[] }`

Migration rule: wrap each string `s` as `{ text: s, sources: [] }`. Empty `sources` is correct per D-03 — the old fixture has no provenance data. `FixtureClient.complete()` returns `JSON.parse(raw) as ValidationResult` — after migration, the cast will be valid.

**`useValidator.ts` fixture import**: `import fixtureData from '../../../../fixtures/responses/gm-auctions-snapshot.json'` — after fixture migration, TypeScript's inferred type from the JSON will include `text` and `sources`, matching the new `Finding` type. The `as ValidationResult` cast may need updating to be more precise, or can stay as-is since the shapes will align.

---

## Wave Decomposition (Recommended)

### Wave 1 — Foundation (everything else depends on this)
- **02-01** — Engine types + tool schema (`types.ts`, `tool.ts`) — VALD-03, VALD-04

### Wave 2 — Parallel implementations (all independent after Wave 1)
- **02-02** — Prompt provenance instruction (`prompt.ts`) — VALD-03
- **02-03** — Gateway error handling + VALD-05 audit (`llm.ts`) — LLM-03, VALD-05
- **02-04** — Fixture migration (`fixtures/responses/gm-auctions-snapshot.json`) — VALD-04

### Wave 3 — Surfaces (parallel, depend on Wave 1 + Wave 2)
- **02-05** — Web app: provenance chips + error state + PERS-04 confirm (`SectionCard.vue`, `ResultsPane.vue`, `useValidator.ts`, `App.vue`, new `provenance.ts`) — VALD-03, LLM-03, PERS-04
- **02-06** — CLI annotation (`echomind-validate.ts`) — VALD-03, VALD-04

### Wave 4 — Integration gate
- **02-07** — TypeScript build verification + integration test — VALD-04 (schema parity), VALD-05 (no-leak confirm)

---

## Cross-Cutting Risks

1. **TypeScript propagation is the safety net** — changing `ValidationResult` in `types.ts` will produce TS errors at every consumer. The plan must not skip `pnpm tsc --noEmit` as the acceptance gate.
2. **Browser fixture import typing** — `useValidator.ts` imports fixture JSON and casts `as ValidationResult`. After type change, the cast remains syntactically valid even if the JSON doesn't match. Only the fixture migration (02-04) prevents a runtime mismatch. Wave 2 plans must complete before Wave 3 web plan starts.
3. **App.vue prop threading** — `error` from `useValidator()` must be passed down to `ResultsPane`. Check `App.vue` — if it currently does not pass `error` at all, the web plan must add the prop to both `App.vue` and `ResultsPane.vue`.
4. **Live browser mode** — `useValidator.ts` has a stub that throws "Live gateway mode not supported." This is intentional for Phase 1. Phase 2 should not remove this stub — it should let it throw, which surfaces as a structured `unknown` error through the new error state. No server endpoint needed in Phase 2.
5. **Fixture replay path for web** — `replayMode` loads `fixtureData as ValidationResult` directly from the JSON import. After fixture migration, the runtime shape matches. But TypeScript may not deeply infer the `Finding` type from the JSON import. Add `satisfies ValidationResult` assertion to catch any mismatch at compile time.

---

## App.vue — error prop gap (confirmed)

`App.vue` **does not pass `error` to `ResultsPane`**. The `useValidator()` destructuring:
```typescript
const { isValidating, step, results, runValidation } = useValidator();
// ↑ `error` is silently dropped here
```

`ResultsPane` receives no `error` prop and has no error state. **The web plan must:**
1. Add `error` to the `useValidator()` destructure in `App.vue`
2. Add `:error="error"` to the `<ResultsPane>` binding in `App.vue`
3. Add `error: string | null` to `ResultsPane`'s `defineProps`
4. Add error state rendering in `ResultsPane.vue` template (between loading and results states)

For Phase 2, the `error` value will be a raw string from the existing catch block. The web plan should upgrade `useValidator.ts` to expose structured error info:
- Keep `error: string | null` for the display message
- Add `errorKind: GatewayErrorKind | null` for icon/CTA selection

This requires `GatewayError` to be exported from the engine package so `useValidator.ts` can do `instanceof GatewayError`.
