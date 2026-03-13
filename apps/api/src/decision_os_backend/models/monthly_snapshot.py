from __future__ import annotations

import uuid
from typing import TYPE_CHECKING, Any

from sqlalchemy import ForeignKey, Index, Integer, Text, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from decision_os_backend.db.base import Base
from decision_os_backend.models.mixins import UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from decision_os_backend.models.virtual_company import VirtualCompany


class MonthlySnapshot(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "monthly_snapshots"
    __table_args__ = (
        UniqueConstraint("company_id", "month_index", name="uq_monthly_snapshots_company_month"),
        Index("ix_monthly_snapshots_company_month", "company_id", "month_index"),
    )

    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("virtual_companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    month_index: Mapped[int] = mapped_column(Integer, nullable=False)
    state_json: Mapped[dict[str, Any]] = mapped_column(
        JSONB,
        nullable=False,
        default=dict,
        server_default=text("'{}'::jsonb"),
    )
    judge_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    company: Mapped["VirtualCompany"] = relationship(back_populates="monthly_snapshots")
