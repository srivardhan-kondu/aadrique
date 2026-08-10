#!/usr/bin/env python3
"""Generate frontend/public/sitemap.xml and robots.txt from the CMS seed data.

Run after changing routes or seed content:

    python3 scripts/generate_sitemap.py
    python3 scripts/generate_sitemap.py --base-url https://www.aadrique.in
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "backend"))

from seed_data import CASE_STUDIES, INDUSTRIES, POSTS, SERVICES  # noqa: E402

PUBLIC = REPO / "frontend" / "public"

STATIC_ROUTES = [
    ("/", "1.0", "weekly"),
    ("/capabilities", "0.9", "monthly"),
    ("/industries", "0.9", "monthly"),
    ("/work", "0.8", "monthly"),
    ("/insights", "0.8", "weekly"),
    ("/about", "0.7", "monthly"),
    ("/faq", "0.6", "monthly"),
    ("/contact", "0.9", "monthly"),
    ("/privacy-policy", "0.3", "yearly"),
    ("/terms", "0.3", "yearly"),
]


def build_urls():
    urls = list(STATIC_ROUTES)
    urls += [(f"/capabilities/{s['slug']}", "0.8", "monthly") for s in SERVICES]
    urls += [(f"/industries/{s['slug']}", "0.7", "monthly") for s in INDUSTRIES]
    urls += [(f"/work/{s['slug']}", "0.7", "monthly") for s in CASE_STUDIES]
    urls += [(f"/insights/{p['slug']}", "0.6", "monthly") for p in POSTS]
    return urls


def last_modified() -> str:
    """Newest content date in the seed data.

    Deliberately not today's date — the generated file must depend only on the
    content, so regenerating it without content changes produces no diff (CI
    checks the committed sitemap is current).
    """
    dates = [
        str(p["date"])[:10]
        for p in POSTS
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(p.get("date", ""))[:10])
    ]
    return max(dates) if dates else "2026-01-01"


def render_sitemap(base_url: str) -> str:
    lastmod = last_modified()
    entries = "\n".join(
        "  <url>\n"
        f"    <loc>{base_url}{path}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{freq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
        for path, priority, freq in build_urls()
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{entries}\n"
        "</urlset>\n"
    )


def render_robots(base_url: str) -> str:
    return (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "# The API serves JSON only — nothing to index, and /api/enquiries is private.\n"
        "Disallow: /api/\n"
        "\n"
        f"Sitemap: {base_url}/sitemap.xml\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="https://www.aadrique.in")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")

    PUBLIC.mkdir(parents=True, exist_ok=True)
    (PUBLIC / "sitemap.xml").write_text(render_sitemap(base), encoding="utf-8")
    (PUBLIC / "robots.txt").write_text(render_robots(base), encoding="utf-8")
    print(f"Wrote {len(build_urls())} URLs to {PUBLIC / 'sitemap.xml'}")
    print(f"Wrote {PUBLIC / 'robots.txt'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
