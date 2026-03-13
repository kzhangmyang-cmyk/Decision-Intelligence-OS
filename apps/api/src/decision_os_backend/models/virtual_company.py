from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.enums import CompanyFinalOutcome
from decision_os_backend.models.mixins import UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from decision_os_backend.models.monthly_snapshot import MonthlySnapshot
    from decision_os_backend.models.simulation_run import SimulationRun


class VirtualCompany(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "virtual_companies"
    __table_args__ = (
        UniqueConstraint(
            "simulation_run_id",
            "company_index",
            name="uq_virtual_companies_run_company_index",
        ),
        Index("ix_virtual_companies_run_outcome", "simulation_run_id", "final_outcome"),
    )

    simulation_run_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("simulation_runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    company_index: Mapped[int] = mapped_column(Integer, nullable=False)
    company_name: Mapped[str] = mapped_column(String(120), nullable=False)
    founder_type: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    pricing_strategy: Mapped[str] = mapped_column(String(80), nullable=False)
    channel_strategy: Mapped[str] = mapped_column(String(80), nullable=False)
    final_stage: Mapped[str | None] = mapped_column(String(80), nullable=True, index=True)
    final_outcome: Mapped[CompanyFinalOutcome | None] = mapped_column(
        Enum(
            CompanyFinalOutcome,
            name="company_final_outcome",
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=True,
        index=True,
    )
    death_reason: Mapped[str | None] = mapped_column(String(120), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    simulation_run: Mapped["SimulationRun"] = relationship(back_populates="virtual_companies")
    monthly_snapshots: Mapped[list["MonthlySnapshot"]] = relationship(
        back_populates="company",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="MonthlySnapshot.month_index",
    )
