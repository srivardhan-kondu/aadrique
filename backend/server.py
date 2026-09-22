from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional
import logging
import re
import time
import uuid

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, field_validator
from pymongo.errors import DuplicateKeyError
from starlette.middleware.cors import CORSMiddleware

from config import settings
from seed_data import SEED_VERSION, SERVICES, INDUSTRIES, CASE_STUDIES, PRODUCTS, POSTS, FAQS, TESTIMONIALS

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("aadrique")

for _warning in settings.validate():
    logger.warning(_warning)

client = AsyncIOMotorClient(settings.mongo_url, serverSelectionTimeoutMS=5000, tz_aware=True)
db = client[settings.db_name]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# --------------------------------------------------------------------------------------
# Email
# --------------------------------------------------------------------------------------

async def send_email(to: str, subject: str, html: str, reply_to: Optional[str] = None) -> bool:
    if not settings.email_enabled:
        logger.warning("Email disabled — skipping '%s' to %s", subject, to)
        return False
    payload = {
        "from": f"{settings.email_from_name} <{settings.email_from_address}>",
        "to": [to],
        "subject": subject,
        "html": html,
    }
    if reply_to:
        payload["reply_to"] = [reply_to]
    try:
        async with httpx.AsyncClient(timeout=30) as http:
            resp = await http.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
                json=payload,
            )
        if resp.status_code >= 400:
            # Resend explains the refusal in the body (unverified domain, bad
            # from-address, revoked key). raise_for_status() discards it, which
            # makes a misconfigured deploy look like a silent no-op.
            logger.error(
                "Email send failed to %s (%s): Resend returned %s — %s",
                to, subject, resp.status_code, resp.text[:500],
            )
            return False
        logger.info("Email sent to %s (%s)", to, subject)
        return True
    except Exception as e:  # noqa: BLE001 — email must never break the request
        logger.error("Email send failed to %s: %s", to, e)
        return False


def _esc(v: Optional[str]) -> str:
    """Escape untrusted form input before it goes into an HTML email body."""
    if not v:
        return "—"
    return (
        v.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
    )


def owner_notification_html(d: dict) -> str:
    rows = "".join(
        f'<tr><td style="padding:10px 16px;border-bottom:1px solid #eee;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:150px;">{label}</td>'
        f'<td style="padding:10px 16px;border-bottom:1px solid #eee;color:#0a0a0a;font-size:14px;">{_esc(d.get(key))}</td></tr>'
        for label, key in [
            ("Name", "name"), ("Company", "company"), ("Role", "role"), ("Email", "email"),
            ("Phone", "phone"), ("Service interest", "service_interest"), ("Budget range", "budget_range"),
        ]
    )
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f0de;padding:32px 0;font-family:Arial,sans-serif;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e0d0;">
          <tr><td style="background:#060606;padding:24px 32px;">
            <span style="color:#ffffff;font-size:18px;letter-spacing:6px;font-weight:bold;">AADRIQUE</span><br/>
            <span style="color:#fa942c;font-size:10px;letter-spacing:3px;">NEW WEBSITE ENQUIRY</span>
          </td></tr>
          <tr><td style="padding:24px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">{rows}</table>
            <div style="margin:20px 16px 8px;padding:16px;background:#faf7ee;border-left:3px solid #fa942c;color:#0a0a0a;font-size:14px;line-height:1.6;">
              {_esc(d.get("message"))}
            </div>
          </td></tr>
          <tr><td style="padding:16px 32px;border-top:1px solid #eee;color:#999;font-size:12px;">
            Reply directly to this email to respond to {_esc(d.get("name"))}.
          </td></tr>
        </table>
      </td></tr>
    </table>"""


def auto_reply_html(d: dict) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f0de;padding:32px 0;font-family:Arial,sans-serif;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e0d0;">
          <tr><td style="background:#060606;padding:24px 32px;">
            <span style="color:#ffffff;font-size:18px;letter-spacing:6px;font-weight:bold;">AADRIQUE</span><br/>
            <span style="color:#fa942c;font-size:10px;letter-spacing:3px;">BUILD. TRANSFORM. SCALE.</span>
          </td></tr>
          <tr><td style="padding:32px;color:#0a0a0a;font-size:15px;line-height:1.7;">
            <p style="margin:0 0 16px;">Hello {_esc(d.get("name"))},</p>
            <p style="margin:0 0 16px;">Thank you for reaching out to AADRIQUE. We've received your enquiry and a member of our team will reply within <strong>one business day</strong>.</p>
            <div style="margin:0 0 16px;padding:16px;background:#faf7ee;border-left:3px solid #fa942c;color:#555;font-size:13px;line-height:1.6;">
              <strong style="color:#0a0a0a;">Your message:</strong><br/>{_esc(d.get("message"))}
            </div>
            <p style="margin:0 0 16px;">If it's urgent, call us directly at <a href="tel:+919652886208" style="color:#fa942c;text-decoration:none;">+91 96528 86208</a> or reply to this email.</p>
            <p style="margin:0;">— The AADRIQUE team</p>
          </td></tr>
          <tr><td style="padding:16px 32px;border-top:1px solid #eee;color:#999;font-size:12px;">
            AADRIQUE TECH PVT LTD · info@aadrique.in · www.aadrique.in
          </td></tr>
        </table>
      </td></tr>
    </table>"""


