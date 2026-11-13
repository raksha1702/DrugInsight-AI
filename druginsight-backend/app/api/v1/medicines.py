"""Medicine catalog, search, and monograph endpoints."""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.schemas.medicine import MedicineSummary, MedicineDetail, PaginatedMedicineResponse
from app.services.medicine_service import medicine_service

router = APIRouter(prefix="/medicines", tags=["Medicines"])


@router.get("", response_model=List[MedicineSummary])
@router.get("/", response_model=List[MedicineSummary])
async def list_medicines(
    q: Optional[str] = Query(None, description="Search term for brand name or active entity"),
    category: Optional[str] = Query(None, description="Therapeutic category filter"),
    source: Optional[str] = Query(None, description="DailyMed or openFDA data source filter"),
    rx_status: Optional[str] = Query(None, description="OTC or Prescription filter"),
    access_category: Optional[str] = Query(None, description="Category A, Category B, or Category C filter"),
    has_boxed_warning: Optional[bool] = Query(None, description="Filter medicines with boxed warnings"),
    sort_by: Optional[str] = Query(None, description="alphabetical, recent, or risk"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve indexed medicines with search, access category, and risk filtering."""
    return await medicine_service.search(
        db,
        query=q,
        category=category,
        source=source,
        rx_status=rx_status,
        access_category=access_category,
        has_boxed_warning=has_boxed_warning,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )


@router.get("/paginated", response_model=PaginatedMedicineResponse)
async def list_medicines_paginated(
    q: Optional[str] = Query(None, description="Search term"),
    category: Optional[str] = Query(None, description="Therapeutic category filter"),
    source: Optional[str] = Query(None, description="DailyMed or openFDA"),
    rx_status: Optional[str] = Query(None, description="OTC or Prescription"),
    access_category: Optional[str] = Query(None, description="Category A, Category B, or Category C"),
    has_boxed_warning: Optional[bool] = Query(None, description="Has boxed warning"),
    sort_by: Optional[str] = Query(None, description="alphabetical, recent, or risk"),
    page: int = Query(1, ge=1, description="Page number"),
    pageSize: int = Query(24, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """Paginated medicine exploration supporting high-scale catalog traversal."""
    return await medicine_service.search_paginated(
        db,
        query=q,
        category=category,
        source=source,
        rx_status=rx_status,
        access_category=access_category,
        has_boxed_warning=has_boxed_warning,
        sort_by=sort_by,
        page=page,
        page_size=pageSize
    )


@router.get("/categories", response_model=List[str])
async def get_categories(
    db: AsyncSession = Depends(get_db),
):
    """List unique therapeutic drug categories."""
    return await medicine_service.get_categories(db)


@router.get("/suggestions", response_model=List[Dict[str, Any]])
async def get_suggestions(
    q: str = Query(..., min_length=1, description="Autocomplete query prefix"),
):
    """Fast autocomplete suggestions for real-time search bars."""
    return await medicine_service.get_suggestions(query=q)


@router.get("/{medicine_id}", response_model=MedicineDetail)
async def get_medicine(
    medicine_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve full structured 5-tab monograph for a specific medicine."""
    return await medicine_service.get_by_id(db, medicine_id=medicine_id)
