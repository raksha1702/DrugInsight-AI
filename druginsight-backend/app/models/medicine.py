"""Medicine, regulatory label, vectorized document chunk, and ingestion models."""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Medicine(Base):
    """Normalized master record for a pharmaceutical product."""

    __tablename__ = "medicines"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    generic_name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    brand_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    active_ingredients: Mapped[str] = mapped_column(String(300), nullable=False)
    medicine_category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    dosage_form: Mapped[str] = mapped_column(String(150), nullable=False)
    product_type: Mapped[str] = mapped_column(String(100), default="Human Prescription Drug")
    rx_status: Mapped[str] = mapped_column(String(30), default="Prescription", index=True)  # 'OTC', 'Prescription'
    access_category: Mapped[str] = mapped_column(String(30), default="Category B", index=True)  # 'Category A', 'Category B', 'Category C'
    has_boxed_warning: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    controlled_substance: Mapped[str] = mapped_column(String(50), default="Non-Controlled")
    jurisdiction: Mapped[str] = mapped_column(String(100), default="United States (US-FDA)")
    manufacturer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    labels = relationship("MedicineLabel", back_populates="medicine", cascade="all, delete-orphan", lazy="selectin")


class MedicineLabel(Base):
    """Source-specific product labeling version (DailyMed SPL or openFDA)."""

    __tablename__ = "medicine_labels"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    medicine_id: Mapped[str] = mapped_column(String(100), ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # DailyMed, openFDA
    source_record_id: Mapped[str] = mapped_column(String(100), nullable=False)
    spl_set_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    spl_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    jurisdiction: Mapped[str] = mapped_column(String(50), default="US")

    # Regulatory Sections
    indications: Mapped[str] = mapped_column(Text, nullable=False)
    adverse_reactions: Mapped[str] = mapped_column(Text, nullable=False)
    contraindications: Mapped[str] = mapped_column(Text, nullable=False)
    warnings: Mapped[str] = mapped_column(Text, nullable=False)
    boxed_warning: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    drug_interactions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Provenance
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    source_updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    retrieved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    medicine = relationship("Medicine", back_populates="labels", lazy="selectin")
    chunks = relationship("DocumentChunk", back_populates="medicine_label", cascade="all, delete-orphan", lazy="selectin")


class DocumentChunk(Base):
    """Section-aware chunk with vector embedding representation."""

    __tablename__ = "document_chunks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    medicine_label_id: Mapped[str] = mapped_column(String(36), ForeignKey("medicine_labels.id", ondelete="CASCADE"), nullable=False)
    section_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding_json: Mapped[str] = mapped_column(Text, nullable=False)  # Stored as serialized vector array
    chunk_index: Mapped[int] = mapped_column(Integer, default=0)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    medicine_label = relationship("MedicineLabel", back_populates="chunks", lazy="selectin")


class IngestionRun(Base):
    """Tracks background / automated ingestion pipeline sync executions."""

    __tablename__ = "ingestion_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # DailyMed, openFDA, FDA Catalog
    status: Mapped[str] = mapped_column(String(30), default="COMPLETED")  # RUNNING, COMPLETED, FAILED
    records_fetched: Mapped[int] = mapped_column(Integer, default=0)
    records_imported: Mapped[int] = mapped_column(Integer, default=0)
    records_updated: Mapped[int] = mapped_column(Integer, default=0)
    duplicates_skipped: Mapped[int] = mapped_column(Integer, default=0)
    errors_count: Mapped[int] = mapped_column(Integer, default=0)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    summary_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
