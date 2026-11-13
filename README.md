# DrugInsight AI — AI-Powered Pharmaceutical Information & Research Platform

> **Explore Medicine Information with Clarity and Confidence.**

DrugInsight AI is a modern, responsive, multi-page healthcare SaaS web application designed for exploring pharmaceutical monographs, comparing drug properties side-by-side, analyzing regulatory labeling patterns, and synthesizing pharmacological evidence with verified citations.

---

## 🎨 Pastel Design System & Color Palette

Designed according to an elegant, soft pastel healthcare SaaS aesthetic:

| Role / Element | Color Token | Hex Code | Visual Application |
| :--- | :--- | :--- | :--- |
| **Primary Background** | Soft Ivory | `#FAFBF9` | Clean, spacious page layouts |
| **Primary Accent** | Pastel Sage Green | `#A8CDB5` | Brand accents, badges, highlights |
| **Deep Sage (Contrast)** | Forest Sage | `#2E5A44` | High-contrast action buttons & headings |
| **Secondary Accent** | Powder Blue | `#BDD7EE` | Researcher portal, informational cards |
| **Third Accent** | Soft Lavender | `#D9C9F0` | Doctor portal, badge outlines, hero blobs |
| **Fourth Accent** | Pale Peach | `#F6D8C8` | Administrative cards, alert highlights |
| **Mint Card Surface** | Pale Mint | `#EAF5ED` | Stat cards, active navigation states |
| **Primary Text** | Dark Slate | `#293B42` | High-legibility typography |
| **Muted Text** | Slate Grey | `#72818A` | Captions, secondary labels, metadata |
| **Warning Banner** | Muted Gold | `#FFF1D9` | Educational & clinical safety disclaimers |

---

## 👥 Four User Roles & Access Control

1. **General Public**
   - Open medicine search with autocomplete and filters.
   - Comprehensive monograph detail pages (Overview, Approved Uses, Side Effects, Warnings, Sources).
   - Clear educational notices preventing prescriptive misuse.

2. **Verified Doctor**
   - Dedicated clinical workspace with 4 pastel stat cards and quick actions.
   - Side-by-side multi-drug comparison matrix (Indications, Boxed Warnings, Contraindications, Pharmacokinetics).
   - AI Research Assistant with DailyMed SPL citations.
   - Clinical research library with saved collections and observation notes.
   - Report generator for clinical briefs.

3. **Verified Pharmaceutical Researcher**
   - Academic workspace with dataset KPIs and shortcuts.
   - **Pharmaceutical Analytics Dashboard** with 5 interactive Recharts visualizations:
     1. Medicine Records by Category (Vertical Bar Chart)
     2. Label Updates & Alerts Over Time (Smooth Line Chart)
     3. Drug Category Distribution (Donut Chart)
     4. Warning Section Occurrence Counts (Horizontal Bar Chart)
     5. Dataset Composition: Active vs. Archived SPL (Stacked Bar Chart)
   - CSV and PDF summary report exports.

4. **Platform Administrator**
   - Multi-tab credential verification review queue (Pending, Approved, Rejected, Needs Info).
   - Detailed modal with applicant metadata, license registry lookup, and document preview.
   - Approval/rejection workflows that immediately grant or revoke professional roles.
   - User account governance (Suspend, Activate, Revoke).
   - Immutable security and compliance audit trail log.
   - Upstream synchronization and AI safety rule controls.

---

## 🗺️ Complete Multi-Page Route Map

### Public Pages
- `/` — Landing Page with 3D-inspired pastel floating illustration, feature cards, and 4-step workflow
- `/about` — Platform mission, integrity principles, and architecture
- `/medicines` — Public medicine database search with filters and instant suggestions
- `/medicines/:id` — Full 5-tab regulatory monograph viewer (e.g. `/medicines/metformin`)
- `/login` — Login with 5 one-click demo persona cards
- `/register` — 3-step registration stepper (Role selection, Account details, Submission)
- `/verify-professional` — 4-step credential verification form with drag-and-drop file upload
- `/verification-status` — Dynamic status tracking (Pending, Approved, Rejected, Needs Info)
- `/safety` — Clinical safety guardrails, AI refusal rules, and disclaimers
- `/contact` — Institutional inquiries and regulatory compliance support desk

### Doctor Workspace
- `/doctor/dashboard` — Overview with stat cards, recent comparisons, and quick actions
- `/doctor/medicine-search` — Clinical monograph search
- `/doctor/compare` — Side-by-side drug comparative analysis
- `/doctor/ai-assistant` — AI pharmacology assistant with statutory citations
- `/doctor/research-library` — Saved monographs, comparisons, and clinical notes
- `/doctor/reports` — Clinical report management and downloads
- `/doctor/profile` — Doctor profile with read-only credential lock

### Researcher Workspace
- `/researcher/dashboard` — Dataset metrics and analytics overview
- `/researcher/medicine-search` — Pharmaceutical dataset search
- `/researcher/compare` — Cross-drug pharmacological matrix
- `/researcher/ai-assistant` — AI evidence synthesis engine
- `/researcher/analytics` — 5 interactive Recharts analytics charts with CSV export
- `/researcher/research-library` — Saved research collections
- `/researcher/reports` — Pharmaceutical monograph report briefs
- `/researcher/profile` — Researcher profile

### Administrator Portal
- `/admin/dashboard` — Governance overview and activity metrics
- `/admin/verifications` — Credential audit table and review modal
- `/admin/users` — User management and access revocation
- `/admin/audit-logs` — Audit trail ledger with SHA-256 integrity simulation
- `/admin/settings` — Upstream DailyMed sync and AI safety guardrails

### System Routes
- `/unauthorized` — Role guard boundary notice with one-click persona switching
- `/404` — Clean 404 page

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🛡️ Medical Safety & Compliance

DrugInsight AI is an educational and research platform. It does **not** provide clinical diagnosis, patient prescriptions, or personalized treatment advice. AI assistant prompts attempting to seek individualized medical regimens or diagnoses are rejected by automated clinical safety refusal guardrails.