# --------------------------------------------------------------------------------------
# Models
# --------------------------------------------------------------------------------------

class ContactEnquiry(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    company: str = Field(default="", max_length=160)
    role: str = Field(default="", max_length=120)
    email: str = Field(max_length=254)
    phone: str = Field(default="", max_length=40)
    service_interest: str = Field(default="", max_length=120)
    budget_range: str = Field(default="", max_length=60)
    message: str = Field(min_length=10, max_length=5000)
    website: str = Field(default="", max_length=200)  # honeypot

    @field_validator("*", mode="before")
    @classmethod
    def _strip(cls, v):
        return v.strip() if isinstance(v, str) else v

    @field_validator("email")
    @classmethod
    def _valid_email(cls, v: str) -> str:
        if not EMAIL_RE.match(v):
            raise ValueError("Please provide a valid email address")
        return v.lower()


# --------------------------------------------------------------------------------------
# Rate limiting
# --------------------------------------------------------------------------------------

_rate: dict = {}
_rate_last_prune = 0.0
_RATE_MAX_KEYS = 10_000


def client_ip(request: Request) -> str:
    """Resolve the caller's IP, honouring X-Forwarded-For only behind a trusted proxy.

    Without TRUST_PROXY the header is ignored — otherwise any client could spoof it
    and walk straight past the rate limiter.
    """
    if settings.trust_proxy:
        fwd = request.headers.get("x-forwarded-for", "")
        if fwd:
            return fwd.split(",")[0].strip()
        real = request.headers.get("x-real-ip", "")
        if real:
            return real.strip()
    return request.client.host if request.client else "unknown"


def rate_limit_exceeded(ip: str) -> bool:
    """Sliding-window limiter with bounded memory (single-process; see DEPLOYMENT.md)."""
    global _rate_last_prune
    now = time.time()
    window = settings.contact_rate_window

    if now - _rate_last_prune > window or len(_rate) > _RATE_MAX_KEYS:
        for key, stamps in list(_rate.items()):
            fresh = [t for t in stamps if now - t < window]
            if fresh:
                _rate[key] = fresh
            else:
                del _rate[key]
        _rate_last_prune = now

    hits = [t for t in _rate.get(ip, []) if now - t < window]
    if len(hits) >= settings.contact_rate_limit:
        _rate[ip] = hits
        return True
    hits.append(now)
    _rate[ip] = hits
    return False


# --------------------------------------------------------------------------------------
# Auth
# --------------------------------------------------------------------------------------

async def require_admin(
    authorization: Optional[str] = Header(default=None),
    x_admin_token: Optional[str] = Header(default=None),
) -> None:
    """Guard for endpoints exposing stored personal data.

    Accepts `Authorization: Bearer <token>` or `X-Admin-Token: <token>`.
    """
    if not settings.admin_token:
        raise HTTPException(503, "Admin API is not configured on this deployment.")
    presented = ""
    if authorization and authorization.lower().startswith("bearer "):
        presented = authorization[7:].strip()
    elif x_admin_token:
        presented = x_admin_token.strip()
    if not settings.check_admin_token(presented):
        raise HTTPException(401, "Unauthorized")


# --------------------------------------------------------------------------------------
# Routes
# --------------------------------------------------------------------------------------

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "AADRIQUE API", "status": "ok", "version": SEED_VERSION}


@api_router.get("/health")
async def health():
    """Liveness + database readiness. Used by containers, load balancers and uptime checks."""
    try:
        await client.admin.command("ping")
        database = "ok"
    except Exception as e:  # noqa: BLE001
        logger.error("Health check DB ping failed: %s", e)
        database = "unavailable"
    payload = {
        "status": "ok" if database == "ok" else "degraded",
        "database": database,
        "email": "enabled" if settings.email_enabled else "disabled",
        "environment": settings.environment,
        "time": datetime.now(timezone.utc).isoformat(),
    }
    return JSONResponse(payload, status_code=200 if database == "ok" else 503)


@api_router.get("/services")
async def list_services():
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/services/{slug}")
async def get_service(slug: str):
    doc = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Service not found")
    return doc


