"""Administrator governance, verifications, user management, and audit router."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_admin
from app.models.user import User
from app.repositories.user_repo import user_repo
from app.repositories.audit_repo import audit_repo
from app.schemas.audit import AdminStatsResponse, AuditLogResponse
from app.schemas.verification import VerificationResponse, VerificationReviewRequest
from app.schemas.user import UserResponse
from app.schemas.auth import MessageResponse
from app.schemas.medicine import IngestionStatusResponse
from app.services.verification_service import verification_service
from app.services.audit_service import audit_service
from app.services.auth_service import auth_service
from app.services.ingestion_service import ingestion_service

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/dashboard", response_model=AdminStatsResponse)
async def get_dashboard_stats(
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve platform governance KPI metrics for administrative dashboard."""
    return await audit_service.get_admin_stats(db)


@router.get("/verifications", response_model=List[VerificationResponse])
async def list_verifications(
    status: Optional[str] = Query(None, description="Filter: all, pending, approved, rejected, more_info_required"),
    role: Optional[str] = Query(None, description="Filter: all, doctor, researcher"),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List submitted professional credential applications with status filtering."""
    return await verification_service.admin_list(db, status_filter=status, role_filter=role)


@router.post("/verifications/{request_id}/approve", response_model=VerificationResponse)
async def approve_verification(
    request_id: str,
    review: Optional[VerificationReviewRequest] = None,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Approve applicant credentials and elevate role to DOCTOR or RESEARCHER."""
    notes = review.adminNotes if review else "Approved upon regulatory credential check."
    return await verification_service.admin_review(
        db,
        request_id=request_id,
        action="approve",
        admin_user=current_admin,
        admin_notes=notes,
    )


@router.post("/verifications/{request_id}/reject", response_model=VerificationResponse)
async def reject_verification(
    request_id: str,
    review: Optional[VerificationReviewRequest] = None,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Reject verification application and maintain PUBLIC role."""
    reason = review.rejectionReason if review else "Credential documentation could not be verified."
    notes = review.adminNotes if review else None
    return await verification_service.admin_review(
        db,
        request_id=request_id,
        action="reject",
        admin_user=current_admin,
        admin_notes=notes,
        rejection_reason=reason,
    )


@router.post("/verifications/{request_id}/request-info", response_model=VerificationResponse)
async def request_verification_info(
    request_id: str,
    review: Optional[VerificationReviewRequest] = None,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Request supplemental licensing proof or institutional documentation."""
    notes = review.adminNotes if review else "Please provide an unexpired copy of medical registration or institutional credentials."
    return await verification_service.admin_review(
        db,
        request_id=request_id,
        action="request-info",
        admin_user=current_admin,
        admin_notes=notes,
    )


@router.post("/verifications/{request_id}/revoke", response_model=VerificationResponse)
async def revoke_verification(
    request_id: str,
    review: Optional[VerificationReviewRequest] = None,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Revoke verified credentials and downgrade account back to PUBLIC role."""
    notes = review.adminNotes if review else "Professional verification revoked by administrator."
    return await verification_service.admin_review(
        db,
        request_id=request_id,
        action="revoke",
        admin_user=current_admin,
        admin_notes=notes,
    )


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    role: Optional[str] = Query(None, description="Filter by user role"),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List registered users across all platform roles."""
    users = await user_repo.list_users(db, role=role.upper() if role and role != "all" else None)
    return [auth_service.get_user_profile(u) for u in users]


@router.post("/users/{user_id}/suspend", response_model=MessageResponse)
async def suspend_user(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Suspend user account access."""
    target_user = await user_repo.get_by_id(db, user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")
    target_user.is_active = False
    await audit_repo.log_event(
        session=db,
        action="USER_SUSPENDED",
        resource_type="User",
        resource_id=target_user.id,
        actor_user_id=current_admin.id,
        actor_name=current_admin.full_name,
        result="Warning",
        details=f"Admin suspended account: {target_user.email}",
    )
    return MessageResponse(message=f"User {target_user.email} suspended successfully.")


@router.post("/users/{user_id}/restore", response_model=MessageResponse)
async def restore_user(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Restore active access to a suspended user account."""
    target_user = await user_repo.get_by_id(db, user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")
    target_user.is_active = True
    await audit_repo.log_event(
        session=db,
        action="USER_RESTORED",
        resource_type="User",
        resource_id=target_user.id,
        actor_user_id=current_admin.id,
        actor_name=current_admin.full_name,
        result="Success",
        details=f"Admin restored active status for {target_user.email}",
    )
    return MessageResponse(message=f"User {target_user.email} restored successfully.")


@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def list_audit_logs(
    action: Optional[str] = Query(None, description="Action filter"),
    result: Optional[str] = Query(None, description="Result filter: Success, Warning, Failed"),
    limit: int = Query(100, ge=1, le=500),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Query immutable compliance and security audit logs."""
    return await audit_service.list_logs(db, action_filter=action, result_filter=result, limit=limit)


@router.get("/ingestion/status", response_model=IngestionStatusResponse)
async def get_ingestion_status(
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve DailyMed and openFDA live ingestion pipeline status and record counts."""
    return await ingestion_service.get_status(db)


@router.post("/ingestion/trigger")
async def trigger_ingestion(
    source: Optional[str] = Query("all", description="all, DailyMed, or openFDA"),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """Trigger an on-demand pharmaceutical label sync with deduplication."""
    result = await ingestion_service.trigger_sync(db, source=source)
    await audit_repo.log_event(
        session=db,
        action="INGESTION_TRIGGERED",
        resource_type="IngestionPipeline",
        resource_id=result.get("runId", "manual-sync"),
        actor_user_id=current_admin.id,
        actor_name=current_admin.full_name,
        result="Success" if result.get("status") == "COMPLETED" else "Warning",
        details=f"Admin initiated synchronization for source={source}. Status: {result.get('status')}",
    )
    return result


@router.get("/ingestion/runs")
async def list_ingestion_runs(
    limit: int = Query(10, ge=1, le=50),
    current_admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    """List historical ingestion pipeline sync executions."""
    return await ingestion_service.list_runs(db, limit=limit)
