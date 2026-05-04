# Personas

Each persona is a single YAML file describing one virtual user EchoMind can simulate.

The schema is defined and maintained by the persona-capture skill (in progress) — this folder is the destination it writes to and the source the EchoMind app reads from.

## Conventions

- One persona per file: `personas/<slug>.yaml`
- Slug is lowercase-kebab-case derived from the persona's name or role
- `_template.yaml` is a starter shape; do not treat it as authoritative — the skill is the source of truth for the schema

## Adding a persona

Until the skill is wired up, copy `_template.yaml`, rename it, and fill in what you know. Once the skill ships, it will own creation and updates.
