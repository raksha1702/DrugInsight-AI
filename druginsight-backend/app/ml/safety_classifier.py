"""Medical Question Safety Classifier inference service."""

import os
import re
import logging
from typing import Tuple, Dict, Any
import joblib

logger = logging.getLogger(__name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "artifacts", "models", "safety_classifier.joblib")

# Unsafe categories requiring refusal
UNSAFE_CATEGORIES = {
    "PERSONALIZED_PRESCRIPTION_REQUEST": "REFUSE_PERSONALIZED_ADVICE",
    "PERSONALIZED_DOSAGE_REQUEST": "REFUSE_PERSONALIZED_ADVICE",
    "DIAGNOSIS_OR_TREATMENT_REQUEST": "REFUSE_PERSONALIZED_ADVICE",
    "URGENT_MEDICAL_CONCERN": "EMERGENCY_DIRECTIVE",
    "OUT_OF_SCOPE": "REDIRECT_TO_PHARMA_SCOPE",
}

# Deterministic safety rule patterns for defense-in-depth
SAFETY_PATTERNS = [
    (r"\b(prescribe|write me a script|give me a prescription)\b", "PERSONALIZED_PRESCRIPTION_REQUEST"),
    (r"\b(should i take|can i take|what should i take for my)\b", "PERSONALIZED_PRESCRIPTION_REQUEST"),
    (r"\b(double my dose|how many (pills|tablets) should i take|missed (my|a) dose)\b", "PERSONALIZED_DOSAGE_REQUEST"),
    (r"\b(diagnose (me|my)|what (disease|illness) do i have|do i have (cancer|infection|pneumonia))\b", "DIAGNOSIS_OR_TREATMENT_REQUEST"),
    (r"\b(overdosed|swallowed (a whole bottle|too many)|cannot breathe|throat is closing|feeling faint and throwing up)\b", "URGENT_MEDICAL_CONCERN"),
]


class SafetyClassifier:
    """Classifies user queries to prevent clinical diagnosing and prescribing."""

    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
                logger.info(f"Loaded trained safety classifier from {MODEL_PATH}")
            except Exception as e:
                logger.warning(f"Could not load safety classifier artifact: {e}")
                self.model = None
        else:
            logger.info("No safety classifier artifact found. Using deterministic rules fallback.")

    def classify(self, text: str) -> Dict[str, Any]:
        """Classify a question and return category, confidence, and recommended action."""
        text_clean = text.strip()
        text_lower = text_clean.lower()

        # Step 1: Rule-based fast check for critical hazards
        for pattern, category in SAFETY_PATTERNS:
            if re.search(pattern, text_lower):
                return {
                    "category": category,
                    "confidence": 0.98,
                    "action": UNSAFE_CATEGORIES.get(category, "ALLOW"),
                    "model_version": "safety-v1-hybrid-rules",
                    "source": "deterministic_rule"
                }

        # Step 2: ML model inference if model artifact is available
        if self.model is not None:
            try:
                pred = self.model.predict([text_clean])[0]
                proba = self.model.predict_proba([text_clean])[0]
                confidence = float(max(proba))

                action = UNSAFE_CATEGORIES.get(pred, "ALLOW")

                # If low confidence on a borderline query, apply conservative fallback
                if confidence < 0.35 and action == "ALLOW":
                    pred = "GENERAL_INFORMATION"
                    confidence = 0.50

                return {
                    "category": pred,
                    "confidence": round(confidence, 4),
                    "action": action,
                    "model_version": "safety-v1-logreg",
                    "source": "ml_pipeline"
                }
            except Exception as e:
                logger.error(f"Inference error in safety classifier: {e}")

        # Step 3: Default safe fallback
        if any(w in text_lower for w in ["side effect", "adverse", "reaction", "rash", "nausea"]):
            cat = "SIDE_EFFECT_INFORMATION"
        elif any(w in text_lower for w in ["warning", "contraindication", "boxed", "spl", "label"]):
            cat = "PROFESSIONAL_RESEARCH"
        else:
            cat = "GENERAL_INFORMATION"

        return {
            "category": cat,
            "confidence": 0.85,
            "action": "ALLOW",
            "model_version": "safety-fallback",
            "source": "heuristic_fallback"
        }


safety_classifier = SafetyClassifier()
