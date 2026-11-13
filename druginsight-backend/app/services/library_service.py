"""Saved research library service for bookmarks, comparisons, notes, and AI interactions."""

import json
from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.research_repo import research_repo
from app.models.research import SavedResearch
from app.schemas.research import SavedResearchCreate, SavedResearchResponse


class LibraryService:
    """Manages clinician and researcher bookmarked research items."""

    def _to_response(self, item: SavedResearch) -> SavedResearchResponse:
        tags = []
        if item.tags:
            try:
                tags = json.loads(item.tags) if item.tags.startswith("[") else [t.strip() for t in item.tags.split(",") if t.strip()]
            except Exception:
                tags = [item.tags]

        created_str = item.created_at.strftime("%Y-%m-%d") if item.created_at else datetime.utcnow().strftime("%Y-%m-%d")

        return SavedResearchResponse(
            id=item.id,
            userId=item.user_id,
            type=item.item_type,
            title=item.title,
            subtitle=None,
            targetId=item.reference_id,
            createdAt=created_str,
            tags=tags,
            notes=item.notes,
        )

    async def list_items(self, session: AsyncSession, user_id: str, item_type: Optional[str] = None) -> List[SavedResearchResponse]:
        """Fetch all bookmarked items for a user, optionally filtered by type."""
        items = await research_repo.list_saved_items(session, user_id=user_id, item_type=item_type)
        return [self._to_response(item) for item in items]

    async def save_item(self, session: AsyncSession, user_id: str, req: SavedResearchCreate) -> SavedResearchResponse:
        """Create and store a research item in the user's library."""
        tags_str = json.dumps(req.tags) if req.tags else "[]"
        item = SavedResearch(
            user_id=user_id,
            item_type=req.type,
            title=req.title,
            reference_id=req.targetId,
            tags=tags_str,
            notes=req.notes,
        )
        created = await research_repo.create_saved_item(session, item)
        return self._to_response(created)

    async def delete_item(self, session: AsyncSession, user_id: str, item_id: str) -> bool:
        """Remove a research item from the user's library."""
        return await research_repo.delete_saved_item(session, item_id=item_id, user_id=user_id)


library_service = LibraryService()
