"""Medicine comparison record model."""

import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class MedicineComparison(Base):
    """Saved side-by-side comparison between two pharmaceutical monographs."""

    __tablename__ = "medicine_comparisons"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    medicine_a_id: Mapped[str] = mapped_column(String(100), ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False)
    medicine_b_id: Mapped[str] = mapped_column(String(100), ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
