"""Audit log schemas."""

from typing import Optional
from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: str
    timestamp: str
    user: str
    userRole: str
    action: str
    result: str  # 'Success', 'Warning', 'Failed'
    details: str
    ipAddress: str

    class Config:
        from_attributes = True


class AdminStatsResponse(BaseModel):
    totalUsers: int
    pendingVerifications: int
    approvedProfessionals: int
    suspendedAccounts: int
    totalAuditEntries: int
