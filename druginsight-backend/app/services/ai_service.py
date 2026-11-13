"""AI Chat & Research Assistant service."""

import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User
from app.models.ai import AIConversation, AIMessage, AICitation
from app.repositories.ai_repo import ai_repo
from app.repositories.audit_repo import audit_repo
from app.ml.rag_pipeline import rag_pipeline
from app.schemas.ai import AIChatRequest, AIChatResponse, ConversationResponse, AIMessageItem, SourceCitationResponse


class AIService:
    """Orchestrates RAG chat queries, conversation histories, and citations."""

    async def chat(self, session: AsyncSession, user: User, req: AIChatRequest) -> AIChatResponse:
        """Process user question through RAG pipeline and record message history."""
        # 1. Resolve or create conversation thread
        conv_id = req.conversation_id
        if not conv_id:
            conv = AIConversation(
                user_id=user.id,
                title=req.question[:50] + ("..." if len(req.question) > 50 else "")
            )
            await ai_repo.create_conversation(session, conv)
            conv_id = conv.id
        else:
            conv = await ai_repo.get_conversation(session, conv_id, user.id)
            if not conv:
                conv = AIConversation(
                    id=conv_id,
                    user_id=user.id,
                    title=req.question[:50] + ("..." if len(req.question) > 50 else "")
                )
                await ai_repo.create_conversation(session, conv)

        # 2. Record User Message
        user_msg = AIMessage(
            conversation_id=conv_id,
            role="user",
            content=req.question
        )
        await ai_repo.add_message(session, user_msg)

        # 3. Execute RAG Pipeline
        rag_result = await rag_pipeline.run(
            session=session,
            question=req.question,
            conversation_id=conv_id,
            medicine_ids=req.medicine_ids
        )

        # 4. Record Assistant Message
        assistant_msg = AIMessage(
            conversation_id=conv_id,
            role="assistant",
            content=rag_result["answer"],
            safety_category=rag_result["safety_category"]
        )
        await ai_repo.add_message(session, assistant_msg)

        # 5. Persist Citations
        citations_resp = []
        if rag_result["citations"]:
            cit_models = []
            for c in rag_result["citations"]:
                cit_models.append(AICitation(
                    ai_message_id=assistant_msg.id,
                    source_url="https://dailymed.nlm.nih.gov",
                    cited_text=c["textSnippet"],
                    source_version=c["labelId"]
                ))
                citations_resp.append(SourceCitationResponse(**c))
            await ai_repo.add_citations(session, cit_models)

        # Log safety events if query was refused
        if rag_result.get("is_refusal"):
            await audit_repo.log_event(
                session=session,
                action="AI_SAFETY_REFUSAL",
                resource_type="AIMessage",
                resource_id=assistant_msg.id,
                actor_user_id=user.id,
                actor_name=user.full_name,
                result="Warning",
                details=f"Refused unsafe medical question: '{req.question[:60]}' (Category: {rag_result['safety_category']})."
            )

        return AIChatResponse(
            id=assistant_msg.id,
            conversation_id=conv_id,
            role="assistant",
            content=rag_result["answer"],
            timestamp=datetime.utcnow().strftime("%I:%M %p"),
            citations=citations_resp,
            safety_status=rag_result["safety_status"],
            safety_category=rag_result["safety_category"],
            grounded=rag_result["grounded"],
            model_version=rag_result["model_version"],
            isDemo=True,
            isRefusal=rag_result.get("is_refusal", False)
        )

    async def list_conversations(self, session: AsyncSession, user: User) -> List[ConversationResponse]:
        """List active research chat threads for the current user."""
        convs = await ai_repo.list_conversations(session, user.id)
        return [
            ConversationResponse(
                id=c.id,
                title=c.title,
                created_at=c.created_at.strftime("%Y-%m-%d %H:%M"),
                updated_at=c.updated_at.strftime("%Y-%m-%d %H:%M"),
                messages=[
                    AIMessageItem(
                        id=m.id,
                        role=m.role,
                        content=m.content,
                        timestamp=m.created_at.strftime("%I:%M %p"),
                        safety_category=m.safety_category
                    )
                    for m in c.messages
                ]
            )
            for c in convs
        ]


ai_service = AIService()
