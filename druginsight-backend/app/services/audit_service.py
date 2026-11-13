"""Audit logging and administrative overview service."""

from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.repositories.audit_repo import audit_repo
from app.models.audit import AuditLog
from app.models.user import User, UserRole
from app.models.verification import VerificationRequest, VerificationStatus
from app.schemas.audit import AuditLogResponse, AdminStatsResponse


class AuditService:
    """Manages compliance, security event logs, and administrative KPI aggregates."""

    async def log_event(
        self,
        session: AsyncSession,
        action: str,
        resource_type: str,
        details: str,
        actor_user_id: Optional[str] = None,
        actor_name: Optional[str] = None,
        resource_id: Optional[str] = None,
        result: str = "Success",
        ip_address: Optional[str] = None,
    ) -> AuditLog:
        """Record an immutable compliance and security audit event."""
        return await audit_repo.log_event(
            session=session,
            action=action,
            resource_type=resource_type,
            details=details,
            actor_user_id=actor_user_id,
            actor_name=actor_name,
            resource_id=resource_id,
            result=result,
            ip_address=ip_address,
        )

    async def list_logs(
        self,
        session: AsyncSession,
        action_filter: Optional[str] = None,
        result_filter: Optional[str] = None,
        limit: int = 100,
    ) -> List[AuditLogResponse]:
        """Fetch audit log records formatted for admin dashboard."""
        logs = await audit_repo.list_logs(
            session=session,
            action_filter=action_filter,
            result_filter=result_filter,
            limit=limit,
        )

        responses = []
        for l in logs:
            ts_str = l.timestamp.strftime("%Y-%m-%d %H:%M:%S") if l.timestamp else datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            responses.append(
                AuditLogResponse(
                    id=l.id,
                    timestamp=ts_str,
                    user=l.actor_name or "System",
                    userRole="SYSTEM" if not l.actor_user_id else "USER",
                    action=l.action,
                    result=l.result or "Success",
                    details=l.details,
                    ipAddress=l.ip_address or "127.0.0.1",
                )
            )
        return responses

    async def get_admin_stats(self, session: AsyncSession) -> AdminStatsResponse:
        """Compute system-wide governance metrics for admin dashboard."""
        # Total users
        res_u = await session.execute(select(func.count(User.id)))
        total_users = res_u.scalar() or 0

        # Pending verifications
        res_pv = await session.execute(
            select(func.count(VerificationRequest.id)).where(VerificationRequest.status == VerificationStatus.PENDING)
        )
        pending_verifications = res_pv.scalar() or 0

        # Approved professionals (DOCTOR + RESEARCHER)
        res_prof = await session.execute(
            select(func.count(User.id)).where(User.role.in_([UserRole.DOCTOR, UserRole.RESEARCHER]))
        )
        approved_professionals = res_prof.scalar() or 0

        # Suspended accounts
        res_susp = await session.execute(
            select(func.count(User.id)).where(User.is_active == False)
        )
        suspended_accounts = res_susp.scalar() or 0

        # Total audit entries
        res_aud = await session.execute(select(func.count(AuditLog.id)))
        total_audit = res_aud.scalar() or 0

        return AdminStatsResponse(
            totalUsers=total_users,
            pendingVerifications=pending_verifications,
            approvedProfessionals=approved_professionals,
            suspendedAccounts=suspended_accounts,
            totalAuditEntries=total_audit,
        )


audit_service = AuditService()
