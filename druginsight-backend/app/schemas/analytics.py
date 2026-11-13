"""Pharmaceutical analytics schemas."""

from typing import List, Dict, Any
from pydantic import BaseModel


class AnalyticsKPI(BaseModel):
    title: str
    value: str
    change: str
    trend: str  # 'up', 'down', 'neutral'
    color: str  # 'mint', 'blue', 'lavender', 'peach'
    description: str


class CategoryCount(BaseModel):
    category: str
    count: int
    fill: str


class LabelTrendItem(BaseModel):
    month: str
    updates: int
    safetyAlerts: int


class CategoryDistributionItem(BaseModel):
    name: str
    value: int
    color: str


class WarningSectionCount(BaseModel):
    section: str
    count: int


class DatasetCompositionItem(BaseModel):
    source: str
    active: int
    archived: int


class AnalyticsOverviewResponse(BaseModel):
    kpis: List[AnalyticsKPI]
    records_by_category: List[CategoryCount]
    label_updates_trend: List[LabelTrendItem]
    category_distribution: List[CategoryDistributionItem]
    warning_section_counts: List[WarningSectionCount]
    dataset_composition: List[DatasetCompositionItem]
    disclaimer: str
