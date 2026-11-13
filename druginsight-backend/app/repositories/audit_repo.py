"""Audit log repository."""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.audit import AuditLog


class AuditRepository:
    """Database repository for security and audit trail logs."""

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
        ip_address: Optional[str] = None
    ) -> AuditLog:
        log = AuditLog(
            actor_user_id=actor_user_id,
            actor_name=actor_name or "System",
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            result=result,
            ip_address=ip_address or "127.0.0.1",
            details=details
        )
        session.add(log)
        await session.flush()
        return log

    async def list_logs(
        self,
        session: AsyncSession,
        action_filter: Optional[str] = None,
        result_filter: Optional[str] = None,
        limit: int = 100
    ) -> List[AuditLog]:
        stmt = select(AuditLog)
        if action_filter:
            stmt = stmt.where(AuditLog.action.ilike(f"%{action_filter}%"))
        if result_filter and result_filter != "all":
            stmt = stmt.where(AuditLog.result == result_filter)
        stmt = stmt.order_by(AuditLog.timestamp.desc()).limit(limit)
        result = await session.execute(stmt)
        return list(result.scalars().all())


audit_repo = AuditRepository()
