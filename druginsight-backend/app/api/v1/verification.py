"""Professional verification workflow router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user_optional, get_current_user
from app.models.user import User
from app.repositories.user_repo import user_repo
from app.schemas.verification import VerificationSubmitRequest, VerificationResponse
from app.services.verification_service import verification_service

router = APIRouter(prefix="/verification", tags=["Verification"])


@router.post("/submit", response_model=VerificationResponse, status_code=status.HTTP_201_CREATED)
async def submit_verification(
    data: VerificationSubmitRequest,
    current_user: User = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Submit professional credentials for Doctor or Researcher role."""
    target_user = current_user
    if not target_user:
        # Check if email is provided in applicantEmail or professionalEmail
        lookup_email = data.applicantEmail or data.professionalEmail
        if lookup_email:
            target_user = await user_repo.get_by_email(db, str(lookup_email))

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You must be signed in or provide a registered email to submit verification credentials.",
        )

    return await verification_service.submit(db, target_user, data)


@router.get("/status", response_model=VerificationResponse)
async def get_verification_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve current verification review status for the authenticated user."""
    return await verification_service.get_user_status(db, current_user)