@api_router.get("/industries")
async def list_industries():
    return await db.industries.find({}, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/industries/{slug}")
async def get_industry(slug: str):
    doc = await db.industries.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Industry not found")
    return doc


@api_router.get("/case-studies")
async def list_case_studies(sector: Optional[str] = Query(default=None, max_length=80)):
    q = {"sector": sector} if sector else {}
    return await db.case_studies.find(q, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/case-studies/{slug}")
async def get_case_study(slug: str):
    doc = await db.case_studies.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Case study not found")
    return doc


@api_router.get("/products")
async def list_products():
    return await db.products.find({}, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


@api_router.get("/posts")
async def list_posts(category: Optional[str] = Query(default=None, max_length=80)):
    q = {"category": category} if category else {}
    return await db.posts.find(q, {"_id": 0}).sort("date", -1).to_list(100)


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    doc = await db.posts.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Post not found")
    return doc


@api_router.get("/faqs")
async def list_faqs():
    return await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/testimonials")
async def list_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).to_list(20)


@api_router.post("/contact")
async def submit_contact(enquiry: ContactEnquiry, request: Request, background: BackgroundTasks):
    if enquiry.website:
        logger.info("Honeypot triggered from %s", client_ip(request))
        return {"ok": True}  # silently accept so the bot does not retry

    if rate_limit_exceeded(client_ip(request)):
        raise HTTPException(429, "Too many requests. Please try again in a minute.")

    doc = enquiry.model_dump(exclude={"website"})
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(dict(doc))

    if settings.email_enabled:
        background.add_task(
            send_email,
            settings.owner_email,
            f"New enquiry from {doc['name']}" + (f" — {doc['company']}" if doc.get("company") else ""),
            owner_notification_html(doc),
            doc["email"],
        )
        background.add_task(
            send_email,
            doc["email"],
            "We've received your enquiry — AADRIQUE",
            auto_reply_html(doc),
            settings.owner_email,
        )

    return {"ok": True, "id": doc["id"]}


@api_router.get("/enquiries", dependencies=[Depends(require_admin)])
async def list_enquiries(
    limit: int = Query(default=50, ge=1, le=200),
    skip: int = Query(default=0, ge=0),
):
    """Stored enquiries — personal data, admin token required."""
    total = await db.enquiries.count_documents({})
    items = (
        await db.enquiries.find({}, {"_id": 0})
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )
    return {"total": total, "limit": limit, "skip": skip, "items": items}


# --------------------------------------------------------------------------------------
# Startup / seeding
# --------------------------------------------------------------------------------------

async def ensure_indexes():
    await db.meta.create_index("key", unique=True)
    for name in ("services", "industries", "case_studies", "products", "posts"):
        await db[name].create_index("slug", unique=True)
    await db.case_studies.create_index("sector")
    await db.posts.create_index([("date", -1)])
    await db.enquiries.create_index([("created_at", -1)])
    await db.enquiries.create_index("email")


async def seed_database():
    """Idempotent seed. The meta lock makes it safe to run with multiple workers."""
    meta = await db.meta.find_one({"key": "seed_version"})
    if meta and meta.get("value") == SEED_VERSION:
        return

    try:
        # Unique index on meta.key turns concurrent claims into a DuplicateKeyError
        # for every worker but the winner.
        await db.meta.update_one(
            {"key": "seed_lock", "version": {"$ne": SEED_VERSION}},
            {"$set": {"version": SEED_VERSION, "at": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
    except DuplicateKeyError:
        logger.info("Seed already claimed by another worker — skipping.")
        return

    for name in ("services", "industries", "case_studies", "products", "posts", "faqs", "testimonials"):
        await db[name].delete_many({})
    await db.services.insert_many([{**s, "order": i} for i, s in enumerate(SERVICES)])
    await db.industries.insert_many([{**s, "order": i} for i, s in enumerate(INDUSTRIES)])
    await db.case_studies.insert_many([{**s, "order": i} for i, s in enumerate(CASE_STUDIES)])
    await db.products.insert_many([{**s, "order": i} for i, s in enumerate(PRODUCTS)])
    await db.posts.insert_many([dict(p) for p in POSTS])
    await db.faqs.insert_many([{**s, "order": i} for i, s in enumerate(FAQS)])
    await db.testimonials.insert_many([dict(t) for t in TESTIMONIALS])
    await db.meta.update_one({"key": "seed_version"}, {"$set": {"value": SEED_VERSION}}, upsert=True)
    logger.info("Seeded database, version %s", SEED_VERSION)


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        await client.admin.command("ping")
        logger.info("Connected to MongoDB database '%s'", settings.db_name)
        await ensure_indexes()
        if settings.seed_on_startup:
            await seed_database()
    except Exception as e:  # noqa: BLE001 — never block boot; /api/health reports the truth
        logger.error("Startup database work failed: %s", e)
    yield
    client.close()


app = FastAPI(
    title="AADRIQUE API",
    version=SEED_VERSION,
    lifespan=lifespan,
    docs_url=settings.docs_url,
    redoc_url=None,
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.resolved_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Admin-Token"],
    max_age=600,
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
    if settings.is_production:
        response.headers.setdefault(
            "Strict-Transport-Security", "max-age=31536000; includeSubDomains"
        )
    # Stored enquiries must never sit in a shared cache.
    if request.url.path.startswith("/api/enquiries"):
        response.headers["Cache-Control"] = "no-store"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Log the detail, return an opaque message — stack traces are not a public API."""
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse({"detail": "Internal server error"}, status_code=500)
