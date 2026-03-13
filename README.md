# Decision Intelligence OS

Decision Intelligence OS is a startup decision system for AI founders, solo operators, and 2-10 person teams.

It is not a generic startup copilot and it is not a business-plan generator. It is a constrained operating system that answers three questions in order:

1. Is this idea worth doing now?
2. If we do it, how does it evolve across 100 parallel worldlines?
3. What is the next lowest-cost experiment or action that materially improves the odds?

## Core Loop

`Assess -> Simulate -> Act`

- `Assess`: convert unstructured founder input into a structured scenario, score it, estimate data sufficiency and confidence, and surface the top risks and leverage points.
- `Simulate`: run 100 virtual companies that share the same core idea but differ in founder type, pricing, channel, automation, execution speed, and market noise.
- `Act`: turn assessment and simulation outcomes into staged plans, stop-loss rules, and Next Best Experiments.

## Architecture Thesis

This repository follows a product architecture that combines:

- `MiroFish`: world modeling -> agent profile generation -> simulation -> report
- `Paperclip`: org chart, heartbeat scheduling, budget constraints, audit logs, multi-company isolation
- `OS2.0`: decision engine, scoring system, data sufficiency, confidence, feedback loop, Next Best Experiment

The core differentiation is not advice quality alone. It is `100 parallel virtual company simulations` for the same startup idea under hard commercial constraints.

## What Makes This Different

- `Decision-first, not simulation-first`: the system checks whether there is enough evidence for serious judgment before deep simulation.
- `State-driven, not chat-driven`: each company evolves through explicit state changes instead of open-ended agent conversation.
- `Heartbeat execution`: simulation runs on monthly operating cycles with a fixed execution order.
- `Hard constraints`: cash, runway, founder energy, delivery capacity, CAC, and hiring overhead are treated as real limits.
- `Auditability`: each company can be replayed through snapshots, actions, market feedback, finance results, and judge summaries.

## Simulation Model

Each simulation instance contains five fixed agents:

- `Founder Agent`: pricing, channels, hiring, product priorities, pivot decisions
- `Market Agent`: leads, conversion, churn, demand shifts, price sensitivity
- `Operations Agent`: capacity, backlog, quality, support load, founder overload
- `Finance Agent`: revenue, cost, profit, cash, runway, death conditions
- `Judge Agent`: stage labels, causal explanations, audit log, replay summaries

All companies share the same idea and market direction, but vary on:

- founder archetype
- pricing strategy
- channel strategy
- automation level
- risk tolerance
- execution speed
- hiring threshold
- feedback elasticity
- market noise

## Current Repository Scope

### Frontend

- Scenario intake
- Assessment report
- Planner page
- Simulation overview
- Single-company replay page
- Landing page aligned to the Assess / Simulate / Act narrative

### Backend

- FastAPI API
- PostgreSQL persistence
- Alembic migrations
- Rule-based assessment engine
- State-driven simulation engine
- Planner service
- Demo seed script for local preview

## Repository Layout

```text
.
|-- apps/
|   |-- api/   # FastAPI backend, Alembic migrations, simulation services
|   `-- web/   # Next.js frontend for intake, report, planner, simulation, replay
`-- README.md
```

## Local Development

### Web

```bash
cd apps/web
npm install
npm run dev
```

### API

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -e .[dev]
copy .env.example .env
alembic upgrade head
uvicorn decision_os_backend.main:app --reload --app-dir src
```

Optional demo seed:

```bash
cd apps/api
python scripts/seed_demo.py
```

## Intended Output

For each startup idea, the system should eventually produce:

- structured project summary
- viability score and 8-dimension scoring
- data sufficiency score
- confidence score
- top risks and top leverage points
- 1 / 6 / 12 / 24 month survival rates
- profitability path and death-reason distribution
- best strategy path
- best founder profile fit
- top three Next Best Experiments
- phase-based plan for Day 1, Week 1, Month 1, Month 3, Month 6

## Status

This repository is in active build mode. The main loop is already visible end-to-end:

- intake -> assessment
- assessment -> simulation
- simulation -> planner
- planner/report/simulation -> frontend rendering

The next layer of work is increasing realism, explainability, and replay depth.
