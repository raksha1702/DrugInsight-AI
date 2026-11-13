"""Integration tests for medicine search, categories, and monographs."""

import pytest


@pytest.mark.asyncio
async def test_search_medicines(async_client):
    """Verify medicine search by query returns matching monographs."""
    res = await async_client.get("/api/v1/medicines?q=metformin")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Metformin"
    assert "Glucophage" in data[0]["brandNames"]


@pytest.mark.asyncio
async def test_get_medicine_monograph_details(async_client):
    """Verify full 5-tab monograph retrieval with structured DailyMed warnings."""
    res = await async_client.get("/api/v1/medicines/metformin")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "metformin"
    assert "mechanismOfAction" in data
    assert "dosageForms" in data
    assert "sideEffects" in data
    assert "warnings" in data
    assert data["warnings"]["boxedWarning"] is not None
    assert "LACTIC ACIDOSIS" in data["warnings"]["boxedWarning"]


@pytest.mark.asyncio
async def test_get_categories(async_client):
    """Verify distinct categories listing."""
    res = await async_client.get("/api/v1/medicines/categories")
    assert res.status_code == 200
    cats = res.json()
    assert "Antidiabetic" in cats
    assert any("Antihypertensive" in c for c in cats)


@pytest.mark.asyncio
async def test_get_suggestions(async_client):
    """Verify autocomplete suggestions."""
    res = await async_client.get("/api/v1/medicines/suggestions?q=ator")
    assert res.status_code == 200
    sugg = res.json()
    assert len(sugg) >= 1
    assert any("Atorvastatin" in s["name"] for s in sugg)
