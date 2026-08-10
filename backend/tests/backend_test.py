"""Backend API tests for the AADRIQUE marketing site.

Run against a live server:

    # terminal 1
    cd backend && CONTACT_RATE_LIMIT=1000 ADMIN_TOKEN=test-token-long-enough-for-validation \\
        ../.venv/bin/uvicorn server:app --port 8000

    # terminal 2
    API_BASE_URL=http://127.0.0.1:8000 ADMIN_TOKEN=test-token-long-enough-for-validation \\
        .venv/bin/pytest backend/tests -n 2 --dist loadscope

CONTACT_RATE_LIMIT must be raised for the run, otherwise the contact tests trip the
5-per-minute limiter and fail on 429.
"""
import os

import pytest
import requests

BASE_URL = os.environ.get(
    "API_BASE_URL", os.environ.get("REACT_APP_BACKEND_URL", "http://127.0.0.1:8000")
).rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

admin_only = pytest.mark.skipif(not ADMIN_TOKEN, reason="ADMIN_TOKEN not set")


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


@pytest.fixture(scope="session")
def admin():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN})
    return sess


# ---------- Health ----------
class TestHealth:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_health_reports_database(self, s):
        r = s.get(f"{API}/health")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["status"] == "ok"
        assert body["database"] == "ok"

    def test_security_headers(self, s):
        h = s.get(f"{API}/").headers
        assert h.get("X-Content-Type-Options") == "nosniff"
        assert h.get("X-Frame-Options") == "DENY"
        assert "Referrer-Policy" in h


# ---------- Services ----------
class TestServices:
    def test_list(self, s):
        r = s.get(f"{API}/services")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 11
        for d in data:
            assert "slug" in d and "title" in d and "_id" not in d

    def test_detail(self, s):
        r = s.get(f"{API}/services/ai-consulting")
        assert r.status_code == 200
        d = r.json()
        for k in ["problem", "what_we_do", "process", "deliverables", "tech_stack", "faqs"]:
            assert k in d, f"missing {k}"

    def test_404(self, s):
        assert s.get(f"{API}/services/does-not-exist").status_code == 404


# ---------- Industries ----------
class TestIndustries:
    def test_list(self, s):
        r = s.get(f"{API}/industries")
        assert r.status_code == 200
        assert len(r.json()) == 6

    def test_detail(self, s):
        r = s.get(f"{API}/industries/healthcare")
        assert r.status_code == 200
        assert "slug" in r.json()

    def test_404(self, s):
        assert s.get(f"{API}/industries/does-not-exist").status_code == 404


# ---------- Case Studies ----------
class TestCaseStudies:
    def test_list(self, s):
        r = s.get(f"{API}/case-studies")
        assert r.status_code == 200
        assert len(r.json()) == 10

    def test_detail(self, s):
        r = s.get(f"{API}/case-studies/crowd-headcount-monitoring")
        assert r.status_code == 200
        d = r.json()
        for k in ["title", "teaser", "challenge", "approach", "solution"]:
            assert k in d, f"missing {k}"

    def test_industry_related_work_resolves(self, s):
        """Every industry's related_case_study must point at a case study that exists."""
        slugs = {c["slug"] for c in s.get(f"{API}/case-studies").json()}
        for ind in s.get(f"{API}/industries").json():
            related = ind.get("related_case_study")
            if related:
                assert related in slugs, f"{ind['slug']} links to missing case study {related}"

    def test_sector_filter(self, s):
        all_studies = s.get(f"{API}/case-studies").json()
        sector = all_studies[0]["sector"]
        filtered = s.get(f"{API}/case-studies", params={"sector": sector}).json()
        assert filtered and all(d["sector"] == sector for d in filtered)


# ---------- Posts ----------
class TestPosts:
    def test_list_sorted(self, s):
        r = s.get(f"{API}/posts")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 5
        dates = [d.get("date", "") for d in data]
        assert dates == sorted(dates, reverse=True)

    def test_detail(self, s):
        r = s.get(f"{API}/posts/before-you-buy-ai")
        assert r.status_code == 200
        d = r.json()
        assert "content" in d or "blocks" in d or "body" in d


# ---------- FAQs / testimonials ----------
class TestContent:
    def test_faqs(self, s):
        r = s.get(f"{API}/faqs")
        assert r.status_code == 200
        assert len(r.json()) == 3

    def test_testimonials(self, s):
        r = s.get(f"{API}/testimonials")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ---------- Contact ----------
class TestContact:
    def test_valid_submit(self, s):
        payload = {
            "name": "TEST_User",
            "email": "test_user@example.com",
            "message": "This is a valid message longer than 10 chars.",
            "website": "",
        }
        r = s.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("ok") is True
        assert "id" in body

    def test_honeypot_accepted_but_not_persisted(self, s):
        payload = {
            "name": "TEST_Bot",
            "email": "bot@example.com",
            "message": "Spam message that is long enough for schema.",
            "website": "http://spam.com",
        }
        r = s.post(f"{API}/contact", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body.get("ok") is True
        # No id means nothing was written.
        assert "id" not in body

    def test_invalid_email(self, s):
        r = s.post(
            f"{API}/contact",
            json={
                "name": "TEST_BadEmail",
                "email": "not-an-email",
                "message": "This message is long enough definitely.",
                "website": "",
            },
        )
        assert r.status_code == 422

    def test_short_message(self, s):
        r = s.post(
            f"{API}/contact",
            json={
                "name": "TEST_Short",
                "email": "shorty@example.com",
                "message": "short",
                "website": "",
            },
        )
        assert r.status_code == 422

    def test_oversized_message(self, s):
        r = s.post(
            f"{API}/contact",
            json={
                "name": "TEST_Long",
                "email": "long@example.com",
                "message": "x" * 5001,
                "website": "",
            },
        )
        assert r.status_code == 422


# ---------- Enquiries (personal data — must stay locked down) ----------
class TestEnquiriesAuth:
    def test_requires_auth(self, s):
        assert s.get(f"{API}/enquiries").status_code in (401, 503)

    def test_rejects_wrong_token(self, s):
        r = s.get(f"{API}/enquiries", headers={"X-Admin-Token": "wrong-token"})
        assert r.status_code in (401, 503)

    def test_rejects_wrong_bearer(self, s):
        r = s.get(f"{API}/enquiries", headers={"Authorization": "Bearer wrong-token"})
        assert r.status_code in (401, 503)

    @admin_only
    def test_accepts_valid_token(self, admin):
        r = admin.get(f"{API}/enquiries")
        assert r.status_code == 200, r.text
        body = r.json()
        assert {"total", "limit", "skip", "items"} <= set(body)

    @admin_only
    def test_accepts_bearer(self, s):
        r = s.get(f"{API}/enquiries", headers={"Authorization": f"Bearer {ADMIN_TOKEN}"})
        assert r.status_code == 200

    @admin_only
    def test_pagination_bounds(self, admin):
        assert admin.get(f"{API}/enquiries", params={"limit": 1}).status_code == 200
        assert admin.get(f"{API}/enquiries", params={"limit": 9999}).status_code == 422
        assert admin.get(f"{API}/enquiries", params={"skip": -1}).status_code == 422

    @admin_only
    def test_not_cached(self, admin):
        r = admin.get(f"{API}/enquiries")
        assert "no-store" in r.headers.get("Cache-Control", "")

    @admin_only
    def test_honeypot_submission_absent(self, admin):
        emails = [e.get("email") for e in admin.get(f"{API}/enquiries").json()["items"]]
        assert "bot@example.com" not in emails
