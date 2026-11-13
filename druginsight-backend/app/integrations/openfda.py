"""openFDA Drug Product Label API client."""

import logging
from typing import Dict, Any, List, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)


class OpenFDAClient:
    """Client for openFDA Drug Label endpoints."""

    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = (base_url or settings.OPENFDA_API_BASE_URL).rstrip("/")
        self.api_key = api_key or settings.OPENFDA_API_KEY
        self.timeout = 10.0

    async def search_labels(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Query FDA drug labels with field search."""
        url = f"{self.base_url}/label.json"
        params: Dict[str, Any] = {
            "search": f'openfda.generic_name:"{query}" OR openfda.brand_name:"{query}"',
            "limit": limit
        }
        if self.api_key:
            params["api_key"] = self.api_key

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    return {"results": []}
                elif response.status_code == 429:
                    logger.warning("openFDA rate limit exceeded")
                    return {"results": [], "error": "rate_limited"}
                else:
                    return {"results": [], "error": f"http_{response.status_code}"}
            except Exception as exc:
                logger.error(f"openFDA API request failed: {exc}")
                return {"results": [], "error": str(exc)}


openfda_client = OpenFDAClient()
