"""Authentication router for registration, login, refresh, and profile retrieval."""

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    PasswordChangeRequest,
    MessageResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    req: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user account. Always defaults to PUBLIC role."""
    user, verif_status = await auth_service.register(db, req)
    return RegisterResponse(
        id=user.id,
        name=user.full_name,
        email=user.email,
        role=user.role,
        verificationStatus=verif_status,
        message="Account registered successfully. If professional credentials were requested, submission is pending approval.",
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    req: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate credentials with Argon2id and issue JWT and refresh tokens."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    return await auth_service.login(db, req, ip_address=client_ip)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    req: RefreshTokenRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Rotate and refresh access token with a valid refresh token."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    return await auth_service.refresh_token(db, req.refresh_token, ip_address=client_ip)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve currently authenticated user identity and profile."""
    return auth_service.get_user_profile(current_user)


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update password for authenticated user."""
    await auth_service.change_password(db, current_user, req)
    return MessageResponse(message="Password changed successfully.")
