# DrugInsight AI — Security & Compliance Architecture

## 1. Authentication & Password Security

- **Argon2id Hashing**: Password hashing uses Argon2id (via `argon2-cffi`), the winner of the Password Hashing Competition. It offers resistance to GPU and side-channel attacks.
- **Constant-Time Verification**: Login comparisons run in constant time to prevent username and timing enumeration.
- **JWT Access Tokens**: Stateless HMAC-SHA256 tokens containing user UUID, role, and verification status claims with a 60-minute expiration.
- **Hashed Refresh Tokens**: Refresh tokens are 64-character high-entropy random strings generated with `secrets.token_urlsafe(64)` and stored in the database hashed via SHA-256 to prevent leakage in case of database exposure.

---

## 2. Role-Based Access Control (RBAC)

Access control is implemented via reusable FastAPI dependencies in `app/dependencies.py`:

```python
require_authenticated_user = get_current_user
require_doctor = require_roles(UserRole.DOCTOR, UserRole.ADMIN)
require_researcher = require_roles(UserRole.RESEARCHER, UserRole.ADMIN)
require_verified_professional = require_roles(UserRole.DOCTOR, UserRole.RESEARCHER, UserRole.ADMIN)
require_admin = require_roles(UserRole.ADMIN)
```

Role enforcement cannot be bypassed by client-side manipulation.

---

## 3. Immutable Security Audit Trail

All critical security and administrative actions are logged to the `audit_logs` table:
- `REGISTRATION`
- `LOGIN_SUCCESS`
- `LOGIN_FAILURE`
- `VERIFICATION_SUBMITTED`
- `VERIFICATION_APPROVED`
- `VERIFICATION_REJECTED`
- `VERIFICATION_REVOKED`
- `USER_SUSPENDED`
- `AI_SAFETY_REFUSAL`

Each audit entry records the timestamp, actor ID, actor display name, action name, resource affected, result (`Success`, `Warning`, `Failed`), IP address, and descriptive details.
