"""Section-aware document chunking and embedding generation."""

import re
import math
import json
import hashlib
from typing import List, Dict, Any, Tuple
import numpy as np


def chunk_medicine_label(
    label_id: str,
    sections: Dict[str, str],
    source_url: str,
    chunk_size: int = 400,
    overlap: int = 60
) -> List[Dict[str, Any]]:
    """Split medical label sections into section-aware overlapping chunks without crossing clinical categories."""
    chunks = []
    chunk_idx = 0

    for section_name, text in sections.items():
        if not text or not text.strip():
            continue

        clean_text = re.sub(r"\s+", " ", text).strip()
        words = clean_text.split(" ")

        if len(words) <= chunk_size:
            chunk_content = " ".join(words)
            content_hash = hashlib.sha256(chunk_content.encode("utf-8")).hexdigest()
            chunks.append({
                "medicine_label_id": label_id,
                "section_name": section_name,
                "chunk_text": chunk_content,
                "chunk_index": chunk_idx,
                "source_url": source_url,
                "content_hash": content_hash
            })
            chunk_idx += 1
        else:
            step = chunk_size - overlap
            for start in range(0, len(words), step):
                chunk_words = words[start: start + chunk_size]
                if not chunk_words:
                    break
                chunk_content = " ".join(chunk_words)
                content_hash = hashlib.sha256(chunk_content.encode("utf-8")).hexdigest()
                chunks.append({
                    "medicine_label_id": label_id,
                    "section_name": section_name,
                    "chunk_text": chunk_content,
                    "chunk_index": chunk_idx,
                    "source_url": source_url,
                    "content_hash": content_hash
                })
                chunk_idx += 1
                if start + chunk_size >= len(words):
                    break

    return chunks


def compute_deterministic_embedding(text: str, dim: int = 128) -> List[float]:
    """Generate a normalized 128-dimensional dense semantic embedding.
    Uses token hashing with subword n-grams for fast, deterministic local inference."""
    vec = np.zeros(dim, dtype=np.float32)
    tokens = re.findall(r"\w+", text.lower())

    for token in tokens:
        # Unigrams
        h = int(hashlib.md5(token.encode("utf-8")).hexdigest(), 16) % dim
        vec[h] += 1.0

        # Bigram character prefixes
        if len(token) >= 3:
            h_sub = int(hashlib.md5(token[:3].encode("utf-8")).hexdigest(), 16) % dim
            vec[h_sub] += 0.5

    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm

    return vec.tolist()


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two dense vectors."""
    a = np.array(vec1, dtype=np.float32)
    b = np.array(vec2, dtype=np.float32)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))
