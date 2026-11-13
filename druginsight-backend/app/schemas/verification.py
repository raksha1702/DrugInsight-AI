"""Verification schemas."""

from typing import Optional, List
from pydantic import BaseModel, EmailStr


class VerificationSubmitRequest(BaseModel):
    requestedRole: str  # 'doctor' or 'researcher'
    applicantName: Optional[str] = None
    applicantEmail: Optional[EmailStr] = None
    institution: str
    department: Optional[str] = None
    registrationNumber: Optional[str] = None
    licensingAuthority: Optional[str] = None
    countryJurisdiction: Optional[str] = None
    professionalEmail: EmailStr
    proofDocumentName: Optional[str] = None
    proofDocumentType: Optional[str] = None
    proofDocumentSize: Optional[str] = None


class VerificationReviewRequest(BaseModel):
    adminNotes: Optional[str] = None
    rejectionReason: Optional[str] = None


class VerificationDocumentResponse(BaseModel):
    id: str
    fileName: str
    fileSize: int
    documentType: str
    uploadedAt: str


class VerificationResponse(BaseModel):
    id: str
    userId: str
    applicantName: str
    applicantEmail: str
    requestedRole: str
    institution: str
    department: Optional[str] = None
    registrationNumber: Optional[str] = None
    licensingAuthority: Optional[str] = None
    countryJurisdiction: Optional[str] = None
    professionalEmail: str
    proofDocumentName: Optional[str] = None
    proofDocumentType: Optional[str] = None
    proofDocumentSize: Optional[str] = None
    submissionDate: str
    status: str
    adminNotes: Optional[str] = None
    reviewedBy: Optional[str] = None
    reviewedDate: Optional[str] = None

    class Config:
        from_attributes = True
