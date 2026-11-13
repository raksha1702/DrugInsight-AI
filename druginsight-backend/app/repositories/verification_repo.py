"""Verification repository."""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.verification import VerificationRequest, VerificationDocument


class VerificationRepository:
    """Database repository for verification requests and documents."""

    async def get_by_id(self, session: AsyncSession, request_id: str) -> Optional[VerificationRequest]:
        stmt = select(VerificationRequest).where(VerificationRequest.id == request_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_user_id(self, session: AsyncSession, user_id: str) -> Optional[VerificationRequest]:
        stmt = select(VerificationRequest).where(VerificationRequest.user_id == user_id).order_by(VerificationRequest.submitted_at.desc())
        result = await session.execute(stmt)
        return result.scalars().first()

    async def list_requests(self, session: AsyncSession, status: Optional[str] = None, role: Optional[str] = None) -> List[VerificationRequest]:
        stmt = select(VerificationRequest)
        if status and status != "all":
            stmt = stmt.where(VerificationRequest.status == status)
        if role and role != "all":
            stmt = stmt.where(VerificationRequest.requested_role == role)
        result = await session.execute(stmt.order_by(VerificationRequest.submitted_at.desc()))
        return list(result.scalars().all())

    async def create(self, session: AsyncSession, request: VerificationRequest) -> VerificationRequest:
        session.add(request)
        await session.flush()
        return request

    async def add_document(self, session: AsyncSession, document: VerificationDocument) -> VerificationDocument:
        session.add(document)
        await session.flush()
        return document


verification_repo = VerificationRepository()
