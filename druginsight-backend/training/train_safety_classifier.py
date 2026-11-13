"""Train and persist baseline Safety Question Classifier using scikit-learn."""

import os
import json
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score

DATASET_PATH = os.path.join(os.path.dirname(__file__), "datasets", "safety_questions.csv")
ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts", "models")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "safety_classifier.joblib")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "safety_metrics.json")


def train_model():
    """Train safety classifier pipeline and persist artifacts."""
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    df = pd.read_csv(DATASET_PATH)

    X = df["question"].values
    y = df["label"].values

    # Stratified train/test split to preserve class balance
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    print(f"Training dataset: {len(X_train)} samples")
    print(f"Test dataset:     {len(X_test)} samples")

    # Build Pipeline: TF-IDF n-grams + Balanced Logistic Regression
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            max_features=2500,
            lowercase=True,
            strip_accents="unicode"
        )),
        ("classifier", LogisticRegression(
            C=3.0,
            class_weight="balanced",
            max_iter=1000,
            random_state=42
        ))
    ])

    print("Fitting TF-IDF and Logistic Regression classifier...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    macro_f1 = float(f1_score(y_test, y_pred, average="macro"))

    report_dict = classification_report(y_test, y_pred, output_dict=True)

    print(f"\nModel Performance on Held-Out Test Set:")
    print(f"  Accuracy:  {accuracy:.4f}")
    print(f"  Macro F1:  {macro_f1:.4f}")

    # Save model artifact
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Saved model artifact to {MODEL_PATH}")

    # Save metrics and metadata
    metadata = {
        "model_version": "safety-v1-logreg",
        "algorithm": "TF-IDF + LogisticRegression",
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "accuracy": accuracy,
        "macro_f1": macro_f1,
        "classification_report": report_dict,
        "classes": list(pipeline.classes_),
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved evaluation metrics to {METRICS_PATH}")

    return pipeline, metadata


if __name__ == "__main__":
    train_model()
