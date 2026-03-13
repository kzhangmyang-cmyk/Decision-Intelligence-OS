from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.enums import SimulationRunStatus
from decision_os_backend.models.mixins import CreatedAtMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from decision_os_backend.models.scenario import Scenario
    from decision_os_backend.models.virtual_company import VirtualCompany


class SimulationRun(UUIDPrimaryKeyMixin, CreatedAtMixin, Base):
    __tablename__ = "simulation_runs"
    __table_args__ = (
        Index("ix_simulation_runs_scenario_created_at", "scenario_id", "created_at"),
    )

    scenario_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("scenarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status: Mapped[SimulationRunStatus] = mapped_column(
        Enum(
            SimulationRunStatus,
            name="simulation_run_status",
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=SimulationRunStatus.QUEUED,
        server_default=SimulationRunStatus.QUEUED.value,
        index=True,
    )
    company_count: Mapped[int] = mapped_column(Integer, nullable=False)
    duration_months: Mapped[int] = mapped_column(Integer, nullable=False)

    scenario: Mapped["Scenario"] = relationship(back_populates="simulation_runs")
    virtual_companies: Mapped[list["VirtualCompany"]] = relationship(
        back_populates="simulation_run",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="VirtualCompany.company_index",
    )
