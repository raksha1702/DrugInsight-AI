"""User schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    full_name: str
    email: EmailStr


class UserResponse(BaseModel):
    id: str
    name: str  # Frontend uses name
    email: str
    role: str
    verificationStatus: str  # Frontend uses camelCase verificationStatus
    institution: Optional[str] = None
    department: Optional[str] = None
    medicalRegistrationNumber: Optional[str] = None
    licensingAuthority: Optional[str] = None
    countryJurisdiction: Optional[str] = None
    professionalEmail: Optional[str] = None
    accountStatus: str = "active"
    createdAt: str

    class Config:
        from_attributes = True


class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    institution: Optional[str] = None
