"""DrugInsight AI FastAPI Backend Application Entrypoint."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import init_db, async_session_maker
from app.api.v1 import api_v1_router
from app.models.user import User, UserRole
from app.security.passwords import hash_password
from app.repositories.user_repo import user_repo
from app.repositories.audit_repo import audit_repo
from app.services.medicine_service import medicine_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("druginsight.main")


async def bootstrap_default_users():
    """Seed default demonstrator accounts across all 4 user roles if not already present."""
    async with async_session_maker() as session:
        default_accounts = [
            {
                "full_name": "System Administrator",
                "email": "admin@druginsight.ai",
                "password": "Admin@123456",
                "role": UserRole.ADMIN,
                "institution": "DrugInsight Governance Board",
                "department": "Platform Security & Ethics",
            },
            {
                "full_name": "Dr. Sarah Lin, MD",
                "email": "doctor@hospital.org",
                "password": "Doctor@123456",
                "role": UserRole.DOCTOR,
                "institution": "Metropolitan University Hospital",
                "department": "Cardiology & Internal Medicine",
                "medical_registration_number": "MED-NY-849201",
                "licensing_authority": "New York State Board of Medicine",
                "jurisdiction": "United States",
            },
            {
                "full_name": "Dr. Marcus Vance, PhD",
                "email": "researcher@pharma.org",
                "password": "Research@123456",
                "role": UserRole.RESEARCHER,
                "institution": "Global Pharmacovigilance Institute",
                "department": "Translational Pharmacology",
                "medical_registration_number": "PHD-RES-39102",
                "licensing_authority": "American Association of Pharmaceutical Scientists",
                "jurisdiction": "United States",
            },
            {
                "full_name": "Elena Rostova",
                "email": "patient@health.org",
                "password": "Public@123456",
                "role": UserRole.PUBLIC,
                "institution": "General Public Consumer",
            },
        ]

        for acc in default_accounts:
            existing = await user_repo.get_by_email(session, acc["email"])
            if not existing:
                u = User(
                    full_name=acc["full_name"],
                    email=acc["email"],
                    password_hash=hash_password(acc["password"]),
                    role=acc["role"],
                    institution=acc.get("institution"),
                    department=acc.get("department"),
                    medical_registration_number=acc.get("medical_registration_number"),
                    licensing_authority=acc.get("licensing_authority"),
                    jurisdiction=acc.get("jurisdiction"),
                    is_active=True,
                )
                session.add(u)
                await session.flush()
                logger.info(f"Bootstrapped default account: {acc['email']} ({acc['role']})")

        # Also seed default medicines
        await medicine_service.ensure_seeded(session)
        await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle startup and shutdown handlers."""
    logger.info("Initializing DrugInsight AI database tables...")
    await init_db()
    logger.info("Seeding baseline users and medicine catalog...")
    await bootstrap_default_users()
    logger.info("DrugInsight AI backend initialized successfully.")
    yield
    logger.info("DrugInsight AI backend shutting down.")


app = FastAPI(
    title="DrugInsight AI API",
    description=(
        "AI-Powered Pharmaceutical Information and Research Platform with Professional Credential Verification. "
        "Strictly for informational and research purposes; not a clinical decision support device or prescription engine."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_v1_router, prefix="/api")


@app.get("/health", tags=["System"])
async def health_check():
    """Service health check endpoint."""
    return {
        "status": "healthy",
        "service": "druginsight-ai-backend",
        "version": "1.0.0",
        "disclaimer": "Informational pharmaceutical platform; not a prescription engine or diagnostic device.",
    }


@app.get("/", tags=["System"])
async def root():
    """Root metadata endpoint."""
    return {
        "name": "DrugInsight AI REST API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "auth": "/api/v1/auth",
            "medicines": "/api/v1/medicines",
            "comparison": "/api/v1/comparison",
            "ai_chat": "/api/v1/ai/chat",
            "analytics": "/api/v1/analytics",
            "library": "/api/v1/library",
            "reports": "/api/v1/reports",
            "admin": "/api/v1/admin",
        },
    }
