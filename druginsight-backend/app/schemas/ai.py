"""AI Chat & RAG assistant schemas."""

from typing import List, Optional
from pydantic import BaseModel


class SourceCitationResponse(BaseModel):
    id: str
    source: str
    labelId: str
    section: str
    textSnippet: str


class AIChatRequest(BaseModel):
    question: str
    conversation_id: Optional[str] = None
    medicine_ids: Optional[List[str]] = None


class AIChatResponse(BaseModel):
    id: str
    conversation_id: str
    role: str = "assistant"
    content: str
    timestamp: str
    citations: List[SourceCitationResponse] = []
    safety_status: str  # 'ALLOWED' | 'REFUSED'
    safety_category: str
    grounded: bool
    model_version: str
    isDemo: bool = True
    isRefusal: bool = False


class AIMessageItem(BaseModel):
    id: str
    role: str
    content: str
    timestamp: str
    citations: Optional[List[SourceCitationResponse]] = None
    safety_category: Optional[str] = None


class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[AIMessageItem] = []


class QuestionClassifyRequest(BaseModel):
    question: str


class QuestionClassifyResponse(BaseModel):
    category: str
    confidence: float
    action: str
    model_version: str
