"""Authentication and authorization service."""

from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Tuple
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.models.verification import VerificationRequest, VerificationStatus
from app.models.token import RefreshToken
from app.repositories.user_repo import user_repo
from app.repositories.audit_repo import audit_repo
from app.security.passwords import hash_password, verify_password
from app.security.tokens import create_access_token, generate_refresh_token, hash_token, decode_access_token
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.config import settings


class AuthService:
    """Handles secure registration, authentication, token rotation, and credential governance."""

    def _user_to_response(self, user: User, verification_status: str = "none") -> UserResponse:
        return UserResponse(
            id=user.id,
            name=user.full_name,
            email=user.email,
            role=user.role.lower(),
            verificationStatus=verification_status,
            institution=user.institution,
            department=user.department,
            medicalRegistrationNumber=user.medical_registration_number,
            licensingAuthority=user.licensing_authority,
            countryJurisdiction=user.jurisdiction,
            professionalEmail=user.professional_email,
            accountStatus="active" if user.is_active else "suspended",
            createdAt=user.created_at.strftime("%Y-%m-%d")
        )

    def get_user_profile(self, user: User, verification_status: str = "none") -> UserResponse:
        verif = verification_status
        role_val = user.role.value if hasattr(user.role, "value") else str(user.role)
        if verif == "none" and role_val.upper() in ["DOCTOR", "RESEARCHER"]:
            verif = "approved"
        return self._user_to_response(user, verification_status=verif)

    async def register(self, session: AsyncSession, req: RegisterRequest) -> Tuple[User, str]:
        """Register a new user account. Always defaults to PUBLIC role."""
        existing = await user_repo.get_by_email(session, req.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists."
            )

        requested_role = req.role.upper()
        # Security: Never assign elevated roles directly upon registration
        initial_role = UserRole.PUBLIC

        hashed_pw = hash_password(req.password)
        new_user = User(
            full_name=req.name.strip(),
            email=req.email.lower().strip(),
            password_hash=hashed_pw,
            role=initial_role,
            is_active=True
        )
        user = await user_repo.create(session, new_user)

        # If user selected Doctor or Researcher, initialize a pending verification request
        verif_status = "none"
        if requested_role in [UserRole.DOCTOR, UserRole.RESEARCHER]:
            verif_req = VerificationRequest(
                user_id=user.id,
                requested_role=requested_role,
                institution="Pending Credential Submission",
                professional_email=user.email,
                status=VerificationStatus.PENDING,
                admin_notes="Account registered; awaiting professional license/affiliation documents."
            )
            session.add(verif_req)
            verif_status = "pending"

        await audit_repo.log_event(
            session=session,
            action="REGISTRATION",
            resource_type="User",
            resource_id=user.id,
            actor_user_id=user.id,
            actor_name=user.full_name,
            details=f"New user registered ({user.email}). Assigned role: {initial_role}."
        )

        return user, verif_status

    async def login(self, session: AsyncSession, req: LoginRequest, ip_address: str = "127.0.0.1") -> TokenResponse:
        """Authenticate user with Argon2id and return JWT and refresh token."""
        user = await user_repo.get_by_email(session, req.email)

        # Constant-time error to mitigate account enumeration
        if not user or not verify_password(req.password, user.password_hash):
            await audit_repo.log_event(
                session=session,
                action="LOGIN_FAILURE",
                resource_type="User",
                actor_name=req.email,
                result="Failed",
                ip_address=ip_address,
                details=f"Failed login attempt for {req.email}."
            )
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is suspended. Please contact platform administration."
            )

        # Determine verification status
        verif_status = "none"
        if user.role in [UserRole.DOCTOR, UserRole.RESEARCHER]:
            verif_status = "approved"
        elif user.verification_requests:
            latest = user.verification_requests[-1]
            verif_status = latest.status.lower()

        # Update last login timestamp
        user.last_login_at = datetime.utcnow()

        # Generate tokens
        access_token = create_access_token({
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "verif": verif_status
        })

        raw_refresh = generate_refresh_token()
        refresh_obj = RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh),
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        session.add(refresh_obj)

        await audit_repo.log_event(
            session=session,
            action="LOGIN_SUCCESS",
            resource_type="User",
            resource_id=user.id,
            actor_user_id=user.id,
            actor_name=user.full_name,
            ip_address=ip_address,
            details=f"Successful login for {user.email} (Role: {user.role})."
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            refresh_token=raw_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=self._user_to_response(user, verif_status)
        )


auth_service = AuthService()
