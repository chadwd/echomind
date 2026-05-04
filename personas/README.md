# Personas

Each persona is a single YAML file describing one virtual user EchoMind can simulate.

## Schema

The schema is shared with [`agent-personas`](https://github.com/chadwd/agent-personas) — both repos and the persona-capture skill (in progress) speak the same YAML. See `_template.yaml` for the canonical shape.

| Field | Type | Notes |
|---|---|---|
| `schema_version` | int | Use `1` for new personas |
| `role` | string | Job role (e.g. "General Manager") |
| `goals` | string[] | At least one professional goal |
| `daily_workflow` | string[] | Tasks this persona performs day-to-day |
| `pain_points` | string[] | At least one frustration/challenge |
| `vocabulary` | string[] | Terms this persona uses (anti-jargon) |
| `tech_comfort` | enum | `low` \| `medium` \| `high` |
| `pet_peeves` | string[] | Things they dislike |
| `review_lens` | string[] | Questions they ask when reviewing a UI — **the field that drives EchoMind chat behavior** |

## Conventions

- One persona per file: `personas/<slug>.yaml`
- Slug is lowercase-kebab-case derived from the persona's role
- The persona-capture skill is the canonical author once it ships; manual edits are fine until then

## Current personas

- `general-manager.yaml` — ported from `agent-personas` (validated, dealer-authentic)
- `_template.yaml` — starter shape; copy and rename when adding a persona

## Why this schema

Borrowed wholesale from `agent-personas` so we don't fork the contract. The `review_lens` field in particular is what makes a persona useful for evaluation — generic persona templates miss it.
