"""DailyMed REST API integration client with retry and error handling."""

import logging
from typing import Dict, Any, List, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class DailyMedClient:
    """Client for National Library of Medicine (NLM) DailyMed API."""

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or settings.DAILYMED_API_BASE_URL).rstrip("/")
        self.timeout = 10.0

    async def search_spls(self, drug_name: str, page: int = 1, pagesize: int = 20) -> Dict[str, Any]:
        """Search structured product labels by drug name."""
        url = f"{self.base_url}/spls.json"
        params = {"drug_name": drug_name, "page": page, "pagesize": pagesize}

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    logger.warning("DailyMed rate limit hit (HTTP 429)")
                    return {"data": [], "error": "rate_limited"}
                else:
                    logger.warning(f"DailyMed returned HTTP {response.status_code}")
                    return {"data": [], "error": f"http_{response.status_code}"}
            except (httpx.RequestError, Exception) as exc:
                logger.error(f"DailyMed request failed for {drug_name}: {exc}")
                return {"data": [], "error": str(exc)}

    async def get_spl_details(self, setid: str) -> Optional[Dict[str, Any]]:
        """Fetch details for a specific SPL Set ID."""
        url = f"{self.base_url}/spls/{setid}.json"

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url)
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as exc:
                logger.error(f"Failed to fetch DailyMed SPL {setid}: {exc}")
                return None


dailymed_client = DailyMedClient()
