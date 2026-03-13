from __future__ import annotations

from random import Random
from uuid import UUID

from decision_os_backend.services.simulation_engine.company_generator import CompanyGenerator
from decision_os_backend.services.simulation_engine.domain import FounderAgentInput, MarketAgentInput, SimulationContext
from decision_os_backend.services.simulation_engine.founder_agent import FounderAgent
from decision_os_backend.services.simulation_engine.market_agent import MarketAgent


def build_market_agent_example() -> dict[str, object]:
    context = SimulationContext(
        scenario_id=UUID("00000000-0000-0000-0000-000000000002"),
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

    founder_input = FounderAgentInput(
        month_index=1,
        state=company.initial_state,
        founder_profile=company.founder_profile,
        strategy=company.strategy,
        viability_score=context.viability_score,
        confidence=context.confidence,
        dimension_scores=context.dimension_scores,
    )
    founder_decision = FounderAgent().plan(founder_input, rng=Random(11))

    market_input = MarketAgentInput(
        month_index=1,
        state=company.initial_state,
        founder_profile=company.founder_profile,
        strategy=company.strategy,
        founder_decision=founder_decision,
        viability_score=context.viability_score,
        confidence=context.confidence,
        dimension_scores=context.dimension_scores,
        market_noise=company.market_noise,
    )
    market_output = MarketAgent().react(market_input, rng=Random(17))

    return {
        "input": market_input,
        "output": market_output,
    }
