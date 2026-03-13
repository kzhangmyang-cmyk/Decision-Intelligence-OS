from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import Float, ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.mixins import CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from decision_os_backend.models.scenario import Scenario


class DecisionAssessment(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "decision_assessments"
    __table_args__ = (
        Index("ix_decision_assessments_scenario_created_at", "scenario_id", "created_at"),
    )

    scenario_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("scenarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    viability_score: Mapped[float] = mapped_column(Float, nullable=False)
    dimension_scores: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )
    data_sufficiency: Mapped[float] = mapped_column(Float, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    top_risks: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )
    top_levers: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )
    suggested_paths: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )
    next_best_experiments: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=False,
        default=list,
        server_default=text("'[]'::jsonb"),
    )

    scenario: Mapped["Scenario"] = relationship(back_populates="assessments")
