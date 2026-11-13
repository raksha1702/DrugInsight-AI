"""CLI utility script to bootstrap an administrator account."""

import os
import sys
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import init_db, async_session_maker
from app.models.user import User, UserRole
from app.security.passwords import hash_password
from app.repositories.user_repo import user_repo


async def create_admin(email: str = "admin@druginsight.ai", password: str = "Admin@123456", name: str = "System Administrator"):
    await init_db()
    async with async_session_maker() as session:
        existing = await user_repo.get_by_email(session, email)
        if existing:
            print(f"User with email '{email}' already exists. Updating role to ADMIN...")
            existing.role = UserRole.ADMIN
            existing.password_hash = hash_password(password)
            existing.is_active = True
            await session.commit()
            print(f"Updated administrator account: {email}")
            return

        new_admin = User(
            full_name=name,
            email=email.lower().strip(),
            password_hash=hash_password(password),
            role=UserRole.ADMIN,
            institution="DrugInsight Governance Board",
            department="Platform Administration",
            is_active=True,
        )
        await user_repo.create(session, new_admin)
        await session.commit()
        print(f"Successfully bootstrapped new administrator: {email}")


if __name__ == "__main__":
    email_arg = sys.argv[1] if len(sys.argv) > 1 else "admin@druginsight.ai"
    pass_arg = sys.argv[2] if len(sys.argv) > 2 else "Admin@123456"
    asyncio.run(create_admin(email=email_arg, password=pass_arg))
