from __future__ import annotations

from random import Random
from uuid import UUID

from decision_os_backend.services.simulation_engine.company_generator import CompanyGenerator
from decision_os_backend.services.simulation_engine.domain import FounderAgentInput, SimulationContext
from decision_os_backend.services.simulation_engine.founder_agent import FounderAgent


def build_founder_agent_example() -> dict[str, object]:
    context = SimulationContext(
        scenario_id=UUID("00000000-0000-0000-0000-000000000001"),
        one_line_pitch="Decision OS for AI founders",
        structured_inputs={
            "founderProfile": "Hybrid founder with product taste and willingness to sell manually.",
        },
        viability_score=74.0,
        dimension_scores={
            "demand": 72.0,
            "problem_severity": 76.0,
            "differentiation": 68.0,
            "competitive_pressure": 52.0,
            "adoption_friction": 55.0,
            "monetization": 58.0,
            "distribution_feasibility": 49.0,
            "founder_fit": 73.0,
        },
        confidence=69.0,
        company_count=1,
        duration_months=12,
        seed=7,
    )
    company = CompanyGenerator().generate_company(company_index=0, context=context, rng=Random(7))
    agent_input = FounderAgentInput(
        month_index=1,
        state=company.initial_state,
        founder_profile=company.founder_profile,
        strategy=company.strategy,
        viability_score=context.viability_score,
        confidence=context.confidence,
        dimension_scores=context.dimension_scores,
    )
    decision = FounderAgent().plan(agent_input, rng=Random(11))
    return {
        "input": agent_input,
        "output": decision,
    }
