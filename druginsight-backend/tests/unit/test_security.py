"""Unit tests for password hashing, tokens, and cryptographic security."""

import pytest
from datetime import timedelta
from app.security.passwords import hash_password, verify_password
from app.security.tokens import (
    create_access_token,
    decode_access_token,
    generate_refresh_token,
    hash_token,
)


def test_argon2id_password_hashing():
    """Verify Argon2id hashes passwords securely and validates correctly."""
    pw = "SecureClinicianPass123!"
    hashed = hash_password(pw)
    assert hashed.startswith("$argon2id$")
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_jwt_access_token_creation_and_decoding():
    """Verify JWT payload signing, claims, and verification."""
    data = {"sub": "user-12345", "role": "DOCTOR", "email": "dr.smith@clinic.org"}
    token = create_access_token(data, expires_delta=timedelta(minutes=15))
    decoded = decode_access_token(token)

    assert decoded is not None
    assert decoded["sub"] == "user-12345"
    assert decoded["role"] == "DOCTOR"
    assert decoded["email"] == "dr.smith@clinic.org"
    assert "exp" in decoded


def test_jwt_expired_token_handling():
    """Verify expired token fails validation."""
    data = {"sub": "user-123"}
    # Token that expired 5 minutes ago
    expired_token = create_access_token(data, expires_delta=timedelta(minutes=-5))
    decoded = decode_access_token(expired_token)
    assert decoded is None


def test_refresh_token_entropy_and_hashing():
    """Verify refresh token has high entropy and hashes deterministically with SHA-256."""
    rt1 = generate_refresh_token()
    rt2 = generate_refresh_token()
    assert rt1 != rt2
    assert len(rt1) >= 64

    hash1 = hash_token(rt1)
    assert len(hash1) == 64
    assert hash_token(rt1) == hash1
