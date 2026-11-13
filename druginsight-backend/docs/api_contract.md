# DrugInsight AI — API Contract & Endpoint Reference

Base URL: `/api/v1`

---

## 1. Authentication (`/auth`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `POST` | `/auth/register` | None | Register new account (strictly defaults to `PUBLIC` role) |
| `POST` | `/auth/login` | None | Authenticate with Argon2id; returns JWT + Refresh Token |
| `POST` | `/auth/refresh` | None | Rotate refresh token for a new access token |
| `GET` | `/auth/me` | Bearer | Retrieve profile of authenticated user |
| `POST` | `/auth/change-password` | Bearer | Update password with old credential validation |

---

## 2. Professional Verification (`/verification`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `POST` | `/verification/submit` | Optional/Bearer | Submit credentials for DOCTOR or RESEARCHER role |
| `GET` | `/verification/status` | Bearer | Retrieve credential review status for logged-in user |

---

## 3. Medicine Information & Search (`/medicines`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `GET` | `/medicines` | None (Public) | Search catalog by query string `?q=`, category, source |
| `GET` | `/medicines/categories`| None (Public) | List all unique therapeutic drug classes |
| `GET` | `/medicines/suggestions`| None (Public) | Instant autocomplete matches |
| `GET` | `/medicines/{id}` | None (Public) | Full 5-tab structured monograph |

---

## 4. Clinical Comparison (`/comparison`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `POST` | `/comparison` | Doctor / Researcher / Admin | Submit `medicine_a_id` & `medicine_b_id` for matrix |
| `GET` | `/comparison` | Doctor / Researcher / Admin | Query comparison via `?medicineA=...&medicineB=...` |

---

## 5. AI Research Assistant (`/ai`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `POST` | `/ai/chat` | Doctor / Researcher / Admin | Grounded RAG chat with DailyMed citations and safety boundary |
| `GET` | `/ai/conversations` | Doctor / Researcher / Admin | List user research conversation threads |
| `POST` | `/ai/classify-question` | Doctor / Researcher / Admin | Run query through 8-class ML safety classifier |

---

## 6. Pharmaceutical Analytics (`/analytics`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `GET` | `/analytics/overview` | Researcher / Admin | Aggregate KPIs, 6-month update trends, category donut |
| `GET` | `/analytics/export/csv` | Researcher / Admin | Download pharmaceutical regulatory dataset as CSV |

---

## 7. Research Library (`/library`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `GET` | `/library` | Authenticated | List bookmarked monographs, comparisons, and notes |
| `POST` | `/library` | Authenticated | Save new research item to user collection |
| `DELETE`| `/library/{id}` | Authenticated | Remove research item |

---

## 8. Clinical Reports (`/reports`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `GET` | `/reports` | Doctor / Researcher / Admin | List compiled PDF clinical research reports |
| `POST` | `/reports` | Doctor / Researcher / Admin | Compile new ReportLab PDF research report |
| `GET` | `/reports/{id}` | Doctor / Researcher / Admin | Fetch report metadata |
| `GET` | `/reports/{id}/download` | Doctor / Researcher / Admin | Stream binary PDF document |
| `DELETE`| `/reports/{id}` | Doctor / Researcher / Admin | Remove report metadata and disk artifact |

---

## 9. Administrator Governance (`/admin`)

| Method | Path | Auth Required | Description |
|:---|:---|:---|:---|
| `GET` | `/admin/dashboard` | Admin | System KPIs (total users, verifications, audits) |
| `GET` | `/admin/verifications`| Admin | Review queue for professional credentials |
| `POST` | `/admin/verifications/{id}/approve` | Admin | Approve credentials and elevate user role |
| `POST` | `/admin/verifications/{id}/reject` | Admin | Reject application and maintain PUBLIC role |
| `POST` | `/admin/verifications/{id}/request-info`| Admin | Request supplemental license documentation |
| `POST` | `/admin/verifications/{id}/revoke` | Admin | Revoke elevated role back to PUBLIC |
| `GET` | `/admin/users` | Admin | List registered platform accounts |
| `POST` | `/admin/users/{id}/suspend` | Admin | Suspend user access |
| `POST` | `/admin/users/{id}/restore` | Admin | Re-activate user access |
| `GET` | `/admin/audit-logs` | Admin | Query immutable compliance audit trail |
