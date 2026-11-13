"""Saved research and reports schemas."""

from typing import List, Optional
from pydantic import BaseModel


class SavedResearchCreate(BaseModel):
    type: str  # 'medicine', 'comparison', 'ai_chat', 'note'
    title: str
    subtitle: Optional[str] = None
    targetId: Optional[str] = None
    tags: Optional[List[str]] = []
    notes: Optional[str] = None


class SavedResearchResponse(BaseModel):
    id: str
    userId: str
    type: str
    title: str
    subtitle: Optional[str] = None
    targetId: Optional[str] = None
    createdAt: str
    tags: List[str] = []
    notes: Optional[str] = None

    class Config:
        from_attributes = True


class ReportCreateRequest(BaseModel):
    title: str
    type: str  # 'Comparative Analysis', 'Safety Profile', 'Label Discrepancy', 'Category Summary'
    medicines: List[str]
    author: Optional[str] = None
    includeCharts: bool = True
    includeSources: bool = True


class ReportResponse(BaseModel):
    id: str
    title: str
    type: str
    createdDate: str
    status: str
    medicines: List[str]
    author: str
    fileSize: str
    summary: str

    class Config:
        from_attributes = True
