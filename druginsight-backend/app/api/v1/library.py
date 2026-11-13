"""Saved research library router for bookmarking and note-taking."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_authenticated_user
from app.models.user import User
from app.schemas.research import SavedResearchCreate, SavedResearchResponse
from app.schemas.auth import MessageResponse
from app.services.library_service import library_service

router = APIRouter(prefix="/library", tags=["Research Library"])


@router.get("", response_model=List[SavedResearchResponse])
@router.get("/", response_model=List[SavedResearchResponse])
async def list_saved_items(
    type: Optional[str] = Query(None, description="Filter by type: medicine, comparison, ai_chat, note"),
    current_user: User = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve all bookmarked items in the user's research library."""
    return await library_service.list_items(db, user_id=current_user.id, item_type=type)


@router.post("", response_model=SavedResearchResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=SavedResearchResponse, status_code=status.HTTP_201_CREATED)
async def save_item(
    req: SavedResearchCreate,
    current_user: User = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db),
):
    """Bookmark a medicine, comparison, note, or chat response into user library."""
    return await library_service.save_item(db, user_id=current_user.id, req=req)


@router.delete("/{item_id}", response_model=MessageResponse)
async def delete_saved_item(
    item_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a bookmarked item from user library."""
    success = await library_service.delete_item(db, user_id=current_user.id, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Saved research item not found.")
    return MessageResponse(message="Research item deleted successfully.")
