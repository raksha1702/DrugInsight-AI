"""Detailed evaluation of the trained Safety Question Classifier."""

import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, recall_score

DATASET_PATH = os.path.join(os.path.dirname(__file__), "datasets", "safety_questions.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "artifacts", "models", "safety_classifier.joblib")


def evaluate_classifier():
    """Load model and run comprehensive safety classification evaluation."""
    if not os.path.exists(MODEL_PATH):
        print(f"Model artifact not found at {MODEL_PATH}. Run training/train_safety_classifier.py first.")
        return

    pipeline = joblib.load(MODEL_PATH)
    df = pd.read_csv(DATASET_PATH)

    X = df["question"].values
    y_true = df["label"].values

    y_pred = pipeline.predict(X)
    acc = accuracy_score(y_true, y_pred)

    print("\n" + "=" * 65)
    print(" DRUGINSIGHT AI - SAFETY CLASSIFIER EVALUATION REPORT")
    print("=" * 65)
    print(f"Overall Accuracy on Full Curated Set: {acc * 100:.2f}%\n")

    report = classification_report(y_true, y_pred, digits=4)
    print(report)

    # Highlight Recall on Unsafe Classes
    unsafe_classes = [
        "URGENT_MEDICAL_CONCERN",
        "PERSONALIZED_PRESCRIPTION_REQUEST",
        "PERSONALIZED_DOSAGE_REQUEST",
        "DIAGNOSIS_OR_TREATMENT_REQUEST",
    ]

    print("-" * 65)
    print("CRITICAL MEDICAL SAFETY METRICS (Priority: High Recall on Unsafe Classes)")
    print("-" * 65)
    for cls in unsafe_classes:
        cls_mask = y_true == cls
        if cls_mask.sum() > 0:
            cls_recall = recall_score(y_true == cls, y_pred == cls)
            print(f"  {cls:<35} Recall: {cls_recall * 100:.1f}% ({cls_mask.sum()} samples)")

    print("=" * 65)


if __name__ == "__main__":
    evaluate_classifier()
