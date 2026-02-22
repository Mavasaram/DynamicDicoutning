#!/bin/bash
# ============================================================
# Payable Agent AI — Dynamic Discounting Platform
# Start script: launches backend (FastAPI) + frontend (Vite)
# ============================================================
set -e

# Load nvm / node if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
# Also add common node paths directly
export PATH="$HOME/.nvm/versions/node/v24.13.1/bin:$PATH"

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo ""
echo "=============================================="
echo "  🤖 Payable Agent AI — Dynamic Discounting"
echo "=============================================="
echo ""

# ---- Backend ----
echo "▶ Setting up Python backend…"
cd "$BACKEND"

if [ ! -d ".venv" ]; then
  echo "  Creating virtual environment…"
  python3 -m venv .venv
fi

source .venv/bin/activate
echo "  Installing Python dependencies…"
pip install -q -r requirements.txt

echo "  Starting FastAPI server on http://localhost:8000"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# ---- Frontend ----
echo ""
echo "▶ Setting up React frontend…"
cd "$FRONTEND"

if [ ! -d "node_modules" ]; then
  echo "  Installing npm dependencies (first run — may take a minute)…"
  npm install
fi

echo "  Starting Vite dev server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

echo ""
echo "=============================================="
echo "  ✅ Both servers are running!"
echo "  Frontend → http://localhost:3000"
echo "  API Docs  → http://localhost:8000/docs"
echo "  Press Ctrl+C to stop both servers."
echo "=============================================="
echo ""

# Wait for Ctrl+C then kill both
trap "echo ''; echo 'Stopping servers…'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
