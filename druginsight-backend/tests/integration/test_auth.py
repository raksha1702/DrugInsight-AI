"""Integration tests for authentication, registration, login, and token workflows."""

import pytest


@pytest.mark.asyncio
async def test_register_public_user(async_client):
    """Verify new user registration defaults strictly to PUBLIC role."""
    payload = {
        "name": "Jane Citizen",
        "email": "jane.citizen@example.org",
        "password": "Password@123",
        "role": "public",
    }
    res = await async_client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "jane.citizen@example.org"
    assert data["role"].upper() == "PUBLIC"
    assert data["verificationStatus"] == "none"


@pytest.mark.asyncio
async def test_register_duplicate_email_conflict(async_client):
    """Verify duplicate email returns HTTP 409 Conflict."""
    payload = {
        "name": "Duplicate User",
        "email": "admin@druginsight.ai",
        "password": "Password@123",
        "role": "public",
    }
    res = await async_client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 409


@pytest.mark.asyncio
async def test_login_success(async_client):
    """Verify login with correct credentials issues access & refresh tokens."""
    payload = {
        "email": "doctor@hospital.org",
        "password": "Doctor@123456",
    }
    res = await async_client.post("/api/v1/auth/login", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"].upper() == "DOCTOR"


@pytest.mark.asyncio
async def test_login_invalid_password(async_client):
    """Verify login with invalid password returns 401 Unauthorized."""
    payload = {
        "email": "doctor@hospital.org",
        "password": "WrongPassword999",
    }
    res = await async_client.post("/api/v1/auth/login", json=payload)
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_get_me_profile(async_client, doctor_headers):
    """Verify /auth/me returns the authenticated user's profile."""
    res = await async_client.get("/api/v1/auth/me", headers=doctor_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "doctor@hospital.org"
    assert data["role"].upper() == "DOCTOR"
    assert data["accountStatus"] == "active"
