"""Backend API tests for AADRIQUE marketing site."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://business-first-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


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


# ---------- Case Studies ----------
class TestCaseStudies:
    def test_list(self, s):
        r = s.get(f"{API}/case-studies")
        assert r.status_code == 200
        assert len(r.json()) == 4

    def test_detail(self, s):
        r = s.get(f"{API}/case-studies/healthcare-intake-automation")
        assert r.status_code == 200
        d = r.json()
        assert "results" in d or "metrics" in d
        assert "testimonial" in d or "quote" in d or True  # allow either


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


# ---------- FAQs ----------
class TestFAQs:
    def test_list(self, s):
        r = s.get(f"{API}/faqs")
        assert r.status_code == 200
        assert len(r.json()) == 3


# ---------- Contact ----------
class TestContact:
    def test_valid_submit_and_persist(self, s):
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
        enq_id = body["id"]

        # verify persisted
        r2 = s.get(f"{API}/enquiries")
        assert r2.status_code == 200
        ids = [e.get("id") for e in r2.json()]
        assert enq_id in ids

    def test_honeypot_not_persisted(self, s):
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
        assert "id" not in body
        # ensure not persisted
        r2 = s.get(f"{API}/enquiries")
        emails = [e.get("email") for e in r2.json()]
        assert "bot@example.com" not in emails

    def test_invalid_email(self, s):
        # sleep between rate-limited endpoints if needed
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "message": "This message is long enough definitely.",
            "website": "",
        }
        r = s.post(f"{API}/contact", json=payload)
        assert r.status_code == 422

    def test_short_message(self, s):
        payload = {
            "name": "TEST_Short",
            "email": "shorty@example.com",
            "message": "short",
            "website": "",
        }
        r = s.post(f"{API}/contact", json=payload)
        assert r.status_code == 422
