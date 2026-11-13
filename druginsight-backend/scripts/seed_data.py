"""CLI script to initialize database tables and seed baseline medicines and demonstration accounts."""

import os
import sys
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import init_db, async_session_maker
from app.main import bootstrap_default_users
from app.services.medicine_service import medicine_service


async def seed_all():
    print("Initializing database tables...")
    await init_db()
    print("Seeding demonstrator accounts and medicine catalog...")
    await bootstrap_default_users()
    print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_all())
