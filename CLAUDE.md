<!-- GSD:project-start source:PROJECT.md -->
## Project

**EchoMind**

EchoMind is a unified, governed persona library plus structured PRD validators for ACV product teams. A Product Owner points a persona at a PRD (or, post-v1, a prototype) and gets a structured take-away — fit, friction, questions, refinements — backed by traceable persona data, delivered through a polished web app and a Claude Code skill that share the same engine. Built initially as an ACV hackathon project (May 2026) and shaped from day one toward real PO/designer adoption inside ACV.

**Core Value:** A Product Owner can validate a PRD against a trusted, governed ACV persona in under a few minutes and walk away with a structured artifact they can defend, without scheduling research.

### Constraints

- **Timeline (sliver):** Hackathon demo in 2 days from 2026-05-04 (target ~2026-05-06). Web + skill + hardcoded PRD must work end-to-end.
- **Timeline (full v1):** ~2–3 weeks from 2026-05-04 to ship full v1 with Confluence input, peer-polished surfaces, gateway-routed LLM calls.
- **Tech stack (frontend):** Vue 3 + Vuetify — matches the ACVMax stack so the surface is familiar to ACV reviewers. Locked.
- **LLM routing:** Claude via ACV's existing LLM gateway/proxy. No raw API keys in this repo. Supports the no-leak guardrail.
- **Default model:** Claude Sonnet 4.6 for persona embodiment / validator runs. Reserve Opus 4.7 for harder evaluation passes if Sonnet output is too shallow. (Per `prompts/persona-system-prompt.md`.)
- **Persona schema contract:** Cannot fork from `agent-personas`. Both projects read the same YAML shape; bidirectional symmetry of the validator output schema is a desirable v2 property to discuss.
- **Privacy:** No confidential ACV data in LLM prompts/logs that leaves the gateway. Provenance must be inspectable per output finding.
- **Anti-gaming:** POs cannot tweak persona fields ad-hoc to confirm a foregone conclusion. Persona edits flow through the `agent-personas` capture skill, not the EchoMind UI.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
