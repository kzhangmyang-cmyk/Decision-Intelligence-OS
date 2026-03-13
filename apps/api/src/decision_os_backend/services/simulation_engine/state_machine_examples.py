from __future__ import annotations

from decision_os_backend.services.simulation_engine.domain import CompanyStage, CompanyState, FinanceReport, MarketSignal, OperationsReport
from decision_os_backend.services.simulation_engine.state_machine import build_state_label, determine_stage, evaluate_death_conditions


def build_state_machine_example() -> dict[str, object]:
    state = CompanyState(
        month_index=5,
        stage=CompanyStage.SURVIVE,
        cash_balance=18_500.0,
        monthly_revenue=9_400.0,
        monthly_burn=10_800.0,
        runway_months=1.7,
        founder_energy=22.0,
        capacity_points=41.0,
        active_customers=9,
        demand_signal=0.54,
        product_maturity=0.46,
        distribution_efficiency=0.42,
        brand_awareness=0.18,
        market_match=0.59,
        customer_satisfaction=0.41,
        backlog_units=92.0,
        quality_score=0.37,
        founder_workload=0.94,
        cac_estimate=860.0,
        unit_contribution_margin=520.0,
        no_growth_months=3,
        gross_margin=0.22,
        learning_velocity=0.44,
    )

    market_signal = MarketSignal(
        leads=6,
        conversion_rate=0.03,
        churn_rate=0.24,
        repeat_rate=0.10,
        satisfaction_delta=-0.08,
        competitive_pressure=0.71,
        summary="Weak demand and elevated churn indicate the line is deteriorating.",
    )

    operations_report = OperationsReport(
        delivery_capacity=54.0,
        delivery_capacity_used=54.0,
        delivered_work_units=54.0,
        backlog_units=92.0,
        backlog_delta=26.0,
        quality_score=0.37,
        quality_delta=-0.07,
        founder_workload=0.94,
        automation_efficiency=0.28,
        product_progress=0.06,
        execution_quality=0.39,
        summary="Delivery is saturated and backlog is growing faster than the team can absorb.",
    )

    finance_report = FinanceReport(
        recognized_revenue=8_900.0,
        operating_cost=14_600.0,
        gross_profit=-400.0,
        net_profit=-5_700.0,
        cash_flow=-5_700.0,
        ending_cash_balance=12_800.0,
        runway_months=0.9,
        new_customers=0,
        churned_customers=2,
        cac=860.0,
        contribution_margin_per_customer=520.0,
        death_signals=["runway_low_no_recovery", "no_growth_no_traction"],
        summary="Runway is collapsing and commercial recovery is not visible.",
    )

    death_decision = evaluate_death_conditions(state, finance_report, operations_report, market_signal)
    stage, outcome, success_reason = determine_stage(state, finance_report, market_signal)

    return {
        "state_label": build_state_label(stage),
        "death_decision": death_decision,
        "stage": stage,
        "outcome": outcome,
        "success_reason": success_reason,
    }
