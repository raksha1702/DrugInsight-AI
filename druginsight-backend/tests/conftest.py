"""Pytest test configuration and fixtures."""

import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

TEST_DB_PATH = "./test_druginsight.db"
TEST_DB_URL = f"sqlite+aiosqlite:///{TEST_DB_PATH}"

os.environ["DATABASE_URL"] = TEST_DB_URL

from app.database import Base
from app.main import app, bootstrap_default_users
from app.dependencies import get_db
from app.security.tokens import create_access_token
from app.repositories.user_repo import user_repo

test_engine = create_async_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestSessionLocal = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture(scope="session", autouse=True)
async def init_test_db():
    """Create all tables and seed default users once for test session."""
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except Exception:
            pass

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed users and catalog using test session
    import app.database
    app.database.async_session_maker = TestSessionLocal
    await bootstrap_default_users()

    yield

    await test_engine.dispose()
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except Exception:
            pass


@pytest_asyncio.fixture
async def async_client():
    """Async HTTP test client bound to FastAPI application."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


async def _get_auth_header_for_email(email: str) -> dict:
    async with TestSessionLocal() as session:
        u = await user_repo.get_by_email(session, email)
        if not u:
            raise ValueError(f"User with email {email} not found in test db")
        token = create_access_token({"sub": u.id, "email": u.email, "role": u.role.value if hasattr(u.role, 'value') else u.role})
        return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def admin_headers():
    return await _get_auth_header_for_email("admin@druginsight.ai")


@pytest_asyncio.fixture
async def doctor_headers():
    return await _get_auth_header_for_email("doctor@hospital.org")


@pytest_asyncio.fixture
async def researcher_headers():
    return await _get_auth_header_for_email("researcher@pharma.org")


@pytest_asyncio.fixture
async def public_headers():
    return await _get_auth_header_for_email("patient@health.org")
