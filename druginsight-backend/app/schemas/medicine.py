"""Medicine schemas with risk classification, pagination, and ingestion tracking."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class SideEffectsSchema(BaseModel):
    common: List[str]
    serious: List[str]
    precautions: List[str]


class WarningsSchema(BaseModel):
    boxedWarning: Optional[str] = None
    contraindications: List[str]
    warningsAndPrecautions: List[str]
    pregnancyCategory: Optional[str] = None


class SourceInfoSchema(BaseModel):
    sourceName: str
    labelIdentifier: str
    lastUpdated: str
    officialUrl: str
    disclaimer: str


class MedicineSummary(BaseModel):
    id: str
    name: str
    activeIngredient: str
    brandNames: List[str]
    category: str
    formulation: str
    dataSource: str
    lastUpdated: str
    ndcCode: str
    labelId: str
    description: str
    rxStatus: str = "Prescription"  # 'OTC' or 'Prescription'
    accessCategory: str = "Category B"  # 'Category A', 'Category B', 'Category C'
    hasBoxedWarning: bool = False
    controlledSubstance: Optional[str] = "Non-Controlled"
    jurisdiction: Optional[str] = "United States (US-FDA)"


class MedicineDetail(MedicineSummary):
    dosageForms: List[str]
    mechanismOfAction: str
    approvedUses: List[str]
    sideEffects: SideEffectsSchema
    warnings: WarningsSchema
    sourceInfo: SourceInfoSchema
    storageConditions: Optional[str] = None
    labelVersion: Optional[str] = "SPL Version 1.0"
    drugInteractions: Optional[List[str]] = []


class PaginatedMedicineResponse(BaseModel):
    items: List[MedicineSummary]
    total: int
    page: int
    pageSize: int
    totalPages: int
    hasMore: bool


class IngestionStatusResponse(BaseModel):
    lastSyncTime: str
    totalRecords: int
    activeSources: List[str]
    status: str
    totalIngestionRuns: int
    latestRun: Optional[Dict[str, Any]] = None
