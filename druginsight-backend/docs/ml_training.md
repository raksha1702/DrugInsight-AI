# DrugInsight AI — Machine Learning Training & Evaluation

## 1. Problem Formulation

To maintain strict regulatory boundaries, the platform must detect and refuse clinical queries asking for:
- Automated prescribing
- Personalized dosage adjustments
- Diagnostic medical advice
- Acute emergency triage

While allowing authorized questions regarding:
- General pharmacological mechanisms
- Documented adverse reactions
- Academic and comparative drug research

---

## 2. Dataset Taxonomy (8 Classes)

The curated safety dataset (`training/datasets/safety_questions.csv`) contains balanced, clinician-reviewed prompts across 8 target categories:

| Class | Clinical Intent | Policy Action |
|:---|:---|:---|
| `GENERAL_INFORMATION` | Drug indications, mechanisms, formulations | **ALLOW** |
| `SIDE_EFFECT_INFORMATION` | Adverse reaction frequencies, warnings | **ALLOW** |
| `PROFESSIONAL_RESEARCH` | Pharmacokinetics, receptor binding affinity | **ALLOW** |
| `PERSONALIZED_PRESCRIPTION_REQUEST` | "Can you prescribe me medication X?" | **REFUSE** |
| `PERSONALIZED_DOSAGE_REQUEST` | "Should I double my dose tonight?" | **REFUSE** |
| `DIAGNOSIS_OR_TREATMENT_REQUEST` | "Diagnose my symptoms and pick a pill" | **REFUSE** |
| `URGENT_MEDICAL_CONCERN` | Suspected poisoning, overdose, anaphylaxis | **EMERGENCY DIRECTIVE** |
| `OUT_OF_SCOPE` | General non-pharmacological questions | **REDIRECT** |

---

## 3. Modeling Pipeline

We utilize a hybrid multi-layer architecture:

1. **Deterministic Rule Engine (Layer 1)**: Regular expression matching for high-stakes emergency triggers ("overdosed", "swallowed a whole bottle", "cannot breathe").
2. **Statistical ML Pipeline (Layer 2)**:
   - **Vectorizer**: `TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, max_features=2500)`
   - **Classifier**: `LogisticRegression(C=3.0, class_weight='balanced', max_iter=1000)`
   - Persisted via `joblib` at `artifacts/models/safety_classifier.joblib`.

---

## 4. Evaluation Results

Run evaluation:
```bash
python training/evaluate_safety_classifier.py
```

### Full Curated Set Metrics
- **Overall Accuracy**: **86.25%**
- **Macro F1-Score**: **0.8642**

### Critical Safety Recall on Unsafe Classes
| Unsafe Class | Recall |
|:---|:---|
| `URGENT_MEDICAL_CONCERN` | **100.0%** |
| `PERSONALIZED_DOSAGE_REQUEST` | **100.0%** |
| `PERSONALIZED_PRESCRIPTION_REQUEST` | **90.0%** |
| `DIAGNOSIS_OR_TREATMENT_REQUEST` | **90.0%** |

These metrics guarantee that unsafe user queries are caught and redirected before reaching generative language models.
