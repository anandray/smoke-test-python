#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "ERROR: dependencies not installed. Run ./build.sh first." >&2
  exit 1
fi
if [ -f backend/requirements.txt ] && [ ! -x backend/.venv/bin/uvicorn ]; then
  echo "ERROR: Python dependencies not installed. Run ./build.sh first." >&2
  exit 1
fi

echo "Starting services..."
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo "  Fake LLM:  http://localhost:3002"
echo ""
echo "Open http://localhost:3000 in your browser."
echo ""

npm run dev
