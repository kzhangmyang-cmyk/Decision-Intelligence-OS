from __future__ import annotations

from typing import TYPE_CHECKING, Any

from sqlalchemy import Text, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.mixins import CreatedAtMixin, UUIDPrimaryKeyMixin, UpdatedAtMixin

if TYPE_CHECKING:
    from decision_os_backend.models.decision_assessment import DecisionAssessment
    from decision_os_backend.models.experiment_plan import ExperimentPlan
    from decision_os_backend.models.simulation_run import SimulationRun


class Scenario(UUIDPrimaryKeyMixin, CreatedAtMixin, UpdatedAtMixin, Base):
    __tablename__ = "scenarios"

    one_line_pitch: Mapped[str] = mapped_column(Text, nullable=False)
    structured_inputs: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        nullable=False,
        default=dict,
        server_default=text("'{}'::jsonb"),
    )

    assessments: Mapped[list["DecisionAssessment"]] = relationship(
        back_populates="scenario",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="DecisionAssessment.created_at.desc()",
    )
    simulation_runs: Mapped[list["SimulationRun"]] = relationship(
        back_populates="scenario",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="SimulationRun.created_at.desc()",
    )
    experiment_plans: Mapped[list["ExperimentPlan"]] = relationship(
        back_populates="scenario",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="ExperimentPlan.stage_order",
    )
