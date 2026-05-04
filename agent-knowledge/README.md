# Agent Knowledge

Reasoning logs for sessions where the EchoMind direction is shaped, debated, or changed. Companion to `planning/` — planning files capture *what* we decided, agent-knowledge files capture *why*.

## What lives here

Each file is a session log. One file per session, numbered sequentially:

```
session-001-whiteboarding.md
session-002-<topic>.md
session-003-<topic>.md
...
```

A session log should answer:

- **Why this session happened** — the gap or risk that triggered it
- **Starting state** — what existed in the repo / mental model going in
- **What we worked through** — narrative of the session, with the unlocks and reframes that mattered
- **Problems faced** — what we got stuck on, and how each got resolved
- **What we're moving forward with** — the current direction after the session
- **Open threads** — what future sessions need to pick up

If a decision in an earlier log turns out to be wrong, **don't silently overwrite it** — add a new session log that explains the new reasoning and why the prior call was reversed. The trail matters more than any single conclusion.

## What does NOT live here

- Specs, PRDs, or planning artifacts (those go in `planning/`)
- Code documentation (README, ARCHITECTURE, etc. live at the appropriate level)
- Day-to-day task tracking (use issues, todos, or commit messages)

## When to add a new log

Add one when a session meaningfully shapes the product direction — kickoffs, scope changes, pivots, scope cuts, big architectural calls. Don't log routine implementation work.

## Why this folder exists

EchoMind is being built by multiple people (Chad, Jake, future collaborators) with AI assistance across many sessions. Without a reasoning log, decisions get relitigated, scope drifts, and "why did we do it this way?" becomes unanswerable two months in. This folder is the load-bearing memory of the *thinking* behind the work, not just the work.
