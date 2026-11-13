"""Retrieval-Augmented Generation (RAG) pipeline for pharmaceutical research."""

import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ml.safety_classifier import safety_classifier
from app.ml.retrieval import retriever
from app.schemas.ai import SourceCitationResponse, AIChatResponse

logger = logging.getLogger(__name__)

REFUSAL_MESSAGES = {
    "PERSONALIZED_PRESCRIPTION_REQUEST": (
        "### ⚠️ Clinical Safety Notice: Prescriptive Guidance Restricted\n\n"
        "**DrugInsight AI is an educational and pharmaceutical research platform.**\n\n"
        "To protect patient safety and comply with healthcare standards:\n"
        "- The platform **cannot recommend or select treatments** for specific individuals.\n"
        "- The platform **cannot prescribe or substitute medications**.\n\n"
        "**Recommendation:** Please consult a licensed physician or registered pharmacist for personalized treatment decisions."
    ),
    "PERSONALIZED_DOSAGE_REQUEST": (
        "### ⚠️ Clinical Safety Notice: Individualized Dosing Restricted\n\n"
        "**DrugInsight AI does not calculate or modify individualized patient dosages.**\n\n"
        "Dosing adjustments must take into account patient-specific renal function (eGFR), hepatic clearance, age, and concomitant medications under clinical supervision.\n\n"
        "**Recommendation:** Do not alter prescribed medication dosages without the direct guidance of your healthcare provider."
    ),
    "DIAGNOSIS_OR_TREATMENT_REQUEST": (
        "### ⚠️ Clinical Safety Notice: Diagnostic Queries Restricted\n\n"
        "**DrugInsight AI cannot evaluate symptoms or formulate clinical diagnoses.**\n\n"
        "Evaluating acute symptoms requires comprehensive physical assessment, vital signs, and diagnostic laboratory testing.\n\n"
        "**Recommendation:** Please visit an accredited medical clinic or consult your primary care doctor for diagnostic evaluation."
    ),
    "URGENT_MEDICAL_CONCERN": (
        "### 🚨 URGENT MEDICAL ADVISORY\n\n"
        "**Your query describes an acute medical concern or potential overdose.**\n\n"
        "**Action Required Immediately:**\n"
        "- Contact your local **Emergency Medical Services (e.g. 911 / 999 / 112)** immediately.\n"
        "- If accidental ingestion or poisoning is suspected, call the **Poison Help Center (1-800-222-1222)** or proceed to the nearest emergency room.\n"
        "- Do not wait for online informational responses."
    ),
    "OUT_OF_SCOPE": (
        "### ℹ️ Pharmaceutical Research Scope Notice\n\n"
        "DrugInsight AI is dedicated specifically to pharmaceutical science, drug monograph exploration, and regulatory product labeling evidence. Please submit questions related to medicines, approved indications, side effects, or clinical pharmacology."
    )
}


class RAGPipeline:
    """End-to-end grounded RAG assistant with safety boundary enforcement."""

    async def run(
        self,
        session: AsyncSession,
        question: str,
        conversation_id: str,
        medicine_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Execute the RAG workflow and return grounded answer with source citations."""
        # 1. Safety Classification
        classification = safety_classifier.classify(question)
        category = classification["category"]
        action = classification["action"]

        if action != "ALLOW":
            refusal_content = REFUSAL_MESSAGES.get(category, REFUSAL_MESSAGES["PERSONALIZED_PRESCRIPTION_REQUEST"])
            return {
                "answer": refusal_content,
                "citations": [],
                "safety_status": "REFUSED",
                "safety_category": category,
                "grounded": True,
                "model_version": "rag-safety-v1",
                "is_refusal": True
            }

        # 2. Semantic Document Retrieval
        chunks = await retriever.retrieve(
            session=session,
            query=question,
            medicine_ids=medicine_ids,
            top_k=4
        )

        citations: List[Dict[str, Any]] = []
        for i, ch in enumerate(chunks, 1):
            src_name = ch['source']
            if "DailyMed" not in src_name and "openFDA" not in src_name:
                src_name = f"DailyMed / {src_name}"
            elif "openFDA" in src_name and "FDA" not in src_name:
                src_name = f"openFDA / FDA"
            citations.append({
                "id": f"cit-{i}-{ch['chunk_id'][:8]}",
                "source": f"DailyMed / {src_name} Label Monograph",
                "labelId": ch["label_id"],
                "section": ch["section_name"].replace("_", " ").title(),
                "textSnippet": ch["text"][:280] + ("..." if len(ch["text"]) > 280 else "")
            })

        # 3. Grounded Synthesis
        if not chunks:
            answer = (
                f"### Monograph Evidence Synthesis\n\n"
                f"No specific regulatory labeling chunks were retrieved for the query *\"{question}\"*. "
                f"Please ensure the target medicine is indexed in the DailyMed / openFDA catalog."
            )
            grounded = False
        else:
            primary_ch = chunks[0]
            answer = (
                f"### Regulatory Labeling Evidence: {primary_ch['medicine_name'].title()}\n\n"
                f"Based on official Structured Product Labeling (SPL) synchronized from **{primary_ch['source']}** "
                f"(Label ID: `{primary_ch['label_id']}`):\n\n"
                f"**Section: {primary_ch['section_name'].replace('_', ' ').title()}**\n"
                f"{primary_ch['text']}\n\n"
                f"*Note: Synthesized strictly from published product insert monographs for educational and research comparison.*"
            )
            grounded = True

        return {
            "answer": answer,
            "citations": citations,
            "safety_status": "ALLOWED",
            "safety_category": category,
            "grounded": grounded,
            "model_version": "rag-v1-grounded",
            "is_refusal": False
        }


rag_pipeline = RAGPipeline()
