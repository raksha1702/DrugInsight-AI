"""Clinical research report generation and download router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_verified_professional
from app.models.user import User
from app.schemas.research import ReportCreateRequest, ReportResponse
from app.schemas.auth import MessageResponse
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("", response_model=List[ReportResponse])
@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """List compiled clinical research reports for the current user."""
    return await report_service.list_reports(db, user_id=current_user.id, author_name=current_user.full_name)


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    req: ReportCreateRequest,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Compile and generate a downloadable clinical PDF report using ReportLab."""
    return await report_service.create_report(db, user=current_user, req=req)


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve metadata for a specific generated report."""
    rep = await report_service.get_report(db, user_id=current_user.id, report_id=report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Report not found.")
    return rep


@router.get("/{report_id}/download")
async def download_report_pdf(
    report_id: str,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Download compiled PDF document for a research report."""
    pdf_bytes = await report_service.get_report_pdf_bytes(db, user_id=current_user.id, report_id=report_id)
    if not pdf_bytes:
        raise HTTPException(status_code=404, detail="Report PDF artifact not found.")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="druginsight_report_{report_id[:8]}.pdf"'},
    )


@router.delete("/{report_id}", response_model=MessageResponse)
async def delete_report(
    report_id: str,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Delete a generated report record and corresponding PDF artifact."""
    deleted = await report_service.delete_report(db, user_id=current_user.id, report_id=report_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Report not found.")
    return MessageResponse(message="Report deleted successfully.")
