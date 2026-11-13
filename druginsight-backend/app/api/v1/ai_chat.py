"""AI Research Assistant and clinical query classification router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db, require_verified_professional
from app.models.user import User
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    ConversationResponse,
    QuestionClassifyRequest,
    QuestionClassifyResponse,
)
from app.services.ai_service import ai_service
from app.ml.safety_classifier import safety_classifier

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/chat", response_model=AIChatResponse)
async def chat(
    req: AIChatRequest,
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Run source-grounded RAG query through clinical safety boundary."""
    return await ai_service.chat(db, current_user, req)


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    current_user: User = Depends(require_verified_professional),
    db: AsyncSession = Depends(get_db),
):
    """Fetch active research conversation histories for authenticated professional."""
    return await ai_service.list_conversations(db, current_user)


@router.post("/classify-question", response_model=QuestionClassifyResponse)
async def classify_question(
    req: QuestionClassifyRequest,
    current_user: User = Depends(require_verified_professional),
):
    """Classify clinical intent and safety constraints using hybrid ML model."""
    result = safety_classifier.classify(req.question)
    return QuestionClassifyResponse(
        category=result["category"],
        confidence=result["confidence"],
        action=result["action"],
        model_version=result["model_version"],
    )
