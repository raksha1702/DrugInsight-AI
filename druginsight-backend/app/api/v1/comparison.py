"""Medicine side-by-side comparison router."""

from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_verified_professional
from app.models.user import User
from app.schemas.comparison import ComparisonRequest, ComparisonResponse
from app.services.comparison_service import comparison_service

router = APIRouter(prefix="/comparison", tags=["Comparison"])


@router.post("", response_model=ComparisonResponse)
@router.post("/", response_model=ComparisonResponse)
async def compare_medicines_post(
    req: ComparisonRequest,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Generate side-by-side clinical comparison matrix for two medicines."""
    return await comparison_service.compare(db, req.medicine_a_id, req.medicine_b_id)


@router.get("", response_model=ComparisonResponse)
@router.get("/", response_model=ComparisonResponse)
async def compare_medicines_get(
    medicine_a_id: Optional[str] = Query(None, alias="medicineA"),
    medicine_b_id: Optional[str] = Query(None, alias="medicineB"),
    a: Optional[str] = Query(None),
    b: Optional[str] = Query(None),
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Query comparison via GET parameters."""
    first_id = medicine_a_id or a
    second_id = medicine_b_id or b
    if not first_id or not second_id:
        raise HTTPException(
            status_code=400,
            detail="Both 'medicineA' and 'medicineB' query parameters are required for comparison.",
        )
    return await comparison_service.compare(db, first_id, second_id)
