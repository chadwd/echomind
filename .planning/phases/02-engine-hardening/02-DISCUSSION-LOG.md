# Phase 2: Engine Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-05
**Phase:** 02-engine-hardening
**Areas discussed:** Provenance schema shape, Provenance UI treatment

---

## Provenance Schema Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Each finding becomes an object | `{text: string; sources: string[]}` — breaking change, self-contained, schema parity enforced by update | ✓ |
| Parallel arrays | Keep `string[]`, add `fit_sources: string[][]` — additive but awkward to iterate | |
| Separate top-level provenance map | `{section, finding_index, sources}[]` — decoupled, non-breaking, hard to show inline | |

**User's choice:** Each finding becomes an object

---

| Option | Description | Selected |
|--------|-------------|----------|
| Field name only | `sources: ['pain_points', 'review_lens']` — simple, readable, renderable as tag | ✓ |
| Field name + quoted excerpt | `sources: ['pain_points: "Delayed appraisal data"']` — richer but LLM hallucination risk | |
| Field name + item index | `sources: ['pain_points[0]']` — precise but unreadable without YAML knowledge | |

**User's choice:** Field name only

---

| Option | Description | Selected |
|--------|-------------|----------|
| `sources: []` (empty array, allow it) | Permissive — accepts findings with no traced source, renders without chip | ✓ |
| Make sources required and non-empty | `minItems: 1` in tool schema — blocks findings with no provenance | |
| `sources` is optional (may be absent) | `sources?: string[]` — callers check for presence | |

**User's choice:** `sources: []` (empty array, allow it)

---

## Provenance UI Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Small inline chip/tag below each bullet | Always visible, Vuetify v-chip, secondary information below finding text | ✓ |
| Tooltip on hover | Underline or info icon, hover reveals sources — not visible at a glance | |
| Parenthetical inline text | `- Finding text *(pain_points)*` inline — can clutter multi-source findings | |

**User's choice:** Small inline chip/tag below each bullet

---

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle/muted | Low-contrast surfaceVariant chips, secondary information | |
| Colored by section | Chip color matches the section card (fit, friction, etc.) | |
| Colored by persona field type | Each persona field category has a consistent accent color across all sections | ✓ |

**User's choice:** Colored by persona field type (pain_points always same color, review_lens always same color, regardless of which section the finding appears in)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Italic inline annotation | `- Finding text *(pain_points, review_lens)*` — renders in markdown preview | ✓ |
| Indented sub-bullet | `- Finding text\n  - Sources: pain_points` — more verbose | |
| Skip for CLI | Terminal stays as plain strings — provenance web-only | |

**User's choice:** Italic inline annotation for CLI

---

## Claude's Discretion

- Specific chip color palette (mapping persona fields to M3 color roles)
- Error state design (timeout/auth/rate-limit classification, retry affordance, web vs CLI treatment)
- Whether live gateway API endpoint for the web browser lands in Phase 2 or Phase 3
- VALD-05 no-leak implementation (audit + guards)
- TypeScript type name for the new finding shape

## Deferred Ideas

- Error state design, live gateway scope, anti-gaming UI signaling — not discussed; user indicated ready for context after provenance areas
