from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.enums import ExperimentPlanDecision
from decision_os_backend.models.mixins import CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from decision_os_backend.models.scenario import Scenario


class ExperimentPlan(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "experiment_plans"
    __table_args__ = (
        Index("ix_experiment_plans_scenario_stage", "scenario_id", "stage_order", "stage_label"),
    )

    scenario_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("scenarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    stage_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")
    stage_label: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    metric: Mapped[str] = mapped_column(String(120), nullable=False)
    threshold: Mapped[str] = mapped_column(String(120), nullable=False)
    fallback_suggestion: Mapped[str | None] = mapped_column(Text, nullable=True)
    decision: Mapped[ExperimentPlanDecision] = mapped_column(
        Enum(
            ExperimentPlanDecision,
            name="experiment_plan_decision",
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=ExperimentPlanDecision.ADJUST,
        server_default=ExperimentPlanDecision.ADJUST.value,
        index=True,
    )

    scenario: Mapped["Scenario"] = relationship(back_populates="experiment_plans")
