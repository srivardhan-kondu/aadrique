# AADRIQUE — Deployment Guide

No Docker required. The stack is three plain pieces:

| Piece | What it is | How it runs |
|---|---|---|
| **MongoDB** | Content + enquiry storage | System service, or MongoDB Atlas |
| **Backend** | FastAPI (`backend/server.py`) | `uvicorn` under systemd |
| **Frontend** | React build (static files) | nginx, or any static host |

The frontend is a static bundle — it does not need Node.js on the server, only to build.

---

## 1. Local development

```bash
cp backend/.env.example backend/.env      # fill in ADMIN_TOKEN
cp frontend/.env.example frontend/.env
brew services start mongodb-community     # macOS

./scripts/dev.sh                          # starts API :8000 + web :3000
```

`scripts/dev.sh` creates the virtualenv, installs dependencies, checks MongoDB is
listening, and runs both processes. Ctrl-C stops everything.

---

## 2. Configuration

Every variable lives in `backend/.env` (see `backend/.env.example`). The app
**refuses to start in production** if any of these are wrong:

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URL` | always | `mongodb://localhost:27017` or an Atlas SRV URI |
| `DB_NAME` | always | e.g. `aadrique` |
| `ENVIRONMENT` | always | set to `production` on the server |
| `CORS_ORIGINS` | production | exact origins, comma-separated. `*` is rejected |
| `ADMIN_TOKEN` | production | ≥24 chars; guards the enquiry inbox |
| `EMERGENT_EMAIL_KEY`, `OWNER_EMAIL` | optional | without them enquiries are stored but no email is sent |
| `TRUST_PROXY` | optional | `true` **only** behind a proxy you control |

Generate the admin token:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"
```

> **Why `ADMIN_TOKEN` is mandatory:** `GET /api/enquiries` returns every enquiry
> ever submitted — names, emails, phone numbers, company details. It used to be
> completely open. Without a token set, the endpoint is disabled entirely.

Frontend variables are baked in **at build time** (Create React App behaviour).
Changing `REACT_APP_BACKEND_URL` requires a rebuild — setting it on the server does
nothing.

---

## 3. Single-server deploy (VPS: Hetzner, DigitalOcean, EC2, Lightsail)

Assumes Ubuntu with the repo at `/srv/aadrique`.

### 3.1 System packages

```bash
sudo apt update
sudo apt install -y python3-venv nginx
# MongoDB: follow https://www.mongodb.com/docs/manual/administration/install-on-linux/
sudo systemctl enable --now mongod
```

### 3.2 Backend

```bash
cd /srv/aadrique
python3 -m venv .venv
.venv/bin/pip install -r backend/requirements.txt

cp backend/.env.example backend/.env
# edit: ENVIRONMENT=production, CORS_ORIGINS=https://www.aadrique.in, ADMIN_TOKEN=...
sudo chown www-data:www-data backend/.env && sudo chmod 600 backend/.env

sudo cp deploy/aadrique-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now aadrique-api
curl -s localhost:8000/api/health
```

### 3.3 Frontend

Build on any machine with Node 20 (your laptop is fine), then copy the output up:

```bash
./scripts/build.sh                    # same-origin build; nginx proxies /api
rsync -av frontend/build/ user@server:/var/www/aadrique/
```

### 3.4 nginx + TLS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/aadrique
sudo ln -s /etc/nginx/sites-available/aadrique /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d aadrique.in -d www.aadrique.in
```

nginx serves the static build and forwards `/api` to uvicorn on `127.0.0.1:8000`,
so the browser only ever sees one origin — no CORS preflight at all.

---

## 4. Render (API) + Vercel (site) + Atlas (database)

Three services, deployed in this order. Order matters: Vercel needs the Render URL
at **build** time, and Render needs the Vercel domain for CORS.

### Step 1 — MongoDB Atlas

1. <https://cloud.mongodb.com> → **Create** a free M0 cluster.
2. **Database Access** → Add New Database User (username + strong password). Save them.
3. **Network Access** → Add IP Address → **Allow access from anywhere (`0.0.0.0/0`)**.
   Render's free plan has no static outbound IP, so an allowlist is not workable;
   the database user password is what protects the cluster. Keep it strong.
4. **Connect → Drivers** → copy the SRV string:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   Substitute the real password (URL-encode any special characters).

### Step 2 — Render (backend API)

1. <https://dashboard.render.com> → **New → Blueprint** → connect this repo.
   Render reads `render.yaml` and configures the service automatically.
2. It will prompt for the variables not stored in git:
   - `MONGO_URL` → the Atlas SRV string from step 1
   - `CORS_ORIGINS` → leave as a placeholder for now, corrected in step 4
   - `OWNER_EMAIL` / `EMERGENT_EMAIL_KEY` → optional; blank disables email
3. Deploy. First build takes a few minutes.
4. Copy the service URL, e.g. `https://aadrique-api.onrender.com`.
5. Verify: `curl https://aadrique-api.onrender.com/api/health` → `{"status":"ok","database":"ok",...}`

   If it says `"database":"unavailable"`, the Atlas URL, password or Network Access
   setting is wrong — check the Render logs.
6. **Environment → `ADMIN_TOKEN`** — Render generated this. Copy and store it; it is
   the credential for reading enquiries.

> **Free plan caveat:** the service sleeps after ~15 minutes idle, so the first
> request afterwards takes ~50 seconds. Fine while launching; upgrade to the paid
> Starter plan before you send traffic to the site.

*Prefer not to use the Blueprint?* New → Web Service, then set Root Directory `backend`,
Build `pip install -r requirements.txt`, Start
`uvicorn server:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips '*'`,
Health Check Path `/api/health`, and add every variable from §2 by hand.

