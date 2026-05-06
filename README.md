# EchoMind

Virtual Users app for testing ACV products. Hackathon project — May 2026.

EchoMind generates and runs documented user personas against product concepts so we can pressure-test flows, copy, and decisions before real users see them. The personas are echoes of the people we build for; the app gives them voices.

## Status

Bare-bones scaffold. Structure and stack will grow as we go.

## Repo layout

```
echomind/
├── personas/        # Persona definitions as YAML (schema shared with agent-personas)
├── prompts/         # System prompt templates for persona embodiment
└── README.md
```

## Relationship to `agent-personas`

EchoMind shares its persona schema and prompt design with [`agent-personas`](https://github.com/chadwd/agent-personas) — Chad's earlier UX-review tool for ACV. Same YAML contract, different surface:

- **agent-personas** = async, single-shot UX reviews (screenshot in, good/bad/ugly report out)
- **EchoMind** = interactive chat / scenario walkthrough with personas

Both read the same `personas/*.yaml` shape. The persona-capture skill (in progress) writes that shape. No fork — just a shared contract.

## Collaborators

- [@chadwd](https://github.com/chadwd)
- [@jake9-maker](https://github.com/jake9-maker)

## Problem Statement

ACV doesn't have a single trusted source of truth for the personas we design and build for, so designers, product owners, and researchers can't actually consult them when making strategic or design decisions.

Without a way to virtually test ideas against those personas, teams either ship on misaligned opinions or wait on real user research that is often unscoped, slow, or unavailable.

## People Problem

As an ACV Product Owner, I don't have accurate, accessible personas to anchor product decisions, so I'm making bets based on personal assumptions rather than user truth.

## Company Problem

As a company, ACV is burning engineering, design, and GTM resources on product bets that lack validated user insight. Without a shared understanding of who we're building for, misaligned ideas move through the full delivery cycle before anyone can catch them.

## Company Mission

ACV's mission is to fundamentally change the automotive industry by providing trust and transparency.

## Company Goal

ACV has multiple revenue streams, but they all depend on the same thing: dealers trusting the platform enough to transact, finance, and manage their business through it.

**The Core Growth Equation:** More dealer engagement = more transactions = more attached products (Capital, Transportation, MAX) = higher revenue per dealer.

Goals by layer:

**Marketplace (Auctions)**
- Increase marketplace units sold
- Grow active buyer and seller count
- Improve transaction confidence and completion rates

**ACV MAX (Inventory Management)**
- Drive adoption among dealer partners
- Increase time dealers spend managing inventory inside MAX
- Make MAX the default tool for stocking decisions

**ACV Capital (Loans)**
- Attach financing to more transactions
- Increase loan volume per active dealer
- Reduce friction between winning a bid and funding it

**Cross-Platform**
- Increase revenue per dealer across all product lines
- Reduce churn by making the ecosystem sticky
- Ship features dealers actually want fast enough to stay ahead of Manheim and others

The meta-goal: become the operating system for how dealers run their business — not just a place to buy cars, but a platform they live in.

We can't hit those goals if we don't know who we're building for.

## How to Measure

**Headline metric:** Percentage of product decisions backed by validated user insight before development starts.

**Level 1 — Mission Alignment**
- Dealer satisfaction scores on new feature releases
- Reduction in support tickets tied to confusing or misaligned features
- NPS trends across MAX, Auctions, and Capital after launches

**Level 2 — Company Goal Metrics**
- Feature adoption rate post-launch vs. pre-Virtual Users baseline
- Time to dealer activation on new features
- Attach rate improvements across Capital and MAX
- Reduction in features that get built but never adopted
- Sprint cycles saved by catching misalignment before development starts

**Level 3 — Virtual Users App Metrics**

Speed
- Time from idea to validated concept
- Reduction in research cycles kicked off for questions the app could answer

Quality
- Ratio of validated ideas that make it to production vs. unvalidated ones
- Percentage of product decisions backed by validated user insight before development starts
- Reduction in late-stage design pivots caused by user misalignment
- Reduction in post-launch research that contradicts original assumptions

Usage
- Number of sessions per week across product teams
- Number of POs and designers actively running validations

## Working notes

- Personas are stored as YAML so the in-progress persona-capture skill can read/write them directly.
- Front-end likely Vue 3 + Vuetify (matches ACVMax stack) once we add a UI.
- Target test surface: a concept ACV product (TBD).
