# DrugInsight AI — Backend & ML Intelligence Platform

> **AI-Powered Pharmaceutical Information and Research Platform with Professional Credential Verification**  
> *Explore Medicine Information with Clarity and Confidence.*

---

## Important Regulatory & Clinical Disclaimer

**DrugInsight AI is an educational, regulatory, and pharmaceutical research platform.**  
It is **NOT** a clinical decision support system, diagnostic medical device, or prescription engine.  
The platform **strictly refuses** automated prescribing, individualized dosing calculations, patient-specific regimen selection, or emergency medical triage. All clinical information is grounded in official FDA Structured Product Labeling (SPL) via DailyMed and openFDA.

---

## 1. System Overview

DrugInsight AI provides a robust, production-structured backend built in Python (FastAPI + SQLAlchemy 2.0 async + PostgreSQL / pgvector + scikit-learn), seamlessly integrating with the React + TypeScript frontend.

### Role-Based Access Control (RBAC)

The platform supports four strict user roles:

1. **PUBLIC**: Medicine search, public 5-tab monographs (indications, mechanisms, common adverse reactions, boxed warnings), external DailyMed/openFDA provenance.
2. **DOCTOR**: Public features plus multi-drug side-by-side comparison matrices, source-grounded AI Research Assistant with DailyMed citations, and downloadable clinical PDF reports (ReportLab).
3. **RESEARCHER**: Doctor capabilities plus comprehensive pharmaceutical analytics, historical regulatory label updates trend, category distribution donut, and adverse reaction frequency charts.
4. **ADMIN**: Governance dashboard, professional credential verification queue (approve, reject, request supplemental info, revoke), account status management, and immutable security audit logs.

---

## 2. Technology Stack

- **Framework**: FastAPI (Python 3.12) with Pydantic v2
- **ORM & Database**: SQLAlchemy 2.x async ORM, PostgreSQL + pgvector, with async SQLite fallback (`aiosqlite`)
- **Authentication**: JWT access tokens (HMAC-SHA256), cryptographic refresh tokens, Argon2id password hashing
- **Machine Learning**: scikit-learn (TF-IDF + Logistic Regression Safety Classifier), NumPy, Pandas, joblib
- **Retrieval & RAG**: Section-aware drug label chunking, 128-dim deterministic dense embedding vectors, cosine semantic ranking, DailyMed SPL citation linking
- **Reporting**: ReportLab automated PDF clinical report compiler
- **External APIs**: DailyMed REST API v2, openFDA Drug Labeling API (`/drug/label.json`)
- **Containerization**: Docker, Docker Compose (FastAPI + PostgreSQL 16 pgvector + Redis 7)
- **Testing**: Pytest & pytest-asyncio (31 automated unit, integration, and security tests)

---

## 3. Project Architecture

```text
druginsight-backend/
├── app/
│   ├── main.py                  # FastAPI application entrypoint & lifespan
│   ├── config.py                # Environment configuration (Pydantic Settings)
│   ├── database.py              # Async SQLAlchemy engine & session factory
│   ├── dependencies.py          # RBAC dependencies (get_current_user, require_doctor, etc.)
│   ├── api/v1/                  # REST API v1 Routers
│   │   ├── auth.py              # Register, login, refresh, profile
│   │   ├── users.py             # User profile updates
│   │   ├── verification.py      # Professional credential submission & review
│   │   ├── medicines.py         # Search, categories, suggestions, monographs
│   │   ├── comparison.py        # Side-by-side comparison matrices
│   │   ├── ai_chat.py           # Grounded RAG assistant & safety intent classifier
│   │   ├── analytics.py         # KPIs, trend series, CSV export
│   │   ├── library.py           # Bookmarks, comparisons, notes
│   │   ├── reports.py           # ReportLab PDF compilation & download
│   │   └── admin.py             # Admin dashboard, audit logs, user management
│   ├── models/                  # SQLAlchemy ORM declarative models
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   ├── repositories/            # Data access layer
│   ├── services/                # Business logic services
│   ├── security/                # Argon2id hashing & JWT token security
│   ├── integrations/            # DailyMed and openFDA HTTP clients
│   └── ml/                      # Safety classifier, embeddings, retrieval, RAG
├── training/                    # ML training pipeline scripts & curated datasets
│   ├── prepare_dataset.py       # Dataset structure & coverage validation
│   ├── train_safety_classifier.py # Model fitting & artifact persistence
│   ├── evaluate_safety_classifier.py # Recall/precision on clinical boundaries
│   ├── evaluate_retrieval.py    # Semantic search benchmarking (MRR & Recall@k)
│   └── datasets/safety_questions.csv # 80 balanced samples across 8 classes
├── artifacts/                   # Persisted ML models and compiled PDF reports
├── tests/                       # Automated test suite (31 tests, 100% pass)
│   ├── unit/                    # Security, safety classifier, embeddings
│   ├── integration/             # Auth, verification, medicines, AI chat, reports
│   └── security/                # Role guards, unauthenticated rejection
├── Dockerfile                   # Production container definition
├── docker-compose.yml           # Multi-service stack (API + Postgres + Redis)
└── requirements.txt             # Locked Python dependencies
```

---

## 4. Quickstart & Local Setup

### Prerequisites

- Python 3.12+
- Node.js 18+ (for frontend)
- Git

### 1. Initialize Virtual Environment & Install Dependencies

```bash
cd c:\druginsightai\druginsight-backend
python -m venv .venv
.venv\Scripts\activate          # On Windows
pip install -r requirements.txt
```

### 2. Train the Safety Classifier

```bash
python training/prepare_dataset.py
python training/train_safety_classifier.py
python training/evaluate_safety_classifier.py
```

### 3. Run Automated Tests

```bash
python -m pytest tests -v
```

### 4. Start the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The interactive OpenAPI documentation will be accessible at:  
👉 **http://localhost:8000/docs**

---

## 5. Seeded Demonstrator Credentials

On startup, the system automatically initializes demonstrator accounts across all 4 user tiers:

| Tier | Email | Password | Access Scope |
|:---|:---|:---|:---|
| **Administrator** | `admin@druginsight.ai` | `Admin@123456` | Full platform governance, verification approval, audit logs |
| **Doctor** | `doctor@hospital.org` | `Doctor@123456` | Monograph search, comparison, AI chat, PDF reports |
| **Researcher** | `researcher@pharma.org` | `Research@123456` | All doctor features + pharmaceutical analytics & CSV exports |
| **Public** | `patient@health.org` | `Public@123456` | Public monographs, credential submission |

---

## 6. Docker Stack Deployment

To start the full production stack with PostgreSQL 16 (pgvector) and Redis:

```bash
docker-compose up --build -d
```

Check service status:
```bash
docker-compose ps
curl http://localhost:8000/health
```
