# DrugInsight AI — Architecture & System Design

## 1. System Philosophy

DrugInsight AI is designed as a **modular monolith** emphasizing:

- **Strict Clinical Boundaries**: Educational and pharmaceutical research only. The architecture explicitly prevents automated prescribing, individual dosage alteration, or diagnostic triage.
- **Regulatory Provenance**: Direct citation of FDA Structured Product Labeling (SPL) Set IDs and openFDA label versions.
- **Role-Based Access Control**: Four tiers (PUBLIC, DOCTOR, RESEARCHER, ADMIN) enforced at the dependency layer.
- **Defensive Multi-Layer Security**: Argon2id password hashing, constant-time authentication checks, stateless signed JWTs, and cryptographically hashed refresh tokens.

---

## 2. Request Flow Architecture

```text
React Frontend (Vite + TS + Tailwind)
               │ (HTTP / JSON / Bearer Auth)
               ▼
       FastAPI Application
               │
   ┌───────────┴───────────┐
   │ Middleware Pipeline   │
   │ - CORS Validation     │
   │ - Error Handling      │
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐
   │ Dependency & RBAC     │
   │ - get_current_user    │
   │ - require_roles(...)  │
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐
   │ Business Services     │
   │ - AuthService         │
   │ - MedicineService     │
   │ - VerificationService │
   │ - AIService / RAG     │
   │ - ReportService       │
   │ - AnalyticsService    │
   └───────────┬───────────┘
               ▼
   ┌───────────────────────┐
   │ Repositories & Data   │
   │ - UserRepo            │
   │ - MedicineRepo        │
   │ - AuditRepo           │
   └───────────┬───────────┘
               ▼
  SQLAlchemy 2.0 Async ORM
   ┌───────────┴───────────┐
   ▼                       ▼
PostgreSQL / pgvector    DailyMed / openFDA REST APIs
```

---

## 3. Subsystem Breakdown

### 3.1 Authentication & Credential Governance
- Handles user registration, Argon2id password verification, JWT access token issuance, and refresh token rotation.
- **Registration Safeguard**: New registrations always receive the `PUBLIC` role. Professional privileges can only be obtained through administrator approval of a `VerificationRequest`.

### 3.2 Medicine Catalog & Monograph Service
- Parses and indexes Structured Product Labeling (SPL) into five structured tabs:
  1. **Overview & Indications** (Approved clinical indications)
  2. **Dosage & Mechanism** (Formulations and pharmacology)
  3. **Adverse Reactions** (Stratified common vs serious side effects)
  4. **Warnings & Precautions** (Boxed warnings, contraindications, pregnancy categories)
  5. **Regulatory Provenance** (DailyMed SPL Set ID, NDC code, version timestamp)

### 3.3 Side-by-Side Comparison Engine
- Cross-references two distinct pharmaceutical entities across active ingredients, categories, mechanisms of action, approved indications, boxed warning status, contraindications, and common adverse reactions.

### 3.4 Grounded RAG & Safety Classifier
- Evaluates queries through a hybrid ML safety classifier (TF-IDF + Logistic Regression).
- Refuses questions asking for personalized prescribing or diagnosis.
- For permitted pharmacology inquiries, performs section-aware semantic retrieval over labeled chunks and formats responses with explicit DailyMed citations.

### 3.5 Automated Clinical PDF Compiler
- Utilizes ReportLab to generate publication-grade clinical reports including executive summaries, comparative tables, and mandatory regulatory disclaimers.
