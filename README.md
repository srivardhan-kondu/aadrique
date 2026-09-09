# AADRIQUE

Marketing site for AADRIQUE TECH PVT LTD — *Build. Transform. Scale.*

React (CRA + Tailwind + framer-motion) frontend, FastAPI backend, MongoDB for
CMS content and contact enquiries.

## Quick start

```bash
cp backend/.env.example backend/.env      # set ADMIN_TOKEN
cp frontend/.env.example frontend/.env
brew services start mongodb-community     # or run MongoDB however you like

./scripts/dev.sh                          # API :8000 · web :3000
```

## Layout

```
backend/          FastAPI app
  server.py         routes, email, rate limiting, seeding
  config.py         env config with fail-fast validation
  seed_data.py      all site content (bump SEED_VERSION to publish edits)
  tests/            API test suite
frontend/         React app (src/pages, src/components, src/lib)
deploy/           nginx.conf + systemd unit for a Docker-free VPS deploy
scripts/          dev.sh · build.sh · generate_sitemap.py
DEPLOYMENT.md     full deployment guide
```

## Common tasks

```bash
./scripts/dev.sh                                  # run everything locally
./scripts/build.sh                                # production build → frontend/build
python3 scripts/generate_sitemap.py               # refresh sitemap.xml + robots.txt

# tests (server must be running with a raised rate limit — see DEPLOYMENT.md §7)
API_BASE_URL=http://127.0.0.1:8000 ADMIN_TOKEN=... \
  .venv/bin/pytest backend/tests -c backend/pytest.ini
```

## API

| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | public |
| GET | `/api/services`, `/api/services/{slug}` | public |
| GET | `/api/industries`, `/api/industries/{slug}` | public |
| GET | `/api/case-studies`, `/api/case-studies/{slug}` | public |
| GET | `/api/products`, `/api/products/{slug}` | public |
| GET | `/api/posts`, `/api/posts/{slug}` | public |
| GET | `/api/faqs`, `/api/testimonials` | public |
| POST | `/api/contact` | public, rate limited, honeypot |
| GET | `/api/enquiries` | **`ADMIN_TOKEN` required** |

## Editing content

All copy lives in `backend/seed_data.py`. Edit it, bump `SEED_VERSION`, restart the
API — the change is re-seeded into MongoDB. Nothing is hardcoded in the frontend.

Deployment, configuration and operations: see **[DEPLOYMENT.md](DEPLOYMENT.md)**.
