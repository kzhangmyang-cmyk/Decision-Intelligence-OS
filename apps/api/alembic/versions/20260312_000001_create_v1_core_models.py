"""create v1 core models

Revision ID: 20260312_000001
Revises:
Create Date: 2026-03-12 00:00:01
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "20260312_000001"
down_revision = None
branch_labels = None
depends_on = None


simulation_run_status = postgresql.ENUM(
    "queued",
    "running",
    "completed",
    "failed",
    name="simulation_run_status",
    create_type=False,
)

company_final_outcome = postgresql.ENUM(
    "explore",
    "survive",
    "sustainable",
    "scalable",
    "dead",
    name="company_final_outcome",
    create_type=False,
)

experiment_plan_decision = postgresql.ENUM(
    "go",
    "adjust",
    "stop",
    name="experiment_plan_decision",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    simulation_run_status.create(bind, checkfirst=True)
    company_final_outcome.create(bind, checkfirst=True)
    experiment_plan_decision.create(bind, checkfirst=True)

    op.create_table(
        "scenarios",
        sa.Column("one_line_pitch", sa.Text(), nullable=False),
        sa.Column("structured_inputs", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb"), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_scenarios")),
    )

    op.create_table(
        "decision_assessments",
        sa.Column("scenario_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("viability_score", sa.Float(), nullable=False),
        sa.Column("dimension_scores", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("data_sufficiency", sa.Float(), nullable=False),
        sa.Column("confidence", sa.Float(), nullable=False),
        sa.Column("top_risks", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("top_levers", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("suggested_paths", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("next_best_experiments", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'[]'::jsonb"), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["scenario_id"], ["scenarios.id"], name=op.f("fk_decision_assessments_scenario_id_scenarios"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_decision_assessments")),
    )
    op.create_index(op.f("ix_decision_assessments_scenario_id"), "decision_assessments", ["scenario_id"], unique=False)
    op.create_index("ix_decision_assessments_scenario_created_at", "decision_assessments", ["scenario_id", "created_at"], unique=False)

    op.create_table(
        "simulation_runs",
        sa.Column("scenario_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("status", simulation_run_status, server_default="queued", nullable=False),
        sa.Column("company_count", sa.Integer(), nullable=False),
        sa.Column("duration_months", sa.Integer(), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["scenario_id"], ["scenarios.id"], name=op.f("fk_simulation_runs_scenario_id_scenarios"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_simulation_runs")),
    )
    op.create_index(op.f("ix_simulation_runs_scenario_id"), "simulation_runs", ["scenario_id"], unique=False)
    op.create_index(op.f("ix_simulation_runs_status"), "simulation_runs", ["status"], unique=False)
    op.create_index("ix_simulation_runs_scenario_created_at", "simulation_runs", ["scenario_id", "created_at"], unique=False)

    op.create_table(
        "experiment_plans",
        sa.Column("scenario_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("stage_order", sa.Integer(), server_default="0", nullable=False),
        sa.Column("stage_label", sa.String(length=50), nullable=False),
        sa.Column("action", sa.Text(), nullable=False),
        sa.Column("metric", sa.String(length=120), nullable=False),
        sa.Column("threshold", sa.String(length=120), nullable=False),
        sa.Column("fallback_suggestion", sa.Text(), nullable=True),
        sa.Column("decision", experiment_plan_decision, server_default="adjust", nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["scenario_id"], ["scenarios.id"], name=op.f("fk_experiment_plans_scenario_id_scenarios"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_experiment_plans")),
    )
    op.create_index(op.f("ix_experiment_plans_decision"), "experiment_plans", ["decision"], unique=False)
    op.create_index(op.f("ix_experiment_plans_scenario_id"), "experiment_plans", ["scenario_id"], unique=False)
    op.create_index(op.f("ix_experiment_plans_stage_label"), "experiment_plans", ["stage_label"], unique=False)
    op.create_index("ix_experiment_plans_scenario_stage", "experiment_plans", ["scenario_id", "stage_order", "stage_label"], unique=False)

    op.create_table(
        "virtual_companies",
        sa.Column("simulation_run_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("company_index", sa.Integer(), nullable=False),
        sa.Column("company_name", sa.String(length=120), nullable=False),
        sa.Column("founder_type", sa.String(length=80), nullable=False),
        sa.Column("pricing_strategy", sa.String(length=80), nullable=False),
        sa.Column("channel_strategy", sa.String(length=80), nullable=False),
        sa.Column("final_stage", sa.String(length=80), nullable=True),
        sa.Column("final_outcome", company_final_outcome, nullable=True),
        sa.Column("death_reason", sa.String(length=120), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(["simulation_run_id"], ["simulation_runs.id"], name=op.f("fk_virtual_companies_simulation_run_id_simulation_runs"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_virtual_companies")),
        sa.UniqueConstraint("simulation_run_id", "company_index", name="uq_virtual_companies_run_company_index"),
    )
    op.create_index(op.f("ix_virtual_companies_final_outcome"), "virtual_companies", ["final_outcome"], unique=False)
    op.create_index(op.f("ix_virtual_companies_final_stage"), "virtual_companies", ["final_stage"], unique=False)
    op.create_index(op.f("ix_virtual_companies_founder_type"), "virtual_companies", ["founder_type"], unique=False)
    op.create_index(op.f("ix_virtual_companies_simulation_run_id"), "virtual_companies", ["simulation_run_id"], unique=False)
    op.create_index("ix_virtual_companies_run_outcome", "virtual_companies", ["simulation_run_id", "final_outcome"], unique=False)

    op.create_table(
        "monthly_snapshots",
        sa.Column("company_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("month_index", sa.Integer(), nullable=False),
        sa.Column("state_json", postgresql.JSONB(astext_type=sa.Text()), server_default=sa.text("'{}'::jsonb"), nullable=False),
        sa.Column("judge_summary", sa.Text(), nullable=True),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(["company_id"], ["virtual_companies.id"], name=op.f("fk_monthly_snapshots_company_id_virtual_companies"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_monthly_snapshots")),
        sa.UniqueConstraint("company_id", "month_index", name="uq_monthly_snapshots_company_month"),
    )
    op.create_index(op.f("ix_monthly_snapshots_company_id"), "monthly_snapshots", ["company_id"], unique=False)
    op.create_index("ix_monthly_snapshots_company_month", "monthly_snapshots", ["company_id", "month_index"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_monthly_snapshots_company_month", table_name="monthly_snapshots")
    op.drop_index(op.f("ix_monthly_snapshots_company_id"), table_name="monthly_snapshots")
    op.drop_table("monthly_snapshots")

    op.drop_index("ix_virtual_companies_run_outcome", table_name="virtual_companies")
    op.drop_index(op.f("ix_virtual_companies_simulation_run_id"), table_name="virtual_companies")
    op.drop_index(op.f("ix_virtual_companies_founder_type"), table_name="virtual_companies")
    op.drop_index(op.f("ix_virtual_companies_final_stage"), table_name="virtual_companies")
    op.drop_index(op.f("ix_virtual_companies_final_outcome"), table_name="virtual_companies")
    op.drop_table("virtual_companies")

    op.drop_index("ix_experiment_plans_scenario_stage", table_name="experiment_plans")
    op.drop_index(op.f("ix_experiment_plans_stage_label"), table_name="experiment_plans")
    op.drop_index(op.f("ix_experiment_plans_scenario_id"), table_name="experiment_plans")
    op.drop_index(op.f("ix_experiment_plans_decision"), table_name="experiment_plans")
    op.drop_table("experiment_plans")

    op.drop_index("ix_simulation_runs_scenario_created_at", table_name="simulation_runs")
    op.drop_index(op.f("ix_simulation_runs_status"), table_name="simulation_runs")
    op.drop_index(op.f("ix_simulation_runs_scenario_id"), table_name="simulation_runs")
    op.drop_table("simulation_runs")

    op.drop_index("ix_decision_assessments_scenario_created_at", table_name="decision_assessments")
    op.drop_index(op.f("ix_decision_assessments_scenario_id"), table_name="decision_assessments")
    op.drop_table("decision_assessments")

    op.drop_table("scenarios")

    bind = op.get_bind()
    company_final_outcome.drop(bind, checkfirst=True)
    experiment_plan_decision.drop(bind, checkfirst=True)
    simulation_run_status.drop(bind, checkfirst=True)
