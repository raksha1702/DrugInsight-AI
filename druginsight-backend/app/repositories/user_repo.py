"""User repository for database access."""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.models.user import User, UserRole


class UserRepository:
    """Database repository for users."""

    async def get_by_id(self, session: AsyncSession, user_id: str) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, session: AsyncSession, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email.lower().strip())
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, session: AsyncSession, user: User) -> User:
        session.add(user)
        await session.flush()
        return user

    async def list_users(self, session: AsyncSession, role: Optional[str] = None, is_active: Optional[bool] = None) -> List[User]:
        stmt = select(User)
        if role:
            stmt = stmt.where(User.role == role)
        if is_active is not None:
            stmt = stmt.where(User.is_active == is_active)
        result = await session.execute(stmt.order_by(User.created_at.desc()))
        return list(result.scalars().all())


user_repo = UserRepository()
