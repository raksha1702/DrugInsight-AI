"""API v1 Router aggregation."""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.verification import router as verification_router
from app.api.v1.medicines import router as medicines_router
from app.api.v1.comparison import router as comparison_router
from app.api.v1.ai_chat import router as ai_chat_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.library import router as library_router
from app.api.v1.reports import router as reports_router
from app.api.v1.admin import router as admin_router

api_v1_router = APIRouter(prefix="/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(verification_router)
api_v1_router.include_router(medicines_router)
api_v1_router.include_router(comparison_router)
api_v1_router.include_router(ai_chat_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(library_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(admin_router)
