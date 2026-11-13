"""AI conversation, message history, and regulatory citation models."""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class AIConversation(Base):
    """User conversation thread with the pharmaceutical research assistant."""

    __tablename__ = "ai_conversations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="AIMessage.created_at")


class AIMessage(Base):
    """Single message entry within an AI conversation."""

    __tablename__ = "ai_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id: Mapped[str] = mapped_column(String(36), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # 'user' | 'assistant'
    content: Mapped[str] = mapped_column(Text, nullable=False)
    safety_category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    conversation = relationship("AIConversation", back_populates="messages")
    citations = relationship("AICitation", back_populates="ai_message", cascade="all, delete-orphan")


class AICitation(Base):
    """Exact source grounding citation linking response to regulatory document chunk."""

    __tablename__ = "ai_citations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ai_message_id: Mapped[str] = mapped_column(String(36), ForeignKey("ai_messages.id", ondelete="CASCADE"), nullable=False)
    document_chunk_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    medicine_label_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    cited_text: Mapped[str] = mapped_column(Text, nullable=False)
    source_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    ai_message = relationship("AIMessage", back_populates="citations")
