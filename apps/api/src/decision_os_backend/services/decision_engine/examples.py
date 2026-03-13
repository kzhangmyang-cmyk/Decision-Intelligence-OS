from __future__ import annotations

from typing import Any

from decision_os_backend.services.decision_engine.engine import RuleBasedDecisionEngine
from decision_os_backend.services.decision_engine.types import DecisionEngineResult

EXAMPLE_SCENARIO_INPUT: dict[str, Any] = {
    "one_line_pitch": "A decision operating system that helps AI founders judge, simulate, and act before they overbuild.",
    "structured_inputs": {
        "targetCustomer": "AI founders, solo operators, and 2-10 person teams validating an early wedge.",
        "corePain": "They build before knowing whether the problem is urgent enough, monetizable enough, or strategically worth pursuing.",
        "solution": "Structure evidence, score feasibility, simulate 100 constrained company worldlines, and produce an action plan.",
        "businessModel": "Paid pilot plus strategic subscription with manual report delivery before deeper automation.",
        "pricing": "$500-$2,000 paid pilot, then recurring subscription.",
        "acquisitionChannels": "Founder-led outreach, curated communities, referrals, and wedge-specific landing pages.",
        "founderProfile": "Hybrid founder with strong product judgment and willingness to sell manually first.",
        "teamSize": "3",
        "budget": "68000",
        "traction": "8 founder interviews, 3 pilot conversations, and an early landing page concept.",
        "competitors": "Generic AI research copilots, business planning tools, and startup analytics dashboards.",
        "supplementaryEvidence": [
            {"type": "landing-page", "url": "https://example.com", "note": "Niche positioning test."},
            {"type": "repo", "url": "https://github.com/example/repo", "note": "Prototype."},
        ],
    },
}

EXAMPLE_OUTPUT_SNAPSHOT: dict[str, Any] = {
    "viability_score": 76.8,
    "data_sufficiency": 100.0,
    "confidence": 82.2,
    "dimension_scores": [
        {"label": "Demand", "score": 95.0},
        {"label": "Problem Severity", "score": 72.0},
        {"label": "Differentiation", "score": 81.0},
        {"label": "Competitive Pressure", "score": 62.0},
        {"label": "Adoption Friction", "score": 58.0},
        {"label": "Monetization", "score": 84.0},
        {"label": "Distribution Feasibility", "score": 80.0},
        {"label": "Founder Fit", "score": 68.0},
    ],
    "top_risks": [
        {"title": "Adoption friction could erase early momentum."},
        {"title": "Distribution assumptions are still fragile."},
        {"title": "The product story still risks blending into generic alternatives."},
    ],
    "top_levers": [
        {"title": "A narrow user segment with painful stakes is the strongest early leverage."},
        {"title": "The monetization path is defined enough to test quickly."},
        {"title": "There is a plausible path to the first customers without waiting for scale channels."},
    ],
}


def build_example_output() -> DecisionEngineResult:
    engine = RuleBasedDecisionEngine()
    return engine.evaluate(
        one_line_pitch=EXAMPLE_SCENARIO_INPUT["one_line_pitch"],
        structured_inputs=EXAMPLE_SCENARIO_INPUT["structured_inputs"],
    )