### Step 3 — Vercel (frontend)

1. <https://vercel.com/new> → import this repo.
2. **Root Directory → `frontend`** (this is the setting people miss — without it the
   build fails). `frontend/vercel.json` supplies the rest.
3. **Environment Variables** — add before the first build:

   | Name | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | `https://aadrique-api.onrender.com` (no trailing slash, no `/api`) |
   | `REACT_APP_SITE_URL` | `https://www.aadrique.in` |
   | `CI` | `false` |

4. **Deploy**, then open the generated URL.

> CRA inlines `REACT_APP_*` at **build** time. Changing either variable later requires
> a **redeploy** — editing it in the dashboard alone changes nothing.

### Step 4 — Connect them (do not skip)

Back in **Render → Environment**, set `CORS_ORIGINS` to your real frontend origins,
comma-separated, no trailing slashes:

```
https://www.aadrique.in,https://aadrique.in,https://aadrique.vercel.app
```

Save — Render redeploys. Until this matches, the site loads but every API call fails
with a CORS error and the pages stay empty.

### Step 5 — Custom domain

1. **Vercel → Settings → Domains** → add `aadrique.in` and `www.aadrique.in`, then
   point your registrar's DNS at the records Vercel shows. TLS is automatic.
2. Add the final domains to `CORS_ORIGINS` on Render (step 4) if they aren't there.

### Step 6 — Verify the deploy

```bash
curl -s https://aadrique-api.onrender.com/api/health
curl -s https://www.aadrique.in/ -o /dev/null -w '%{http_code}\n'                 # 200
curl -s https://www.aadrique.in/work/crowd-headcount-monitoring -o /dev/null -w '%{http_code}\n'  # 200, SPA fallback
curl -s -o /dev/null -w '%{http_code}\n' https://aadrique-api.onrender.com/api/enquiries          # 401
```

Then open the site and submit the contact form — the enquiry should appear in:

```bash
curl -H "X-Admin-Token: YOUR_ADMIN_TOKEN" https://aadrique-api.onrender.com/api/enquiries
```

### Common failures

| Symptom | Cause |
|---|---|
| Pages load but all content is empty | `CORS_ORIGINS` on Render doesn't match the Vercel domain exactly |
| Requests go to `undefined/api/...` | `REACT_APP_BACKEND_URL` wasn't set **before** the Vercel build |
| Vercel build fails immediately | Root Directory not set to `frontend` |
| `"database":"unavailable"` | Atlas Network Access or the password in `MONGO_URL` |
| API refuses to start | Read the Render log — the config validator names the exact missing variable |
| First request takes ~50s | Render free plan cold start |

---

## 5. Content updates

Content is seeded from `backend/seed_data.py` into MongoDB on startup.

To publish an edit: change the content **and bump `SEED_VERSION`**, then restart the
API. The seed is a no-op unless the version changed, so restarts are cheap and it's
safe to run multiple workers — a lock ensures only one seeds.

After changing routes or adding content, regenerate the sitemap:

```bash
python3 scripts/generate_sitemap.py --base-url https://www.aadrique.in
```

---

## 6. Reading enquiries

Enquiries are stored in the `enquiries` collection and emailed to `OWNER_EMAIL`.
To read them over the API:

```bash
curl -H "X-Admin-Token: $ADMIN_TOKEN" https://www.aadrique.in/api/enquiries
curl -H "X-Admin-Token: $ADMIN_TOKEN" "https://www.aadrique.in/api/enquiries?limit=20&skip=20"
```

Treat the token like a password — anyone holding it can read all customer data.

---

## 7. Verifying a deploy

```bash
curl -s https://www.aadrique.in/api/health              # {"status":"ok","database":"ok",...}
curl -s https://www.aadrique.in/api/services | head -c 200
curl -o /dev/null -w '%{http_code}\n' https://www.aadrique.in/capabilities/ai-consulting   # 200 (SPA fallback)
curl -o /dev/null -w '%{http_code}\n' https://www.aadrique.in/api/enquiries                # 401
curl -s https://www.aadrique.in/robots.txt
```

Run the API test suite against a running server:

```bash
cd backend && CONTACT_RATE_LIMIT=1000 ADMIN_TOKEN=test-token-long-enough-for-validation \
  ../.venv/bin/uvicorn server:app --port 8000 &
API_BASE_URL=http://127.0.0.1:8000 ADMIN_TOKEN=test-token-long-enough-for-validation \
  .venv/bin/pytest backend/tests -c backend/pytest.ini
```

`CONTACT_RATE_LIMIT` must be raised for the run, or the contact tests trip the
5-per-minute limiter.

---

## 8. Operations

```bash
sudo systemctl restart aadrique-api     # restart API
journalctl -u aadrique-api -f           # follow logs
sudo systemctl reload nginx             # after an nginx config change
```

**Backups** — the enquiry data is the only thing not reproducible from source:

```bash
mongodump --uri="$MONGO_URL" --db=aadrique --collection=enquiries --out=/backups/$(date +%F)
```

### Known limits

- **Rate limiting is per-process and in-memory.** With multiple uvicorn workers each
  keeps its own counter, so the effective limit is `CONTACT_RATE_LIMIT × workers`.
  Fine for a marketing site; move to Redis if it ever matters.
- **Email delivery to `info@aadrique.in`** stays blocked until that mailbox is active
  in Google Workspace. No code change is needed once it is — the auto-reply to the
  enquirer already delivers.
- **CRA build-time env vars** mean the frontend must be rebuilt to change API host.
