from fastapi import FastAPI, APIRouter, HTTPException, Request, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import SEED_VERSION, SERVICES, INDUSTRIES, CASE_STUDIES, POSTS, FAQS, TESTIMONIALS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="AADRIQUE API")
api_router = APIRouter(prefix="/api")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_rate: dict = {}

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ["OWNER_EMAIL"]


async def send_email(to: str, subject: str, html: str, reply_to: str = None):
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        logging.info("Email sent to %s (%s)", to, subject)
        return True
    except Exception as e:
        logging.error("Email send failed to %s: %s", to, e)
        return False


def _esc(v: str) -> str:
    return (v or "—").replace("<", "&lt;").replace(">", "&gt;")


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


class ContactEnquiry(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    company: str = Field(default="", max_length=160)
    role: str = Field(default="", max_length=120)
    email: str
    phone: str = Field(default="", max_length=40)
    service_interest: str = Field(default="", max_length=120)
    budget_range: str = Field(default="", max_length=60)
    message: str = Field(min_length=10, max_length=5000)
    website: str = Field(default="")  # honeypot


@api_router.get("/")
async def root():
    return {"message": "AADRIQUE API", "status": "ok"}


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
async def list_case_studies(sector: Optional[str] = None):
    q = {"sector": sector} if sector else {}
    return await db.case_studies.find(q, {"_id": 0}).sort("order", 1).to_list(50)


@api_router.get("/case-studies/{slug}")
async def get_case_study(slug: str):
    doc = await db.case_studies.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Case study not found")
    return doc


@api_router.get("/posts")
async def list_posts(category: Optional[str] = None):
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
    if enquiry.website.strip():
        return {"ok": True}  # honeypot: silently accept
    if not EMAIL_RE.match(enquiry.email):
        raise HTTPException(422, "Please provide a valid email address")
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    hits = [t for t in _rate.get(ip, []) if now - t < 60]
    if len(hits) >= 5:
        raise HTTPException(429, "Too many requests. Please try again in a minute.")
    hits.append(now)
    _rate[ip] = hits
    doc = enquiry.model_dump(exclude={"website"})
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.enquiries.insert_one(doc)
    background.add_task(
        send_email,
        OWNER_EMAIL,
        f"New enquiry from {doc['name']}" + (f" — {doc['company']}" if doc.get("company") else ""),
        owner_notification_html(doc),
        doc["email"],
    )
    background.add_task(
        send_email,
        doc["email"],
        "We've received your enquiry — AADRIQUE",
        auto_reply_html(doc),
        OWNER_EMAIL,
    )
    return {"ok": True, "id": doc["id"]}


@api_router.get("/enquiries")
async def list_enquiries():
    return await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


async def seed_database():
    meta = await db.meta.find_one({"key": "seed_version"})
    if meta and meta.get("value") == SEED_VERSION:
        return
    for name in ["services", "industries", "case_studies", "posts", "faqs", "testimonials"]:
        await db[name].delete_many({})
    await db.services.insert_many([{**s, "order": i} for i, s in enumerate(SERVICES)])
    await db.industries.insert_many([{**s, "order": i} for i, s in enumerate(INDUSTRIES)])
    await db.case_studies.insert_many([{**s, "order": i} for i, s in enumerate(CASE_STUDIES)])
    await db.posts.insert_many(POSTS)
    await db.faqs.insert_many([{**s, "order": i} for i, s in enumerate(FAQS)])
    await db.testimonials.insert_many([dict(t) for t in TESTIMONIALS])
    await db.meta.update_one({"key": "seed_version"}, {"$set": {"value": SEED_VERSION}}, upsert=True)
    logging.info("Seeded database, version %s", SEED_VERSION)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    await seed_database()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
