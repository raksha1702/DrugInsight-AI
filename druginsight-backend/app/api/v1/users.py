"""User profile management router."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdateRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
):
    """Retrieve current user profile data."""
    return auth_service.get_user_profile(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    req: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update profile information for the authenticated user."""
    if req.name:
        current_user.full_name = req.name.strip()
    if req.department is not None:
        current_user.department = req.department.strip()
    if req.institution is not None:
        current_user.institution = req.institution.strip()

    await db.flush()
    return auth_service.get_user_profile(current_user)
