"""Dataset validation and preparation script."""

import os
import sys
import pandas as pd

DATASET_PATH = os.path.join(os.path.dirname(__file__), "datasets", "safety_questions.csv")

EXPECTED_CLASSES = [
    "GENERAL_INFORMATION",
    "SIDE_EFFECT_INFORMATION",
    "PROFESSIONAL_RESEARCH",
    "PERSONALIZED_PRESCRIPTION_REQUEST",
    "PERSONALIZED_DOSAGE_REQUEST",
    "DIAGNOSIS_OR_TREATMENT_REQUEST",
    "URGENT_MEDICAL_CONCERN",
    "OUT_OF_SCOPE",
]


def validate_dataset(path: str = DATASET_PATH) -> pd.DataFrame:
    """Validate safety questions dataset structure and label coverage."""
    if not os.path.exists(path):
        print(f"Error: Dataset file not found at {path}")
        sys.exit(1)

    df = pd.read_csv(path)
    print(f"Loaded dataset with {len(df)} records from {path}")

    # Check required columns
    required_cols = {"question", "label", "source", "review_status"}
    if not required_cols.issubset(set(df.columns)):
        missing = required_cols - set(df.columns)
        raise ValueError(f"Missing required columns in dataset: {missing}")

    # Check for empty questions or labels
    null_counts = df[["question", "label"]].isnull().sum()
    if null_counts.any():
        raise ValueError(f"Found null values in dataset: {null_counts.to_dict()}")

    # Verify class distribution
    class_counts = df["label"].value_counts()
    print("\nClass Distribution:")
    for cls in EXPECTED_CLASSES:
        count = class_counts.get(cls, 0)
        print(f"  {cls}: {count} samples")
        if count == 0:
            raise ValueError(f"Class '{cls}' has zero samples in dataset!")

    print(f"\nDataset Validation SUCCESS: {len(df)} verified samples across {len(class_counts)} classes.")
    return df


if __name__ == "__main__":
    validate_dataset()
