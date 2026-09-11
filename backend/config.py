"""Environment configuration with fail-fast validation.

Importing this module never raises. Call `settings.validate()` at startup so a
misconfigured deployment dies with one readable message instead of a KeyError
traceback from inside an ASGI worker.
"""

from __future__ import annotations

import os
import secrets
from dataclasses import dataclass, field
from pathlib import Path
from typing import List

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


def _env(key: str, default: str = "") -> str:
    return (os.environ.get(key) or default).strip()


def _env_list(key: str, default: str = "") -> List[str]:
    return [v.strip() for v in _env(key, default).split(",") if v.strip()]


def _normalize_origin(value: str) -> str:
    """Normalize a configured CORS origin to what a browser actually sends.

    Browsers send `Origin: https://example.com` — scheme + host + optional port,
    never a trailing slash or path. Configuring "https://example.com/" therefore
    silently matches nothing, and every request fails CORS with no obvious cause.
    Strip the common mistakes rather than let a stray character take the site down.
    """
    v = value.strip().strip('"').strip("'")
    if not v or v == "*":
        return v
    # Drop any path/query and the trailing slash: https://a.com/foo/ -> https://a.com
    if "//" in v:
        scheme, _, rest = v.partition("//")
        host = rest.split("/", 1)[0]
        return f"{scheme}//{host}"
    return v.rstrip("/")


def _env_bool(key: str, default: bool = False) -> bool:
    raw = _env(key).lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


class ConfigError(RuntimeError):
    """Raised when required configuration is missing or unsafe."""


@dataclass
class Settings:
    environment: str = field(default_factory=lambda: _env("ENVIRONMENT", "development").lower())

    # --- Database ---
    mongo_url: str = field(default_factory=lambda: _env("MONGO_URL"))
    db_name: str = field(default_factory=lambda: _env("DB_NAME", "aadrique"))

    # --- CORS ---
    cors_origins: List[str] = field(
        default_factory=lambda: [_normalize_origin(o) for o in _env_list("CORS_ORIGINS")]
    )

    # --- Email (optional: the site still works without it) — sent via Resend ---
    resend_api_key: str = field(default_factory=lambda: _env("RESEND_API_KEY"))
    email_from_address: str = field(default_factory=lambda: _env("EMAIL_FROM_ADDRESS"))
    email_from_name: str = field(default_factory=lambda: _env("EMAIL_FROM_NAME", "AADRIQUE"))
    owner_email: str = field(default_factory=lambda: _env("OWNER_EMAIL"))

    # --- Admin API ---
    admin_token: str = field(default_factory=lambda: _env("ADMIN_TOKEN"))

    # --- Networking / limits ---
    trust_proxy: bool = field(default_factory=lambda: _env_bool("TRUST_PROXY", False))
    contact_rate_limit: int = field(default_factory=lambda: int(_env("CONTACT_RATE_LIMIT", "5") or 5))
    contact_rate_window: int = field(default_factory=lambda: int(_env("CONTACT_RATE_WINDOW", "60") or 60))

    # --- Behaviour ---
    seed_on_startup: bool = field(default_factory=lambda: _env_bool("SEED_ON_STARTUP", True))

    @property
    def is_production(self) -> bool:
        return self.environment in ("production", "prod")

    @property
    def email_enabled(self) -> bool:
        return bool(self.resend_api_key and self.owner_email and self.email_from_address)

    @property
    def docs_url(self):
        # Interactive docs are a fingerprinting surface; keep them off in production.
        return None if self.is_production else "/docs"

    def validate(self) -> List[str]:
        """Raise on fatal misconfiguration; return a list of non-fatal warnings."""
        fatal: List[str] = []
        warnings: List[str] = []

        if not self.mongo_url:
            fatal.append("MONGO_URL is required (e.g. mongodb://localhost:27017).")
        if not self.db_name:
            fatal.append("DB_NAME is required.")

        if self.is_production:
            if not self.cors_origins:
                fatal.append(
                    "CORS_ORIGINS is required in production "
                    "(e.g. https://www.aadrique.in,https://aadrique.in)."
                )
            if "*" in self.cors_origins:
                fatal.append("CORS_ORIGINS cannot be '*' in production — list exact origins.")
            if not self.admin_token:
                fatal.append(
                    "ADMIN_TOKEN is required in production — it guards the enquiry inbox "
                    "which holds customer personal data."
                )
            elif len(self.admin_token) < 24:
                fatal.append("ADMIN_TOKEN must be at least 24 characters.")
            if not self.email_enabled:
                warnings.append(
                    "Email is disabled (RESEND_API_KEY / OWNER_EMAIL / EMAIL_FROM_ADDRESS unset) — "
                    "enquiries will be stored but no notifications will be sent."
                )
        else:
            if not self.cors_origins:
                warnings.append("CORS_ORIGINS unset — defaulting to localhost dev origins.")
            if not self.admin_token:
                warnings.append(
                    "ADMIN_TOKEN unset — /api/enquiries is disabled. Set one to read the inbox."
                )
            if not self.email_enabled:
                warnings.append("Email is disabled — enquiries are stored only.")

        if fatal:
            raise ConfigError(
                "Invalid configuration:\n"
                + "\n".join(f"  - {m}" for m in fatal)
                + "\n\nSee backend/.env.example for the full list of variables."
            )
        return warnings

    def resolved_cors_origins(self) -> List[str]:
        if self.cors_origins:
            return self.cors_origins
        return [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:8080",
        ]

    def check_admin_token(self, presented: str) -> bool:
        if not self.admin_token or not presented:
            return False
        return secrets.compare_digest(presented, self.admin_token)


settings = Settings()
