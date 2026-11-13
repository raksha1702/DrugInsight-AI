"""Saved research and reports repository."""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.research import SavedResearch, ResearchReport
from app.models.comparison import MedicineComparison


class ResearchRepository:
    """Database repository for saved items, comparisons, and generated reports."""

    async def list_saved_items(self, session: AsyncSession, user_id: str, item_type: Optional[str] = None) -> List[SavedResearch]:
        stmt = select(SavedResearch).where(SavedResearch.user_id == user_id)
        if item_type and item_type != "all":
            stmt = stmt.where(SavedResearch.item_type == item_type)
        result = await session.execute(stmt.order_by(SavedResearch.created_at.desc()))
        return list(result.scalars().all())

    async def create_saved_item(self, session: AsyncSession, item: SavedResearch) -> SavedResearch:
        session.add(item)
        await session.flush()
        return item

    async def delete_saved_item(self, session: AsyncSession, item_id: str, user_id: str) -> bool:
        stmt = (
            select(SavedResearch)
            .where(SavedResearch.id == item_id)
            .where(SavedResearch.user_id == user_id)
        )
        result = await session.execute(stmt)
        item = result.scalar_one_or_none()
        if item:
            await session.delete(item)
            await session.flush()
            return True
        return False

    async def list_reports(self, session: AsyncSession, user_id: str) -> List[ResearchReport]:
        stmt = select(ResearchReport).where(ResearchReport.user_id == user_id).order_by(ResearchReport.created_at.desc())
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_report(self, session: AsyncSession, report_id: str, user_id: str) -> Optional[ResearchReport]:
        stmt = (
            select(ResearchReport)
            .where(ResearchReport.id == report_id)
            .where(ResearchReport.user_id == user_id)
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_report(self, session: AsyncSession, report: ResearchReport) -> ResearchReport:
        session.add(report)
        await session.flush()
        return report

    async def delete_report(self, session: AsyncSession, report_id: str, user_id: str) -> bool:
        report = await self.get_report(session, report_id, user_id)
        if report:
            await session.delete(report)
            await session.flush()
            return True
        return False

    async def save_comparison(self, session: AsyncSession, comp: MedicineComparison) -> MedicineComparison:
        session.add(comp)
        await session.flush()
        return comp


research_repo = ResearchRepository()
