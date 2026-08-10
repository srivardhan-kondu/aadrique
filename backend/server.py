from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import logging
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
async def submit_contact(enquiry: ContactEnquiry, request: Request):
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
