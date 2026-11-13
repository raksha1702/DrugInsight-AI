"""Medicine comparison schemas."""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.schemas.medicine import MedicineDetail


class ComparisonRequest(BaseModel):
    medicine_a_id: str
    medicine_b_id: str


class ComparisonResponse(BaseModel):
    medicineA: MedicineDetail
    medicineB: MedicineDetail
    comparisonMatrix: Dict[str, Any]
    disclaimer: str
