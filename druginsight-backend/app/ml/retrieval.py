"""Hybrid semantic and keyword document retrieval service."""

import json
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.medicine import DocumentChunk, MedicineLabel, Medicine
from app.ml.embeddings import compute_deterministic_embedding, cosine_similarity

logger = logging.getLogger(__name__)


class SemanticRetriever:
    """Retrieves relevant official drug label chunks using hybrid similarity."""

    async def retrieve(
        self,
        session: AsyncSession,
        query: str,
        medicine_ids: Optional[List[str]] = None,
        section_filter: Optional[str] = None,
        top_k: int = 4,
        alpha: float = 0.75  # Weight for vector similarity vs keyword
    ) -> List[Dict[str, Any]]:
        """Retrieve most relevant chunks for user query."""
        query_embedding = compute_deterministic_embedding(query)
        q_tokens = set(query.lower().split())

        # Build query for document chunks
        stmt = (
            select(DocumentChunk, MedicineLabel, Medicine)
            .join(MedicineLabel, DocumentChunk.medicine_label_id == MedicineLabel.id)
            .join(Medicine, MedicineLabel.medicine_id == Medicine.id)
        )

        if medicine_ids:
            stmt = stmt.where(Medicine.id.in_(medicine_ids))

        if section_filter:
            stmt = stmt.where(DocumentChunk.section_name == section_filter)

        result = await session.execute(stmt)
        rows = result.all()

        scored_chunks = []
        for chunk, label, med in rows:
            # Parse embedding
            try:
                emb = json.loads(chunk.embedding_json)
                vec_sim = cosine_similarity(query_embedding, emb)
            except Exception:
                vec_sim = 0.0

            # Keyword lexical score
            chunk_tokens = set(chunk.chunk_text.lower().split())
            intersection = q_tokens.intersection(chunk_tokens)
            kw_score = len(intersection) / max(len(q_tokens), 1)

            # Combined hybrid score
            hybrid_score = (alpha * vec_sim) + ((1.0 - alpha) * kw_score)

            scored_chunks.append({
                "chunk_id": chunk.id,
                "medicine_id": med.id,
                "medicine_name": med.generic_name,
                "brand_name": med.brand_name,
                "section_name": chunk.section_name,
                "text": chunk.chunk_text,
                "source_url": chunk.source_url,
                "label_id": label.spl_set_id or label.source_record_id,
                "source": label.source,
                "score": round(float(hybrid_score), 4)
            })

        # Sort by hybrid score descending
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]


retriever = SemanticRetriever()
