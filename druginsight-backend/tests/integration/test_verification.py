"""Integration tests for professional verification submission and administrative review."""

import pytest


@pytest.mark.asyncio
async def test_submit_verification_request(async_client, public_headers):
    """Verify authenticated user can submit medical credentials for verification."""
    payload = {
        "requestedRole": "doctor",
        "institution": "Johns Hopkins Hospital",
        "department": "Endocrinology",
        "registrationNumber": "MD-JH-99201",
        "licensingAuthority": "Maryland Board of Physicians",
        "countryJurisdiction": "United States",
        "professionalEmail": "endocrinologist@jhmi.edu",
        "proofDocumentName": "physician_license_maryland.pdf",
    }
    res = await async_client.post("/api/v1/verification/submit", json=payload, headers=public_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "pending"
    assert data["requestedRole"] == "doctor"
    assert data["institution"] == "Johns Hopkins Hospital"


@pytest.mark.asyncio
async def test_admin_list_and_approve_verification(async_client, admin_headers):
    """Verify administrator can review and approve credentials, elevating applicant role."""
    # 1. Register dedicated applicant
    await async_client.post("/api/v1/auth/register", json={
        "name": "Applicant Fellow",
        "email": "fellow.applicant@harvard.edu",
        "password": "Password@123",
        "role": "public",
    })
    token_res = await async_client.post("/api/v1/auth/login", json={
        "email": "fellow.applicant@harvard.edu",
        "password": "Password@123",
    })
    applicant_headers = {"Authorization": f"Bearer {token_res.json()['access_token']}"}

    # 2. Submit request as applicant
    submit_payload = {
        "requestedRole": "researcher",
        "institution": "Harvard Medical School",
        "department": "Pharmacology",
        "registrationNumber": "HMS-RES-7711",
        "licensingAuthority": "Massachusetts Department of Public Health",
        "countryJurisdiction": "United States",
        "professionalEmail": "researcher@hms.harvard.edu",
        "proofDocumentName": "postdoc_fellowship_credential.pdf",
    }
    sub_res = await async_client.post("/api/v1/verification/submit", json=submit_payload, headers=applicant_headers)
    assert sub_res.status_code == 201
    req_id = sub_res.json()["id"]

    # 2. Admin inspects verifications
    list_res = await async_client.get("/api/v1/admin/verifications", headers=admin_headers)
    assert list_res.status_code == 200
    assert any(r["id"] == req_id for r in list_res.json())

    # 3. Admin approves verification
    approve_res = await async_client.post(
        f"/api/v1/admin/verifications/{req_id}/approve",
        json={"adminNotes": "Credentials verified against Massachusetts state medical board registry."},
        headers=admin_headers,
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["status"] == "approved"
