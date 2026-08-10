# AADRIQUE Website — PRD

## Original Problem Statement
Build the flagship marketing website for AADRIQUE TECH PVT LTD — a premium B2B Technology Transformation Company (tagline: Build. Transform. Scale., www.aadrique.in, info@aadrique.in, +91 96528 86208). Positioning: "We don't push AI into businesses. We first understand the business, identify opportunities, and recommend practical technology and AI solutions that create measurable business value." Award-worthy (Awwwards-level) design: kinetic hero with masked line-by-line reveal, numbered manifesto chapters, editorial marquee, lenis smooth scrolling, framer-motion, parallax hero moment, dark/light modes.

## User Choices
- Stack adapted to React + FastAPI + MongoDB (originally Next.js/Sanity/Vercel brief)
- Full sitemap in v1 (all detail pages)
- Content served from MongoDB via API (seeded)
- Contact form → DB only (no email delivery yet)
- Skipped for MVP: reCAPTCHA v3, GA4, cookie consent (honeypot instead)

## Brand System (from supplied brand sheets)
- Orange #FA942C, Black #000000, White #FFFFFF, neutrals #1A1A1A/#4D4D4D, cream #F6F0DE
- Typography: Space Grotesk (headings/labels), Plus Jakarta Sans (body)
- Motion signature: thin ~60° diagonal orange lines / hatch pattern
- Monogram asset: https://customer-assets-gfyr7b9c.emergentagent.net/job_182f1d8e-7a96-41f4-a6db-1239d48a0246/artifacts/76fdim1a_AADRIQUE_monogram_final.webp

## Architecture
- Backend: FastAPI (`/app/backend/server.py`), content seeded from `/app/backend/seed_data.py` (SEED_VERSION gate, reseeds on bump)
- API: GET /api/services(+/{slug}), /api/industries(+/{slug}), /api/case-studies(+/{slug}), /api/posts(+/{slug}), /api/faqs, /api/testimonials; POST /api/contact (honeypot + 5/min/IP rate limit); GET /api/enquiries
- Frontend: React Router SPA. Layout (`components/layout/Layout.jsx`) with Lenis smooth scroll, route transitions (AnimatePresence), route progress bar, loading screen once/session (sessionStorage 'aadrique-intro')
- Theme: CSS variables (--bg/--surface/--line/--ink/--accent), dark default + cream light mode, system-aware + manual toggle (localStorage 'aad-theme')
- Design system tokens in `index.css` + tailwind extensions (`font-grotesk`, `bg-surface`, `text-accentText`, `.hatch`, `.text-outline`, `.label-tech`, `.marquee-track`)
- SEO: `components/Seo.jsx` sets title/description/JSON-LD per route (Organization default, Service, Article, FAQPage schemas)

## Implemented (10 June 2026) — MVP complete, tested 100% backend + frontend
- Home: kinetic hero (line reveal + monogram parallax + hatch), trust metrics strip ([Placeholder] marked), editorial marquee, 4-step numbered approach manifesto, 11-capability grid + CTA cell, industries rows, 3 case-study teasers with metrics, why-AADRIQUE, insights preview, orange CTA band
- About: origin, philosophy quote, mission/vision, 5 values, engagement model, team ([Placeholder]), company facts
- Capabilities index + 11 service detail pages (problem → what we do → process → deliverables → stack → related work → FAQ → CTA)
- Industries index + 6 detail pages (challenges/solutions/outcomes/related case study)
- Work: filterable grid (sector) + 4 case study detail pages (challenge/approach/solution/results/technologies/testimonial — all [Placeholder]-marked)
- Insights: category filter + search + 5 articles with detail (reading time, share-to-clipboard, related, Article JSON-LD)
- FAQ: 3 category groups, accordion, FAQPage JSON-LD
- Contact: RHF+Zod form (name/company/role/email/phone/service select/budget radios/message), honeypot, sonner toasts, direct contact card
- Legal: Privacy Policy + Terms with last-updated dates
- data-testid coverage on all interactive elements

## Email Delivery (10 June 2026)
- Emergent-managed Resend via integration proxy (EMAIL_BASE_URL constant, X-Email-Key header, EMERGENT_EMAIL_KEY/EMAIL_FROM_NAME/OWNER_EMAIL in backend/.env)
- On POST /api/contact: FastAPI BackgroundTasks send (1) owner notification to OWNER_EMAIL (info@aadrique.in) with reply-to=enquirer, (2) branded auto-reply to enquirer with reply-to=owner. Email failure never blocks form submission (logged only)
- VERIFIED: auto-reply delivers (202). Owner notification currently blocked by provider deliverability check — info@aadrique.in mailbox not yet active in Google Workspace; user confirmed they will activate it (will work automatically once live)
- Gotcha: asyncio.create_task fire-and-forget was unreliable here; BackgroundTasks is the working pattern

## Content Cleanup (10 June 2026)
- All "[Placeholder]" markers removed site-wide. Hero trust strip now uses verifiable facts (11 capabilities, 6 industry practices, 1-day response, 100% IP ownership). Case studies (illustrative:true in seed) show "Illustrative engagement" badges + disclosure note on Work/detail pages; testimonial quotes de-prefixed. FAQ/blog performance figures reframed as industry benchmarks. Team section: Ravi Kumar (Managing Director, from user's brand sheets) + two principle cells; fake team members removed. Contact office placeholder removed. Terms §4 updated to "Illustrative content". SEED_VERSION=5.

## Backlog / Remaining
### P0
- Real verified content from user when available: actual metrics, named clients/case studies, real testimonials, team photos, office address
- User to activate info@aadrique.in mailbox in Google Workspace (owner notifications currently 422-blocked)
### P1
- Admin view for enquiries (currently GET /api/enquiries JSON only)
- GA4 + cookie consent banner (needs GA4 property from user)
- reCAPTCHA v3 (needs keys)
### P2
- Consultation scheduler embed (Calendly or similar)
- Content admin panel (edit services/posts in DB)
- sitemap.xml/robots.txt (limited value in SPA; matters at deploy)
- OG image generation

## Notes
- Never use npm; yarn only. All routes /api-prefixed. Env values from .env only.
- Test suite: /app/backend/tests/backend_test.py (14 pytest cases, all pass). Report: /app/test_reports/iteration_1.json
- No auth in app; test_credentials.md not applicable.
