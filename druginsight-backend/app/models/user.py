"""User model definition for DrugInsight AI."""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class UserRole:
    PUBLIC = "PUBLIC"
    DOCTOR = "DOCTOR"
    RESEARCHER = "RESEARCHER"
    ADMIN = "ADMIN"

    ALL = [PUBLIC, DOCTOR, RESEARCHER, ADMIN]


class User(Base):
    """User account entity with role and credential status."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(30), nullable=False, default=UserRole.PUBLIC)
    email_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Optional professional metadata (populated via verified requests)
    institution: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    department: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    medical_registration_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    licensing_authority: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    jurisdiction: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    professional_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    verification_requests = relationship("VerificationRequest", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    saved_items = relationship("SavedResearch", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    reports = relationship("ResearchReport", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
