"""AI conversation repository."""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.ai import AIConversation, AIMessage, AICitation


class AIRepository:
    """Database repository for conversations, messages, and citations."""

    async def get_conversation(self, session: AsyncSession, conv_id: str, user_id: str) -> Optional[AIConversation]:
        stmt = (
            select(AIConversation)
            .where(AIConversation.id == conv_id)
            .where(AIConversation.user_id == user_id)
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_conversations(self, session: AsyncSession, user_id: str) -> List[AIConversation]:
        stmt = (
            select(AIConversation)
            .where(AIConversation.user_id == user_id)
            .order_by(AIConversation.updated_at.desc())
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def create_conversation(self, session: AsyncSession, conv: AIConversation) -> AIConversation:
        session.add(conv)
        await session.flush()
        return conv

    async def add_message(self, session: AsyncSession, message: AIMessage) -> AIMessage:
        session.add(message)
        await session.flush()
        return message

    async def add_citations(self, session: AsyncSession, citations: List[AICitation]) -> None:
        session.add_all(citations)
        await session.flush()

    async def delete_conversation(self, session: AsyncSession, conv_id: str, user_id: str) -> bool:
        conv = await self.get_conversation(session, conv_id, user_id)
        if conv:
            await session.delete(conv)
            await session.flush()
            return True
        return False


ai_repo = AIRepository()
