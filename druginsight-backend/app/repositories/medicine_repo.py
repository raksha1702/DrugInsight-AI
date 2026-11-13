"""Medicine repository."""

from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func, desc
from app.models.medicine import Medicine, MedicineLabel, DocumentChunk, IngestionRun


class MedicineRepository:
    """Database repository for medicines, labeling, and ingestion records."""

    async def get_by_id(self, session: AsyncSession, medicine_id: str) -> Optional[Medicine]:
        stmt = select(Medicine).where(Medicine.id == medicine_id.lower())
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_current_label(self, session: AsyncSession, medicine_id: str) -> Optional[MedicineLabel]:
        stmt = (
            select(MedicineLabel)
            .where(MedicineLabel.medicine_id == medicine_id.lower())
            .where(MedicineLabel.is_current == True)
        )
        result = await session.execute(stmt)
        return result.scalars().first()

    async def list_medicines(
        self,
        session: AsyncSession,
        query: Optional[str] = None,
        category: Optional[str] = None,
        source: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Medicine]:
        stmt = select(Medicine)

        if query and query.strip():
            q = f"%{query.strip().lower()}%"
            stmt = stmt.where(
                or_(
                    Medicine.generic_name.ilike(q),
                    Medicine.brand_name.ilike(q),
                    Medicine.active_ingredients.ilike(q),
                    Medicine.medicine_category.ilike(q),
                )
            )

        if category and category != "all":
            stmt = stmt.where(Medicine.medicine_category.ilike(f"%{category}%"))

        stmt = stmt.order_by(Medicine.generic_name.asc()).offset(offset).limit(limit)
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def count_medicines(
        self,
        session: AsyncSession,
        query: Optional[str] = None,
        category: Optional[str] = None,
        rx_status: Optional[str] = None,
        access_category: Optional[str] = None,
        has_boxed_warning: Optional[bool] = None,
    ) -> int:
        stmt = select(func.count(Medicine.id))

        if query and query.strip():
            q = f"%{query.strip().lower()}%"
            stmt = stmt.where(
                or_(
                    Medicine.generic_name.ilike(q),
                    Medicine.brand_name.ilike(q),
                    Medicine.active_ingredients.ilike(q),
                    Medicine.medicine_category.ilike(q),
                )
            )

        if category and category != "all":
            stmt = stmt.where(Medicine.medicine_category.ilike(f"%{category}%"))

        if rx_status and rx_status != "all":
            stmt = stmt.where(Medicine.rx_status == rx_status)

        if access_category and access_category != "all":
            stmt = stmt.where(Medicine.access_category == access_category)

        if has_boxed_warning is not None:
            stmt = stmt.where(Medicine.has_boxed_warning == has_boxed_warning)

        result = await session.execute(stmt)
        return result.scalar() or 0

    async def get_categories(self, session: AsyncSession) -> List[str]:
        stmt = select(Medicine.medicine_category).distinct()
        result = await session.execute(stmt)
        return [c for c in result.scalars().all() if c]

    async def count_total_medicines(self, session: AsyncSession) -> int:
        stmt = select(func.count(Medicine.id))
        result = await session.execute(stmt)
        return result.scalar() or 0

    async def create_medicine(self, session: AsyncSession, med: Medicine) -> Medicine:
        session.add(med)
        await session.flush()
        return med

    async def create_label(self, session: AsyncSession, label: MedicineLabel) -> MedicineLabel:
        session.add(label)
        await session.flush()
        return label

    async def add_chunks(self, session: AsyncSession, chunks: List[DocumentChunk]) -> None:
        session.add_all(chunks)
        await session.flush()

    async def record_ingestion_run(self, session: AsyncSession, run: IngestionRun) -> IngestionRun:
        session.add(run)
        await session.flush()
        return run

    async def get_latest_ingestion_run(self, session: AsyncSession) -> Optional[IngestionRun]:
        stmt = select(IngestionRun).order_by(desc(IngestionRun.started_at)).limit(1)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_ingestion_runs(self, session: AsyncSession, limit: int = 10) -> List[IngestionRun]:
        stmt = select(IngestionRun).order_by(desc(IngestionRun.started_at)).limit(limit)
        result = await session.execute(stmt)
        return list(result.scalars().all())


medicine_repo = MedicineRepository()
