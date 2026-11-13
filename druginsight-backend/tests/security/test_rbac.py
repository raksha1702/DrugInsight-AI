"""Security and Role-Based Access Control (RBAC) tests."""

import pytest


@pytest.mark.asyncio
async def test_public_user_forbidden_from_admin_dashboard(async_client, public_headers):
    """Verify PUBLIC role is rejected with 403 from administrative endpoints."""
    res = await async_client.get("/api/v1/admin/dashboard", headers=public_headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_public_user_forbidden_from_ai_chat(async_client, public_headers):
    """Verify PUBLIC role is rejected with 403 from AI Research Assistant."""
    payload = {"question": "What are interactions between metformin and insulin?"}
    res = await async_client.post("/api/v1/ai/chat", json=payload, headers=public_headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_public_user_forbidden_from_analytics(async_client, public_headers):
    """Verify PUBLIC role is rejected with 403 from pharmaceutical analytics."""
    res = await async_client.get("/api/v1/analytics/overview", headers=public_headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_doctor_forbidden_from_admin(async_client, doctor_headers):
    """Verify DOCTOR role cannot access administrator panel."""
    res = await async_client.get("/api/v1/admin/audit-logs", headers=doctor_headers)
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_unauthenticated_request_rejected(async_client):
    """Verify request with no auth header returns 401 Unauthorized."""
    res = await async_client.get("/api/v1/auth/me")
    assert res.status_code == 401


@pytest.mark.asyncio
async def test_admin_has_full_governance_access(async_client, admin_headers):
    """Verify ADMIN role has full access to governance dashboard and audit logs."""
    res = await async_client.get("/api/v1/admin/dashboard", headers=admin_headers)
    assert res.status_code == 200
    data = res.json()
    assert "totalUsers" in data
    assert "pendingVerifications" in data
