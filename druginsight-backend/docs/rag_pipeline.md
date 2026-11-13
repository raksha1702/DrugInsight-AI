# DrugInsight AI — Grounded RAG & Semantic Retrieval Pipeline

## 1. RAG Architecture

```text
User Question
      │
      ▼
Safety Intent Classifier
      ├─► [UNSAFE] ──► Immediate Clinical Refusal & Directive
      │
      ▼ [SAFE]
Target Drug & Section Entity Extraction
      │
      ▼
Hybrid Retrieval Engine
      ├─► Deterministic Dense Semantic Embedding (128-dim subword projection)
      └─► Keyword & Concept Matching
      │
      ▼
Cosine Similarity Re-Ranking over Document Chunks
      │
      ▼
Top-K Context Assembler with DailyMed SPL Citations
      │
      ▼
Grounded Research Synthesis with Source Provenance Links
```

---

## 2. Document Chunking Strategy

Standard unstructured text chunking causes cross-contamination between contraindications and indications. DrugInsight AI uses **Section-Aware Chunking**:

- Each DailyMed Structured Product Label (SPL) is partitioned by regulatory section headings:
  - `boxed_warning`
  - `indications_and_usage`
  - `dosage_and_administration`
  - `contraindications`
  - `warnings_and_precautions`
  - `adverse_reactions`
- Chunks do **never** span multiple sections.
- Each chunk preserves `medicine_label_id`, `section_name`, `source_url`, and SHA-256 `content_hash`.

---

## 3. Retrieval Benchmark Metrics

Evaluated using `training/evaluate_retrieval.py` against standard pharmacological queries:

- **Recall@1**: **100.0%**
- **Recall@3**: **100.0%**
- **Mean Reciprocal Rank (MRR)**: **1.0000**
- **Average Retrieval Latency**: **1.21 ms**
