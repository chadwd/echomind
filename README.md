# EchoMind

Virtual Users app for testing ACV products. Hackathon project — May 2026.

EchoMind generates and runs documented user personas against product concepts so we can pressure-test flows, copy, and decisions before real users see them. The personas are echoes of the people we build for; the app gives them voices.

## Status

Bare-bones scaffold. Structure and stack will grow as we go.

## Repo layout

```
echomind/
├── personas/        # Persona definitions as YAML (schema driven by the persona-capture skill)
└── README.md
```

## Collaborators

- [@chadwd](https://github.com/chadwd)
- [@jake9-maker](https://github.com/jake9-maker)

## Working notes

- Personas are stored as YAML so the in-progress persona-capture skill can read/write them directly.
- Front-end likely Vue 3 + Vuetify (matches ACVMax stack) once we add a UI.
- Target test surface: a concept ACV product (TBD).
