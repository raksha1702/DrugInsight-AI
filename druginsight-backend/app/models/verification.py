"""Professional verification requests and supporting document models."""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class VerificationStatus:
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    MORE_INFO_REQUIRED = "MORE_INFO_REQUIRED"
    REVOKED = "REVOKED"


class VerificationRequest(Base):
    """Statutory credential verification request submitted by a practitioner."""

    __tablename__ = "verification_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    requested_role: Mapped[str] = mapped_column(String(30), nullable=False)

    # Doctor credentials
    registration_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    licensing_authority: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    jurisdiction: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Common / Researcher credentials
    institution: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    professional_email: Mapped[str] = mapped_column(String(255), nullable=False)

    # Audit & Status
    status: Mapped[str] = mapped_column(String(30), default=VerificationStatus.PENDING, index=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    # Relationships
    user = relationship("User", back_populates="verification_requests", lazy="selectin")
    documents = relationship("VerificationDocument", back_populates="verification_request", cascade="all, delete-orphan", lazy="selectin")


class VerificationDocument(Base):
    """Encrypted metadata for uploaded credential proofs."""

    __tablename__ = "verification_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    verification_request_id: Mapped[str] = mapped_column(String(36), ForeignKey("verification_requests.id", ondelete="CASCADE"), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, default=0)
    file_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    verification_request = relationship("VerificationRequest", back_populates="documents")
