from __future__ import annotations

from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
SRC_DIR = BASE_DIR / "src"

if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from decision_os_backend.db.session import SessionLocal
from decision_os_backend.schemas.scenario import ScenarioCreate
from decision_os_backend.services.assessment_service import AssessmentService
from decision_os_backend.services.scenario_service import ScenarioService
from decision_os_backend.services.simulation_service import SimulationService


def main() -> None:
    db = SessionLocal()
    try:
        scenario_service = ScenarioService(db)
        assessment_service = AssessmentService(db)
        simulation_service = SimulationService(db)

        scenario = scenario_service.create(
            ScenarioCreate(
                one_line_pitch="Decision operating system for AI founders before they overbuild.",
                structured_inputs={
                    "targetCustomer": "AI founders, solo operators, and 2-10 person product teams.",
                    "corePain": "They commit too much build effort before validating demand, monetization, and distribution.",
                    "solution": "Structure evidence, assess viability, simulate 100 worldlines, and output an action plan.",
                    "businessModel": "Paid pilot plus subscription.",
                    "pricing": "$500-$2000 pilot",
                    "acquisitionChannels": "Founder-led outreach, niche communities, operator referrals.",
                    "founderProfile": "Hybrid founder with product and GTM range.",
                    "teamSize": "3",
                    "budget": "68000",
                    "traction": "8 interviews and 3 pilot conversations.",
                    "competitors": "Generic planning tools and analytics dashboards.",
                },
            )
        )

        assessment = assessment_service.create_for_scenario(scenario)
        simulation = simulation_service.run_for_scenario(
            scenario=scenario,
            assessment=assessment,
            company_count=12,
            duration_months=12,
        )

        print("Seed complete")
        print(f"scenario_id={scenario.id}")
        print(f"assessment_id={assessment.id}")
        print(f"simulation_id={simulation.id}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
