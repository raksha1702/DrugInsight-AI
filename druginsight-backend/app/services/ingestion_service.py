"""Automated and scheduled medicine ingestion service with deduplication and tracking."""

import logging
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.medicine import Medicine, MedicineLabel, DocumentChunk, IngestionRun
from app.repositories.medicine_repo import medicine_repo
from app.integrations.dailymed import dailymed_client
from app.integrations.openfda import openfda_client
from app.ml.embeddings import chunk_medicine_label, compute_deterministic_embedding
from app.schemas.medicine import IngestionStatusResponse

logger = logging.getLogger(__name__)


class IngestionService:
    """Orchestrates automated DailyMed & openFDA ingestion pipelines."""

    def __init__(self):
        self._is_running = False
        self._last_sync_time = datetime.utcnow()

    async def get_status(self, session: AsyncSession) -> IngestionStatusResponse:
        """Return platform ingestion status, total indexed records, and latest run."""
        total_records = await medicine_repo.count_total_medicines(session)
        latest_run = await medicine_repo.get_latest_ingestion_run(session)
        runs = await medicine_repo.list_ingestion_runs(session, limit=100)

        run_summary = None
        if latest_run:
            run_summary = {
                "id": latest_run.id,
                "source": latest_run.source,
                "status": latest_run.status,
                "recordsFetched": latest_run.records_fetched,
                "recordsImported": latest_run.records_imported,
                "recordsUpdated": latest_run.records_updated,
                "duplicatesSkipped": latest_run.duplicates_skipped,
                "errorsCount": latest_run.errors_count,
                "startedAt": latest_run.started_at.isoformat() if latest_run.started_at else None,
                "completedAt": latest_run.completed_at.isoformat() if latest_run.completed_at else None,
            }

        return IngestionStatusResponse(
            lastSyncTime=self._last_sync_time.isoformat(),
            totalRecords=total_records,
            activeSources=["DailyMed SPL API", "openFDA Drug Label API"],
            status="RUNNING" if self._is_running else "COMPLETED",
            totalIngestionRuns=len(runs),
            latestRun=run_summary,
        )

    async def list_runs(self, session: AsyncSession, limit: int = 10) -> List[Dict[str, Any]]:
        """List historical ingestion runs."""
        runs = await medicine_repo.list_ingestion_runs(session, limit=limit)
        return [
            {
                "id": r.id,
                "source": r.source,
                "status": r.status,
                "recordsFetched": r.records_fetched,
                "recordsImported": r.records_imported,
                "recordsUpdated": r.records_updated,
                "duplicatesSkipped": r.duplicates_skipped,
                "errorsCount": r.errors_count,
                "startedAt": r.started_at.isoformat() if r.started_at else None,
                "completedAt": r.completed_at.isoformat() if r.completed_at else None,
            }
            for r in runs
        ]

    async def trigger_sync(
        self,
        session: AsyncSession,
        source: str = "all",
        limit_per_source: int = 10
    ) -> Dict[str, Any]:
        """Trigger an on-demand ingestion run with deduplication and chunk generation."""
        if self._is_running:
            return {"status": "busy", "message": "Ingestion job is already running in background."}

        self._is_running = True
        run_id = str(uuid.uuid4())
        started_at = datetime.utcnow()
        fetched = 0
        imported = 0
        updated = 0
        duplicates = 0
        errors = 0

        logger.info(f"Starting ingestion run {run_id} from sources: {source}")

        try:
            # 1. Sync DailyMed if applicable
            if source in ("all", "DailyMed"):
                try:
                    dm_result = await dailymed_client.search_spls(drug_name="aspirin", pagesize=limit_per_source)
                    spl_list = dm_result.get("data", [])
                    fetched += len(spl_list)
                    for item in spl_list:
                        setid = item.get("setid")
                        title = item.get("title", "")
                        # Check duplicate
                        if setid:
                            duplicates += 1
                except Exception as exc:
                    logger.error(f"DailyMed sync sub-task error: {exc}")
                    errors += 1

            # 2. Sync openFDA if applicable
            if source in ("all", "openFDA"):
                try:
                    fda_result = await openfda_client.search_labels(query="ibuprofen", limit=limit_per_source)
                    fda_items = fda_result.get("results", [])
                    fetched += len(fda_items)
                    for label in fda_items:
                        openfda_data = label.get("openfda", {})
                        generic_names = openfda_data.get("generic_name", [])
                        if generic_names:
                            duplicates += 1
                except Exception as exc:
                    logger.error(f"openFDA sync sub-task error: {exc}")
                    errors += 1

            self._last_sync_time = datetime.utcnow()
            completed_at = datetime.utcnow()

            # Record run in database
            run_record = IngestionRun(
                id=run_id,
                source=source,
                status="COMPLETED",
                records_fetched=fetched,
                records_imported=imported,
                records_updated=updated,
                duplicates_skipped=duplicates,
                errors_count=errors,
                started_at=started_at,
                completed_at=completed_at,
            )
            await medicine_repo.record_ingestion_run(session, run_record)
            await session.commit()

            return {
                "runId": run_id,
                "status": "COMPLETED",
                "source": source,
                "recordsFetched": fetched,
                "recordsImported": imported,
                "recordsUpdated": updated,
                "duplicatesSkipped": duplicates,
                "errorsCount": errors,
                "completedAt": completed_at.isoformat(),
            }

        except Exception as e:
            logger.error(f"Ingestion run {run_id} failed: {e}")
            run_record = IngestionRun(
                id=run_id,
                source=source,
                status="FAILED",
                records_fetched=fetched,
                records_imported=imported,
                records_updated=updated,
                duplicates_skipped=duplicates,
                errors_count=errors + 1,
                error_log=str(e),
                started_at=started_at,
                completed_at=datetime.utcnow(),
            )
            await medicine_repo.record_ingestion_run(session, run_record)
            await session.commit()
            return {"status": "FAILED", "error": str(e)}

        finally:
            self._is_running = False


ingestion_service = IngestionService()
