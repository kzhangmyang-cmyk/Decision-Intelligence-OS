# Astrolabe Decision Simulator Backend

FastAPI backend for the Astrolabe Decision Simulator product.

## What is in V1

- Scenario intake APIs
- Rule-based decision assessment engine
- Synchronous simulation execution for V1
- Simulation aggregation payloads for frontend overview and replay pages
- Service-layer structure for future planner, async jobs, and richer engines

## API routes

Assuming `API_V1_PREFIX=/api/v1`:

- `GET /health` - health check
- `POST /api/v1/scenarios` - create a scenario
- `GET /api/v1/scenarios/{scenario_id}` - fetch a scenario
- `POST /api/v1/scenarios/{scenario_id}/assess` - run a synchronous assessment
- `GET /api/v1/scenarios/{scenario_id}/assessment` - fetch latest assessment
- `POST /api/v1/scenarios/{scenario_id}/simulate` - run a synchronous simulation
- `GET /api/v1/scenarios/{scenario_id}/planner` - build and fetch the staged execution planner
- `GET /api/v1/simulations/{simulation_id}` - simulation overview for `/simulation`
- `GET /api/v1/simulations/{simulation_id}/companies` - company list for `/simulation`
- `GET /api/v1/companies/{company_id}` - company detail for `/simulation/[companyId]`
- `GET /api/v1/companies/{company_id}/timeline` - replay timeline for `/simulation/[companyId]`

## Service layout

- `ScenarioService` - scenario persistence and retrieval
- `AssessmentService` - rule-based decision engine orchestration and assessment persistence
- `SimulationService` - simulation execution and retrieval entrypoint
- `SimulationAggregator` - transforms simulation records into frontend-friendly overview and replay payloads
- `PlannerService` - builds staged go / adjust / stop plans from the latest assessment and simulation
- `simulation_engine/` - internal simulation modules: founder, market, operations, finance, judge, state machine, runner

## Local development

1. Create a Python 3.11+ virtual environment.
   - `python -m venv .venv`
   - `.venv\Scripts\activate`
2. Install dependencies:
   - `pip install -e .[dev]`
3. Copy env file:
   - `copy .env.example .env`
4. Make sure PostgreSQL is running and matches `DATABASE_URL`.
5. Run migrations:
   - `alembic upgrade head`
6. Start the API:
   - `uvicorn decision_os_backend.main:app --reload --app-dir src`

## Database migration steps

After model changes:

1. Create a migration:
   - `alembic revision --autogenerate -m "describe change"`
2. Review the generated file in `alembic/versions/`
3. Apply the migration:
   - `alembic upgrade head`
4. To inspect current revision:
   - `alembic current`
5. To roll back one step:
   - `alembic downgrade -1`

## Demo seed suggestion

For local frontend integration, seed one scenario, one assessment, and one smaller simulation run first:

- `python scripts/seed_demo.py`

Recommended local seed profile:

- 1 scenario with realistic intake fields
- 1 assessment record
- 1 simulation run with `12` companies for quick bootstrapping
- Later switch to `100` companies once the full loop is stable

If you want richer dev data later, add:

- one strong scenario
- one weak scenario
- one ambiguous scenario

That gives the frontend three qualitatively different report/simulation/planner states.

## Common issues

- `ModuleNotFoundError: decision_os_backend`
  - Start uvicorn with `--app-dir src`
  - Or ensure `pip install -e .[dev]` completed successfully

- `psycopg connection errors`
  - Check PostgreSQL is running
  - Verify `DATABASE_URL` in `.env`
  - Confirm the target database exists

- `alembic` points to the wrong DB
  - Make sure `.env` is present in `apps/api`
  - Confirm `alembic/env.py` is reading the same settings file

- `assessment` works but `simulation` fails
  - Ensure the scenario has an assessment first
  - The V1 simulation endpoint requires a prior assessment

- frontend gets 404 on API routes
  - Check `API_V1_PREFIX`
  - If frontend expects `/api/...`, set `API_V1_PREFIX=/api`

- stale or weird simulation data
  - Re-run the simulation for a fresh `SimulationRun`
  - Use a smaller `company_count` during debugging

## Project layout

- `src/decision_os_backend/main.py` - FastAPI entrypoint and middleware setup.
- `src/decision_os_backend/core/` - settings and application-wide infrastructure helpers.
- `src/decision_os_backend/api/` - routers, dependencies, and HTTP layer.
- `src/decision_os_backend/db/` - SQLAlchemy base metadata and session management.
- `src/decision_os_backend/models/` - database models for future domain entities.
- `src/decision_os_backend/schemas/` - Pydantic schemas for request and response models.
- `src/decision_os_backend/services/` - service layer for assessment, simulation, aggregation, and planner logic.
- `src/decision_os_backend/services/decision_engine/` - explainable, rule-based assessment engine.
- `src/decision_os_backend/services/simulation_engine/` - state-driven simulation modules and monthly heartbeat logic.
- `scripts/seed_demo.py` - lightweight local demo seed script.
- `alembic/` - migration environment and version files.

## Final directory summary

```text
apps/api
  .env.example
  .gitignore
  alembic.ini
  pyproject.toml
  README.md
  scripts/
    seed_demo.py
  alembic/
    env.py
    script.py.mako
    versions/
  src/
    decision_os_backend/
      main.py
      api/
        deps.py
        router.py
        routes/
          health.py
          scenarios.py
          simulations.py
      core/
        config.py
      db/
        base.py
        session.py
      models/
        scenario.py
        decision_assessment.py
        simulation_run.py
        virtual_company.py
        monthly_snapshot.py
        experiment_plan.py
        enums.py
        mixins.py
      schemas/
        common.py
        health.py
        scenario.py
        assessment.py
        simulation.py
        planner.py
      services/
        scenario_service.py
        assessment_service.py
        simulation_service.py
        simulation_aggregator.py
        planner_service.py
        decision_engine/
        simulation_engine/
```
