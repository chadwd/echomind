# apps/skill — EchoMind Claude Code Skill

The Claude Code skill entry point lives at `.claude/skills/echomind-validate/SKILL.md` (repo root).
This directory (`apps/skill/`) is reserved for future skill assets that need workspace tooling.

## Phase 1

Phase 1 skill = a thin markdown wrapper that invokes the engine CLI binary.
No compiled code in this directory for Phase 1.

## Claude Code invocation

Claude Code picks up skills from `.claude/skills/` at the repo root.
The skill name is `echomind-validate` — invoke as `/echomind:validate` in Claude Code.

## Engine CLI commands

See `.claude/skills/echomind-validate/SKILL.md` for full usage.
