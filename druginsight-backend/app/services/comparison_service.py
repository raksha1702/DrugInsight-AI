"""Medicine comparison service."""

from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.services.medicine_service import medicine_service
from app.schemas.comparison import ComparisonResponse


class ComparisonService:
    """Builds side-by-side clinical comparison matrices between two pharmaceutical monographs."""

    async def compare(self, session: AsyncSession, med_a_id: str, med_b_id: str) -> ComparisonResponse:
        """Compare two medications side by side."""
        if med_a_id.lower() == med_b_id.lower():
            raise HTTPException(status_code=400, detail="Cannot compare a medicine with itself. Select two distinct medicines.")

        med_a = await medicine_service.get_by_id(session, med_a_id)
        med_b = await medicine_service.get_by_id(session, med_b_id)

        matrix = {
            "activeIngredients": {
                "medicineA": med_a.activeIngredient,
                "medicineB": med_b.activeIngredient,
            },
            "categories": {
                "medicineA": med_a.category,
                "medicineB": med_b.category,
            },
            "formulations": {
                "medicineA": med_a.formulation,
                "medicineB": med_b.formulation,
            },
            "mechanisms": {
                "medicineA": med_a.mechanismOfAction,
                "medicineB": med_b.mechanismOfAction,
            },
            "approvedUses": {
                "medicineA": med_a.approvedUses,
                "medicineB": med_b.approvedUses,
            },
            "boxedWarning": {
                "medicineA": med_a.warnings.boxedWarning or "No Boxed Warning",
                "medicineB": med_b.warnings.boxedWarning or "No Boxed Warning",
            },
            "contraindications": {
                "medicineA": med_a.warnings.contraindications,
                "medicineB": med_b.warnings.contraindications,
            },
            "commonSideEffects": {
                "medicineA": med_a.sideEffects.common,
                "medicineB": med_b.sideEffects.common,
            },
            "provenance": {
                "medicineA": f"{med_a.dataSource} (Label ID: {med_a.labelId})",
                "medicineB": f"{med_b.dataSource} (Label ID: {med_b.labelId})",
            }
        }

        disclaimer = (
            "Comparative Monograph Compliance Notice: This side-by-side comparison displays statutory product labeling "
            "parameters for educational and academic research. DrugInsight AI does not evaluate patient clinical history "
            "and does not recommend which medication an individual patient should take."
        )

        return ComparisonResponse(
            medicineA=med_a,
            medicineB=med_b,
            comparisonMatrix=matrix,
            disclaimer=disclaimer
        )


comparison_service = ComparisonService()
