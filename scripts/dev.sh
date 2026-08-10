#!/usr/bin/env bash
# Run the whole stack locally: MongoDB check + FastAPI + React dev server.
#
#   ./scripts/dev.sh
#
# Ctrl-C stops both processes.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

VENV="$REPO/.venv"
BACKEND_PORT="${BACKEND_PORT:-8000}"

info() { printf '\033[1;33m▸ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# --- Preflight -------------------------------------------------------------
[ -f backend/.env ] || die "backend/.env is missing. Run: cp backend/.env.example backend/.env"

MONGO_URL="$(grep -E '^MONGO_URL=' backend/.env | cut -d= -f2- | tr -d '"' || true)"
case "$MONGO_URL" in
  mongodb://localhost*|mongodb://127.0.0.1*)
    nc -z localhost 27017 >/dev/null 2>&1 || die \
      "MongoDB isn't listening on 27017. Start it with: brew services start mongodb-community"
    ;;
esac

# --- Backend ---------------------------------------------------------------
if [ ! -d "$VENV" ]; then
  info "Creating virtualenv at .venv"
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q --upgrade pip
  "$VENV/bin/pip" install -q -r backend/requirements.txt
fi

info "Starting API on http://127.0.0.1:$BACKEND_PORT"
( cd backend && exec "$VENV/bin/uvicorn" server:app --reload --host 127.0.0.1 --port "$BACKEND_PORT" ) &
API_PID=$!

cleanup() { info "Shutting down"; kill "$API_PID" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

# --- Frontend --------------------------------------------------------------
[ -f frontend/.env ] || { info "Creating frontend/.env from example"; cp frontend/.env.example frontend/.env; }
[ -d frontend/node_modules ] || { info "Installing frontend dependencies"; ( cd frontend && yarn install ); }

info "Starting web on http://localhost:3000"
( cd frontend && exec yarn start )
