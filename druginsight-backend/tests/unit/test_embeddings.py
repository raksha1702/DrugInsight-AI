"""Unit tests for text chunking, embedding generation, and cosine similarity."""

import pytest
from app.ml.embeddings import (
    chunk_medicine_label,
    compute_deterministic_embedding,
    cosine_similarity,
)


def test_chunk_medicine_label():
    """Verify structured section chunking preserves labeling headings."""
    sample_sections = {
        "description": "Lisinopril is an ACE inhibitor used for hypertension.",
        "mechanism": "Inhibits ACE preventing angiotensin I conversion to angiotensin II.",
        "indications": "Treatment of hypertension and systolic heart failure.",
        "boxed_warning": "WARNING: FETAL TOXICITY — When pregnancy is detected, discontinue Lisinopril as soon as possible.",
        "contraindications": "History of angioedema. Concomitant use with aliskiren.",
        "side_effects": "Common: Dizziness, persistent dry cough, headache. Serious: Severe angioedema, renal failure.",
    }

    chunks = chunk_medicine_label(
        label_id="lisinopril-label-01",
        sections=sample_sections,
        source_url="https://dailymed.nlm.nih.gov",
    )
    assert len(chunks) >= 4

    sections = [c["section_name"] for c in chunks]
    assert "boxed_warning" in sections
    assert "indications" in sections
    assert "mechanism" in sections

    boxed = next(c for c in chunks if c["section_name"] == "boxed_warning")
    assert "FETAL TOXICITY" in boxed["chunk_text"]


def test_deterministic_embedding_and_cosine_similarity():
    """Verify embedding produces 128-dim vectors and semantic similarity is highest for related text."""
    v1 = compute_deterministic_embedding("Metformin decreases hepatic glucose production.")
    v2 = compute_deterministic_embedding("Metformin reduces glucose synthesized in the liver.")
    v3 = compute_deterministic_embedding("Amoxicillin is a beta-lactam antibacterial for ear infections.")

    assert len(v1) == 128
    assert len(v2) == 128
    assert len(v3) == 128

    sim_related = cosine_similarity(v1, v2)
    sim_unrelated = cosine_similarity(v1, v3)

    assert sim_related > sim_unrelated
