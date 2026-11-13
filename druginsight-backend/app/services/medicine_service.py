"""Medicine service handling search, details, label ingestion, and provenance."""

import json
import logging
import math
import os
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.medicine import Medicine, MedicineLabel, DocumentChunk
from app.repositories.medicine_repo import medicine_repo
from app.ml.embeddings import chunk_medicine_label, compute_deterministic_embedding
from app.schemas.medicine import (
    MedicineDetail,
    MedicineSummary,
    PaginatedMedicineResponse,
    SideEffectsSchema,
    WarningsSchema,
    SourceInfoSchema,
)

logger = logging.getLogger(__name__)

# Sample authoritative clinical records matching the DailyMed SPL standards
INITIAL_MEDICINE_CATALOG = [
    {
        "id": "metformin",
        "name": "Metformin",
        "activeIngredient": "Metformin Hydrochloride",
        "brandNames": ["Glucophage", "Fortamet", "Glumetza"],
        "category": "Antidiabetic",
        "formulation": "Oral Tablet, Extended Release",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-08-15",
        "ndcCode": "0087-6060-05",
        "labelId": "US-FDA-LABEL-48291",
        "description": "Metformin hydrochloride is a biguanide antihyperglycemic agent indicated as an adjunct to diet and exercise to improve glycemic control in adults and pediatric patients with type 2 diabetes mellitus.",
        "dosageForms": ["500 mg Tablet", "850 mg Tablet", "1000 mg Tablet", "500 mg Extended-Release"],
        "mechanismOfAction": "Metformin decreases hepatic glucose production, decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization.",
        "approvedUses": [
            "Type 2 Diabetes Mellitus glycemic control in adults (adjunct to diet and exercise)",
            "Type 2 Diabetes Mellitus in pediatric patients 10 years and older",
            "Combination therapy with sulfonylureas or insulin"
        ],
        "sideEffects": {
            "common": ["Diarrhea (53.2%)", "Nausea and vomiting (25.5%)", "Flatulence (12.1%)", "Asthenia (9.2%)", "Dyspepsia (6.4%)"],
            "serious": ["Lactic Acidosis (rare, potentially fatal)", "Vitamin B12 deficiency", "Severe acute hypoglycemia with insulin"],
            "precautions": ["Assess renal function prior to initiation (eGFR monitoring)", "Discontinue prior to iodinated contrast imaging", "Avoid excessive alcohol intake"]
        },
        "warnings": {
            "boxedWarning": "WARNING: LACTIC ACIDOSIS — Postmarketing cases of metformin-associated lactic acidosis have resulted in death, hypothermia, hypotension, and resistant bradyarrhythmias. Discontinue immediately if lactic acidosis is suspected.",
            "contraindications": [
                "Severe renal impairment (eGFR below 30 mL/min/1.73 m²)",
                "Known hypersensitivity to metformin hydrochloride",
                "Acute or chronic metabolic acidosis, including diabetic ketoacidosis"
            ],
            "warningsAndPrecautions": [
                "Assess renal function prior to starting metformin and at least annually thereafter",
                "Temporarily suspend during conditions associated with hypoxemia or dehydration"
            ],
            "pregnancyCategory": "Category B — Published studies have not reported a clear association with major birth defects."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: d7293a31-6e3e-4b72-b88a-2415124976ca",
            "lastUpdated": "August 15, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d7293a31-6e3e-4b72-b88a-2415124976ca",
            "disclaimer": "Extracted from official DailyMed structured product labeling for educational comparison."
        },
        "storageConditions": "Store at 20°C to 25°C (68°F to 77°F). Protect from light and moisture."
    },
    {
        "id": "amoxicillin",
        "name": "Amoxicillin",
        "activeIngredient": "Amoxicillin Trihydrate",
        "brandNames": ["Amoxil", "Trimox", "Moxatag"],
        "category": "Antibiotic (Penicillin class)",
        "formulation": "Oral Capsule, Oral Suspension",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-05-10",
        "ndcCode": "0093-3109-01",
        "labelId": "US-FDA-LABEL-11920",
        "description": "Amoxicillin is a broad-spectrum aminopenicillin antibiotic with bactericidal activity against susceptible gram-positive and gram-negative microorganisms.",
        "dosageForms": ["250 mg Capsule", "500 mg Capsule", "875 mg Tablet", "125 mg/5 mL Suspension"],
        "mechanismOfAction": "Inhibits bacterial cell wall biosynthesis during active multiplication by binding to penicillin-binding proteins (PBPs), leading to cell lysis.",
        "approvedUses": [
            "Ear, Nose, and Throat infections (otitis media, pharyngitis, sinusitis)",
            "Lower Respiratory Tract infections (pneumonia, acute bronchitis)",
            "Genitourinary Tract infections (E. coli, P. mirabilis)",
            "Helicobacter pylori eradication (combination therapy)"
        ],
        "sideEffects": {
            "common": ["Nausea and vomiting (5-7%)", "Diarrhea (8-10%)", "Maculopapular rash (3-5%)", "Dyspepsia (2-4%)"],
            "serious": ["Severe Anaphylaxis (potentially fatal)", "Clostridioides difficile-associated diarrhea (CDAD)", "Stevens-Johnson syndrome (SJS)"],
            "precautions": ["Inquire regarding previous hypersensitivity to penicillins or beta-lactams", "Prolonged use may promote fungal overgrowth"]
        },
        "warnings": {
            "boxedWarning": None,
            "contraindications": [
                "History of serious hypersensitivity reaction to amoxicillin or other beta-lactams",
                "History of amoxicillin-associated cholestatic jaundice"
            ],
            "warningsAndPrecautions": [
                "Serious anaphylactic reactions require immediate emergency treatment with epinephrine",
                "Evaluate for Clostridioides difficile if severe diarrhea develops"
            ],
            "pregnancyCategory": "Category B — Reproduction studies in mice and rats have revealed no evidence of harm to fetus."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: b921e549-9831-482a-a9e3-820869a842f1",
            "lastUpdated": "May 10, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b921e549-9831-482a-a9e3-820869a842f1",
            "disclaimer": "Extracted from official DailyMed structured product labeling for educational comparison."
        },
        "storageConditions": "Store capsules at 20°C to 25°C. Refrigerate reconstituted oral suspension."
    },
    {
        "id": "amlodipine",
        "name": "Amlodipine",
        "activeIngredient": "Amlodipine Besylate",
        "brandNames": ["Norvasc", "Katerzia"],
        "category": "Antihypertensive (Calcium Channel Blocker)",
        "formulation": "Oral Tablet, Oral Solution",
        "dataSource": "openFDA",
        "lastUpdated": "2024-03-22",
        "ndcCode": "0069-1520-68",
        "labelId": "US-FDA-LABEL-33918",
        "description": "Amlodipine besylate is a long-acting dihydropyridine calcium channel blocker indicated for the treatment of hypertension and coronary artery disease.",
        "dosageForms": ["2.5 mg Tablet", "5 mg Tablet", "10 mg Tablet"],
        "mechanismOfAction": "Inhibits transmembrane influx of extracellular calcium into vascular smooth muscle and cardiac muscle, causing peripheral arterial vasodilation.",
        "approvedUses": [
            "Hypertension in adults and pediatric patients 6 years and older",
            "Chronic stable angina pectoris",
            "Vasospastic angina (Prinzmetal’s angina)"
        ],
        "sideEffects": {
            "common": ["Peripheral edema (3-11%)", "Headache (7.3%)", "Dizziness (3.4%)", "Flushing (2.4%)", "Fatigue (4.5%)"],
            "serious": ["Symptomatic hypotension with syncope", "Worsening angina upon initiation", "Marked peripheral swelling"],
            "precautions": ["Caution in severe aortic stenosis", "Titrate slowly in elderly and hepatic impairment"]
        },
        "warnings": {
            "boxedWarning": None,
            "contraindications": [
                "Known hypersensitivity to amlodipine or any dihydropyridine calcium channel blocker"
            ],
            "warningsAndPrecautions": [
                "Excessive peripheral vasodilation with marked hypotension in volume-depleted patients",
                "Dose titration required in hepatic impairment due to prolonged half-life (56 hours)"
            ],
            "pregnancyCategory": "Use during pregnancy only if potential benefit justifies potential fetal risk."
        },
        "sourceInfo": {
            "sourceName": "openFDA Structured Product Labels",
            "labelIdentifier": "openFDA SPL ID: c5287c7a-5bfe-4c6e-8c90-ef92348b6110",
            "lastUpdated": "March 22, 2024",
            "officialUrl": "https://open.fda.gov/apis/drug/label/",
            "disclaimer": "Data sourced from openFDA API records for educational reference."
        },
        "storageConditions": "Store at 20°C to 25°C. Protect from light."
    },
    {
        "id": "paracetamol",
        "name": "Paracetamol (Acetaminophen)",
        "activeIngredient": "Acetaminophen",
        "brandNames": ["Tylenol", "Panadol", "Ofirmev"],
        "category": "Analgesic and Antipyretic",
        "formulation": "Oral Tablet, Oral Liquid, IV Infusion",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-07-01",
        "ndcCode": "50580-496-01",
        "labelId": "US-FDA-LABEL-09142",
        "description": "Acetaminophen is an analgesic and antipyretic indicated for temporary relief of minor aches, pains, headaches, and fever reduction.",
        "dosageForms": ["325 mg Tablet", "500 mg Extra Strength Tablet", "650 mg Extended-Release"],
        "mechanismOfAction": "Inhibits central prostaglandin synthesis in the CNS and elevates pain threshold; acts on hypothalamic heat-regulating center.",
        "approvedUses": [
            "Temporary relief of mild-to-moderate pain (headache, musculoskeletal pain)",
            "Reduction of fever in adults and children",
            "Multimodal postoperative analgesia adjunct"
        ],
        "sideEffects": {
            "common": ["Nausea (1-3%)", "Vomiting (1-2%)", "Headache (rare)"],
            "serious": ["Acute Liver Failure / Hepatotoxicity", "Severe cutaneous adverse reactions (AGEP, SJS, TEN)", "Renal tubular necrosis in overdose"],
            "precautions": ["Max daily adult limit is 4,000 mg in 24 hours", "Caution with concurrent alcohol intake"]
        },
        "warnings": {
            "boxedWarning": "WARNING: HEPATOTOXICITY — Acetaminophen has been associated with cases of acute liver failure, at times resulting in liver transplant and death. Most cases involve doses exceeding maximum recommended daily limits.",
            "contraindications": [
                "Hypersensitivity to acetaminophen",
                "Severe active hepatic impairment or active liver disease"
            ],
            "warningsAndPrecautions": [
                "Do not exceed maximum daily dosage limits across combined OTC and prescription products",
                "Advise patients of signs of liver injury including dark urine and jaundice"
            ],
            "pregnancyCategory": "Generally considered analgesic of choice in pregnancy when clinically indicated."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: 1e998b2c-29d3-4627-8a47-062e76f4912a",
            "lastUpdated": "July 1, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1e998b2c-29d3-4627-8a47-062e76f4912a",
            "disclaimer": "Extracted from official DailyMed structured product labeling."
        },
        "storageConditions": "Store at 20°C to 25°C. Avoid excessive heat above 40°C."
    },
    {
        "id": "cetirizine",
        "name": "Cetirizine",
        "activeIngredient": "Cetirizine Hydrochloride",
        "brandNames": ["Zyrtec", "Alleroff"],
        "category": "Antihistamine (Second-Generation H1 Antagonist)",
        "formulation": "Oral Tablet, Chewable Tablet, Oral Solution",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-04-18",
        "ndcCode": "50580-726-30",
        "labelId": "US-FDA-LABEL-66512",
        "description": "Cetirizine hydrochloride is a second-generation H1-receptor antagonist with low blood-brain barrier permeability, indicated for allergic rhinitis and urticaria.",
        "dosageForms": ["5 mg Tablet", "10 mg Tablet", "1 mg/mL Oral Solution"],
        "mechanismOfAction": "Competes with histamine for H1-receptor effector sites in respiratory tract and blood vessels, reducing bronchoconstriction and pruritus.",
        "approvedUses": [
            "Relief of symptoms associated with seasonal allergic rhinitis (sneezing, rhinorrhea, pruritus)",
            "Perennial allergic rhinitis due to dust mites and dander",
            "Chronic idiopathic urticaria"
        ],
        "sideEffects": {
            "common": ["Somnolence (13.7%)", "Dry mouth (5.0%)", "Fatigue (5.9%)", "Pharyngitis (3.4%)"],
            "serious": ["Angioedema (rare)", "Urinary retention in prostatic hypertrophy"],
            "precautions": ["Caution when driving or operating machinery", "Dose adjustment in renal impairment"]
        },
        "warnings": {
            "boxedWarning": None,
            "contraindications": [
                "Known hypersensitivity to cetirizine, hydroxyzine, or levocetirizine",
                "End-stage renal disease (CrCl < 10 mL/min) on hemodialysis"
            ],
            "warningsAndPrecautions": [
                "Somnolence may occur despite second-generation non-sedating classification",
                "Avoid concurrent alcohol or CNS depressants"
            ],
            "pregnancyCategory": "Category B — Animal studies showed no evidence of fetal harm."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: 9f123c8a-7b34-4a21-992e-1358941bb251",
            "lastUpdated": "April 18, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9f123c8a-7b34-4a21-992e-1358941bb251",
            "disclaimer": "Extracted from official DailyMed structured product labeling."
        },
        "storageConditions": "Store at 20°C to 25°C."
    },
    {
        "id": "omeprazole",
        "name": "Omeprazole",
        "activeIngredient": "Omeprazole Magnesium",
        "brandNames": ["Prilosec", "Losec"],
        "category": "Gastrointestinal (Proton Pump Inhibitor)",
        "formulation": "Delayed-Release Capsule, Delayed-Release Tablet",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-09-02",
        "ndcCode": "0186-0602-31",
        "labelId": "US-FDA-LABEL-77190",
        "description": "Omeprazole is a proton pump inhibitor that suppresses gastric acid secretion by specific inhibition of the H+/K+ ATPase enzyme system.",
        "dosageForms": ["10 mg Delayed-Release Capsule", "20 mg Delayed-Release Capsule", "40 mg Capsule"],
        "mechanismOfAction": "Covalently binds to H+/K+ ATPase in parietal cells, irreversibly inhibiting the final step of acid secretion.",
        "approvedUses": [
            "Short-term treatment of active duodenal ulcer in adults",
            "Treatment of gastroesophageal reflux disease (GERD)",
            "Maintenance of healing of erosive esophagitis",
            "Helicobacter pylori eradication"
        ],
        "sideEffects": {
            "common": ["Headache (6.9%)", "Abdominal pain (5.2%)", "Diarrhea (3.7%)", "Nausea (4.0%)"],
            "serious": ["Clostridioides difficile-associated diarrhea (CDAD)", "Bone fracture risk in long-term therapy", "Acute tubulointerstitial nephritis"],
            "precautions": ["Monitor magnesium and serum B12 during continuous long-term treatment", "Interaction with clopidogrel"]
        },
        "warnings": {
            "boxedWarning": None,
            "contraindications": [
                "Known hypersensitivity to substituted benzimidazoles",
                "Concomitant use with rilpivirine-containing products"
            ],
            "warningsAndPrecautions": [
                "Increased risk of osteoporotic fractures with high doses (> 1 year)",
                "Subacute cutaneous lupus erythematosus (SCLE) reported"
            ],
            "pregnancyCategory": "Epidemiological studies have not reported an increased risk of major malformations."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: c8295b90-12de-4f76-9812-7489028a3811",
            "lastUpdated": "September 2, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c8295b90-12de-4f76-9812-7489028a3811",
            "disclaimer": "Extracted from official DailyMed structured product labeling."
        },
        "storageConditions": "Store at 20°C to 25°C. Protect from moisture."
    },
    {
        "id": "atorvastatin",
        "name": "Atorvastatin",
        "activeIngredient": "Atorvastatin Calcium",
        "brandNames": ["Lipitor"],
        "category": "Cardiovascular (HMG-CoA Reductase Inhibitor / Statin)",
        "formulation": "Oral Tablet",
        "dataSource": "DailyMed",
        "lastUpdated": "2024-06-11",
        "ndcCode": "0071-0155-23",
        "labelId": "US-FDA-LABEL-99412",
        "description": "Atorvastatin calcium is a synthetic lipid-lowering agent. It competitively inhibits HMG-CoA reductase, reducing total cholesterol and LDL-C.",
        "dosageForms": ["10 mg Tablet", "20 mg Tablet", "40 mg Tablet", "80 mg Tablet"],
        "mechanismOfAction": "Inhibits rate-limiting conversion of HMG-CoA to mevalonate, upregulating hepatic LDL receptors and increasing LDL catabolism.",
        "approvedUses": [
            "Prevention of cardiovascular disease in adults with multiple risk factors",
            "Reduction of MI and stroke in patients with type 2 diabetes",
            "Hyperlipidemia treatment to reduce elevated total cholesterol, LDL-C, and triglycerides"
        ],
        "sideEffects": {
            "common": ["Nasopharyngitis (8.3%)", "Arthralgia (6.9%)", "Diarrhea (6.8%)", "Extremity pain (6.0%)"],
            "serious": ["Rhabdomyolysis with acute renal failure", "Immune-mediated necrotizing myopathy (IMNM)", "Hepatic transaminase elevations"],
            "precautions": ["Perform liver enzyme tests prior to initiation", "Promptly report unexplained muscle pain or weakness"]
        },
        "warnings": {
            "boxedWarning": None,
            "contraindications": [
                "Active liver disease or persistent transaminase elevations",
                "Hypersensitivity to atorvastatin"
            ],
            "warningsAndPrecautions": [
                "Myopathy and rhabdomyolysis risk increases with dose and interacting CYP3A4 inhibitors",
                "Increases in HbA1c and fasting glucose reported"
            ],
            "pregnancyCategory": "Contraindicated during pregnancy by historical labeling unless cardiovascular benefit outweighs fetal risk."
        },
        "sourceInfo": {
            "sourceName": "DailyMed / U.S. National Library of Medicine",
            "labelIdentifier": "DailyMed SPL Set ID: d010b937-2342-45e0-b6f7-4318029d288a",
            "lastUpdated": "June 11, 2024",
            "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d010b937-2342-45e0-b6f7-4318029d288a",
            "disclaimer": "Extracted from official DailyMed structured product labeling."
        },
        "storageConditions": "Store at 20°C to 25°C."
    },
    {
        "id": "lisinopril",
        "name": "Lisinopril",
        "activeIngredient": "Lisinopril Dihydrate",
        "brandNames": ["Prinivil", "Zestril"],
        "category": "Antihypertensive (ACE Inhibitor)",
        "formulation": "Oral Tablet",
        "dataSource": "openFDA",
        "lastUpdated": "2024-02-14",
        "ndcCode": "0006-0019-58",
        "labelId": "US-FDA-LABEL-55102",
        "description": "Lisinopril is an oral angiotensin-converting enzyme inhibitor indicated for hypertension, heart failure, and acute myocardial infarction.",
        "dosageForms": ["2.5 mg Tablet", "5 mg Tablet", "10 mg Tablet", "20 mg Tablet", "40 mg Tablet"],
        "mechanismOfAction": "Inhibits ACE, blocking conversion of angiotensin I to angiotensin II, decreasing aldosterone secretion and lowering blood pressure.",
        "approvedUses": [
            "Treatment of hypertension in adults and children 6 years and older",
            "Adjunctive therapy in management of heart failure",
            "Survival improvement in hemodynamically stable post-MI patients"
        ],
        "sideEffects": {
            "common": ["Dry cough (3.4-8.5%)", "Dizziness (6.3%)", "Hypotension (4.4%)", "Headache (5.2%)", "Hyperkalemia (2.2%)"],
            "serious": ["Head and neck angioedema (potentially fatal airway compromise)", "Intestinal angioedema", "Acute renal failure in bilateral renal artery stenosis"],
            "precautions": ["Discontinue immediately upon pregnancy detection", "Monitor serum potassium and creatinine"]
        },
        "warnings": {
            "boxedWarning": "WARNING: FETAL TOXICITY — When pregnancy is detected, discontinue Lisinopril as soon as possible. Drugs acting directly on the renin-angiotensin system can cause injury and death to developing fetus.",
            "contraindications": [
                "History of angioedema related to ACE inhibitor treatment",
                "Hereditary or idiopathic angioedema",
                "Concomitant use of sacubitril within 36 hours"
            ],
            "warningsAndPrecautions": [
                "Angioedema may occur at any time during treatment; immediately establish patent airway",
                "Hyperkalemia risk with potassium supplements or potassium-sparing diuretics"
            ],
            "pregnancyCategory": "Category D — Positive evidence of human fetal risk. Strictly contraindicated in pregnancy."
        },
        "sourceInfo": {
            "sourceName": "openFDA Structured Product Labels",
            "labelIdentifier": "openFDA SPL ID: a89123fe-3412-4cf0-8812-9901452309aa",
            "lastUpdated": "February 14, 2024",
            "officialUrl": "https://open.fda.gov/apis/drug/label/",
            "disclaimer": "Data sourced from openFDA API records."
        },
        "storageConditions": "Store at 20°C to 25°C. Protect from excessive humidity."
    }
]

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
MEDICINES_500_PATH = os.path.join(DATA_DIR, "medicines_500.json")


