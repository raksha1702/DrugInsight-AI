"""FastAPI dependencies for database sessions, authentication, and RBAC."""

from typing import AsyncGenerator, Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session_maker
from app.security.tokens import decode_access_token
from app.repositories.user_repo import user_repo
from app.models.user import User, UserRole

# Reusable HTTP Bearer auth scheme
security = HTTPBearer(auto_error=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to provide an asynchronous SQLAlchemy database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Validate JWT access token and return active authenticated user."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    user = await user_repo.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is suspended. Contact administration.",
        )

    return user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """Return user if authenticated; otherwise return None without raising error."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials, db)
    except HTTPException:
        return None


def require_roles(*allowed_roles: str):
    """Factory dependency enforcing Role-Based Access Control (RBAC)."""

    normalized_roles = [
        r.value if isinstance(r, UserRole) else str(r).upper()
        for r in allowed_roles
    ]

    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role.value if isinstance(current_user.role, UserRole) else str(current_user.role).upper()
        if user_role not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of {normalized_roles} permissions.",
            )
        return current_user

    return role_checker


# Role shortcut dependencies
require_authenticated_user = get_current_user
require_doctor = require_roles(UserRole.DOCTOR, UserRole.ADMIN)
require_researcher = require_roles(UserRole.RESEARCHER, UserRole.ADMIN)
require_verified_professional = require_roles(UserRole.DOCTOR, UserRole.RESEARCHER, UserRole.ADMIN)
require_admin = require_roles(UserRole.ADMIN)
