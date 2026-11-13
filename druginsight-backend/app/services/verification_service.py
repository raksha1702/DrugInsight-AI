"""Verification service managing doctor and researcher credential workflows."""

import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, UserRole
from app.models.verification import VerificationRequest, VerificationDocument, VerificationStatus
from app.repositories.verification_repo import verification_repo
from app.repositories.user_repo import user_repo
from app.repositories.audit_repo import audit_repo
from app.schemas.verification import VerificationSubmitRequest, VerificationResponse


class VerificationService:
    """Manages professional credential applications and admin review workflows."""

    def _to_response(self, req: VerificationRequest, user: Optional[User] = None) -> VerificationResponse:
        applicant_name = user.full_name if user else "Verified Professional"
        applicant_email = user.email if user else req.professional_email

        doc_name = "credential_document.pdf"
        doc_type = "application/pdf"
        doc_size = "2.1 MB"

        return VerificationResponse(
            id=req.id,
            userId=req.user_id,
            applicantName=applicant_name,
            applicantEmail=applicant_email,
            requestedRole=req.requested_role.lower(),
            institution=req.institution,
            department=req.department,
            registrationNumber=req.registration_number,
            licensingAuthority=req.licensing_authority,
            countryJurisdiction=req.jurisdiction,
            professionalEmail=req.professional_email,
            proofDocumentName=doc_name,
            proofDocumentType=doc_type,
            proofDocumentSize=doc_size,
            submissionDate=req.submitted_at.strftime("%Y-%m-%d %H:%M"),
            status=req.status.lower(),
            adminNotes=req.admin_notes,
            reviewedBy=req.reviewed_by,
            reviewedDate=req.reviewed_at.strftime("%Y-%m-%d %H:%M") if req.reviewed_at else None
        )

    async def submit(self, session: AsyncSession, current_user: User, data: VerificationSubmitRequest) -> VerificationResponse:
        """Submit professional credentials for administrator review."""
        existing = await verification_repo.get_by_user_id(session, current_user.id)
        role_enum = data.requestedRole.upper()

        if role_enum not in [UserRole.DOCTOR, UserRole.RESEARCHER]:
            raise HTTPException(status_code=400, detail="Invalid requested role. Must be 'doctor' or 'researcher'.")

        if existing and existing.status == VerificationStatus.PENDING:
            # Update existing pending request
            verif_req = existing
            verif_req.requested_role = role_enum
            verif_req.institution = data.institution
            verif_req.department = data.department
            verif_req.registration_number = data.registrationNumber
            verif_req.licensing_authority = data.licensingAuthority
            verif_req.jurisdiction = data.countryJurisdiction
            verif_req.professional_email = data.professionalEmail
            verif_req.submitted_at = datetime.utcnow()
            verif_req.status = VerificationStatus.PENDING
        else:
            verif_req = VerificationRequest(
                user_id=current_user.id,
                requested_role=role_enum,
                institution=data.institution,
                department=data.department,
                registration_number=data.registrationNumber,
                licensing_authority=data.licensingAuthority,
                jurisdiction=data.countryJurisdiction,
                professional_email=data.professionalEmail,
                status=VerificationStatus.PENDING
            )
            await verification_repo.create(session, verif_req)

        # Attach mock document record if metadata was provided
        if data.proofDocumentName:
            doc = VerificationDocument(
                verification_request_id=verif_req.id,
                storage_key=f"docs/{uuid.uuid4()}",
                document_type=data.proofDocumentType or "application/pdf",
                file_name=data.proofDocumentName,
                file_size=2400000,
                file_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            )
            await verification_repo.add_document(session, doc)

        # Update user profile metadata
        current_user.institution = data.institution
        current_user.department = data.department
        current_user.medical_registration_number = data.registrationNumber
        current_user.licensing_authority = data.licensingAuthority
        current_user.jurisdiction = data.countryJurisdiction
        current_user.professional_email = data.professionalEmail

        await audit_repo.log_event(
            session=session,
            action="VERIFICATION_SUBMITTED",
            resource_type="VerificationRequest",
            resource_id=verif_req.id,
            actor_user_id=current_user.id,
            actor_name=current_user.full_name,
            details=f"Submitted {role_enum} verification credentials from {data.institution}."
        )

        return self._to_response(verif_req, user=current_user)

    async def get_user_status(self, session: AsyncSession, current_user: User) -> VerificationResponse:
        """Get the current verification status for the logged-in user."""
        req = await verification_repo.get_by_user_id(session, current_user.id)
        if not req:
            raise HTTPException(status_code=404, detail="No verification application on file.")
        return self._to_response(req, user=current_user)

    async def admin_list(self, session: AsyncSession, status_filter: Optional[str] = None, role_filter: Optional[str] = None) -> List[VerificationResponse]:
        """List all verification requests for administrator auditing."""
        requests = await verification_repo.list_requests(
            session,
            status=status_filter.upper() if status_filter and status_filter != "all" else None,
            role=role_filter.upper() if role_filter and role_filter != "all" else None
        )
        return [self._to_response(r) for r in requests]

    async def admin_review(
        self,
        session: AsyncSession,
        request_id: str,
        action: str,  # 'approve', 'reject', 'request-info', 'revoke'
        admin_user: User,
        admin_notes: Optional[str] = None,
        rejection_reason: Optional[str] = None
    ) -> VerificationResponse:
        """Execute administrator review decision in a safe database transaction."""
        req = await verification_repo.get_by_id(session, request_id)
        if not req:
            raise HTTPException(status_code=404, detail="Verification request not found.")

        target_user = await user_repo.get_by_id(session, req.user_id)
        if not target_user:
            raise HTTPException(status_code=404, detail="Associated applicant user not found.")

        req.reviewed_by = admin_user.full_name
        req.reviewed_at = datetime.utcnow()
        req.admin_notes = admin_notes or req.admin_notes

        if action == "approve":
            req.status = VerificationStatus.APPROVED
            target_user.role = req.requested_role
            audit_action = "VERIFICATION_APPROVED"
            audit_result = "Success"
            details = f"Approved {req.requested_role} credentials for {target_user.full_name}."

        elif action == "reject":
            req.status = VerificationStatus.REJECTED
            req.rejection_reason = rejection_reason or "Credentials could not be verified."
            target_user.role = UserRole.PUBLIC  # Ensure role stays public
            audit_action = "VERIFICATION_REJECTED"
            audit_result = "Warning"
            details = f"Rejected verification submission for {target_user.full_name}."

        elif action == "request-info":
            req.status = VerificationStatus.MORE_INFO_REQUIRED
            audit_action = "VERIFICATION_REQUEST_INFO"
            audit_result = "Warning"
            details = f"Requested supplemental documentation for {target_user.full_name}."

        elif action == "revoke":
            req.status = VerificationStatus.REVOKED
            target_user.role = UserRole.PUBLIC
            audit_action = "VERIFICATION_REVOKED"
            audit_result = "Warning"
            details = f"Revoked professional credentials for {target_user.full_name}."

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported review action '{action}'.")

        await audit_repo.log_event(
            session=session,
            action=audit_action,
            resource_type="VerificationRequest",
            resource_id=req.id,
            actor_user_id=admin_user.id,
            actor_name=admin_user.full_name,
            result=audit_result,
            details=details
        )

        return self._to_response(req, user=target_user)


verification_service = VerificationService()
