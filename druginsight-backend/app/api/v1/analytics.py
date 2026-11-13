"""Pharmaceutical analytics, trends, and export endpoints."""

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_verified_professional
from app.models.user import User
from app.schemas.analytics import AnalyticsOverviewResponse
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_analytics_overview(
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve aggregate pharmaceutical trends and Recharts dataset structures."""
    return await analytics_service.get_overview(db)


@router.get("/export/csv")
async def export_analytics_csv(
    current_user: User = Depends(require_verified_professional),
):
    """Download pharmaceutical regulatory analytics dataset as CSV."""
    csv_data = analytics_service.generate_csv_export()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="druginsight_analytics.csv"'},
    )
