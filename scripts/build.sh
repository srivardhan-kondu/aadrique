#!/usr/bin/env bash
# Produce a production frontend build plus fresh sitemap/robots.
#
#   ./scripts/build.sh                       # same-origin build (nginx proxies /api)
#   ./scripts/build.sh https://api.aadrique.in   # separate API host
#
# Output: frontend/build/  — upload it, or point nginx's root at it.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

BACKEND_URL="${1-}"
SITE_URL="${SITE_URL:-https://www.aadrique.in}"

printf '\033[1;33m▸ Regenerating sitemap.xml and robots.txt\033[0m\n'
python3 scripts/generate_sitemap.py --base-url "$SITE_URL"

[ -d frontend/node_modules ] || ( cd frontend && yarn install --frozen-lockfile )

printf '\033[1;33m▸ Building frontend (API base: %s)\033[0m\n' "${BACKEND_URL:-same origin}"
cd frontend
REACT_APP_BACKEND_URL="$BACKEND_URL" \
REACT_APP_SITE_URL="$SITE_URL" \
CI=false \
GENERATE_SOURCEMAP=false \
  yarn build

printf '\033[1;32m✓ Build ready at frontend/build\033[0m\n'
