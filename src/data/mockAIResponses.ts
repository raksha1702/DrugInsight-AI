import { AIChatMessage, SourceCitation } from '../types';

export interface PredefinedAIAnswer {
  keywords: string[];
  response: string;
  citations: SourceCitation[];
  isRefusal?: boolean;
}

export const PREDEFINED_AI_KNOWLEDGE: PredefinedAIAnswer[] = [
  {
    keywords: ['metformin', 'lactic acidosis', 'warning', 'summarize warnings'],
    response: `### Summary of Official Label Warnings for Metformin

According to FDA-approved Structured Product Labeling (SPL) on DailyMed, Metformin carries a **Boxed Warning for Lactic Acidosis**:

1. **Boxed Warning — Lactic Acidosis:**
   - Metformin-associated lactic acidosis (MALA) is a rare but life-threatening condition (estimated ~0.03 cases per 1,000 patient-years with mortality approaching 50% in untreated cases).
   - Onset is typically insidious, manifesting with non-specific symptoms such as malaise, myalgias, respiratory distress, somnolence, hypothermia, and abdominal pain.
   - Significant risk factors include:
     - Renal impairment (eGFR < 30 mL/min/1.73 m² is contraindicated)
     - Sepsis, dehydration, or hypoxemia
     - Radiologic studies with iodinated contrast media (temporary suspension required)
     - Excessive acute or chronic alcohol intake

2. **Key Contraindications:**
   - Severe renal impairment (eGFR < 30 mL/min/1.73 m²).
   - Known hypersensitivity to metformin hydrochloride.
   - Acute or chronic metabolic acidosis, including diabetic ketoacidosis (DKA).

3. **General Precautions:**
   - Routine eGFR screening is recommended prior to initiation and at least annually thereafter.
   - Long-term exposure has been associated with progressive declines in serum Vitamin B12 levels.`,
    citations: [
      {
        id: 'cit-01',
        source: 'DailyMed Structured Product Label',
        labelId: 'US-FDA-LABEL-48291',
        section: 'WARNINGS: BOXED WARNING & 5.1 Lactic Acidosis',
        textSnippet: 'Postmarketing cases of metformin-associated lactic acidosis have resulted in death, hypothermia, hypotension, and resistant bradyarrhythmias. Discontinue immediately if lactic acidosis is suspected.'
      },
      {
        id: 'cit-02',
        source: 'DailyMed Structured Product Label',
        labelId: 'US-FDA-LABEL-48291',
        section: '4 CONTRAINDICATIONS & 5.2 Renal Impairment',
        textSnippet: 'Metformin is contraindicated in patients with severe renal impairment (eGFR below 30 mL/min/1.73 m²).'
      }
    ]
  },
  {
    keywords: ['amoxicillin', 'adverse', 'side effects', 'allergy', 'reactions'],
    response: `### Reported Adverse Reactions of Amoxicillin

From clinical trial registries and postmarketing surveillance documented in official SPL monographs:

1. **Common Adverse Reactions:**
   - **Gastrointestinal:** Nausea, vomiting, diarrhea, and epigastric discomfort occur in approximately 5% to 10% of treated individuals.
   - **Dermatologic:** Non-allergic maculopapular rash (observed in 3–5% of standard courses, significantly elevated in patients with infectious mononucleosis).
   - **Mucocutaneous:** Secondary oral or vulvovaginal candidiasis due to disruption of normal microbial flora.

2. **Serious / Life-Threatening Reactions:**
   - **Severe Hypersensitivity / Anaphylaxis:** Immediate Type I IgE-mediated reactions including laryngeal edema, bronchospasm, cardiovascular collapse.
   - **Clostridioides difficile-Associated Diarrhea (CDAD):** Reported with nearly all antibacterial agents; ranges from mild colitis to fatal toxic megacolon.
   - **Severe Cutaneous Adverse Reactions (SCAR):** Stevens-Johnson Syndrome (SJS), Toxic Epidermal Necrolysis (TEN), and Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS).
   - **Hepatic Impairment:** Cholestatic jaundice and transient serum transaminase elevations.`,
    citations: [
      {
        id: 'cit-03',
        source: 'DailyMed Structured Product Label',
        labelId: 'US-FDA-LABEL-11920',
        section: '6 ADVERSE REACTIONS & 5.1 Anaphylaxis',
        textSnippet: 'Serious and occasionally fatal hypersensitivity (anaphylactic) reactions have been reported in patients on penicillin therapy.'
      },
      {
        id: 'cit-04',
        source: 'DailyMed Structured Product Label',
        labelId: 'US-FDA-LABEL-11920',
        section: '5.2 Clostridioides difficile Associated Diarrhea',
        textSnippet: 'CDAD has been reported with use of nearly all antibacterial agents, including amoxicillin, and may range in severity from mild diarrhea to fatal colitis.'
      }
    ]
  },
  {
    keywords: ['compare', 'indications', 'amlodipine', 'lisinopril', 'blood pressure'],
    response: `### Comparative Indication Analysis: Amlodipine vs. Lisinopril

Both agents are cornerstone first-line therapies in antihypertensive regimens, yet possess distinct pharmacological profiles and secondary indications:

| Feature | Amlodipine (CCB) | Lisinopril (ACE Inhibitor) |
| :--- | :--- | :--- |
| **Primary Indication** | Hypertension, Angina | Hypertension, Heart Failure, Post-MI |
| **Mechanism** | Dihydropyridine L-type Ca²⁺ channel blockade | Competitive ACE inhibition; reduces Ang II & aldosterone |
| **Unique Indications** | Vasospastic (Prinzmetal’s) Angina, CAD symptoms | Post-Myocardial Infarction (within 24 hrs), HFrEF adjunct |
| **Key Class Effect Adverse Event** | Dose-dependent peripheral ankle edema | Persistent bradykinin-mediated dry cough (3–9%) |
| **Boxed Warning** | None | **Fetal Toxicity** (Discontinue immediately upon pregnancy detection) |
| **Metabolic Impact** | Neutral on glucose & lipid profiles | Favorable in diabetic nephropathy (reduces proteinuria) |`,
    citations: [
      {
        id: 'cit-05',
        source: 'openFDA Structured Product Labels',
        labelId: 'US-FDA-LABEL-33918',
        section: '1 INDICATIONS AND USAGE: Coronary Artery Disease',
        textSnippet: 'Amlodipine is indicated for the symptomatic treatment of chronic stable angina and vasospastic angina.'
      },
      {
        id: 'cit-06',
        source: 'openFDA Structured Product Labels',
        labelId: 'US-FDA-LABEL-55102',
        section: 'WARNINGS: BOXED WARNING (Fetal Toxicity)',
        textSnippet: 'When pregnancy is detected, discontinue Lisinopril as soon as possible. Drugs acting on the renin-angiotensin system can cause fetal harm and death.'
      }
    ]
  },
  {
    keywords: ['evidence', 'pharmaceutical', 'label', 'monograph', 'summarize available'],
    response: `### Summary of Pharmaceutical Label Evidence Structure

In our indexed repository of DailyMed and openFDA Structured Product Labels (SPL), drug records follow the standardized XML format defined by the FDA Guidance for Industry:

1. **Evidence Organization:**
   - **Section 1 (Indications & Usage):** FDA-approved therapeutic conditions based on rigorous Phase III randomized controlled trials.
   - **Section 4 (Contraindications):** Clinical scenarios where the risk clearly outweighs any possible benefit.
   - **Section 5 (Warnings and Precautions):** Clinically significant adverse events and guidance on patient monitoring.
   - **Section 6 (Adverse Reactions):** Quantified incidence rates from controlled trials versus active controls/placebo.
   - **Section 7 (Drug Interactions):** Cytochrome P450, P-glycoprotein, and organic anion/cation transporter pathways.
   - **Section 12 (Clinical Pharmacology):** Pharmacokinetics ($C_{max}$, $AUC$, $t_{1/2}$, renal vs hepatic clearance) and pharmacodynamics.

All data exposed in DrugInsight AI is synchronized directly from these regulatory submissions.`,
    citations: [
      {
        id: 'cit-07',
        source: 'FDA Structured Product Labeling Standard',
        labelId: 'FDA-SPL-STD-2024',
        section: 'Overview of Regulatory Monograph Requirements',
        textSnippet: 'Drug labeling must convey safe and effective utilization instructions based upon robust premarket safety and efficacy evidence.'
      }
    ]
  }
];

// Safety Refusal responses for non-permitted clinical advice
export const SAFETY_REFUSAL_RESPONSE: PredefinedAIAnswer = {
  keywords: ['prescribe', 'dose for me', 'should i take', 'stop taking', 'diagnose', 'my symptoms', 'cure'],
  response: `### ⚠️ Clinical Safety Notice: Prescriptive & Diagnostic Guidance Restricted

**DrugInsight AI is an educational and research platform designed solely for exploring regulatory drug monographs and published pharmaceutical evidence.**

To protect patient safety and adhere to medical compliance standards:
- The AI **cannot** evaluate individual symptoms, provide diagnoses, or recommend personalized treatments.
- The AI **cannot** provide patient-specific dosing regimens or advise on starting, modifying, or discontinuing any prescription therapy.

**Action Required:**
If you or someone under your care is experiencing medical symptoms, side effects, or requires medication adjustments, please consult your personal treating physician, registered pharmacist, or local healthcare emergency provider immediately.`,
  citations: [],
  isRefusal: true
};
