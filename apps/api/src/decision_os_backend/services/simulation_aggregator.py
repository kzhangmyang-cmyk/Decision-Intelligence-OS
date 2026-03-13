from __future__ import annotations

from collections import defaultdict
from typing import Any

from decision_os_backend.models.monthly_snapshot import MonthlySnapshot
from decision_os_backend.models.simulation_run import SimulationRun
from decision_os_backend.models.virtual_company import VirtualCompany
from decision_os_backend.schemas.simulation import (
    CompanyDetailRead,
    CompanyTimelineEntryRead,
    CompanyTimelineRead,
    SimulationCompanyListRead,
    SimulationComparisonPoint,
    SimulationDistributionPoint,
    SimulationOverviewRead,
    SimulationTrendPoint,
    VirtualCompanyRead,
)


class SimulationAggregator:
    """Builds frontend-friendly simulation overview and replay payloads from persisted models."""

    def build_overview(self, simulation_run: SimulationRun) -> SimulationOverviewRead:
        companies = list(simulation_run.virtual_companies)
        survival_curve = self._build_survival_curve(companies, simulation_run.duration_months)
        profitability_curve = self._build_profitability_curve(companies, simulation_run.duration_months)
        death_reason_distribution = self._build_death_reason_distribution(companies)
        founder_type_performance = self._build_comparison(companies, key="founder_type")
        strategy_type_performance = self._build_comparison(
            companies,
            key=lambda company: f"{company.pricing_strategy}/{company.channel_strategy}",
        )

        return SimulationOverviewRead(
            id=simulation_run.id,
            scenario_id=simulation_run.scenario_id,
            status=simulation_run.status,
            company_count=simulation_run.company_count,
            duration_months=simulation_run.duration_months,
            created_at=simulation_run.created_at,
            survival_curve=survival_curve,
            profitability_curve=profitability_curve,
            death_reason_distribution=death_reason_distribution,
            founder_type_performance=founder_type_performance,
            strategy_type_performance=strategy_type_performance,
            companies=[self._build_company_overview(company) for company in companies],
        )

    def build_company_list(self, simulation_run: SimulationRun) -> SimulationCompanyListRead:
        return SimulationCompanyListRead(
            simulation_id=simulation_run.id,
            companies=[self._build_company_overview(company) for company in simulation_run.virtual_companies],
        )

    def build_company_detail(self, company: VirtualCompany) -> CompanyDetailRead:
        latest_snapshot = self._latest_snapshot(company)
        state_json = latest_snapshot.state_json if latest_snapshot else {}
        judge_payload = state_json.get("judge_report", {})

        overview = self._build_company_overview(company)
        return CompanyDetailRead(
            **overview.model_dump(by_alias=False),
            judge_summary=latest_snapshot.judge_summary if latest_snapshot else company.summary,
            replay_log=str(judge_payload.get("replay_log")) if judge_payload.get("replay_log") is not None else None,
            causes=[str(item) for item in judge_payload.get("causes", [])],
            success_reason=str(judge_payload.get("success_reason")) if judge_payload.get("success_reason") is not None else None,
        )

    def build_company_timeline(self, company: VirtualCompany) -> CompanyTimelineRead:
        entries = [self._build_timeline_entry(snapshot) for snapshot in company.monthly_snapshots]
        return CompanyTimelineRead(
            company_id=company.id,
            simulation_run_id=company.simulation_run_id,
            timeline=entries,
        )

    def _build_company_overview(self, company: VirtualCompany) -> VirtualCompanyRead:
        latest_snapshot = self._latest_snapshot(company)
        state = latest_snapshot.state_json.get("state", {}) if latest_snapshot else {}
        finance_payload = latest_snapshot.state_json.get("finance_report", {}) if latest_snapshot else {}
        judge_payload = latest_snapshot.state_json.get("judge_report", {}) if latest_snapshot else {}
        monthly_revenue = float(state.get("monthly_revenue", 0.0))
        net_profit = float(finance_payload.get("net_profit", 0.0))
        profitability = round((net_profit / monthly_revenue) * 100.0, 1) if monthly_revenue > 0 else 0.0

        return VirtualCompanyRead(
            id=company.id,
            simulation_run_id=company.simulation_run_id,
            company_index=company.company_index,
            company_name=company.company_name,
            founder_type=company.founder_type,
            pricing_strategy=company.pricing_strategy,
            channel_strategy=company.channel_strategy,
            final_stage=company.final_stage,
            final_outcome=company.final_outcome,
            death_reason=company.death_reason,
            summary=company.summary,
            latest_month_index=int(state.get("month_index", latest_snapshot.month_index if latest_snapshot else 0)),
            latest_cash_balance=float(state.get("cash_balance", 0.0)),
            latest_runway_months=float(finance_payload.get("runway_months", state.get("runway_months", 0.0))),
            latest_monthly_revenue=monthly_revenue,
            latest_profitability=profitability,
            latest_founder_energy=float(state.get("founder_energy", 0.0)),
            latest_state_label=str(judge_payload.get("state_label") or company.final_stage or "unknown"),
            latest_score=float(judge_payload.get("score", 0.0)),
        )

    def _build_survival_curve(self, companies: list[VirtualCompany], duration_months: int) -> list[SimulationTrendPoint]:
        total = max(len(companies), 1)
        curve: list[SimulationTrendPoint] = []
        for month_index in range(1, duration_months + 1):
            alive_count = 0
            for company in companies:
                snapshot = self._snapshot_for_month(company, month_index)
                if snapshot is None:
                    continue
                state = snapshot.state_json.get("state", {})
                if str(state.get("stage")) != "dead":
                    alive_count += 1
            curve.append(SimulationTrendPoint(label=f"M{month_index}", value=round((alive_count / total) * 100.0, 1)))
        return curve

    def _build_profitability_curve(self, companies: list[VirtualCompany], duration_months: int) -> list[SimulationTrendPoint]:
        total = max(len(companies), 1)
        curve: list[SimulationTrendPoint] = []
        for month_index in range(1, duration_months + 1):
            profitable = 0
            for company in companies:
                snapshot = self._snapshot_for_month(company, month_index)
                if snapshot is None:
                    continue
                finance_payload = snapshot.state_json.get("finance_report", {})
                if float(finance_payload.get("net_profit", 0.0)) > 0:
                    profitable += 1
            curve.append(SimulationTrendPoint(label=f"M{month_index}", value=round((profitable / total) * 100.0, 1)))
        return curve

    def _build_death_reason_distribution(self, companies: list[VirtualCompany]) -> list[SimulationDistributionPoint]:
        counts: dict[str, int] = defaultdict(int)
        for company in companies:
            if company.death_reason:
                counts[company.death_reason] += 1
        return [
            SimulationDistributionPoint(label=label, value=value)
            for label, value in sorted(counts.items(), key=lambda item: item[1], reverse=True)
        ]

    def _build_comparison(self, companies: list[VirtualCompany], key: str | Any) -> list[SimulationComparisonPoint]:
        grouped: dict[str, list[VirtualCompany]] = defaultdict(list)
        for company in companies:
            label = key(company) if callable(key) else getattr(company, key)
            grouped[str(label)].append(company)

        points: list[SimulationComparisonPoint] = []
        for label, items in grouped.items():
            count = len(items)
            survival_count = sum(1 for item in items if item.final_outcome and item.final_outcome != "dead")
            profitable_count = 0
            scores: list[float] = []
            for item in items:
                latest = self._latest_snapshot(item)
                if latest is None:
                    continue
                judge_payload = latest.state_json.get("judge_report", {})
                finance_payload = latest.state_json.get("finance_report", {})
                scores.append(float(judge_payload.get("score", 0.0)))
                if float(finance_payload.get("net_profit", 0.0)) > 0:
                    profitable_count += 1

            points.append(
                SimulationComparisonPoint(
                    label=label,
                    outcome_score=round(sum(scores) / max(len(scores), 1), 1),
                    survival_rate=round((survival_count / max(count, 1)) * 100.0, 1),
                    profitability_rate=round((profitable_count / max(count, 1)) * 100.0, 1),
                    count=count,
                )
            )

        return sorted(points, key=lambda item: item.outcome_score, reverse=True)

    def _build_timeline_entry(self, snapshot: MonthlySnapshot) -> CompanyTimelineEntryRead:
        state = snapshot.state_json.get("state", {})
        market = snapshot.state_json.get("market_signal", {})
        operations = snapshot.state_json.get("operations_report", {})
        finance = snapshot.state_json.get("finance_report", {})
        judge = snapshot.state_json.get("judge_report", {})
        key_events = [str(item) for item in snapshot.state_json.get("key_events", [])]

        return CompanyTimelineEntryRead(
            month_index=snapshot.month_index,
            stage=str(state.get("stage", judge.get("stage", "unknown"))),
            state_label=str(judge.get("state_label", "Unknown")),
            cash_balance=float(state.get("cash_balance", 0.0)),
            monthly_revenue=float(state.get("monthly_revenue", 0.0)),
            founder_energy=float(state.get("founder_energy", 0.0)),
            backlog_units=float(operations.get("backlog_units", 0.0)),
            quality_score=float(operations.get("quality_score", 0.0)),
            leads=int(market.get("leads", 0)),
            conversion_rate=float(market.get("conversion_rate", 0.0)),
            churn_rate=float(market.get("churn_rate", 0.0)),
            repeat_rate=float(market.get("repeat_rate", 0.0)),
            satisfaction_delta=float(market.get("satisfaction_delta", 0.0)),
            net_profit=float(finance.get("net_profit", 0.0)),
            runway_months=float(finance.get("runway_months", state.get("runway_months", 0.0))),
            judge_summary=snapshot.judge_summary,
            replay_log=str(judge.get("replay_log", "")),
            key_events=key_events,
            death_signals=[str(item) for item in finance.get("death_signals", [])],
        )

    def _latest_snapshot(self, company: VirtualCompany) -> MonthlySnapshot | None:
        return company.monthly_snapshots[-1] if company.monthly_snapshots else None

    def _snapshot_for_month(self, company: VirtualCompany, month_index: int) -> MonthlySnapshot | None:
        for snapshot in company.monthly_snapshots:
            if snapshot.month_index == month_index:
                return snapshot
        return None
