"""Integration tests for clinical research report generation."""

import pytest


@pytest.mark.asyncio
async def test_create_and_download_report(async_client, doctor_headers):
    """Verify creating a clinical report generates a ReportLab PDF and enables download."""
    create_payload = {
        "title": "Metformin vs Atorvastatin Comparative Safety Profile",
        "type": "Comparative Analysis",
        "medicines": ["Metformin", "Atorvastatin"],
        "author": "Dr. Sarah Lin, MD",
    }
    create_res = await async_client.post("/api/v1/reports", json=create_payload, headers=doctor_headers)
    assert create_res.status_code == 201
    rep_data = create_res.json()
    assert rep_data["title"] == "Metformin vs Atorvastatin Comparative Safety Profile"
    rep_id = rep_data["id"]

    # Verify download returns PDF stream
    download_res = await async_client.get(f"/api/v1/reports/{rep_id}/download", headers=doctor_headers)
    assert download_res.status_code == 200
    assert download_res.headers["content-type"] == "application/pdf"
    assert download_res.content.startswith(b"%PDF")