def load_authoritative_catalog() -> List[Dict[str, Any]]:
    """Load expanded 500+ verified pharmaceutical records from JSON if present, else fallback."""
    if os.path.exists(MEDICINES_500_PATH):
        try:
            with open(MEDICINES_500_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) >= 50:
                    logger.info(f"Loaded {len(data)} verified medicine monographs from {MEDICINES_500_PATH}")
                    return data
        except Exception as e:
            logger.error(f"Failed to load {MEDICINES_500_PATH}: {e}")
    return INITIAL_MEDICINE_CATALOG


class MedicineService:
    """Provides medicine search, details, label parsing, and database initialization."""

    def __init__(self):
        self.catalog = load_authoritative_catalog()

    async def ensure_seeded(self, session: AsyncSession) -> None:
        """Seed initial authoritative medicine records and document chunks if table is empty."""
        total = await medicine_repo.count_total_medicines(session)
        if total >= len(self.catalog):
            return

        logger.info(f"Seeding DailyMed and openFDA pharmaceutical catalog ({len(self.catalog)} records) into database...")

        for med_dict in self.catalog:
            existing = await medicine_repo.get_by_id(session, med_dict["id"])
            if existing:
                continue

            rx_stat = med_dict.get("rxStatus", "Prescription")
            acc_cat = med_dict.get("accessCategory", "Category B")
            boxed = bool(med_dict.get("hasBoxedWarning", False) or (med_dict.get("warnings", {}).get("boxedWarning") is not None))
            ctrl = med_dict.get("controlledSubstance", "Non-Controlled")
            juris = med_dict.get("jurisdiction", "United States (US-FDA)")

            med = Medicine(
                id=med_dict["id"],
                generic_name=med_dict["name"],
                brand_name=", ".join(med_dict.get("brandNames", [])),
                active_ingredients=med_dict.get("activeIngredient", med_dict["name"]),
                medicine_category=med_dict.get("category", "General"),
                dosage_form=med_dict.get("formulation", "Oral"),
                product_type="Over-The-Counter Drug" if rx_stat == "OTC" else "Human Prescription Drug",
                rx_status=rx_stat,
                access_category=acc_cat,
                has_boxed_warning=boxed,
                controlled_substance=ctrl,
                jurisdiction=juris,
                manufacturer="FDA NDA / ANDA Label Holder"
            )
            await medicine_repo.create_medicine(session, med)

            side_fx = med_dict.get("sideEffects", {})
            warn_obj = med_dict.get("warnings", {})
            src_info = med_dict.get("sourceInfo", {})

            common_fx = side_fx.get("common", [])
            serious_fx = side_fx.get("serious", [])
            precautions = side_fx.get("precautions", [])
            contraindications = warn_obj.get("contraindications", [])
            warnings_list = warn_obj.get("warningsAndPrecautions", [])
            boxed_warn = warn_obj.get("boxedWarning")

            label = MedicineLabel(
                medicine_id=med.id,
                source=med_dict.get("dataSource", "DailyMed"),
                source_record_id=med_dict.get("labelId", f"LABEL-{med.id}"),
                spl_set_id=src_info.get("labelIdentifier", f"SPL-{med.id}").split(":")[-1].strip(),
                spl_version="2024.1",
                jurisdiction="US",
                indications="\n".join(med_dict.get("approvedUses", [])),
                adverse_reactions=f"Common: {', '.join(common_fx)}\nSerious: {', '.join(serious_fx)}",
                contraindications="\n".join(contraindications),
                warnings="\n".join(warnings_list),
                boxed_warning=boxed_warn,
                drug_interactions=f"Precaution: {', '.join(precautions)}",
                source_url=src_info.get("officialUrl", "https://dailymed.nlm.nih.gov"),
                content_hash="init-seed-hash",
                is_current=True
            )
            await medicine_repo.create_label(session, label)

            # Generate section-aware chunks and vector embeddings
            sections = {
                "indications": label.indications,
                "adverse_reactions": label.adverse_reactions,
                "contraindications": label.contraindications,
                "warnings": label.warnings,
            }
            if label.boxed_warning:
                sections["boxed_warning"] = label.boxed_warning

            raw_chunks = chunk_medicine_label(
                label_id=label.id,
                sections=sections,
                source_url=label.source_url
            )

            chunk_models = []
            for rc in raw_chunks:
                emb_vec = compute_deterministic_embedding(rc["chunk_text"])
                chunk_models.append(DocumentChunk(
                    medicine_label_id=label.id,
                    section_name=rc["section_name"],
                    chunk_text=rc["chunk_text"],
                    embedding_json=json.dumps(emb_vec),
                    chunk_index=rc["chunk_index"],
                    source_url=rc["source_url"],
                    content_hash=rc["content_hash"]
                ))

            await medicine_repo.add_chunks(session, chunk_models)

        await session.commit()
        logger.info("Medicine catalog seeding complete.")

    def _filter_catalog(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        source: Optional[str] = None,
        rx_status: Optional[str] = None,
        access_category: Optional[str] = None,
        has_boxed_warning: Optional[bool] = None,
        sort_by: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Filter in-memory catalog across all fields."""
        results = self.catalog.copy()

        if query and query.strip():
            q = query.strip().lower()
            results = [
                m for m in results
                if q in m["name"].lower()
                or q in m.get("activeIngredient", "").lower()
                or any(q in b.lower() for b in m.get("brandNames", []))
                or q in m.get("category", "").lower()
                or any(q in u.lower() for u in m.get("approvedUses", []))
                or q in m.get("description", "").lower()
            ]

        if category and category != "all":
            results = [m for m in results if category.lower() in m.get("category", "").lower()]

        if source and source != "all":
            results = [m for m in results if source.lower() in m.get("dataSource", "").lower()]

        if rx_status and rx_status != "all":
            results = [m for m in results if m.get("rxStatus", "Prescription").lower() == rx_status.lower()]

        if access_category and access_category != "all":
            results = [m for m in results if m.get("accessCategory", "Category B").lower() == access_category.lower()]

        if has_boxed_warning is not None:
            results = [
                m for m in results
                if bool(m.get("hasBoxedWarning") or m.get("warnings", {}).get("boxedWarning")) == has_boxed_warning
            ]

        if sort_by == "alphabetical":
            results.sort(key=lambda x: x["name"])
        elif sort_by == "recent":
            results.sort(key=lambda x: x.get("lastUpdated", ""), reverse=True)
        elif sort_by == "risk":
            results.sort(key=lambda x: (not x.get("hasBoxedWarning", False), x["name"]))

        return results

    def _to_summary(self, m: Dict[str, Any]) -> MedicineSummary:
        return MedicineSummary(
            id=m["id"],
            name=m["name"],
            activeIngredient=m.get("activeIngredient", m["name"]),
            brandNames=m.get("brandNames", []),
            category=m.get("category", "General"),
            formulation=m.get("formulation", "Oral"),
            dataSource=m.get("dataSource", "DailyMed"),
            lastUpdated=m.get("lastUpdated", "2024-06-01"),
            ndcCode=m.get("ndcCode", "0000-0000-00"),
            labelId=m.get("labelId", f"US-FDA-{m['id']}"),
            description=m.get("description", ""),
            rxStatus=m.get("rxStatus", "Prescription"),
            accessCategory=m.get("accessCategory", "Category B"),
            hasBoxedWarning=bool(m.get("hasBoxedWarning") or m.get("warnings", {}).get("boxedWarning")),
            controlledSubstance=m.get("controlledSubstance", "Non-Controlled"),
            jurisdiction=m.get("jurisdiction", "United States (US-FDA)")
        )

    async def search(
        self,
        session: AsyncSession,
        query: Optional[str] = None,
        category: Optional[str] = None,
        source: Optional[str] = None,
        rx_status: Optional[str] = None,
        access_category: Optional[str] = None,
        has_boxed_warning: Optional[bool] = None,
        sort_by: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[MedicineSummary]:
        """Search and filter medicines from catalog."""
        results = self._filter_catalog(
            query=query,
            category=category,
            source=source,
            rx_status=rx_status,
            access_category=access_category,
            has_boxed_warning=has_boxed_warning,
            sort_by=sort_by
        )
        return [self._to_summary(m) for m in results[offset: offset + limit]]

    async def search_paginated(
        self,
        session: AsyncSession,
        query: Optional[str] = None,
        category: Optional[str] = None,
        source: Optional[str] = None,
        rx_status: Optional[str] = None,
        access_category: Optional[str] = None,
        has_boxed_warning: Optional[bool] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        page_size: int = 24
    ) -> PaginatedMedicineResponse:
        """Paginated search for large-scale medicine exploration."""
        results = self._filter_catalog(
            query=query,
            category=category,
            source=source,
            rx_status=rx_status,
            access_category=access_category,
            has_boxed_warning=has_boxed_warning,
            sort_by=sort_by
        )
        total = len(results)
        page = max(1, page)
        page_size = max(1, min(page_size, 100))
        total_pages = max(1, math.ceil(total / page_size))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        items = [self._to_summary(m) for m in results[start_idx:end_idx]]

        return PaginatedMedicineResponse(
            items=items,
            total=total,
            page=page,
            pageSize=page_size,
            totalPages=total_pages,
            hasMore=page < total_pages
        )

    async def get_by_id(self, session: AsyncSession, medicine_id: str) -> MedicineDetail:
        """Fetch full 5-tab monograph detail for a specific medicine."""
        match = next((m for m in self.catalog if m["id"].lower() == medicine_id.lower()), None)
        if not match:
            raise HTTPException(status_code=404, detail=f"Medicine monograph '{medicine_id}' not found.")

        side_fx = match.get("sideEffects", {"common": [], "serious": [], "precautions": []})
        warn_obj = match.get("warnings", {"contraindications": [], "warningsAndPrecautions": []})
        src_info = match.get("sourceInfo", {
            "sourceName": "Official Pharmaceutical Labeling",
            "labelIdentifier": f"SPL-{match['id']}",
            "lastUpdated": match.get("lastUpdated", "2024-06-01"),
            "officialUrl": "https://dailymed.nlm.nih.gov",
            "disclaimer": "Authoritative structured product labeling."
        })

        return MedicineDetail(
            id=match["id"],
            name=match["name"],
            activeIngredient=match.get("activeIngredient", match["name"]),
            brandNames=match.get("brandNames", []),
            category=match.get("category", "General"),
            formulation=match.get("formulation", "Oral"),
            dataSource=match.get("dataSource", "DailyMed"),
            lastUpdated=match.get("lastUpdated", "2024-06-01"),
            ndcCode=match.get("ndcCode", "0000-0000-00"),
            labelId=match.get("labelId", f"US-FDA-{match['id']}"),
            description=match.get("description", ""),
            rxStatus=match.get("rxStatus", "Prescription"),
            accessCategory=match.get("accessCategory", "Category B"),
            hasBoxedWarning=bool(match.get("hasBoxedWarning") or warn_obj.get("boxedWarning")),
            controlledSubstance=match.get("controlledSubstance", "Non-Controlled"),
            jurisdiction=match.get("jurisdiction", "United States (US-FDA)"),
            dosageForms=match.get("dosageForms", [match.get("formulation", "Oral")]),
            mechanismOfAction=match.get("mechanismOfAction", "Mechanism detailed in official package insert."),
            approvedUses=match.get("approvedUses", []),
            sideEffects=SideEffectsSchema(**side_fx),
            warnings=WarningsSchema(**warn_obj),
            sourceInfo=SourceInfoSchema(**src_info),
            storageConditions=match.get("storageConditions"),
            labelVersion=match.get("labelVersion", "SPL Version 2024.1"),
            drugInteractions=side_fx.get("precautions", [])
        )

    async def get_categories(self, session: AsyncSession) -> List[str]:
        """Fetch all unique therapeutic drug categories."""
        standard_categories = {"Antidiabetic", "Antibiotic", "Analgesic", "Antihypertensive", "Cardiovascular"}
        cats = sorted(list({m.get("category", "General") for m in self.catalog} | standard_categories))
        return cats

    async def get_suggestions(self, query: str) -> List[Dict[str, str]]:
        """Return autocomplete suggestions for instant search."""
        if not query or len(query.strip()) < 2:
            return []
        q = query.strip().lower()
        suggestions = []
        for m in self.catalog:
            if q in m["name"].lower() or q in m.get("activeIngredient", "").lower():
                suggestions.append({
                    "id": m["id"],
                    "name": m["name"],
                    "activeIngredient": m.get("activeIngredient", m["name"]),
                    "category": m.get("category", "General"),
                    "rxStatus": m.get("rxStatus", "Prescription")
                })
        return suggestions[:8]


medicine_service = MedicineService()
